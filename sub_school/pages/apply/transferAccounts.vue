<template>
	<view>
		<view class="transferAccounts">
		<transfer-info :transferObj="transferObj"></transfer-info>
		<view style="padding:30rpx 20rpx 0;">
			<view class="uploadTitle">上传凭证</view>
			<view class="localImage" >
				<image v-if="voucherObj.id" @click="getPreview"   class="image" :src="voucherObj.localImage" mode=""></image>
				<view class="uploadTip" @click="upload" v-else>
					<view class="iconfont icon-paizhao"></view>
				</view>
				<view v-if="voucherObj.id" class="iconfont icon-delete" @click="deleteImage"></view>
			</view>
		</view>
		</view>
		<view class="bottom">
			<view class="tip" v-if="schoolInfo.sInfo.type === 'tutoring'">上传凭证信息务必留有清晰的流水号、机构账户，转账金额</view>
			<view class="tip" v-if="schoolInfo.sInfo.type != 'tutoring'">上传凭证信息务必有清晰的流水号、院校账户，转账金额</view>
			<view class="btn" @click="submit">确定</view>
		</view>
	</view>
</template>

<script>
import uploadImgs from '@/components/upload-imgs/index';
import { copyValue } from '@/common/utils.js';
import transferInfo from './components/transferInfo'
import { uploadImage } from '@/common/utils.js'
import api from '@/common/api.js'
export default {
	components: {
		uploadImgs,
		transferInfo
	},
	data() {
		return {
			imgList: '',
			schoolInfo:{},
			transferObj:{},
			voucherObj:{},
			updateBool:false,
		};
	},
	onLoad(options){
		if(options.info){
			const info = JSON.parse(decodeURIComponent(options.info))
			this.transferObj = {
				name:info.sInfo.name,
				avatar:info.sInfo.avatar,
				transferList:[
					{
						key:'支付方式',
						value:'转账支付'
					},
					{
						key:'对公账户',
						value:info.tInfo.corporate_account.account_name
					},
					{
						key:'银行账号',
						value:info.tInfo.corporate_account.account_number
					},
					{
						key:'开户银行',
						value:info.tInfo.corporate_account.deposit_bank
					},
					{
						key:'联系老师',
						value:info.tInfo.contact_name
					},
					{
						key:'联系电话',
						value:info.tInfo.contact_phone
					}
				]
			}
			this.schoolInfo = info
			if(options.updateBool){
				this.updateBool = true
			}
		}
	},
	methods: {
		//复制
		copyBtn(val) {
			copyValue(val);
		},
		upload(){
			uploadImage('voucher').then((res,res2) => {
				this.voucherObj = res
			})
		},
		deleteImage(){
			this.voucherObj = {}
		},
		//预览
		getPreview(){
				let localImage = []
				 localImage.push(this.voucherObj.localImage)
				uni.previewImage({
					urls: localImage,
					current: localImage[0],
				})
		},
		submit(){
			let { sInfo,tInfo,majorObj,applyId } = this.schoolInfo
			if(this.voucherObj.id){
				let apiUrl = ''
				let params = {
					payment_method:'bank_transfer',
					image_id:this.voucherObj.id
				}
				if(this.updateBool){
					//修改报名
					apiUrl = api.userApplications + '/' + applyId
					params._method = 'PATCH'
				}else{
					//报名申请
					if(sInfo.type === 'tutoring'){
						apiUrl = api.trainApply
						params.apply_info_id = sInfo.apply_info_id
					}else{
						apiUrl = api.userApplications
					}
					params.school_id = sInfo.id
					params.total_amount = majorObj.tuition
					params.major_id = majorObj.id
				}
				this.$http({
					api: apiUrl,
					method: 'POST',
					params:params,
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					}
				}).then(res => {
					// #ifdef H5
						uni.redirectTo({
							url:'/sub_user/pages/progress/index?type=2&&id=' + res.data.id
						})
					// #endif
					
					// #ifndef H5
						uni.reLaunch({
							url:'/sub_user/pages/progress/index?type=2&&id=' + res.data.id
						})
					// #endif
				}).catch(err => {
						if(err.statusCode === 400){
							uni.showToast({
								icon:'none',
								title:err.data.message
							})
						}
				})
			}else{
				uni.showToast({
					icon:'none',
					title:'请上传凭证'
				})
			}
		},
	},
};
</script>
<style lang="scss">
	page {
		background: #f1f1f1;
	}
</style>
<style lang="scss" scoped>

.transferAccounts {
	padding: 40rpx 40rpx 200rpx;
	background: #fff;
	.header {
		text-align: center;
		image {
			@include w-h-br(80rpx);
			margin-bottom: 16rpx;
		}
	}
	.content {
		margin-top: 24rpx;
		padding: 20rpx 40rpx;
		border-top: 1rpx solid #f0f0f0;
		border-bottom: 1rpx solid #f0f0f0;
		.item {
			display: flex;
			align-items: center;
			// padding: 10rpx 0;
			margin-top: 20rpx;
			.left {
				color: #787878;
				width: 26rpx;
				width: 150rpx;
			}
			.right {
				flex: 1;
				margin-left: 80rpx;
				color: #000;
				width: 28rpx;
				// .copy{
				// 	margin-left: 10rpx;
				// 	color: blue;
				// }
			}
		}
	}
	.uploadTitle {
		font-size: 30rpx;
		color: #060606;
		font-weight: bold;
		margin-bottom: 30rpx;
	}
	.localImage{
		width: 208rpx;
		height: 208rpx;
		position: relative;
		.uploadTip{
			width: 208rpx;
			height: 208rpx;
			line-height: 208rpx;
			border: 1rpx solid #f0f0f0;
			.icon-paizhao{
				text-align: center;
				font-size: 50rpx;
				color: #787878;
			}
		}
		.icon-delete{
			position: absolute;
			right: -20rpx;
			top: -20rpx;
			width: 40rpx;
			height: 40rpx;
			font-size: 40rpx;
			color: red;
		}
	}
}
.bottom {
	position: fixed;
	bottom: 36rpx;
	width:100%;
	.tip {
		font-size: 20rpx;
		color: #333;
		margin-bottom: 10rpx;
		text-align: center;
	}
	.btn{
		display:flex;
		align-items: center;
		justify-content: center;
		width:584rpx;
		height:80rpx;
		border-radius:10rpx;
		background:$theme-color;
		color:#fff;
		font-size:30rpx;
		margin:0 auto;
	}
}
</style>
