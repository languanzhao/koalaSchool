<template>
	<view class="forget">
		<view class="item">
			<view class="label">手机号+86</view>
			<input type="number" maxlength="11" v-model="mobile" placeholder="请输入手机号" class="borderleft" />
		</view>
		<view class="item" style="position: relative;">
			<view class="label">验证码</view>
			<input type="text" v-model="verification_code" placeholder="请输入验证码" maxlength="6" />
			<view class="code" @click="getCode" :class="['codeBtn']">{{ state ? seconds + 's' : '获取验证码' }}</view>
		</view>
		<view class="item">
			<view class="label">设置密码</view>
			<input type="password" v-model="password" placeholder="6位以上,字母、数字或符号组合" />
		</view>
		<view class="item">
			<view class="label">验证密码</view>
			<input type="password" v-model="pwd" placeholder="请再次填写密码" />
		</view>
		<view class="btn" @click="EditBtn">修改密码</view>
	</view>
</template>

<script>
import { regExp } from '@/common/utils.js';
import api from '../../common/api.js';
export default {
	data() {
		return {
			state: false,
			mobile: '',
			verification_code: '1234',
			password: '',
			pwd: '',
			timer: null,
			seconds: 60,
			verification_key: ''
		};
	},
	onLoad() {},
	methods: {
		//验证码倒计时
		countDown() {
			this.state = true;
			this.timer = setInterval(() => {
				this.seconds--;
				if (this.seconds <= 0) {
					clearInterval(this.timer);
					this.state = false;
					this.seconds = 60;
					return;
				}
			}, 1000);
		},
		//获取验证码
		getCode() {
			if (!this.state) {
				if (regExp('mobile', this.mobile)) {
					this.$http({
						api: api.verificationCodes,
						method: 'POST',
						params: {
							phone: this.mobile,
							verification_type: 'password'
						}
					})
						.then(res => {
							this.countDown();
							this.verification_key = res.data.key;
						})
						.catch(err => {
							console.log(err)
							if (err.data.code === 10203) {
								uni.showToast({
									title:err.data.message,
									icon:"none"
								})
							}
						});
				} else {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					});
				}
			}
		},
		
		//修改密码
		EditBtn() {
			this.judgeFun()
				.then(() => {
					let params = {
						verification_key: this.verification_key,
						password: this.password,
						verification_code: this.verification_code,
						_method:'PATCH'
					};
					this.$http({
						api: 'koala/v1/user/password',
						method:"POST",
						params: params,
						header:{
							"content-type": "application/x-www-form-urlencoded"
						}
					})
						.then(res => {
							// 保存用户信息
						   this.$store.commit('setUserInfo', res.data);
						   uni.showToast({
						   	   title:'密码修改成功',
							   success() {
									uni.navigateBack()
							   }
						   })
						})
				})
				.catch(() => {});
		},
		judgeFun() {
			return new Promise((resolve, reject) => {
				let tip = '';
				if (!regExp('mobile', this.mobile)) {
					tip = '请正确填写您的手机号码';
					reject();
				} else if (!this.verification_code) {
					tip = '请正确填写您的验证码';
					reject();
				} else if (!regExp('password', this.password)) {
					tip = '请输入6位以上,字母、数字或符号组合的密码';
					reject();
				} else if (this.password !== this.pwd) {
					tip = '填写密码不一致';
					reject();
				} else {
					resolve();
				}
				if (tip) {
					uni.showToast({
						icon: 'none',
						title: tip
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.forget {
	padding: 50rpx 90rpx 0;
	.item {
		display: flex;
		align-items: center;
		margin-top: 50rpx;
		border-bottom: 1rpx solid #e5e5e5;
		padding: 12rpx 0;
		color: #000;
		font-size: 26rpx;
		.label {
			width: 150rpx;
		}
		input {
			flex: 1;
			padding: 0 20rpx;
			color: #000;
			font-size: 26rpx !important;
		}
		.borderleft {
			border-left: 1px solid #e5e5e5;
		}
	}

	.warn {
		display: flex;
		align-items: center;
		padding: 20rpx 0 30rpx;
		color: #d30000;
		font-size: 20rpx;
		image {
			width: 14rpx;
			height: 14rpx;
			margin-left: 34rpx;
			margin-right: 6rpx;
		}
	}
	.code {
		background: #f9f9f9;
		color: #64bfbb;
		font-size: 20rpx;
		width: 152rpx;
		height: 44rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10rpx;
	}
	.codeBtn {
		white-space: nowrap;
	}
	.btn {
		margin-top: 96rpx;
		background: #82cecb;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		height: 66rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
	}
}
</style>
