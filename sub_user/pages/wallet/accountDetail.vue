<template>
	<view class="transferAccounts">
		<view class="top">
			<view class="iconfont icon-zhuxuejin"></view>
			<view class="theme">助学计划</view>
			<view>{{item.type === 'grants' ? '+' : '-'}}{{item.amount}}</view>
		</view>
		<view class="info">
			<view class="item">
				<view class="left">当前状态</view>
				<view class="right">{{item.type === 'grants' ? '领取成功' : '退还'}}</view>
			</view>
				<view class="item">
					<view class="left">助学计划</view>
					<view class="right">{{item.amount}}</view>
				</view>
				<view class="item">
					<view class="left">入账时间</view>
					<view class="right">{{item.created_at}}</view>
				</view>
				<view class="item">
					<view class="left">入账方式</view>
					<view class="right">钱包</view>
				</view>
				<view class="item">
					<view class="left">交易单号</view>
					<view class="right">{{item.no}}</view>
				</view>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import { hideMenuItems } from '@/common/utils.js'
	export default{
		components:{
		},
		data(){
			return {
				item:{},
				imgList:'',
				type:{
					'return_grants':'退还',
					'grants':'助学计划'
				}
			}
		},
		onLoad(options){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			this.item = JSON.parse(decodeURIComponent(options.item));
		},
		methods:{
			copy(value){
				console.log(value)
				uni.setClipboardData({
				    data: value,
				    success: function (res) {
				        uni.showToast({
				        	title:'复制成功'
				        })
				    }
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background:#f1f1f1;
		padding-top:10rpx;
		.transferAccounts{
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
				.iconfont{
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
