import store from '@/vuex/store'
import context from '@/main.js'
import api from '@/common/api.js'
//消息显示红点
export function unReadCount_news(){
	if(store.state.userInfo.id){
		context.$http({
			api: api.stats,
			method: "GET",
		}).then(res => {
			if(res.data.unread_count){
				uni.setTabBarBadge({
				  index: 2,
				  text: String(res.data.unread_count) 
				})
			}
		})
	}
}
//分享到微信(app) type 1 好友 2 朋友圈
export function app_share_wx(type,schoolItem) {
	let koala = store.state.userInfo.koala
	let shareUrl = context.$projectUrl + '/#/sub_school/pages/detail/index?id=' + schoolItem.id
	if(koala && koala.code){
		shareUrl += '&invitedCode='+ koala.code
	}
	uni.share({
		provider: 'weixin',
		scene:type === 1 ? 'WXSceneSession' : 'WXSenceTimeline',
		type: 0,
		href: shareUrl,
		title: schoolItem.name,
		summary: schoolItem.description,
		imageUrl: schoolItem.avatar,
		success: function(res) {
			
		},
		fail: function(err) {
			
		}
	});
}
//隐藏右上角分享按钮
export function hideMenuItems(jweixin) {
		const that = context
		let url = location.href.split('#')[0]
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
				jsApiList:['hideMenuItems']    //注意这个列表的api要对应上
			});
			jweixin.ready(function() {
				jweixin.hideMenuItems({
				  menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
				});
			});
		}).catch(err => {
					
		})
}
//学校详情分享
export function schoolDetailShare(detail){
	checkLogin().then(() => {
		// let property = {
		// 	'public':'公办',
		// 	'private':'民办',
		// 	'unite':'联办',
		// 	'international_public':'国际公立',
		// 	'international_private':'国际私立'
		// }
		// let collegeLevel = {
		// 	'secondary': '中专',
		// 	'junior': '大专',
		// 	'undergraduate': '本科',
		// 	'master':'研究生',
		// 	'early':'早教托管'
		// }
		let info = {
			id:detail.id,
			name:detail.name,
			avatar:detail.avatar,
			tags:detail.tags,
			college_level:detail.college_level,
			type:detail.type,
			// education:collegeLevel[detail.college_level],
			property:detail.property,
			province:detail.province,
			district:detail.district,
			city:detail.city
		}
		if(removeHTMLTag(detail.summarize).length > 80){
			info.description = removeHTMLTag(detail.summarize).substr(0,80)
		}else{
			info.description = removeHTMLTag(detail.summarize)
		}
		uni.navigateTo({
			url:'/sub_school/pages/detail/detailPoster?info=' + encodeURIComponent(JSON.stringify(info))
		})
	})
}
//微信小程序登录
export function login_mp_wx(App,paramsCode){
	if(paramsCode){
		App.globalData.invitedCode = paramsCode
	}
	const that = context
	if(store.state.userInfo.id){
		//用户登录了
		that.$http({
			api: api.getUserInfo,
			method: 'GET'
		}).then(res => {
				store.commit('setUserInfo', res.data)
				let { is_counselor,is_registration,parent_id } = res.data.koala
				//锁粉
				if(paramsCode){
					if(!is_counselor && !is_registration && !parent_id){
					that.$http({
						api: api.userRelations,
						method: 'POST',
						params:{
							code:paramsCode
						},
						header:{
							'Content-Type':'application/x-www-form-urlencoded'
						}
					}).then(res => {
						
					}).catch(err => {
								
					})
				}
			}
		}).catch(err => {});
	}else{
		uni.getProvider({
		  service: 'oauth',
		  success: res=> {
			if (~res.provider.indexOf('weixin')) {
				uni.login({
					provider: 'weixin',
					success: loginRes => {
						context.$http({
							api: api.login_mp_wx,
							method: 'POST',
							params: {
								code:loginRes.code
							}
						})
							.then(infoRes => {
								getUserInfo_wx()
								set_user_info(infoRes.data,App)
							})
							.catch(err => {})
					},
					fail: () => {
						uni.showToast({title:"微信登录授权失败",icon:"none"});
					}
				})
				
			}else{
				uni.showToast({
					title: '请先安装微信或升级版本',
					icon:"none"
				});
			}
		  }
		})
	}	
}
//获取微信小程序用户信息 将微信登录获取到的头像和名称 存进个人信息
export function getUserInfo_wx(){
		uni.getUserInfo({
		  success: res => {
			let params = {
				'koala[avatar]':res.userInfo.avatarUrl,
				'koala[name]':res.userInfo.nickName,
				_method:'PATCH'
			}
			context.$http({
				api: api.getUserInfo,
				method: 'POST',
				params:params,
				header:{
					'Content-Type':'application/x-www-form-urlencoded'
				}
			}).then(info => {
				store.commit('setUserInfo',info.data)
			}).catch(err => {
						
			})
		  },
		  fail:res=>{
			  // 获取失败的去引导用户授权 
		   }
		})
}
//微信h5登录
// type 1 海报分享的是首页 使用 getLocationSearchParams() 获取传过来的值
// type 2 院校详情页分享的是 详情页 使用 onLoad 接收参数
export function login_wx_h5(paramsCode){
			const that = context
			let code = getLocationSearchParams().code
			if(paramsCode || getLocationSearchParams().invitedCode){
				window.sessionStorage.setItem('invitedCode',paramsCode || getLocationSearchParams().invitedCode)
			}
			const loginCode = window.sessionStorage.getItem('loginCode')
			const loginStatus = window.sessionStorage.getItem('loginStatus')
			let APPID = 'wxf2df0c06af696bb6'
			let currentUrl = location.href
			let REDIRECT_URI = encodeURIComponent(currentUrl)
			let SCOPE ='snsapi_userinfo'
			let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=STATE#wechat_redirect`
			if(!loginCode && !code){ //没授权
				window.location.replace(url)
			}else if(!loginCode){
				window.sessionStorage.setItem('loginCode',code)
				history.back()
			}else{ 
				if(loginCode && !loginStatus){
					//用户没有登录
					that.$http({
						api:api.login_h5_app,
						method:'POST',
						params:{
							code: loginCode
						}
					}).then(res=>{
						window.sessionStorage.setItem('loginStatus',true)
						set_user_info(res.data)
					})
				}
			}
}
//设置用户信息  
 export function set_user_info(data,App){
			const that = context
			//保存token
			let token = {
					token_type: data.token_type,
					access_token: data.access_token,
					expires_in: data.expires_in,
					login_time:new Date().getTime()
				}
			store.commit('saveToken',token);
			
			//用户角色
			that.$http({
				api: api.getUserRoles,
				method: 'GET'
			}).then(res => {
				store.commit('setRoles', res.data.data);
			}).catch(err => {});
			
			//获取用户信息并保存用户信息到vuex
			that.$http({
				api: api.getUserInfo,
				method: 'GET'
			}).then(res => {
					store.commit('setUserInfo', res.data)
					let { is_counselor,is_registration,parent_id } = res.data.koala
					let invitedCode = ''
					// #ifdef H5
						invitedCode =  window.sessionStorage.getItem('invitedCode')
					// #endif
					
					// #ifdef MP-WEIXIN
						invitedCode = App.globalData.invitedCode
					// #endif
					//锁粉
					if(invitedCode){
						if(!is_counselor && !is_registration && !parent_id){
						that.$http({
							api: api.userRelations,
							method: 'POST',
							params:{
								code:invitedCode
							},
							header:{
								'Content-Type':'application/x-www-form-urlencoded'
							}
						}).then(res => {
							
						}).catch(err => {
									
						})
					}
				}
			}).catch(err => {});
}
//去除所有标签
export function removeHTMLTag(str) {
		str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
		str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
		str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
		str = str.replace(/&nbsp;/ig,'');//去掉&nbsp;
		return str;
}
//学校详情带信息过去报名
export function schoolInfoToLink(detail){
	let info = {
		sInfo:{
			id:detail.id,
			name:detail.name,
			avatar:detail.avatar,
			tags:detail.tags,
			property:detail.property,
			type:detail.type,
			college_level:detail.college_level,
			province:detail.province,
			city:detail.city,
			district:detail.district,
			application_fee:detail.application_fee
		}
	}
	if(detail.contact_information){
		info.tInfo = {
			contact_name:detail.contact_information.contact_name,
			contact_phone:detail.contact_information.contact_phone,
			corporate_account:detail.contact_information.corporate_account
		}
	}
	uni.navigateTo({
		url:'/sub_school/pages/apply/index?info=' + encodeURIComponent(JSON.stringify(info))
	})
}
// 文本自动换行
export function canvasText(ctx,str,initX,initY,lineHeight) {
    /*
    str:要绘制的字符串
    canvas:canvas对象
    initX:绘制字符串起始x坐标
    initY:绘制字符串起始y坐标
    lineHeight:字行高
    */
        var lineWidth = 0;
        var canvasWidth = 270; 
        var lastSubStrIndex= 0; 
        for(let i=0;i<str.length;i++){
			ctx.setFillStyle('#000')
			ctx.setFontSize(12)
            lineWidth+=ctx.measureText(str[i]).width; 
            if(lineWidth>canvasWidth/8*5){
                ctx.fillText(str.substring(lastSubStrIndex,i),initX,initY);
                initY+=lineHeight;
                lineWidth=0;
                lastSubStrIndex=i;
            } 
            if(i==str.length-1){
                ctx.fillText(str.substring(lastSubStrIndex,i+1),initX,initY);
            }
        }
}
//获取url后拼接的参数
export function getLocationSearchParams() {
       var rtn = (location.search || "?").slice(1).split("&").reduce(function(a, b) {
       	var param = b.split("=");
       	a[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
       	return a;
       }, {});
       return rtn;
}
//筛选 学校类型
export function schoolType(){
	return ['综合类','理工类','师范类','农林类','政法类','医药类','财经类','民族类','语言类','艺术类','体育类','军事类','旅游类']
}
// export function refreshToken(){
// 	context.$http({
// 		api: api.updateToken,
// 		method: 'PUT'
// 	}).then(res => {
// 		//保存token
// 		let token = {
// 				token_type: res.data.token_type,
// 				access_token: res.data.access_token,
// 				expires_in:res.data.expires_in,
// 			}
// 		context.$store.commit('saveToken',token);
// 	}).catch(err => {});
// }
//判断token是否过期
export function isTokenExpired() {
  let objToken = uni.getStorageSync('objToken')
  if(objToken.access_token){
	  let nowTime = new Date().getTime()
	  let diffTime = (nowTime - objToken.login_time) / 1000
	  let timer = objToken.expires_in - 300
	  /*5分钟后即将过期*/
	  if(diffTime > timer){
		  let url = context.$baseUrl + api.updateToken
		  uni.request({
		  	url,
		  	method:'PUT',
		  	header:{
				Authorization:objToken.token_type + ' ' + objToken.access_token
			},
		  	success:res => {
		  		//保存token
		  		let token = {
		  				token_type: res.data.token_type,
		  				access_token: res.data.access_token,
		  				expires_in:res.data.expires_in,
		  				login_time:new Date().getTime()
		  			}
		  		store.commit('saveToken',token);
		  	}
		  })
	  }
  }
}
//图片上传 type 类型 avatar/id/voucher 头像、身份证、凭证
export function uploadImage(uploadType = 'avatar'){
	return new Promise((resolve,reject) => {
		uni.chooseImage({
		    count: 1, 
		    success: res => {
				let header = {}
				let objToken = store.state.objToken
				if(objToken && objToken.access_token){
					header.Authorization = objToken.token_type + ' ' + objToken.access_token
				}
				uni.showLoading({
					title:'上传中...'
				})
				uni.uploadFile({
					url: context.$baseUrl + api.uploadImages,
					filePath: res.tempFiles[0].path,
					header:header,
					name: 'image',
					formData: {
						type:uploadType
					},
					success: (uploadFileRes) => {
						let params = {
							...JSON.parse(uploadFileRes.data),
							localImage:res.tempFiles[0].path
						}
						resolve(params)
						uni.hideLoading()
					},
					fail:err => {
						reject()
						uni.hideLoading()
					}
				})
		    }
		});
	})
}
/**
 * @desc 防抖函数
 * @param {需要防抖的函数} func
 * @param {延迟时间} wait
 * @param {是否立即执行} immediate
 */
export function debounce(func, wait, immediate) {
  let timeout
  
  return function(...args) {
    let context = this
    if (timeout) clearTimeout(timeout)

    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(function() {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args)
      }, wait)
    }
  }
}
// 函数节流
export function Throttle (fn, gapTime,tip) {
  if (gapTime === null || gapTime === undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }else{
		if(tip){
			uni.showToast({
				icon:'none',
				title:tip
			})
		}
		
	}
  }
}
//跳到登录页
export function goLogin(){
	uni.navigateTo({
		url:'/pages/login/index'
	})
}
//检查是否登录
export function checkLogin(){
	return new Promise((resolve,reject) => {
		if(store.state.userInfo && store.state.userInfo.id){
			resolve()
		}else{
			uni.navigateTo({
				url:'/pages/login/index'
			})
		}
	})
}
//复制功能
export function copyValue(value){
	if(value){
		uni.setClipboardData({
		    data: value,
		    success: function (res) {
		        uni.showToast({
					icon:'none',
		        	title:'复制成功'
		        })
		    }
		})
	}
}
//手机号、身份证号验证
export function regExp(type,val) {
	switch(type){
		case 'mobile':
			return RegExp(/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199)\d{8}$/).test(val)
			break;
		case 'IDnumber':
			return RegExp(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/).test(val)
			break;
		case 'password':
			return RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/).test(val)
			break;
	}
}
//获取窗口尺寸（宽、高）可再添加更多
export function getWindowResize(element) {
	try {
		let res = uni.getSystemInfoSync()
		if (element === 'height') {
			return res.windowHeight
		} else if (element === 'width') {
			return res.windowWidth
		} else {
			return
		}
	} catch (e) {
		// error
	}
}
// 验证是否获取了相关权限，若没有则提示开始权限（默认是地图权限）
export function checkAuthSetting(scopeName = "scope.userLocation") {
  return new Promise((resolve, reject) => {
    // 查看权限列表
    uni.getSetting({
      success: res => {
        let authSetting = res.authSetting
		console.log(res,'权限列表')
        let bool = Object.keys(authSetting).some(item => item === scopeName)
        //判断用户是否有授权过
        if (bool) {
          //判断用户授权时 是同意还是拒绝  用户已经同意过，则直接进入
          if (res.authSetting[scopeName]) {
            // 权限设置为 true
            resolve()
          } else {
            //用户拒绝过后 再次 提示 需要授权
            uni.showModal({
              title: '提示',
              content: '此操作需要您的授权，请前往设置',
              success: res => {
                //确认
                if (res.confirm) {
                  uni.openSetting({
                    success: res => {
                      if (res.authSetting[scopeName]) {
                        resolve()
                      } else {
                        reject()
                      }
                    }
                  })
                  //取消
                } else if (res.cancel) {
                  reject()
                }
              }
            })
          }
        } else {
          //用户未授权过 提示用户去授权
          uni.authorize({
            scope: scopeName,
            success: res => {
              // 成功
              resolve()
            },
			fail:err => {
				resolve()
			}
          })
        }
      },
      fail: () => {
		  reject()
	  }
    })
  })
}
export default{
	
}