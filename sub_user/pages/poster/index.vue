<template>
	<view class="poster">
		<view class="canvasBox">
			<canvas class="canvas" canvas-id="posterCanvas"></canvas>
		</view>
		<swiper class="swiper" previous-margin="40px" next-margin='40px' circular :current="current" @change="swiperChange">
			<swiper-item class="swiperItem" v-for="(item,index) of canvasImageList" :key='index'>
				<image :class="['canvasImage',current === index ? 'active' : '']" :src="item" mode=""></image>
			</swiper-item>
		</swiper>
		<view class="canvasBox">
			<canvas class="canvas" canvas-id="myCanvasTwo"></canvas>
			<canvas class="canvas" canvas-id="myCanvasOne"></canvas>
			<canvas class="canvas" canvas-id="myCanvasThree"></canvas>
		</view>
		<!-- #ifdef H5 -->
		<view class="" style="text-align: center;margin: 20rpx;" v-if="posterShow">长按图片可分享给好友</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
			<view class="fixed_bottom_btn_place" v-if="posterShow">
				<view class="fixed_bottom_btn" @click="downLoadPoster">
					<view class="word">
						保存图片
					</view>
				</view>
			</view>
			<!-- <view class="shareContent" v-if="canvasImageList[0]">
				<view class="shareTitle">分享到</view>
				<view class="shareList">
					<view class="item" @click="shareClick(0)">
						<image class="image" src="http://koala.gzzhongw.net/koala_images/login/wx01.png" mode=""></image>
						<view class="title">微信</view>
					</view>
					<view class="item" @click="shareClick(1)">
						<image class="image" src="http://koala.gzzhongw.net/koala_images/login/circle.png" mode=""></image>
						<view class="title">朋友圈</view>
					</view>
					<view class="item" @click="shareClick(2)">
						<text class="image iconfont icon-downLoad"></text>
						<view class="title">保存图片</view>
					</view>
				</view>
			</view> -->
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import uQRCode from '@/common/uqrcode.js'
	import { mapState } from 'vuex'
	import api from '@/common/api.js'
	import { checkAuthSetting,hideMenuItems } from '@/common/utils.js'
	export default {
		components: {},
		data() {
			return {
				posterShow:false,
				posterCanvasImage:'',
				current:0,
				canvasImageList:[]
			}
		},
		computed:{
			...mapState(['userInfo','roles'])
		},
		onLoad(options){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			
			// #ifdef H5
				this.make()
			// #endif
			
			// #ifdef MP-WEIXIN
				this.make_wx()
			// #endif
		},
		onReady() {
			
		},
		methods: {
			//微信小程序 下载海报
			downLoadPoster(){
				checkAuthSetting('scope.writePhotosAlbum').then(() => {
					uni.saveImageToPhotosAlbum({
						filePath: this.canvasImageList[this.current],
						success: function () {
							uni.showToast({
							    title: "保存成功, 可分享好友或朋友圈",
							    icon: "none"
							});
						},
						fail:err => {
							
						}
					})
				})
			},
			//微信小程序 生成小程序码
			make_wx(){
				let params = {
					page:'pages/index/index',
					scene:this.userInfo.koala.code ? this.userInfo.koala.code : this.userInfo.id
				}
				this.$http({
					api: api.weappcode,
					method: 'POST',
					params:params,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					}
				}).then(res => {
					uni.getImageInfo({
						src:res.data.path,
						success:path => {
							this.posterCanvasImage = path.path
							this.myCanvasOne('myCanvasTwo',this.$rootUrl + 'koala_images/poster/two.jpg')
							this.myCanvasOne('myCanvasOne',this.$rootUrl + 'koala_images/poster/one.jpg')
							this.myCanvasOne('myCanvasThree',this.$rootUrl + 'koala_images/poster/three.jpg')
						}
					})
				}).catch(err => {
							
				})
			},
			//生成二维码 h5 或 app
			make() {
				let url = this.$projectUrl
				if(this.roles[0]){
					url = url + '?invitedCode=' + this.userInfo.koala.code
				}
				  uQRCode.make({
					canvasId: 'posterCanvas',
					text:url,
					size: 300,
					success: info => {
					  uni.getImageInfo({
						src:info,
						success:res => {
							this.posterCanvasImage = info
							this.myCanvasOne('myCanvasTwo',this.$rootUrl + 'koala_images/poster/two.jpg')
							this.myCanvasOne('myCanvasOne',this.$rootUrl + 'koala_images/poster/one.jpg')
							this.myCanvasOne('myCanvasThree',this.$rootUrl + 'koala_images/poster/three.jpg')
						}
					  })
					}
				  })
			},
			//切换图片
			swiperChange(e) {
				this.current = e.detail.current;
			},
			//分享点击操作
			shareClick(index){
				if(this.canvasImageList.length > 0){
					if(index === 0){
						this.shareWx()
					}else if(index === 1){
						this.shareCircle()
					}else if(index === 2){
						this.saveImage()
					}
				}
			},
			//分享到微信
			shareWx(){
				// #ifdef APP-PLUS
					uni.share({
						provider: "weixin",
						scene: "WXSceneSession",
						type: 2,
						imageUrl: this.canvasImageList[this.current],
						success: function (res) {
							
						},
						fail: function (err) {
							
						}
					});
				// #endif
				
				// #ifdef MP-WEIXIN
					uni.showModal({
						title:'提示',
						content:'长按可以分享给好友或者保存图片到相册',
						showCancel:false,
						success:() => {
							uni.previewImage({
								current: this.canvasImageList[this.current], 
								urls: this.canvasImageList
							})
						}
					})
				// #endif
			},
			//分享到朋友圈
			shareCircle(){
				// #ifdef APP-PLUS
					uni.share({
						provider: "weixin",
						scene: "WXSenceTimeline",
						type: 2,
						imageUrl: this.canvasImageList[this.current],
						success: function (res) {
							
						},
						fail: function (err) {
							
						}
					});
				// #endif
				
				// #ifdef MP
					this.saveImage()
				// #endif
			},
			//保存图片
			saveImage(){
				// #ifndef H5
					uni.saveImageToPhotosAlbum({
						filePath: this.canvasImageList[this.current],
						success: function () {
							uni.showModal({
								title:'提示',
								content:'成功保存图片到相册，赶紧分享给好友或者发朋友圈吧！',
								showCancel:false,
								success:() => {}
							})
						}
					});
				// #endif
				
				// #ifdef H5
					uni.showToast({
						icon:'none',
						title:'长按图片保存即可'
					})
				// #endif
			},
			myCanvasOne(canvasId,bg) {
				uni.showLoading({
					title: '生成中...'
				})
				uni.getImageInfo({
					src:bg,
					success:bgRes => {
						var context = uni.createCanvasContext(canvasId,this)
						context.fillRect(0, 0, 300, 420)
						//顶部图片
						context.drawImage(bgRes.path, 0, 0, 305, 420)
						if(this.roles[0]){
							// 邀请码
							context.setFontSize(14)
							context.setFillStyle('#fff')
							context.setTextAlign('center')
							context.fillText('邀请码', 150, 370)
							context.stroke()
							//白色背景
							context.setFillStyle('#fff')
							context.fillRect(90, 380, 120, 20)
							//（AVE788X）
							context.setFontSize(14)
							context.setFillStyle('#000')
							context.setTextAlign('center')
							context.fillText(this.userInfo.koala.code, 150, 395)
							context.stroke()
						}
						// 小程序码
						context.setFillStyle('#fff')
						context.fillRect(95, 230, 110, 110)
					
						if(this.posterCanvasImage){
							context.drawImage(this.posterCanvasImage, 105, 240,90, 90)
						}
						context.stroke()
						//绘制
						context.draw()
						//生成图片
						setTimeout(() => {
							uni.canvasToTempFilePath({
								canvasId: canvasId,
								success: res => {
									this.canvasImageList.push(res.tempFilePath)
									uni.hideLoading()
									this.posterShow = true
								}
							});
						}, 500)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.posterCanvas{
		width: 200rpx;
		height: 200rpx;
	}
	.poster {
		.swiper{
			width: 100%;
			height: 480px;
			background: #fafafa;
			.swiperItem{
				display: flex;
				justify-content: center;
				align-items: center;
				.canvasImage{
					width: 300px;
					height: 400px;
					margin: auto 30rpx;
				}
				.active {
					transform: scale(1.08);
					transition: all 0.2s ease-in 0.2s;
				}
			}
		}
		.canvasBox{
			position: fixed;
			left: 0;
			top: 9999rpx;
			width: 300px;
			height: 420px;
			.canvas{
				width: 100%;
				height: 100%;
			}
		}
		.shareContent{
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			padding-bottom: 30rpx;
			.shareTitle{
				font-weight: bold;
				font-size: 32rpx;
				text-align: center;
				margin-bottom: 30rpx;
			}
			.shareList{
				display: flex;
				align-items: center;
				justify-content: space-around;
				.item{
					text-align: center;
					.image{
						width: 50rpx;
						height: 50rpx;
					}
					.icon-downLoad{
						color: #0071FF;
						font-size: 50rpx;
					}
				}
			}
			
		}
	}
</style>
