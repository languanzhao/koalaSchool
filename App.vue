
<script>
	import Vue from 'vue'
	import api from '@/common/api.js'
	import { mapState,mapMutations } from 'vuex'
	export default {
		globalData: {
			invitedCode:'',
		    historyRecord:[]
		},
		mounted() {
			
		},
		methods:{
			...mapMutations(['setUserInfo','saveToken','setRoles']),
			//检查是否PC端
			checkIsPc(){
				let regExp = /iOS|Android/i
				uni.getSystemInfo({
					success(e){
						/* 窗口宽度大于420px且不在PC页面且不在移动设备时跳转至 PC.html 页面 */
						if(e.windowWidth > 420 && !window.top.isPC && !regExp.test(e.system)){
							window.location.pathname = '/static/PC.html';
						}
					}
				})
			},
			//获取顶部状态栏高度
			getStatusBarheight(){
				uni.getSystemInfo({
				        success:function(e){
				            Vue.prototype.$statusBar = e.statusBarHeight
				            // #ifndef MP
				            if(e.platform == 'android') {
				                Vue.prototype.$customBar = e.statusBarHeight + 50
				            }else {
				                Vue.prototype.$customBar = e.statusBarHeight + 45
				            }
				            // #endif
				            
				            // #ifdef MP-WEIXIN
				            let custom = wx.getMenuButtonBoundingClientRect()
							console.log(custom,'wx')
							Vue.prototype.$wxRightMargin = e.screenWidth - custom.left;
				            Vue.prototype.$customBar = custom.bottom + custom.top - e.statusBarHeight
				            // #endif
				            
				            // #ifdef MP-ALIPAY
				            Vue.prototype.$customBar = e.statusBarHeight + e.titleBarHeight
				            // #endif
				        }
				    })
			},
			getUserInfo(){
				let id = uni.getStorageSync('userInfo').id 
				// 判断有没有id，有则说明登录过了，重新把缓存存进vuex
				if (id) {
					//用户信息
					uni.getStorage({
						key: 'userInfo',
						success: (res) => {
							this.setUserInfo(res.data)
						}
					})
					let objToken = uni.getStorageSync('objToken')
					let roles = uni.getStorageSync('roles')
					this.saveToken(objToken)
					this.setRoles(roles)
					console.log(roles,'roles')
				}
			},
			appUpdateVer(){
				// plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {  
				//    uni.request({  
				//        url: 'http://www.example.com/update/',  
				//        data: {  
				//            version: widgetInfo.version,  
				//            name: widgetInfo.name  
				//        },  
				//        success: (result) => {  
				//            var data = result.data;  
				//            if (data.update && data.wgtUrl) {  
				//                uni.downloadFile({  
				//                    url: data.wgtUrl,  
				//                    success: (downloadResult) => {  
				//                        if (downloadResult.statusCode === 200) {  
				//                            plus.runtime.install(downloadResult.tempFilePath, {  
				//                                force: false  
				//                            }, function() {  
				//                                console.log('install success...');  
				//                                plus.runtime.restart();  
				//                            }, function(e) {  
				//                                console.error('install fail...');  
				//                            });  
				//                        }  
				//                    }  
				//                });  
				//            }  
				//        }  
				//    });  
				// });  
			}
		},
		onLaunch: function() {
			// #ifdef APP-PLUS
				this.appUpdateVer()
			// #endif
			
			// #ifdef H5
			    this.checkIsPc()
			// #endif
			this.getStatusBarheight()
			this.getUserInfo()
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style>
	@import './static/iconfont/iconfont.css';
	page{
		font-size: 28rpx;
		font-family: '微软雅黑';
	}
	/* #ifdef H5 */
		::-webkit-scrollbar {
			display: none;
		}
	/* #endif */
</style>
