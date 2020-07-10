<template>
	<view class="progress u-skeleton">
		<view class="progress-top" v-if="detail.koala">
			<image class="avatarImg u-skeleton-circle" :src="detail.koala.avatar" mode=""></image>
		    <view class="content">
		    	<view class="name u-skeleton-rect">{{detail.koala.name}}<text class="label">{{userInfo.id === detail.koala.parent_id ? '直邀' : '推荐'}}</text></view>
				<view class="recommend u-skeleton-rect" v-if="detail.koala.parent_koala">推荐人：{{detail.koala.parent_koala.name}}</view>
		    </view>
			<view class="money" v-if="detail.my_distribution_bonus">
				<view class="num u-skeleton-rect">{{detail.my_distribution_bonus.status === 'return' ? '-' : '+'}}{{detail.my_distribution_bonus.total_amount}}</view>
				<view class="word u-skeleton-rect">差旅补助</view>
			</view>
		</view>
		
		<view class="progress-header" v-if="detail.school.type === 'tutoring'">
			<view class="avatarImg u-skeleton-circle">
				<image :src="detail.school.avatar"></image>
			</view>
			<view class="schoolName u-skeleton-rect">{{detail.school.name}}</view>
			<view class="schoolInfo">
				<view class="">报名课程：</view>
				<view class="u-skeleton-rect">{{detail.major && detail.major.name ? detail.major.name : ''}}</view>
			</view>
			<view class="" v-if="type == 2 && !detail.closed">
				<view class="iconfont icon-share u-skeleton-rect" @click="showSheet" v-if="detail.pass_status === 'pending' || detail.pass_status ==='success'"></view>
			</view>
		</view>
	    
		<view class="progress-header" v-if="detail.school.type != 'tutoring'">
			<view class="avatarImg u-skeleton-circle">
				<image :src="detail.school.avatar"></image>
			</view>
			<view class="schoolName u-skeleton-rect">{{detail.school.name}}</view>
			<view class="schoolInfo">
				<image src="/static/image/icon/icon_protype.png" class="icon_protype"></image>
				<view class="protype u-skeleton-rect">{{collegeLevel[detail.school.college_level]}}</view>
				<view>{{property[detail.school.property]}}</view>
				<image src="/static/image/icon/icon_area.png" class="icon_area"></image>
				<view class="u-skeleton-rect">{{detail.school.province}} {{detail.school.city}} {{detail.school.district}}</view>
			</view>
			<view class="" v-if="type == 2 && !detail.closed">
				<view class="iconfont icon-share u-skeleton-rect" @click="showSheet" v-if="detail.pass_status === 'pending' || detail.pass_status ==='success'"></view>
			</view>
		</view>
		<!-- 专业 -->
		<view class="major" v-if="detail.school.type != 'tutoring' && detail.major">
			<view class="label u-skeleton-rect">报读专业：</view>
			<view class="content u-skeleton-rect">{{detail.major && detail.major.name ? detail.major.name : ''}}</view>
		</view>
		
		<view class="progress-title u-skeleton-rect">入学进度</view>
		<view class="progress-list" v-if="detail.id">
			<view class="progress-list-item" v-for="(item,index) of progressList" :key='index'>
				<view class="dataTime">
				  <view class="date">{{item.month}}</view>
				  <view class="time">{{item.time}}</view>
				</view>
				<view class="dotAndLine">
					<view class="dot"></view>
					<view class="line"></view>
				</view>
				<view class="record">
					<view class="title" :style="{color:item.pass_status === 'failed' || item.refund_status === 'failed' ? 'red' : ''}">{{item.title}}</view>
					<view class="summary">{{item.summary}}</view>
				</view>
				<view class="operation" v-if="item.operation && type == 2" @click="operType(item.operType)">{{item.operation}}</view>
			</view>
			<view class="mask" v-if="detail.closed">
				<view class="cancel">已取消</view>
			</view>
		</view>
		<view class="progress-summary u-skeleton-rect" v-if="detail.id && type == 2 && detail.school.type === 'normal'">
			<view class="line"></view>
			<view class="point"></view>
			<view class="u-skeleton-rect">凡是在线上报名且成功入学者，在满足条件享受国家助学金的基础上，还可以享受平台助学计划。（对于同一院校，通过其他渠道报名过，再在本平台报名的，不能享受平台助学计划）</view>
			<view class="point"></view>
			<view class="line"></view>
		</view>
		<!-- <uni-popup ref='popup'>
			<view class="popupContent">
				<image :src="voucherImg" mode="" webp></image>
			</view>
		</uni-popup> -->
		<view class="goTop" @click="goHome">
			<view class="iconfont icon-home"></view>
		</view>
		<u-skeleton :loading="skeletonLoading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import { pathToBase64, base64ToPath } from '@/common/base64.js'
	import api from '@/common/api.js'
	import { mapState } from 'vuex'
	import { copyValue,hideMenuItems } from '@/common/utils.js'
	import { timeFormat } from '@/common/publicFilters.js'
	export default{
		components:{
			
		},
		data(){
			return {
				type:null,
				skeletonLoading:true,
				detail:{
					school:{}
				},
				property:{
					'public':'公办',
					'private':'民办',
					'unite':'联办',
					'international_public':'国际公立',
					'international_private':'国际私立'
				},
				collegeLevel:{
					'secondary': '中专',
					'junior': '大专',
					'undergraduate': '本科',
					'master':'研究生',
					'early':'早教托管',
					'adult':'继续教育',
					'tutoring':'兴趣辅导'
				},
				progressList:[],
				// voucherImg:''
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad(options){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			if(options.type){
				let type = JSON.parse(options.type)
				this.type = type
				let id = Number(options.id)
				if(type == 1){
					this.inviteeProcessDetail(id)
				}else if(type == 2){
					this.getDetail(id)
				}
			}
		},
		methods:{
			goHome(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			//邀请进度详情
			inviteeProcessDetail(id){
				this.$http({
					api: api.userApplications + '/' + id + '/my_distribution',
					method: 'GET',
				}).then(res => {
					this.detail = res.data
					this.progressList.push({
						title:'已报名交费',
						summary:'已成功报名交费',
						operation:'查看凭证',
						operType:'voucher',
						month:timeFormat(res.data.created_at,'MM-dd'),
						time:timeFormat(res.data.created_at,'hh:mm'),
					})
					this.translate(res.data)
					this.skeletonLoading = false
				}).catch(err => {
							
				})
			},
			//报名详情
			getDetail(id){
				this.$http({
					api: api.userApplications + '/' + id,
					method: 'GET',
				}).then(res => {
					this.detail = res.data
					this.progressList.unshift({
						title:'已报名交费',
						summary:'已成功报名交费',
						operation:'查看凭证',
						operType:'checkedVoucher',
						month:timeFormat(res.data.created_at,'MM-dd'),
						time:timeFormat(res.data.created_at,'hh:mm'),
					})
					this.translate(res.data)
					this.skeletonLoading = false
				}).catch(err => {
							
				})
			},
			translate(data){
				if(data.pass_status === 'pending'){
					this.progressList.push({
						title:'入学审核',
						summary:'当前正在审核，请耐心等待'
					})
				}else if(data.pass_status === 'failed'){
					//报名失败
					this.progressList.push({
						title:'入学审核',
						summary:'审核不通过'
					})
					this.progressList.push({
						title:'报名失败',
						pass_status:'failed',
						summary:data.pass_data.refused_reason || '重新报名或者挑选其他优质院校',
						refused_type:data.pass_data.refused_type,
						operation:data.pass_data.refused_type == 'voucher' ? '重新上传凭证' : '更多院校',
						operType:data.pass_data.refused_type == 'voucher' ? 'voucher' : 'more',
						month:timeFormat(data.pass_data.audited_at,'MM-dd'),
						time:timeFormat(data.pass_data.audited_at,'hh:mm')
					})
			    //报名成功
				}else if(data.pass_status === 'success'){
					this.progressList.push({
						title:'入学审核',
						summary:'审核通过'
					})
					
					//快递状态
						if(data.ship_status === 'pending'){
							this.progressList.push({
								title:'报名成功',
								summary:data.school.type === 'tutoring' ? '' : '录取通知书（待处理）',
								operType:'copy',
								month:timeFormat(data.pass_data.audited_at,'MM-dd'),
								time:timeFormat(data.pass_data.audited_at,'hh:mm')
							})
						}else if(data.ship_status === 'delivered'){
							this.progressList.push({
								title:'报名成功',
								operation:data.school.type === 'tutoring' ? '' : '复制单号',
								summary:data.school.type === 'tutoring' ? '' : '录取通知书（邮寄中）',
								operType:'copy',
								month:timeFormat(data.pass_data.audited_at,'MM-dd'),
								time:timeFormat(data.pass_data.audited_at,'hh:mm')
							})
						}
					
					//退款状态
					if(data.refund_status === 'applied'){
						this.progressList.push({
							title:'已发起退款申请',
							month:timeFormat(data.refund_data.refund_created_at,'MM-dd'),
							time:timeFormat(data.refund_data.refund_created_at,'hh:mm')
						})
					}else if(data.refund_status === 'success'){
						this.progressList.push({
							title:'已发起退款申请',
							month:timeFormat(data.refund_data.refund_created_at,'MM-dd'),
							time:timeFormat(data.refund_data.refund_created_at,'hh:mm')
						})
						this.progressList.push({
							title:'退款成功',
							month:timeFormat(data.refund_data.refund_audited_at,'MM-dd'),
							time:timeFormat(data.refund_data.refund_audited_at,'hh:mm')
						})
					}else if(data.refund_status === 'failed'){
						this.progressList.push({
							title:'已发起退款申请',
							month:timeFormat(data.refund_data.refund_created_at,'MM-dd'),
							time:timeFormat(data.refund_data.refund_created_at,'hh:mm')
						})
						this.progressList.push({
							title:'退款失败',
							refund_status:'failed',
							summary:data.refund_data.refund_disagree_reason || '',
							month:timeFormat(data.refund_data.refund_audited_at,'MM-dd'),
							time:timeFormat(data.refund_data.refund_audited_at,'hh:mm')
						})
					}
				//全部完成
				}else if(data.pass_status === 'finish'){
					this.progressList.push({
						title:'入学审核',
						summary:'审核通过'
					})
						this.progressList.push({
							title:'报名成功',
							operation:data.school.type === 'tutoring' ? '' : '复制单号',
							summary:data.school.type === 'tutoring' ? '' : '录取通知书（已接收）',
							operType:'copy',
							month:timeFormat(data.pass_data.audited_at,'MM-dd'),
							time:timeFormat(data.pass_data.audited_at,'hh:mm')
						})
					this.progressList.push({
						title:'入学报到',
						summary:'请注意领取您的助学计划'
					})
				}
			},
			//流程的一些操作
			operType(type){
				//复制单号
				if(type === 'copy'){
					copyValue(this.detail.ship_data.express_no)
				//查看凭证
				}else if(type === 'checkedVoucher'){
					uni.showLoading({
						title:'转换格式中...'
					})
					this.$http({
						api: api.userApplications + '/' + this.detail.id,
						method: 'GET',
						params:{
							show_certificate:1
						}
					}).then(res => {
						// this.$refs.popup.open()
						base64ToPath(res.data.certificate_data)
						  .then(path => {
							  uni.previewImage({
								  current:path,
								  urls:[path]
							  })
							// this.voucherImg = path
							uni.hideLoading()
						  })
						  .catch(error => {
						    console.error(error)
						  })
					})
				//更多院校跳转
				}else if(type === 'more'){
					uni.switchTab({
						url:'/pages/index/index'
					})
				}else if(type === 'voucher'){
					this.voucherUpdate()
				}
			},
			//重新上传凭证带参数过去
			voucherUpdate(){
				let detail = this.detail
				let info = {
					applyId:this.detail.id,
					sInfo:{
						id:detail.school.id,
						avatar:detail.school.avatar,
						name:detail.school.name,
						type:detail.school.type,
					},
					majorObj:{
						id:detail.major.id,
						tuition:detail.major.tuition
					}
				}
				if(detail.school.contact_information && detail.school.contact_information.corporate_account){
					info.tInfo = {
						contact_name:detail.school.contact_information.contact_name,
						contact_phone:detail.school.contact_information.contact_phone,
						corporate_account:detail.school.contact_information.corporate_account
					}
				}
				uni.redirectTo({
					url:'/sub_school/pages/apply/transferAccounts?updateBool=true&&info=' + encodeURIComponent(JSON.stringify(info))
				})
			},
			//右上角点击弹窗
			showSheet(){
				let itemList = []
				// #ifndef H5
					// itemList.push('分享')
				// #endif
				let status = this.detail.pass_status
				if(this.type == 2){
					itemList.push('取消报名')
				}
				uni.showActionSheet({
					itemList:itemList,
					success:res => {
						let tapName = itemList[res.tapIndex]
						if(tapName === '分享'){
							
						}else if(tapName === '取消报名'){
							this.cancelApplication()
						}
					}
				})
			},
			//取消报名
			cancelApplication(){
				let { id,total_amount,school,major } = this.detail
				let schoolInfo = {
					pass_status:this.detail.pass_status,
					id:id,
					majorName:major.name,
					schoolId:school.id,
					avatar:school.avatar,
					name:school.name,
					type:school.type,
					college_level:school.college_level,
					tags:school.tags,
					property:school.property,
					province:school.province,
					city:school.city,
					district:school.district,
					total_amount:total_amount
				}
				uni.navigateTo({
					url:'/sub_user/pages/progress/leaveSchool?schoolInfo=' + encodeURIComponent(JSON.stringify(schoolInfo))
				})
			}
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.progress{
		.progress-top{
			display: flex;
			align-items: center;
			padding:0 20rpx;
			margin:20rpx 20rpx 0;
			border-radius: 10rpx;
			background: #fff;
			.avatarImg{
				@include w-h-br(120rpx);
				margin-right: 20rpx;
			}
			.content{
				.name{
					font-weight: bold;
					.label{
						border: 1rpx solid $theme-color;
						color: $theme-color;
						padding: 0 8rpx;
						font-size: 22rpx;
						margin-left: 10rpx;
						border-radius: 10rpx;
					}
				}
				.recommend{
					color: #999;
					margin-top: 6rpx;
				}
			}
			.money{
				margin-left: auto;
				border-left: 2rpx solid #f4f4f4;
				padding: 0 20rpx;
				text-align: center;
				.num{
					font-weight: bold;
				}
				.word{
					color: #999;
				}
			}
		}
		.progress-header{
			width:710rpx;
			position: relative;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			background: #fff;
			padding:30rpx 30rpx 46rpx;
			margin:20rpx auto 0;
			text-align: center;
			.avatarImg{
				@include w-h-br(154rpx);
				margin: 0 auto;
			}
			.schoolName{
				margin:30rpx 0;
				color:#323232;
				font-size:30rpx;
				font-weight: bold;
			}
			.schoolInfo{
				display: flex;
				align-items: center;
				justify-content: center;
				margin:20rpx 0 0;
				font-size:24rpx;
				.icon_protype{
					width:28rpx;height:24rpx;
				}
				.protype{
					margin-left:8rpx;margin-right:20rpx;
				}
				.icon_area{
					width:17rpx;height:25rpx;margin-left:36rpx;margin-right:12rpx;
				}
				.city{
					margin-left:20rpx;
					margin-right:20rpx;
				}
			}
			
			.icon-share{
				position: absolute;
				right: 0;
				top: 0;
				padding: 20rpx;
				color: #666;
				font-size: 40rpx;
			}
		}
		.major{
			width:710rpx;
			margin:0 auto;
			padding:10rpx 40rpx 30rpx;
			color:#fff;
			background:$theme-color;
			border-bottom-left-radius: 20rpx;
			border-bottom-right-radius: 20rpx;
			.title{
				font-size: 20rpx;
			}
			.content{
				margin-top:20rpx;
				font-size: 35rpx;
			}
		}
		.progress-title{
			margin:18rpx 0 14rpx; 
			margin-left:44rpx;
			color:#1a1a1a;
			font-size:30rpx;
		}
		.progress-summary{
		 //    position: fixed;
			// bottom:50rpx;
			padding: 20rpx;
			font-size: 22rpx;
			color:#484848;
			display: flex;
			align-items: center;
			text-align: center;
			.line{
				width:90rpx;
				height:4rpx;
				background:#828282;
			}
			.point{
				width:12rpx;
				height:12rpx;
				border-radius:50%;
				background:#828282;
			}
		}
		.progress-list{
			width:710rpx;
			padding:80rpx 20rpx 30rpx;
			border-radius: 20rpx;
			background: #fff;
			margin:0 auto;
			position: relative;
			overflow: hidden;
			.mask{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0,0,0,.4);
				color: #666;
				display: flex;
				align-items: center;
				justify-content: center;
				.cancel{
					font-size: 60rpx;
				}
			}
			.progress-list-item{
				display: flex;
				align-items: center;
				font-size: 28rpx;
				&:last-child{
					.dotAndLine{
						.dot,.line{
							background: #e8e8e8;
						}
						
					}
				}
				.date,.time{
					text-align: right;
				}
				.dataTime{
					width: 80rpx;
					margin-top: -60rpx;
					.date{
						color:#484848;
						font-size: 24rpx;
					}
					.time{
						color:#9c9c9c;
						font-size: 20rpx;
					}
				}
				.dotAndLine{
					margin: 0 14rpx;
					.dot{
						@include w-h-br(18rpx);
						background: $theme-color;
						// border: 2rpx solid #ccc;
						// padding: 2rpx;
					}
					.line{
						width: 2rpx;
						height: 84rpx;
						background: $theme-color;
						margin: 0 auto;
					}
					.icon{
						width:48rpx;
						height:48rpx;
						border-radius:50%;
						background: $theme-color;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
				.record{
					color:#060606;
					margin-top: -60rpx;
					.title{
						font-size: 26rpx;
					}
					.summary{
						font-size:20rpx;
						color:rgba(6,6,6,0.5);
					}
				}
				.operation{
					margin-left: auto;
					margin-top: -60rpx;
					font-size: 20rpx;
					color:$theme-color;
					border-radius:20rpx;
					padding:10rpx 14rpx;
					box-shadow:0 0 2rpx $theme-color;
				}
			}
		}
		.popupContent{
			background: #fff;
			width: 400rpx;
			height: 300rpx;
			.image{
			}
		}
	}
	
	.goTop {
		position: fixed;
		bottom: 160rpx;
		right: 20rpx;
		background: $theme-color;
		color: #fff;
		width: 90rpx;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50%;
		text-align: center;
	
		.iconfont {
			font-size: 50rpx;
		}
	}
</style>
