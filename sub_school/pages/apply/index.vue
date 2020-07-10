<template>
	<view class="apply">
		<!-- 用户信息 -->
		<!-- 培训端 -->
		<view class="userInfo module" @click="editInfo(1)" v-if="schoolInfo.sInfo.type === 'tutoring'">
			<view class="module-left" v-if="addressInfo.id">
				<view class="content">
					<view class="name">{{addressInfo.contact_name}}<text class="phone">{{addressInfo.contact_phone}}</text></view>
					<view class="address">{{addressInfo.province + addressInfo.city + addressInfo.district + addressInfo.address}}</view>
				</view>
			</view>
			<view class="" v-else>去完善个人报读信息</view>
			<view class="iconfont icon-leftArrow"></view>
		</view>
		<!-- 院校端 继续教育-->
		<view class="userInfo module" @click="editInfo(2)" v-if="schoolInfo.sInfo.type === 'adult'">
			<view class="module-left" v-if="information.phone && information.koala.name && information.koala.education && information.koala.contact_province">
				<view class="avatarImgBox">
					<image class="image" :src="information.koala.avatar" mode=""></image>
				</view>
				<view class="content">
					<view class="name">{{information.koala.name}}<text class="phone">{{information.phone}}</text></view>
					<view class="address" v-if="information.koala.contact_province && information.koala.contact_address">联系地址：{{information.koala.contact_province + information.koala.contact_city + information.koala.contact_district + information.koala.contact_address}}</view>
				</view>
			</view>
			<view class="" v-else>去完善个人报读信息</view>
			<view class="iconfont icon-leftArrow"></view>
		</view>
		<!-- 院校端 学历教育-->
		<view class="userInfo module" @click="editInfo(2)" v-if="schoolInfo.sInfo.type === 'normal'">
			<view class="module-left" v-if="information.phone && information.koala.name && information.koala.graduation && information.koala.education && information.koala.recent && information.koala.contact_province">
				<view class="avatarImgBox">
					<image class="image" :src="information.koala.avatar" mode=""></image>
				</view>
				<view class="content">
					<view class="name">{{information.koala.name}}<text class="phone">{{information.phone}}</text></view>
					<view class="school">毕业学校：{{information.koala.graduation}}</view>
					<view class="address" v-if="information.koala.contact_province && information.koala.contact_address">联系地址：{{information.koala.contact_province + information.koala.contact_city + information.koala.contact_district + information.koala.contact_address}}</view>
				</view>
			</view>
			<view class="" v-else>去完善个人报读信息</view>
			<view class="iconfont icon-leftArrow"></view>
		</view>
		<!-- 学校信息 -->
		<view class="schoolInfo module">
			<school-card :info='schoolInfo.sInfo' v-if="schoolInfo.sInfo.type === 'tutoring'"></school-card>
			<school-card-t :info='schoolInfo.sInfo' v-if="schoolInfo.sInfo.type != 'tutoring'"></school-card-t>
		</view>
		<view class="schoolInfo module">
			<view class="schoolInfo-bottom">
				<view class="item" @click="chooseClick('level')" v-if="schoolInfo.sInfo.type != 'tutoring'">
					<view class="title">报读层次</view>
					<view class="right">
						{{levelObj.education ? levelObj.name : '未填选'}}
						<text class="iconfont icon-leftArrow"></text>
					</view>
				</view>
				<view class="item" @click="chooseClick('major')">
					<view class="title">报读{{schoolInfo.sInfo.type === 'tutoring' ? '课程' : '专业'}}</view>
					<view class="right">
						{{majorObj.id ? majorObj.name + ' ' + majorObj.tuition : '未填选'}}
						<text class="iconfont icon-leftArrow"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="schoolInfo module">
			<view class="schoolInfo-bottom">
				<view class="item" @click="jump_chat">
					<view class="title">联系老师</view>
					<view class="right">
						<text class="iconfont icon-leftArrow"></text>
					</view>
				</view>
				<view class="item" @click="planClick" v-if="schoolInfo.sInfo.type === 'normal'">
					<view class="title">
						<text class="iconfont icon-yiwen icon"></text>
						助学计划
					</view>
					<view class="iconfont icon-leftArrow"></view>
					<!-- <view class="iconfont icon-yiwen icon"></view> -->
				</view>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="bottomBtnFixed">
			<view class="tips" v-if="schoolInfo.sInfo.type === 'tutoring'">报名费将直接交予当前报名机构</view>
			<view class="bottomPart">
				<view class="free" @click="summaryClick" v-if="schoolInfo.sInfo.type === 'normal'">
					<view class="iconfont icon-yiwen"></view>
					<view class="title">预报名费：</view>
					<view class="num">￥{{schoolInfo.sInfo.application_fee}}</view>
				</view>
				<view class="free" v-if="schoolInfo.sInfo.type === 'adult' && majorObj.id">
					<view class="title">报名费：</view>
					<view class="num">￥{{majorObj.tuition}}</view>
				</view>
				<view class="free" v-if="schoolInfo.sInfo.type === 'tutoring' && majorObj.id">
					<view class="title">报名费：</view>
					<view class="num">￥{{majorObj.tuition}}</view>
				</view>
				<view class=""></view>
				<view class="submit" @click="applicationClick">确定报名</view>
			</view>
		</view>
		<!-- 学历层次 -->
		<uni-popup ref='levelPopup' type="bottom">
			<view class="uniPopup">
				<view class="header" @click="levelClick">确定</view>
				<picker-view class="pickerView" :value="levelValue" @change="levelChange" indicator-style='height:50px;'>
					<picker-view-column>
						<view class="major-item" v-for="(item,index) in levelList" :key="index">{{item.name}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
		<!-- 专业 -->
		<uni-popup ref='majorPopup' type="bottom">
			<view class="uniPopup">
				<view class="header" @click="majorClick">确定</view>
				<picker-view class="pickerView" :value="majorValue" @change="majorChange" indicator-style='height:50px;'>
					<picker-view-column class="pickerViewColumn">
						<view class="major-item" v-for="(item,index) in majorList" :key="index">
							<text class="name">{{item.name}}</text>
							<text class="tuition" v-if="item.tuition > 0">{{item.tuition}}</text>
						</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
		<!-- 助学计划 -->
		<uni-popup ref='uniPopupPlan'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">助学计划</view>
				<view class="uniPopup-summary" v-if="schoolInfo.sInfo.type === 'tutoring'">凡是在线上报名且成功入学者，可以享受平台助学计划。（对于同一机构，通过其他渠道报名过，再在本平台报名的，则不能享受平台助学计划）</view>
				<view class="uniPopup-summary" v-if="schoolInfo.sInfo.type != 'tutoring'">凡是在线上报名且成功入学者，在满足条件享受国家助学金的基础上，还可以享受平台助学计划。（对于同一院校，通过其他渠道报名过，再在本平台报名的，不能享受平台助学计划）</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupPlan.close()"></view>
			</view>
		</uni-popup>
		<!-- 预报名费 -->
		<uni-popup ref='uniPopupApply'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">预报名费说明</view>
				<view class="uniPopup-summary">1、支付预报名费后院校会为您保留学位，入学时抵扣相应金额的报名费用。</view>
				<view class="uniPopup-summary">2、如若报读申请未通过校方审核的，当前费用也将全数退还。</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupApply.close()"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniPopup from '@/components/uni-popup/uni-popup'
	import api from '@/common/api.js'
	import schoolCard from '@/components/school-card'
	import schoolCardT from '@/components/school-card/index-t'
	export default{
		components:{
			schoolCard,
			schoolCardT
		},
		data(){
			return {
				addressInfo:{},
				schoolInfo:{},
				information:{},
				levelValue:[0],
				majorValue:[0],
				levelIndex:0,
				levelObj:{},				 
				levelList:[],
				majorIndex:0,
				majorObj:{},
				majorList:[],
				// property:{
				// 	'pubilc':'公办',
				// 	'private':'民办',
				// 	'unite':'联办'
				// },
				// collegeLevel:{
				// 	'secondary':'中专',
				// 	'junior':'大专',
				// 	'undergraduate':'本科'
				// },
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad(options){
			if(options.info){
				const info = JSON.parse(decodeURIComponent(options.info))
				this.schoolInfo = info
			}
		},
		onShow(){
			this.information = this.userInfo
		},
		onUnload(){
			//移除监听
			// uni.$off('information')
		},
		methods:{
			jump_chat(){
				uni.navigateTo({
					url:'/pages/news/chat?schoolId='+this.schoolInfo.sInfo.id
				})
			},
			// 获取学校详情
			// 获取点击进来的院校
			// requestSchooldetail(id){
			// 	const that=this
			//     that.$http({
			//     	api: api.getSchoolList + '/' + parseInt(id),
			//     	method: 'GET',
			//     }).then(res=> {
			//     	that.
			//     })
			// },
			// 获取学历层次
			getLevelList(){
				this.$http({
					api: api.getLevelList + '/' + this.schoolInfo.sInfo.id,
					method: 'GET'
				}).then(res => {
				    this.levelList = res.data
				}).catch(err => {
							
				})
			},
			//获取学校专业
			getMajors(education){
				let params = {
					school_id:this.schoolInfo.sInfo.id
				}
				if(education){
					params.education = education
				}
				this.$http({
					api: api.getAllMajors,
					method: 'GET',
					params:params
				}).then(res => {
				    this.majorList = res.data
				}).catch(err => {
							
				})
			},
			//去编辑个人信息
			editInfo(type){
				if(type === 1){
					uni.navigateTo({
						url:'/sub_user/pages/personalInfo/addressList?back=true'
					})
				}else if(type === 2){
					uni.navigateTo({
						url:`/sub_user/pages/personalInfo/info-edit?back=${true}&type=${this.schoolInfo.sInfo.type}`
					})
				}
			},
			// 选择弹窗
			chooseClick(type){
				if(this.schoolInfo.sInfo.type != 'tutoring'){
					if(type === 'level'){
						this.getLevelList()
						 this.$refs.levelPopup.open()
					}else if(type === 'major'){
						 if(this.levelObj.education){
							 this.$refs.majorPopup.open()
						 }else{
							 uni.showToast({
								icon:'none',
								title:"请先选择报读层次"
							 })
						 }
					}
				}else{
					this.getMajors()
					this.$refs.majorPopup.open()
				}
				
			},
			//层次选择
			levelChange(e){
				this.levelValue = e.detail.value
				this.levelIndex = e.detail.value[0]
				this.majorObj = {}
			},
			levelClick(){
				let item = this.levelList[this.levelIndex]
				let levelObj = {
					education:item.education,
					name:item.name
				}
				this.getMajors(item.education)
				this.levelObj = levelObj
				this.$refs.levelPopup.close()
			},
			//专业选择
			majorChange(e){
				this.majorValue = e.detail.value
				this.majorIndex = e.detail.value[0]
			},
			majorClick(){
				let item = this.majorList[this.majorIndex]
				if(item && item.id){
					let majorObj = {
						id:item.id,
						name:item.name,
						tuition:item.tuition > 0 ? item.tuition : ''
					}
					this.majorObj = majorObj
				}
				this.$refs.majorPopup.close()
			},
			//说明点击
			summaryClick(){
				if(this.schoolInfo.sInfo.type != 'tutoring'){
					this.$refs.uniPopupApply.open()
				}
			},
			//助学计划
			planClick(){
				this.$refs.uniPopupPlan.open()
			},
			//去报名
			applicationClick(){
				let { sInfo,tInfo } = this.schoolInfo
				let information = this.information
				let judgeBool
				if(sInfo.type === 'tutoring'){
					judgeBool = this.addressInfo.id ? true : false
				}else if(sInfo.type === 'adult'){
					judgeBool = information.phone && information.koala.name && information.koala.education && information.koala.contact_province ? true : false
				}else if(sInfo.type === 'normal'){
					judgeBool = information.phone && information.koala.name && information.koala.graduation && information.koala.education && information.koala.recent  && information.koala.contact_province
				}
			
				if(judgeBool){
					if(this.schoolInfo.sInfo.id){
						if(this.majorObj.id){
							if(tInfo && tInfo.corporate_account){
								let info = {
									sInfo:{
										apply_info_id:this.addressInfo.id,
										type:sInfo.type,
										id:sInfo.id,
										avatar:sInfo.avatar,
										name:sInfo.name
									},
									majorObj:{
										id:this.majorObj.id,
										tuition:this.majorObj.tuition
									}
								}
								if(tInfo && tInfo.corporate_account){
									info.tInfo = {
										contact_name:tInfo.contact_name,
										contact_phone:tInfo.contact_phone,
										corporate_account:tInfo.corporate_account
									}
								}
								// #ifdef H5
									uni.redirectTo({
										url:'/sub_school/pages/apply/orderTransferAccount?info=' + encodeURIComponent(JSON.stringify(info))
									})
								// #endif
								
								// #ifndef H5
									uni.navigateTo({
										url:'/sub_school/pages/apply/orderTransferAccount?info=' + encodeURIComponent(JSON.stringify(info))
									})
								// #endif
								
							}else{
								uni.showToast({
									icon:'none',
									title:'院校信息账号未完善，请联系客服'
								})
							}
						}else{
							let type = this.schoolInfo.sInfo.type === 'tutoring' ? '课程' : '专业'
							uni.showToast({
								icon:'none',
								title:'请选择' + type
							})
						}
					}
				}else{
					uni.showToast({
						icon:'none',
						title:'请完善个人报读信息'
					})
				}
				
			}
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.icon{
		position:static !important;
		left:none !important;
		top:none !important;
		transform: none !important;
	}
	.uniPopup{
		height: 500rpx;
		background: #fff;
		.header{
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 20rpx;
			text-align: right;
			font-size: 32rpx;
			color: $theme-color;
		}
		.pickerView{
			height: 400rpx;
		}
		.major-item{
			height: 50px;
			line-height: 50px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30rpx;
			.tuition{
				margin-left: 40rpx;
			}
		}
	}
	.icon-leftArrow{
		color: #040000;
		font-size: 30rpx;
		margin-left: 18rpx;
	}
	.icon-yiwen{
		font-size: 40rpx;
	}
	.apply{
		// padding: 20rpx 20rpx 100rpx;
		.module{
			padding: 20rpx 30rpx 20rpx 40rpx;
			margin:20rpx 20rpx 0;
			border-radius: 10rpx;
			background: #fff;
		}
		// 用户信息
		.userInfo{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28rpx;
			.avatarImgBox{
				.image{
					@include w-h-br(90rpx);
				}
				margin-right: 20rpx;
			}
			.module-left{
				display: flex;
				align-items: center;
			}
			.content{
				.name{
					font-size: 40rpx;
					font-weight: bold;
					.phone{
						margin-left: 20rpx;
						font-size: 28rpx;
						color: #4F4F4F;
						font-weight: normal;
					}
				}
				.school{
					margin: 10rpx 0;
					max-width: 400rpx;
					@include line-clamp-one;
				}
				.address{
					@include line-clamp-more;
					margin-top: 10rpx;
				}
			}
			.icon-you{
				font-weight: bold;
			}
		}
		// 学校信息
		.schoolInfo{
			.schoolInfo-bottom{
				.item{
					display: flex;
					justify-content: space-between;
					padding: 20rpx 0;
					position: relative;
					.icon-yiwen{
						position: absolute;
						left: -40rpx;
						top: 50%;
						transform: translateY(-50%);
						width: 40rpx;
						height: 40rpx;
					}
					.title{
						display: flex;
						align-items: center;
					}
					.right{
						color: #666;
						.icon-you{
							color: #000;
							font-weight: bold;
							margin-left: 10rpx;
						}
					}
				}
			}
		}
		// .bottom-module{
		// 	margin: 0 20rpx;
		// }
		// 提示
		.attention{
			padding: 20rpx 30rpx;
			font-size: 28rpx;
		}
		// 底部按钮
		.bottomBtnFixed{
			position: fixed;
			width: 100%;
			left: 0;
			bottom: 0;
			.tips{
				text-align: center;
			}
			.bottomPart{
				width: 100%;
				background: #fff;
				border-top: 1rpx solid #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 40rpx 30rpx;
				box-sizing: border-box;
				border-top-left-radius: 30rpx;
				border-top-right-radius: 30rpx;
				.free{
					display: flex;
					align-items: center;
					.title{
						margin: 0 10rpx;
						color: #666;
					}
					.num{
						font-weight: bold;
						color: #F1270C;
						font-size: 50rpx;
					}
				}
				.submit{
					color: #fff;
					background: $theme-color;
					font-size: 32rpx;
					padding: 16rpx 18rpx;
					text-align: center;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
