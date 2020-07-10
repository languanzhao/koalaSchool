<template>
	<view class="bindwx">
		<view class="wxNumber">
			<view class="title">微信号</view>
			<input class="input" type="text" v-model="info.koala.weixin_account" placeholder="请填写微信号"/>
		</view>
		<view class="upload" @click="upLoad">
			<image class="image" :src="uQRCodeImage" mode="" v-if="uQRCodeImage"></image>
			<view v-else>
				<view class="iconfont icon-erweima image"></view>
				<view class="word">点击上传二维码</view>
			</view>
		</view>
		<view class="uQRCode">
		     <canvas class="canvas" canvas-id="posterCanvas"></canvas>
		</view>
		<view class="fixed_bottom_btn_place">
			<view class="fixed_bottom_btn">
				<view class="word" style="margin: 0 80rpx;" @click="submit">
					提交
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
	import { mapState } from 'vuex'
	import uQRCode from '@/common/uqrcode.js'
	import api from '@/common/api.js'
	export default{
		components:{
			
		},
		data(){
			return {
				info:{},
				uQRCodeImage:''
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad(){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			
			this.info = JSON.parse(JSON.stringify(this.userInfo))
			this.make(this.info.koala.weixin_qrcode)
		},
		methods:{
			//上传图片
			upLoad(){
				uni.chooseImage({
					count:1,
					success:res => {
						let header = {}
						let objToken = this.$store.state.objToken
						if(objToken && objToken.access_token){
							header.Authorization = objToken.token_type + ' ' + objToken.access_token
						}
						uni.showLoading({
							title:'上传中...'
						})
						uni.uploadFile({
							url: this.$baseUrl + api.qrread,
							filePath: res.tempFiles[0].path,
							header:header,
							name: 'qrcode_image',
							success: (uploadFileRes) => {
								let text = JSON.parse(uploadFileRes.data).text
								if(text){
									this.info.koala.weixin_qrcode = text
									this.make(text)
								}
								uni.hideLoading()
							},
							fail:err => {
								reject()
								uni.hideLoading()
							}
						})
					}
				})
			},
			//链接解析成图片
			make(path) {
				if(path){
					uQRCode.make({
					  canvasId: 'posterCanvas',
					  text:path,
					  size: 100,
					  success: info => {
						 this.uQRCodeImage = info
					  }
					})
				}
			},
			submit(){
				if(this.info.koala.weixin_account){
					if(this.info.koala.weixin_qrcode){
							let params = {
								'koala[weixin_account]':this.info.koala.weixin_account,
								'koala[weixin_qrcode]':this.info.koala.weixin_qrcode,
								_method:'PATCH'
							}
							this.$http({
								api: 'koala/v1/user',
								method: 'POST',
								params:params,
								header:{
									'Content-Type':'application/x-www-form-urlencoded'
								}
							}).then(res => {
								this.$store.commit('setUserInfo',res.data)
								uni.showToast({
									title:'提交成功',
									success:() => {
										setTimeout(() => {
											uni.navigateBack()
										},1000)
									}
								})
							}).catch(err => {
										
							})
					}else{
						uni.showToast({
							icon:'none',
							title:'请上传微信个人名片'
						})
					}
				}else{
					uni.showToast({
						icon:'none',
						title:'请填写微信号'
					})
				}
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
	.wxNumber{
		height: 100rpx;
		display: flex;
		line-height: 100rpx;
		background: #fff;
		margin: 20rpx 0;
		padding: 0 50rpx;
		.input{
			height: 70rpx;
			margin: auto 20rpx;
			background: #f4f4f4;
			width: 400rpx;
			padding: 0 10rpx;
			font-size: 26rpx;
		}
		
	}
	.upload{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 320rpx;
		background: #fff;
		.icon-erweima{
			margin: 0 auto;
		}
		.image{
			width: 130rpx;
			height: 130rpx;
			font-size: 130rpx;
			color: #7d7d7d;
		}
		.word{
			margin-top: 30rpx;
			font-size: 28rpx;
			color: #7d7d7d;
		}
	}
	.uQRCode{
		.canvas{
			position: fixed;
			top: 9999rpx;
			left: 0;
		}
	}
</style>
