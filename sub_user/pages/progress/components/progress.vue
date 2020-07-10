<template>
	<view class="progress">
		<view class="progress-header">
			<view class="avatarImg">
				<image src="http://img4.imgtn.bdimg.com/it/u=3894159655,3953106493&fm=26&gp=0.jpg" mode=""></image>
			</view>
			<view class="schoolName">华中科技大学</view>
			<view class="schoolInfo">
				<view class="schoolInfo-item">
					<text class="iconfont icon-edu"></text>
					<text class="title">中专 公办</text>
				</view>
				<view class="schoolInfo-item">
					<text class="iconfont icon-address"></text>
					<text class="title">广东 佛山 南海区</text>
				</view>
			</view>
			<view class="professional">报考专业：药剂专业</view>
			<view class="iconfont icon-share" @click="showSheet"></view>
		</view>
		<view class="progress-title">流程进度</view>
		<view class="progress-list">
			<view class="progress-list-item" v-for="(item,index) of progressList" :key='index'>
				<view class="date">12/09<br/>2020</view>
				<view class="dotAndLine">
					<view class="dot"></view>
					<view class="line"></view>
				</view>
				<view class="record">
					<view class="title">{{item.title}}</view>
					<view class="summary">{{item.summary}}</view>
				</view>
				<view class="operation">
					{{item.operation}}
				</view>
			</view>
		</view>
		<view class="progress-summary">
			凡是在线上报名且成功入学者，在满足条件享受国家助学金的基础上，还可以享受到平台助学补助。
		</view>
	</view>
</template>

<script>
	export default{
		components:{
			
		},
		data(){
			return {
				progressList:[
					{
						date:'2020/12/09',
						title:'报名缴费',
						summary:'已成功报名缴费',
						operation:'查看发票'
					},
					{
						date:'2020/12/09',
						title:'报名缴费',
						summary:'已成功报名缴费',
						operation:'查看发票'
					},
					{
						date:'2020/12/09',
						title:'报名缴费',
						summary:'已成功报名缴费',
						operation:'查看发票'
					}
				]
			}
		},
		methods:{
			showSheet(){
				uni.showActionSheet({
					itemList:['分享','申请退学'],
					success:res => {
						if(res.tapIndex === 0){
							
						}else{
							uni.navigateTo({
								url:'/sub_user/pages/progress/leaveSchool'
							})
						}
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.progress{
		.progress-header{
			position: relative;
			border-radius: 10rpx;
			background: #fff;
			padding: 30rpx;
			margin: 20rpx;
			text-align: center;
			.avatarImg{
				@include w-h-br(120rpx);
				margin: 0 auto;
			}
			.schoolName{
				margin: 30rpx 0;
				font-weight: bold;
			}
			.schoolInfo{
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 20rpx;
				.schoolInfo-item{
					margin: 0 30rpx;
					color: #666;
					.icon-edu{
						font-size: 40rpx;
					}
					.title{
						margin-left: 10rpx;
					}
				}
			}
			.professional{
				font-weight: bold;
				font-size: 28rpx;
			}
			.icon-share{
				position: absolute;
				right: 0;
				top: 0;
				padding: 20rpx;
				color: #666;
				font-size: 40rpx;
			}
		}
		.progress-title{
			margin: 30rpx;
			font-weight: bold;
		}
		.progress-summary{
			padding: 40rpx;
			font-size: 28rpx;
		}
		.progress-list{
			padding: 20rpx;
			border-radius: 10rpx;
			background: #fff;
			margin:0 20rpx;
			.progress-list-item{
				display: flex;
				align-items: center;
				font-size: 28rpx;
				.date{
					text-align: center;
				}
				.dotAndLine{
					margin: 0 10rpx;
					.dot{
						@include w-h-br(20rpx);
						background: #00aaff;
						border: 2rpx solid #ccc;
						padding: 2rpx;
					}
					.line{
						width: 10rpx;
						height: 100rpx;
						background: #00aaff;
						margin: 0 auto;
					}
				}
				.record{
					
				}
				.operation{
					margin-left: auto;
					font-size: 26rpx;
					border: 1rpx solid #666;
					padding: 2rpx 4rpx;
					color: #666;
				}
			}
		}
	}
</style>
