<template>
	<view class="taskCenter">
		<view class="header">
			<view class="title"><text class="iconfont icon-rmb"></text>我的额度</view>
			<view class="total">{{taskTotalNum}}</view>
			<view class="num">当前可提现额度 {{receivedNum}}</view>
			<view class="withdraw" @click="goWithdraw">提现</view>
			<view class="toastSummary" @click="uniPopupSummaryClick">
				<text class="iconfont icon-yiwen"></text>提现说明
			</view>
		</view>
		<view class="center">
			<view class="center-top">
				<view class="title">
					<text class="my">激活任务</text>
					<text class="finish">已完成{{finiseLength}}/{{taskList.length}}</text>
				</view>
				<view class="task-list">
					<view :class="['item',receivedLength >= item.num ? 'current' : '']" v-for="(item,index) of taskProcessList" :key='index'>
						<image class="image" v-if="receivedLength >= item.num" :src="item.completed" mode=""></image>
						<image class="image" v-else :src="item.unCompleted" mode=""></image>
					</view>	
				</view>
				<view class="summary">完成所有任务可提现{{taskTotalNum}}额度</view>
			</view>
			<view class="center-bottom">
				<view class="item" v-for="(item,index) of taskList" :key="index">
					<view class="left">
						<image class="image" :src="item.task.extra.icon.url" mode=""></image>
						<view class="title">
							<view class="name">{{item.task.name}}</view>
							<view class="num">+{{item.task.extra.reward.amount}}</view>
						</view>
					</view>
					<view class="btn" @click="taskGo(item)">{{statusList[item.status]}}</view>
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="tip">
				注意：当达成任务完成的条件后，须上传任务完成截图，待平台审核通过后激活相应的额度。
			</view>
			<view class="btn" @click="upload">上传任务完成截图</view>
		</view>
		<uni-popup ref='uniPopup'>
			<view class="uniPopup-toast" style="text-align: center;width: 500rpx;" v-if="obj">
				<image class="image" :src="obj.task.extra.icon.url" mode=""></image>
				<view class="title">{{obj.task.name}}</view>
				<view class="num">+{{obj.task.extra.reward.amount}}</view>
				<view class="content" style="text-align: left;">{{obj.task.desc}}</view>
				<view class="btn" @click="finishTask(obj.task.extra.condition.type,obj.task.name)">{{statusList[obj.status]}}</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopup.close()"></view>
			</view>
		</uni-popup>
		<uni-popup ref='uniPopupSummary'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">提现说明</view>
				<view class="uniPopup-summary">当前额度为平台助学计划额，提现条件是完成激活任务且承诺不取消报名。当提现后仍要取消报名的，则须退还相应的平台助学计划额</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupSummary.close()"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	import { mapState } from 'vuex'
	export default {
		components: {

		},
		data() {
			return {
				receivedNum:0,
				taskTotalNum:0,
				finiseLength:0,
				receivedLength:0,
				obj:null,
				statusList:{
					'pending':'去完成',
					'underway':'审核中',
					'success':'领取',
					'failed':'去完成',
					'received':'已完成',
				},
				taskList:[],
				taskProcessList:[]
			}
		},
		computed: {
			...mapState(['roles'])
		},
		onLoad() {
			this.getTaskList()
		},
		methods: {
			getTaskList(){
				uni.showLoading()
				this.$http({
					api: api.taskList,
					method: 'GET',
					params:{
						type: 'grant'
					}
				}).then(res => {
					this.taskList = res.data
					//任务总额
					let sum = 0,receivedNum = 0
					for (var i in res.data) {
						sum += parseInt(res.data[i].task.extra.reward.amount) 
						if(res.data[i].status === 'received'){
							receivedNum += parseInt(res.data[i].task.extra.reward.amount) 
						}
					}
					//已完成的数量
					let finishList = res.data.filter(item=> item.status === 'success' || item.status === 'received')
					
					//已领取的数量
					let receivedList = res.data.filter(item=> item.status === 'received')
				    this.taskProcessList = [
						{
							num:1,
							completed:'https://koala.gzzhongw.net/koala_images/task/success01.png',
							unCompleted:'https://koala.gzzhongw.net/koala_images/task/none01.png'
						},
						{
							num:2,
							completed:'https://koala.gzzhongw.net/koala_images/task/success02.png',
							unCompleted:'https://koala.gzzhongw.net/koala_images/task/none02.png'
						},
						{
							num:3,
							completed:'https://koala.gzzhongw.net/koala_images/task/success03.png',
							unCompleted:'https://koala.gzzhongw.net/koala_images/task/none03.png'
						}
					]
					this.receivedLength = receivedList.length
					this.taskProcessList.splice(receivedList.length,0,{
						num:receivedList.length,
						completed:'https://koala.gzzhongw.net/koala_images/task/huojian.png'
					})
					this.finiseLength = finishList.length
					this.receivedNum = receivedNum
					this.taskTotalNum = sum
					uni.hideLoading()
				})
			},
			taskGo(item){
				if(item.status === 'pending' || item.status === 'failed'){
					this.obj = item
					this.$refs.uniPopup.open()
				}else if(item.status === 'success'){
					//已完成时领取助学计划额
					this.$http({
						api: api.getTaskMoney + '/' + item.id + '/received',
						method: 'POST'
					}).then(res => {
						this.getTaskList()
						uni.showToast({
							title:'领取成功'
						})
					})
				}
			},
			finishTask(type,name){
				this.$refs.uniPopup.close()
				if(type === 'invite_counselor'){
					if(this.roles[0]){
						// #ifdef APP-PLUS
							this.appShareWx(1)
						// #endif
						
						// #ifndef APP-PLUS
							uni.navigateTo({
								url:'/sub_user/pages/poster/index'
							})
						// #endif
					}else{
						uni.navigateTo({
							url:"/sub_tim/pages/joinUs/index?type=2&path=taskCenter"
						})
					}
				}else if(type === 'screenshot'){
					// #ifdef APP-PLUS
						if(name === '微信群分享'){
							this.appShareWx(1)
						}else if(name === '朋友圈分享'){
							this.appShareWx(2)
						}
					// #endif
					
					// #ifndef APP-PLUS
						uni.navigateTo({
							url:'/sub_user/pages/poster/index'
						})
					// #endif
				}
			},
			upload(){
				uni.navigateTo({
					url:'/sub_tim/pages/taskCenter/list'
				})
			},
			uniPopupSummaryClick(){
				this.$refs.uniPopupSummary.open()
			},
			//跳转到钱包
			goWithdraw(){
				if(this.roles[0]){
					uni.navigateTo({
						url:'/sub_adviser/pages/wallet/index'
					})
				}else{
					uni.navigateTo({
						url:'/sub_user/pages/wallet/index'
					})
				}
			},
			//分享到微信(app)
			appShareWx(type) {
				let shareUrl = this.$projectUrl
				let koala = this.$store.state.userInfo.koala
				if(koala && koala.code){
					shareUrl += '?invitedCode='+ koala.code
				}
				uni.share({
				    provider: "weixin",
				    scene:type === 1 ? "WXSceneSession" : "WXSenceTimeline",
				    type: 0,
				    href: shareUrl,
				    title: "考拉上学",
				    summary: "择校好难？你是没有使用考拉上学吧！收录百大院校，求学有考拉上学，我的前途不迷茫",
				    imageUrl: this.$rootUrl + "koala_images/logo.png",
				    success: function (res) {},
				    fail: function (err) {}
				});
			}
		}
	}
