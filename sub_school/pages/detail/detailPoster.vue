<template>
	<view class="detailPoster">
		<!-- 学校信息 -->
		<view class="schoolInfo module">
			<school-card :info="schoolInfo" v-if="schoolInfo.type === 'tutoring'"></school-card>
			<school-card-t :info="schoolInfo" v-if="schoolInfo.type != 'tutoring'"></school-card-t>
		</view>
		<!-- 自定义内容 -->
		<view class="" v-if="userInfo.koala.code">
			<view class="title" style="margin:10rpx 20rpx;font-weight: bold;">编辑推广文案</view>
			<view class="content module">
				<textarea class="textarea" v-model="textarea" placeholder="请输入内容" maxlength="80"/>
			</view>
		</view>
		<!-- 海报内容 -->
		<view class="canvasContent module">
			<view class="school_info" v-if="schoolInfo.type != 'tutoring'">
				<view class="name">{{schoolInfo.name}}</view>
				<view class="bottom-info">
					<view class="item">
						<view class="iconfont icon-xuesimao-active"></view>
						<view class="title">{{collegeLevel[schoolInfo.college_level] || ''}} {{property[schoolInfo.property] || ''}}</view>
					</view>
					<view class="item">
						<view class="iconfont icon-location-active" v-if="schoolInfo.province || schoolInfo.city || schoolInfo.district"></view>
						<view class="title">{{schoolInfo.province || ''}} {{schoolInfo.city || ''}} {{schoolInfo.district || ''}}</view>
					</view>
				</view>
			</view>
			<school-card :info="schoolInfo" :avatarBool="false" v-if="schoolInfo.type === 'tutoring'"></school-card>
			<view class="imageBox">
				<view class="bigImg">
					<image class="image" :src="currentImage" mode=""></image>
					<view class="wordContent">
						<view class="word">{{textarea}}</view>
						<view class="ercode">
							<image class="posterCanvasImage" :src="posterCanvasImage" mode=""></image>
							<view class="title" v-if="userInfo.koala.code">邀请码</view>
							<view class="code" v-if="userInfo.koala.code">{{userInfo.koala.code}}</view>
						</view>
					</view>
				</view>
				<view class="chooseImg">
					<image :src="item" :class="['image',currentImage === shareImgList[index]?'current':'']" v-for="(item,index) of shareImgList" :key='index' @click="chooseImg(index)"></image>
				</view>
			</view>
			<view class="canvasBox">
				<canvas class="canvas" canvas-id="ercodeCanvas"></canvas>
				<canvas class="canvas" canvas-id="posterCanvas"></canvas>
			</view>
		</view>
		<view class="posterBtn" @click="posterCanvas">
			<view class="word">生成海报</view>
		</view>
		<view class="poster-mask" @click="cancelMask" v-if="maskBool">
			<cover-view>
				<cover-image class="image" :src="posterImage" mode="" @click.stop=""></cover-image>
			</cover-view>
			
			<!-- #ifdef MP-WEIXIN -->
				<view class="share" @click.stop="downLoadPoster" v-if="posterShow">保存图片</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'
	import { mapState } from 'vuex'
	import { canvasText,getLocationSearchParams,checkAuthSetting } from '@/common/utils.js'
	import schoolCard from '@/components/school-card'
	import schoolCardT from '@/components/school-card/index-t'
	import api from '@/common/api.js'
	export default{
		components:{
			schoolCard,
			schoolCardT
		},
		data(){
			return {
				posterShow:false,
				currentImage:'',
				schoolInfo:{},
				textarea:'',
				posterCanvasImage:'',
				posterImage:'',
				maskBool:false,
				shareImgList:[],
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
				}
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad(options){
			if(options.info){
				this.schoolInfo = JSON.parse(decodeURIComponent(options.info))
				console.log(this.schoolInfo,'aaa')
				this.textarea = this.schoolInfo.description || '择校好难？你是没有使用考拉上学吧！收录百大院校，求学有考拉上学，我的前途不迷茫'
				this.getSchoolImages().then(() => {
					// #ifdef H5 || APP-PLUS
						this.make()
					// #endif
					// #ifdef MP-WEIXIN
						this.make_wx()
					// #endif
				})
			}
		},
		methods:{
			//微信小程序 生成小程序码
			make_wx(){
				let params = {
					page:'sub_school/pages/detail/index'
				}
				if(this.userInfo.koala.code){
					params.scene = this.schoolInfo.id + ',' + this.userInfo.koala.code
				}else{
					params.scene = this.schoolInfo.id
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
						}
					})
				}).catch(err => {
							
				})
			},
			//微信小程序 下载海报
			downLoadPoster(){
				checkAuthSetting('scope.writePhotosAlbum').then(() => {
					uni.saveImageToPhotosAlbum({
						filePath: this.posterImage,
						success: function () {
							uni.showToast({
							    title: "保存成功, 可分享好友或朋友圈",
							    icon: "none"
							});
						},
						fail:err => {
							
						}
					});
				})
			},
			//获取图片
			getSchoolImages(){
				return new Promise((resolve,reject) => {
					let list = this.imageList || []
					this.$http({
						api: api.schoolImages,
						method: 'GET',
						params:{
							page:1,
							school_id:this.schoolInfo.id
						}
					}).then(res => {
						let imgList = []
						let data = res.data.data
						if(data.length > 0){
							if(data.length >= 3){
								imgList = data.slice(0,3)
							}else{
								imgList = data.slice(0,data.length)
							}
							let list = imgList.map(item => {
								return item.image_url
							})
							this.shareImgList = list
							this.currentImage = list[0]
						}else{
							this.shareImgList = [this.$rootUrl + 'koala_images/poster/02.png',this.$rootUrl + 'koala_images/poster/01.png',this.$rootUrl + 'koala_images/poster/03.png']
							this.currentImage = this.shareImgList[0]
						}
					   resolve()
					}).catch(err => {
					   reject()
					})
				})
			},
			cancelMask(){
				this.maskBool = false
			},
			//生成学校详情二维码
			make() {
				let url = this.$projectUrl + '/#/sub_school/pages/detail/index?id=' + this.schoolInfo.id
				if(this.userInfo.koala.code){
					url = url + '&invitedCode=' + this.userInfo.koala.code
				}
			      uQRCode.make({
			        canvasId: 'ercodeCanvas',
			        text:url,
					size: 100,
			        success: info => {
					  uni.getImageInfo({
					  	src:info,
					  	success:res => {
					  		this.posterCanvasImage = info
							// if(!this.userInfo.koala.code){
							// 	this.posterCanvas()
							// }
					  	}
					  })
			        }
			      })
			},
			//选择图片
			chooseImg(index){
				this.currentImage = this.shareImgList[index]
			},
			//点击生成海报
			posterCanvas(){
				this.maskBool = true
				uni.showLoading({
					title: '生成中...'
				})
				uni.getImageInfo({
					src:this.currentImage,
					success:imagePath => {
						var context = uni.createCanvasContext('posterCanvas',this)
						context.setFillStyle('#fff')
						context.fillRect(0, 0, 270, 410)
						//大图片
						context.drawImage(imagePath.path, 0, 70, 270, 220)
						// 推广文案
						context.setFillStyle('#000')
						context.setFontSize(12)
						canvasText(context,this.textarea || '择校好难？你是没有使用考拉上学吧！收录百大院校，求学有考拉上学，我的前途不迷茫', 10, 310, 15)
						context.stroke()
						// 学校名称
						context.setFillStyle('#000')
						context.setFontSize(16)
						context.fillText(this.schoolInfo.name, 20, 20)
						context.stroke()
						// 学历层次 性质
						if(this.schoolInfo.type === 'tutoring'){
							if(this.schoolInfo.city || this.schoolInfo.district){
								context.setFillStyle('#666')
								context.setFontSize(12)
								context.fillText((this.schoolInfo.city || '') + ' ' + (this.schoolInfo.district || ''), 20, 42)
								context.stroke()
							}
							context.setFillStyle('#666')
							context.setFontSize(12)
							context.fillText(this.schoolInfo.tags || '', 20, 62)
							context.stroke()
						}
						if(this.schoolInfo.type != 'tutoring'){
							context.drawImage('/static/image/icon/icon_protype.png', 20, 32, 10, 10)
							context.setFillStyle('#666')
							context.setFontSize(12)
							context.fillText((this.collegeLevel[this.schoolInfo.college_level] || '') + ' ' + (this.property[this.schoolInfo.property] || ''), 36, 42)
							context.stroke()
							// 地址
							if(this.schoolInfo.province || this.schoolInfo.city || this.schoolInfo.district){
								context.drawImage('/static/image/icon/icon_area.png',21, 52, 8, 12)
								context.setFillStyle('#666')
								context.setFontSize(12)
								context.fillText((this.schoolInfo.province || '') + ' ' + (this.schoolInfo.city || '') + ' ' + (this.schoolInfo.district || ''), 36, 62)
								context.stroke()
							}
						}
						// context.drawImage('/static/image/icon/icon_protype.png', 20, 36, 10, 10)
						
										
						// 小程序码
						context.drawImage(this.posterCanvasImage, 210, 300, 50, 50)
						context.stroke()
						if(this.userInfo.koala.code){
							// 邀请码
							context.setFontSize(12)
							context.fillText('邀请码', 216, 370)
							context.stroke()
							//（AVE788X）
							context.setFontSize(12)
							context.fillText(this.userInfo.koala.code, 208, 390)
							context.stroke()
						}
						// context.setTextAlign('center')
						// #ifdef H5
							context.setFillStyle('#000')
							context.setFontSize(10)
							context.fillText('（长按可分享给好友）', 100, 400)
						// #endif
						
						//绘制
						context.draw()
						//生成图片
						setTimeout(() => {
							uni.canvasToTempFilePath({
								canvasId: 'posterCanvas',
								success: res => {
									this.posterImage = res.tempFilePath
									uni.hideLoading()
									this.posterShow = true
								}
							});
						}, 500)
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	page {
		background: $page-background;
	}
</style>
<style lang="scss" scoped>
	.module{
		background: #fff;
		margin: 20rpx;
		border-radius: 20rpx;
		padding: 10rpx;
	}
	// 学校信息
	.schoolInfo{
		
		.schoolInfo-top{
			.top-name{
				display: flex;
				align-items: center;
				image{
					@include w-h-br(80rpx);
				}
				.name{
					font-weight: bold;
					margin:0 20rpx;
				}
				.label{
					font-size: 20rpx;
					border: 1rpx solid #E15842;
					color: #E15842;
					padding: 6rpx 10rpx;
					border-radius: 10rpx;
					margin-left:10rpx;
				}
			}
			.bottom-info{
				display: flex;
				justify-content:space-around;
				flex-wrap: wrap;
				margin: 20rpx 0;
				.item{
					display: flex;
					align-items: center;
					color: #666;
					.iconfont{
						margin-right: 10rpx;
						font-size: 40rpx;
					}
				}
			}
		}
		.schoolInfo-bottom{
			.item{
				display: flex;
				justify-content: space-between;
				padding: 20rpx 0;
				position: relative;
				&:nth-child(2){
					border-bottom: 1rpx solid #f5f5f5;
				}
				.icon-yiwen{
					position: absolute;
					left: -40rpx;
					top: 50%;
					transform: translateY(-50%);
					width: 40rpx;
					height: 40rpx;
				}
				.title{
					display: flex;
					align-items: center;
				}
				.right{
					color: #666;
					.icon-you{
						color: #000;
						font-weight: bold;
						margin-left: 10rpx;
					}
				}
			}
		}
	}
	//自定义内容
	.content{
		.textarea{
			width: 100%;
			height: 200rpx;
		}
	}
	//海报内容
	.canvasContent{
		.school_info{
			padding: 20rpx;
			margin-left: 20rpx;
			.name{
				font-weight: bold;
			}
			.bottom-info{
				.item{
					display: flex;
					align-items: center;
					color: #666;
					.iconfont{
						color: #666;
					}
					.title{
						margin-left: 10rpx;
						font-size: 26rpx;
					}
				}
			}
		}
		.imageBox{
			display: flex;
			.bigImg{
				flex: 1;
				margin:0 20rpx;
				.image{
					height: 400rpx;
				}
				.wordContent{
					display: flex;
					.word{
						flex: 1;
						margin: 0 20rpx;
						white-space: wrap;
						word-break:break-all;
						font-size: 22rpx;
					}
					.ercode{
						font-size: 26rpx;
						text-align: center;
						.posterCanvasImage{
							width: 100rpx;
							height: 100rpx;
						}
					}
				}
			}
			.chooseImg{
				width: 124rpx;
				.image{
					width: 120rpx;
					height: 120rpx;
					border: 2px solid #fff;
				}
			}
			.current{
				border-color:$theme-color!important;
			}
		}
		
		.canvasBox{
			position: fixed;
			left: 0;
			top: 9999rpx;
			width: 270px;
			height: 420px;
			.canvas{
				width: 100%;
				height: 100%;
			}
		}
	}
	.posterBtn{
		margin: 20rpx;
		.word{
			background:$theme-color;
			padding: 20rpx;
			border-radius: 20rpx;
			width: 100%;
			text-align: center;
			color: #fff;
		}
	}
	.poster-mask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.7);
		z-index: 100;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.image{
			width: 270px;
			height: 400px;
		}
		.share{
			width: 270px;
			padding: 20rpx 0;
			border-radius: 50rpx;
			margin-top: 30rpx;
			background:$theme-color;
			color: #fff;
			text-align: center;
		}
	}
</style>
