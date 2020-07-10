<template>
	<view class="wallet">
		<view class="user-amount" @click="accountLink">
			<view class="header">
				<view class="plan">账户余额</view>
				<!-- <view class="tips" @click.stop="summaryClick">
					<view>提现说明</view>
					<view class="iconfont icon-yiwen"></view>
				</view> -->
			</view>
			<view class="center">
				<view class="num">
					<!-- <view class="RMB">￥</view> -->
					<view>{{info.koala.grants}}</view>
				</view>
				<view class="btn" @click.stop="showPopup">提现</view>
			</view>
			<view class="money">
				<view>可提现:</view>
				<view class="num">{{info.koala.amount}}</view>
			</view>
			<view class="summary">提现金额将于2个工作日到账至个人账户内</view>
		</view>
		<withdraw-oper ref='oper' @updateAmount="updateAmount"></withdraw-oper>
		<uni-popup ref='uniPopup'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">提现说明</view>
				<view class="uniPopup-summary">1、提现金额将于2个工作日到账至个人账户内；2、其中助学计划额需要用户报名成功后方可进行提现操作（助学计划额一般在下月的15日后可进行提现）。 </view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopup.close()"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import { hideMenuItems } from '@/common/utils.js'
	import api from '@/common/api.js'
	import withdrawOper from '@/components/withdrawOper'
	export default {
		components: {
			withdrawOper
		},
		data() {
			return {
				info: {
					koala: {}
				},
			}
		},
		computed: {

		},
		onLoad() {
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			this.updateUserInfo()
		},
		methods: {
			updateUserInfo() {
				//获取用户信息并保存用户信息到vuex
				this.$http({
					api: api.getUserInfo,
					method: 'GET'
				}).then(res => {
					this.info = res.data
					this.$store.commit('setUserInfo', res.data)
				}).catch(err => {});
			},
			updateAmount(amount){
				this.info.koala.amount = (this.info.koala.amount - amount).toFixed(2)
			},
			//账单列表
			accountLink() {
				uni.navigateTo({
					url: '/sub_user/pages/wallet/account'
				})
			},
			//提现说明
			summaryClick() {
				this.$refs.uniPopup.open()
			},
			//提现弹窗
			showPopup() {
				//提现金额大于0可调起提现弹窗
				if(this.info.koala.amount>0){
					this.$refs.oper.open(1)
				}else{
					uni.showToast({
						icon:'none',
						title:'可提现余额不足'
					})
				}
			}
		}
	}
</script>
<style lang="scss">
	page {
		background: $page-background;
	}
</style>
<style lang="scss" scoped>
	.wallet {
		padding: 10rpx 16rpx 0;

		.user-amount {
			padding: 20rpx 20rpx 40rpx;
			padding-left: 50rpx;
			border-radius: 20rpx;
			background: #fff;

			.header {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.tips {
					font-size: 22rpx;
					color: #5c5c5c;
					display: flex;
					align-items: center;

					view:last-of-type {
						margin-left: 14rpx;
					}
				}
			}

			.center {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 40rpx 0;

				.num {
					font-size: 60rpx;
					color: #3F79D0;
					display: flex;
					align-items: center;

					.RMB {
						font-size: 30rpx;
						margin-right: 20rpx;
						margin-bottom: -28rpx;
					}
				}

				.btn {
					width: 110rpx;
					height: 48rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 16rpx;
					background: $theme-color;
					color: #fff;
					font-size: 24rpx;
					border-radius: 30rpx;
				}
			}

			.money {
				margin-bottom: 36rpx;
				color: #000000;
				font-size: 30rpx;
				display: flex;
				align-items: center;

				.num {
					margin-left: 20rpx;
					color: #3F79D0;
				}
			}

			.summary {
				color: #666;
				font-size: 26rpx;
			}

		}

		.popupContent {
			background: #fff;
			padding: 30rpx;
			width: 500rpx;

			.title {
				font: {
					weight: bold;
					size: 36rpx;
				}

				text-align: center;

			}

			.inputVal {
				display: flex;
				align-items: center;

				.input {
					margin: 40rpx 20rpx;
					width: 200rpx;
					border: 1rpx solid #ccc;
					padding: 10rpx;
				}
			}

			.oper {
				display: flex;
				justify-content: space-between;

				.item {
					width: 48%;
					text-align: center;
					padding: 20rpx 0;
					border-radius: 10rpx;
				}

				.cancel {
					background: #ccc;
				}

				.confirm {
					background: #0071FF;
					color: #fff;
				}
			}
		}
	}
</style>