</script>
<style lang="scss">
	page {
		background: $page-background;
	}
</style>
<style lang="scss" scoped>
	.taskCenter {
		.header {
			position: relative;
			height: 500rpx;
			background: #e5e5e5;
			display: flex;
			align-items: center;
			flex-direction: column;
			.title {
				margin-top: 30rpx;
				.icon-rmb{
					color: #f2bb62;
					margin-right: 10rpx;
				}
			}

			.total {
				font-size: 80rpx;
				font-weight: bold;
			}

			.num {
				margin: 20rpx 0;
			}

			.withdraw {
				width: 200rpx;
				height: 80rpx;
				background: $theme-color;
				text-align: center;
				line-height: 80rpx;
				border-radius: 40rpx;
				color: #fff;
			}
			.toastSummary{
				position: absolute;
				right: 30rpx;
				top: 30rpx;
				font-size: 26rpx;
			}
		}

		.center {
			margin: -140rpx 30rpx 20rpx;
			background: #fff;
			border-radius: 20rpx;
			position: relative;
			z-index: 2;
			.center-top {
				padding:30rpx 20rpx;

				.title {
					display: flex;
					justify-content: space-between;

					.my {
						font-weight: bold;
					}

					.finish {
						color: #666;
						font-size: 24rpx;
					}
				}
				.task-list{
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 30rpx 0;
					.item{
						position: relative;
						width: 120rpx;
						height: 120rpx;
						text-align: center;
						line-height: 120rpx;
						border-radius: 50%;
						margin: 0 20rpx;
						
						.image{
							width: 120rpx;
							height: 120rpx;
							position: relative;
							z-index: 2;
						}
						.amount{
							position: absolute;
							left: 0;
							right: 0;
							top: 0;
							bottom: 0;
							margin: auto;
							font-size: 30rpx;
							color: #fff;
						}
					}
					.huojian{
						background: none;
						font-size: 50rpx;
						color: #ff5500;
					}
					.item:first-of-type{
						&::after{
							content: '';
							position: absolute;
							background:none;
							color: #fff;
							
						}
						
					}
					.item::after{
						content: '';
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						right: 0;
						width: 200rpx;
						height: 2px;
						background: #ccc;
						z-index: -2;
					}
					.current::after{
						content: '';
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						right: 0;
						width: 180rpx;
						height: 2px;
						background: #ff5500;
						z-index: -2;
					}
				}
				.summary {
					text-align: center;
					color: #666;
					font-size: 26rpx;
				}
			}

			.center-bottom {
				padding: 20rpx;
				border-top: 20rpx #f4f4f4 solid;
				.item{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 20rpx;
					padding: 30rpx 0;
					border-bottom: 1px solid #f5f5f5;
					.left{
						display: flex;
						align-items: center;
						.image{
							margin-right: 30rpx;
							width: 60rpx;
							height: 60rpx;
						}
						.title{
							.name{
								font-weight: bold;
							}
							.num{
								color: #666;
								font-size: 26rpx;
								margin-top: 10rpx;
							}
						}
					}
					.btn{
						border: 1px solid $theme-color;
						border-radius: 30rpx;
						color: $theme-color;
						padding: 10rpx 30rpx;
					}
					&:last-of-type{
						border: none;
					}
				}
			}
		}
		.bottom{
			margin: 20rpx 30rpx;
			.tip{
				color: #666;
				font-size: 26rpx;
				padding: 20rpx;
			}
			.btn{
				border-radius: 10rpx;
				color:#fff;
				padding: 30rpx;
				background: $theme-color;
				text-align: center;
			}
		}
	}
	.uniPopup-toast{
		.image{
			padding-top: 20rpx;
			width: 60rpx;
			height: 60rpx;
		}
		.title{
			margin: 20rpx;
		}
		.num{
			color: red;
		}
		.content{
			padding: 20rpx 80rpx;
			font-size: 24rpx;
			color: #999;
		}
		.btn{
			width: 200rpx;
			height: 60rpx;
			line-height: 60rpx;
			background: $theme-color;
			color: #fff;
			border-radius: 10rpx;
			text-align: center;
			margin: 0 auto;
		}
	}
</style>
