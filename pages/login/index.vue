<template>
	<view class="login">
		<view class="tabLogin" v-if="isH5_WX" @click="changeLoginWay">{{ loginWayBool ? '密码登录' : '短信登录' }}</view>
		<image :src='fontLogo' class="fontLogo"></image>
		<view class="summary">掌阅天下名校</view>
		
		<!-- #ifdef H5 || APP-PLUS -->
			<view class="wx-login" @click="wxLogin">
				<image class="" :src='loginWx' style="font-size: 100rpx;width: 100rpx;height: 100rpx;margin-top: 100rpx;"></image>
				<view class="wxLoginWord">微信登录</view>
			</view>
		<!-- #endif -->
			
		<!-- #ifdef MP-WEIXIN-->
			<view class="wx-login">
				<button class="sys_btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="login_mp_wx">
					<image class="" :src='loginWx' style="font-size: 100rpx;width: 100rpx;height: 100rpx;margin-top: 100rpx;"></image>
					<view class="wxLoginWord">微信登录</view>
				</button>
			</view>
		<!-- #endif -->
		
		<view v-if="isH5_WX">
			<!-- 验证码登录 -->
			<view class="codeLogin" v-if="loginWayBool">
				<input class="mobile" type="text" v-model="mobile" placeholder="手机号登录" maxlength="11"/>
				<input class="mobile" type="text" v-model="code" placeholder="验证码"/>
				<view class="getCode" @click="getCodeBtn"><count-down ref="countDown"></count-down></view>
				<view class="operBtn" @click="codeLogin">登录</view>
			</view>
			
			<!-- 密码登录 -->
			<view class="passwordLogin" v-else>
				<input class="mobile" type="text" v-model="phone" placeholder="手机号登录" maxlength="11" />
				<input class="mobile" type="password" v-model="password" placeholder="请输入密码" />
				<view class="operBtn" @click="passwordLogin">
					登录
				</view>
			</view>
			<!-- 微信登录 -->
			<block>
				<view class="wayForWX" @click="wxLogin">
					<image class="image" src='http://koala.gzzhongw.net/koala_images/login/wx.png'></image>
					<view class="word">其他登录方式</view>
				</view>
				<view class="tip">
					<view class="line"></view>
					<view style="margin:0 36rpx;">或</view>
					<view class="line"></view>
				</view>
			</block>
			<view class="register" @click="registerBtn">
				<view>还没有账户?</view>
				<view class="registerBtn">注册</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { regExp,getLocationSearchParams } from '@/common/utils.js';
