<template>
	<view class="detail">
		<!-- #ifdef H5 -->
			<view class="goHome" @click="goHome">
				<view class="iconfont icon-home"></view>
			</view>
		<!-- #endif -->
		<!-- 院校端 -->
		<view class="" v-if="detail.type != 'tutoring'">
			<view class="detail_header">
				<view class="schoolAvatar">
					<view class="avatarImgBox u-skeleton-circle">
						<image :src="detail.avatar" mode=""></image>
					</view>
					<view class="schoolInfo">
						<view class="item">
							<view class="num u-skeleton-rect">{{detail.recruit_count}}</view>
							<view class="title u-skeleton-rect">已报读</view>
						</view>
						<view class="item">
							<view class="num u-skeleton-rect">{{detail.view_count}}</view>
							<view class="title u-skeleton-rect">浏览数</view>
						</view>
						<view class="item">
							<view class="num u-skeleton-rect">{{detail.favor_count}}</view>
							<view class="title u-skeleton-rect">已收藏</view>
						</view>
					</view>
				</view>
				<view class="detail_title u-skeleton-rect">{{detail.name}}<text class="planLabel" v-if="detail.type === 'normal'">助学计划</text></view>
				<view class="school_code u-skeleton-rect">招生代码：<text v-if="detail.recruit_code">{{detail.recruit_code}}</text></view>
				<view class="labelList">
					招生范围：
					<view class="labelList-item u-skeleton-fillet" v-if="detail.recruit_type_education">
						{{education[detail.recruit_type_education]}}
					</view>
					<view class="labelList-item u-skeleton-fillet" v-if="detail.recruit_type_recent">
						{{recent[detail.recruit_type_recent]}}
					</view>
					<view class="labelList-item u-skeleton-fillet" v-if="detail.recruit_province || detail.recruit_city">
						{{detail.recruit_province || ''}} {{detail.recruit_city || ''}}
					</view>
				</view>
				<!-- 操作按钮 -->
				<view class="operation">
					<view class="operation-item" @click="collectBtn(detail.is_favour)">
						<text :class="['iconfont',detail.is_favour ? 'icon-collected' : 'icon-nullCollect']"></text>
						<text class="title">收藏</text>
					</view>
					<view class="operation-item" @click="shareSchool">
						<text class="iconfont icon-share"></text>
						<text class="title">分享院校</text>
					</view>
					<view class="" style="display: flex;" @click="showSameSchoolBtn">
						<view class="operation-item">
							<text class="iconfont icon-sameSchool"></text>
							<text class="title">相似院校</text>
						</view>
						<view class="operation-item" style="margin-left: 10rpx;">
							<text :class="['iconfont',showSameSchoolBool ? 'icon-jiantoushang' : 'icon-jiantouxia']"></text>
						</view>
					</view>
				</view>
			</view>
			<!-- 相关院校 -->
			<view :class="['sameSchool','iconfont',showSameSchoolBool ? 'downAnimation' : 'upAnimation']">
				<recommend-list :list='list' :show="allShow"></recommend-list>
			</view>
			<!-- tab页签 -->
			<view class="detail_tab">
				<view :class="['tab-item','u-skeleton-rect',current === index ? 'currentIcon' : '']" v-for="(item,index) of tabList"
				 :key='index' @click="tabClick(index)">
					<text :class="['iconfont',current === index ? item.currentIcon : item.icon]"></text>
					<text class="title">{{item.title}}</text>
				</view>
			</view>
			<!-- tab页签下的内容 -->
			<view class="tab_image_video" v-if="current === 0">
				<view class="item" v-for="(item,index) of imageVideoList" v-if="index < 11" :key='index' :style="{'width': imageVideoWidth + 'px','height': imageVideoWidth + 'px'}"
				 @click="goDetail(item)">
					<image mode="aspectFill" :src="item.hasOwnProperty('image_url') ? item.image_url : item.cover_url" :style="{'width': imageVideoWidth + 'px','height': imageVideoWidth + 'px'}"></image>
					<view :class="['iconfont',item.hasOwnProperty('image_url') ?'icon-tupian' : 'icon-shexiang']"></view>
				</view>
				<view class="item" @click="goDetail" v-if="imageVideoList.length > 11" :style="{'width': imageVideoWidth + 'px','height': imageVideoWidth + 'px','line-height':imageVideoWidth + 'px','text-align':'center',color:'#666'}">更多&gt;&gt;</view>
			</view>
			<view class="fullTextBack" v-if="current === 1" v-html="detail.summarize">
			</view>
			<view class="fullTextBack" v-if="current === 2" v-html="detail.general_rules">
			</view>
			<!-- tab页签下的内容 -->
			<!-- 学院介绍 -->
			<view class="detail_intro">
				<view class="title u-skeleton-rect">学院介绍</view>
				<view class="introList">
					<view class="intro-item u-skeleton-rect">
						<view class="key">创建时间：</view>
						<view class="value">{{detail.built_at | timeFormat('yyyy')}}</view>
					</view>
					<view class="intro-item u-skeleton-rect">
						<view class="key">学校类型：</view>
						<view class="value">{{detail.college_classes}}</view>
					</view>
					<view class="intro-item u-skeleton-rect">
						<view class="key">学校性质：</view>
						<view class="value">{{property[detail.property]}}</view>
					</view>
					<view class="intro-item u-skeleton-rect">
						<view class="key">学院层次：</view>
						<view class="value">{{collegeLevel[detail.college_level]}}</view>
					</view>
					<view class="intro-item u-skeleton-rect">
						<view class="key">隶属于：</view>
						<view class="value">{{detail.subjection}}</view>
					</view>
					<view class="intro-item u-skeleton-rect">
						<view class="key">报名截止日期：</view>
						<view class="value">{{detail.end_at | timeFormat('MM-dd')}}</view>
					</view>
				</view>
			</view>
			<!-- 学院位置 -->
			<view class="detail_loaction" @click="locationClick">
				<view class="title">
					<view>学院位置</view>
					<view class="iconfont icon-leftArrow"></view>
				</view>
				<view class="loaction"><text class="iconfont icon-location"></text>{{detail.province || ''}} {{detail.city || ''}}
					{{detail.district || ''}} {{detail.address || ''}}</view>
				<view class="address" v-if="popupShareShow">
					<map style="width: 100%; height: 120px;" :latitude="detail.lat" :scale='14' :longitude="detail.lon" :markers="markers"></map>
				</view>
			</view>
			<view class="fixed-bottom-btn-two">
				<view class="fixed-bottom-btn">
					<view class="left" @click="applyBtn(1)" :style="{'visibility':!detail.contact_information ? 'hidden' : ''}">联系咨询</view>
					<view class="right" @click="applyBtn(2)" v-if="detail.contact_information">我要报名</view>
					<view class="right" @click="applyBtn(1)" v-if="!detail.contact_information">联系咨询</view>
				</view>
			</view>
		</view>
		<!-- 兴趣辅导端 -->
		<view class="u-skeleton" v-if="detail.type === 'tutoring'">
			<view class="detail_header">
				<view class="schoolAvatar-tutoring">
					<view class="avatarImgBox u-skeleton-circle">
						<image :src="detail.avatar" mode=""></image>
					</view>
					<view class="schoolInfo">
						<view class="detail_title u-skeleton-rect">{{detail.name}}</view>
						<view class="labelList-tutoring">
							<view class="labelList-item u-skeleton-fillet" v-if="detail.city || detail.district">
								<text class="text">{{detail.city || ''}} {{detail.district || ''}}</text>
							</view>
							<view class="labelList-item u-skeleton-fillet" v-if="detail.tags">
								<text class="text">{{detail.tags}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="schoolSwiper">
					<swiper class="swiper" :autoplay="true" circular :interval="3000" :duration="1000" @change="schoolSwiperChange">
						<swiper-item v-for="(item,index) of imageVideoList" :key='index' @click="swiperItemClick(item.items)">
							<image :src="item.hasOwnProperty('image_url') ? item.image_url : item.cover_url" mode=""></image>
						</swiper-item>
					</swiper>
					<view class="process">{{schoolSwiperCurrent + 1}}/{{imageVideoList.length}}</view>
				</view>
				
				<!-- 操作按钮 -->
				<view class="operation">
					<view class="operation-item" @click="collectBtn(detail.is_favour)">
						<text :class="['iconfont',detail.is_favour ? 'icon-collected' : 'icon-nullCollect']"></text>
						<text class="title-tutoring">收藏</text>
					</view>
					<view class="operation-item" @click="shareSchool">
						<text class="iconfont icon-share"></text>
						<text class="title-tutoring">分享</text>
					</view>
					<view class="" style="display: flex;" @click="showSameSchoolBtn">
						<view class="operation-item">
							<text class="iconfont icon-sameSchool"></text>
							<text class="title-tutoring">相似</text>
						</view>
						<view class="operation-item" style="margin-left: 10rpx;">
							<text :class="['iconfont',showSameSchoolBool ? 'icon-jiantoushang' : 'icon-jiantouxia']"></text>
						</view>
					</view>
				</view>
			</view>
			<!-- 相关院校 -->
			<view :class="['sameSchool','iconfont',showSameSchoolBool ? 'downAnimation' : 'upAnimation']">
				<recommend-list :list='list' :show="allShow"></recommend-list>
			</view>
			<!-- tab页签 -->
			<view class="detail_tab">
				<view :class="['tab-item','u-skeleton-rect',current === index ? 'currentIcon' : '']" v-for="(item,index) of tabListTutoring"
				 :key='index' @click="tabClick(index)">
					<text :class="['iconfont',current === index ? item.currentIcon : item.icon]"></text>
					<text class="title">{{item.title}}</text>
				</view>
			</view>
			<!-- tab页签下的内容 -->
			<view class="fullTextBack" v-if="current === 0" v-html="detail.summarize">
			</view>
			<view class="fullTextBack" v-if="current === 1" v-html="detail.general_rules">
			</view>
			<!-- tab页签下的内容 -->
			<!-- 学院介绍 -->
			<view class="detail_intro">
				<view class="title u-skeleton-rect">学院介绍</view>
				<view class="none" v-if="!detail.introduce">暂无介绍内容</view>
				<view class="introList" v-html="substr(detail.introduce)" v-if="detail.introduce"></view>
				<view v-if="openHide" class="openHide" @click="spreadClick">{{openHide == 1 ? '展开' : '收起'}}</view>
			</view>
			<!-- 学院位置 -->
			<view class="detail_loaction" @click="locationClick">
				<view class="title">
					<view>学院位置</view>
					<view class="iconfont icon-leftArrow"></view>
				</view>
				<view class="loaction"><text class="iconfont icon-location"></text>{{detail.province || ''}} {{detail.city || ''}}
					{{detail.district || ''}} {{detail.address || ''}}</view>
				<view class="address" v-if="popupShareShow">
					<map style="width: 100%; height: 120px;" :latitude="detail.lat" :scale='14' :longitude="detail.lon" :markers="markers"></map>
				</view>
			</view>
			<view class="fixed-bottom-btn-two">
				<view class="fixed-bottom-btn">
					<view class="left" @click="applyBtn(1)" :style="{'visibility':!detail.contact_information ? 'hidden' : ''}">联系咨询</view>
					<view class="right" @click="applyBtn(2)" v-if="detail.contact_information">我要报名</view>
					<view class="right" @click="applyBtn(1)" v-if="!detail.contact_information">联系咨询</view>
				</view>
			</view>
		</view>
		<u-skeleton :loading="skeletonLoading" :animation="true" bgColor="#FFF"></u-skeleton>
		<!-- 分享弹窗 -->
		<!-- #ifdef APP-PLUS -->
		<uni-popup ref="popupShare" type="bottom" @change="popupShareClose">
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
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import Map from '@/common/map/openMap.js'
	import recommendList from '@/components/school-list/recommend'
	import api from '@/common/api.js'
	import {
		checkAuthSetting,
		debounce,
		checkLogin,
		schoolInfoToLink,
		removeHTMLTag,
		getLocationSearchParams,
		login_wx_h5,
		set_user_info,
		schoolDetailShare,
		login_mp_wx,
		app_share_wx
	} from '@/common/utils.js'
	const app = getApp()
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			recommendList
		},
		data() {
			return {
				skeletonLoading:true,
				schoolSwiperCurrent:0,
				openHide: false,// false 不显示按钮 1：显示展开更多 2：显示收起
				circleImg: this.$rootUrl + 'koala_images/login/circle.png',
				firendsImg: this.$rootUrl + 'koala_images/login/wx01.png',
				popupShareShow: true,
				allShow: false,
				scrollTop: 0,
				invitedCode: '',
				applyedBool: false,
				options: '',
				paramsCode: '',
				imageVideoWidth: 0,
				imageVideoList: [],
				imageList: [],
				videoList: [],
				current: null,
				schoolId: null,
				detail: {},
				showSameSchoolBool: false,
				education: {
					'all': '学历不限',
					'middle': '初中',
					'high': '高中'
				},
				recent: {
					'0': '不限',
					'1': '应届',
					'2': '往届'
				},
				property: {
					'public': '公办',
					'private': '民办',
					'unite': '联办',
					'international_public': '国际公立',
					'international_private': '国际私立'
				},
				collegeLevel: {
					'secondary': '中专',
					'junior': '大专',
					'undergraduate': '本科',
					'master':'研究生',
					'early':'早教托管'
				},
				markers: [{
					latitude: 23.136831,
					longitude: 113.35451,
					iconPath: '../../.././static/location.png',
					width: 30,
					height: 30
				}],
				tabList: [{
						title: '图片视频',
						icon: 'icon-xiangji',
						currentIcon: 'icon-xiangji-active'
					},
					{
						title: '学校概况',
						icon: 'icon-xuesimao',
						currentIcon: 'icon-xuesimao-active'
					},
					{
						title: '招收专业',
						icon: 'icon-zhuangye',
						currentIcon: 'icon-zhuangye-active'
					}
				],
				tabListTutoring: [{
						title: '师资概括',
						icon: 'icon-xuesimao',
						currentIcon: 'icon-xuesimao-active'
					},
					{
						title: '开设课程',
						icon: 'icon-zhuangye',
						currentIcon: 'icon-zhuangye-active'
					},
				],
				list: [],
			}
		},
		computed: {
			...mapState(['roles', 'userInfo'])
		},
		onLoad(options) {
			if (options.id) {
				let schoolId = Number(options.id)
				this.schoolId = schoolId
			}

			if (options.invitedCode) {
				this.invitedCode = options.invitedCode
			}

			if (options.scene) {
				let scene = decodeURIComponent(options.scene)
				let sceneList = scene.split(',')
				if (sceneList[0]) {
					this.schoolId = Number(sceneList[0])
				}
				if (sceneList[1]) {
					this.invitedCode = sceneList[1]
				}
				console.log(options.scene, 'options.scene')
				console.log(scene, 'scene')
				console.log(this.invitedCode, 'invitedCode')
			}

			// #ifdef H5
			login_wx_h5(this.invitedCode)
			// #endif

			// #ifdef MP-WEIXIN
			login_mp_wx(app,this.invitedCode)
			// #endif

			this.getDetail()
			this.getSameSchool()
			this.getDataList()
			if (this.$store.state.objToken.access_token) {
				this.getApplication()
			}
			
			// #ifdef H5
				this.share_h5()
			// #endif
			// 获取系统信息
			uni.getSystemInfo({
				success: res => {
					this.imageVideoWidth = res.screenWidth / 3
				}
			})
		},
		onShow() {

		},
		methods: {
			spreadClick(){
				 if (this.openHide === 1) {
				      this.openHide = 2
				    } else {
				      this.openHide = 1
				    }
			},
			substr(str){
				if(str){
					if(this.openHide == 1){
						 return str.substring(0,150)
					}else{
					  return str
					}
				}
			},
			schoolSwiperChange(e){
				this.schoolSwiperCurrent = e.detail.current
			},
			goHome() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			//获取我的报名
			getApplication() {
				this.$http({
					api: api.latestApplications,
					method: 'GET',
				}).then(res => {
					if (res.data) {
						if (res.data.closed === false) {
							this.applyedBool = true
						}
					}
				}).catch(err => {

				})
			},
			//相似院校
			getSameSchool() {
				this.$http({
					api: api.getSchoolList + '/' + this.schoolId + '/similar',
					method: 'GET',
				}).then(res => {
					this.list = res.data
				})
			},
			//获取详情
			getDetail() {
				this.$http({
					api: api.getSchoolList + '/' + this.schoolId,
					method: 'GET',
				}).then(res => {
					this.skeletonLoading = false
					let detail = res.data
					if (detail.summarize) {
						//rich-img 类名兼容微信小程序 图片溢出问题
						detail.summarize = detail.summarize.replace(/\<img/gi,
							"<img class='rich-img' style='max-width:100%;height:auto;display:block;' ")
					}
					if(detail.introduce && detail.introduce.length > 150){
						this.openHide = 1
					}
					if (detail.general_rules) {
						detail.general_rules = detail.general_rules.replace(/\<img/gi,
							"<img class='rich-img' style='max-width:100%;height:auto;display:block;' ")
					}
					this.detail = detail
					// 设置浏览记录
					let historyRecord = app.globalData.historyRecord
					historyRecord.unshift({
						id: this.detail.id,
						name: this.detail.name,
						property: this.detail.property,
						college_level: this.detail.college_level,
						province: this.detail.province,
						city: this.detail.city,
						district: this.detail.district,
						avatar: this.detail.avatar
					})
					// 以id为准去重
					let obj = {}
					historyRecord = historyRecord.reduce((pre, cur) => {
						obj[cur.id] ? '' : (obj[cur.id] = true && pre.push(cur));
						return pre;
					}, []);
					// 截取前20条记录
					if (historyRecord.length > 20) {
						historyRecord.substr(0, 20)
					}
					console.log(historyRecord, '详情')
					app.globalData.historyRecord = historyRecord
				}).catch(err => {

				})
			},
			//tab页签点击
			tabClick(index) {
				if (this.current === index) {
					this.current = null
				} else {
					this.current = index
				}
				switch (index) {
					case 0:
						break;
					case 1:
						break;
					case 2:
				}
			},
			swiperItemClick(items){
				let urls = items.map((item,index) => {
					return item.image_url
				})
				uni.previewImage({
					current:items[0].image_url,
					urls:urls
				})
			},
			//收藏功能
			collectBtn(bool) {
				checkLogin().then(() => {
					let apiUrl = '',
						tip = ''
					if (bool) {
						apiUrl = api.favoritesDeletes
						tip = '取消收藏'
						this.$set(this.detail, 'is_favour', false)
					} else {
						apiUrl = api.favoritesStores
						tip = '收藏成功'
						this.$set(this.detail, 'is_favour', true)
					}
					uni.showToast({
						icon: 'none',
						title: tip
					})
					let that = this
					this.api(that, apiUrl)
				})
			},
			api: debounce((that, apiUrl) => {
				that.$http({
					api: apiUrl,
					method: 'POST',
					params: {
						ids: String(that.schoolId)
					}
				}).then(res => {

				}).catch(err => {

				})
			}, 1000, false),
			//报名申请
			applyBtn(type) {
				checkLogin().then(() => {
					if (type === 1) {
						uni.navigateTo({
							url: "/pages/news/chat?schoolId=" + this.schoolId
						})
					} else if (type === 2) {
						let detail = this.detail
						if(this.detail.type === "tutoring"){
							if (detail.id) {
								schoolInfoToLink(detail)
							}
						}else{
							if (this.applyedBool) {
								uni.showToast({
									icon: 'none',
									title: '您已报过名'
								})
							} else {
								if (detail.id) {
									schoolInfoToLink(detail)
								}
							}
						}
					}
				})
			},
			//定位
			locationClick() {
				// #ifdef MP
				checkAuthSetting().then(() => {
					this.app_wx_openLocation()
				})
				// #endif

				// #ifdef H5
				this.openLocation()
				// #endif
				
				// #ifdef APP-PLUS
					this.app_wx_openLocation()
				// #endif
			},
			//app 微信小程序 打开地图导航
			app_wx_openLocation(){
				let { lat,lon,name,province,city,district,address } = this.detail
				uni.openLocation({
					latitude: Number(lat), 
					longitude: Number(lon),
					name: name,
					address: province || '' + city || '' + district || '' + address || '', 
					scale: 14,
					success: res => {},
					fail: err => {
						console.log(err, 'err')
					}
				})
			},
			//导航 打开地图(微信h5)
			openLocation() {
				return new Promise((resolve, reject) => {
					let url = location.href.split('#')[0]
					var that = this
					that.$http({
						api: api.configuration,
						method: 'POST',
						params: {
							url: url
						}
					}).then(res => {
						jweixin.config({
							debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: res.data.appId, // 公众号的唯一标识
							timestamp: res.data.timestamp, // 生成签名的时间戳
							nonceStr: res.data.nonceStr, // 生成签名的随机串
							signature: res.data.signature, // 签名，
							url: res.data.url,
							jsApiList: ['openLocation']
						});
						jweixin.ready(function() {
							let {
								lat,
								lon,
								name,
								province,
								city,
								district,
								address
							} = that.detail
							jweixin.openLocation({ //​使用微信内置地图查看位置。
								latitude: parseFloat(lat), //要去的纬度-地址
								longitude: parseFloat(lon), //要去的经度-地址
								name: name,
								address: province + city + district + address, //详细地址
								scale: 14
							})
						});
					}).catch(err => {

					})
				})
			},
			//显示隐藏相似院校
			showSameSchoolBtn() {
				if (this.list.length > 0) {
					this.showSameSchoolBool = !this.showSameSchoolBool
				} else {
					uni.showToast({
						icon: 'none',
						title: '暂无相似院校'
					})
				}
			},
			//获取图片
			getSchoolImages() {
				return new Promise((resolve, reject) => {
					let list = this.imageList || []
					this.$http({
						api: api.schoolImages,
						method: 'GET',
						params: {
							page: 1,
							perPage: 10,
							school_id: this.schoolId
						}
					}).then(res => {
						this.imageList = list.concat(res.data.data || [])
						resolve()
					}).catch(err => {
						reject()
					})
				})
			},
			//获取视频
			getSchoolVideos() {
				return new Promise((resolve, reject) => {
					let list = this.videoList || []
					this.$http({
						api: api.schoolVideos,
						method: 'GET',
						params: {
							page: 1,
							perPage: 10,
							school_id: this.schoolId
						}
					}).then(res => {
						this.videoList = list.concat(res.data.data || [])
						resolve()
					}).catch(err => {
						reject()
					})
				})
			},
			//交叉合并数组
			crossArray() {
				let totalLength = this.imageList.length + this.videoList.length
				let arr = []
				for (var i = 0; i <= totalLength; i++) {
					if (this.imageList[i]) {
						arr.push(this.imageList[i])
					}
					if (this.videoList[i]) {
						arr.push(this.videoList[i])
					}
				}
				this.imageVideoList = arr
			},
			//获取图片视频数据
			getDataList() {
				this.imageList = []
				this.videoList = []
				this.imageVideoList = []
				this.getSchoolVideos().then(() => {
					this.getSchoolImages().then(() => {
						this.crossArray()
					}).catch(err => {})
				}).catch(err => {})
			},
			//进入详情
			goDetail(item) {
				console.log(item)
				if (item.hasOwnProperty('image_url')) {
					let urlList = item.items.map((item, index) => {
						return item.image_url
					})
					console.log(urlList)
					uni.previewImage({
						current: urlList[0],
						urls: urlList
					})
				} else {
					uni.navigateTo({
						url: '/sub_school/pages/detail/img-video?schoolId=' + this.schoolId
					})
				}
			},
			// 点击分享院校
			shareSchool() {
				// #ifdef APP-PLUS
				this.popupShareShow = false
				this.$refs.popupShare.open()
				// #endif

				// #ifndef APP-PLUS
				schoolDetailShare(this.detail)
				// #endif
			},
			//关闭分享弹窗 显示地图
			popupShareClose(status) {
				if (!status.show) {
					this.popupShareShow = true
				}
			},
			//自定义分享
			share_h5() {
				const that = this
				let url = location.href.split('#')[0]
				let shareUrl = this.$projectUrl + '/#/sub_school/pages/detail/index?id=' + this.schoolId
				let koala = this.$store.state.userInfo.koala
				if (koala && koala.code) {
					shareUrl += '&invitedCode=' + koala.code
				}
				that.$http({
					api: api.configuration,
					method: 'POST',
					params: {
						url: url
					}
				}).then(res => {
					jweixin.config({
						debug: false,
						appId: res.data.appId,
						timestamp: res.data.timestamp,
						nonceStr: res.data.nonceStr,
						signature: res.data.signature,
						url: url,
						jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
					});
					// 分享到微信
					jweixin.ready(function() {
						// 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
						jweixin.updateAppMessageShareData({
							title: that.detail.name || "考拉上学", // 分享标题
							desc: that.detail.description || "我分享了一所院校给你", // 分享描述
							link: shareUrl, // 分享链接
							imgUrl: that.detail.avatar, // 分享图标
							success: function(res) {

							},
							cancel: function(res) {

							}
						});
						//自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
						jweixin.updateTimelineShareData({
							title: that.detail.name || "考拉上学", // 分享标题
							link: shareUrl, // 分享链接
							imgUrl: that.detail.avatar, // 分享图标
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
				app_share_wx(type, this.detail)
			}
		},
		filters:{
			
		},
		//微信小程序分享
		onShareAppMessage(res) {
			let invitedCode = ''
			if (this.userInfo.koala && this.userInfo.koala.code) {
				invitedCode = this.userInfo.koala.code
			}
			if (res.from === 'menu') {
				// 右上角分享按钮
				return {
					title: this.detail.name,
					imageUrl: this.detail.avatar,
					path: `/sub_school/pages/detail/index?id=${this.detail.id}&invitedCode=${invitedCode}`
				}
			}

		},
	}
</script>
<style>
	rich-text .rich-img {
		width: 100%;
		height: auto;
	}
</style>
<style lang="scss" scoped>
	.goHome {
		position: fixed;
		top: 20rpx;
		left: 20rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: $theme-color;
		width: 50rpx;
		height: 50rpx;
		z-index: 100000;

		.iconfont {
			color: #fff;
			font-size: 25rpx;

		}
	}

	.detail {
		.detail_header {
			padding: 50rpx 30rpx 0;
			margin-bottom: 20rpx;
			.schoolAvatar {
				display: flex;
				align-items: center;
				justify-content: space-between;
			
				.avatarImgBox {
					@include w-h-br(145rpx);
					margin-left: 20rpx;
				}
			
				.schoolInfo {
					display: flex;
					justify-content: space-between;
					margin-left: 60rpx;
					flex: 1;
			
					.item {
						text-align: center;
			
						.num {
							font-weight: bold;
							font-family: SourceHanSansCN;
						}
			
						.title {
							font-size: 26rpx;
						}
					}
				}
			}
			.schoolAvatar-tutoring {
				display: flex;
				align-items: center;
				.avatarImgBox {
					@include w-h-br(145rpx);
					margin-left: 20rpx;
				}
				.schoolInfo {
					margin-left: 30rpx;

					.item {
						text-align: center;

						.num {
							font-weight: bold;
							font-family: SourceHanSansCN;
						}

						.title {
							font-size: 26rpx;
						}
					}
				}
			}
			.schoolSwiper{
				margin: 20rpx 0;
				width: 100%;
				height: 400rpx;
				position: relative;
				.swiper{
					height: 400rpx;
				}
				.process{
					position: absolute;
					right: 10rpx;
					bottom: 10rpx;
					border-radius: 30rpx;
					padding: 2rpx 20rpx;
					background: rgba(0,0,0,.5);
					color: #fff;
					z-index: 10;
				}
			}
			.detail_title {
				margin: 20rpx 0;
				font-weight: bold;
				font-size: 32rpx;

				.planLabel {
					display: inline-block;
					padding: 6rpx 10rpx;
					border: 1rpx solid #e4e4e4;
					margin-left: 26rpx;
					font-size: 26rpx;
					font-weight: normal;
					border-radius: 10rpx;
				}
			}

			.school_code {
				color: #232323;
				font-size: 26rpx;
			}

			.labelList {
				display: flex;
				align-items: center;
				margin: 20rpx 0;

				.labelList-item {
					background: #ececec;
					border-radius: 10rpx;
					padding: 10rpx 16rpx;
					margin-right: 16rpx;
					font-size: 26rpx;
				}
			}
			.labelList-tutoring{
				margin: 10rpx 0;
				.labelList-item {
					font-size: 26rpx;
					margin: 20rpx 0;
					.text{
						background: #ececec;
						border-radius: 10rpx;
						padding: 6rpx 10rpx;
					}
				}
			}
			.operation {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.operation-item {
					border-radius: 10rpx;
					padding: 16rpx 32rpx;
					border: 1rpx solid #dbdbdb;
					background: #fff;
					font-size: 26rpx;
					font-weight: bold;

					.title {
						margin-left: 10rpx;
					}
					.title-tutoring{
						margin-left: 30rpx;
					}
					.iconfont {
						font-size: 28rpx;
						color: #030000;
					}

					.icon-collected {
						color: red;
					}
				}
			}
		}

		.sameSchool {
			background: #fff;
			overflow: hidden;
		}

		.upAnimation {
			height: 0;
			transition: height .5s;
		}

		.downAnimation {
			height: 450rpx;
			transition: height .5s;
		}

		.detail_tab {
			position: sticky;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 10;
			display: flex;
			padding: 10rpx 30rpx;
			background: #fafafa;
			border-top: 1rpx solid #d8d8d8;

			.tab-item-center {
				margin: 0 10rpx;
			}

			.tab-item {
				padding: 20rpx 30rpx;
				flex: 1;
				text-align: center;
				.title {
					margin-left: 10rpx;
					font-size: 28rpx;
				}

				.iconfont {
					font-size: 28rpx;
				}
			}

			.currentIcon {
				color: $theme-color;
			}
		}

		.detail_intro {
			margin: 20rpx 30rpx;
			border-top: 1rpx solid #e6e6e6;
			border-bottom: 1rpx solid #e6e6e6;
			.none{
				color: #999;
				text-align: center;
				margin: 20rpx 0;
			}
			.openHide{
				text-align: center;
				color: $theme-color;
			}
			.title {
				font-weight: bold;
				margin: 20rpx 0;
			}

			.introList {
				display: flex;
				flex-wrap: wrap;
				.intro-item {
					width: 50%;
					display: flex;
					margin-bottom: 20rpx;

					.key {
						color: #858585;
						white-space: nowrap;
					}

					.value {}
				}
			}
		}

		.tab_image_video {
			display: flex;
			// justify-content: space-around;
			flex-wrap: wrap;

			.item {
				position: relative;
				border: 1rpx solid #fff;

				// box-sizing: border-box;
				.iconfont {
					position: absolute;
					top: 10rpx;
					right: 10rpx;
					width: 44rpx;
					height: 44rpx;
					font-size: 44rpx;
					color: #fff;
				}
			}
		}

		.fullTextBack {
			box-sizing: border-box;
			overflow: hidden;
			padding: 20rpx 30rpx;
		}

		.detail_loaction {
			padding: 0 30rpx;
			margin-bottom: 30rpx;

			.loaction {
				display: inline-block;
				border-radius: 10rpx;
				border: 1rpx solid #dadada;
				padding: 10rpx;
				color: #4C4C4C;
				font-size: 26rpx;
				margin-bottom: 10rpx;

				.icon-location {
					margin-right: 10rpx;
				}
			}

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-weight: bold;
				margin: 20rpx 0;
			}

			.icon-leftArrow {
				font-size: 26rpx;
			}
		}

		.fixed-bottom-btn {
			background: transparent;
		}
	}

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
</style>
