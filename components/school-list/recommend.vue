<template>
	<view class="recommend">
		<!-- 布局二 -->
		<view class="schoolList-two">
			<view class="header">
				<view class="title u-skeleton-rect">{{show ? '为你推荐' : '相似院校'}} </view>
				<view class="all u-skeleton-rect" @click.stop="linkSearchPage" v-if="show"><text class="iconfont icon-yanjing"></text>显示全部</view>
			</view>
			<scroll-view scroll-x="true" class="scrollView">
				<view class="scrollView-item" v-for="(item,index) of list" :key='index' @click.stop="goDetail(item.id)">
					<view class="imageBox u-skeleton-circle">
						<image :src="item.avatar" mode="aspectFit"></image>
					</view>
					<view class="schoolName u-skeleton-rect">{{item.name}}</view>
					<view class="label u-skeleton-rect">热门院校</view>
					<view class="detail u-skeleton-rect">查看详情</view>
					<!-- <view class="iconfont cancel icon-guanbi u-skeleton-rect" @click.stop="delBtn(item.id)"></view> -->
				</view>
			</scroll-view>
		</view>
		<!-- 布局二 -->
	</view>
</template>

<script>
	import api from '@/common/api.js'
	export default{
		props:{
			list:{
				type:Array,
				default:()=>[]
			},
			show:{
				type:Boolean,
				default:true
			},
			indexChangeTabValue:{
				type:String,
				default:''
			}
		},
		components:{
			
		},
		data(){
			return {
				
			}
		},
		created(){
			
		},
		mounted(){
			
		}, 
		methods:{
			//进入详情
			goDetail(id){
				uni.navigateTo({
					url:`/sub_school/pages/detail/index?id=${id}`
				})
			},
			//进入搜索页面
			linkSearchPage(){
				uni.navigateTo({
					url:'/pages/search/searchResult?is_recommend=1&&indexChangeTabValue=' + this.indexChangeTabValue
				})
			},
			//删除某项
			delBtn(id){
				
			}
		},
		watch:{
			
		}
	}
</script>

<style lang="scss">
	// 布局二
	.schoolList-two{
		background: #fafafa;
		.header{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 30rpx;
			.title{
				font-weight: bold;
			}
			.all{
				color: $theme-color;
				font-size: 28rpx;
				.icon-yanjing{
					margin-right: 10rpx;
				}
			}
		}
		.scrollView{
			white-space: nowrap;
			padding: 10rpx 0;
			.scrollView-item{
				position: relative;
				display: inline-block;
				background: #fff;
				padding: 30rpx 20rpx;
				margin: 10rpx 0 10rpx 20rpx;
				width: 260rpx;
				text-align: center;
				border: 1rpx solid #e6e6e6;
				border-radius: 10rpx;
				&:last-child{
					margin-right: 20rpx;
				}
				.imageBox{
					@include w-h-br(140rpx);
					margin: 0 auto;
				}
				.schoolName{
					font-size: 26rpx;
					font-weight: bold;
					white-space:normal;
					@include line-clamp-one;
					margin: 10rpx 0;
				}
				.label{
					color: #999;
					font-size: 20rpx;
					margin-bottom: 10rpx;
				}
				.detail{
					width: 200rpx;
					height: 40rpx;
					line-height: 40rpx;
					color: #fff;
					background: $theme-color;
					font-size: 22rpx;
					border-radius: 10rpx;
					margin: 0 auto;
				}
				.cancel{
					position: absolute;
					top: 0;
					right: 0;
					padding: 10rpx;
					font-size: 18rpx;
					font-weight: bold;
					color: #7e7e7e;
				}
			}
		}
	}
	// 布局二
</style>
