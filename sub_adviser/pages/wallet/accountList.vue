<template>
	<view class="">
		<view class="tabList-place">
			<view class="tabList">
				<view :class="['item',current === index ? 'active' : '']" v-for="(item,index) of tabList" :key='index' @click="tabChange(index)">{{item.title}}</view>
			</view>
		</view>
		<!-- <view class="tips">
			累计差旅补助：50.000.00
		</view> -->
		<view class="accountList" v-for="(item,index) of list" :key='index' v-if="list && list[0]" >
			<view @click="detailLink(item.application_id)">
				<view class="personInfo">
					<view v-if="item.application.koala">
						<image :src="item.application.koala.avatar"></image>
						<view class="name">{{item.application.koala.name}}</view>
						<view class="type">{{userInfo.id === item.application.koala.parent_id ? '直邀' : '推荐'}}</view>
					</view>
					<view >
						<view class="kinds">差旅补助:</view>
						<view class="money">{{item.status === 'return' ? '-' : '+'}}{{item.total_amount}}</view>
					</view>
				</view>
				<apply-process :item='item.application'></apply-process>
			</view>
			<view class="billInfo">
				<view class="img" @click="copyNo(item.no)">
					<view>交易单号：{{item.no}}</view>
					<view class="iconfont icon-fuzhi"></view>
					<!-- <image src="http://koala.gzzhongw.net/koala_images/img/icon_bill.png"></image> -->
				</view>
				<view style="margin-top:16rpx;">支付时间：{{item.created_at}}</view>
			</view>
		</view>
		<view v-if="list && !list[0]" class="noneNull">
			暂无记录
		</view>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	import applyProcess from '@/components/applyProcess'
	import { copyValue } from '@/common/utils.js'
	import { mapState } from 'vuex'
	export default{
		components:{
			applyProcess
		},
		data(){
			return {
				list:null,
				current:0,
				tabList:[
					{
						title:'全部账单'
					},
					{
						title:'补助账单'
					},
					{
						title:'退款明细'
					}
				],
				current_page:1,
				last_page:0,
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		
		onLoad(){
			this.getDataList()
		},
		
		methods:{
			tabChange(index){
				this.current = index
				this.current_page = 1
				this.last_page = 0
				this.list = null
				this.getDataList()
			},
			getDataList(){
				let list = this.list || []
				let params = {
					page:this.current_page
				}
				if(this.current == 2){
					params.status = 'return'
				}else if(this.current == 1){
					params.status = 'success,freezing,failed'
				}
				
				this.$http({
					api: api.distributions,
					method: 'GET',
					params:params
				}).then(res => {
				    this.list = list.concat(res.data.data || [])
					this.current_page = res.data.meta.current_page
					this.last_page = res.data.meta.last_page
				}).catch(err => {
				})
			},
			detailLink(id){
				uni.navigateTo({
					url:'/sub_user/pages/progress/index?type=1&&id=' + id
				})
			},
			copyNo(no){
				copyValue(no)
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
<style lang="scss">
	page{
		background:#f1f1f1;
	}
</style>
<style lang="scss" scoped>
	.tabList-place{
		height:76rpx;
	}
	// tab顶部导航
	.tabList{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		display: flex;
		height:76rpx;
		color:#4c4c4c;
		font-size: 30rpx;
		.item{
			display: flex;
			align-items: center;
			justify-content: center;
			background:#fafafa;
			flex:1;
		}
		.active{
			background:#e7e7e7;
			color: $theme-color;
		}
	}
	
	// 顶部提示文字
	.tips{
		padding:14rpx 24rpx;
		background:#feff91;
		color:#333;
		font-size: 24rpx;
	}
	
	// old
	.invitedList{
		.invitedList-item{
			border-radius: 10rpx;
			.list-item{
				padding: 20rpx;
				margin: 20rpx;
				background: #fff;
			}
			//上部分
			.item-header{
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #ccc;
				padding: 20rpx 0;
				.item-header-left{
					display: flex;
					align-items: center;
					.image{
						@include w-h-br(80rpx);
						margin-right: 20rpx;
					}
				}
				.item-header-right{
					
				}
			}
		}
	}

	// new
	.accountList{
		background:#fff;
		padding:0 14rpx;
		color:#000;
		margin-bottom:20rpx;
		.personInfo,.schoolInfo{
			padding:20rpx 16rpx;
			display: flex;
			align-items: center;
			border-bottom:1px solid #F1F1F1;
			image{
				border:1px solid #F1F1F1;
			}
		}
		.personInfo{
			justify-content: space-between;
			view{
				display:flex;
				align-items: center;
				image{
					width: 70rpx;
					height: 70rpx;
					border-radius: 10rpx;
				}
				.name{
					font-size: 30rpx;
					margin-left:30rpx;
					margin-right:18rpx;
				}
				.type{
					padding:3rpx 10rpx;
					border:1px solid #12ACA8;
					font-size: 20rpx;
					color:#12acab;
					border-radius: 10rpx;
				}
				.kinds{
					font-size:24rpx;
				}
				.money{
					font-size: 28rpx;
				}
				
			}
		}
	    
		.schoolInfo{
			image{
				width: 140rpx;
				height:140rpx;
				border-radius: 50%;
				margin-right:56rpx;
			}
			view{
				.state{
					font-size: 34rpx;
					color:#000;
				}
				.name{
					color:#4c4c4c;
					font-size: 24rpx;
					margin:22rpx 0 16rpx;
				}
				.schedule{
					color:#858585;
					font-size:24rpx;
				}
			}
		}
	
	    .billInfo{
			padding:20rpx 16rpx;
			font-size: 24rpx;
			color:#4c4c4c;
			border-top:1px solid #F1F1F1;
			.img{
				display: flex;
				justify-content:space-between;
				align-items: center;
				.icon-fuzhi{
					font-size: 40rpx;
					margin-right:20rpx;
				}
			}
		}
	}	
</style>
