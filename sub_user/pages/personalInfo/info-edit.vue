<template>
	<view class="info-edit">
		<view class="part">
			<view class="item">
				<view class="title">
					<text class="must">*</text>
					用户名
				</view>
				<input type="text" v-model="info.koala.name" maxlength="10" class="input" placeholder="请输入" placeholder-class="inputtips"/>
			</view>
			<!-- <view class="item" @click="sexChoose">
				<view class="title">
					<text class="must">*</text>
					性别
				</view>
				<view class="rightPart">
					<view class="address">{{sex[info.koala.sex]}}</view>
					<view class="iconfont icon-leftArrow"></view>
				</view>
			</view> -->
			<view class="item" @click="bindPhone">
				<view class="title">
					<text class="must">*</text>
					手机号
				</view>
				<input type="text" v-model="info.phone" class="input" placeholder="请输入" disabled/>
				<view class="iconfont icon-leftArrow"></view>
			</view>
			<view class="item" @click="IDAuth">
				<view class="title">
					<text class="must">*</text>
					实名认证
				</view>
				<view class="rightPart">
					<view class="address">{{info.koala.id_no ? '已实名':'去实名认证'}}</view>
					<view class="iconfont icon-leftArrow"></view>
				</view>
			</view>
			<!-- <view class="item lastNoBottom" @click="houseAddress">
				<view class="title">
					<text class="must">*</text>
					户籍地址
				</view>
				<view class="rightPart">
					<view class="address">
						<text v-if='info.koala.id_province'>{{info.koala.id_province}}</text>
						<text v-if='info.koala.id_city'>{{info.koala.id_city}}</text>
						<text v-if='info.koala.id_district'>{{info.koala.id_district}}</text>
						<text v-if='info.koala.id_address'>{{info.koala.id_address}}</text>
						<text v-if="!info.koala.id_province">请选择户籍地址</text>
					</view>
					<view class="iconfont icon-leftArrow"></view>
				</view>
			</view> -->
		</view>
		<view class="tips-user"><text class="must">*</text>报读用户必填</view>
		<view class="part">
			<view class="item" v-if="type != 'adult'">
				<view class="title">
					<!-- <text class="must">*</text> -->
					毕业学校
				</view>
				<input type="text" v-model="info.koala.graduation" maxlength="15" class="input" placeholder="请输入" placeholder-class="inputtips" @blur="inputBlur"/>
			</view>
			<!-- <view class="item" @click="schoolChoose" v-if="type != 'adult'">
				<view class="title">
					<text class="must">*</text>
					毕业学校
				</view>
				<view class="rightPart">
					<view class="address">{{info.koala.graduation ? info.koala.graduation : '请输入'}}</view>
					<view class="iconfont icon-leftArrow"></view>
				</view>
			</view> -->
			<view class="item" @click="educationChoose">
				<view class="title">
					<!-- <text class="must">*</text> -->
					学历层次
				</view>
				<view class="rightPart">
					<view class="address">{{info.koala.education ? education[info.koala.education] : '请选择学历层次'}}</view>
					<view class="iconfont icon-leftArrow"></view>
				</view>
			</view>
			<view class="item" @click="typeClick" v-if="type != 'adult'">
				<view class="title">
					<!-- <text class="must">*</text> -->
					学生类别
				</view>
				<view class="rightPart">
					<view class="address" v-if="info.koala.recent !== null">{{recent[info.koala.recent]}}</view>
					<view class="address" v-if="info.koala.recent == null">请选择类别</view>
					<view class="iconfont icon-leftArrow"></view>
				</view>
			</view>
			<view class="item lastNoBottom" @click="addressClick">
				<view class="title">
					<!-- <text class="must">*</text> -->
					通讯地址
				</view>
				<view class="rightPart">
					<view class="address">
						<text v-if='addressInfo.full_address'>{{addressInfo.full_address}}</text>
						<text v-if="!addressInfo.full_address">请选择通讯地址</text>
					</view>
					<view class="iconfont icon-leftArrow"></view>
				</view>
			</view>
		</view>
		<view class="part" v-if="type != 'adult'">
			<view class="item">
				<view class="title">
					家长电话
				</view>
				<input type="number" maxlength="11" v-model="info.koala.parents_phone" class="input" placeholder="请输入" placeholder-class="inputtips"  @blur="inputBlur"/>
			</view>
		</view>
		<u-action-sheet :list="educationList" @click="educationClick" v-model="educationShow"></u-action-sheet>
		<!-- 占位 -->
		<view style="height:130rpx;"></view>
		<view class="fixedBottom">
			<view class="reset" @click="reset">重置</view>
			<view class="confirm" @click="submit">确定</view>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import { regExp,hideMenuItems } from '@/common/utils.js'
	import { mapState } from 'vuex'
	import api from '@/common/api.js'
	export default{
		components:{
			
		},
		data(){
			return {
				type:'',
				addressInfo:{},
				sex:{
					0:'不限',
					1:'男',
					2:'女'
				},
				education:{
					'middle':'初中',
					'secondary':'高中(中专)',
					'junior':'大专',
				},
				educationShow:false,
				educationList:[
					{
						text:'大专',
						type:'junior'
					},
					{
						text:'高中(中专)',
						type:'secondary'
					},
					{
						text:'初中',
						type:'middle'
					}
				],
				recent:{
					0:'往届',
					1:'应届'
				},
				// residents:{
				// 	'rural':'农村',
				// 	'urban':'城镇'
				// },
				info:{
					koala:{
						name:'',
						parents_phone:''
					}
				},
				PWState:"",
				back:false
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad(options){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			this.PWState= this.$store.state.userInfo.set_password?"已设置密码":"未设置密码"
			let info = JSON.parse(JSON.stringify(this.userInfo))
			if(!info.koala.name){
				info.koala.name = ''
			}
			if(!info.koala.graduation){
				info.koala.graduation = ''
			}
			if(!info.koala.education){
				info.koala.education = ''
			}
			if(!info.koala.parents_phone){
				info.koala.parents_phone = ''
			}
			this.addressInfo.full_address = (info.koala.contact_province || '') + (info.koala.contact_city || '') + (info.koala.contact_district || '') + (info.koala.contact_address || '')
			
			this.listenAddress()
			this.info = info
			
			//填写报考信息页跳转带参数 back = true
			if(options && options.back){
				this.back = true
			}
			if(options && options.type){
				this.type = options.type
			}
		},
		onShow(){
			 
		},
		onUnload(){
			// 移除监听事件  
			uni.$off('address')
			uni.$off('id_no')
			uni.$off('phone')
		},
		methods:{
			//兼容苹果手机上 键盘升起会导致页面上移问题
			inputBlur(){
				uni.pageScrollTo({
					scrollTop:0,
					duration:0
				})
			},
			listenAddress(){
				// 监听通讯地址
				uni.$on('address',data => {
					if(data){
						this.info.koala.contact_province = data.province
						this.info.koala.contact_city = data.city
						this.info.koala.contact_district = data.district
						this.info.koala.contact_address = data.address
					}
				})
				// 实名认证
				uni.$on('id_no',data => {
					if(data){
						this.info.koala.id_no = data.id_no
					}
				})
				// 监听户籍地址
				// uni.$on('houseAddress',data => {
				// 	if(data){
				// 		this.info.koala.id_province = data.province
				// 		this.info.koala.id_city = data.city
				// 		this.info.koala.id_district = data.district
				// 		this.info.koala.id_address = data.address
				// 	}
				// })
				//手机号
				uni.$on('phone',data => {
					if(data){
						this.info.phone = data
					}
				})
			},
			//忘记密码
			jumpForget(){
				uni.navigateTo({
					url:'/pages/login/forget'
				})
			},
			//绑定手机号
			bindPhone(){
				uni.navigateTo({
					url:'/sub_user/pages/personalInfo/bindPhone'
				})
			},
			//性别选择
			sexChoose(){
				uni.showActionSheet({
				    itemList: ['不限', '男', '女'],
				    success: res => {
						this.info.koala.sex = res.tapIndex
				    },
				    fail: err => {}
				});
			},
			//学校选择
			schoolChoose(){
				uni.navigateTo({
					url:'/sub_user/pages/personalInfo/schoolChoose'
				})
			},
			//学历选择
			educationChoose(){
				this.educationShow = true
				// uni.showActionSheet({
				//     itemList: ['初中', '高中'],
				//     success: res => {
				// 		if(res.tapIndex === 0){
				// 			this.info.koala.education = 'middle'
				// 		}else if(res.tapIndex === 1){
				// 			this.info.koala.education = 'high'
				// 		}
				//     },
				//     fail: err => {}
				// });
			},
			//确认学历选择
			educationClick(index){
				this.info.koala.education = this.educationList[index].type
			},
			//学生类别
			typeClick(){
				uni.showActionSheet({
				    itemList: ['应届', '往届'],
				    success: res => {
							let recent = null
						    switch(res.tapIndex){
								case 0:
									recent = 1
								break;
								case 1:
									recent = 0
								break;
							}
							this.info.koala.recent = recent
				    },
				    fail: err => {}
				});
			},
			//通讯地址
			addressClick(){
				uni.navigateTo({
					url:'/sub_user/pages/personalInfo/addressList?back=true'
				})
			},
			//实名认证
			IDAuth(){
				uni.navigateTo({
					url:'/sub_adviser/pages/personalInfo/IDAuth'
				})
			},
			//户籍地址
			// houseAddress(){
			// 	uni.navigateTo({
			// 		url:'/sub_user/pages/personalInfo/houseAddress'
			// 	})
			// },
			//重置
			reset(){
				this.info.koala.name = ''
				// this.info.koala.sex = 0
				this.info.koala.graduation = ''
				this.info.koala.education = ''
				// this.info.koala.residents = ''
				this.info.koala.recent = null
				this.info.koala.parents_phone = ''
			},
			//确定
			submit(){
				this.judgeFun().then(()=>{
						let params = {
							'koala[name]':this.info.koala.name,
							// 'koala[sex]':this.info.koala.sex,
							// 'koala[graduation]':this.info.koala.graduation,
							// 'koala[education]':this.info.koala.education,
							// 'koala[recent]':this.info.koala.recent || '',
							// 'koala[residents]':this.info.koala.residents,
							// 'koala[parents_phone]':this.info.koala.parents_phone,
							_method:'PATCH'
						}
						if(this.addressInfo.province){
							params['koala[contact_province]'] = this.addressInfo.province
						}
						if(this.addressInfo.city){
							params['koala[contact_city]'] = this.addressInfo.city
						}
						if(this.addressInfo.district){
							params['koala[contact_district]'] = this.addressInfo.district
						}
						if(this.addressInfo.address){
							params['koala[contact_address]'] = this.addressInfo.address
						}
						if(this.info.koala.education){
							params['koala[education]'] = this.info.koala.education
						}
						if(this.type != 'adult'){
							if(this.info.koala.graduation){
								params['koala[graduation]'] = this.info.koala.graduation
							}
							if(this.info.koala.recent != null){
								params['koala[recent]'] = this.info.koala.recent
							}
							if(this.info.koala.parents_phone){
								params['koala[parents_phone]'] = this.info.koala.parents_phone
							}
						}
						this.$http({
							api: api.getUserInfo,
							method: 'POST',
							params:params,
							header:{
								'Content-Type':'application/x-www-form-urlencoded'
							}
						}).then(res => {
							this.$store.commit('setUserInfo',res.data)
							uni.showToast({
								title:'编辑成功',
								success:() => {
									setTimeout(()=>{
										if(this.back){
											uni.navigateBack()
										}else{
											uni.switchTab({
												url:'/pages/user/user'
											})
										}
									},1000)
								}
							})
						}).catch(err => {
									
						})
				}).catch(err => {})
			},
			//信息验证
			judgeFun(){
				return new Promise((resolve,reject)=>{
					let tip = ''
					if(!this.info.koala.name){
						tip = '请输入姓名'
						reject()
					}else if(!regExp('mobile',this.info.phone)){
						tip = '请绑定手机号'
						reject()
					}else if(!this.info.koala.id_no){
						tip = '请去实名认证'
						reject()
					}else if(this.info.koala.parents_phone){
						if(!regExp('mobile',this.info.koala.parents_phone)){
							tip = '请填写正确的家长电话'
							reject()
						}else{
							resolve()
						}
					}else{
						resolve()
					}
					
					// else if(!this.info.koala.graduation){
					// 	tip = '请填写学校名称'
					// 	reject()
					// }else if(!this.info.koala.education){
					// 	tip = '请选择学历层次'
					// 	reject()
					// }else if(this.info.koala.recent === null){
					// 	tip = '请选择学生类别'
					// 	reject()
					// }else if(!this.info.koala.contact_province){
					// 	tip = '请填写通讯地址'
					// 	reject()
					// }
					
					if(tip){
						uni.showToast({
							icon:'none',
							title:tip
						})
					}
				})
			},
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.tips-user{
		padding: 0 20rpx;
		margin-top: 30rpx;
		.must{
			color: red;
		}
	}
	.info-edit{
		.icon-leftArrow{
			margin-left: 12rpx;
		}
		.part{
			background: #fff;
			width: 722rpx;
			margin:12rpx auto 0;
			border-radius: 20rpx;
		}
		// .part:last-of-type{
		// 	padding: ;
		// }
		.item{
			display: flex;
			background: #fff;
			align-items: center;
			justify-content: space-between;
			margin: 0 10rpx;
			border-bottom: 1px solid #f1f1f1;
			padding:30rpx;
			.must{
				color: red;
			}
			.title{
				font-size: 30rpx;
				color:#000;
			}
			.input{
				flex: 1;
				text-align: right;
				font-size: 28rpx;
				color:#7d7d7d;
			}
			.inputtips{
				color:#7d7d7d;
			}
			.rightPart{
				display: flex;
				align-items: center;
				.address{
					color:#7d7d7d;
					max-width: 400rpx;
					@include line-clamp-one;
				}
			}
		}
		.fixedBottom{
			position: fixed;
			bottom: 40rpx;
			width: 100%;
			left: 0;
			display: flex;
			justify-content: center;
			// height: 80rpx;
			// line-height: 80rpx;
			// padding: 0 30rpx;
			// box-sizing: border-box;
			// text-align: center;
			view{
				color:#fff;
				width:310rpx;
				height:76rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30rpx;
				border-radius: 20rpx;
			}
			.reset{
				background:#828387;
			}
			.confirm{
				background: #12ada9;
				margin-left:48rpx;
			}
			// .reset{
			// 	background: #999;
			// 	width: 200rpx;
			// 	margin-right: 20rpx;
			// 	border-radius: 10rpx;
			// }
			// .confirm{
			// 	flex: 1;
			// 	background: blue;
			// 	color: #fff;
			// 	border-radius: 10rpx;
			// }
		}
	}
</style>
