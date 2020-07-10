<template>
	<view class="wallet">
		<view class="content">
			<view class="sum" @tap="pendingClick">
				<view class="word">累计在途</view>
				<view class="summary">
					累计在途说明<view class="iconfont icon-yiwen"></view>
				</view>
			</view>
			<view class="account-num">
				<view class="item number">
					<view class="sign"></view>
					<view class="money">{{info.koala.amount_pending}}</view>
				</view>
				<view class="item withdraw">
					<view class="title">可提现</view>
					<view class="money">{{info.koala.amount}}</view>
				</view>
			</view>
			<view class="bonus">
				<view class="item dashed">
					<view class="word">助学计划</view>
					<view class="num">{{info.koala.grants}}</view>
				</view>
				<view class="item dashed">
					<view class="word">差旅补助</view>
					<view class="num">{{info.koala.bonus}}</view>
				</view>
				<view class="item" @tap="summaryClick">
					<view class="word">团队差旅补助<text class="iconfont icon-yiwen"></text></view>
					<view class="estimation">估算中...</view>
				</view>
			</view>
			<view class="total">
				当前已提现<text class="num">{{info.koala.withdraw}}</text>
			</view>
		</view>
		<view class="operation">
			<view class="item" @click="detailLink(2)">账单详情</view>
			<view class="item" @click="detailLink(3)">提现明细</view>
		</view>
		<view class="fixed-bottom">
			<view class="word" @click="detailLink(1)">
				申请提现
			</view>
		</view>
		<withdraw-oper ref='oper' @updateAmount="updateAmount"></withdraw-oper>
		<!-- 提现说明 -->
		<uni-popup ref='uniPopupWithdraw'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">提现说明</view>
				<view class="uniPopup-summary">1、提现金额将于1个工作日到账至个人账户内；2、其中助学计划额需要用户报名成功后方可进行提现操作（助学计划额一般在下月的15日后可进行提现）。 </view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupWithdraw.close()"></view>
			</view>
		</uni-popup>		<!-- 累计在途说明 -->
		<uni-popup ref='uniPopup'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">累计在途说明</view>
				<view class="uniPopup-summary">1、成功邀请同学报名入学，视具体情况可向平台领取一定金额的差旅补助、团队差旅补助。待被邀请人报名成功后方可提现。</view>
				<view class="uniPopup-summary">2、若被邀请人取消报名、申请退学，则无法进行提现、须退还相应补助。</view>
				<view class="uniPopup-summary">3、若你已报名，未激活的助学计划额，包含于累计在途中。</view>
				<view class="uniPopup-summary">4、每月的15日后可提现上月发放的差旅补助。</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopup.close()"></view>
			</view>
		</uni-popup>
		<!-- 团队差旅补助 -->
		<uni-popup ref='uniPopupTeam'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">团队差旅补助</view>
				<view class="uniPopup-summary">团队差旅补助需要在所有用户正式入学后进行统一清算，而后开放提现操作（团队差旅补助额预计在当年<text class="dateColor">10月31日</text>前发放）发放后即可提现。顾问差额咨询客服。</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupTeam.close()"></view>
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
				info:{
					koala:{}
				},
			}
		},
		computed:{
			
		},
		onLoad(){
			// #ifdef H5
			 hideMenuItems(jweixin)
			// #endif
			 this.updateUserInfo()
		},
		methods: {
			updateUserInfo(){
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
			pendingClick(){
				this.$refs.uniPopup.open()
			},
			summaryClick(bool) {
				this.$refs.uniPopupTeam.open()
			},
			//提现说明
			withdrawTip(){
				this.$refs.uniPopupWithdraw.open()
			},
			// 进入账单
			accountLink() {
				uni.navigateTo({
					url: "/sub_user/pages/wallet/account"
				})
			},
			detailLink(val) {
				let url = ''
				switch (val) {
					case 1:
						//提现金额大于0可调起提现弹窗
						if(this.info.koala.amount > 0){
							this.$refs.oper.open(1)
						}else{
							uni.showToast({
								icon:'none',
								title:'可提现余额不足'
							})
						}
						break;
					case 2:
						url = '/sub_adviser/pages/wallet/accountList'
						break;
					case 3:
						url = '/sub_adviser/pages/wallet/withdraw'
						break;
				}
				if (url) {
					uni.navigateTo({
						url
					})
				}
			},
		}
	}
