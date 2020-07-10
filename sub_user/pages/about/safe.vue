<template>
	<view class="">
		<view class="part">
			<view class="item lastNoBottom" @click="loginOff">
				<view class="title">
					注销账户信息
				</view>
				<view class="iconfont icon-leftArrow"></view>
			</view>
		</view>
		<uni-popup ref='uniPopupOff'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">提示</view>
				<view class="uniPopup-summary">注销账户信息，你的一切信息记录都将清除，是是否确定注销当前账户信息?</view>
				<view class="uniPopup-buttons">
					<view class="cancel" @click="$refs.uniPopupOff.close()">取消</view>
					<view class="confirm" @click="offBtn">确定</view>
				</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupOff.close()"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import { checkLogin,hideMenuItems } from '@/common/utils.js'
	import api from '@/common/api.js'
	export default{
		components:{
			
		},
		data(){
			return {
				
			}
		},
		computed: {
			
		},
		onLoad(){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
		},
		methods:{
			//注销账户
			loginOff(){
				checkLogin().then(() => {
					this.$refs.uniPopupOff.open()
				})
			},
			offBtn(){
				this.$http({
						api: api.getUserInfo,
						method: 'POST',
						params:{
							_method:'DELETE'
						}
				}).then(res => {
						uni.showToast({
							title:'注销成功',
							success:() => {
								uni.clearStorageSync()
								this.$store.commit('clearUserInfo')
								uni.reLaunch({
									url:'/pages/login/index'
								})
							}
						})
				}).catch(err => {
																
				})
			}
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.part{
		background: #fff;
		margin-top:12rpx;
		padding: 10rpx 30rpx;
		color:#000;
		
		.item{
			padding:30rpx 0;
			padding-left:30rpx;
			display: flex;
			background: #fff;
			align-items: center;
			justify-content: space-between;
			.title{
				color: red;
			}
		}
	}
</style>
