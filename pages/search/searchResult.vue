<template>
	<view class="searchResult">
		<view :class="[majorList[0] ? 'placeFixed' : 'fixed-place']">
			<view class="fixed">
				<!-- 搜索 -->
				<view class="header">
					<view class="search" @click="backSearchLink">
						<text class="iconfont icon-search"></text>
						<input class="input" disabled="true" type="text" :value="inputVal" placeholder="搜索" placeholder-style="color:#fff;"/>
						<view class="cancel" v-if="inputVal" @click="cancelInputValClick">×</view>
					</view>
					<view class="cancelWord" @click="goBack">取消</view>
				</view>
				<!-- 筛选 -->
				<!-- 条件选择 -->
				<view class="condition">
					<view class="cond-left">
					<view 
							class="item u-skeleton-rect" 
							v-for="(item,index) of condLeftList" 
							:key='index' 
							@click="condLeftItemClick(item.type)"
							:style="{'color':currentType === item.type ? '#12ada9' : ''}"
						>{{item.title}}</view>
					</view>
					<view class="cond-right">
						<view class="item u-skeleton-rect" @click="chooseAddress">{{selectedCity && selectedCity.name ? selectedCity.name : '请选择地址'}}</view>
						<view class="item u-skeleton-rect" @click="conditionClickOrCancel" :style="{'color':conditionBool || (totalLength > 0) ? '#82cecb' : ''}">筛选{{totalLength ? '·' + totalLength : ''}}</view>
					</view>
					<view class="conditionMask-fixed-mask" v-if="conditionBool" @touchmove.stop.prevent='touchstartPage'></view>
					<view class="conditionMask-fixed" v-if="conditionBool" @touchmove.stop.prevent='touchstartPage'>
						<view class="title">学校层次</view>
						<view class="content">
							<view 
								v-for="(item,index) of college_level_list" 
								:key='index' @click="college_level_click(item.value)" 
								:class="['item',college_level === item.value ? 'selectedItem' : '']"
							>{{item.title}}</view>
						</view>
						<view class="title">办学性质</view>
						<view class="content">
							<view :class="['item',!propertySelectList[0] ? 'selectedItem' : '']" @click="conditionAll(1)">不限</view>
							<view 
								v-for="(item,index) of propertyList" 
								:key='index' @click="propertyItemClick(item.value)" 
								:class="['item',ItemSelect(1,item.value) ? 'selectedItem' : '']"
							>{{item.title}}</view>
						</view>
						<view class="title">学校类型</view>
						<view class="content">
							<view :class="['item',!schoolTypeSelectList[0] ? 'selectedItem' : '']" @click="conditionAll(2)">不限</view>
							<view 
								:class="['item',ItemSelect(2,item) ? 'selectedItem' : '']" 
								v-for="(item,index) of schoolType" 
								:key='index'
								@click="schoolTypeItemClick(item)"
							>{{item}}</view>
						</view>
						<view class="button">
							<view class="item reset" @click="conditionReset">重置</view>
							<view class="item" @click="chooseItem">确定</view>
						</view>
						<view class="iconfont icon-guanbi2" @click="conditionClickOrCancel"></view>
					</view>
				</view>
				<!-- 专业分类 -->
				<scroll-view scroll-x="true" class="scrollList" v-if="majorList[0]">
					<view class="content" v-if="majorList[0]">
						<view class="item" v-for="(item,index) of majorList" :key='index'>
							{{item.name}}
							<view class="iconfont icon-del" @click="deleteItem(item.id)"></view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<school-list ref='schoolList' :list='schoolList'></school-list>
		<view class="nullData" v-if="schoolList && !schoolList[0]" style="text-align: center;margin-top: 100rpx;">
			没有数据啦
		</view>
		<!-- 地址选择器 -->
		<simple-address ref="simpleAddress" :areaBool='false' :pickerValueDefault="cityPickerValueDefault" @onConfirm="addressConfirm"
		 themeColor="#007AFF"></simple-address>
	</view>
</template>

