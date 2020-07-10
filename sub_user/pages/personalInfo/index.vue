<template>
	<view class="personalInfo">
		<view class="personalInfo-top">
			<view class="avatarImg" @click="avatarImgChange">
				<image :src="userInfo.koala.avatar || avatarImg" mode=""></image>
			</view>
			<view class="name">{{userInfo.koala.name || '尚未填写' }}</view>
			<!-- <view :class="['isBind',userInfo.bound_wechat ? 'bound' : '']">
				{{userInfo.bound_wechat ? '已绑定微信账户' : ''}}
				<text class="iconfont icon-duigou" v-if="userInfo.bound_wechat"></text>
			</view> -->
			<view class="infoList">
				<view class="item">
					<view class="item-left">真实姓名</view>
					<view class="item-right">
						<!-- <text :class="['iconfont',userInfo.koala.sex == 1 ? 'icon-sexMan' : 'icon-sexWoman']" v-if="userInfo.koala.sex == 1 || userInfo.koala.sex == 2"></text> -->
						<text class="name">{{userInfo.koala.id_name || "尚未填写"}}</text>
						<text v-if="userInfo.koala.id_no" class="hasId">已实名</text>
					</view>
				</view>
				<view class="item">
					<view class="item-left">手机号码</view>
					<view class="item-right">{{userInfo.phone || "尚未填写"}}</view>
				</view>
				<view class="item">
					<view class="item-left">所在地区</view>
					<view class="item-right" v-if="userInfo.koala.contact_province && userInfo.koala.contact_city">{{userInfo.koala.contact_province + ' ' +  userInfo.koala.contact_city}}</view>
					<view class="item-right" v-else>尚未填写</view>
				</view>
				<view class="item">
					<view class="item-left">毕业学校</view>
					<view class="item-right">
						<text v-if="userInfo.koala.graduation">{{userInfo.koala.graduation}}</text>
						<text v-if="userInfo.koala.graduation && userInfo.koala.education">({{education[userInfo.koala.education]}})</text>
						<text v-if="!userInfo.koala.graduation">尚未填写</text>
					</view>
				</view>
			</view>
		</view>
		<view class="fixedBottom">
			<view class="content">
				<view class="notice">
					<view class="notice-title">注意：</view>
					<view>当前资料信息，需提供予校方审核您是否具备录取资质，请如实填写，平台将为您严格保密。</view>
				</view>
				<view class="button" @click="editInfo">编辑个人信息</view>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import { mapState } from 'vuex'
	import api from '@/common/api.js'
	import { uploadImage,hideMenuItems } from '@/common/utils.js'
	export default{
		components:{
			
		},
		data(){
			return {
				info:{},
				avatarImg:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=145692761,4091651670&fm=26&gp=0.jpg',
				education:{
					'middle':'初中',
					'secondary':'高中(中专)',
					'junior':'大专'
				},
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad(){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
		},
		methods:{
			// 更换头像
			avatarImgChange(){
				uploadImage().then((res) => {
					this.$http({
						api: 'koala/v1/user',
						method: 'POST',
						params:{
							'koala[avatar]':res.path,
							'koala[avatar_image_id]':res.id,
							_method:'PATCH'
						},
						header:{
							'Content-Type':'application/x-www-form-urlencoded'
						}
					}).then(info => {
						// this.info.koala.avatar = res.path
						this.$store.commit('setUserInfo',info.data)
					}).catch(err => {
								
					})
				}).catch(err => {})
			},
			//去编辑
			editInfo(){
				uni.navigateTo({
					url:'/sub_user/pages/personalInfo/info-edit'
				})
			},
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.personalInfo{
		.personalInfo-top{
			padding: 100rpx 40rpx 40rpx;
			background: #fff;
			.avatarImg{
				width: 228rpx;
				height: 228rpx;
				margin: 0 auto;
			}
			.name{
				margin: 20rpx 0;
				font-size: 40rpx;
				font-weight: bold;
				text-align: center;
			}
			.isBind{
				margin: 20rpx 0 30rpx;
				text-align: center;
				font-size: 26rpx;
				color: #565656;
				.icon-duigou{
					color: #9ad925;
					font-size: 26rpx;
					margin-left: 10rpx;
				}
			}
			.bound{
				color: $theme-color;
			}
			.infoList{
				.item{
					@include flex-c;
					margin: 20rpx 0;
					position: relative;
					.item-left{
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						color: #565656;
						font-size: 26rpx;
					}
					.item-right{
						flex: 1;
						text-align: center;
						font-weight: bold;
						.hasId{
							padding: 2rpx 10rpx;
							border: 1rpx solid $theme-color;
							font-size:23rpx;
							color:$theme-color;
						}
						.icon-sexMan{
							color: #0179FF;
						}
						.icon-sexWoman{
							color: #ff55ff;
						}
						.name{
							margin: 0 16rpx;
						}
					}
				}
			}
		}
		.fixedBottom{
			position: fixed;
			width: 100%;
			bottom: 30rpx;
			left: 0;
			.content{
				margin: 0 30rpx;
				.notice{
					display: flex;
					font-size: 22rpx;
					color: #565656;
					.notice-title{
						white-space: nowrap;
					}
				}
				.button{
					background: $theme-color;
					color: #fff;
					text-align: center;
					padding: 26rpx 0;
					border-radius: 10rpx;
					margin-top: 20rpx;
					// font-size: 30rpx;
				}
			}
		}
	}
</style>
