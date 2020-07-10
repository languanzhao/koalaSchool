<template>
	<view class="news">
		<view class="" v-if="weapp_check_bool">
			<!-- 消息，通知切换 -->
			<view class="navs-place">
				<view class="navs">
					<view v-for="(item,index) in navs" :key="index">
						<view class="nav" :class="[navId==index?'active':'']" @click="navTab(index)">{{item}}</view>
						<!-- 通知未读数量 -->
						<block v-if="index==1">
							<view v-if="unread_count>0" class="number">{{unread_count>9?"9+":unread_count}}</view>
						</block>
					</view>
				</view>
			</view>
			<!-- 消息列表	 -->
			<block v-if="navId==0">
				<view class="message" @click="jumpChat">
					<image :src="icon_sysMsg"></image>
					<view class="info">
						<view class="name">
							<view>考拉上学助手</view>
							<view class="time"></view>
						</view>
					</view>
				</view>
			</block>
			<!-- 通知列表 -->
			<block v-if="navId==1">
				<view class="notice" v-for="(item,index) in noticeList" :key="index" v-if="noticeList && noticeList[0]">
					<image class="notice-avatar" :src="icon_sysMsg"></image>
					<view class="notice-right">
						<view class="system">
							<view class="header">
								<view class="name">考拉上学助手</view>
								<view class="time">{{item.created_at | timeFormat('MM-dd hh:mm')}}</view>
							</view>
						</view>
						<!-- 助学计划额 -->
						<view v-if="item.data.type=='task'" @click="taskCenterClick">
							<block v-if="item.data.task_assignment_status=='success'">
								<view class="tip">恭喜您已达成任务完成条件，助学计划额已激活</view>
								<view class="msg">
									<view class="title">激活助学计划额({{item.data.task_name}})</view>
									<view>你的助学计划额已激活，快去领取吧</view>
								</view>
							</block>
							<block v-if="item.data.task_assignment_status=='failed'">
								<view class="tip">您提交的完成任务截图未通过审核，请重新上传</view>
								<view class="msg">
									<view class="title">激活助学计划额失败({{item.data.task_name}})</view>
									<view>您提交的完成任务截图未通过审核，请重新上传</view>
								</view>
							</block>
						</view>
						<!-- 提现状态 -->
						<view v-if="item.data.type=='withdraw_audited'" @click='adviserWalletLink'>
							<block v-if="item.data.status=='success'">
								<view class="tip">提现金额已成功发放</view>
								<view class="msg">
									<view class="title">提现金额：{{item.data.amount}}</view>
								</view>
							</block>
							<block v-if="item.data.status=='failed'">
								<view class="tip">您的提现失败</view>
								<view class="msg">
									<view class="title">提现失败</view>
								</view>
							</block>
							<block v-if="item.data.status=='pending'">
								<view class="tip">您的提现已发起申请</view>
								<view class="msg">
									<view class="title">您的提现申请正在审核中</view>
								</view>
							</block>
							<block v-if="item.data.status=='refused'">
								<view class="tip">您的的提现申请被拒绝</view>
								<view class="msg">
									<view class="title">提现金额：{{item.data.amount}}</view>
									<view>拒绝原因：{{item.data.extra.refused_reason}}</view>
								</view>
							</block>
						</view>
						<!-- 奖金 -->
						<view v-if="item.data.type=='rewarded'" @click='adviserWalletLink'>
							<!-- 助学金 -->
							<block v-if="item.data.bonus_type=='grant'">
								<view class="tip">您的助学计划额已发放到您的账户中</view>
								<view class="msg">
									<view class="title">助学计划额已成功发放</view>
									<view>您的助学计划额已成功发放至您的账户中</view>
								</view>
							</block>
							<!-- 分销返利 -->
							<block v-if="item.data.bonus_type=='distribution'">
								<view class="tip">您的分销返利已发放到您的账户中</view>
								<view class="msg">
									<view class="title">分销返利已成功发放</view>
									<view>您的分销返利已成功发放至您的账户中</view>
								</view>
							</block>
							<!-- 平台返利 -->
							<block v-if="item.data.bonus_type=='team'">
								<view class="tip">您的平台返利已发放到您的账户中</view>
								<view class="msg">
									<view class="title">平台返利已成功发放</view>
									<view>您的平台返利已成功发放至您的账户中</view>
								</view>
							</block>
							<!-- 平级返利 -->
							<block v-if="item.data.bonus_type=='peer'">
								<view class="tip">您的平级返利已成功发放到您的账户中</view>
								<view class="msg">
									<view class="title">平级返利已成功发放</view>
									<view>您的平级返利已发放至您的账户中</view>
								</view>
							</block>
						</view>
						<!-- 审核 -->
						<block v-if="item.data.type=='audited'">
							<view class="tip">您的报名审核{{item.data.pass_status=='success'?'已通过':'失败'}}</view>
							<view class="msg" @click="progressDetail(2,item.data.aplication_id)">
								<view class="title">您的报名审核{{item.data.pass_status=='success'?'已通过':'失败'}}</view>
								<view>{{item.data.school_name}}</view>
							</view>
						</block>
						<!-- 邀请 -->
						<block v-if="item.data.type=='invited'">
							<view class="tip">您邀约的同学{{item.data.name}}{{item.data.pass_status=='success'?'已经成功报名':'报名失败'}}</view>
							<view class="msg" @click="progressDetail(1,item.data.aplication_id)">
								<view class="title">{{item.data.name}}同学{{item.data.pass_status=='success'?'已经成功报名':'报名失败'}}</view>
								<view>{{item.data.school_name}}</view>
							</view>
						</block>
					</view>
				</view>
				<view class="noneNull" v-if="noticeList && !noticeList[0]">
					暂无通知
				</view>
			</block>
		</view>
		<view class="" v-if="!weapp_check_bool">
			<audit-data :list='auditData'></audit-data>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import api from '@/common/api.js'
	import {
		checkLogin,
		hideMenuItems,
		Throttle
	} from '@/common/utils.js'
	import {
		mapState
	} from 'vuex'
	import auditData from '@/components/auditData'
	const app = getApp()
	export default {
		components: {
			auditData
		},
		data() {
			return {
				icon_sysMsg: '',
				weapp_check_bool: true,
				navs: ['消息', '通知'],
				navId: 0,
				noticeList: null,
				unread_count: '',
				current_page: 1,
				last_page: 0,
				auditData: [{
						id: 8,
						title: '境是一个客观的存在。这个世界没有绝望的处境，只有对处境绝望的主体人',
						src: 'http://www.59xihuan.cn/uploads/allimg/201309/82711378688120-lp.jpg'
					},
					{
						id: 9,
						title: '每一个不努力的日子就是对生命的辜负',
						src: 'http://www.59xihuan.cn/uploads/allimg/20130604/7021370329857-lp.jpg'
					},
					{
						id: 10,
						title: '我阅读关于我所不懂的题目之书籍时，所用的方法',
						src: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1123578154,3549181330&fm=55&app=54&f=JPEG?w=1140&h=640'
					},
					{
						id: 3,
						title: '家庭成为快乐的种子',
						src: 'http://www.59xihuan.cn/uploads/allimg/20130708/5501373284923-lp.jpg'
					},
					{
						id: 4,
						title: '关于读书名言大全寄语',
						src: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3824556614,2647611468&fm=55&app=54&f=JPEG?w=1140&h=640'
					}
				]
			}
		},
		computed: {
			...mapState(['userInfo','roles'])
		},
		onLoad() {
			this.icon_sysMsg = this.$rootUrl + 'koala_images/img/icon_sysMsg.png'
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif

			// #ifdef MP-WEIXIN
			uni.hideShareMenu()
			this.wxInit()
			// #endif
		},
		onShow() {
			this.navId = 0
			this.unReadCount_api(this)
		},
		methods: {
			//微信小程序审核
			wxInit() {
				uni.request({
				    url: this.$projectUrl + '/config.json?time=' + Math.random().toString(36), 
					success: (jsonData) => {
						if (jsonData.data.weapp_check == 1) {
							this.weapp_check_bool = false
						}
					}
				})
			},
			//聊天页
			jumpChat() {
				checkLogin().then(() => {
					uni.navigateTo({
						url: "/pages/news/chat"
					})
				})
			},
			//tab切换
			navTab(index) {
				checkLogin().then(() => {
					this.navId = index
					if (index == 1) {
						this.noticeList = null
						this.getNoticeList()
						if (this.unread_count) {
							uni.removeTabBarBadge({index:2})
							this.toAlread()
						}
					}
				})
			},
			// 未读数
			unReadCount_api: Throttle((that) => {
				that.$http({
					api: api.stats,
					method: "GET",
				}).then(res => {
					that.unread_count = res.data.unread_count
				})
			},10000,false),
			// 消息标记为已读
			toAlread() {
				this.$http({
					api: api.alread,
					method: "POST",
					params: {
						'_method': 'PATCH'
					}
				}).then(res => {
					this.unread_count = 0
					uni.removeTabBarBadge({index:2})
				})
			},
			// 通知列表
			getNoticeList() {
				let list = this.noticeList || []
				this.$http({
					api: api.notifications,
					method: "GET",
					params: {
						page: this.current_page
					}
				}).then(res => {
					console.log(res, 'res')
					this.noticeList = list.concat(res.data.data || [])
					this.current_page = res.data.meta.current_page
					this.last_page = res.data.meta.last_page
				})
			},
			//入学进度详情页 跳转消掉一个红点
			progressDetail(type, id) {
				if (type && id) {
					uni.navigateTo({
						url: `/sub_user/pages/progress/index?type=${type}&&id=${id}`
					})
				}
			},
			adviserWalletLink() {
				console.log('aaa')
				checkLogin().then(() => {
					if(this.roles[0]){
						uni.navigateTo({
							url: '/sub_adviser/pages/wallet/index'
						})
					}else{
						uni.navigateTo({
							url: '/sub_user/pages/wallet/index'
						})
					}
					
				})
			},
			taskCenterClick(){
				uni.navigateTo({
					url:'/sub_tim/pages/taskCenter/index'
				})
			}
		},
		onPullDownRefresh() {
			if (this.noticeList) {
				this.current_page = 1
				this.last_page = 0
				this.noticeList = null
				this.getNoticeList()
			}
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			if (this.current_page < this.last_page) {
				this.current_page = this.current_page + 1
				this.getNoticeList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.news {
		padding: 0 15rpx;

		// 消息，通知切换
		.navs-place {
			height: 80rpx;
		}

		.navs {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			display: flex;
			align-items: center;
			height: 80rpx;
			background: #fff;
			z-index: 10000;

			view {
				position: relative;

				.nav {
					color: #acacac;
					font-size: 26rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 150rpx;
					height: 80rpx;
				}

				.active {
					color: #040404;
					font-size: 35rpx;
				}

				.active::after {
					content: "";
					display: block;
					position: absolute;
					bottom: 2rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 68rpx;
					height: 6rpx;
					background: #f43530;
				}

				.number {
					color: #fff;
					width: 30rpx;
					height: 30rpx;
					background: red;
					border-radius: 50%;
					position: absolute;
					top: 0rpx;
					right: 0rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 18rpx;
				}
			}
		}

		// 通知列表
		.notice {
			padding: 30rpx 30rpx 6rpx;
			border-top: 1px solid #f5f5f5;
			display: flex;

			.notice-avatar {
				width: 70rpx;
				height: 70rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}

			.notice-right {
				flex: 1;
			}

			.system {
				display: flex;
				align-items: center;

				.header {
					display: flex;
					flex: 1;
					align-items: center;
					justify-content: space-between;
				}

				.name {
					color: #64BEBC;
					font-size: 26rpx;
				}

				.time {
					color: #6c6c6c;
					font-size: 20rpx;
				}
			}

			.tip {
				font-size: 26rpx;
				color: #000000;
				margin: 20rpx 0;
			}

			.msg {
				background: #f3f3f3;
				color: #060606;
				font-size: 24rpx;
				border-radius: 10rpx;
				padding: 16rpx;
				margin-bottom: 6rpx;

				.title {
					font-size: 28rpx;
					margin-bottom: 20rpx;
				}
			}
		}

		// 消息列表
		.message {
			padding:20rpx;
			border-top: 1px solid #f5f5f5;
			display: flex;
			image {
				width: 86rpx;
				height: 86rpx;
				border-radius: 10rpx;
			}

			.info {
				flex: 1;
				padding-bottom: 20rpx;
				margin-left: 20rpx;
				border-bottom: 1px solid #f5f5f5;

				.name {
					display: flex;
					align-items: center;
					justify-content: space-between;
					color: #080808;
					font-size: 30rpx;

					.time {
						color: #BDBDBD;
						font-size: 20rpx;
					}
				}

				.content {
					color: #aaa;
					font-size: 26rpx;
					margin-top: 14rpx;
				}
			}
		}
	}
</style>
