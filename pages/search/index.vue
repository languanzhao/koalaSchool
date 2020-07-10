<template>
	<view class="search">
		<!-- 顶部搜索栏 -->
		<view class="header">
			<view class="left">
				<view class="iconfont icon-search"></view>
				<input class="input" type="text" confirm-type="search" @confirm='searchClick' v-model="inputVal" placeholder="搜院校/专业/地区" placeholder-style="color:#E6F4F4;"/>
				<view class="cancel" v-if="inputVal" @click="cancelClick">×</view>
			</view>
			<view class="button" @click="searchClick">搜索</view>
		</view>
		<view class="searchInfo">
			<!-- 历史搜索 -->
			<view class="item" v-if="historyList[0]">
				<view class="word">
					<view class="line"></view>
					历史搜索
				</view>
				<view class="iconfont icon-remove" @click="deleteHistoryList"></view>
			</view>
			<view class="list">
				<view class="list-item" v-for="(item,index) of historyList" :key='index' @click="itemSearch(item)">
					{{item}}
				</view>
			</view>
			<!-- 热门搜索 -->
			<view v-if="hotList[0]">
				<view class="item">
					<view class="word">
						<view class="line"></view>
						热门院校
					</view>
				</view>
				<view class="list">
					<view class="list-item" v-for="(item,index) of hotList" :key='index' @click="itemSearch(item)">
						{{item}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import { hideMenuItems } from '@/common/utils.js'
	import api from '@/common/api.js'
	export default {
		components: {

		},
		data() {
			return {
				inputVal: '',
				historyList: [],
				hotList: [],
			}
		},
		onLoad() {
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			this.getSearchHistory()
			this.hotSearch()
		},
		methods: {
			//清除输入框
			cancelClick() {
				this.inputVal = ''
			},
			//搜索点击
			searchClick() {
				this.saveSearchHistory()
				uni.navigateTo({
					url:'/pages/search/searchResult'
				})
			
				if(this.inputVal){
					uni.navigateTo({
						url:`/pages/search/searchResult?inputVal=${this.inputVal}`
					})
					this.inputVal = ''
				}
			},
			//点击历史记录搜索
			itemSearch(item){
				uni.navigateTo({
					url:`/pages/search/searchResult?inputVal=${item}`
				}) 
			},
			//保存搜索历史记录
			saveSearchHistory() {
				let value = this.inputVal.trim()
				let list = this.historyList
				if (this.inputVal && value) {
					if (list.length > 0) {
						console.log(list, 'list')
						let index = list.findIndex((item) => item === value)
						if (index !== -1) list.splice(index, 1)
					}
					list.unshift(value)
					if (list.length > 10) list.splice(10)
					uni.setStorage({
						key: 'historyList',
						data: JSON.stringify(list)
					})
				}
			},
			//获取搜索历史记录
			getSearchHistory() {
				uni.getStorage({
					key: 'historyList',
					success: res => {
						this.historyList = JSON.parse(res.data)
					}
				})
			},
			//清空历史记录
			deleteHistoryList() {
				uni.removeStorage({
					key: 'historyList',
					success: res => {
						this.historyList = []
					}
				});
			},
			//热门搜索
			hotSearch(){
				this.$http({
					api: api.hotSearch,
					method: 'GET',
				}).then(res => {
					if(res.data){
						this.hotList = res.data
					}
				}).catch(err => {});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		.header {
			background: $theme-color;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:20rpx;
			color:#E6F4F4;
			font-size: 30rpx;
			.left {
				display: flex;
				align-items: center;
				border-radius: 20rpx;
				margin-right: 10rpx;
				padding: 0 10rpx;
				flex: 1;
				background:#82CECB;
				position: relative;
				color:#E6F4F4;
				font-size: 26rpx;
				.input {
					padding: 10rpx;
					flex: 1;
					font-size: 26rpx;
				}
				.cancel {
					position: absolute;
					right: 10rpx;
					top: 50%;
					transform: translateY(-50%);
					font-size: 30rpx;
					background: rgba(0, 0, 0, .5);
					color: #fff;
					border-radius: 50%;
					width: 30rpx;
					height: 30rpx;
					line-height: 30rpx;
					text-align: center;
				}
			}
		    
		}

		.searchInfo {
			padding: 0 30rpx;
			font-size: 28rpx;
			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 20rpx 0 26rpx;
				.word{
					display: flex;
					align-items: center;
					color:$theme-color;
					.line{
						width: 6rpx;
						height:26rpx;
						background:#12ada9;
						margin-right:8rpx;
					}
				}
				
			}

			.list {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.list-item {
					margin-right: 22rpx;
					padding:20rpx 30rpx;
					font-size: 28rpx;
					margin-bottom: 40rpx;
					background:#EBF1F4;
					border-radius:20rpx;
				}
			}
		}
	}
</style>
