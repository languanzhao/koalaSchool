<template>
	<view class="schoolCard">
		<view class="schoolAvatar">
			<view class="avatarImgBox u-skeleton-circle" v-if="avatarBool">
				<image :src="info.avatar" mode=""></image>
			</view>
			<view class="schoolInfo">
				<view class="detail_title u-skeleton-rect">{{info.name}}</view>
				<view class="labelList-tutoring">
					<view class="labelList-item u-skeleton-fillet" v-if="info.district || info.city">
						<text class="text" :style="{background:avatarBool ? '#ececec' : 'none',color:avatarBool ? '#000' : '#999'}">{{info.city || ''}} {{info.district || ''}}</text>
					</view>
					<view class="labelList-item u-skeleton-fillet" v-if="info.tags">
						<text class="text" :style="{background:avatarBool ? '#ececec' : 'none',color:avatarBool ? '#000' : '#999'}">{{info.tags}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		props: {
			info: {
				type: Object,
				default: () => {}
			},
			avatarBool:{
				type: Boolean,
				default:true
			}
		},
		data() {
			return {
				property: {
					'public': '公办',
					'private': '民办',
					'unite': '联办',
					'international_public': '国际公立',
					'international_private': '国际私立'
				},
				collegeLevel: {
					'secondary': '中专',
					'junior': '大专',
					'undergraduate': '本科',
					'master': '研究生',
					'early': '早教托管'
				},
			}
		},
		methods: {
			//标签点击
			labelClick() {
				uni.showToast({
					title: '当前院校已加入平台助学计划',
					icon: 'none',
					position: 'top',
					duration: 3000
				});
			},
		}
	}
</script>

<style lang="scss">
	.schoolCard {
		background: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-around;

		.schoolAvatar {
			display: flex;
			align-items: center;

			.avatarImgBox {
				@include w-h-br(80rpx);
				margin-left: 20rpx;
			}

			.schoolInfo {
				margin-left: 30rpx;
				.detail_title{
					font-weight: bold;
				}
				.item {
					text-align: center;

					.num {
						font-weight: bold;
						font-family: SourceHanSansCN;
					}

					.title {
						font-size: 24rpx;
					}
				}
				.labelList-tutoring{
					margin: 10rpx 0;
					.labelList-item {
						font-size: 24rpx;
						margin: 20rpx 0;
						.text{
							background: #ececec;
							border-radius: 10rpx;
							padding: 6rpx 10rpx;
						}
					}
				}
			}
		}
	}
</style>
