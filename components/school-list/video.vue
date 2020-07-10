<template>
	<view class="">
		<!-- 布局三 -->
		<view class="schoolList-three">
			<view class="header">
				<view class="title">精彩图片</view>
				<!-- <view class="all" @click.stop="linkSearchPage"><text class="iconfont icon-yanjing">显示全部</text></view> -->
			</view>
			<scroll-view scroll-x="true" class="scrollView">
				<view class="scrollView-item" v-for="(item,index) of videoList" :key='index' @click.stop="videoClick(item.school.id)">
					<view class="video_image">
						<image :src="item.image_url" mode="aspectFill"></image>
					</view>
					<view class="content">
						<view class="title">{{item.title}}</view>
						<view class="bottom">
							<view class="imageBox">
								<image :src="item.school.avatar" mode=""></image>
							</view>
							<view class="schoolName">
								{{item.school.name}}
							</view>
						</view>
					</view>
					<view class="iconfont cancel" @click.stop="delBtn(item.id)"></view>
				</view>
			</scroll-view>
		</view>
		<!-- 布局三 -->
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
			indexChangeTabValue:{
				type:String,
				default:''
			}
		},
		components:{
			
		},
		data(){
			return {
				videoList:null
			}
		},
		methods:{
			//进入搜索页面
			linkSearchPage(){
				uni.navigateTo({
					url:'/pages/search/searchResult'
				})
			},
			getDataList(){
					let params = {}
					if(this.indexChangeTabValue){
						params.school_type = this.indexChangeTabValue === 'academic' ? 'secondary,junior,undergraduate,master' : this.indexChangeTabValue
					}
					this.$http({
						api: api.schoolImages,
						method: 'GET',
						params:params
					}).then(res => {
						this.videoList = res.data.data
					}).catch(err => {
								
					})
			},
			videoClick(id){
				// uni.navigateTo({
				// 	url:`/sub_school/pages/detail/img-video?schoolId=${id}`
				// })
				uni.navigateTo({
					url: '/sub_school/pages/detail/index?id=' + id
				});
			},
			//删除某项
			delBtn(id){
				
			}
		},
		watch:{
			list: {
				immediate: true,
				deep: true,
				handler(value) {
					if(!this.videoList){
						this.getDataList()
					}
				}
			},
		}
	}
</script>

<style lang="scss">
	// 布局三
	.schoolList-three{
		background: #f5f5f5;
		margin: 20rpx 0;
		.header{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 30rpx;
			.title{
				
			}
			.all{
				color: $theme-color;
				font-size: 28rpx;
				.iconfont{
					margin-right: 10rpx;
				}
			}
		}
		.scrollView{
			white-space: nowrap;
			.scrollView-item{
				position: relative;
				display: inline-block;
				// background: #fff;
				margin-left:20rpx;
				width: 270rpx;
				&:last-child{
					margin-right: 20rpx;
				}
				.video_image{
					width: 270rpx;
					height: 208rpx;
				}
				.content{
					padding: 10rpx;
					.title{
						@include line-clamp-one;
						margin-bottom: 10rpx;
					}
					.bottom{
						display: flex;
						align-items: center;
						.imageBox{
							@include w-h-br(30rpx);
							margin-right: 10rpx;
						}
						.schoolName{
							font-size: 26rpx;
							font-weight: bold;
							@include line-clamp-one;
						}
					}
				}
				.cancel{
					position: absolute;
					top: 6rpx;
					right: 6rpx;
					color: #fff;
					font-size: 30rpx;
					padding: 6rpx;
				}
			}
		}
	}
	// 布局三
</style>