</script>
<style lang="scss">
	page {
		background: #f1f1f1;
	}
</style>
<style lang="scss" scoped>
	.dateColor{
		color: $theme-color;
	}
	.wallet {
		padding: 30rpx 20rpx;
	}
	.user-amount{
		padding:20rpx;
		padding-left:50rpx;
		border-radius: 20rpx;
		background: #fff;
		margin-bottom: 20rpx;
		.header{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.tips{
				font-size: 22rpx;
				color:#5c5c5c;
				display: flex;
				align-items: center;
				view:last-of-type{
					margin-left:14rpx;
				}
			}
		}
		.center{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin:20rpx 0;
			.num{
				font-size: 60rpx;
				color:#3F79D0;
				display: flex;
				align-items: center;
				.RMB{
					font-size: 30rpx;
					margin-right:20rpx;
					margin-bottom:-28rpx;
				}
			}
			.btn{
				width:110rpx;
				height:48rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right:16rpx;
				background:#12aca8;
				color:#fff;
				font-size: 24rpx;
				border-radius: 30rpx;
			}
		}
		.money{
			margin-bottom:36rpx;
			color:#000000;
			font-size: 30rpx;
			display: flex;
			align-items: center;
			.num{
				margin-left:20rpx;
				color:#3F79D0;
			}
		}
		.summary{
			color: #666;
			font-size: 26rpx;
		}
		
	}
	.content {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;

		.sum {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.word {
				color: #969696;
				font-size: 35rpx;
			}

			.summary {
				color: #5C5C5C;
				font-size: 23rpx;
				display: flex;
				.icon-yiwen {
					// margin-left: 10rpx;
				}
			}
		}

		.account-num {
			display: flex;
			border-bottom: 2rpx solid #d0d0d1;
			padding: 10rpx 0 30rpx 0;
			margin-bottom: 20rpx;

			.item {
				width: 50%;
				
			}

			.number {
				display: flex;
				align-items: flex-end;

				.sign {
					font-size: 30rpx;
					color:#3F79D0;
				}

				.money {
					font-size: 60rpx;
					color:#3F79D0;
					line-height: 60rpx;
				}
			}

			.withdraw {
				
				.title {
					font-size: 28rpx;
				}

				.money {
					margin-top: 20rpx;
					font-size: 60rpx;
					line-height: 60rpx;
				}
			}
		}

		.bonus {
			display: flex;

			.item {
				width: 30%;

				.word {
					color: #5C5C5C;
					font-size: 25rpx;
				}

				.num {
					margin: 10rpx 0;
					font-size: 30rpx;
				}
				.estimation{
					margin: 10rpx 0;
					font-size: 22rpx;
				}
				.icon-yiwen{
					font-size: 26rpx;
				}
			}

			.dashed {
				border-right: 2rpx dashed #ccc;
				margin-right: 10%;
				// width: 65%;
			}
		}

		.total {
			background: #f5f5f5;
			padding: 14rpx 20rpx;
			margin-top: 30rpx;
			font-size: 23rpx;
			border-radius: 30rpx;

			.num {
				color: #3F79D0;
				font-weight: bold;
				margin-left: 10rpx;
			}
		}
	}

	.operation {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
		.item {
			width: 48%;
			background: #fff;
			padding: 20rpx 0;
			text-align: center;
			border-radius: 20rpx;
			font-size: 33rpx;
			font-weight: bold;
		}
	}


	.fixed-bottom{
		position: fixed;
		width: 100%;
		bottom: 30rpx;
		left: 0;
		.word{
			background: $theme-color;
			width: 456rpx;
			height: 70rpx;
			line-height: 70rpx;
			color: #fff;
			text-align: center;
			font-size: 30rpx;
			border-radius: 20rpx;
			margin: 0 auto;
		}
		
	}
	
</style>


