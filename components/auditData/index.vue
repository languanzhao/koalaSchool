<template>
	<view class="dataList">
		<view class="item" v-for='(item,index) of list' :key='index' @click="goDetail(item.id)">
			<image class="image" :src="item.src" mode=""></image>
			<view class="title">{{item.title}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			list:{
				type:Array,
				default:() => []
			}
		},
		components:{
			
		},
		data(){
			return {

			}
		},
		computed: {
			
		},
		onLoad(){
			
		},
		methods:{
			goDetail(id){
				uni.navigateTo({
					url:'/pages/dataDetail/index?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #f4f4f4;
	}
	.dataList{
		padding: 20rpx;
		.item{
			.image{
				width: 100%;
				height: 300rpx;
			}
			background: #fff;
			margin-bottom: 20rpx;
		}
	}
</style>
