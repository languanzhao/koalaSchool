<template>
	<view class="withdraw">
		<block v-if="list && list[0]">
			<view class="box" v-for="(item,index) of list" :key='index' @click="withdrawsDetail(item.id)">
				<view class="iconfont icon-tixiang"></view>
				<view class="info">
					<view>
						<view class="title">提现</view>
						<view class="money">-{{item.amount}}</view>
					</view>
					<view>
						<view class="date">{{item.created_at}}</view>
						<view class="balance">余额：{{item.balance}}</view>
					</view>
				</view>
			</view>
		</block>
		<view v-if="list && !list[0]" class="noneNull">
			暂无记录
		</view>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	export default{
		components:{
			
		},
		data(){
			return {
				list:null,
				current_page:1,
				last_page:0,
				status:{
					'pending':'提现中',
					'success':'提现成功',
					'fail':'提现失败'
				}
			}
		},
		computed: {
			
		},
		onLoad(){
			this.getDataList()
		},
		methods:{
			//获取提现列表
			getDataList(){
				uni.showLoading({
					title:'加载中'
				})
				let list = this.list || []
				this.$http({
					api: api.withdraws,
					method: 'GET',
					params:{
						page:this.current_page
					}
				}).then(res => {
				    this.list = list.concat(res.data.data || [])
					this.current_page = res.data.meta.current_page
					this.last_page = res.data.meta.last_page
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()		
				})
			},
			withdrawsDetail(id){
				uni.navigateTo({
					url:'/sub_adviser/pages/wallet/withdrawDetail?id=' + id
				})
			}
		},
		onPullDownRefresh() {
		   if(this.list){
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
		padding-top:10rpx;
	}
</style>
<style lang="scss" scoped>
		.box{
			display: flex;
			align-items: center;
			padding:22rpx 36rpx;
			background:#fff;
			.icon-tixiang{
				font-size: 80rpx;
				color: #666;
				margin-right: 20rpx;
			}
			.info{
				flex:1;
				color:#000;
				view{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.title{
						font-size:30rpx;
					}
					.money{
						font-size: 36rpx;
					}
					.date,.balance{
						font-size: 24rpx;
						margin-top:6rpx;
					}
					.date{
						color:#858585;
					}
				}
			}
		}
		
</style>
