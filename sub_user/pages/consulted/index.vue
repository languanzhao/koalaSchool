<template>
	<view class="consulted">
		<view class="consultedList">
			<view class="item" v-for="(item,index) of schoolChatList" :key='index' @click="goChat(item.id)">
				<image :src="item.avatar" mode=""></image>
			    <view class="content">
			    	<view class="info">
			    		<view class="name">
							<view class="schoolName">{{item.name}}</view>
			    		</view>
						<view class="summary"></view>
			    	</view>
					<view class="date">
						{{item.time}}
					</view>
			    </view>
			</view>
			<view v-if="schoolChatList && !schoolChatList[0]" class="noneNull">
				暂无记录
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
				schoolChatList:[]
			}
		},
		onLoad(options){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			let info = uni.getStorageSync('schoolChat')
			if(info){
				let schoolChatList = JSON.parse(info)
				this.schoolChatList = schoolChatList
			}
		},
		methods:{
			goChat(id){
				uni.navigateTo({
					url:'/pages/news/chat?schoolId=' + id
				})
			}
		},
		onPullDownRefresh() {
			console.log('刷新了一次');
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom(){
			console.log('到底了')
		}
	}
</script>

<style lang="scss" scoped>
	.consultedList{
		.item{
			display: flex;
			padding: 20rpx 0 20rpx 20rpx;
			image{
				width: 100rpx;
				height: 100rpx;
			}
			.content{
				display: flex;
				align-items: center;
				flex: 1;
				justify-content: space-between;
				border-bottom: 1rpx solid #f4f4f4;
				margin-left: 20rpx;
				padding:0 20rpx 20rpx 0;
				.info{
					.name{
						display: flex;
						align-items: center;
						.nickName{
							font-weight: bold;
						}
						.schoolName{
							color: #666;
							font-size: 28rpx;
							margin-left: 10rpx;
						}
					}
					.summary{
						padding: 10rpx 0;
						color: #666;
						font-size: 30rpx;
					}
				}
				.date{
					font-size: 26rpx;
					color: #666;
				}
			}
		}
	}
</style>
