<template>
	<view class="transferInfo">
		<view class="transferAccounts-info">
			<view class="header">
				<image class="avatar" :src="transferObj.avatar" mode=""></image>
				<view class="schoolName">{{transferObj.name}}</view>
			</view>
			<view class="content">
				<view class="item" v-for="(item,index) of transferObj.transferList" :key='index'>
					<view class="left">{{item.key}}</view>
					<view class="right">{{item.value}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		components:{
			
		},
		props:{
			transferObj:{
				type:Object,
				default:() => {}
			}
		},
		data(){
			return {
				
			}
		},
		computed: {
			
		},
		onLoad(){
			
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.transferAccounts-info{
		.header {
			text-align: center;
			.avatar {
				@include w-h-br(100rpx);
				margin-bottom: 16rpx;
			}
			.schoolName{
				font-weight: bold;
			}
		}
		.content {
			margin-top: 24rpx;
			padding: 30rpx 40rpx;
			border-top: 1rpx solid #f0f0f0;
			border-bottom: 1rpx solid #f0f0f0;
			.item {
				display: flex;
				align-items: center;
				margin: 40rpx 0;
				.left {
					color: #787878;
					font-size: 26rpx;
					width: 30%;
				}
				.right {
					flex: 1;
					font-size: 28rpx;
					width: 70%;
				}
			}
		}
	}
</style>
