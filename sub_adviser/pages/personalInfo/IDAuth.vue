<template>
	<view class="IDAuth">
		<view class="IDAuthTip">根据相关规定，登记报读院校时须完备以下个人信息</view>
		<view class="header">
			<view class="item">
				<view class="title">真实姓名</view>
				<input class='input' type="text" :disabled="userInfo.koala.id_no" v-model="id_name" placeholder="请输入真实姓名"/>
			</view>
			<view class="item">
				<view class="title">身份证号码</view>
				<view class="input" v-if="userInfo.koala.id_no">{{id_no | hideMiddle}}</view>
				<input class='input' type="text" :disabled="userInfo.koala.id_no" v-model="id_no" placeholder="请输入身份证号码" v-else/>
			</view>
		</view>
		<view class="fixed_bottom_btn_place">
			<view class="fixed_bottom_btn">
				<view class="summary">
					实名注册资料一旦填写确认，无法随意更改，请您在填写实名制资料时谨慎操作
				</view>
				<view class="word" @click="submit">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	import { regExp,Throttle } from '@/common/utils.js'
	import { mapState } from 'vuex'
	export default{
		components:{
			
		},
		data(){
			return {
				id_name:'',
				id_no:'',
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		filters: {
			hideMiddle(val) {
				return `${val.substring(0,4)}**********${val.substring(val.length-4)}`
			}
		},
		onLoad(){
			let info = JSON.parse(JSON.stringify(this.userInfo))
			if(info.id){
				if(!info.koala.id_name){
					info.koala.id_name = ''
				}
				if(!info.koala.id_no){
					info.koala.id_no = ''
				}
				this.id_name = info.koala.id_name
				this.id_no = info.koala.id_no
			}
		},
		methods:{
			submit(){
				if(!this.userInfo.koala.id_no){
					let tip = ''
					if(this.id_name){
						if(regExp('IDnumber',this.id_no)){
							this.judegFun(this)
						}else{
							tip = '请输入正确的身份证号码'
						}
					}else{
						tip = '请输入真实姓名'
					}
					if(tip){
						uni.showToast({
							icon:'none',
							title:tip
						})
					}
				}else{
					uni.showToast({
						icon:'none',
						title:'已实名'
					})
				}
			},
			judegFun:Throttle(that => {
				that.$http({
					api: api.IDAuth,
					method: 'POST',
					params:{
						id_name:that.id_name,
						id_no:that.id_no,
						_method:'PATCH'
					},
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					}
				}).then(res => {
					that.$store.commit('setUserInfo',res.data)
					uni.$emit('id_no',{id_no:res.data.koala.id_no})
					uni.showToast({
						title:'实名认证成功',
						success:() => {
							setTimeout(() => {
								uni.navigateBack()
							},1000)
						}
					})
				}).catch(err => {
					uni.showToast({
						icon:'none',
						title:err.data.message
					})	
				})
			},20000,'请在20秒后重新认证'),
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.IDAuth{
		.IDAuthTip{
			background: #feff91;
			padding: 10rpx 20rpx;
			color:#7d7d7d;
			font-size: 24rpx;
			text-align: center;
		}
		margin:0 auto;
		.header{
			background: #fff;
			border-radius: 20rpx;
			margin: 20rpx;
			.item{
				display: flex;
				align-items: center;
				border-bottom: 1px solid #f6f6f6;
				padding: 30rpx 30rpx;
				.title{
					color:#000;
					font-size: 30rpx;
					margin-right: 30rpx;
				}
				.input{
					flex: 1;
					text-align: right;
					color:#7d7d7d;
					font-size: 28rpx;
				}
			}
			.imageBox{
				display: flex;
				justify-content: space-around;
				padding: 30rpx 20rpx;
				.image{
					width: 200rpx;
					height: 150rpx;
					border: 1rpx solid #ccc;
				}
			}
		}
		.summary{
			margin-bottom:20rpx;
			font-size: 22rpx;
			color: #666;
			padding: 0 100rpx;
		}
	}
</style>
