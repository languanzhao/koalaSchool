import Vue from 'vue'
import App from './App'

//引入vuex 把vuex定义成全局组件
import store from './vuex/store'
Vue.prototype.$store = store

//数据请求
import { request } from './common/request.js'
// https://shop.test.gzzhongw.net/   http://shop.test/
// Vue.prototype.$baseUrl = 'https://shop.test.gzzhongw.net/'
Vue.prototype.$http = request

//项目
Vue.prototype.$rootUrl = 'https://koala.gzzhongw.net/'
Vue.prototype.$projectUrl = 'https://koala.gzzhongw.net/h6'
// Vue.prototype.$contactPhone = '13544412322'
//  全局组件之间通信
Vue.prototype.$eventHub= Vue.prototype.$eventHub ||  new Vue()        // 巴士

//兼容H5api方法 setClipboardData getClipboardData saveImageToPhotosAlbum saveVideoToPhotosAlbum
import './common/ican-H5Api.js' 

//uView UI组件库
import uView from "@/uview";
Vue.use(uView); 

//全局过滤器
import * as publicFilters from '@/common/publicFilters'    
Object.keys(publicFilters).forEach(key => {        
  Vue.filter(key, publicFilters[key])
})

//逆地址解析
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)

//全局弹窗
import uniPopup from '@/components/uni-popup/uni-popup'
Vue.component('uni-popup',uniPopup)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
export default app
app.$mount()
