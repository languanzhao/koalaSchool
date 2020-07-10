<template>
	<view class="list">
		<view class="item" v-for="(item,index) of list" :key='index' @click="goDetail(item.id)" v-if="list && list[0]" >
			<apply-process :item='item'></apply-process>
			<view class="detail">详情</view>
		</view>
		<view v-if="list && !list[0]" class="noneNull">
			暂无记录
		</view>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	import applyProcess from '@/components/applyProcess'
	export default{
		components:{
			applyProcess
		},
		data(){
			return {
				list:null,
				current_page:1,
				last_page:null,
			}
		},
		computed: {
			
		},
		onLoad(){
			this.getDataList()
		},
		methods:{
			getDataList(){
				uni.showLoading({
					title:'加载中'
				})
				let list = this.list || []
				this.$http({
					api: api.userApplications,
					method: 'GET',
					params:{
						page:this.current_page
					}
				}).then(res => {
					uni.hideLoading()
					this.list = list.concat(res.data.data || [])
					this.current_page = res.data.meta.current_page
					this.last_page = res.data.meta.last_page
				}).catch(err => {
					uni.hideLoading()
				})
			},
			goDetail(id){
				uni.navigateTo({
					url: "/sub_user/pages/progress/index?type=2&&id=" + id
				})
			}
		},
		onPullDownRefresh() {
			if(this.list[0]){
				   this.current_page = 1
				   this.last_page = 0
				   this.list = null
				   this.getDataList()
			}
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom(){
			if(this.current_page < this.last_page){
				this.current_page = this.current_page + 1
				this.getDataList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list{
		.item{
			box-shadow: 0 0 8rpx #ccc;
			border-radius: 10rpx;
			margin: 20rpx;
			padding:10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.detail{
				color: $theme-color;
				margin-right: 20rpx;
			}
		}
	}
</style>
