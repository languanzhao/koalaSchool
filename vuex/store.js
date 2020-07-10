import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app.js'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
		objToken:{},
		userInfo:{},
		roles:[],
		intentionObj:{
			intentionList:[],
			intentionValue:''
		},
		local_province:'',
		local_city:''
	},
    mutations: {
		//设置token
		saveToken(state,params){
			state.objToken = params
			uni.setStorage({
				key:'objToken',
				data:params
			})
		},
		//设置用户信息
		setUserInfo(state,userInfo){
			state.userInfo = userInfo
			uni.setStorage({
				key: 'userInfo',
				data: userInfo
			})
		},
		//清掉用户相关信息
		clearUserInfo(state){
			state.objToken = {}
			state.userInfo = {}
			state.roles = []
		},
		//用户角色
		setRoles(state,params){
			state.roles = params || []
			uni.setStorage({
				key: 'roles',
				data: params
			})
		},
		//保存报读意向
		setPurpose(state,params){
			state.intentionObj = params
		},
		//保存用户当前省份
		save_local_province(state,params){
			state.local_province = params
		},
		save_local_city(state,params){
			state.local_city = params
		}
	},
    actions: {
		
	},
	modules: {
		app
	}
})

export default store