<script>
	import schoolList from '@/components/school-list'
	import api from '@/common/api.js'
	import { schoolType,checkAuthSetting,hideMenuItems } from '@/common/utils.js'
	//#ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import simpleAddress from '@/components/simple-address/simple-address.nvue';
	import { mapState } from 'vuex'
	export default{
		components:{
			schoolList
		},
		data(){
			return {
				indexChangeTabValue:'',
				is_recommend:null,
				schoolList: null,
				inputVal:'',
				majorList:[],
				conditionBool: false,
				schoolType: schoolType(),
				cityPickerValueDefault: [0, 0, 1],
				selectedCity:{
					name:'',
					code:''
				},
				locationRes: null,
				currentType:1,
				condLeftList:[
					{
					type:1,
					title:'综合'
					},
					{
					type:2,
					title:'附近'
					},
				],
				college_level:'',
				college_level_list:[
					{
						title:'不限',
						value:''
					},
					{
						title:'中专',
						value:'secondary'
					},
					{
						title:'大专',
						value:'junior'
					},
					{
						title:'本科',
						value:'undergraduate'
					},
					{
						title:'研究生',
						value:'master'
					},
					{
						title:'早教托管',
						value:'early'
					},
				],
				propertyList: [{
						title: '公办教育',
						value: 'pubilc'
					},
					{
						title: '民办教育',
						value: 'private'
					},
					{
						title: '联办教育',
						value: 'unite'
					},
					{
						title: '国际私立',
						value: 'international_private'
					},
					{
						title: '国际公立',
						value: 'international_public'
					}
				],
				totalLength:0,
				propertySelectList: [],
				schoolTypeSelectList:[],
				propertySelectList_value:'',
				schoolTypeSelectList_value:'',
				current_page: 1,
				last_page: 0,
			}
		},
		computed:{
			...mapState(['userInfo','objToken','roles'])
		},
		onLoad(options){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			if(options.inputVal){
				this.inputVal = options.inputVal
			}
			if(options.majorList){
				let majorList = JSON.parse(decodeURIComponent(options.majorList))
				this.majorList = majorList
			}
			if(options.is_recommend){
				this.is_recommend = 1
			}
			if(options.indexChangeTabValue){
				this.indexChangeTabValue = options.indexChangeTabValue
			}
			this.getSchoolList()
		},
		methods:{
			//综合 附近
			condLeftItemClick(type){
				this.currentType = type
				if(type === 1){
					this.locationRes = null
					this.reset()
				}else if(type === 2){
					
					// #ifdef H5
						this.getLocation().then(() => {
							this.reset()
						}).catch(() => {
							this.reset()
						})
					// #endif
					
					// #ifdef MP-WEIXIN
					    this.get_MP_WEIXIN_location()
					// #endif
					
					// #ifdef APP-PLUS
						this.get_APP_PLUS_location()
					// #endif
				}
			},
			//地址筛选
			chooseAddress() {
				this.$refs.simpleAddress.open();
			},
			//确认选择地址
			addressConfirm(e) {
				this.cityPickerValueDefault = e.value //保留当前选择
				this.selectedCity = {
					name:e.labelArr[1],
					code:e.cityCode,
					value:e.value
				}
				this.currentType = 1
				this.locationRes = null
				this.reset()
			},
			//选中状态
			ItemSelect(type,value){
				if(type === 1){
					return this.propertySelectList.some(item => item === value)
				}else if(type === 2){
					return this.schoolTypeSelectList.some(item => item === value)
				}
			},
			//学校性质
			propertyItemClick(value) {
				let bool = this.propertySelectList.some(item => item === value)
				if (bool) {
					let index = this.propertySelectList.findIndex(item => item === value)
					if (index !== -1) this.propertySelectList.splice(index, 1)
				} else {
					this.propertySelectList.push(value)
				}
				console.log(this.propertySelectList,'学校性质')
			},
			//学校类型
			schoolTypeItemClick(value){
				let bool = this.schoolTypeSelectList.some(item => item === value)
				if (bool) {
					let index = this.schoolTypeSelectList.findIndex(item => item === value)
					if (index !== -1) this.schoolTypeSelectList.splice(index, 1)
				} else {
					this.schoolTypeSelectList.push(value)
				}
				console.log(this.schoolTypeSelectList,'学校类型')
			},
			//学校层次
			college_level_click(value){
				this.college_level = value
			},
			//确定该筛选
			chooseItem(){
				if(this.propertySelectList[0]){
					this.propertySelectList_value = this.propertySelectList.join(',')
				}else{
					this.propertySelectList_value = ''
				}
				if(this.schoolTypeSelectList[0]){
					this.schoolTypeSelectList_value = this.schoolTypeSelectList.join(',')
				}else{
					this.schoolTypeSelectList_value = ''
				}
				this.reset()
				this.conditionLength(this.propertySelectList,this.schoolTypeSelectList)
				this.conditionClickOrCancel()
			},
			//选中全部时
			conditionAll(type){
				if(type === 1){
					this.propertySelectList = []
					this.propertySelectList_value = ''
				}else if(type === 2){
					this.schoolTypeSelectList = []
					this.schoolTypeSelectList_value = ''
				}
			},
			//计算长度
			conditionLength(property,schoolType){
				if(this.college_level){
					this.totalLength = property.length + schoolType.length + 1
				}else{
					this.totalLength = property.length + schoolType.length
				}
			},
			//取消
			conditionClickOrCancel(){
				this.conditionBool = !this.conditionBool
			},
			//重置
			conditionReset() {
				this.propertySelectList = []
				this.propertySelectList_value = ''
				this.schoolTypeSelectList = []
				this.schoolTypeSelectList_value = ''
				this.college_level = ''
			},
			reset(){
				this.current_page = 1
				this.last_page = 0
				this.schoolList = null
				this.getSchoolList()
			},
			//学校列表数据
			getSchoolList() {
				uni.showLoading({
					title: '加载中'
				})
				let list = this.schoolList || []
				//初始化
				let params = {
					page: this.current_page,
				}
				//获取用户位置（经纬度）
				if (this.locationRes && this.locationRes.longitude) {
					params.geo_distance = 100
					params.lon = this.locationRes.longitude
					params.lat = this.locationRes.latitude
				}
				//学历层次
				if (this.college_level) {
					params.college_level = this.college_level
				}
				//办学性质
				if(this.propertySelectList_value){
					params.properties = this.propertySelectList_value
				}
				//学校类型
				if(this.schoolTypeSelectList_value){
					params.college_classes = this.schoolTypeSelectList_value
				}
				//选择地址城市
				if(this.selectedCity && this.selectedCity.code){
					params.city = this.selectedCity.code
				}
				if(this.is_recommend){
					params.is_recommend = this.is_recommend
				}
				//搜索文字
				if(this.inputVal){
					params.search = this.inputVal
				}
				if(this.indexChangeTabValue){
					params.type = this.indexChangeTabValue
				}
				this.$http({
					api: api.getSchoolList,
					method: 'GET',
					params: params
				}).then(res => {
					this.schoolList = list.concat(res.data.data || [])
					this.current_page = res.data.meta.current_page
					this.last_page = res.data.meta.last_page
					this.skeletonLoading = false
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				})
			},
			//app端获取经纬度 并转换成地址
			get_APP_PLUS_location(){
				uni.getLocation({
				    success: res => {
						this.locationRes = {
							longitude:res.longitude,
							latitude:res.latitude
						}
						uni.request({
							header:{
								"Content-Type": "application/text"
							},
							url:'https://apis.map.qq.com/ws/geocoder/v1?location='+res.latitude+','+res.longitude+'&key=HIBBZ-OJZ3I-YB2GQ-55VMG-F44K3-ZYBHI',
							success:e => {
								let info = e.data.result.ad_info
								this.selectedCity = {
									name:info.city
								}
								this.reset()
							 }
						})
				    },
					fail:err => {
						this.reset()
					}
				});
			},
			//获取微信小程序经纬度 并转换成地址
			get_MP_WEIXIN_location(){
				checkAuthSetting().then(() => {
					uni.getLocation({
					    success: res => {
							this.locationRes = {
								longitude:res.longitude,
								latitude:res.latitude
							}
							uni.request({
								header:{
									"Content-Type": "application/text"
								},
								url:'https://apis.map.qq.com/ws/geocoder/v1?location='+res.latitude+','+res.longitude+'&key=DNTBZ-K6SH4-YK2UA-XNK6V-VRG2T-IEBJ2',
								success:e => {
									let info = e.data.result.ad_info
									this.selectedCity = {
										name:info.city
									}
									this.reset()
								 }
							})
					    }
					});
				})
			},
			//获取当前位置信息 经纬度 并进行 逆地址解析 成城市名
			getLocation() {
					return new Promise((resolve,reject) => {
						let url = location.href.split('#')[0]
						var that = this
						that.$http({
							api: api.configuration,
							method: 'POST',
							params:{
								url: url
							}
						}).then(res => {
						    jweixin.config({
						    	debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						    	appId: res.data.appId, // 公众号的唯一标识
						    	timestamp: res.data.timestamp, // 生成签名的时间戳
						    	nonceStr: res.data.nonceStr, // 生成签名的随机串
						    	signature: res.data.signature, // 签名，
						    	url: res.data.url,
						    	jsApiList: ['getLocation']
						    });
						    jweixin.ready(function() {
						    	jweixin.getLocation({
						    		type: 'wgs84',
						    		success: function(locationRes) {
						    			that.locationRes = locationRes
						    			that.$jsonp('https://apis.map.qq.com/ws/geocoder/v1?coord_type=5&get_poi=1&output=jsonp&poi_options=page_size=1;page_index=1',{
						    				  key: 'DNTBZ-K6SH4-YK2UA-XNK6V-VRG2T-IEBJ2',
						    				  location: locationRes.latitude + ',' + locationRes.longitude
						    				}).then(e => {
						    					let info = e.result.ad_info
						    					that.selectedCity = {
						    						name:info.city
						    					} 
						    					resolve()
						    				})
						    				.catch(err => {
						    					reject()
						    				})
						    		},
									fail:function(){
										reject()
									}
						    	});
						    });
							jweixin.error(function(err){
								reject()
							});
						}).catch(err => {
								reject()	
						})
					})
			},
			//专业删除
			deleteItem(id){
				let index = this.majorList.findIndex(item => item.id === id)
				if(index !== -1){
					this.majorList.splice(index,1)
					this.reset()
				}
			},
			//取消文字输入查询
			cancelInputValClick(){
				this.inputVal = ''
				this.reset()
			},
			goBack(){
				uni.navigateBack()
			},
			backSearchLink(){
				if(!this.inputVal){
					uni.navigateBack()
				}
			}
		},
		onPullDownRefresh() {
			if (this.schoolList) {
				this.current_page = 1
				this.last_page = 0
				this.schoolList = null
				this.getSchoolList()
			}
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			if (this.current_page < this.last_page) {
				this.current_page = this.current_page + 1
				this.getSchoolList()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.searchResult{
		.placeFixed{
			height: 220rpx;
		}
		.fixed-place{
			height: 160rpx;
		}
		.fixed{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 1;
			background: #fff;
		}
		//头部
		.header{
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			background: $theme-color;
			height: 90rpx;
			.search{
				flex: 1;
				display: flex;
				align-items: center;
				border-radius: 10rpx;
				background: #82cecb;
				overflow: hidden;
				height: 60rpx;
				line-height: 60rpx;
				color: #fff;
				font-size: 26rpx;
				position: relative;
				.icon-search{
					margin: 0 28rpx;
				}
				.input{
					flex: 1;
					color: #fff;
				}
				.cancel {
					position: absolute;
					right: 10rpx;
					top: 50%;
					transform: translateY(-50%);
					font-size: 30rpx;
					background: rgba(0, 0, 0, .5);
					color: #fff;
					border-radius: 50%;
					width: 30rpx;
					height: 30rpx;
					line-height: 30rpx;
					text-align: center;
					z-index: 2;
				}
			}
			.cancelWord{
				color: #fff;
				margin-left: 20rpx;
			}
		}
		//头部
		.scrollList{
			white-space: nowrap;
			height: 60rpx;
			padding: 0 10rpx;
			box-sizing: border-box;
			.content{
				height: 60rpx;
				display: flex;
				align-items: center;
				.item{
					display: inline-block;
					margin: auto 10rpx;
					background:#82cecb;
					color: #fff;
					border-radius: 10rpx;
					padding: 6rpx 20rpx;
					font-size: 26rpx;
					position: relative;
					.icon-del{
						position: absolute;
						top: -8rpx;
						right: -8rpx;
						color: #e5e5e5;
					}
				}
			}
		}
		//筛选
		//条件选择
		.condition {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #fff;
			margin-bottom: 10rpx;
			padding: 0 20rpx;
			height: 80rpx;
			line-height: 80rpx;

			.conditionMask-fixed {
				position: absolute;
				top: 80rpx;
				left: 0;
				width: 100%;
				height: 1000rpx;
				background: #f4f4f4;
				z-index: 3;
				padding:0 20rpx;
				.title {
					font-weight: bold;
				}

				.content {
					display: flex;
					flex-wrap: wrap;
					padding: 0 10rpx;
					.item {
						margin: 0 30rpx 0rpx 0;
						height: 60rpx;
					}
				}

				.button {
					position: fixed;
					width: 100%;
					bottom: 200rpx;
					display: flex;
					justify-content: space-around;
					margin-top: 30rpx;

					.item {
						width: 200rpx;
						background: $theme-color;
						color: #fff;
						text-align: center;
						margin: 0 auto;
						border-radius: 20rpx;
					}
					.reset{
						color: #fff;
						background: #828387;
					}
				}
				.selectedItem{
					color: $theme-color;
				}
				.icon-guanbi2{
					position: fixed;
					top: 200rpx;
					right: 30rpx;
					font-size: 30rpx;
					font-weight: bold;
				}
			}

			.conditionMask-fixed-mask {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: transparent;
				z-index: 2;
			}

			.cond-left {
				display: flex;

				.item {
					margin-right: 20rpx;
				}
			}

			.cond-right {
				display: flex;

				.item {
					margin-left: 20rpx;
				}
			}
		}
	}
</style>
