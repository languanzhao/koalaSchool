<template>
	<view>
		<view class="fixed_top_info">
			<view class="operate">
				<view class="item" @click="makePhoneCall">
					<view class="iconfont icon-call"></view>
					<view class="tips">拨打电话</view>
				</view>
				<view class="item" v-if="schoolId && schoolDetail.contact_information" @click="applyClick">
					<view class="iconfont icon-signUp"></view>
					<view class="tips">立即报名</view>
				</view>
				<view class="item" v-if="schoolId" @click="shareClick">
					<view class="iconfont icon-share"></view>
					<view class="tips">分享院校</view>
				</view>
				<view class="item" @click="joinUs(1)" v-if="!schoolId">
					<view class="iconfont icon-signUp"></view>
					<view class="tips">院校入驻</view>
				</view>
				<view class="item" @click="joinUs(2)" v-if="!schoolId && !roles[0]">
					<view class="iconfont icon-signUp"></view>
					<view class="tips">院校推广</view>
				</view>
			</view>
			<view class="card-box" v-if="schoolId">
				<school-card :info="schoolDetail" v-if="schoolDetail.type === 'tutoring'"></school-card>
				<school-card-t :info='schoolDetail' v-if="schoolDetail.type != 'tutoring'"></school-card-t>
			</view>
		</view>
		
		<!-- #ifdef MP-WEIXIN || APP-PLUS-->
			<view class="contactBtn" @click="goChat">连接在线客服</view>
			<!-- <button open-type="contact" :session-from="kefupara">联系客服</button> -->
		<!-- #endif -->
			<!-- #ifdef H5 -->
				<web-view :src="url" :class="[schoolDetail.id ? 'twoModule' : 'oneModule']"></web-view>
			<!-- #endif -->
		
		<uni-popup ref='uniPopupCoo'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">提示</view>
				<view class="uniPopup-summary" style="text-align: center;">申请{{type == 1 ? '商务合作' : '顾问'}}，须请先完善您 个人信息</view>
				<view class="uniPopup-buttons">
					<view class="cancel"  @click="$refs.uniPopupCoo.close()">取消</view>
					<view class="confirm" @click="editInfo">确定</view>
				</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupCoo.close()"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import api from '@/common/api.js'
	import { schoolInfoToLink,schoolDetailShare,hideMenuItems } from '@/common/utils.js'
	import schoolCard from '@/components/school-card'
	import schoolCardT from '@/components/school-card/index-t'
	import { numberDate } from '@/common/publicFilters.js'
	import { mapState } from 'vuex'
	export default{
		components:{
			schoolCard,
			schoolCardT
		},
		props:{
			
		},
		data() {
			return {
				contactPhone:'',
				applyedBool:false,
				type:'',
				schoolId:'',
				schoolDetail:{},
				applyInfo:{},
				url: '',
				kefupara:{}
			}
		},
		computed:{
			...mapState(['userInfo','roles'])
		},
		onReady() {
			
		},
		onLoad(options) {
			this.contactPhone = this.$contactPhone
			if(options.schoolId){
				this.schoolId = options.schoolId
				this.getSchooldetail(options.schoolId)
			}
			
			this.getLatestApplications().then(() => {
				// #ifdef H5
					this.openService()
				// #endif
			})
			
			// #ifdef H5
				hideMenuItems(jweixin)
			// #endif
			
			// let kefupara = {}//这里通过微信小程序提供的方法自行获取用户信息
			// //可以继续传递自定义信息
			// kefupara.tel = '18723456789';
			// kefupara.email = 'test@qq.com';
			// kefupara['真实姓名'] = '请哈U盾撒锋矢风声';
			// kefupara['报读院校'] = '苹果笔记本';
			// //最后转换为 json 字符串
			// kefupara = JSON.stringify(kefupara);
			// kefupara = encodeURIComponent(kefupara);
			// this.kefupara = kefupara
			// console.log(kefupara,'abc')
		},
		methods: {
			//分享院校
			shareClick(){
				schoolDetailShare(this.schoolDetail)
			},
			//拨打电话
			makePhoneCall(){
				uni.makePhoneCall({
				    phoneNumber: this.contactPhone
				});
			},
			//打开客服聊天界面
			openService() {
				let customer = {
					head: this.$store.state.userInfo.koala.avatar,
					'名称':this.$store.state.userInfo.koala.name || ' ',
					'真实姓名': this.$store.state.userInfo.koala.id_name || '',
					'手机': this.$store.state.userInfo.phone,
					'报读院校': this.applyInfo.schoolName,
					'报读专业': this.applyInfo.majorName,
					'当前学历': this.$store.state.userInfo.koala.education === 'middle' ? '初中' : '高中',
					'户籍地址':
						this.$store.state.userInfo.koala.id_province +
						this.$store.state.userInfo.koala.id_city +
						this.$store.state.userInfo.koala.id_district,
					'申请时间': this.applyInfo.time,
				};
				//将 json 格式转为字符串
				customer = JSON.stringify(customer);
				//用 encodeURIComponent 进行编码
				customer = encodeURIComponent(customer);
				//生成最终的对话链接
				let url = this.$projectUrl + '/chat.html?history=true&&customer=' + customer
				this.url = url;
			},
			// 获取报读信息
			getLatestApplications(){
				return new Promise((resolve,reject) => {
					this.$http({
						api: api.latestApplications,
						method: 'GET',
					}).then(res => {
						let applyInfo = {}
						if (res.data) {
							applyInfo = {
								majorName:res.data.major && res.data.major.name ? res.data.major.name : '',
								schoolName:res.data.school && res.data.school.name ? res.data.school.name : '',
								time:res.data.created_at || ''
							}
							if (res.data.closed === false) {
								this.applyedBool = true
							}
						}
						this.applyInfo = applyInfo
						resolve()
					})
				})
			},
			// 获取点击进来的院校
			getSchooldetail(id){
				const that=this
			    that.$http({
			    	api: api.getSchoolList + '/' + parseInt(id),
			    	method: 'GET',
			    }).then(res=> {
					that.schoolDetail = res.data
					let info = uni.getStorageSync('schoolChat')
					let schoolChatList = []
					if(info){
						schoolChatList = JSON.parse(info)
					}
					schoolChatList.unshift({
						id:res.data.id,
						avatar:res.data.avatar,
						name:res.data.name,
						time:numberDate(new Date().getTime())
					})
					schoolChatList = schoolChatList.reduce((all,next)=>all.some((item)=>item['id']==next['id'])?all:[...all,next],[])
					if(schoolChatList.length > 10){
						schoolChatList.substr(0,10)
					}
					uni.setStorage({
						key:'schoolChat',
						data:JSON.stringify(schoolChatList)
					})
			    })
			},
			//院校入驻 院校推广
			joinUs(type){
				this.type = type
				if(this.userInfo.phone && this.userInfo.koala.id_no){
					uni.navigateTo({
						url:'/sub_tim/pages/joinUs/index?type=' + type
					})
				}else{
					this.$refs.uniPopupCoo.open()
				}
			},
			//去编辑个人信息
			editInfo(){
				this.$refs.uniPopupCoo.close()
				uni.navigateTo({
					url:`/sub_user/pages/personalInfo/info-edit?back=${true}`
				})
			},
			//立即报名
			applyClick(){
				if(this.schoolDetail.type === 'tutoring'){
					schoolInfoToLink(this.schoolDetail)
				}else{
					if(this.applyedBool){
						uni.showToast({
							icon:'none',
							title:'您已报过名'
						})
					}else{
						schoolInfoToLink(this.schoolDetail)
					}
				}
			},
			//跳转到客服聊天
			goChat(){
				uni.navigateTo({
					url:'/pages/news/webView'
				})
			}
		},
	}
</script>
<style>
	page{
		background: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.fixed_top_info{
		/* #ifdef MP-WEIXIN || APP-PLUS*/
			// margin-top: 120rpx;
		/* #endif */
	}
	.oneModule{
		margin-top: 160rpx;
	}
	.twoModule{
		margin-top: 300rpx;
	}
		.operate{
			display: flex;
			align-items: center;
			padding:36rpx 24rpx;
			height: 140rpx;
			margin:10rpx 20rpx 0;
			border-radius: 20rpx;
			background: #fff;
			.item{
				flex:1;
				text-align: center;
				.image{
					font-size: 42rpx;
					margin:0 auto;
				}
				.tips{
					color:#5C5C5C;
					font-size: 24rpx;
					margin-top: 8rpx;
				}
			}
		}
	
		.card-box{
			margin: 10rpx 20rpx;
			border-radius: 20rpx;
			overflow: hidden;
		}
	    
		.contactBtn{
			width:600rpx;background:#12ada9;color:#fff;margin:200rpx auto 0;height:90rpx;
			display: flex;align-items: center;justify-content: center;font-size: 30rpx;
			border-radius: 20rpx;
		}
</style>
