<template>
	<view class="task-list">
		<view class="header">
			<view class="task-list-title">上传任务完成截图</view>
			<view class="task-list-summary">简单动动手，轻松赢奖励</view>
		</view>
		<view class="list-item" v-for="(item,index) of taskList" :key='index' v-if="item.task.extra.condition.type === 'screenshot'">
			<view class="title">{{item.task.name}}</view>
			<view class="summary">{{item.task.extra.tips}}</view>
			<upload-imgs 
				@upload="upload" 
				@delete="deleteItem"
				:uploadId='item.id' 
				:value="item.extra && (item.status != 'pending' && item.status != 'failed') ? item.extra.screenshots : []"
				:disabled="item.status != 'pending' && item.status != 'failed'"
				></upload-imgs>
			<view class="submit" @click="submit(item.id,item.status)" :style="{'background':item.status === 'pending' || item.status === 'failed' ? '' : '#999'}">{{statusList[item.status]}}</view>
		</view>
	</view>
</template>
<script>
	import uploadImgs from '@/components/upload-imgs'
	import api from '@/common/api.js'
	export default{
		components:{
			uploadImgs
		},
		data(){
			return {
				taskList:[],
				imgList:[],
				uploadList:[],
				statusList:{
					'pending':'提交',
					'underway':'审核中',
					'success':'已完成',
					'failed':'提交',
					'received':'已完成',
				}
			}
		},
		computed: {
			
		},
		onLoad(){
			this.getTaskList()
		},
		methods:{
			getTaskList(){
				this.$http({
					api: api.taskList,
					method: 'GET',
					params:{
						type: 'grant'
					}
				}).then(res => {
					this.taskList = res.data
				})
			},
			upload(e){
				this.uploadList.push(e)
			},
			deleteItem(e){
				let index = this.uploadList.findIndex(item => item.imageId === e.imageId)
				if(index !== -1) this.uploadList.splice(index,1)
			},
			submit(id,status){
				//去完成
				if(status === 'pending' || status === 'failed'){
					console.log(this.uploadList,'uploadList')
					let items = []
					this.uploadList.forEach((item,index) => {
						if(item.uploadId === id){
							items.push(item)
						}
					})
					if(items.length > 0){
						let ids = items.map((item,index) => {
							return item.imageId
						})
						console.log(ids,'ids')
						this.$http({
							api: api.getTaskMoney + '/' + id,
							method: 'POST',
							params:{
								_method:'PATCH',
								task_image_ids:ids.join(',')
							}
						}).then(res => {
							this.getTaskList()
							uni.showToast({
								title:'提交成功'
							})
							this.uploadList = []
						})
					}else{
						uni.showToast({
							icon:'none',
							title:'请上传图片'
						})
					}
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
	.task-list{
		.header{
			text-align: center;
		}
		.task-list-title{
			font-weight: bold;
			font-size: 32rpx;
			margin-top: 30rpx;
			margin: 30rpx auto;
		}
		.task-list-summary{
			display: inline-block;
			padding: 10rpx 30rpx;
			background: #fff;
			border: 1px solid #666;
			border-radius: 30rpx;
			text-align: center;
		}
		.list-item{
			border-radius: 40rpx;
			background: #FFFFFF;
			padding: 30rpx;
			margin: 30rpx 0;
			.title{
				font-weight: bold;
				font-size: 34rpx;
			}
			.summary{
				color: #666;
				margin: 20rpx 0;
			}
			.submit{
				background: $theme-color;
				color: #fff;
				width: 200rpx;
				height: 60rpx;
				text-align: center;
				line-height: 60rpx;
				border-radius: 30rpx;
				margin: 0 auto;
			}
		}
	}
</style>