import countDown from '@/components/countdown/index';
import api from '@/common/api.js'
const app = getApp()
export default {
	components: {
		countDown
	},
	data() {
		return {
			fontLogo:"",
			loginWx:"",
			stateBool: false,
			loginWayBool: false,
			mobile: '',
			code: '',
			verification_key: '',
			phone: '',
			password: '',
			isH5_WX: true
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	onLoad(options) {
		this.fontLogo = this.$rootUrl + 'koala_images/img/fontLogo.png'
		this.loginWx = this.$rootUrl + 'koala_images/login/wx.png'
		this.isH5_WX = false
		// // #ifdef H5 
		// //是否微信端
		// if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != 'micromessenger') {
		// 	that.isH5_WX = false;
		// }
		// // #endif
	},
	onShow(){
		
	},
	methods: {
		//切换登录方式
		changeLoginWay() {
			this.loginWayBool = !this.loginWayBool;
			this.mobile = '';
			this.code = '';
			this.phone = '';
			this.password = '';
			// clearInterval(this.timer);
		},
		//去注册
		registerBtn() {
			uni.navigateTo({
				url: '/pages/login/register?delta=2'
			});
		},
		//点击获取验证码
		getCodeBtn() {
			if (!this.$refs.countDown.stateBool()) {
				if (regExp('mobile', this.mobile)) {
					this.$refs.countDown.sendCode();
					this.$http({
						api: api.verificationCodes,
						method: 'POST',
						params: {
							phone: this.mobile,
							verification_type: 'login'
						}
					})
						.then(res => {
							this.verification_key = res.data.key;
						})
						.catch(err => {});
				} else {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					});
				}
			}
		},
		//验证码登录
		codeLogin() {
			this.judgeFun().then(() => {
					let params = {
						phone: this.mobile,
						login_type: 'sms',
						verification_key: this.verification_key,
						verification_code: this.code
					};
					this.$http({
						api: api.authorizations,
						method: 'POST',
						params: params
					}).then(res => {
							this.set_user_info(res.data)
						}).catch(err => {
							if(err.data.code === 10106){
								uni.showToast({
									icon:'none',
									title:err.data.message
								})
							}
						});
				}).catch(err => {});
		},
		//验证码/密码登录判断
		judgeFun() {
			return new Promise((resolve, reject) => {
				let tip = '';
				if (this.loginWayBool) {
					if (!regExp('mobile', this.mobile)) {
						tip = '请输入正确的手机号';
						reject();
					} else if (!this.code) {
						tip = '请输入验证码';
						reject();
					} else {
						resolve();
					}
				} else {
					if (!regExp('mobile', this.phone)) {
						tip = '请输入正确的手机号';
						reject();
					} else if (!this.password) {
						tip = '请输入密码';
						reject();
					} else {
						resolve();
					}
				}
				if (tip) {
					uni.showToast({
						icon: 'none',
						title: tip
					});
				}
			});
		},
		//密码登录
		passwordLogin() {
			this.judgeFun().then(() => {
					let params = {
						username: this.phone,
						login_type: 'username',
						password: this.password
					};
					this.$http({
						api: api.authorizations,
						method: 'POST',
						params: params
					}).then(res => {
							this.set_user_info(res.data)
					}).catch(err => {
							if(err.data.code === 10202){
								uni.showToast({
									icon:'none',
									title:'账号或密码错误'
								})
							}
							if(err.data.code === 10208){
								uni.showToast({
									icon:'none',
									title:err.data.message
								})
							}
						});
				}).catch(err => {});
		},
		//设置用户信息
		set_user_info(data,type){
			const that = this
			//保存token
			let token = {
					token_type: data.token_type,
					access_token: data.access_token,
					expires_in: data.expires_in,
					login_time:new Date().getTime()
				}
			that.$store.commit('saveToken',token);
			//获取用户信息并保存用户信息到vuex
			that.$http({
				api: api.getUserInfo,
				method: 'GET'
			}).then(res => {
				that.$store.commit('setUserInfo', res.data)
				//锁粉
					let { is_counselor,is_registration,parent_id } = res.data.koala
					console.log(app.globalData.invitedCode,'app.globalData.invitedCode')
					if(app.globalData.invitedCode){
						if(!is_counselor && !is_registration && !parent_id){
						that.$http({
							api: api.userRelations,
							method: 'POST',
							params:{
								code:app.globalData.invitedCode
							},
							header:{
								'Content-Type':'application/x-www-form-urlencoded'
							}
						}).then(res => {
							
						}).catch(err => {
									
						})
					}
				}
				// 入场页 只有有账号密码登录的时候才调到入场页
				if(type === 'wxLogin'){
					uni.switchTab({
						url:'/pages/index/index'
					})
					uni.$emit('mpwx')
				}else{
					console.log('aaa')
					if(!res.data.koala.sex && !res.data.koala.education){
						uni.redirectTo({
							url:'/pages/login/enterPage'
						})
					}else{
						uni.navigateBack()
					}
				}
			}).catch(err => {});
			//用户角色
			that.$http({
				api: api.getUserRoles,
				method: 'GET'
			}).then(res => {
				this.$store.commit('setRoles', res.data.data);
			}).catch(err => {});
		},
		// H5、app 微信登录
		wxLogin() {
			// #ifdef APP-PLUS
				this.appwxLogin()
			// #endif
			
			// #ifdef H5
				this.login_wx_h5()
			// #endif
		},
		//微信h5登录
		login_wx_h5(){
			sessionStorage.removeItem("loginCode")
			sessionStorage.removeItem("loginStatus")
			let url = this.$projectUrl
			location.replace(url)
		},
		//微信小程序登录
		login_mp_wx(){
			uni.getProvider({
			  service: 'oauth',
			  success: res=> {
				if (~res.provider.indexOf('weixin')) {
					uni.login({
						provider: 'weixin',
						success: loginRes => {
							this.$http({
								api: api.login_mp_wx,
								method: 'POST',
								params: {
									code:loginRes.code
								}
							})
								.then(infoRes => {
									// 获取微信用户信息
									this.getUserInfo_wx()
									this.set_user_info(infoRes.data,'wxLogin')
								})
								.catch(err => {})
						},
						fail: () => {
							uni.showToast({title:"微信登录授权失败",icon:"none"});
						}
					})
					
				}else{
					uni.showToast({
						title: '请先安装微信或升级版本',
						icon:"none"
					});
				}
			  }
			})
		},
		//获取微信小程序用户信息 将微信登录获取到的头像和名称 存进个人信息
		getUserInfo_wx(){
			uni.getUserInfo({
			  success: res => {
				let params = {
					'koala[avatar]':res.userInfo.avatarUrl,
					'koala[name]':res.userInfo.nickName,
					_method:'PATCH'
				}
				this.$http({
					api: api.getUserInfo,
					method: 'POST',
					params:params,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					}
				}).then(info => {
					this.$store.commit('setUserInfo',info.data)
				}).catch(err => {
							
				})
			  },
			  fail:res=>{
				  // 获取失败的去引导用户授权 
			   }
			})
		},
		//app微信授权登录
		appwxLogin() {
			uni.getProvider({
				service: 'oauth',
				success: res => {
					if (~res.provider.indexOf('weixin')) {
						uni.login({
							provider: 'weixin',
							success: loginRes => {
								let params = {
									access_token: loginRes.authResult.access_token,
									openid: loginRes.authResult.openid
								};
								this.$http({
									api: api.login_h5_app,
									method: 'POST',
									params: params
								})
									.then(wxRes => {
										this.set_user_info(wxRes.data,'wxLogin')
									})
									.catch(err => {
										
									});
							}
						});
					}
				}
			});
		},
	}
};
</script>

