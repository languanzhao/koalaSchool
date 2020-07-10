<template>
	<view class="address-edit">
		<view class="item" @click="IDAuth">
			<view class="title">
				户籍地址
			</view>
			<view class="right">
				<view class="address">
					<text v-if='info.koala.id_province'>{{info.koala.id_province}}</text>
					<text v-if='info.koala.id_city'>{{info.koala.id_city}}</text>
					<text v-if='info.koala.id_district'>{{info.koala.id_district}}</text>
					<text v-if="!info.koala.id_province">请选择户籍地址</text>
				</view>
				<view class="iconfont icon-leftArrow" style="margin-left:12rpx;"></view>
			</view>
		</view>
		<view class="item">
			<view class="title">
				派出所/街道办
			</view>
			<input type="text" v-model="info.koala.id_address" class="input" placeholder="户籍办理地点"/>
			<!-- <view class="iconfont icon-leftArrow"></view> -->
		</view>
		<view class="fixedBottom">
			<!-- <view class="reset">重置</view> -->
			<view class="confirm" @click="submit">确定</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default{
		components:{
		},
		data(){
			return {
				addressName:'',
				info:{}
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		onShow() {
			let info = JSON.parse(JSON.stringify(this.userInfo))
			if(!info.koala.id_address){
				info.koala.id_address = ''
			}
			this.info = info
		},
		methods:{
			IDAuth(){
				uni.navigateTo({
					url:'/sub_adviser/pages/personalInfo/IDAuth'
				})
			},
			// 确定
			submit(){
				this.judgeFun().then(res => {
					let params = {
						'koala[id_address]':this.info.koala.id_address,
						_method:'PATCH'
					}
					this.$http({
						api: 'koala/v1/user',
						method: 'POST',
						params:params,
						header:{
							'Content-Type':'application/x-www-form-urlencoded'
						}
					}).then(res => {
						uni.$emit('houseAddress',{
							province:this.info.koala.id_province,
							city:this.info.koala.id_city,
							district:this.info.koala.idt_district,
							address:this.info.koala.id_address,
						}) //将地址放回上一页
						this.$store.commit('setUserInfo',res.data)
						uni.navigateBack()
					}).catch(err => {
								
					})
				}).catch(err => {})
			},
			judgeFun(){
				return new Promise((resolve,reject)=>{
					let tip = ''
					if(!this.info.koala.id_no){
						tip = '请选择地址'
						reject()
					}else if(!this.info.koala.id_address){
						tip = '请输入户籍办理地点'
						reject()
					}else {
						resolve()
					}
					if(tip){
						uni.showToast({
							icon:'none',
							title:tip
						})
					}
				})
			},
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.address-edit{
		padding-top:10rpx;
		width:722rpx;
		margin:0 auto;
		.item:first-of-type{
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
		}
		.item:last-of-type{
			border-bottom-left-radius: 20rpx;
			border-bottom-right-radius: 20rpx;
		}
		.item{
			display: flex;
			background: #fff;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			border:1px solid #f6f6f6;
			font-size: 30rpx;
			.input{
				flex: 1;
				text-align: right;
				color:#7d7d7d;
				font-size: 28rpx;
				margin-left: 10rpx;
			}
			.right{
				display: flex;
				align-items: center;
				color:#7d7d7d;
				font-size: 28rpx;
				.address{
					color: #666;
				}
			}
		}
		.lastNoBottom{
			// border-bottom: none;
		}
		.fixedBottom{
			position: fixed;
			bottom: 30rpx;
			width: 100%;
			left: 0;
			display: flex;
			justify-content: space-between;
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			text-align: center;
			.reset{
				background: #999;
				width: 200rpx;
				margin-right: 20rpx;
				border-radius: 10rpx;
			}
			.confirm{
				flex: 1;
				background:$theme-color;
				color: #fff;
				border-radius: 10rpx;
			}
		}
	}
</style>
