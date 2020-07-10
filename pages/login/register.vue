<template>
	<view class="register">
		<!-- <view class="mobile item">
			<view class="title">手机号 +86</view>
			<input class="input" type="number" v-model="mobile" placeholder="请输入手机号" maxlength="11"/>
		</view>
		<view class="getCode item">
			<view class="title">验证码</view>
			<view class="input">
				<input class="inputCode" type="text" v-model="verification_code" placeholder="请输入验证码"/>
				<view :class="['codeBtn',state ? 'getting' : '']" @click="getCode">{{state ? '稍等' + seconds + 's' : '获取验证码'}}</view>
			</view>
		</view>
		<view class="password item">
			<view class="title">设置密码</view>
			<input class="input" type="password" v-model="password" placeholder="6位以上,字母、数字或符号组合"/>
		</view>
		<view class="password item">
			<view class="title">确认密码</view>
			<input class="input" type="password" v-model="pwd" placeholder="请再次填写密码"/>
		</view>
		<view class="btn" @click="registerBtn">注册</view> -->
		<view class="item">
			<view class="label">手机号+86</view>
			<input type="number" maxlength="11" v-model="mobile" placeholder="请输入手机号" class="borderleft">
		</view>
		<!-- <view class="warn">
			<image src="/static/image/icon/icon_redWarn.png"></image>
			请正确填写您的手机号码
		</view> -->
		<view class="item" style="position: relative;">
			<view class="label">验证码</view>
			<input type="text" v-model="verification_code" placeholder="请输入验证码" maxlength="6">
			<view class="code" @click="getCode" :class="['codeBtn']">{{state ? seconds + 's' : '获取验证码'}}</view>
		</view>
		<view class="item">
			<view class="label">邀请码</view>
			<input type="text" v-model="invitedCode" :disabled="codeDisabled" placeholder="请输入上级邀请码" >
		</view>
		<view class="item">
			<view class="label">设置密码</view>
			<input type="password" v-model="password" placeholder="6位以上,字母、数字组合" >
		</view>
		<view class="item">
			<view class="label">确认密码</view>
			<input type="password" v-model="pwd" placeholder="请再次填写密码" >
		</view>
		<view class="btn" @click="registerBtn">注册</view>
	</view>
</template>

