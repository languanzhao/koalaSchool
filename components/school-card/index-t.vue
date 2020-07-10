<template>
	<view class="schoolCard">
			<view class="item-left">
				<image :src="info.avatar" mode=""></image>
			</view>
			<view class="item-right">
				<view class="top-name">
					<view class="name">{{info.name}}</view>
					<view class="label" @click="labelClick" v-if="info.type === 'normal'">助学计划</view>
				</view>
				<view class="bottom-info">
					<view class="item">
						<view class="iconfont icon-xuesimao-active"></view>
						<view class="title">{{collegeLevel[info.college_level] || ''}} {{property[info.property] || ''}}</view>
					</view>
					<view class="item">
						<view class="iconfont icon-location-active"></view>
						<view class="title">{{info.province || ''}} {{info.city || ''}} {{info.district || ''}}</view>
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
			info:{
				type:Object,
				default:() => {}
			}
		},
		data(){
			return {
				property:{
					'public':'公办',
					'private':'民办',
					'unite':'联办',
					'international_public':'国际公立',
					'international_private':'国际私立'
				},
				collegeLevel:{
					'secondary': '中专',
					'junior': '大专',
					'undergraduate': '本科',
					'master':'研究生',
					'early':'早教托管'
				},
			}
		},
		methods:{
			//标签点击
			labelClick(){
				uni.showToast({
				    title: '当前院校已加入平台助学计划',
					icon:'none',
					position:'top',
				    duration: 3000
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.schoolCard{
		background: #fff;
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
		.item-left{
			image{
				@include w-h-br(80rpx);
			}
		}
		.item-right{
			margin-left: 20rpx;
			.top-name{
				display: flex;
				align-items: center;
				
				.name{
					font-weight: bold;
					margin-right: 20rpx;
					@include line-clamp-more;
				}
				.label{
					font-size: 20rpx;
					border: 1rpx solid #E15842;
					color: #E15842;
					padding: 6rpx 10rpx;
					border-radius: 10rpx;
					margin-left:10rpx;
					white-space: nowrap;
				}
			}
			.bottom-info{
				margin: 10rpx 0;
				.item{
					display: flex;
					align-items: center;
					color: #666;
					.iconfont{
						margin-right: 10rpx;
						font-size: 30rpx;
					}
					.title{
						font-size: 26rpx;
					}
				}
			}
		}
	}
</style>
