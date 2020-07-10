<template>
	<view class="personalInfo">
		<u-cell-group :border='false'>
			<u-cell-item title="头像" :arrow="false" @click="avatarImgChange">
				<image class="avatarImg" :src="info.koala.avatar" slot="right" mode=""></image>
			</u-cell-item>
			<u-cell-item title="用户昵称" :arrow="false" style="border-bottom: 20rpx solid #f5f5f5;">
				<input class='input' type="text" v-model="info.koala.name" slot='right' placeholder="请输入昵称" maxlength="10"/>
			</u-cell-item>
			<u-cell-item title="手机号" :arrow="false" :value="info.phone"></u-cell-item>
			<u-cell-item title="注册时间" :arrow="false" :value="info.created_at"></u-cell-item>
			<u-cell-item title="邀请人" :arrow="false" :value="info.koala.parent_koala && info.koala.parent_koala.name ? info.koala.parent_koala.name : ''"></u-cell-item>
			<u-cell-item title="实名认证" :value="info.koala.id_no ? '已实名' : '去实名认证'" @click="IDAuth"></u-cell-item>
		</u-cell-group>
		
		<!-- <u-cell-item title="修改密码" :value="info.set_password ? '已设置密码' : '未设置密码'" @click="jumpForget" class="box"></u-cell-item> -->
		
		<view class="btn"  @click="confirm">保存</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { uploadImage } from '@/common/utils.js'
	export default{
		components:{
			
		},
		data(){
			return {
				info:{},
				avatar_image_id:null
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad(){
			this.info = JSON.parse(JSON.stringify(this.userInfo))
		},
		methods:{
			// 更换头像
			avatarImgChange(){
				uploadImage().then((res) => {
					if(res.id){
						this.$http({
							api: 'koala/v1/user',
							method: 'POST',
							params:{
								avatar:res.path,
								'koala[avatar_image_id]':res.id,
								_method:'PATCH'
							},
							header:{
								'Content-Type':'application/x-www-form-urlencoded'
							}
						}).then(res => {
							this.info.koala.avatar = res.data.koala.avatar
							this.$store.commit('setUserInfo',res.data)
						}).catch(err => {
									
						})
					}else{
						uni.showToast({
							icon:'none',
							title:'上传失败，请重新上传'
						})
					}
				})
			},
			//保存
			confirm(){
					if(this.info.koala.name){
						this.$http({
							api: 'koala/v1/user',
							method: 'POST',
							params:{
								'koala[name]':this.info.koala.name,
								_method:'PATCH'
							},
							header:{
								'Content-Type':'application/x-www-form-urlencoded'
							}
						}).then(res => {
							this.$store.commit('setUserInfo',res.data)
							uni.showToast({
								title:'保存成功',
								success:() => {
									setTimeout(() => {
										uni.navigateBack()
									},1000)
								}
							})
						}).catch(err => {
									
						})
						
					}else{
						uni.showToast({
							icon:'none',
							title:'请输入昵称'
						})
					}
			},
			IDAuth(){
				uni.navigateTo({
					url:'/sub_adviser/pages/personalInfo/IDAuth'
				})
			},
			jumpForget(){
				uni.navigateTo({
					url:'/pages/login/forget'
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
		padding-top:16rpx;
		.u-cell-box,.loginOut{
			width:722rpx;
			margin:0 auto;
			font-size: 30rpx !important;
			color:#000 !important;
			.input{
				font-size: 28rpx !important;
				color:#7d7d7d !important;
			}
		}
		.box{
			width:722rpx;
			margin:16rpx auto;
		}
		.avatarImg{
			@include w-h-br(114rpx);
			border-radius: 50%;
		}
		.input{
			text-align: right;
		}
		.btn{
			width:582rpx;
			height:80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color:#fff;
			font-size: 30rpx;
			background:#12ada9;
			border-radius: 20rpx;
			position: fixed;
			bottom: 36rpx;
			left:50%;
			transform: translateX(-50%);
		}
	}
</style>
