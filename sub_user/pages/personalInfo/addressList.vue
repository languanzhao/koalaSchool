<template>
	<view class="list">
		<view class="item" v-for="(item,index) of list" :key='index' @longpress="longtap(item.id)" v-if="list && list[0]">
			<view class="left" @click="chooseClick(item)">
				<view class="name">{{item.contact_name}}<text class="phone">{{item.contact_phone}}</text></view>
				<view class="address">{{item.full_address}}</view>
			</view>
			<view class="edit iconfont icon-edit" @click="addOrUpdate(item)"></view>
		</view>
		<view class="noneNull" v-if="list && !list[0]">
			暂无信息
		</view>
		<!-- 删除提示 -->
		<uni-popup ref='uniPopupRefund'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">提示</view>
				<view class="uniPopup-summary" style="text-align: center;">确认删除？</view>
				<view class="uniPopup-buttons">
					<view class="cancel" @click="$refs.uniPopupRefund.close()">取消</view>
					<view class="confirm" @click="refundApi">确定</view>
				</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupRefund.close()"></view>
			</view>
		</uni-popup>
		<view class="fixed_bottom_btn_place" @click="addOrUpdate">
			<view class="fixed_bottom_btn">
				<view class="word">
					新增
				</view>
			</view>
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
				back:false,
				id:'',
				list:null,
				current_page:1,
				last_page:null,
			}
		},
		computed: {
			
		},
		onLoad(options){
			if(options.back){
				this.back = true
			}
			uni.$on('refresh',() => {
				this.reset()
			})
			this.getDataList()
		},
		onUnload(){
			uni.$off('refresh')
		},
		methods:{
			reset(){
				this.current_page = 1
				this.last_page = 0
				this.list = null
				this.getDataList()
			},
			getDataList(){
				uni.showLoading({
					title:'加载中'
				})
				let list = this.list || []
				this.$http({
					api: api.addressInfo,
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
			addOrUpdate(item){
				let url = '/sub_user/pages/personalInfo/address'
				if(item){
					url += '?item=' + JSON.stringify(item)
				}
				uni.navigateTo({
					url
				})
			},
			longtap(id){
				this.id = id
				this.$refs.uniPopupRefund.open()
			},
			refundApi(){
				if(this.id){
					this.$http({
						api: api.addressInfo + '/' + this.id,
						method: 'POST',
						params:{
							_method:'DELETE'
						},
						header:{
							'Content-Type':'application/x-www-form-urlencoded'
						}
					}).then(res => {
						this.$refs.uniPopupRefund.close()
						uni.showToast({
							icon:'none',
							title:'删除成功',
							success:() => {
								this.reset()
							}
						})
					}).catch(err => {
								
					})
				}
			},
			chooseClick(item){
				if(this.back){
					let pages = getCurrentPages();  //获取所有页面栈实例列表
					let prevPage
					// #ifdef MP-WEIXIN  
					   prevPage = pages[pages.length - 2].$vm;  
					// #endif 
					 // #ifndef MP-WEIXIN
						prevPage = pages[ pages.length - 2 ];  //上一页页面实例
					 // #endif
					prevPage.addressInfo = item
					uni.navigateBack()
				}
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
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-shadow: 0 0 8rpx #ccc;
			border-radius: 10rpx;
			margin: 30rpx;
			padding: 30rpx;
			.name{
				font-size: 32rpx;
				font-weight: bold;
				.phone{
					font-weight: normal;
					margin-left: 30rpx;
				}
			}
			.left{
				max-width: 500rpx;
			}
			.address{
				@include line-clamp-one;
				margin-top: 10rpx;
				color: #666;
			}
			.detail{
				color: $theme-color;
				margin-right: 20rpx;
			}
		}
	}
</style>
