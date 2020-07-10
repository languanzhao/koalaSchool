<template>
	<view class="transferAccounts">
		<view class="transferAccounts-tips" v-if="schoolInfo.sInfo.type === 'tutoring'">平台不收取任何费用，您的报名费将直接转入报名机构账户</view>
		<view class="transferAccounts-tips" v-if="schoolInfo.sInfo.type != 'tutoring'">平台不收取任何费用，您的预报名费将直接转入报名院校账户</view>
		<transfer-info :transferObj="transferObj"></transfer-info>
		
		<view class="fixed_bottom">
			<view class="tips">
				转账时请仔细核对账号，如遇任何问题请务必立即联系老师
			</view>
			<view class="btn">
				<view class="leftBtn" @click="jumpchat">联系老师交费</view>
				<view class="rightBtn" @click="jumpTransferAccount">上传转账凭证</view>
			</view>
		</view>
	</view>
</template>

<script>
	import transferInfo from './components/transferInfo'
	export default {
		components:{
			transferInfo
		},
		data() {
			return {
				schoolInfo:{},
				transferObj:{}
			}
		},
		onLoad(options){
			if(options.info){
				const info = JSON.parse(decodeURIComponent(options.info))
				this.transferObj = {
					name:info.sInfo.name,
					avatar:info.sInfo.avatar,
					transferList:[
						{
							key:'支付方式',
							value:'转账支付'
						},
						{
							key:'对公账户',
							value:info.tInfo.corporate_account.account_name
						},
						{
							key:'银行账号',
							value:info.tInfo.corporate_account.account_number
						},
						{
							key:'开户银行',
							value:info.tInfo.corporate_account.deposit_bank
						},
						{
							key:'联系老师',
							value:info.tInfo.contact_name
						},
						{
							key:'联系电话',
							value:info.tInfo.contact_phone
						}
					]
				}
				this.schoolInfo = info
				console.log(this.schoolInfo,'infooo')
			}
		},
		methods: {
			jumpTransferAccount(){
				if(this.schoolInfo.sInfo.id){
					// #ifdef H5
						uni.redirectTo({
							url:'./transferAccounts?info=' + encodeURIComponent(JSON.stringify(this.schoolInfo))
						})
					// #endif
					
					// #ifndef H5
						uni.navigateTo({
							url:'./transferAccounts?info=' + encodeURIComponent(JSON.stringify(this.schoolInfo))
						})
					// #endif
				}
			},
			jumpchat(){
				uni.navigateTo({
					url:'/pages/news/chat?schoolId=' + this.schoolInfo.sInfo.id
				})
			},
		}
	}
</script>
<style>
	page{
			background: #f1f1f1;
		}
</style>
<style lang="scss" scoped>
	.transferAccounts {
		background: #fff;
		border-bottom-right-radius:30rpx;
		border-bottom-left-radius:30rpx;
		.transferAccounts-tips{
			height: 50rpx;
			line-height: 50rpx;
			background: #feff91;
			text-align: center;
			font-size: 24rpx;
			margin-bottom: 10rpx;
		}

	}
	.fixed_bottom{
		width:100%;
		position: fixed;
		bottom:40rpx;
		padding:0 40rpx;
		.tips{
			color:#333;
			font-size: 20rpx;
			text-align: center;
			margin-bottom:26rpx;
		}
		.btn{
			display:flex;
			justify-content: center;
			color:#fff;
			font-size: 30rpx;
			view{
				width:310rpx;
				height:75rpx;
				border-radius: 10rpx;
				display:flex;
				justify-content: center;
				align-items: center;
			}
			.leftBtn{
				background: #828387;
			}
			.rightBtn{
				background: $theme-color;
				margin-left:48rpx;
			}
		}
	}
</style>