<script>
	import { regExp } from '@/common/utils.js'
	import api from '../../common/api.js'
	const app = getApp()
	export default{
		components:{
			
		},
		data(){
			return {
				state:false,
				mobile:'',
				verification_code:'1234',
				password:'',
				pwd:'',
				timer: null,
				seconds: 60,
				verification_key:'',
				invitedCode:'',
				codeDisabled:false
			}
		},
		computed: {
			
		},
		onLoad(){
			if(app.globalData.invitedCode){
				this.invitedCode = app.globalData.invitedCode
				this.codeDisabled = true
			}
		},
		methods:{
			//验证码倒计时
			countDown() {
				this.state = true
				this.timer = setInterval(() => {
					this.seconds--
					if (this.seconds <= 0) {
						clearInterval(this.timer)
						this.state = false
						this.seconds = 60
						return
					}
				}, 1000)
			},
			//获取验证码
			getCode() {
				if (!this.state) {
					if (regExp('mobile', this.mobile)) {
						this.$http({
							api:api.verificationCodes,
							method: 'POST',
							params: {
								phone: this.mobile,
								verification_type:'register'
							}
						}).then(res => {
							this.countDown()
							this.verification_key = res.data.key
						}).catch(err => {
							if(err.data.code === 10204){
								uni.showModal({
									showCancel:false,
									content:'该手机号已注册过，返回登录',
									title:'提示',
									success: function (res) {
									        if (res.confirm) {
									            uni.navigateBack()
									        }
									    }
								})
							}
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '请输入正确的手机号'
						})
					}
				}
			},
			//注册按钮
			registerBtn(){
				this.judgeFun().then(() => {
					let params = {
							phone: this.mobile,
							login_type:'sms',
							verification_key:this.verification_key,
							password:this.password,
							verification_code:this.verification_code
					}
					if(this.invitedCode){
						params.code = this.invitedCode
					}
					this.$http({
						api: api.authorizations,
						method: 'POST',
						params:params
					}).then(res => {
						//保存token
						this.$store.commit('saveToken',res.data)
						//获取用户信息并保存用户信息到vuex
						this.$http({
							api: api.getUserInfo,
							method: 'GET',
						}).then(info => {
							this.$store.commit('setUserInfo',info.data)
						}).catch(err => {
									
						})
						//用户角色
						this.$http({
							api: api.getUserRoles,
							method: 'GET',
						}).then(roles => {
							this.$store.commit('setRoles',roles.data)
						}).catch(err => {
									
						})
						if(this.invitedCode){
							//锁粉
							this.$http({
								api: api.userRelations,
								method: 'POST',
								params:{
									code:this.invitedCode
								},
								header:{
									'Content-Type':'application/x-www-form-urlencoded'
								}
							}).then(res => {
								
							}).catch(err => {
								
							})
						}
						
						//注册成功跳转到入场页
						uni.showToast({
							title:'注册成功',
							success:() => {
								setTimeout(() => {
									uni.redirectTo({
										url:'/pages/login/enterPage?delta=2'
									})
								},1000)
							}
						})
					}).catch(err => {
						if(err.data.code === 10109){
							uni.showToast({
								icon:'none',
								title:err.data.message
							})
						}
					})
				}).catch(()=>{})
			},
			judgeFun(){
				return new Promise((resolve,reject) => {
					let tip = ''
					if(!regExp('mobile', this.mobile)){
						tip = '请正确填写您的手机号码'
						reject()
					}else if(!this.verification_code){
						tip = '请正确填写您的验证码'
						reject()
					}else if(!regExp('password',this.password)){
						tip = '请输入6位以上,字母、数字组合的密码'
						reject()
					}else if(this.password !== this.pwd){
						tip = '填写密码不一致'
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.register{
		padding:50rpx 90rpx 0;
		.item{
			display: flex;
			align-items: center;
			margin-top:50rpx;
			border-bottom: 1rpx solid #e5e5e5;
			padding: 12rpx 0;
			color:#000;
			font-size: 26rpx;
			.label{
				width: 150rpx;
			}
			input{
				flex: 1;
				padding:0 20rpx;
				color:#000;
				font-size: 26rpx !important;
			}
			.borderleft{
				border-left: 1px solid #e5e5e5;
			}
		}
		.warn{
			display: flex;
			align-items: center;
			padding:20rpx 0 30rpx;
			color:#d30000;
			font-size: 20rpx;
			image{
				width:14rpx;
				height:14rpx;
				margin-left:34rpx;
				margin-right:6rpx;
			}
		}
		.code{
			background:#f9f9f9;
			color:#64BFBB;
			font-size:20rpx;
			width:152rpx;
			height:44rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius:10rpx;
		}
		.codeBtn{
			white-space: nowrap;
		}
		.btn{
			margin-top:96rpx;
			background: #82cecb;
			display: flex;
			justify-content: center;
			align-items: center;
			color:#fff;
			height:66rpx;
			border-radius: 10rpx;
			font-size: 30rpx;
		}
		// .getCode{
		// 	.input{
		// 		display: flex;
		// 		align-items: center;
		// 		.inputCode{
					
		// 		}
		// 		.codeBtn{
		// 			border: 1rpx solid #006EFF;
		// 			padding: 10rpx 20rpx;
		// 			color: #006EFF;
		// 			border-radius: 10rpx;
		// 			font-size: 28rpx;
		// 			white-space: nowrap;
		// 		}
		// 		.getting{
		// 			border-color: #999;
		// 			color: #999;
		// 		}
		// 	}
		// }
		// .btn{
		// 	width: 100%;
		// 	padding: 20rpx 0;
		// 	text-align: center;
		// 	color: #fff;
		// 	background: #1877f2;
		// 	margin-top: 60rpx;
		// 	border-radius: 10rpx;
		// }
	}
</style>
