<template>
	<view class="enterPage">
		<view class="headerTitle">院校推荐定制</view>
		<image :src="iconAvatar"></image>
		<view class="chooseTitle">选择性别</view>
		
		<view class="selectSex">
			<view>
				<image :src="isBoy ? iconSboy : iconBoy" @click="changeSex"></image>
				<image :src="isBoy ? iconGirl : iconSgirl" style="margin-left: 106rpx;" @click="changeSex"></image>
			</view>
		</view>
		
		<view class="chooseTitle">选择学历</view>
		 <picker-view :indicator-style="indicatorStyle" @change="changeEdu">
		 	<picker-view-column>
				<view class="item" v-for="(item, index) in eduList" :key="index" :class="[value==index?'active':'']">{{item.title}}</view>
		 	</picker-view-column>
		 </picker-view>
		
		<view class="confirmBtn" @click="goIndex">
			确定
		</view>
		
		<view class="iconfont icon-guanbi icon_close" @click="jumpBack"></view>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	const app = getApp()
	export default{
		components:{
			
		},
		data(){
			return {
				iconAvatar:this.$rootUrl + 'koala_images/img/icon_avatar.png',
				iconSboy:this.$rootUrl + 'koala_images/img/icon_Sboy.png',
				iconGirl:this.$rootUrl + 'koala_images/img/icon_girl.png',
				iconBoy:this.$rootUrl + 'koala_images/img/icon_boy.png',
				iconSgirl:this.$rootUrl + 'koala_images/img/icon_Sgirl.png',
				active:null,
				current:2,
				items: [{
						value: 'USA',
						name: '男同学',
						checked:false
					},
					{
						value: 'CHN',
						name: '女同学',
						checked: false
					},
				],
				eduList:[
					{
						title:'初中',
						value:'middle'
					},
					{
						title:'高中(中专)',
						value:'secondary'
					},
					{
						title:'大专',
						value:'junior'
					},
				],
				value:0,
				// resEdu:0,//最后选择的学历
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth / (750 / 100))}px;`,
				isBoy:true,
				delta:1,
			}
		},
		computed: {
			
		},
		onLoad(options){
			if(options.delta){
				this.delta = Number(options.delta)
			}
		},
		methods:{
			// 关闭
			jumpBack(){
				uni.navigateBack({
					delta:2
				})
			},
			radioChange(e){
				let val = e.detail.value
				for(let i in this.items){
					if(this.items[i].value==val){
						this.items[i].checked=true
					}
					else{
						this.items[i].checked=false
					}
				}
			},
			
			goIndex(){
				let sex = this.isBoy ? 1 : 2
				let resEdu = this.eduList[this.value].value
					this.$http({
						api:api.getUserInfo,
						method:"POST",
						params:{
							'koala[sex]':sex,
							'koala[education]':resEdu,
							_method:'PATCH'
						},
						header:{
							'Content-Type':'application/x-www-form-urlencoded'
						}
					}).then(res=>{
						this.$store.commit('setUserInfo', res.data);
						uni.navigateBack({
							delta:this.delta
						})
					})
			},
			// 选择学历
			changeEdu(e){
				this.value = e.target.value
			},
			// 选择性别
			changeSex(){
				this.isBoy=!this.isBoy
			}
		}
	}
</script>

<style lang="scss" scoped>
	.enterPage{
		.icon_close{
			position: fixed;
			right:40rpx;
			top:100rpx;
			font-size: 20rpx;
		}
		
		.headerTitle{
			font-size: 48rpx;
			color:#050505;
			// font-weight: bold;
			text-align: center;
			margin: 80rpx 0 46rpx;
		}
		.icon_avatar{
			width:212rpx;
			height:117rpx;
			display: block;
			margin:0 auto;
		}
		.chooseTitle{
			text-align: center;
			margin:34rpx 0 12rpx;
			color:#5e5e5e;
			font-size: 18rpx;
		}
		.selectSex{
			display: flex;
			align-items: center;
			justify-content: center;
			image{
				width: 156rpx;
				height:78rpx;
			}
		}
		.confirmBtn{
			display: flex;
			align-items: center;
			justify-content: center;
			width:359rpx;
			height:61rpx;
			margin:180rpx auto 0;
			background:#82ceca;
			color:#fff;
			font-size: 30rpx;
			border-radius:30rpx;
		}
		// .radioGroup{
		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: space-around;
		// 	.item{
		// 		text-align: center;
		// 	}
		// }
		// .swiper{
		// 	height: 300rpx;
		// 	.swiperItem{
		// 		display: flex;
		// 		align-items: center;
		// 		justify-content: center;
		// 		height: 100rpx!important;
		// 		.title{
					
		// 		}
		// 	}
		// 	.current{
		// 		border-top: 1rpx solid;
		// 		border-bottom: 1rpx solid;
		// 		font-weight: bold;
		// 	}
		// }
		// picker{
		// 	display: flex;
		// 	justify-content: center;
		// 	align-items: center;
		// 	border-top:1px solid;
		// 	border-bottom:1px solid;
		// 	height:100rpx;
		// }
	}
	uni-picker-view {
		display: block;
	}
	
	uni-picker-view .uni-picker-view-wrapper {
		display: flex;
		position: relative;
		overflow: hidden;
		height: 100%;
		background-color: white;
	}
	
	uni-picker-view[hidden] {
		display: none;
	}
	
	picker-view {
		width: 100%;
		height: 300rpx;
		margin-top: 20rpx;
	}
	.item {     
		display: flex;
		align-items: center;
	    justify-content: center;
		font-size: 26rpx;
	}
	.active{
		font-size: 30rpx !important;
	}
</style>
