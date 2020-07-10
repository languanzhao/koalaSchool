<template>
	<view class="list">
		<!-- 布局一 -->
		<view class="schoolList-one">
			<!-- @mousedown='touchstartPage' 移动端的@touchstart 相当于 PC端的@mousedown 若要兼容PC端 加上@mousedown即可-->
			<view class="toast-bg" v-if="bgShow" @touchstart.prevent="touchstartPage"></view>
			<view class="schoolList-item" v-for="(item, index) of arr" :key="index" @click="goDetail(item.id)">
				<view class="item-padding">
					<view class="top">
						<view class="imageBox u-skeleton-circle"><image :src="item.avatar" mode="aspectFit"></image></view>
						<view class="schoolName u-skeleton-rect">{{ item.name }}</view>
						<view class="icon-right">
							<view class="iconfont icon-gengduo1 u-skeleton-rect" @click.stop="floatPartClick(index)"></view>
							<view class="floatPart" v-if="item.floatShow">
								<view class="floatPart-item" 
									v-for="(iitem, iindex) of floatPartList" 
									:key="iindex" 
									@click.stop="operationClick(index,iitem.type,item)" 
									hover-stop-propagation
									v-if="iitem.type != 2 || item.contact_information"
									>
									<view :class="['iconfont', iitem.icon]"></view>
									<view class="title">{{ iitem.title }}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="frontImage u-skeleton-rect">
						<image class="image" :src="item.image" mode="widthFix"></image>
						<!-- <easy-loadimage mode="" class="easy-loadimage" :scroll-top="scrollTop" :image-src="item.image" :open-transition="true"></easy-loadimage> -->
					</view>
					<view class="center">
						<view class="enrollmentBox">
							<view class="enrollment" v-if="item.recruit_count">
								<view class="avatarImgBox">
									<image
										class="avatarImg u-skeleton-circle"
										:src="iitem.avatar"
										mode=""
										v-for="(iitem, index) of item.recruited_users"
										:key="index"
										v-if="index < 3 && item.recruited_users"
									></image>
								</view>
								<view class="num u-skeleton-rect">等{{ item.recruit_count }}人已报名</view>
							</view>
							<view class="article-title u-skeleton-rect">招生简章</view>
						</view>
						
						<view class="operation">
							<view 
								class="item u-skeleton-rect" 
								v-for="(iitem, iindex) of operationList" 
								:key="iindex" 
								@click.stop="userOper(iindex,item)"
								>
								<view :class="['iconfont', iitem.icon, iindex === 0 && item.is_favour ? 'icon-collected' : '']"></view>
							</view>
						</view>
						
					</view>
					<view class="summary u-skeleton-rect">{{ item.description }}</view>
				</view>
				
				<recommend-list :list="recommendList" :indexChangeTabValue="indexChangeTabValue" v-if="index === 0 && recommendList[0]"></recommend-list>
				
				<video-list :list="list" :indexChangeTabValue="indexChangeTabValue" v-if="index === 3 && list[0]"></video-list>
			</view>
		</view>
		<!-- 分享弹窗 -->
		<uni-popup ref="popupShare" type="bottom">
			<view class="popupContent">
				<view class="popupContent-title">分享到</view>
				<view class="shareList">
						<view class="item" @click="shareCircle">
							<image :src="circleImg"></image>
							<view>朋友圈</view>
						</view>
					
					<!-- #ifdef MP-WEIXIN -->
						<button open-type="share" hover-stop-propagation class="item" :data-item="schoolItem">
							<image :src="firendsImg"></image>
							<view>好友</view>
						</button>
					<!-- #endif -->
					
					<!-- #ifdef APP-PLUS -->
						<view class="item" @click="appShareWx">
							<image :src="firendsImg"></image>
							<view>好友</view>
						</view>
					<!-- #endif -->
				</view>
			</view>
		</uni-popup>
		<!-- 布局一-->
	</view>
</template>

