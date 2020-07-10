<template>
	<view class="upload-video">
		<view class="item" v-for="(item,index) of videoList" :key='index'>
			<view class="videoBox">
				<video class="video" :src="item"></video>
				<view class="video-click-null" @click="previewVideo(index)"></view>
			</view>
			<view class="del" @click="delItem(index)" v-if="!disabled">×</view>
		</view>
		<view class="item upload-btn" @click="upload" v-if="!disabled && (length && videoList.length < length)">
			<view>+</view>
			<view>视频</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			value:{
				type:String,
				default:null
			},
			//限制上传图片数量
			length:{
				type:Number,
				default:20
			},
			disabled:{
				type:Boolean,
				default:false
			},
			count:{
				type:Number,
				default:9
			}
		},
		data(){
			return {
				videoList:[]
			}
		},
		methods:{
			//上传视频
			upload(){
				let length = this.length - this.videoList.length 
				let count = this.count
				if(length - count < 0){
					count = length
				}
				uni.chooseVideo({
					count: count,
					sourceType: ['camera', 'album'],
					success:res => {
						this.videoList.push(res.tempFilePath)
						this.$emit('input',this.videoList.join(','))
					}
				});
			},
			//删除某项
			delItem(index){
				this.videoList.splice(index,1)
				this.$emit('input',this.videoList.join(','))
			},
			//预览视频
			previewVideo(index){
				
			}
		},
		watch:{
			value:{
				handler(val){
					if(val){
						this.videoList = val.split(',').map((item,index)=>{
							return item
						})
					}
				},
				immediate:true,//使父组件传过来的默认值第一次监听到
			}
		}
	}
</script>

<style lang="scss">
	.upload-video{
		display: flex;
		flex-wrap: wrap;
		.item{
			width: 160upx;
			height: 160upx;
			margin: 20upx;
			position: relative;
			.videoBox{
				position: relative;
				.video{
					width: 160upx;
					height: 160upx;
				}
				.video-click-null{
					position: absolute;
					top: 0;
					left: 0;
					width: 160upx;
					height: 160upx;
					z-index: 1;
				}
			}
			.del{
				position: absolute;
				top: -15upx;
				right: -15upx;
				z-index: 2;
				font-size: 30upx;
				width: 30upx;
				height: 30upx;
				border-radius: 50%;
				text-align: center;
				line-height: 30upx;
				background: red;
				color: #fff;
			}
		}
		.upload-btn{
			display: flex;
			justify-content: center;
			flex-direction: column;
			border: 1upx solid #ccc;
			text-align: center;
			color: #ccc;
			font-size: 30upx;
		}
	}
</style>
