module.exports = {
	verificationCodes:'koala/v1/verificationCodes',//获取验证码
	authorizations:'koala/v1/authorizations',//登录 注册
	updateToken:'koala/v1/authorizations/current',//更新token
	getUserInfo:'koala/v1/user',//获取/修改用户信息 修改传多一个 _method:'PATCH' 字段
	getUserRoles:'koala/v1/user/roles',//获取用户角色
	getSchoolList:'koala/v1/schools',//获取首页学校列表
	getMajorsList:'koala/v1/major_categories',//专业列表
	schoolImages:'koala/v1/school_images',//学校图片列表
	schoolVideos:'koala/v1/school_videos',//学校视频列表
	uploadImages:'koala/v1/images',//上传图片 根据type来传
	userApplications:'koala/v1/applications',//报名、报名详情、查看凭证 koala/v1/applications/1?show_certificate=1、关闭申请报名、取消报名
	latestApplications:'koala/v1/applications/latest',//获取最新的一条报名记录
	notifications:'koala/v1/notifications', //通知列表
	stats:'koala/v1/notifications/stats', //通知未读统计
	alread:'koala/v1/user/read/notifications',//消息标记已读
	IDAuth:'koala/v1/user/certifications',//实名认证
	getAllMajors:'koala/v1/all_majors',//获取对应学校的专业 不分页
	withdraws:'koala/v1/withdraws',//提现列表、提现详情
	invitees:'koala/v1/invitees',//直邀
	recommends:'koala/v1/recommends',//推荐
	fans:'koala/v1/fans',//粉丝
	recommend_applications:'koala/v1/recommend_applications',//邀请进度 推荐
	invitee_applications:'koala/v1/invitee_applications',//邀请进度 直邀
	// inviteeProcessDetail:'koala/v1/application/',//邀请进度 详情
	walletDetails:'koala/v1/wallet_details',//钱包明细
	distributions:'koala/v1/distributions',//分销账单
	top_schools:'koala/v1/top_schools',//为你推荐
	configuration:'koala/v1/share/jssdk/configuration',//获取地理位置 分享
	purposeSave:'koala/v1/major_categories/purpose',//保存 报读意向
	purposeGet:'koala/v1/major_categories/purposes',//获取 报读意向
	provinceSchool:'koala/v1/schools/province/filter',//分类 地区院校
	collectNum:'koala/v1/schools/favorites/stats',//收藏数
	favoritesList:'koala/v1/schools/favorites',//收藏列表
	favoritesStores:'koala/v1/schools/favorites/stores',//点击批量收藏 
	favoritesDeletes:'koala/v1/schools/favorites/deletes',//批量删除收藏
	hotSearch:'koala/v1/schools_keywords',//热门搜索
	qrread:'koala/v1/qrread',//解析二维码
	contactsType:'koala/v1/contacts',//院校入驻 顾问申请
	bindPhone:'koala/v1/user/phone',//绑定手机号
	login_mp_wx:'koala/v1/socials/weixin_mini_program/authorizations',//微信小程序登录
	login_h5_app:'koala/v1/socials/weixin/authorizations',//微信登录 h5 app
	provinceList:'koala/v1/school_provinces',//分类的省份数据
	cityList:'koala/v1/school_cities',//分类的城市数据
	getCityData:'koala/v1/schools/city/filter',//根据城市查出院校数据
	mpwxInit:'koala/v1/initialization',//小程序审核页
	recommendSchool:'koala/v1/schools/recommend/filter',//分类 优选推荐
	titledFilter:'koala/v1/schools/titled/filter',//211 985 
	taskList:'koala/v1/assignments',//助学计划任务
	getTaskMoney:'koala/v1/assignment',//领取奖励
	getUserPermissions:'koala/v1/user/permissions',//获取用户权限
	koalaInfo:'koala/v1/koalas',//用户信息 koala/v1/user中的 koala:{}部分，当从商城跳到koala时免登录 app1 =》 koala:{} userInfo
	userRelations:'koala/v1/user/relations',//绑定上级 code 
	getMajors:'koala/v1/majors',//报名时 获取对应学校的专业 分页
	cancelApplications:'koala/v1/applications/1/apply_refund',//取消报名
	bonusList:'koala/v1/bonus',//奖金列表
	weappcode:'koala/v1/share/weappcode',//小程序端二维码
	addressInfo:'koala/v1/apply_info',//地址信息列表
	trainApply:'koala/v1/applications/train',//报名培训
	getLevelList:'koala/v1/major_educations',//获取学历层次
}
