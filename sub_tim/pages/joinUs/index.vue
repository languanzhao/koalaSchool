<template>
	<view class="joinUs">
		<view class="joinUs-header">
			<image class="image" :src="logo"></image>
			<view>考拉上学/{{type === 1?"院校入驻":"申请顾问"}}</view>
		</view>
		<view class="part"> 
			<view class="" v-if="type === 1">
				<view class="item">
					<view>院校名称</view>
					<input type="text" v-model="schoolName" class="input" placeholder="请输入院校名称" @blur="inputBlur"/>
				</view>
				<view class="item">
					<view>您的姓名</view>
					<input type="text" v-model="name" class="input" placeholder="请输入您的姓名" @blur="inputBlur"/>
				</view>
				<view class="item">
					<view>工作岗位</view>
					<input type="text" v-model="job" class="input" placeholder="请输入您所在院校的工作岗位" @blur="inputBlur"/>
				</view>
				<view class="item">
					<view>联系电话</view>
					<input type="text" v-model="contact_phone" placeholder="请输入您的联系电话" @blur="inputBlur"/>
				</view>
			</view>
			
			<view class="" v-if="type === 2">
				<view class="item">
					<view>您的姓名</view>
					<input type="text" v-model="name" class="input" placeholder="请输入您的姓名" @blur="inputBlur"/>
				</view>
				<view class="item">
					<view>联系电话</view>
					<input type="text" v-model="contact_phone" placeholder="请输入您的联系电话" @blur="inputBlur"/>
				</view>
				<view class="item">
					<view>推荐人电话</view>
					<input type="text" v-model="recommentdPhone" placeholder="请输入您的推荐人电话" @blur="inputBlur"/>
				</view>
				<view class="item">
					<view>邀请码</view>
					<input type="text" v-model="inviteCode" placeholder="请输入您的推荐人邀请码" @blur="inputBlur"/>
				</view>
			</view>
			<view class="joinUs-summary">
				<view>合作意向</view>
				<textarea class="textarea" v-model="textarea" placeholder="请描述您的合作意向..." @blur="inputBlur"/>
			</view>
			<view class="summitBtn" @click="summitBtn">提交</view>
			<view class="title">
				<view class="line"></view>
				<view class="tips">联系我们</view>
				<view class="line"></view>
			</view>
			<view class="phone">联系电话：{{contactPhone}}</view>
		</view>
		<!-- 联系客服 -->
		<uni-popup ref='uniPopupKefu'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">提示</view>
				<view class="uniPopup-summary" style="text-align: center;">联系客服我已提交申请</view>
				<view class="uniPopup-buttons">
					<view class="cancel" @click="$refs.uniPopupKefu.close()">取消</view>
					<view class="confirm" @click="contactKefu">确定</view>
				</view>
				<view class="iconfont icon-quxiao" @click="$refs.uniPopupKefu.close()"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import api from '@/common/api.js'
	import { regExp } from '@/common/utils.js'
	export default{
		components:{
			
		},
		props:{
			
		},
		data(){
			return {
				contactPhone:"",
				path:'',
				logo:this.$rootUrl + 'koala_images/logo.png',
				type:null,
				schoolName:'',
				name:'',
				job:'',
				contact_phone:'',
				recommentdPhone:'',
				inviteCode:'',
				textarea:''
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad(options){
			this.contactPhone = this.$contactPhone
			if(options.type){
				this.type = Number(options.type)
			}
			if(options.path){
				this.path = options.path
				console.log(this.path,'path')
			}
			uni.setNavigationBarTitle({
				title:this.type === 1 ? "院校入驻":"院校推广"
			})
		},
		onShow() {
			
		},
		methods:{
			//兼容苹果手机上 键盘升起会导致页面上移问题
			inputBlur(){
				uni.pageScrollTo({
					scrollTop:0,
					duration:0
				})
			},
			summitBtn() {
				this.judgeFun().then(() => {
					let params = {}
					if(this.type === 1){
						params = {
							type:'school_entry',
							'content[school_name]':this.schoolName,
							'content[contact_name]':this.name,
							'content[work_place]':this.job,
							'content[contact_phone]':this.contact_phone
						}
					}else if(this.type === 2){
						params = {
							type:'counselor_application',
							'content[contact_name]':this.name,
							'content[contact_phone]':this.contact_phone
						}  
						if(this.recommentdPhone){
							params['content[referrer_phone'] = this.recommentdPhone
						}
						if(this.inviteCode){
							params['content[code]'] = this.inviteCode
						}
					}
					if(this.textarea){
						params['content[purpose]'] = this.textarea
					}
					this.$http({
						api: api.contactsType,
						method: 'POST',
						params:params,
						header:{
							'Content-Type':'application/x-www-form-urlencoded'
						}
					}).then(res => {
						this.$refs.uniPopupKefu.open()
					}).catch(err => {
								
					})
				}).catch(err => {})
			},
			judgeFun(){
				return new Promise((resolve,reject)=>{
					let tip = ''
					if(this.type === 1){
						if(!this.schoolName){
							tip = '请填写院校名称'
							reject()
						}else if(!this.name){
							tip = '请填写姓名'
							reject()
						}else if(!this.job){
							tip = '请填写工作岗位'
							reject()
						}else if(!regExp('mobile',this.contact_phone)){
							tip = '请填写正确的联系电话'
							reject()
						}else{
							resolve()
						}
					}else if(this.type === 2){
						if(!this.name){
							tip = '请填写姓名'
							reject()
						}else if(!regExp('mobile',this.contact_phone)){
							tip = '请填写正确的联系电话'
							reject()
						}else if(!regExp('mobile',this.recommentdPhone) && !this.inviteCode){
							tip = '请填写正确的推荐人电话或者邀请码'
							reject()
						}else{
							resolve()
						}
					}
					if(tip){
						uni.showToast({
							icon:'none',
							title:tip
						})
					}
				})
			},
			//联系客服
			contactKefu(){
				if(this.path){
					uni.redirectTo({
						url:'/pages/news/chat'
					})
				}else{
					uni.navigateBack()
				}
				// let type_1 = {
				// 	'院校名称':this.schoolName,
				// 	'工作岗位':this.job,
				// 	'合作意向':this.textarea
				// };
				// let type_2 = {
				// 	'推荐人电话':this.recommentdPhone,
				// 	'邀请码':this.inviteCode,
				// 	'合作意向':this.textarea
				// }
				// let customer = Object.assign({
				// 	head: this.userInfo.koala.avatar,
				// 	'名称': this.userInfo.koala.id_name,
				// 	'申请类型':this.type === 1 ? "院校入驻":"院校推广",
				// 	'您的姓名':this.name,
				// 	'联系电话':this.contact_phone
				// },type_1,type_2)
				// //将 json 格式转为字符串
				// customer = JSON.stringify(customer);
				// //用 encodeURIComponent 进行编码
				// customer = encodeURIComponent(customer);
				// uni.redirectTo({
				// 	url:'/pages/news/webView?params=' + customer
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #f5f5f5;
	}
	.joinUs{
		padding:10rpx 15rpx 0;
		.joinUs-header{
			padding:42rpx 0 38rpx;
			background: #fff;
			border-radius: 20rpx;
			font-size: 30rpx;
			color:#0e0e0e;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-weight: 400;
			.image{
				width:160rpx;
				height:160rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-bottom: 24rpx;
			}
		}
		
		.part{
			background: #fff;
			border-radius: 20rpx;
			font-size: 26rpx;
			margin-top:16rpx;
			padding:38rpx 74rpx;
			.item{
				margin-bottom:58rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				color:#000;
				input{
					font-size: 26rpx;
					text-align: right;
					flex:1;
				}
			}
			.item:last-of-type{
				margin-bottom:0;
			}
			.joinUs-summary{
				color:#000000;
				margin-top:58rpx;
				textarea{
					box-sizing: border-box;
					margin-top: 20rpx;
					border:1px solid #f2f2f2;
					font-size: 26rpx;
					padding:16rpx 10rpx;
					height:160rpx;
					width:100%;
				}
			}
			.summitBtn{
				width:166rpx;
				height:60rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin:40rpx auto;
				background: #12ada9;
				color:#ffff;
				border-radius: 10rpx;
			}
			.title{
				color:#838383;
				font-size: 20rpx;
				display:flex;
				justify-content: center;
				align-items: center;
				.line{
					width: 200rpx;
					height:2rpx;
					background:#f2f2f2;
				}
				.tips{
					margin:0 30rpx;
				}
			}
			.phone{
				margin:20rpx auto 0;
				color:#838383;
				font-size: 20rpx;
				text-align: center;
			}
		}
	}
</style>
