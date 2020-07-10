<template>
		<view>
			<view class="loginOut">
				<view class="item" @click="loginOut">退出登录</view>
				<view class="item" @click="loginOff">注销当前账户</view>
			</view>
			<uni-popup ref='uniPopupOut'>
				<view class="uniPopup-toast">
					<view class="uniPopup-title">提示</view>
					<view class="uniPopup-summary">退出登录后您将无法接收院校录取通知等重要信息，是否退出当前账户?</view>
					<view class="uniPopup-buttons">
						<view class="cancel" @click="$refs.uniPopupOut.close()">取消</view>
						<view class="confirm" @click="outBtn">确定</view>
					</view>
					<view class="iconfont icon-quxiao" @click="$refs.uniPopupOut.close()"></view>
				</view>
			</uni-popup>
			<uni-popup ref='uniPopupOff'>
				<view class="uniPopup-toast">
					<view class="uniPopup-title">提示</view>
					<view class="uniPopup-summary">注销用户信息，你的一切信息记录都将清除，是是否确定注销当前账户信息?</view>
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
	import { checkLogin } from '@/common/utils.js'
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
			
		},
		methods:{
			//退出登录
			loginOut(){
				checkLogin().then(() => {
					this.$refs.uniPopupOut.open()
				})
			},
			outBtn(){
				this.$http({
					api: api.updateToken,
					method: 'POST',
					params:{
						_method:'DELETE'
					}
				}).then(res => {
					uni.clearStorageSync()
					this.$store.commit('clearUserInfo')
					uni.redirectTo({
						url:'/pages/login/index'
					})
				}).catch(err => {
																
				})
			},
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

<style lang="scss" scoped>
	.loginOut{
		margin-top: 20rpx;
		.item{
			padding: 30rpx;
			text-align: center;
			background: #fff;
			&:last-of-type{
				margin-top: 2rpx;
				color: red;
			}
		}
	}
</style>