<script>
import recommendList from '@/components/school-list/recommend';
import videoList from '@/components/school-list/video';
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
import uniPopup from '@/components/uni-popup/uni-popup';
import { debounce, checkLogin, schoolInfoToLink,schoolDetailShare,app_share_wx } from '@/common/utils.js';
import api from '@/common/api.js'
import { mapState } from 'vuex'
// #ifdef H5
var jweixin = require('jweixin-module'); //npm安装的引用
// #endif
export default {
	props: {
		list: {
			type: Array,
			default: () => []
		},
		scrollTop: {
			type: Number,
			default: 0
		},
		applyedBool:{
			type:Boolean,
			default:false
		},
		indexChangeTabValue:{
			type:String,
			default:''
		}
	},
	components: {
		recommendList,
		videoList,
		easyLoadimage,
		uniPopup
	},
	data() {
		return {
			circleImg:this.$rootUrl + 'koala_images/login/circle.png',
			firendsImg:this.$rootUrl + 'koala_images/login/wx01.png',
			collectedList:[],
			delList:[],
			arr:null,
			bgShow: false,
			floatPartList: [
				{
					icon: 'icon-share',
					title: '分享',
					type:1
				},
				{
					icon:'icon-signUp',
					title: '报名',
					type:2
				}
			],
			operationList: [
				{
					type:1,
					icon: 'icon-nullCollect'
				},
				{
					type:2,
					icon: 'icon-duihua'
				},
				{
					type:3,
					icon: 'icon-fenxiang'
				}
			],
			recommendList:[],
			schoolItem:{}
		};
	},
	computed:{
		...mapState(['roles'])
	},
	methods: {
		//点击浮动模块显示，且bgShow也显示
		floatPartClick(index) {
			this.$set(this.arr[index], 'floatShow', true);
			this.bgShow = true;
			// this.arr.map((item,i)=>{
			//  if(index !== i){
			//   this.$set(item,'floatShow',false)
			//  }
			// })
		},
		//进入详情
		goDetail(id) {
			uni.navigateTo({
				url: '/sub_school/pages/detail/index?id=' + id
			});
		},
		//浮动模块中的操作按钮
		operationClick(index,type,item) {
			this.bgShow = false
			this.$set(this.arr[index], 'floatShow', false)
			if(type == 1){
				this.schoolItem = item
				console.log(item,'item')
				//分享
				// #ifdef H5
					schoolDetailShare(item) 
				// #endif
				
				// #ifdef MP-WEIXIN
					this.$refs.popupShare.open()
				// #endif
				
				// #ifdef APP-PLUS
					this.$refs.popupShare.open()
				// #endif
			}else if(type == 2){
				//报名
				if(item.type === 'tutoring'){
					schoolInfoToLink(item)
				}else{
					if(this.applyedBool){
						uni.showToast({
							icon:'none',
							title:'您已报过名'
						})
					}else{
						schoolInfoToLink(item)
					}
				}
			}
		},
		//1、浮动模块显示时，只有一触摸到除浮动模块外的部分，bgShow 设置为false，floatShow 都为false
		//2、切换tababr时隐藏浮动模块
		touchstartPage() {
			this.bgShow = false;
			this.arr.map((item, i) => {
				this.$set(item, 'floatShow', false);
			});
		},
		// 收藏 客服 分享 按钮点击
		userOper(iindex,item) {
			checkLogin().then(() => {
				switch (iindex) {
					case 0:
						this.collectBtn(item.id,item.is_favour);
						break;
					case 1:
						uni.navigateTo({
							url:"/pages/news/chat?schoolId=" + item.id
						})
						break;
					case 2:
						this.schoolItem = item
						// #ifdef MP-WEIXIN
							this.$refs.popupShare.open()
						// #endif
						
						// #ifdef H5
							schoolDetailShare(item)
						// #endif
						
						// #ifdef APP-PLUS
							this.$refs.popupShare.open()
						// #endif
						break;
				}
			});
		},
		//分享到朋友圈
		shareCircle(){
			this.$refs.popupShare.close()
			// #ifdef APP-PLUS
				this.appShareCircle()
			// #endif
			// #ifndef APP-PLUS
			  schoolDetailShare(this.schoolItem)
			// #endif
		},
		//收藏功能
		collectBtn(id, bool) {
			let apiUrl = '',tip = '',that = this
			if (bool) {
				tip = '取消收藏';
				this.delList.push(id)
				let index = this.collectedList.findIndex(item => item === id)
				if(index !== -1) this.collectedList.splice(index,1)
				this.arr.map((item, i) => {
					if (item.id === id) {
						this.$set(item, 'is_favour', false);
					}
				});
			} else {
				tip = '收藏成功';
				this.collectedList.push(id)
				let current = this.delList.findIndex(item => item === id)
				if(current !== -1) this.delList.splice(current,1)
				this.arr.map((item, i) => {
					if (item.id === id) {
						this.$set(item, 'is_favour', true);
					}
				});
			}
			uni.showToast({
				icon: 'none',
				title: tip
			});
			this.api(that)
		},
		api: debounce((that) => {
			if(that.collectedList[0]){
				let newArr = Array.from(new Set(that.collectedList))
				that.$http({
					api: api.favoritesStores,
					method: 'POST',
					params:{
						ids:newArr.join(',')
					}
				})
					.then(res => {
						that.collectedList = []
					})
					.catch(err => {});
			}
			if(that.delList[0]){
				let newArr = Array.from(new Set(that.delList))
				that.$http({
					api: api.favoritesDeletes,
					method: 'POST',
					params:{
						ids:newArr.join(',')
					}
				})
					.then(res => {
						that.delList = []
					})
					.catch(err => {});
			}
		},1000,false),
		getRecommendList(){
			let params = {
				is_recommend:1
			}
			if(this.indexChangeTabValue){
				params.type = this.indexChangeTabValue
			}
				this.$http({
					api: api.getSchoolList,
					method: 'GET',
					params:params
				}).then(res => {
					this.recommendList = res.data.data
				}).catch(err => {
							
				})
		},
		// 分享功能
		sharePopup() {
			this.$refs.popup.open();
		},
		//微信小程序 分享
		shareBtn(index) {
			
		},
		//分享到微信(app)
		appShareWx() {
			app_share_wx(1,this.schoolItem)
		},
		//分享到朋友圈(app)
		appShareCircle() {
			app_share_wx(2,this.schoolItem)
		}
	},
	onShow() {
		
	},
	watch: {
		list: {
			immediate: true,
			deep: true,
			handler(value) {
				if(!this.arr){
					this.getRecommendList()
				}
				this.arr = value
			}
		},
		//监听页面发生滚动就将浮动模块隐藏 同时兼容PC端上浏览时使用鼠标滚动而不是触摸
		scrollTop(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.bgShow = false;
				this.arr.map((item, i) => {
					this.$set(item, 'floatShow', false);
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.popupContent {
	background: #fff;
	padding: 20rpx;
	// #ifdef H5
	margin-bottom: 50px; //适配网页
	// #endif
	.popupContent-title {
		text-align: center;
		font-weight: bold;
		font-size: 36rpx;
		margin-bottom: 20rpx;
	}
	.shareList {
		display: flex;
		align-items: center;
		// justify-content: space-around;
		.item {
			text-align: center;
			flex: 1;
			image {
				width: 76rpx;
				height: 76rpx;
			}
		}
	}
}
.toast-bg {
	background: rgba(0, 0, 0, 0.5);
	// background: transparent;
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 1;
	touch-action: none;
}
//布局一
.schoolList-one {
	.schoolList-item {
		background: #fff;
		margin-bottom: 10rpx;
		.item-padding {
			padding: 0 0 10rpx;
		}
		.top {
			display: flex;
			align-items: center;
			padding: 10rpx 30rpx;
			.imageBox {
				@include w-h-br(80rpx);
				// image {
				// 	@include w-h-br(80rpx);
				// }
			}
			.schoolName {
				margin-left: 20rpx;
			}
			.icon-right {
				margin-left: auto;
				position: relative;
				.icon-gengduo1 {
					padding: 20rpx 0 20rpx 20rpx;
					font-size: 40rpx;
				}
				.floatPart {
					position: absolute;
					top: 60rpx;
					right: 0;
					z-index: 2;
					width: 200rpx;
					padding: 10rpx;
					border-radius: 10rpx;
					box-shadow: 2rpx 2rpx 2rpx 6rpx #f5f5f5;
					background: #fff;
					.floatPart-item {
						display: flex;
						align-items: center;
						margin: 16rpx;
						.iconfont {
							font-size: 40rpx;
						}
						.title {
							margin-left: 20rpx;
							color: #999;
						}
					}
				}
			}
		}
		.frontImage {
			width: 100%;
			// height: 300rpx;
			overflow: hidden;
			.image{
				max-height: 600rpx;
			}
			.easy-loadimage {
				height: 300rpx;
				background: #f5f5f5;
			}
		}
		.center {
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;
			.article-title {
				font-weight: bold;
			}
			.enrollmentBox {
				
				.enrollment {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;
					.avatarImgBox {
						margin-right: 10rpx;
						.avatarImg {
							@include w-h-br(40rpx);
						}
					}
					.num {
						font-size: 24rpx;
					}
					.article-title {
						font-weight: bold;
					}
				}
				.article-title {
					font-weight: bold;
				}
			}
			.operation {
				display: flex;
				.item {
					text-align: center;
					margin-left: 33rpx;
					.iconfont {
						font-size: 40rpx;
						color: #535353;
					}
					.icon-collected {
						color: red;
					}
				}
			}
		}
		.summary {
			color: #7C7C7C;
			padding: 0 30rpx;
			font-size: 26rpx;
			margin-top: 10rpx;
			@include line-clamp-one;
		}
	}
}
//布局一

button {
	position: static;
	display: inline;
	margin: 0;
	padding: 0;
	background: none;
	border: none;
	line-height: normal;
}
button::after {
	border: none;
	width: 0;
	height: 0;
}
.button-hover {
	color: transparent;
	background: transparent;
}
</style>
