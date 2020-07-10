<template>
	<view class="invited">
		<view class="tabList-place">
			<view class="tabList">
				<view :class="['item',current === index ? 'active' : '']" v-for="(item,index) of tabList" :key='index' @click="tabChange(index)">{{item.title}}</view>
			</view>
		</view>
		<view class="invitedList">
			<view class="invitedList-item" v-for="(item,index) of list" :key='index' v-if="list && list[0]">
				<view class="list-item" @click="detailLink(item.id)">
					<view class="item-header" >
						<view class="item-header-left">
							<image class="image" :src="item.koala.avatar" mode=""></image>
							<view class="name">{{item.koala.name}}</view>
						</view>
						<view :class="['item-header-right','iconfont','icon-jiantouxia']"></view>
					</view>
					<apply-process :item='item'></apply-process>
				</view>
			</view>
			<view v-if="list && !list[0]" class="noneNull">
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
	import api from '@/common/api.js'
	import applyProcess from '@/components/applyProcess'
	export default{
		components:{
			applyProcess
		},
		data(){
			return {
				list:null,
				current:0,
				tabList:[
					{
						title:'直邀'
					},
					{
						title:'推荐'
					}
				],
				current_page:1,
				last_page:null,
			}
		},
		onLoad(){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			this.getDataList()
		},
		methods:{
			tabChange(index){
				this.current = index
				this.list = null
				this.getDataList()
			},
			getDataList(){
				let url = ''
				if(this.current === 0){
					url = api.invitee_applications
				}else if(this.current === 1){
					url = api.recommend_applications
				}
				let list = this.list || []
				this.$http({
					api: url,
					method: 'GET',
					params:{
						page:this.current_page
					}
				}).then(res => {
					this.list = list.concat(res.data.data || [])
					this.current_page = res.data.meta.current_page
					this.last_page = res.data.meta.last_page
				}).catch(err => {
							
				})
			},
			detailLink(id){
				uni.navigateTo({
					url:'/sub_user/pages/progress/index?type=1&&id=' + id
				})
			}
		},
		onPullDownRefresh() {
			if(this.list[0]){
				   this.current_page = 1
				   this.last_page = 0
				   this.list = null
				   this.getDataList()
			}
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom(){
			if(this.current_page < this.last_page){
				this.current_page = this.current_page + 1
				this.getDataList()
			}
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.tabList-place{
		height:76rpx;
	}
	// tab顶部导航
	.tabList{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		display: flex;
		height:76rpx;
		color:#4c4c4c;
		font-size: 30rpx;
		.item{
			display: flex;
			align-items: center;
			justify-content: center;
			background:#fafafa;
			flex:1;
		}
		.active{
			background:#e7e7e7;
			color: $theme-color;
		}
	}
	.invitedList{
		.invitedList-item{
			border-radius: 10rpx;
			
			.list-item{
				padding: 20rpx;
				margin: 20rpx;
				background: #fff;
				border-radius: 20rpx;
			}
			//上部分
			.item-header{
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #F1F1F1;
				padding: 20rpx 0;
				.item-header-left{
					display: flex;
					align-items: center;
					color:#000;
					font-size: 30rpx;
					.image{
						@include w-h-br(80rpx);
						margin-right: 20rpx;
						border-radius: 20rpx;
					}
					.type{
						font-size:20rpx;
						color:$theme-color;
						margin-left:10rpx;
						padding:2rpx 6rpx;
						border:1px solid $theme-color;
						border-radius:10rpx;
					}
				}
				.item-header-right{
					
				}
			}
		}
	}
</style>
