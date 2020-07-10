<template>
	<view class="address-edit">
		<view class="part">
			<view class="item" @click="addressChange">
				<view class="title">
					<text class="must">*</text>
					通讯地址
				</view>
				<view class="right">
					<image src="/static/image/icon/icon_area.png"></image>
					<view class="address" v-if="item.province">{{item.province + item.city + item.district}}</view>
					<view class="address" v-else>请选择地址</view>
					<view class="iconfont icon-leftArrow"></view>
				</view>
			</view>
			<view class="special">
				<view class="title"><text class="must">*</text>门牌号</view>
				<textarea type="text" @focus="hideBtn" @click="hideBtn" @blur="showBtn" 
					v-model="item.address" 
					class="textarea" 
					placeholder="详细地址,例北京路1楼101室"
					placeholder-style="font-size:26rpx;"
					/>
			</view>
			<view class="item">
				<view class="title">
					<text class="must">*</text>
					联系人
				</view>
				<input type="text" @focus="hideBtn" @click="hideBtn" @blur="showBtn" v-model="item.contact_name" class="input" placeholder="请输入姓名"/>
			</view>
			<view class="item">
				<view class="title">
					<text class="must">*</text>
					手机号
				</view>
				<input type="number" v-model="item.contact_phone" @focus="hideBtn" @click="hideBtn" @blur="showBtn" class="input" placeholder="请输入手机号码" maxlength="11"/>
			</view>
		</view>
		<view class="fixed_bottom_btn_place" v-if="fixedBtn">
			<view class="fixed_bottom_btn" @click="submit">
				<view class="word">
					确定
				</view>
			</view>
		</view>
		<!-- 地址选择器 -->
		<simple-address 
			ref="simpleAddress" 
			:pickerValueDefault="cityPickerValueDefault" 
			@onConfirm="addressConfirm" 
			themeColor="#007AFF"
		></simple-address>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import simpleAddress from '@/components/simple-address/simple-address.nvue';
	import { regExp,getWindowResize,hideMenuItems } from '@/common/utils.js';
	import { mapState } from 'vuex';
	import api from '@/common/api.js'
	export default{
		components:{
			simpleAddress
		},
		data(){
			return {
				cityPickerValueDefault: [0, 0, 1],
				item:{
					province:'',
					city:'',
					district:'',
					address:'',
					contact_name:'',
					contact_phone:'',
				},
				fixedBtn:true,
				windowHeight:'',
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad(options) {
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			
			if(options.item){
				this.item = JSON.parse(options.item)
			}
			
			//监听窗口高度变化（为了兼容h5端底部按钮被键盘顶起的问题）
			this.windowResize()
		},
		methods:{
			//兼容苹果手机上 键盘升起会导致页面上移问题
			inputBlur(){
				uni.pageScrollTo({
					scrollTop:0,
					duration:0
				})
			},
			//点击弹窗选择地址
			addressChange(){
				this.$refs.simpleAddress.open();
			},
		    //确认选择地址
			addressConfirm(e){
				this.cityPickerValueDefault = e.value //保留当前选择
				this.$set(this.item,'province',e.labelArr[0])
				this.$set(this.item,'city',e.labelArr[1])
				this.$set(this.item,'district',e.labelArr[2])
			},
			//确定
			submit(){
				this.judgeFun().then(()=>{
					let params = {
						province:this.item.province,
						city:this.item.city,
						district:this.item.district,
						address:this.item.address,
						contact_name:this.item.contact_name,
						contact_phone:this.item.contact_phone,
					}
					
					if(this.item.id){
						params.id = this.item.id
						params._method = 'PUT'
						this.$http({
							api: api.addressInfo + '/' + this.item.id,
							method: 'POST',
							params:params,
							header:{
								'Content-Type':'application/x-www-form-urlencoded'
							}
						}).then(res => {
							uni.showToast({
								title:'修改成功',
								success:() => {
									setTimeout(() => {
										uni.$emit('refresh')
										uni.navigateBack()
									},1000)
								}
							})
						}).catch(err => {
									
						})
					}else{
						this.$http({
							api: api.addressInfo,
							method: 'POST',
							params:params,
							header:{
								'Content-Type':'application/x-www-form-urlencoded'
							}
						}).then(res => {
							uni.showToast({
								title:'保存成功',
								success:() => {
									setTimeout(() => {
										uni.$emit('refresh')
										uni.navigateBack()
									},1000)
								}
							})
						}).catch(err => {
									
						})
					}
					
				}).catch((err)=>{})
			},
			//验证
			judgeFun(){
				return new Promise((resolve,reject)=>{
					let tip = ''
					if(!this.item.province){
						tip = '请选择通讯地址'
						reject()
					}else if(!this.item.address){
						tip = '请输入门牌号'
						reject()
					}else if(!this.item.contact_name){
						tip = '请输入联系人'
						reject()
					}else if(!regExp('mobile',this.item.contact_phone)){
						tip = '请输入正确的手机号'
						reject()
					}else{
						resolve()
					}
					if(tip){
						uni.showToast({
							icon:'none',
							title:tip
						})
					}
				})
			},
			//监听窗口高度变化
			windowResize(){
				this.windowHeight = getWindowResize('height')
			    uni.onWindowResize((res) => {
			        if(res.size.windowHeight < this.windowHeight){
			            this.fixedBtn = false
			        }else{
			            this.fixedBtn = true
			        }
			    })
			},
			//显示按钮
			showBtn(){
				this.fixedBtn = true
				uni.pageScrollTo({
					scrollTop:0,
					duration:0
				})
			},
			//隐藏按钮
			hideBtn(){
				this.fixedBtn = false
			}
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.must{
		color: red;
	}
	.address-edit{
		.part{
			background: #fff;
			margin:14rpx;
			border-radius:20rpx;
			padding:14rpx;
		}
		.item{
			display: flex;
			background: #fff;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #ccc;
			padding: 40rpx 0;
			padding-left:28rpx;
			padding-right:18rpx;
			.title{
				font-size:30rpx;
				color:#000000;
			}
			.input{
				flex: 1;
				text-align: right;
				font-size: 28rpx;
			}
			.right{
				display: flex;
				align-items: center;
				color:#7d7d7d;
				font-size: 28rpx;
				image{
					width: 18rpx;
					height:26rpx;
				}
				.address{
					margin:0 20rpx;
				}
			}
		}
		.special{
			padding: 40rpx 0;
			// margin: 20rpx 10rpx;
			padding-left:28rpx;
			border-bottom: 1rpx solid #ccc;
			.textarea{
				width: 100%;
				height: 80rpx;
				margin-top: 20rpx;
				font-size: 28rpx;
			}
		}
		.item:last-of-type{
			border-bottom: none;
		}
		.fixedBottom{
			position: absolute;
			bottom: 30rpx;
			width: 100%;
			left: 0;
			display: flex;
			justify-content: space-between;
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			text-align: center;
			font-size: 30rpx !important;
			.reset{
				background: #999;
				width: 200rpx;
				margin-right: 20rpx;
				border-radius: 10rpx;
			}
			.confirm{
				flex: 1;
				background: blue;
				color: #fff;
				border-radius: 10rpx;
			}
		}
	}
</style>
