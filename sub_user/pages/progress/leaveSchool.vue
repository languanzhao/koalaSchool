<template>
	<view class="leaveSchool">
		<school-card :info="schoolInfo" v-if="schoolInfo.type === 'tutoring'"></school-card>
		<school-card-t :info='schoolInfo' v-if="schoolInfo.type != 'tutoring'"></school-card-t>
		<view class="schoolInfo-bottom">
			<view class="item" @click="reasonClick">
				<view class="title">{{schoolInfo.pass_status === 'pending' ? '取消' : '退款'}}原因</view>
				<view class="right">
					{{ tapIndex != null ? reasonList[tapIndex] : '请选择' }}
					<text class="iconfont icon-leftArrow"></text>
				</view>
			</view>
			<view class="item" v-if="schoolInfo.pass_status != 'pending'">
				<view class="title">
					<text>退款金额</text>
					<text class="num">￥{{ schoolInfo.total_amount }}</text>
				</view>
			</view>
		</view>
		<view class="box" v-if="isShow">
			自定义
			<textarea v-model="reason" placeholder="请输入自定义原因" @click.stop />
		</view>
		<view class="bottom">
			<view class="attention" v-if="schoolInfo.type === 'tutoring'">注意：如若当前退款申请日期，已超出开班日期，申请退款的用户，须移步到开班该机构进行办理。</view>
			<view class="attention" v-if="schoolInfo.type != 'tutoring'">注意：如若当前退款申请日期，已超出院校的报名截止日期，申请退学的用户，须移步到该院校招生办进行办理。</view>
			<view class="button">
				<view class="btn1" @click="cancelbtn">点错了</view>
				<view class="btn2" @click="confirmBtn">提交并联系老师</view>
			</view>
		</view>
		<!-- 取消报名 -->
		<uni-popup ref='uniPopupCancel'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">提示</view>
				<view class="uniPopup-summary" style="text-align: center;">确认取消该报名</view>
				<view class="uniPopup-buttons">
					<view class="cancel" @click="$refs.uniPopupCancel.close()">取消</view>
					<view class="confirm" @click="closeApi">确定</view>
				</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupCancel.close()"></view>
			</view>
		</uni-popup>
		<!-- 退款 -->
		<uni-popup ref='uniPopupRefund'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">注意</view>
				<view class="uniPopup-summary">取消报名后，已锁定学位将重新开放报名，若名额招收完毕，将无法再报名！是否确定取消报名？</view>
				<view class="uniPopup-buttons">
					<view class="cancel" @click="$refs.uniPopupRefund.close()">取消</view>
					<view class="confirm" @click="refundApi">确定</view>
				</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupRefund.close()"></view>
			</view>
		</uni-popup>
		<!-- 找客服 -->
		<uni-popup ref='uniPopupKefu'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">复制提示</view>
				<view class="uniPopup-summary" style="text-align: center;">我已取消{{schoolInfo.name}}的{{schoolInfo.majorName}}报名</view>
				<view class="uniPopup-buttons">
					<!-- <view class="cancel" @click="$refs.uniPopupKefu.close()">取消</view> -->
					<view class="confirm" @click="toChat" style="margin: 0 auto;">复制并联系客服</view>
				</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupKefu.close()"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { copyValue } from '@/common/utils.js'
