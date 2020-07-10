<template>
	<view class="detail">
		<view class="top">
			<view class="iconfont icon-tixiang"></view>
			<view class="theme">提现</view>
			<view>{{detail.amount}}</view>
		</view>
		<view class="info">
			<view class="item">
				<view class="left">当前状态</view>
				<view class="right">{{status[detail.status]}}</view>
			</view>
				<view class="item">
					<view class="left">提现金额</view>
					<view class="right">{{detail.amount}}</view>
				</view>
				<view class="item">
					<view class="left">提现时间</view>
					<view class="right">{{detail.created_at}}</view>
				</view>
				<view class="item">
					<view class="left">提现方式</view>
					<view class="right">微信账户</view>
				</view>
				<view class="item">
					<view class="left">交易单号</view>
					<view class="right">{{detail.no}}</view>
				</view>
		</view>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	export default{
		data(){
			return{
				isWithdraw:true,
				detail:{},
				status:{
					'pending':'提现中',
					'success':'提现成功',
					'failed':'提现失败',
					'refused':'提现拒绝'
				}
			}
		},
		onLoad(options) {
			if(options.id){
				let id = Number(options.id)
				this.getDetail(id)
			}
		},
		methods: {
			getDetail(id){
				uni.showLoading({
					title:'加载中'
				})
				this.$http({
					api: api.withdraws + '/' + id,
					method: 'GET',
				}).then(res => {
				   this.detail = res.data
				   uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				})
			}
		},
		
	}
</script>

<style lang="scss" scoped>
	page{
		background:#f1f1f1;
		padding-top:10rpx;
		.detail{
			width:722rpx;
			margin:0 auto;
			padding:60rpx 0 20rpx;
			background: #fff;
			border-radius:20rpx;
			.top{
				text-align: center;
				color: #000;
				font-size: 46rpx;
				margin-bottom: 36rpx;
				.icon-tixiang{
					font-size: 100rpx;
					color: #666;
				}
				.theme{
					margin:26rpx 0;
					color:#2c2c2c;
					font-size: 30rpx;
				}
			}
			
			.info{
				border-top:1px solid #f5f5f5;
				.item{
					display: flex;
					align-items: center;
					margin-top:40rpx;
					padding:0 30rpx;
					.left{
						width:150rpx;
						color:#787878;
						font-size: 26rpx;
					}
					.right{
						color:#000;
						font-size: 28rpx;
					}
				}
			}
		}
	}
</style>
