<template>
	<view class="user">
		<view class="" v-if="weapp_check_bool">
			<view>
				<view class="processMask" v-if="processMaskShow" @touchstart.prevent="processTouchstart"></view>
				<!-- 普通用户端 -->
				<view class="role-user" v-if="roles && !roles[0]">
					<view class="header">
						<view class="money iconfont icon-rmb" @click="walletLink"></view>
						<view class="header_top">
							<view class="name_part">
								<view class="name" @click="personalInfoLink">{{info.koala && info.koala.name ? info.koala.name : '去填写信息'}}</view>
								<view class="edit">
									<text class="iconfont icon-edit"></text>
									<text class="mes" @click="personalInfoLink">我的在线信息</text>
									<view class="weixin" @click="bindWx">
										<text class="iconfont icon-weixin"></text>
										<text class="bind">{{info.koala && info.koala.weixin_account ? '已绑定' : '未绑定'}}</text>
									</view>
								</view>
							</view>
							<view class="avatarImg">
								<image :src="info.koala && info.koala.avatar ? info.koala.avatar : avatarImg"  class="avatarImg" @click="personalInfoLink"></image>
							</view>
						</view>
						<view class="header_bottom">
							<view class="item" v-for="(item,index) of mesList" :key='index' @click="mesListItemClick(index)">
								<view class="num">{{item.num}}</view>
								<view class="title">{{item.title}}</view>
							</view>
						</view>
					</view>
					<view class="process">
						<view class="title" @click="processListLink">
							入学进度
							<view class="">
								<text class="all">查看全部</text>
								<text class="iconfont icon-leftArrow"></text>
							</view>
						</view>
						<view :class="['content',showOper ? '' : 'marginLeft']" v-if="applyProcess.id">
							<view class="content_left">
								<apply-process :item='applyProcess'></apply-process>
							</view>
							<view class="pot iconfont icon-gengduo" v-if="showOper" @click="showOperClick"></view>
							<view class="operation" v-if="!showOper">
								<view class="item detail" @click="progressDetail">详情</view>
								<!-- #ifndef H5 -->
								<!-- <view class="item share">分享</view> -->
								<!-- #endif -->
							</view>
						</view>
					</view>
					<view class="share_enter">
						<image class="item" :src="shareImg" mode="" style="width: 100%;" @click="shareClick" v-if="!showTask"></image>
						<view class="item" @click="shareClick" v-if="showTask">
							<image class="image" :src="myShare" mode=""></image>
						</view>
						<view class="item" @click="taskCenterClick" v-if="showTask">
							<image class="image" :src="myCenter" mode=""></image>
						</view>
					</view>
					<list-cell :list='list'></list-cell>
				</view>
				<!-- 顾问端 -->
				<view class="role-adviser" v-if="roles && roles[0]">
					<view class="header">
						<role-adviser :info="info"></role-adviser>
						<view class="wallet" @click.stop="adviserWalletLink">
							<view class="wallet-left">
								<view class="num">累计在途：{{info.koala && info.koala.amount_pending ? info.koala.amount_pending : 0}}</view>
								<view class="summary">每月的15日后可提现上月发放的差旅补助 <text class="iconfont icon-leftArrow"></text></view>
							</view>
							<view class="wallet-right">
								进入钱包
							</view>
						</view>
					</view>
					<view class="function">
						<view class="share_enter" v-if="!showTask">
							<view class="item" @click="adviserTeam">
								<image class="image" :src="myTeam" mode=""></image>
							</view>
							<view class="item" @click="shareClick">
								<image class="image" :src="myShare" mode=""></image>
							</view>
						</view>
						<scroll-view scroll-x="true" class="scroll-view" v-if="showTask">
							<image :src="myTeam" mode="" class="function-item" @click="adviserTeam"></image>
							<image :src="myShare" mode="" class="function-item" @click="shareClick"></image>
							<image :src="myCenter" mode="" class="function-item" @click="taskCenterClick"></image>
						</scroll-view>
					</view>
					<view class="list-cell-box">
						<list-cell :list='adviserList'></list-cell>
					</view>
				</view>
			</view>
			<!-- 分享弹窗 -->
			<!-- #ifdef APP-PLUS -->
				<uni-popup ref="popupShare" type="bottom">
					<view class="popupContent">
						<view class="popupContent-title">分享到</view>
						<view class="shareList">
								<view class="item" @click="appShareWx(2)">
									<image :src="circleImg"></image>
									<view>朋友圈</view>
								</view>
								<view class="item" @click="appShareWx(1)">
									<image :src="firendsImg"></image>
									<view>好友</view>
								</view>
						</view>
					</view>
				</uni-popup>
			<!-- #endif -->
		</view>
		<view class="role-user" v-if="!weapp_check_bool">
			<view class="header">
				<!-- <view class="money iconfont icon-rmb" @click="walletLink"></view> -->
				<view class="header_top">
					<view class="name_part">
						<view class="name">{{info.koala && info.koala.name ? info.koala.name : '姓名'}}</view>
					</view>
					<image :src="info.koala && info.koala.avatar ? info.koala.avatar : avatarImg"  class="avatarImg" @click="personalInfoLink"></image>
				</view>
			</view>
			<audit-data :list='auditData'></audit-data>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import listCell from '@/components/list-cell';
	import {mapState} from 'vuex';
	import {copyValue,checkLogin,goLogin,getLocationSearchParams,login_wx_h5,set_user_info,login_mp_wx,unReadCount_news,Throttle} from '@/common/utils.js'
	import api from '@/common/api.js'
	import roleAdviser from './components/role-adviser.vue'
	import applyProcess from '@/components/applyProcess'
	import auditData from '@/components/auditData'
	const app = getApp()
	export default {
		components: {
			listCell,
			roleAdviser,
			applyProcess,
			auditData
		},
		data() {
			return {
				showTask:false,
				circleImg:'',
				firendsImg:'',
				shareImg:'',
				myTeam:'',
				myShare:'',
				myCenter:'',
				weapp_check_bool:true,
				invitedCode:'',
				info:{},
				applyProcess:{},
				avatarImg: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=145692761,4091651670&fm=26&gp=0.jpg',
				processMaskShow: false,
				showOper: true,
				mesList: [{
						num: 0,
						title: '咨询过',
						path: '/sub_user/pages/consulted/index'
					},
					{
						num:0,
						title: '浏览记录',
						path:'/sub_user/pages/school-collected/index?type=1'
					},
					{
						num: 0,
						title: '已收藏',
						path: '/sub_user/pages/school-collected/index?type=2'
					}
				],
				list: [
					{
						icon: 'icon-contactAddress',
						title: '通讯地址',
						path: '/sub_user/pages/personalInfo/addressList',
					},
					{
						icon: 'icon-guwen',
						title: '顾问申请',
						path: '/sub_tim/pages/joinUs/index?type=2&path=my',
						params:'adviserApply'
					},
					{
						icon: 'icon-kefu',
						title: '联系客服',
						path: '/pages/news/chat',
					},
					{
						icon: 'icon-aboutUs',
						title: '关于我们',
						path: '/sub_user/pages/about/index',
					}
				],
				adviserList: [
					{
						icon: 'icon-xuesimao',
						title: '入学进度',
						path: '/sub_user/pages/progress/list',
					},
					{
						icon: 'icon-yaoqing',
						title: '邀约进度',
						path: '/sub_user/pages/invited/index',
					},
					{
						icon: 'icon-kefu',
						title: '顾问服务',
						path: '/pages/news/chat',
					},
					{
						icon: 'icon-aboutUs',
						title: '关于我们',
						path: '/sub_user/pages/about/index',
					}
				],
				auditData:[
					{
						id:10,
						title:'退一步风平浪静，忍一时海阔天空',
						src:'http://www.59xihuan.cn/uploads/allimg/20130611/85751370929458-lp.jpg'
					},
					{
						id:1,
						title:'一本好书是一个艺术大师宝贵的血液',
						src:'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=3960943378,4108671332&fm=85&app=92&f=JPEG?w=121&h=75&s=32E5DD0406B037968208A59D0300C082'
					},
					{
						id:2,
						title:'我阅读关于我所不懂的题目之书籍时，所用的方法',
						src:'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1123578154,3549181330&fm=55&app=54&f=JPEG?w=1140&h=640'
					},
					{
						id:3,
						title:'家庭成为快乐的种子',
						src:'http://www.59xihuan.cn/uploads/allimg/20130708/5501373284923-lp.jpg'
					},
					{
						id:4,
						title:'关于读书名言大全寄语',
						src:'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3824556614,2647611468&fm=55&app=54&f=JPEG?w=1140&h=640'
					}
				]
			}
		},
		computed: {
			...mapState(['userInfo', 'objToken', 'roles','intentionObj'])
		},
		onLoad(options) {
			this.circleImg = this.$rootUrl + 'koala_images/login/circle.png'
			this.firendsImg = this.$rootUrl + 'koala_images/login/wx01.png'
			this.shareImg = this.$rootUrl + 'koala_images/user/share02.png'
			this.myTeam = this.$rootUrl + 'koala_images/user/team.png'
			this.myShare = this.$rootUrl + 'koala_images/user/share.png'
			this.myCenter = this.$rootUrl + 'koala_images/user/center.png'
			
			if(options.invitedCode){
				this.invitedCode = options.invitedCode
			}
			// #ifdef H5
				login_wx_h5(this.invitedCode)
				this.share_h5()
			// #endif
			
			// #ifdef MP-WEIXIN
				login_mp_wx(app,this.invitedCode)
				this.wxInit()
			// #endif
		},
		onShow(){
			if(this.userInfo.id){
				this.info = JSON.parse(JSON.stringify(this.userInfo))
				this.getIntention()
				this.getApplication()
				this.getUserRoles()
				this.getCollectNum()
				this.mesList[1].num = app.globalData.historyRecord.length
				let info = uni.getStorageSync('schoolChat')
				if(info){
					this.mesList[0].num = JSON.parse(info).length
				}
			}
			this.unReadCount_api()
		},
		mounted() {},
		// onHide：监听页面的隐藏
		// 当从当前A页跳转到其他页面，那么A页面处于隐藏状态。
		onHide() {
			this.showOper = true
		},
		onUnload(){
			
			// this.showOper = true
		},
		methods: {
			//微信小程序审核
			wxInit(){
				uni.request({
				    url: this.$projectUrl + '/config.json?time=' + Math.random().toString(36), 
					success: (jsonData) => {
						if (jsonData.data.weapp_check == 1) {
							this.weapp_check_bool = false
						}
					}
				})
			},
			unReadCount_api: Throttle((that) => {
				unReadCount_news()
			},10000,false),
			//获取收藏数量
			getCollectNum(){
				this.$http({
					api: api.collectNum,
					method: 'GET',
				}).then(res => {
					this.mesList[2].num = res.data.favorite_count
				}).catch(err => {
							
				})
			},
			// 个人信息跳转
			personalInfoLink() {
				checkLogin().then(() => {
					uni.navigateTo({
						url: '/sub_user/pages/personalInfo/index'
					})
				})
			},
			//菜单跳转
			mesListItemClick(index) {
				checkLogin().then(() => {
					uni.navigateTo({
						url:this.mesList[index].path
					})
				})
			},
			//钱包跳转
			walletLink() {
				checkLogin().then(() => {
					uni.navigateTo({
						url: '/sub_user/pages/wallet/index'
					})
				})
			},
			//入学进度点击展开
			showOperClick() {
				checkLogin().then(() => {
					this.showOper = false
					this.processMaskShow = true
				})
			},
			//遮罩层触摸事件：遮罩层隐藏且入学进度模块收起
			processTouchstart() {
				this.processMaskShow = false
				this.showOper = true
			},
			//兼容PC端上浏览时使用鼠标滚动而不是触摸
			onPageScroll() {
				this.showOper = true
			},
			// 入学进度
			progressDetail() {
				if(this.applyProcess.id){
					uni.navigateTo({
						url: "/sub_user/pages/progress/index?type=2&&id=" + this.applyProcess.id
					})
				}
			},
			//分享入口
			shareClick() {
				checkLogin().then(() => {
					// #ifdef APP-PLUS
						this.$refs.popupShare.open()
					// #endif
					
					// #ifndef APP-PLUS
						uni.navigateTo({
							url:'/sub_user/pages/poster/index'
						})
					// #endif
				})
			},
			//获取报读意向返回的数据
			getIntention(){
				if(this.intentionObj && this.intentionObj.intentionList[0]){
					let nameArr = this.intentionObj.intentionList.map((item,index) => {
						return item.name
					})
					this.list[0].tip = nameArr.join('、')
					this.list[0].params = this.intentionObj
				}else{
					this.list[0].tip = ''
					this.list[0].params = {}
				}
			},
			//获取我的报名
			getApplication(){
					this.$http({
						api: api.latestApplications,
						method: 'GET',
					}).then(res => {
						this.applyProcess = res.data
						if(res.data.type === 'normal'){
							if(res.data.closed === false){
								if(res.data.refund_status != 'success'){
									if(res.data.pass_status === 'success' || res.data.pass_status === 'ship' || res.data.pass_status === 'finish'){
										this.showTask = true
									}else{
										this.showTask = false
									}
								}else{
									this.showTask = false
								}
							}else{
								this.showTask = false
							}
						}else{
							this.showTask = false
						}
					}).catch(err => {
								
					})
			},
			//用户角色
			getUserRoles(){
				this.$http({
					api: api.getUserRoles,
					method: 'GET',
				}).then(roles => {
					let data = roles.data.data
					if(data && data[0]){
						if(!this.roles[0]){
							this.$http({
								api: api.getUserInfo,
								method: 'GET'
							}).then(res => {
								this.info = res.data
								this.$store.commit('setUserInfo', res.data)
							}).catch(err => {});
						}
						this.$store.commit('setRoles',data)
					}
				}).catch(err => {
							
				})
			},
			//绑定微信
			bindWx(){
				checkLogin().then(() => {
					uni.navigateTo({
						url:'/sub_user/pages/bindwx/index'
					})
				})
			},
			//任务中心
			taskCenterClick(){
				checkLogin().then(() => {
					uni.navigateTo({
						url:'/sub_tim/pages/taskCenter/index'
					})
				})
			},
			//入学进度列表页
			processListLink(){
				uni.navigateTo({
					url:'/sub_user/pages/progress/list'
				})
			},
/////////////////////////////////////////////////////////////////////////////////
			//顾问端
			//钱包跳转
			adviserWalletLink() {
				checkLogin().then(() => {
					uni.navigateTo({
						url: '/sub_adviser/pages/wallet/index'
					})
				})
			},
			//我的团队
			adviserTeam() {
				checkLogin().then(() => {
					uni.navigateTo({
						url: '/sub_adviser/pages/team/index'
					})
				})
			},
			//自定义分享
			share_h5() {
				const that = this
				let url = location.href.split('#')[0]
				let shareUrl = this.$projectUrl + '/#/pages/user/user'
				let koala = this.$store.state.userInfo.koala
				if(koala && koala.code){
					shareUrl += '?invitedCode='+ koala.code
				}
				that.$http({
					api: api.configuration,
					method: 'POST',
					params:{
						url: url
					}
				}).then(res => {
				    jweixin.config({
				    	debug: false, 
				    	appId: res.data.appId, 
				    	timestamp: res.data.timestamp, 
				    	nonceStr: res.data.nonceStr,
				    	signature: res.data.signature, 
				    	url:url, 
				    	jsApiList:['updateAppMessageShareData', 'updateTimelineShareData']
				    });
				    // 分享到微信
				    	jweixin.ready(function() {
				    		// 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
				    		jweixin.updateAppMessageShareData({
				    			title: '我的', // 分享标题
				    			desc: '择校好难？你是没有使用考拉上学吧！收录百大院校，求学有考拉上学，我的前途不迷茫', // 分享描述
				    			link: shareUrl, // 分享链接
				    			imgUrl: that.$rootUrl + 'koala_images/logo.png', // 分享图标
				    			success: function(res) {
				    				
				    			},
				    			cancel: function(res) {
				    				
				    			}
				    		});
				    		//自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
				    		jweixin.updateTimelineShareData({
				    			title: '我的', // 分享标题
				    			link: shareUrl, // 分享链接
				    			imgUrl: that.$rootUrl + 'koala_images/logo.png', // 分享图标
				    			success: function() {
				    				
				    			},
				    			cancel: function() {
				    				
				    			}
				    		});
				    	});
				}).catch(err => {
							
				})
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
		},
		//微信小程序分享
		onShareAppMessage(res) {
			let invitedCode = ''
			if(this.userInfo.koala && this.userInfo.koala.code){
				invitedCode = this.userInfo.koala.code
			}
			if(res.from === 'menu'){
			// 右上角分享按钮
				return {
					title: '考拉上学',
					imageUrl: this.$projectUrl + 'koala_images/logo.png',
					path: `/pages/user/user?invitedCode=${invitedCode}`
				}
			}
		},
	}
</script>
<style lang="scss">
	page {
		background: $page-background;
	}
</style>
<style lang="scss" scoped>
	.processMask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		// background: rgba(0,0,0,.5);
		z-index: 2;
	}

	// 普通用户端
	.role-user {

		//头部
		.header {
			padding: 20rpx 30rpx;
			background: $theme-color;
			color: #fff;
			.money {
				text-align: right;
				color: #fff;
				font-size: 38rpx;
				margin-bottom: 24rpx;
			}
			.header_top {
				@include flex-c-b();

				.avatarImg {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
				}

				.name_part {
					margin-left: 30rpx;

					.name {
						font-size: 58rpx;
					}

					.edit {
						display: flex;
						align-items: center;
						font-size: 26rpx;
						margin-top: 10rpx;
						.icon-edit{
							font-size: 23rpx;
						}
						.mes{
							margin: 0 20rpx;
						}
						.weixin{
							display: flex;
							align-items: center;
							.icon-weixin{
								font-size: 35rpx;
							}
							.bind{
								font-size: 20rpx;
								margin-left: 6rpx;
							}
						}
						
					}
				}

				
			}

			.header_bottom {
				@include flex-c-b();
				margin: 50rpx 30rpx 0;
				.item {
					text-align: center;

					.num {
						font-size: 36rpx;
					}

					.title {
						font-size: 24rpx;
						margin-top: 10rpx;
					}
				}
			}

		}

		//头部

		//入学进度
		.process {
			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-weight: bold;
				margin: 30rpx 32rpx;
				font-size: 34rpx;
				.all,.iconfont{
					color: #666;
					font-size: 28rpx;
				}
				
			}

			.content {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #fff;
				border-radius: 10rpx;
				overflow: hidden;
				margin: 0 20rpx 10rpx;
				box-shadow: 0 0 8rpx #f5f5f5;
				.content_left {
					display: flex;
					align-items: center;

					image {
						@include w-h-br(112rpx);
					}

					.info {
						margin-left: 20rpx;

						.pro_top {
							font-weight: bold;
						}

						.schoolName {
							font-size: 28rpx;
							@include line-clamp-one;
							max-width: 400rpx;
						}

						.pro_bottom {
							font-size: 28rpx;
							color: #999;
							white-space: nowrap;
							@include line-clamp-one;
							max-width: 400rpx;
						}
					}
				}

				.pot {
					margin: auto 10rpx;
					font-size: 58rpx;
				}

				.operation {
					display: flex;
					position: relative;
					z-index: 3;

					.item {
						width: 90rpx;
						height: 120rpx;
						line-height: 120rpx;
						text-align: center;
						border-radius: 10rpx;
						font-size: 28rpx;
					}

					.detail {
						background: $theme-color;
						margin-right: 10rpx;
						color: #fff;
					}

					.share {
						background: #ccc;
					}
				}
			}

			.marginLeft {
				margin-left: -80rpx;
				animation: scrollLeft 1s;

				@keyframes scrollLeft {
					0% {
						margin-left: 0;
					}

					100% {
						margin-left: -80rpx;
					}
				}
			}
		}

		//入学进度

		

		//分享入口图	
	}

	// 普通用户端

	// 顾问端
	.role-adviser {
		.header {
			background: #12ada9;
			color: #fff;
			.wallet {
				display: flex;
				align-items: center;
				padding:20rpx;
				background: #363131;
				border-top-left-radius: 20rpx;
				border-top-right-radius: 20rpx;
				margin: 0 20rpx;
				.wallet-left {
					margin-left: 30rpx;
					.icon-leftArrow{
						font-size: 16rpx;
						color: #f2bb62;
						margin-left: 10rpx;
					}
					.num{
						font-size: 28rpx;
					}
					.summary{
						font-size: 20rpx;
						color: #FFFFDB;
						margin-top: 20rpx;
					}
				}

				.wallet-right {
					padding: 10rpx 16rpx;
					font-size: 24rpx;
					border-radius: 10rpx;
					margin-left: auto;
					background: #ffe4b1;
					color: #2E3237;
				}
			}
		}

		.function {
			display: flex;
			justify-content: space-around;
			margin:0 20rpx 20rpx;
			padding: 24rpx 0;
			border-bottom-left-radius: 20rpx;
			border-bottom-right-radius: 20rpx;
			background: #fff;
			text-align: center;
			.scroll-view{
				white-space: nowrap;
				height: 150rpx;
				.function-item {
					display: inline-block;
					width: 326rpx;
					height: 151rpx;
					margin-right: 20rpx;
					border-radius: 10rpx;
					.iconfont{
						font-size: 62rpx;
					}
					.title{
						margin: 10rpx 0 20rpx;
						font-size: 28rpx;
					}
					.summary{
						font-size: 22rpx;
						color: #6C6C6C;
					}
				}
			}
		}
		.list-cell-box{
			margin: 0 20rpx;
			border-radius: 20rpx;
			overflow: hidden;
		}
	}

	// 顾问端
	
	.popupContent {
		background: #fff;
		padding: 20rpx;
		// #ifdef H5
		margin-bottom: 50px; //适配网页
		// #endif
		.popupContent-title {
			text-align: center;
			font-weight: bold;
			font-size: 36rpx;
			margin-bottom: 20rpx;
		}
		.shareList {
			display: flex;
			align-items: center;
			// justify-content: space-around;
			.item {
				text-align: center;
				flex: 1;
				image {
					width: 76rpx;
					height: 76rpx;
				}
			}
		}
	}
	
	//分享入口图
	.share_enter {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 10rpx 20rpx;
		.item{
			width: 48%;
			height: 160rpx;
			.image{
				border-radius: 10rpx;
			}
		}
		
	}
</style>