import schoolCard from '@/components/school-card'
import schoolCardT from '@/components/school-card/index-t'
import api from '@/common/api.js';
export default {
	components: {
		schoolCard,
		schoolCardT
	},
	data() {
		return {
			tapIndex:null,
			reasonList:[],
			schoolInfo: {},
			reason: '',
			remark: '',
			property: {
				'pubilc': '公办',
				'private': '民办',
				'unite': '联办',
				'international_public':'国际公立',
				'international_private':'国际私立'
			},
			collegeLevel: {
				'secondary': '中专',
				'junior': '大专',
				'undergraduate': '本科',
				'master':'研究生',
				'early':'早教托管'
			},
			isShow:false,// 自定义textarea显示隐藏
		};
	},
	onLoad(options) {
		if (options.schoolInfo) {
			let info = JSON.parse(decodeURIComponent(options.schoolInfo))
			this.schoolInfo = info;
		}
	},
	methods: {
		// 自定义textarea显示隐藏
		showTextarea(){
			this.isShow = !this.isShow
		},
		
		//退款原因
		reasonClick() {
			let list = []
			if(this.schoolInfo.type === 'tutoring'){
				list = ['报错课程了', '时间上有冲突','自定义']
			}else{
				list = ['报错专业了', '换其他学校','自定义']
			}
			this.reasonList = list
			uni.showActionSheet({
				itemList: this.reasonList,
				success: res => {
					this.reason = ''
					this.tapIndex = res.tapIndex
					if(res.tapIndex === 2){
						this.isShow = true
					}else{
						this.reason = this.reasonList[res.tapIndex];
						this.isShow = false
					}
				}
			});
		},
		
		confirmBtn() {
			if (this.reason) {
				if(this.schoolInfo.pass_status === 'pending'){
					this.$refs.uniPopupCancel.open()
				}else{
					this.$refs.uniPopupRefund.open()
				}
			} else {
				uni.showToast({
					icon: 'none',
					title: '请选择原因'
				});
			}
		},
		cancelbtn() {
			uni.navigateBack();
		},
		//关闭报名
		closeApi(){
				this.$http({
					api: api.userApplications + '/' + this.schoolInfo.id + '/close',
					method: 'POST',
					params:{
						_method:'PATCH',
						reason:this.reason
					}
				}).then(res => {
					this.$refs.uniPopupCancel.close()
					this.$refs.uniPopupKefu.open()
				}).catch(err => {
					this.$refs.uniPopupCancel.close()
					if (err.data.code === 400) {
						uni.showToast({
							icon: 'none',
							title: err.data.message
						});
					}
				})
		},
		//发起退款
		refundApi() {
			let params = {
				reason: this.reason,
				total_amount: this.schoolInfo.total_amount
			}
			this.$http({
				api: api.userApplications + '/' + this.schoolInfo.id + '/apply_refund',
				method: 'POST',
				params: params
			})
				.then(res => {
					this.$refs.uniPopupRefund.close()
					this.$refs.uniPopupKefu.open()
				})
				.catch(err => {
					this.$refs.uniPopupRefund.close()
					if (err.data.code === 400) {
						uni.showToast({
							icon: 'none',
							title: err.data.message
						});
					}
				});
		},
		//找客服
		toChat(){
			let content = '我已取消' + this.schoolInfo.name + '的' + this.schoolInfo.majorName + '报名'
			copyValue(content)
			this.$refs.uniPopupKefu.open()
			uni.redirectTo({
				url:"/pages/news/chat?schoolId=" + this.schoolInfo.schoolId
			})
		}
	}
};
</script>
<style lang="scss">
page {
	background: $page-background;
}
</style>
<style lang="scss" scoped>
.leaveSchool {
	.schoolCard,.schoolInfo-bottom,.box,{
		width: 722rpx;
		background: #fff;
		margin: 16rpx auto 0;
		border-radius: 10rpx;
	}
	.schoolCard {
		.schoolInfo {
			padding: 20rpx;
			display: flex;
			align-items: center;
			image {
				@include w-h-br(84rpx);
			}
			.contain {
				margin-left:10rpx;
				.top-name {
					display: flex;
					align-items: center;
					.name {
						// font-weight: bold;
						font-size: 30rpx;
						color: #323232;
						margin-right: 18rpx;
					}
					.label {
						font-size: 14rpx;
						color: $theme-color;
						border: 1px solid $theme-color;
						padding: 6rpx 12rpx;
						border-radius: 10rpx;
						white-space: nowrap;
					}
				}
				.bottom-info {
					display: flex;
					flex-wrap: wrap;
					margin-top: 20rpx;
					align-items: center;
					view{
						margin-right:20rpx;
					}
					.icon-location-active{
						margin-left:20rpx;
					}
				}
			}
		}
	}
	.schoolInfo-bottom {
		padding:0 14rpx;
		.item {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 20rpx;
			&:first-of-type {
				border-bottom: 1px solid #f5f5f5;
			}
			.title {
				color: #060606;
				font-size:30rpx;
				.num {
					margin-left: 34rpx;
					color: #F1270C;
				}
			}
			.right{
				color:#7d7d7d;
				font-size: 28rpx;
				text{
					margin-left:18rpx;
				}
			}
		}
	}
	
	.box{
		padding:30rpx 36rpx;
		color:#060606;
		font-size: 30rpx;
		textarea{
			padding:6rpx;
			width:100%;
			height:164rpx;
			margin-top:18rpx;
			border-radius:10rpx;
			border:1px solid #bfbfbf;
			font-size: 28rpx;
		}
	}
     
	.bottom{
		position: fixed;
		left:50%;
		transform: translateX(-50%);
		bottom:40rpx;
		width: 722rpx;
		.attention{
			width:668rpx;
			font-size: 22rpx;
			color:#484848;
			margin:0 auto 20rpx;
		}
		.button{
			display: flex;
			align-items:center;
			justify-content: center;
			view{
				width:310rpx;
				height:76rpx;
				border-radius: 10rpx;
				font-size: 30rpx;
				color:#fff;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.btn1{
				background:#828387;
				margin-right: 48rpx;
			}
			.btn2{
				background: $theme-color;
			}
		}
		
	}
}
</style>
