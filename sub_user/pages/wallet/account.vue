<template>
	<view class="accountList">
		<block v-if="list && list[0]">
			<view class="box" v-for="(item,index) of list" :key='index' @click="accountDetail(item)">
				<view :class="['iconfont',item.type === 'withdraw' || item.type === 'return_withdraw' ? 'icon-tixiang' : 'icon-zhuxuejin']"></view>
				<view class="info">
					<view>
						<view class="title">{{type[item.type]}}</view>
						<view class="money">{{item.type === 'grants' ? '+' : ''}}{{item.amount}}</view>
					</view>
					<view>
						<view class="date">{{item.created_at}}</view>
						<view class="balance">余额：{{item.balance}}</view>
					</view>
				</view>
			</view>
		</block>
		<view v-if="list && !list[0]" class="none">
			暂无提现记录
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import { hideMenuItems } from '@/common/utils.js'
	import api from '@/common/api.js'
	export default{
		components:{
			
		},
		data(){
			return {
				list:null,
				current_page:1,
				last_page:0,
				type:{
					'withdraw':'提现',
					'grants':'助学计划',
					'return_grants':'助学计划失败退还',
					'return_withdraw':'提现失败退还'
				}
			}
		},
		onLoad(){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			this.getDataList()
		},
		methods:{
			getDataList(){
				uni.showLoading({
					title:'加载中'
				})
				let list = this.list || []
				this.$http({
					api: api.walletDetails,
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
			//账单详情
			accountDetail(item){
				if(item.type === 'withdraw' || item.type === 'return_withdraw'){
					uni.navigateTo({
						url:'/sub_adviser/pages/wallet/withdrawDetail?id=' + item.extra.withdraw_id
					})
				}else{
					uni.navigateTo({
						url:"/sub_user/pages/wallet/accountDetail?item=" + encodeURIComponent(JSON.stringify(item))
					})
				}
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
			.iconfont{
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
		.none{
			text-align: center;
			margin-top: 100rpx;
		}
</style>