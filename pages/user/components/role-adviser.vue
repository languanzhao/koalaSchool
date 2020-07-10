<template>
	<view class="role-adviser">
		<view class="header" @click="adviserInfoLink" v-if="info.koala && info.koala.growth_values">
			<view class="header-top">
				<view class="avatarImg">
					<image class="image" :src="info.koala && info.koala.avatar ? info.koala.avatar : ''" mode=""></image>
				</view>
				<view class="content">
					<view class="name">
						<text class="koalaName">{{info.koala && info.koala.name ? info.koala.name : '去填写信息'}}</text>
						<text class="levelName" v-if="info.koala.growth_values.level">{{info.koala.growth_values.level.name}}</text>
					</view>
					<view class="invitedCode">
						邀请码：<text class="code">{{info.koala.code}}</text><text @click.stop="copyBtn" class="copy">复制</text>
					</view>
					<view class="inviter">邀请人：{{ info.koala.parent_koala && info.koala.parent_koala ? info.koala.parent_koala.name : ''}}</view>
				</view>
				<view class="iconfont icon-weixin" @click.stop="settingClick"></view>
			</view>
			<view class="header-bottom" v-if="info.koala && info.koala.growth_values">
				<view class="team">
					团员：
				{{info.koala.growth_values.current ? (info.koala.growth_values.current.member_count ? info.koala.growth_values.current.member_count : 0) : 0}}
				</view>
				<view class="num" v-if="info.koala.growth_values.next">
					<view class="title" v-if="info.koala.growth_values.current && info.koala.growth_values.next" >
						成长值:
						{{info.koala.growth_values.current ? (info.koala.growth_values.current.registration_count ? info.koala.growth_values.current.registration_count : 0) : 0}}/{{info.koala.growth_values.next ? (info.koala.growth_values.next.registration_count ? info.koala.growth_values.next.registration_count : 0) : 0}}</view>
					<view class="processPercent" v-if="info.koala.growth_values.current && info.koala.growth_values.next">
						<view class="processing" :style="{width:parseInt((info.koala.growth_values.current.registration_count/info.koala.growth_values.next.registration_count)*100) + '%'}">
							<view class="tip">
								<view class="percent-num">{{ number + '%'}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { copyValue,checkLogin } from '@/common/utils.js'
	export default{
		components:{
			
		},
		props:{
			info:{
				type:Object,
				default:() => {}
			}
		},
		data(){
			return {
		         number:0
			}
		},
		computed: {
			
		},
		mounted() {		
			
		},
		onLoad(){
			
		},
		methods:{
			//个人信息跳转
			adviserInfoLink(){
				checkLogin().then(() => {
					uni.navigateTo({
						url:'/sub_adviser/pages/personalInfo/index'
					})
				})
			},
			
			// 成长值优化
			judge(){
				this.number = (this.info.koala.growth_values.current.registration_count/this.info.koala.growth_values.next.registration_count ) * 100
				console.log(this.number,'number')
				if(this.number!=0){
				    let num  = this.number.toString().split(".")[1]
				      if(num){
					      if(num.toString().length<2){
						  this.number=this.number.toFixed(1)
					      }else if(num.toString().length>=2){
						  this.number=this.number.toFixed(2)
					      }
				     }else{
					     parseInt(this.number)
				     }
				}
			},
			
			//绑定微信
			settingClick(){
				checkLogin().then(() => {
					uni.navigateTo({
						url:'/sub_user/pages/bindwx/index'
					})
				})
			},
			//复制
			copyBtn(){
				checkLogin().then(() => {
					copyValue(this.info.koala.code)
				})
			},
		},
		watch:{
			info: {
				immediate: true,
				deep: true,
				handler(value) {
					this.judge()
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.processPercent{
		width: 236rpx;
		height: 8rpx;
		background: #158e8b;
		margin-left: 40rpx;
		border-radius: 6rpx;
		.processing{
			height: 8rpx;
			background: #FFC270;
			position: relative;
			.tip{
				position: absolute;
				right: -33rpx;
				bottom: 16rpx;
				width: 66rpx;
				height: 26rpx;
				font-size: 18rpx;
				text-align: center;
				line-height: 26rpx;
				color: #363636;
				font-weight: bold;
				background: linear-gradient(to right, #fee99b, #f2bb62);
				.percent-num{
					position: relative;
					&::before{
						content: '';
						position: absolute;
						left: 30rpx;
						bottom: -12rpx;
						width: 0;
						height: 0;
						border-top: 6rpx solid #f2bb62;
						border-right: 6rpx solid transparent;
						border-bottom: 6rpx solid transparent;
						border-left: 6rpx solid transparent;
					}
				}
			}
		}
	}
	.role-adviser{
	   .header{
		   background: #12ada9;
		   padding:50rpx 30rpx 40rpx;
		   color: #fff;
		   .header-top {
		   	display: flex;
		   	.content {
		   		display: flex;
		   		justify-content: space-around;
		   		flex-direction: column;
		   		.name {
					display: flex;
					align-items: center;
					.koalaName{
						font-size: 32rpx;
						font-family:SourceHanSansCN;
						font-weight: bold;
					}
		   			.levelName{
		   				color: #FFC270;
		   				font-size: 20rpx;
		   				background: #363636;
		   				border-radius: 20rpx;
		   				padding: 2rpx 10rpx;
		   				margin-left: 10rpx;
		   			}
		   		}
		   
		   		.invitedCode {
		   			font-size: 24rpx;
		   
		   			.code {
		   				font-family: ErasITC;
		   				font-weight: bold;
		   				color: rgba(255, 250, 250, 1);
		   				margin-right: 20rpx;
		   			}
		   
		   			.copy {
		   				color: #0D5553;
		   				font-size: 22rpx;
		   				background: #19c6c2;
		   				padding: 2rpx 10rpx;
		   				border-radius: 16rpx;
		   			}
		   		}
				.inviter{
					font-size: 24rpx;
				}
		   	}
		   
		   	.avatarImg {
		   		@include w-h-br(160rpx);
				.image{
					width: 160rpx;
					height: 160rpx;
					overflow: hidden;
				}
		   		margin-right: 20rpx;
		   	}
		   
		   	.icon-weixin {
		   		margin-left: auto;
		   		font-size: 42rpx;
		   		color: #fff;
		   	}
		   }
		   
		   .header-bottom {
		   	display: flex;
		   	align-items: center;
		   	margin-top: 30rpx;
		   	font-size: 24rpx;
		    .team{
				margin-right: 50rpx;
			}
		   	.num {
		   		display: flex;
		   		align-items: center;
		   		.process {
		   			margin-left: 30rpx;
		   			.bar{
		   				width: 236rpx;
		   				height: 8rpx;
		   			}
		   		}
		   	}
		   }
	   }
	}
</style>
