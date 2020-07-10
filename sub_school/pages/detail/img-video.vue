<template>
	<view class="list">
		<view class="schoolList-one">
			<view class="schoolList-item" v-for="(item, index) of totalList" :key="index">
				<view class="item-padding">
					<view class="top">
						<view class="schoolName">{{ item.title }}</view>
					</view>
					<view class="frontImage">
						<swiper class="swiper" circular v-if="item.hasOwnProperty('image_url')">
							<swiper-item class="swiperItem" v-for="(iitem, iindex) of item.items" :key="iindex">
								<image class="image" :src="iitem.image_url"></image>
								<view class="indicator-dots" v-if="item.items">{{iindex+1}}/{{item.items.length}}</view>
								<view class="summary">{{ iitem.description || '' }}</view>
							</swiper-item>
						</swiper>
						<view class="" v-if="item.hasOwnProperty('video_url')">
							<video class="video" :poster="item.cover_url" @play="playOrStop(index)" :id="String(index)" :src="item.video_url"
							 controls></video>
							<view class="summary">{{ item.description }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fixed-bottom-btn-two">
			<view class="fixed-bottom-btn">
				<view class="left" @click="jumpChat">联系咨询</view>
				<view class="right" @click="jumpApply">我要报名</view>
			</view>
		</view>
		<!-- <view class="button">
			<view class="btnContact" @click="jumpChat">联系咨询</view>
			<view class="btnApply" @click="jumpApply">我要报名</view>
		</view> -->
	</view>
</template>

<script>
	import api from '@/common/api.js';
	import {
		schoolInfoToLink
	} from '@/common/utils.js'
	export default {
		components: {},
		data() {
			return {
				detail: {},
				totalList: [],
				videoList: [],
				video_current_page: 1,
				video_last_page: null,
				imageList: [],
				image_current_page: 1,
				image_last_page: null,
				videoContext: {},
				schoolId: null
			};
		},
		onLoad(options) {
			if (options.schoolId) {
				this.schoolId = Number(options.schoolId);
				this.getDataList()
				this.getDetail()
			}
		},
		onReady() {},
		methods: {
			getDetail() {
				this.$http({
					api: api.getSchoolList + '/' + this.schoolId,
					method: 'GET',
				}).then(res => {
					this.detail = res.data
				}).catch(err => {

				})
			},
			// 联系咨询
			jumpChat() {
				uni.navigateTo({
					url: '/pages/news/chat?schoolId=' + this.schoolId
				})
			},

			// 我要报名
			jumpApply() {
				schoolInfoToLink(this.detail)
			},
			getDataList() {
				this.getSchoolVideos().then(() => {
					this.getSchoolImages().then(() => {
						this.crossArray();
					});
					this.videoContext = {};
					for (let i = 0; i < this.videoList.length; i++) {
						this.videoContext[i] = uni.createVideoContext(String(i));
					}
				});
			},
			getSchoolImages() {
				return new Promise((resolve, reject) => {
					let list = this.imageList || [];
					this.$http({
							api: api.schoolImages,
							method: 'GET',
							params: {
								page: this.image_current_page,
								school_id: this.schoolId
							}
						})
						.then(res => {
							this.imageList = list.concat(res.data.data || []);
							this.image_current_page = res.data.meta.current_page;
							this.image_last_page = res.data.meta.last_page;
							resolve();
						})
						.catch(err => {
							reject();
						});
				});
			},
			getSchoolVideos() {
				return new Promise((resolve, reject) => {
					let list = this.videoList || [];
					this.$http({
							api: api.schoolVideos,
							method: 'GET',
							params: {
								page: this.video_current_page,
								school_id: this.schoolId
							}
						})
						.then(res => {
							this.videoList = list.concat(res.data.data || []);
							this.video_current_page = res.data.meta.current_page;
							this.video_last_page = res.data.meta.last_page;
							resolve();
						})
						.catch(err => {
							reject();
						});
				});
			},
			//交叉合并数组
			crossArray() {
				let totalLength = this.imageList.length + this.videoList.length;
				let arr = [];
				for (var i = 0; i <= totalLength; i++) {
					if (this.imageList[i]) {
						arr.push(this.imageList[i]);
					}
					if (this.videoList[i]) {
						arr.push(this.videoList[i]);
					}
				}
				this.totalList = arr;
				console.log(this.totalList, 'totalList');
			},
			playOrStop(index) {
				for (let i = 0; i < this.videoList.length; i++) {
					if (index === i) {
						this.videoContext[index].play();
						// this.$nextTick(function() {
						// 	this.videoContext[id].requestFullScreen({direction:0});
						// });
					} else {
						this.videoContext[i].pause();
					}
				}
			}
		},
		onPullDownRefresh() {
			if (this.totalList) {
				this.image_current_page = 1;
				this.video_current_page = 1;
				this.image_last_page = null;
				this.video_last_page = null;
				this.imageList = [];
				this.videoList = [];
				this.totalList = [];
				this.getDataList();
			}
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			let imageBool = false,
				videoBool = false;
			if (this.image_current_page < this.image_last_page) {
				this.image_current_page = this.image_current_page + 1;
				imageBool = true;
			}
			if (this.video_current_page < this.video_last_page) {
				this.video_current_page = this.video_current_page + 1;
				videoBool = true;
			}
			if (imageBool || videoBool) {
				this.getDataList();
			}
		}
	};
</script>
<style lang="scss">
	page {
		background: $page-background;
	}
</style>
<style lang="scss" scoped>
	//布局一
	.schoolList-one {
		color: #0c0c0c;
		width: 720rpx;
		margin: 24rpx auto 200rpx;
		border-radius: 20rpx;

		.schoolList-item {
			background: #fff;
			margin-bottom: 24rpx;
			border-radius: 20rpx;

			.top {
				display: flex;
				align-items: center;
				border-top-left-radius: 20rpx;
				border-top-right-radius: 20rpx;

				.imageBox {
					image {
						@include w-h-br(80rpx);
					}
				}

				.schoolName {
					// margin-left: 20rpx;
					padding: 30rpx 20rpx;
					font-size: 30rpx;
				}
			}

			.frontImage {
				width: 100%;
				height: 540rpx;
				position: relative;

				.swiper {
					width: 100%;
					height: 540rpx;

					.swiperItem {
						position: relative;
						width: 100%;
						height: 540rpx;

						.indicator-dots {
							position: absolute;
							right: 10rpx;
							top: 370rpx;
							background: rgba(0, 0, 0, 0.8);
							border-radius: 30rpx;
							padding: 4rpx 20rpx;
							color: #fff;
							font-size: 23rpx;
						}
					}

					.image {
						width: 100%;
						height: 420rpx;
					}
				}

				.video {
					width: 100%;
					height: 420rpx;
				}

			}

			.center {
				display: flex;
				justify-content: space-between;
				border-bottom-left-radius: 20rpx;
				border-bottom-right-radius: 20rpx;

				.article-title {
					// font-weight: bold;
					font-size: 24rpx;
					padding: 30rpx 20rpx;
				}

				.enrollmentBox {
					margin: 20rpx 0;

					.article-title {
						// font-weight: bold;
					}
				}
			}

			.summary {
				@include line-clamp-more(2);
				margin: 10rpx;
				font-size: 24rpx;
			}
		}
	}

	.item-padding {
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}

	//布局一

	.fixed-bottom-btn {
		background: transparent!important;
	}
</style>
