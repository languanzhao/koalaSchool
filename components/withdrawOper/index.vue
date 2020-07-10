<template>
	<view class="">
		<!-- 提现模块 -->
		<uni-popup ref='popup'>
			<view class="popupContent">
				<view class="title">提现申请</view>
				<view class="inputVal">
					输入金额
					<input class="input" type="number" v-model="withdrawMoney" @blur="inputBlur" @input="inputChange"/>
					元
				</view>
				<view class="oper">
					<view class="item cancel" @click="cancelBtn(1)">取消</view>
					<view class="item confirm" @click="tipPopupOpen">确定</view>
				</view>
				<view class="iconfont icon-guanbi" @click="cancelBtn(1)"></view>
			</view>
		</uni-popup>
		
		<uni-popup ref='tipPopup'>
			<view class="tipPopup">
				<view class="title">提现申请</view>
				<view class="summary">点击微信号添加客服微信，向考拉上学财务客服人员发送：“我要提现！”的指令，即可很快到账</view>
				<view class="wxNumber" @click="copy">{{wxNumber}}</view>
				<view class="oper">
					<!-- <view @click="cancelBtn(2)">打开微信立即提现</view> -->
					<view class="btn" @click="cancelBtn(2)">确定申请并添加客服</view>
				</view>
				<view class="iconfont icon-guanbi" @click="$refs.tipPopup.close"></view>
			</view>
		</uni-popup>
		
		<!-- 提现模块 -->
	</view>
</template>

<script>
	import api from '@/common/api.js'
	import { copyValue } from '@/common/utils.js'
	export default{
		components:{
		},
		data(){
			return {
				withdrawMoney:null,
				wxNumber:''
			}
		},
		computed: {
			
		},
		onLoad(){
			
		},
		mounted(){
			this.$nextTick( () => {
				this.wxNumber = this.$contactPhone
			})
		},
		methods:{
			//兼容苹果手机上 键盘升起会导致页面上移问题
			inputBlur(e){
				uni.pageScrollTo({
					scrollTop:0,
					duration:0
				})
				    
			},
			inputChange(e){
				//输入金额保留两位小数
				let value = e.detail.value
				value = value.match(/\d+\.?\d{0,2}/)
				this.withdrawMoney = value
			},
			open(type){
				if(type === 1){
					this.withdrawMoney = null
					this.$refs.popup.open()
				}else if(type === 2){
					this.$refs.tipPopup.open()
				}
			},
			
			//取消弹窗
			cancelBtn(type) {
				if(type === 1){
					this.$refs.popup.close()
				}else if(type === 2){
					this.copy()
					this.withdrawClick()
					this.$refs.tipPopup.close()
				}
			},
			//复制微信号
			copy(){
				copyValue(this.wxNumber)
			},
			tipPopupOpen(){
				this.cancelBtn(1)
				this.open(2)
			},
			// 申请提现
			withdrawClick(){
				if(this.withdrawMoney){
					let params = {
						type:'wechat_account',
						amount:this.withdrawMoney,
					}
					this.$http({
						api: api.withdraws,
						method: 'POST',
						params:params,
						header:{
							'Content-Type':'application/x-www-form-urlencoded'
						}
					}).then(res => {
					   this.$emit('updateAmount',this.withdrawMoney)
					   uni.showToast({
					   	icon:'none',
					   	title:'已发起提现申请'
					   })
					}).catch(err => {
						if(err.data.code === 400){
							uni.showToast({
								icon:'none',
								title:err.data.message
							})
						}
					})
				}else{
					uni.showToast({
						icon:'none',
						title:'请输入余额'
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.popupContent {
		background: #fff;
		padding:0 0 30rpx;
		width:600rpx;
		border-radius:20rpx;
		position: relative;
		.title {
			padding:36rpx 0rpx;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background:#f1f1f1;
			font: {
				weight: bold;
				size: 36rpx;
			}
			// text-align: center;
		}
	
		.inputVal {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30rpx;
			color:#000;
			margin:50rpx 0;
			.input {
				margin:0rpx 20rpx;
				width:212rpx;
				height:67rpx;
				border: 1rpx solid rgba(0,0,0,0.5);
				padding: 0 10rpx;
				font-size: 40rpx;
				border-radius:20rpx;
			}
		}
	
		.oper {
			display: flex;
			justify-content: center;
			.item {
				width:248rpx;
				height:76rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 10rpx;
				color:#fff;
			}
			.item:first-of-type{
				margin-right:50rpx;
			}
	
			.cancel {
				background: #828387;
			}
	
			.confirm {
				background: #12ada9;
				color: #fff;
			}
		}
	}
	
	.tipPopup{
		background: #fff;
		width: 600rpx;
		margin: 0 auto;
		padding:0rpx 0 30rpx;
		border-radius:20rpx;
		position: relative;
		.title {
			padding:36rpx 0rpx;
			background: #f1f1f1;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			font: {
				weight: bold;
				size:36rpx;
			}
			text-align: center;
		}
		.summary{
			-webkit-line-clamp:2;
			-webkit-box-orient:vertical;
			// text-align: center;
			margin:30rpx auto;
			font-size: 26rpx;
			width:500rpx;
		}
		.wxNumber{
			color: #64bfbb;
			text-align: center;
			border: 1px dashed #64bfbb;
			width:328rpx;
			padding:24rpx 0;
			margin:0 auto 30rpx;
			border-radius:20rpx;
		}
		.oper{
			display: flex;
			justify-content:center;
			align-items: center;
			width:100%;
			font-size: 28rpx;
			color:#64BFBB;
			.btn{
				padding:12rpx 26rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #12ada9;
				color:#fff;
				border-radius: 10rpx;
			}
		}
	}
	.icon-guanbi{
		position:absolute;
		top:36rpx;
		right:30rpx;
	}
</style>