<style lang="scss" scoped>
	button{
		background: #fff;
	}
	button::after {
	  border: none;
	}
.wxLoginWord{
	color: $theme-color;
	margin-top: 20rpx;
}
page{
	background: #fff;
}
.login {
	.wx-login{
		text-align: center;margin-bottom:30rpx;
	}
	.tabLogin {
		display: flex;
		justify-content: flex-end;
		margin-top: 30rpx;
		margin-right: 46rpx;
		font-size: 25rpx;
		color: #64bfbb;
	}
	.fontLogo {
		width: 387rpx;
		height: 85rpx;
		display: block;
		margin: 80rpx auto 0;
	}
	.summary {
		// margin-bottom: 30rpx;
		font-size: 28rpx;
		color: #323232;
		text-align: center;
		margin: 36rpx 0 58rpx;
	}
	.mobile {
		width: 570rpx;
		height: 66rpx;
		padding: 0 22rpx;
		background: #f9f9f9;
		border-radius: 10rpx;
		margin: 0 auto 20rpx;
		font-size: 28rpx;
	}
	.getCode {
		display: flex;
		justify-content: flex-end;
		margin: 27rpx auto 48rpx;
		width: 570rpx;
		font-size: 18rpx;
		color:#64BFBB !important;
	}
	.operBtn {
		display: flex;
		align-items: center;
		justify-content: center;
		// justify-content: space-between;
		width: 570rpx;
		height: 66rpx;
		margin: 93rpx auto 60rpx;
		background: #64bfbb;
		font-size: 26rpx;
		color: #fff;
		border-radius: 10rpx;
	}
	.loginBtn {
		width: 570rpx;
		background: #9bcbf7;
		color: #fff;
		text-align: center;
		border-radius: 10rpx;
		margin: 60rpx auto;
		padding: 22rpx 0;
	}
	.wayForWX {
		display: flex;
		justify-content: center;
		align-items: center;
		.image {
			width: 43rpx;
			height: 43rpx;
		}
		.word {
			font-size: 20rpx;
			color: #64bfbb;
			margin-left: 32rpx;
		}
	}
	.tip {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 30rpx 0;
		font-size: 20rpx;
		color: #838383;
		.line {
			width: 239rpx;
			height: 2rpx !important;
			background: #f4f4f4;
		}
	}
	.register {
		display: flex;
		justify-content: center;
		align-items: cneter;
		color: #838383;
		font-size: 21rpx;
		.registerBtn {
			color: #64bfbb;
			margin-left: 18rpx;
		}
	}
	.wxLogin {
		width: 200rpx;
		margin: 30rpx auto;
		background: green;
		color: #fff;
		text-align: center;
	}
	
}
</style>
