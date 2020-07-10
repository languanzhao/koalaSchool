<template>
	<view class="">
		<!-- 顶部搜索栏 -->
		<view class="header">
			<view class="left">
				<view class="iconfont icon-search"></view>
				<input class="input" type="text" confirm-type="search" @confirm='searchClick' :value="inputVal" @input="searchInput" placeholder="请输入学校名称" placeholder-style="color:#E6F4F4;"/>
				<view class="cancel" v-if="inputVal" @click="cancelClick">×</view>
			</view>
			<view class="button" @click="cancelClick">取消</view>
		</view>
	</view>
</template>

<script>
	export default{
		components:{
			
		},
		data(){
			return {
				inputVal:''
			}
		},
		computed: {
			
		},
		onLoad(){
			
		},
		methods:{
			searchInput(e){
				let value = e.detail.value
				this.inputVal = value
				console.log(value,'value')
			},
			cancelClick(){
				this.inputVal = ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		background: $theme-color;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:20rpx;
		color:#E6F4F4;
		font-size: 30rpx;
		.left {
			display: flex;
			align-items: center;
			border-radius: 20rpx;
			margin-right: 10rpx;
			padding: 0 10rpx;
			flex: 1;
			background:#82CECB;
			position: relative;
			color:#E6F4F4;
			font-size: 26rpx;
			.input {
				padding: 10rpx;
				flex: 1;
				font-size: 26rpx;
			}
			.cancel {
				position: absolute;
				right: 10rpx;
				top: 50%;
				transform: translateY(-50%);
				font-size: 30rpx;
				background: rgba(0, 0, 0, .5);
				color: #fff;
				border-radius: 50%;
				width: 30rpx;
				height: 30rpx;
				line-height: 30rpx;
				text-align: center;
			}
		}
	    
	}
</style>
