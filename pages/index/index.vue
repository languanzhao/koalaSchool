<template>
	<view class="index">
		<view class="" v-if="weapp_check_bool">
			<view class="u-skeleton">
				<!-- 搜索 -->
				<view class="index-header" v-if="schoolListType">
					<view class="title">考拉上学</view>
					<view class="search u-skeleton-fillet" @click="searchLink">
						<text class="iconfont icon-search"></text>
						<text class="input">搜索</text>
					</view>
					<view class="iconfont shaixuan icon-shuaixuan" @click="chooseShowClick"></view>
				</view>
				<!-- 条件选择 -->
				<view class="condition" v-if="chooseShow&&schoolListType">
					<view class="cond-left">
						<view class="item" v-for="(item,index) of condLeftList" :key='index' @click="condLeftItemClick(item.type)" :style="{'color':currentType === item.type ? '#12ada9' : ''}">{{item.title}}</view>
					</view>
					<view class="cond-right">
						<view class="item" @click="chooseAddress">{{selectedCity && selectedCity.name ? selectedCity.name : '请选择地址'}}</view>
						<view class="item" @click="conditionClickOrCancel" :style="{'color':conditionBool || (totalLength > 0) ? '#82cecb' : ''}">筛选{{totalLength ? '·' + totalLength : ''}}</view>
					</view>
					<view class="conditionMask-fixed-mask" v-if="conditionBool" @touchmove.stop.prevent='touchstartPage'></view>
					<view class="conditionMask-fixed" v-if="conditionBool" @touchmove.stop.prevent='touchstartPage'>
						<view class="title">学校层次</view>
						<view class="content">
							<view v-for="(item,index) of college_level_list" :key='index' @click="college_level_click(item.value)" :class="['item',college_level === item.value ? 'selectedItem' : '']">{{item.title}}</view>
						</view>
						<view class="title">办学性质</view>
						<view class="content">
							<view :class="['item',!propertySelectList[0] ? 'selectedItem' : '']" @click="conditionAll(1)">不限</view>
							<view v-for="(item,index) of propertyList" :key='index' @click="propertyItemClick(item.value)" :class="['item',ItemSelect(1,item.value) ? 'selectedItem' : '']">{{item.title}}</view>
						</view>
						<view class="title">学校类型</view>
						<view class="content">
							<view :class="['item',!schoolTypeSelectList[0] ? 'selectedItem' : '']" @click="conditionAll(2)">不限</view>
							<view :class="['item',ItemSelect(2,item) ? 'selectedItem' : '']" v-for="(item,index) of schoolType" :key='index'
							 @click="schoolTypeItemClick(item)">{{item}}</view>
						</view>
						<view class="button">
							<view class="item reset" @click="conditionReset">重置</view>
							<view class="item" @click="chooseItem">确定</view>
						</view>
						<view class="iconfont icon-guanbi2" @click="conditionClickOrCancel"></view>
					</view>
				</view>
				<view class="index-change-tab" v-if="schoolListType">
					<view :class="['item',item.value === indexChangeTabValue ? 'current' : '']" v-for="(item,index) of tabList" :key="index" @click="indexChangeTabClick(item.value)">{{item.title}}</view>
				</view>
				<!-- 搜索 -->
				<!-- 学校列表 -->
				<school-list  ref='schoolList' :list='schoolList' :scrollTop="scrollTop" :applyedBool="applyedBool" :indexChangeTabValue="indexChangeTabValue"></school-list>

				<view class="nullData" v-if="schoolList && !schoolList[0]" style="text-align: center;margin-top: 100rpx;">
					没有数据啦
				</view>
			</view>
			<view class="goTop" v-if="scrollTop > 1000" @click="goTop">
				<view class="iconfont icon-zhiding"></view>
			</view>
		</view>
		<view class="" v-if="!weapp_check_bool">
			<audit-data :list='auditData'></audit-data>
		</view>
		<!-- 地址选择器 -->
		<simple-address ref="simpleAddress" :areaBool='false' :pickerValueDefault="cityPickerValueDefault" @onConfirm="addressConfirm"
		 themeColor="#007AFF"></simple-address>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	const App = getApp()
	import schoolList from '@/components/school-list/list'
	import auditData from '@/components/auditData'
	import simpleAddress from '@/components/simple-address/simple-address.nvue';
	import api from '@/common/api.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		schoolType,
		getLocationSearchParams,
		login_wx_h5,
		set_user_info,
		checkAuthSetting,
		login_mp_wx,
		unReadCount_news,
		Throttle
	} from '@/common/utils.js'
	export default {
		components: {
			schoolList,
			simpleAddress,
			auditData
		},
		data() {
			return {
				indexChangeTabValue:'normal',
				tabList:[
					{
						title:'学历教育',
						value:'normal'
					},
					{
						title:'继续教育',
						value:'adult'
					},
					{
						title:'兴趣辅导',
						value:'tutoring'
					},
				],
				all: '',
				applyedBool: false,
				weapp_check_bool: true,
				chooseShow: true,
				invitedCode: '',
				current_page: 1,
				last_page: 0,
				userId: 0,
				scrollTop: 0,
				schoolList: null,
				conditionBool: false,
				schoolType: schoolType(),
				cityPickerValueDefault: [0, 0, 1],
				schoolListType:false,
				selectedCity: {
					name: '',
					code: ''
				},
				locationRes: null,
				currentType: 1,
				college_level: '',
				college_level_list: [{
						title: '不限',
						value: ''
					},
					{
						title: '中专',
						value: 'secondary'
					},
					{
						title: '大专',
						value: 'junior'
					},
					{
						title: '本科',
						value: 'undergraduate'
					},
					{
						title: '研究生',
						value: 'master'
					},
					{
						title: '早教托管',
						value: 'early'
					},
				],
				condLeftList: [{
						type: 1,
						title: '综合'
					},
					{
						type: 2,
						title: '附近'
					},
				],
				propertyList: [{
						title: '公办教育',
						value: 'pubilc'
					},
					{
						title: '民办教育',
						value: 'private'
					},
					{
						title: '联办教育',
						value: 'unite'
					},
					{
						title: '国际公立',
						value: 'international_public'
					},
					{
						title: '国际私立',
						value: 'international_private'
					}
				],
				totalLength: 0,
				propertySelectList: [],
				schoolTypeSelectList: [],
				propertySelectList_value: '',
				schoolTypeSelectList_value: '',
				auditData: [{
						id: 0,
						title: '逆境是磨练意志的熔钢炉',
						src: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1123578154,3549181330&fm=55&app=54&f=JPEG?w=1140&h=640'
					},
					{
						id: 1,
						title: '一本好书是一个艺术大师宝贵的血液',
						src: 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=3960943378,4108671332&fm=85&app=92&f=JPEG?w=121&h=75&s=32E5DD0406B037968208A59D0300C082'
					},
					{
						id: 2,
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
			...mapState(['intentionObj', 'objToken', 'userInfo', 'roles'])
		},
		onLoad(options) {
			if (options.scene) {
				let scene = decodeURIComponent(options.scene)
				let sceneList = scene.split(',')
				if (sceneList[0]) {
					this.invitedCode = sceneList[0]
				}
				console.log(options.scene, 'options.scene')
				console.log(scene, 'scene')
				console.log(this.invitedCode, 'invitedCode')
			}

			if (options.invitedCode) {
				this.invitedCode = options.invitedCode
			}

			// #ifdef H5
				login_wx_h5()
				this.getIndexDataList()
				this.share_h5()
			// #endif

			// #ifdef MP-WEIXIN
			login_mp_wx(App,this.invitedCode)
			this.wxInit()
			this.get_wx_location()
			uni.$on('mpwx', data => {
				this.get_wx_location()
			})
			// #endif

			// #ifdef APP-PLUS
			this.get_app_location()
			uni.$on('mpwx', data => {
				this.get_app_location()
			})
			// #endif

			//显示我之前选择的地址选项
			let selectedCity = uni.getStorageSync('selectedCity')
			if (selectedCity) {
				this.cityPickerValueDefault = selectedCity.value
				this.selectedCity.name = selectedCity.name
				this.selectedCity.code = selectedCity.code
			}
			// #ifdef H5
			  var isPageHide = false;
			  window.addEventListener('pageshow', function () {
				   if (isPageHide) {
						window.location.reload();
					}
			 });
			 window.addEventListener('pagehide', function () {
				   isPageHide = true;
			 });
			// #endif
		},
		onShow() {
			this.unReadCount_api()
			if (this.$store.state.userInfo.id) {
				this.getApplication()
			}
		},
		onHide() {
			// uni.$off('purpose')
		},
		onUnload() {
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
			//tab切换
			indexChangeTabClick(value){
				this.indexChangeTabValue = value
				this.reset()
			},
			getIndexDataList(){
				this.getLocalProvince().then(() => {
					this.reset()
				}).catch(() => {
					this.reset()
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
			unReadCount_api: Throttle((that) => {
				unReadCount_news()
			}, 10000, false),
			// app端获取用户省份
			get_app_location() {
				uni.getLocation({
					success: res => {
						this.locationRes = {
							longitude: res.longitude,
							latitude: res.latitude
						}
						uni.request({
							header: {
								"Content-Type": "application/text"
							},
							url: 'https://apis.map.qq.com/ws/geocoder/v1?location=' + res.latitude + ',' + res.longitude +
								'&key=HIBBZ-OJZ3I-YB2GQ-55VMG-F44K3-ZYBHI',
							success: e => {
								let info = e.data.result.ad_info
								if (info.adcode) {
									let code = info.adcode.substring(0, 2)
									let cityCode = info.adcode.substring(0, 4)
									this.local_province = code + '0000'
									this.$store.commit('save_local_province', this.local_province)
									this.$store.commit('save_local_city', cityCode + '00')
								}
								this.reset()
							}
						})
					},
					fail: err => {
						this.reset()
					}
				});
			},
			//微信小程序获取用户省份
			get_wx_location() {
				checkAuthSetting().then(() => {
					this.get_app_location()
				}).catch(err => {
					this.reset()
				})
			},
			//获取当前省份
			getLocalProvince() {
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
							jsApiList: ['getLocation']
						});
						jweixin.ready(function() {
							jweixin.getLocation({
								type: 'wgs84',
								success: function(locationRes) {
									that.$jsonp(
											'https://apis.map.qq.com/ws/geocoder/v1?coord_type=5&get_poi=1&output=jsonp&poi_options=page_size=1;page_index=1', {
												key: 'DNTBZ-K6SH4-YK2UA-XNK6V-VRG2T-IEBJ2',
												location: locationRes.latitude + ',' + locationRes.longitude
											}).then(e => {
											let info = e.result.ad_info
											if (info.adcode) {
												let code = info.adcode.substring(0, 2)
												let cityCode = info.adcode.substring(0, 4)
												that.local_province = code + '0000'
												that.$store.commit('save_local_province', that.local_province)
												that.$store.commit('save_local_city', cityCode + '00')
											}
											resolve()
										})
										.catch(err => {
											reject()
										})
								},
								fail: function() {
									reject()
								}
							})
						});
						jweixin.error(function(err) {
							reject()
						});
					}).catch(err => {
						reject()
					})
				})
			},
			//筛选点击
			chooseShowClick() {
				this.chooseShow = !this.chooseShow
			},
			touchstartPage() {},
			//综合 附近
			condLeftItemClick(type) {
				this.currentType = type
				if (type === 1) {
					this.locationRes = null
					this.selectedCity.name = ''
					this.selectedCity.code = ''
					// #ifdef H5
					this.getLocalProvince().then(() => {
						this.reset()
					}).catch(() => {
						this.reset()
					})
					// #endif

					// #ifdef MP-WEIXIN
					this.get_wx_location()
					// #endif

					// #ifdef APP-PLUS
					this.get_app_location()
					// #endif
				} else if (type === 2) {
					this.local_province = ''
					this.selectedCity.code = ''
					this.selectedCity.name = ''
					uni.removeStorage({
					    key: 'selectedCity',
					    success: res => {
							
						}
					})
					
					// #ifdef H5
					this.getLocation().then(() => {
						this.reset()
					}).catch(() => {
						this.reset()
					})
					// #endif

					// #ifdef MP-WEIXIN
					this.get_MP_WEIXIN_location()
					// #endif

					// #ifdef APP-PLUS
					this.get_APP_PLUS_location()
					// #endif
				}
			},
			//地址筛选
			chooseAddress() {
				this.$refs.simpleAddress.open();
			},
			//确认选择地址
			addressConfirm(e) {
				this.cityPickerValueDefault = e.value //保留当前选择
				this.selectedCity = {
					name: e.labelArr[1],
					code: e.cityCode,
					value: e.value
				}
				this.currentType = 1
				this.locationRes = null
				this.local_province = ''
				uni.setStorage({
					key: 'selectedCity',
					data: this.selectedCity
				})
				this.reset()
			},
			//选中状态
			ItemSelect(type, value) {
				if (type === 1) {
					return this.propertySelectList.some(item => item === value)
				} else if (type === 2) {
					return this.schoolTypeSelectList.some(item => item === value)
				}
			},
			//学校性质
			propertyItemClick(value) {
				let bool = this.propertySelectList.some(item => item === value)
				if (bool) {
					let index = this.propertySelectList.findIndex(item => item === value)
					if (index !== -1) this.propertySelectList.splice(index, 1)
				} else {
					this.propertySelectList.push(value)
				}
			},
			//学校类型
			schoolTypeItemClick(value) {
				let bool = this.schoolTypeSelectList.some(item => item === value)
				if (bool) {
					let index = this.schoolTypeSelectList.findIndex(item => item === value)
					if (index !== -1) this.schoolTypeSelectList.splice(index, 1)
				} else {
					this.schoolTypeSelectList.push(value)
				}
			},
			//学校层次
			college_level_click(value) {
				this.college_level = value
			},
			//确定该筛选
			chooseItem() {
				if (this.propertySelectList[0]) {
					this.propertySelectList_value = this.propertySelectList.join(',')
				} else {
					this.propertySelectList_value = ''
				}
				if (this.schoolTypeSelectList[0]) {
					this.schoolTypeSelectList_value = this.schoolTypeSelectList.join(',')
				} else {
					this.schoolTypeSelectList_value = ''
				}
				this.reset()
				this.conditionLength(this.propertySelectList, this.schoolTypeSelectList)
				this.conditionClickOrCancel()
			},
			//选中全部时
			conditionAll(type) {
				if (type === 1) {
					this.propertySelectList = []
					this.propertySelectList_value = ''
				} else if (type === 2) {
					this.schoolTypeSelectList = []
					this.schoolTypeSelectList_value = ''
				}
			},
			//计算长度
			conditionLength(property, schoolType) {
				if (this.college_level) {
					this.totalLength = property.length + schoolType.length + 1
				} else {
					this.totalLength = property.length + schoolType.length
				}
			},
			//取消
			conditionClickOrCancel() {
				this.conditionBool = !this.conditionBool
			},
			//重置
			conditionReset() {
				this.propertySelectList = []
				this.propertySelectList_value = ''
				this.schoolTypeSelectList = []
				this.schoolTypeSelectList_value = '',
					this.college_level = ''
			},
			reset() {
				this.current_page = 1
				this.last_page = 0
				this.schoolList = null
				this.getSchoolList()
			},
			//学校列表数据
			getSchoolList() {
				uni.showLoading({
					title: '加载中'
				})
				let list = this.schoolList || []
				//初始化
				let params = {
					page: this.current_page,
					perPage: 5
				}

				if (this.local_province) {
					params.province = this.local_province
				} else {
					//获取用户位置（经纬度）
					if (this.locationRes && this.locationRes.longitude) {
						params.geo_distance = 100
						params.lon = this.locationRes.longitude
						params.lat = this.locationRes.latitude
					}
					//选择地址城市
					if (this.selectedCity && this.selectedCity.code) {
						params.city = this.selectedCity.code
					}
				}
				//学历层次
				if (this.college_level) {
					params.college_level = this.college_level
				}
				//办学性质
				if (this.propertySelectList_value) {
					params.properties = this.propertySelectList_value
				}
				//学校类型
				if (this.schoolTypeSelectList_value) {
					params.college_classes = this.schoolTypeSelectList_value
				}
				if(this.indexChangeTabValue){
					params.type = this.indexChangeTabValue
				}
				this.$http({
					api: api.getSchoolList,
					method: 'GET',
					params: params
				}).then(res => {
					this.schoolList = list.concat(res.data.data || [])
					this.current_page = res.data.meta.current_page
					this.last_page = res.data.meta.last_page
					this.schoolListType=true
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				})
			},
			//app端获取经纬度 并转换成地址
			get_APP_PLUS_location() {
				uni.getLocation({
					success: res => {
						this.locationRes = {
							longitude: res.longitude,
							latitude: res.latitude
						}
						uni.request({
							header: {
								"Content-Type": "application/text"
							},
							url: 'https://apis.map.qq.com/ws/geocoder/v1?location=' + res.latitude + ',' + res.longitude +
								'&key=HIBBZ-OJZ3I-YB2GQ-55VMG-F44K3-ZYBHI',
							success: e => {
								let info = e.data.result.ad_info
								this.selectedCity = {
									name: info.city
								}
								this.reset()
							}
						})
					},
					fail: err => {
						this.reset()
					}
				});
			},
			//获取微信小程序经纬度 并转换成地址
			get_MP_WEIXIN_location() {
				checkAuthSetting().then(() => {
					uni.getLocation({
						success: res => {
							this.locationRes = {
								longitude: res.longitude,
								latitude: res.latitude
							}
							uni.request({
								header: {
									"Content-Type": "application/text"
								},
								url: 'https://apis.map.qq.com/ws/geocoder/v1?location=' + res.latitude + ',' + res.longitude +
									'&key=DNTBZ-K6SH4-YK2UA-XNK6V-VRG2T-IEBJ2',
								success: e => {
									let info = e.data.result.ad_info
									this.selectedCity = {
										name: info.city
									}
									this.reset()
								}
							})
						},
						fail: err => {
							this.reset()
						}
					});
				}).catch(err => {
					this.reset()
				})
			},
			//获取当前位置信息 经纬度 并进行 逆地址解析 成城市名(微信h5)
			getLocation() {
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
							jsApiList: ['getLocation']
						});
						jweixin.ready(function(res) {
							jweixin.getLocation({
								type: 'wgs84',
								success: function(locationRes) {
									that.locationRes = locationRes
									that.$jsonp(
											'https://apis.map.qq.com/ws/geocoder/v1?coord_type=5&get_poi=1&output=jsonp&poi_options=page_size=1;page_index=1', {
												key: 'DNTBZ-K6SH4-YK2UA-XNK6V-VRG2T-IEBJ2',
												location: locationRes.latitude + ',' + locationRes.longitude
											}).then(e => {
											let info = e.result.ad_info
											that.selectedCity = {
												name: info.city
											}
											resolve()
										})
										.catch(err => {
											reject()
										})
								},
								fail: function() {
									reject()
								}
							});
						});
						jweixin.error(function(err) {
							reject()
						});
					}).catch(err => {
						reject()
					})
				})
			},
			//搜索跳转
			searchLink() {
				uni.navigateTo({
					url: '/pages/search/index'
				})
			},
			onPageScroll(e) {
				//监听页面发生滚动就将浮动模块隐藏 同时兼容PC端上浏览时使用鼠标滚动而不是触摸
				this.scrollTop = e.scrollTop
			},
			//置顶
			goTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 500
				})
			},
			//自定义分享
			share_h5() {
				const that = this
				let url = location.href.split('#')[0]
				let shareUrl = this.$projectUrl
				let koala = this.$store.state.userInfo.koala
				if (koala && koala.code) {
					shareUrl += '?invitedCode=' + koala.code
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
							title: '考拉上学（你的择校好帮手）', // 分享标题
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
							title: '考拉上学（你的择校好帮手）', // 分享标题
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
			}
		},
		onPullDownRefresh() {
			this.reset()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			if (this.current_page < this.last_page) {
				this.current_page = this.current_page + 1
				this.getSchoolList()
			}
		},
		//微信小程序分享
		onShareAppMessage(res) {
			let invitedCode = ''
			if (this.userInfo.koala && this.userInfo.koala.code) {
				invitedCode = this.userInfo.koala.code
			}
			if (res.from === 'button') {
				// 来自页面内分享按钮
				let item = res.target.dataset.item
				return {
					title: item.name,
					imageUrl: item.avatar,
					path: `/sub_school/pages/detail/index?id=${item.id}&invitedCode=${invitedCode}`
				}
			} else if (res.from === 'menu') {
				// 右上角分享按钮
				return {
					title: '考拉上学',
					imageUrl: this.$rootUrl + 'koala_images/logo.png',
					path: `/pages/index/index?invitedCode=${invitedCode}`
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
	.index-change-tab{
	    display: flex;
	    height:76rpx;
		position: sticky;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1;
		background: #fff;
	    .item{
	        flex:1;
	        line-height: 76rpx;
	        text-align: center;
	    }
		.current{
			color: $theme-color;
			background:#fafafa;
			font-weight: bold;
		}
	}
	
	.index {
		.index-header {
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			background: $theme-color;
			height: 100rpx;
			line-height: 100rpx;

			.title {
				font-size: 40rpx;
				font-family: DFPSongW9;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
			}

			.search {
				border-radius: 30rpx;
				background: #82cecb;
				flex: 1;
				height: 48rpx;
				line-height: 48rpx;
				text-align: center;
				margin: 0 20rpx 0 30rpx;

				.iconfont {
					color: #ccc;
					font-size: 24rpx;
					color: #fff;
					margin-right: 10rpx;
				}

				.input {
					color: #fbfdfd;
					font-size: 22rpx;
				}
			}

			.shaixuan {
				font-size: 40rpx;
				margin-left: 16rpx;
				color: #fff;
			}
		}

		//条件选择
		.condition {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #fff;
			margin-bottom: 10rpx;
			padding: 0 20rpx;
			height: 80rpx;
			line-height: 80rpx;

			.conditionMask-fixed {
				position: absolute;
				top: 80rpx;
				left: 0;
				width: 100%;
				height: 1000rpx;
				background: #f4f4f4;
				z-index: 3;
				padding: 0 20rpx;

				.title {
					font-weight: bold;
				}

				.content {
					display: flex;
					flex-wrap: wrap;
					padding: 0 10rpx;

					.item {
						margin: 0 30rpx 0rpx 0;
						height: 60rpx;
					}
				}

				.button {
					position: fixed;
					width: 100%;
					bottom: 140rpx;
					display: flex;
					justify-content: space-around;
					margin-top: 30rpx;

					.item {
						width: 200rpx;
						background: $theme-color;
						color: #fff;
						text-align: center;
						margin: 0 auto;
						border-radius: 20rpx;
					}

					.reset {
						color: #fff;
						background: #828387;
					}
				}

				.selectedItem {
					color: $theme-color;
				}

				.icon-guanbi2 {
					position: fixed;
					top: 200rpx;
					right: 30rpx;
					font-size: 30rpx;
					font-weight: bold;
				}
			}

			.conditionMask-fixed-mask {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: transparent;
				z-index: 2;
			}

			.cond-left {
				display: flex;

				.item {
					margin-right: 20rpx;
				}
			}

			.cond-right {
				display: flex;

				.item {
					margin-left: 20rpx;
				}
			}
		}
	}

	.goTop {
		position: fixed;
		bottom: 160rpx;
		right: 20rpx;
		background: #fff;
		color: $theme-color;
		width: 90rpx;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50%;
		text-align: center;

		.iconfont {
			width: 100rpx;
			height: 100rpx;
			font-size: 100rpx;
		}
	}
</style>
