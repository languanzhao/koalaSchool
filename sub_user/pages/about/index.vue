<template>
	<view class="joinUs">
		<view class="joinUs-header">
			<view class="imageBox">
				<image :src="logo"></image>
			</view>
			<view class="title">考拉上学</view>
			<view class="edition">版本号：V1.0.0</view>
		</view>
		<view class="part">
			<view class="item lastNoBottom" @click="updateClick">
				<view class="title">
					版本更新
				</view>
				<view class="iconfont icon-leftArrow"></view>
			</view>
		</view>
		<view class="part" v-if="!roles[0]">
			<view class="item lastNoBottom" @click="safeLink">
				<view class="title">
					账号安全
				</view>
				<view class="iconfont icon-leftArrow"></view>
			</view>
		</view>
		<view class="loginOut">
			<view class="item" @click="loginOut">退出登录</view>
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
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import { checkLogin,hideMenuItems } from '@/common/utils.js'
	import api from '@/common/api.js'
	import { mapState } from 'vuex'
	export default{
		components:{
			
		},
		data(){
			return {
				logo:this.$rootUrl + 'koala_images/logo.png'
			}
		},
		computed:{
			...mapState(['roles'])
		},
		onLoad(){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
		},
		methods:{
			//更新提示
			updateClick(){
				uni.showToast({
					icon:'none',
					title:'暂无更新'
				})
			},
			//账号安全
			safeLink(){
				uni.navigateTo({
					url:'/sub_user/pages/about/safe'
				})
			},
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
					uni.reLaunch({
						url:'/pages/login/index'
					})
				}).catch(err => {
																
				})
			},
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.joinUs{
		.joinUs-header{
			padding: 30rpx 0;
			text-align: center;
			background: #fff;
			.imageBox{
				@include w-h-br(120rpx);
				margin:20rpx auto;
			}
			.title{
				font-size: 40rpx;
				color:#000;
				margin-bottom: 10rpx;
			}
			.edition{
				font-size: 28rpx;
				color: #7d7d7d;
			}
		}
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
				border-bottom: 1px solid #f5f5f5;
			}
			.item:last-of-type{
				border-bottom: 0;
			}
		}
		.loginOut{
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			.item{
				padding: 30rpx;
				text-align: center;
				background: #fff;
				// &:last-of-type{
				// 	margin-top: 2rpx;
				// 	color: red;
				// }
			}
		}
	}
</style>
