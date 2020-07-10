<template>
	<view class="category">
		<view class="" v-if="weapp_check_bool">
			<view class="topPart">
				<!-- 搜索 -->
				<view class="header">
					<view class="search" @click="searchLink">
						<text class="iconfont icon-search"></text>
						<text class="input">搜索</text>
					</view>
				</view>
				<!-- tab页签 -->
				<view class="tab">
					<view :class="['item',current === item.value ? 'current' : '']" v-for="(item,index) of tabList" :key="index" @click="tabClick(item.value)">
						<view :class="['icon','iconfont',item.icon]"></view>
						<view class="">
							<view class="title">{{item.title}}</view>
							<!-- <view v-if="index === 1">({{educationObj[educationValue]}})</view> -->
						</view>
						<!-- <view v-if="index === 1" :class="['majorChoose','iconfont',showLevelBool ? 'icon-jiantoushang' : 'icon-jiantouxia']" @click="showLevel"></view> -->
					</view>
					<!-- <view class="level-bg" v-if="showLevelBool" @click="educationClick()"></view>
					<view class="levelBox" v-if="showLevelBool">
						<view class="level-item" v-for="(item,index) of educationList" :key='index' @click="educationClick(item.value)">
							{{item.title}}
						</view>
					</view> -->
				</view>
			</view>
			<!-- 视图层 -->
			<view class="viewPort">
				<!-- 左边 -->
				<scroll-view class="scroll-left" scroll-y="true" :style="{'height':scrollViewHeight + 'px'}">
					<view class="provinceList" v-if="current === 'normal' || current === 'adult'">
						<view 
							v-for="(item,index) of provinceList" 
							:key='index' 
							:class="['item',provinceValue === item.province ? 'leftActive' :'']" 
							@click="provinceItemClick(item.province)"
						>
							<view class="name">{{item.name}}</view>
							<view :class="['iconfont',provinceValue === item.province ? 'icon-duigou' : '']"></view>
						</view>
					</view>
					<view class="provinceList" v-if="current === 'tutoring'">
						<view 
							v-for="(item,index) of cityList" 
							:key='index' 
							:class="['item',cityValue === item.city ? 'leftActive' :'']" 
							@click="provinceItemClick(item.city)"
						>
							<view class="name">{{item.name}}</view>
							<view :class="['iconfont',cityValue === item.city ? 'icon-duigou' : '']"></view>
						</view>
					</view>
				</scroll-view>
				<!-- 右边 -->
				<scroll-view class="scroll-right" scroll-y="true" :style="{'height':scrollViewHeight + 'px'}" :scroll-top='scrollTop' @scroll="rightScroll">
						<view class="provinceSchoolList">
							<view :class="['item']" v-for="(item,index) of provinceSchoolList" :key='index' v-if="provinceSchoolList[0]" @click="schoolDetail(item.id)">
									<view class="schoolAvatar">
										<image :src="item.avatar" mode="" class="image"></image>
									</view>
									<view class="schoolName">{{item.name}}</view>
							</view>
							<view class="" v-if="!provinceSchoolList[0]" style="margin-top: 100rpx;text-align: center;color: #666;">
								暂无院校
							</view>
						</view>
						<!-- <view class="" v-if="current === 1">
							<view class="child all" v-if="!leftSelectedList[0]">全部</view>
							<view :class="['item']" v-for="(item,index) of rightList" :key='index'>
								<view class="" v-for="(iitem,iindex) of item.children" :key='iindex'>
									<view class="itemTitle">{{iitem.name}}</view>
									<view class="child" v-for="(iiitem,iiindex) of iitem.children" :key='iiindex' :class="['',selectActive(2,iiitem.id) ? 'rightActive' :'']" @click="rightListClick(item,iiitem)">
										<view class="name">{{iiitem.name}}</view>
										<view :class="['iconfont',selectActive(2,iiitem.id)? 'icon-duigou' : '']"></view>
									</view>
								</view>
							</view>
						</view> -->
				</scroll-view>
			</view>
			<!-- <view class="fixed-bottom-btn-two" v-if="current === 1">
				<view class="fixed-bottom-btn">
					<view class="left" @click="resetBtn">重置</view>
					<view class="right" @click="searchBtn">确定</view>
				</view>
			</view> -->
		</view>
		<view class="" v-if="!weapp_check_bool">
			<audit-data :list="auditData"></audit-data>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import { login_wx_h5,login_mp_wx,checkAuthSetting,unReadCount_news,Throttle} from '@/common/utils.js'
	import api from '@/common/api.js'
	import { mapState } from 'vuex'
	import auditData from '@/components/auditData'
	const App = getApp()
	export default{
		components:{
			auditData
		},
		data(){
			return {
				cityList:[],
				local_province:'',
				provinceValue:'1',
				cityValue:'1',
				weapp_check_bool:true,
				scrollTop:0,
				invitedCode:'',
				currentItem:null,
				provinceList:[],
				leftProvinceSelect:[],
				provinceSchoolList:[],
				categoryList:[],
				current:'normal',
				showLevelBool:false,
				tabList:[
					{
						title:'学历教育',
						value:'normal',
						icon:'icon-jiaoyu'
					},
					{
						title:'继续教育',
						value:'adult',
						icon:'icon-fangzi1'
					},
					{
						title:'兴趣辅导',
						value:'tutoring',
						icon:'icon-fangzi2'
					}
				],
				educationObj:{
					'secondary':'中专',
					'junior':'大专',
					'adult':'继续教育',
					'training':'技能培训'
				},
				educationList:[
					{
						title:'中专',
						value:'secondary'
					},
					{
						title:'大专',
						value:'junior'
					},
					{
						title:'继续教育',
						value:'adult'
					},
					{
						title:'技能培训',
						value:'training'
					}
				],
				educationValue:'secondary',
				leftSelectedList:[],
				sameLeftSelectedList:[],
				rightList:[],
				rightSelectedList:[],
				leftList:[],
				topViewHeight:0,
				scrollViewHeight:0,
				old: {
					scrollTop: 0
				},
				auditData:[
					{
						id:5,
						title:'心灵鸡汤起源',
						src:'https://www.mm616.com/skin/images/201705152222365459.png'
					},
					{
						id:6,
						title:'时代发展如此之快',
						src:'https://www.mm616.com/images/defaultpic.gif'
					},
					{
						id:7,
						title:'我阅读关于我所不懂的题目之书籍时，所用的方法',
						src:'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1123578154,3549181330&fm=55&app=54&f=JPEG?w=1140&h=640'
					}
				]
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad(options){
			if(options.invitedCode){
				this.invitedCode = options.invitedCode
			}
			// #ifdef H5
				login_wx_h5(this.invitedCode)
				this.share_h5()
			// #endif
			
			// #ifdef MP-WEIXIN
				login_mp_wx(App,this.invitedCode)
				this.wxInit()
			// #endif
			
			this.getProviceList()
			
			// this.getMajorsList()	
			// #ifdef H5
				  var isPageHide = false;
				  window.addEventListener('pageshow', function () {
					   if (isPageHide) {
							window.location.reload();
						}
				 });
				 window.addEventListener('pagehide', function () {
					   isPageHide = true;
				 });
			// #endif
		},
		onShow(){
			this.unReadCount_api()
		},
		methods:{
			//微信小程序审核
			wxInit(){
				uni.request({
				    url: this.$projectUrl + '/config.json?time=' + Math.random().toString(36), 
					success: (jsonData) => {
						if (jsonData.data.weapp_check == 1) {
							this.weapp_check_bool = false
						}
					}
				})
			},
			unReadCount_api: Throttle((that) => {
				unReadCount_news()
			},10000,false),
			//获取省份数据
			getProviceList(){
				let params = {}
				if(this.$store.state.local_province){
					params.local_province = this.$store.state.local_province
				}
				this.$http({
					api: api.provinceList,
					method: 'GET',
					params:params
				}).then(res => {
						let list = [
							{
								province:'1',
								name:'优选推荐'
							}
						]
						this.provinceList = list.concat(res.data)
						this.provinceValue = '1'
						this.provinceApi()
				}).catch(err => {
							
				})
			},
			//获取城市数据
			getCityList(){
				let params = {
					province:'440000'
				}
				if(this.$store.state.local_city){
					params.local_city = this.$store.state.local_city
				}
				this.$http({
					api: api.cityList,
					method: 'GET',
					params:params
				}).then(res => {
						let list = [
							{
								city:'1',
								name:'优选推荐'
							}
						]
						this.cityList = list.concat(res.data)
						this.cityValue = '1'
						this.provinceApi()
				}).catch(err => {
							
				})
			},
			searchLink(){
				uni.navigateTo({
					url:'/pages/search/index'
				})
			},
			//学历弹窗 选择专业类型
			educationClick(value){
				if(value){
					this.educationValue = value
					this.rightList = []
					this.getMajorsList()
				}
				this.showLevelBool = false
			},
			//专业列表
			getMajorsList(){
				this.leftSelectedList = []
				this.rightSelectedList = []
				this.$http({
					api: api.getMajorsList,
					method: 'GET',
					params:{
						education:this.educationValue
					}
				}).then(res => {
					this.leftList = res.data
					this.leftList.map((item,index) => {
							this.rightList.push(item)
					})
				}).catch(err => {
							
				})
			},
			//选择专业
			showLevel(){
				if(this.current === 1){
					this.showLevelBool = true
				}
			},
			//tab页签
			tabClick(value){
				this.current = value
				if(value === 'normal' || value === 'adult'){
					this.getProviceList()
				}else if(value === 'tutoring'){
					this.getCityList()
				}
			},
			//点击优选推荐
			recommendClick(){
				this.$http({
					api: api.provinceSchool,
					method: 'GET',
					params:{
						college_level:this.current,
						province:province
					}
				}).then(res => {
					this.provinceSchoolList = res.data
				}).catch(err => {
							
				})
			},
			// 
			//点击左边 使其右边对应元素显示顶部，即使滚动到一定距离
			rightScroll(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			//左边省份
			provinceSelect(item){
				return this.leftProvinceSelect.some(iitem => iitem === item)
			},
			provinceItemClick(value){
				if(this.current === 'normal' || this.current === 'adult'){
					this.provinceValue = value
				}else if(this.current === 'tutoring'){
					this.cityValue = value
				}
				this.provinceApi()
			},
			provinceApi(){
				if(this.current === 'normal' || this.current === 'adult'){
					if(this.provinceValue === '1'){
						this.recommendApi()
					}else{
						this.schoolDataApi()
					}
				}else if(this.current === 'tutoring'){
					if(this.cityValue === '1'){
						this.recommendApi()
					}else{
						this.schoolDataApi()
					}
				}
			},
			recommendApi(){
				this.$http({
					api: api.recommendSchool,
					method: 'GET',
					params:{
						type:this.current,
						is_recommend:1
					}
				}).then(res => {
					this.provinceSchoolList = res.data
				}).catch(err => {
							
				})
			},
			schoolDataApi(){
				let params = {
					type:this.current
				}
				let apiUrl = ''
				if(this.current === 'normal' || this.current === 'adult'){
					params.province = this.provinceValue
					apiUrl = api.provinceSchool
				}else if(this.current === 'tutoring'){
					params.city = this.cityValue
					apiUrl = api.getCityData
				}
				this.$http({
					api: apiUrl,
					method: 'GET',
					params:params
				}).then(res => {
					this.provinceSchoolList = res.data
				}).catch(err => {
							
				})
			},
			schoolDetail(id){
				uni.navigateTo({
					url:`/sub_school/pages/detail/index?id=${id}`
				})
			}, 
			//是否选中
			selectActive(type,id){
				if(type === 1){
					return this.leftSelectedList.some(item => item.id === id)
				}else if(type === 2){
					return this.rightSelectedList.some(item => item.id === id)
				}
			},
			//左边多选
			leftListClick(objItem){
				if(objItem === 'all'){
					//全选
					this.leftSelectedList = []
					this.rightList = []
					this.leftList.map((item,index) => {
							this.rightList.push(item)
					})
				}else{
					//多选
					let bool = this.leftSelectedList.some(item => item.id === objItem.id)
					if(bool){
						//判断左边多选选项
						let index = this.leftSelectedList.findIndex(iitem => iitem.id === objItem.id)
						if (index !== -1) this.leftSelectedList.splice(index,1)
						
						let currentIndex = this.sameLeftSelectedList.findIndex(iitem => iitem.id === objItem.id)
						if (currentIndex !== -1) this.sameLeftSelectedList.splice(currentIndex,1)
						
						//根据取消选择删除对应内容
						let current = this.rightList.findIndex(item => item.id === objItem.id)
						if (current !== -1) this.rightList.splice(current,1)
						//取消的同时也要将右边已选的去掉
						let cancelRightIdArr = []
						for(var key in objItem.children){
							for(var i in objItem.children[key].children){
								 cancelRightIdArr.push(objItem.children[key].children[i])
							}
						}
						cancelRightIdArr.map((item,index) => {
							let current = this.rightSelectedList.findIndex(iitem => iitem.id === item.id)
							if(current !== -1) this.rightSelectedList.splice(current,1)
						})
						//取消所有选择时，左边选中的是全部，右边对应的是全部的内容
						if(!this.leftSelectedList[0]){
							this.leftList.map((item,index) => {
									this.rightList.push(item)
							})
						}
					}else{
						//从全部改为 多选时，应清空右边内容，改为多选选择的内容
						if(!this.leftSelectedList[0]){
							this.rightList = []
						}
						//判断左边多选选项
						this.leftSelectedList.push(objItem)
						//根据左边选项获取对应内容放到右边
						this.leftList.map((item,index) => {
							if(item.id === objItem.id){
								this.rightList.unshift(item)
								this.rightList = this.rightList.reduce((all,next)=>all.some((item)=>item['id']==next['id'])?all:[...all,next],[])
							}
						})
					}
				}
			},
			//右边多选
			rightListClick(bigItem,objItem){
				let bool = this.rightSelectedList.some(item => item.id === objItem.id)
				if(bool){
					let index = this.rightSelectedList.findIndex(iitem => iitem.id === objItem.id)
					if (index !== -1) this.rightSelectedList.splice(index,1)
					//删除其父级的id
					let sameArr = []
					this.sameLeftSelectedList.map((item,index) => {
						if(item.id === bigItem.id){
							sameArr.push(item)
							this.sameLeftSelectedList.splice(index,1)
						}
					})
				    if(!sameArr[0]){
						let i = this.leftSelectedList.findIndex(item => item.id === bigItem.id)
						if (i !== -1) this.leftSelectedList.splice(i,1)
					}
				}else{
					this.rightSelectedList.push(objItem)
					//点击右边 左边高亮
					let haveBool = this.leftSelectedList.some(item => item.id === bigItem.id)
					if(!haveBool){
						this.leftSelectedList.push(bigItem)
					}
					this.sameLeftSelectedList.push(bigItem)
				}
			},
			//重置
			resetBtn(){
				this.leftSelectedList = []
				this.rightSelectedList = []
			},
			//搜索
			searchBtn(){
				// const res = new Map();
				// console.log(this.leftSelectedList.filter(item => !res.has(item.id) && res.set(item.id, 1)))
				//1、获取 点击右边需要将左边对应的父级(去重)
				const sameLeftSelectedList = this.sameLeftSelectedList.reduce((all,next)=>all.some((item)=>item['id']==next['id'])?all:[...all,next],[])
				console.log(this.leftSelectedList,'左边')
				console.log(this.rightSelectedList,'右边')
				console.log(sameLeftSelectedList,'相同的')
				//2、左边选择的数据，如果 sameLeftSelectedList 有相同的数据则 删除掉，由此获得 对应的 父级
				let searchList = [
					...this.leftSelectedList
				]
				sameLeftSelectedList.map((item,index) => {
					let current = searchList.findIndex(iitem => iitem.id === item.id)
					if(current !== -1) searchList.splice(current,1)
				})
				//3、左边的和右边的合并数组
				let searchArr = searchList.concat(this.rightSelectedList)
				console.log(searchArr,'分类页')
				uni.navigateTo({
					url:`/pages/search/searchResult?majorList=${encodeURIComponent(JSON.stringify(searchArr))}`
				})
			},
			getScrollHeight(){
				uni.getSystemInfo({
					success:res=>{
						//手机屏幕高度
						let phoneHeight = res.windowHeight
						//顶部高度
						let topView = uni.createSelectorQuery().select(".topPart")
						topView.boundingClientRect(data => {
							console.log(data,'data')
							this.topViewHeight = data.height
							//剩余空间即scroll-view的高度
							this.scrollViewHeight = phoneHeight - this.topViewHeight - 2  //注意margin距离，2为border宽度
							// if(this.current === 0){
							// 	this.scrollViewHeight = phoneHeight - this.topViewHeight
							// }else{
							// 	this.scrollViewHeight = phoneHeight - this.topViewHeight - 80
							// }
						}).exec()
					}
				})
			},
			//自定义分享
			share_h5() {
				const that = this
				let url = location.href.split('#')[0]
				let shareUrl = this.$projectUrl + '/#/pages/category/category'
				let koala = this.$store.state.userInfo.koala
				if(koala && koala.code){
					shareUrl += '?invitedCode='+ koala.code
				}
				that.$http({
					api: api.configuration,
					method: 'POST',
					params:{
						url: url
					}
				}).then(res => {
				    jweixin.config({
				    	debug: false, 
				    	appId: res.data.appId, 
				    	timestamp: res.data.timestamp, 
				    	nonceStr: res.data.nonceStr,
				    	signature: res.data.signature, 
				    	url:url, 
				    	jsApiList:['updateAppMessageShareData', 'updateTimelineShareData']
				    });
				    // 分享到微信
				    	jweixin.ready(function() {
				    		// 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
				    		jweixin.updateAppMessageShareData({
				    			title: '分类', // 分享标题
				    			desc: '择校好难？你是没有使用考拉上学吧！收录百大院校，求学有考拉上学，我的前途不迷茫', // 分享描述
				    			link: shareUrl, // 分享链接
				    			imgUrl: that.$rootUrl + 'koala_images/logo.png', // 分享图标
				    			success: function(res) {
				    				
				    			},
				    			cancel: function(res) {
				    				
				    			}
				    		});
				    		//自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
				    		jweixin.updateTimelineShareData({
				    			title: '分类', // 分享标题
				    			link: shareUrl, // 分享链接
				    			imgUrl: that.$rootUrl + 'koala_images/logo.png', // 分享图标
				    			success: function() {
				    				
				    			},
				    			cancel: function() {
				    				
				    			}
				    		});
				    	});
				}).catch(err => {
							
				})
			}
		},
		onReady(){
			this.getScrollHeight()
		},
		//微信小程序分享
		onShareAppMessage(res) {
			let invitedCode = ''
			if(this.userInfo.koala && this.userInfo.koala.code){
				invitedCode = this.userInfo.koala.code
			}
			if(res.from === 'menu'){
			// 右上角分享按钮
				return {
					title: '考拉上学',
					imageUrl: this.$rootUrl + 'koala_images/logo.png',
					path: `/pages/category/category?invitedCode=${invitedCode}`
				}
			}
		},
	}
</script>
<style lang="scss">
	page{
		background: #fff;
		overflow-y:hidden;
	}
</style>
<style lang="scss" scoped>
	.category{
		.topPart{
			overflow: hidden;
		}
		.header{
			padding: 10rpx 30rpx;
			box-shadow: 0 10rpx 10rpx #f4f4f4;
			font-size: 26rpx;
			color: #757474;
			.search{
				height: 64rpx;
				line-height: 64rpx;
				border-radius: 40rpx;
				background: #f4f4f4;
				font-size: 26rpx;
				.icon-search{
					margin:0 14rpx 0 25rpx;
				}
			}
		}
		.tab{
			display: flex;
			margin:30rpx;
			justify-content: space-between;
			align-items: center;
			position: relative;
			.item{
				width: 48%;
				text-align: center;
				height: 90rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #f4f4f4;
				color: #a2a2a2;
				font-family:SourceHanSansCN;
				font-weight:bold;
				font-size: 22rpx;
				.majorChoose{
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
					padding: 0 20rpx;
				}
				.icon{
					font-size: 36rpx;
					margin-right: 16rpx;
				}
			}
			.current{
				// color: #040404;
				color: $theme-color;
				font-size: 30rpx;
			}
			.level-bg{
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: transparent;
				z-index: 2;
			}
			.levelBox{
				position: absolute;
				right: 0;
				top: 100rpx;
				width: 48%;
				z-index: 3;
				background: #fff;
				border: 1px solid #ebebeb;
				border-bottom-left-radius: 20rpx;
				border-bottom-right-radius: 20rpx;
				.level-item{
					text-align: center;
					padding: 20rpx 0;
					border-bottom: 1px solid #ebebeb;
					font-size: 28rpx;
					color: #040404;
					&:last-child{
						border: none;
					}
				}
				
			}
		}
		.viewPort{
			display: flex;
			justify-content: space-between;
			border-top: 2px solid #f4f4f4;
			.scroll-left{
				width: 30%;
				background: #f2f2f2;
				box-shadow:6rpx 0 8rpx #f4f4f4;
				margin-left: 20rpx;
				.provinceList{
					padding-bottom: 20rpx;
				}
				.item{
					text-align: center;
					padding: 20rpx 0;
					color: #3c3b3b;
					font-size: 28rpx;
				}
				.leftActive{
					color: #040404;
					background: #fff;
					position: relative;
					font-size: 32rpx;
					&::before{
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 8rpx;
						height: 30rpx;
						background: #f0250f;
					}
					.icon-duigou{
						position: absolute;
						right: 10rpx;
						top: 50%;
						transform: translateY(-50%);
						color: #9ad925;
					}
				}
			}
			.scroll-right{
				width: 62%;
				background: #fff;
				box-shadow:-6rpx 0 8rpx #f4f4f4;
				.provinceSchoolList{
					padding-bottom: 20rpx;
					.item{
						display: flex;
						align-items: center;
						height: 100rpx;
						line-height: 100rpx;
						.schoolAvatar{
							margin: 0 20rpx 0 45rpx;
							display: flex;
							align-items: center;
							.image{
								@include w-h-br(60rpx);
							}
						}
						.schoolName{
							@include line-clamp-one;
						}
					}
				}
				.child{
					height: 80rpx;
					line-height: 80rpx;
					margin: 10rpx 0;
					display: flex;
					align-items: center;
					.name{
						padding-left: 84rpx;
						@include line-clamp-one;
					}
					
				}
				.all{
					padding-left: 84rpx;
				}
				.item{
					color: #3D3D3D;
					font-size: 32rpx;
					.itemTitle{
						background: #d7d6d5;
						height: 80rpx;
						line-height: 80rpx;
						padding-left: 84rpx;
					}
					.rightActive{
						position: relative;
						.icon-duigou{
							position: absolute;
							right: 62rpx;
							top: 50%;
							transform: translateY(-50%);
							color: #9ad925;
						}
					}
				}
			}
		}
		.fixed-bottom-btn-two{
			height: 100rpx;
		.fixed-bottom-btn{
			position: fixed;
			// #ifdef H5
			bottom: 50px;
			// #endif
			// #ifndef H5
			bottom: 0;
			// #endif
			left: 0;
			background: #f4f4f4;
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx 24rpx;
			box-sizing: border-box;
			text-align: center;
			font-size: 35rpx;
			color: #fff;
			.left{
				width: 30%;
				background: #828387;
				margin-right: 30rpx;
				border-radius: 10rpx;
				padding: 20rpx 0;
			}
			.right{
				width: 70%;
				background: $theme-color;
				border-radius: 10rpx;
				padding: 20rpx 0;
			}
		}
		}
	}
</style>
