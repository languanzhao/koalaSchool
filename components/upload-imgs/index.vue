<template>
	<view class="upload-imgs">
			<view class="item" v-for="(item,index) of imgList" :key='index'>
				<image class="image" :src="item.path" mode="" @click="previewImage(item.path)"></image>
				<view class="del" @click="delItem(item.id,index)" v-if="!disabled">×</view>
			</view>
			<view class="item upload-btn" @click="upload" v-if="!disabled && (length && imgList.length < length)">+</view>
	</view>
</template>

<script>
	import { uploadImage } from '@/common/utils.js'
	export default {
		props:{
			uploadId:{
				type:Number,
				default:0,
			},
			value:{
				type:Array,
				default:() => []
			},
			//限制上传图片数量
			length:{
				type:Number,
				default:2
			},
			disabled:{
				type:Boolean,
				default:false
			},
			count:{
				type:Number,
				default:1
			}
		},
		data(){
			return {
				imgList:[]
			}
		},
		methods:{
			//上传图片
			upload(){
				let resideLength = this.length - this.imgList.length
				let count = this.count
				if(resideLength - count < 0){
					count = resideLength
				}
				uploadImage('task').then((res) => {
					this.imgList.push(res)
					this.$emit('upload',{imageId:res.id,uploadId:this.uploadId,path:res.path})
				})
				// uni.chooseImage({
				//     count: count, //默认9
				//     sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				//     sourceType: ['album','camera'], //从相册选择或者拍摄
				//     success: res => {
				// 		let list = this.imgList.concat(res.tempFilePaths || [])
				// 		this.imgList = list
				// 		this.$emit('input',list.join(','))
				//     }
				// });
			},
			//删除某项
			delItem(id,index){
				this.imgList.splice(index,1)
				this.$emit('delete',{imageId:id,uploadId:this.uploadId})
			},
			//预览图片
			previewImage(path){
				uni.previewImage({
					current:path,
					urls:[path],
					indicator:'default'
				})
			}
		},
		watch:{
			value:{
				handler(val){
					if(val){
						let list = val.map((item,index)=>{
							return {
								path:item
							}
						})
						this.imgList = list
					}
				},
				immediate:true,//使父组件传过来的默认值第一次监听到
			}
		}
	}
</script>

<style lang="scss">
	.upload-imgs{
		display: flex;
		flex-wrap: wrap;
		.item{
			width: 160rpx;
			height: 160rpx;
			line-height: 160rpx;
			margin: 20rpx;
			position: relative;
			.image{
				width: 100%;
				height: 100%;
			}
			.del{
				position: absolute;
				top: -15rpx;
				right: -15rpx;
				font-size: 30rpx;
				width: 30rpx;
				height: 30rpx;
				border-radius: 50%;
				text-align: center;
				line-height: 30rpx;
				background: red;
				color: #fff;
			}
		}
		.upload-btn{
			display: flex;
			justify-content: center;
			flex-direction: column;
			border: 1px solid #ccc;
			text-align: center;
			color: #ccc;
			font-size: 100rpx;
		}
	}
</style>
