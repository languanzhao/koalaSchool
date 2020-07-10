<template>
	<view class="list-cell">
		<view class="item" v-for="(item,index) of list" :key='index' @click="link(item.path,item.params)">
			<view class="item-left">
				<text :class="['iconfont',item.icon]" :style="{'color':item.color}" v-if="item.icon"></text>
				<text class="title">{{item.title}}</text>
			</view>
			<view class="item-right">
				<text v-if="item.tip" class="tip">{{item.tip}}</text>
				<text class="iconfont icon-leftArrow"></text>
			</view>
		</view>
		<uni-popup ref='uniPopupCoo'>
			<view class="uniPopup-toast">
				<view class="uniPopup-title">提示</view>
				<view class="uniPopup-summary" style="text-align: center;">申请顾问，须请先完善您 个人信息</view>
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
	import { mapState } from 'vuex'
	import { checkLogin } from '@/common/utils.js'
	export default {
		props: {
			list: {
				type: Array,
				default: () => [] // es6的箭头函数
			}
		},
		data() {
			return {

			}
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		mounted(){
			
		},
		methods: {
			link(url,params) {
				checkLogin().then(() => {
					if(params === 'adviserApply'){
						if(this.userInfo.phone && this.userInfo.koala.id_no){
							uni.navigateTo({
								url:'/sub_tim/pages/joinUs/index?type=2&path=my'
							})
						}else{
							this.$refs.uniPopupCoo.open()
						}
					}else{
						if(params){
							url = url + '?params=' + JSON.stringify(params)
						}
						uni.navigateTo({
							url:url,
							fail: function() {
								uni.switchTab({
									url: link
								})
							}
						})
					}
					
				})
			},
			editInfo(){
				this.$refs.uniPopupCoo.close()
				uni.navigateTo({
					url:`/sub_user/pages/personalInfo/info-edit?back=${true}`
				})
			},
		},
		watch:{
			list:{
				immediate: true,
				deep: true,
				handler(value) { 
					
				}
			}
		}
	}
</script>

<style lang="scss">
	.list-cell {
		background: #fff;

		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid #f5f5f5;

			.item-left {
				display: flex;
				align-items: center;

				.iconfont {
					margin-right: 20rpx;
					font-size: 30rpx;
				}

				.title {
					font-family: Microsoft YaHei;
					font-weight: 400;
					color: rgba(0, 0, 0, 1);
				}
			}

			.item-right {
				display: flex;
				align-items: center;

				.iconfont {
					color: #c7c7c7;
					font-size: 22rpx;
				}

				.tip {
					font-size: 26rpx;
					color: #909399;
					margin-right: 20rpx;
				}
			}
		}
	}
</style>
