<template>
	<view class="school-list">
		<view class="item" v-for="(item,index) of list" :key='index' @click="linkOrCheck(item.id)">
			<view :class="['checkbox','iconfont',active(item.id) ? 'active icon-xuanzhong' : 'icon-weixuanzhong']" v-if="showCheck"></view>
			<view class="item-left">
				<image :src="item.avatar"></image>
			</view>
			<view class="item-right" v-if="item.type != 'tutoring'">
				<view class="schoolName">{{item.name}}</view>
					<view class="label">
						<text class="text">{{property[item.property]}}</text>
						<text class="text">{{collegeLevel[item.college_level]}}</text>
					</view>
					<view class="address">
						{{item.province || ''}} {{item.city || ''}} {{item.district || ''}}
					</view>
			</view>
			<view class="schoolInfo" v-if="item.type === 'tutoring'">
				<view class="detail_title u-skeleton-rect">{{item.name}}</view>
				<view class="labelList-tutoring">
					<view class="labelList-item u-skeleton-fillet" v-if="item.tags">
						{{item.tags}}
					</view>
					<view class="labelList-item u-skeleton-fillet" v-if="item.district || info.city">
						{{item.city || ''}} {{item.district || ''}}
					</view>
				</view>
			</view>
			<view class="goDetail">详情</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			list:{
				type:Array,
				default:()=>[]
			},
			showCheck:{
				type:Boolean,
				default:false
			}
		},
		components:{
			
		},
		data(){
			return {
				property:{
					'public':'公办',
					'private':'民办',
					'unite':'联办',
					'international_public':'国际私立',
					'international_private':'国际公立'
				},
				collegeLevel:{
					'secondary': '中专',
					'junior': '大专',
					'undergraduate': '本科',
					'master':'研究生',
					'early':'早教托管'
				},
				selectedList:[]
			}
		},
		methods:{
			//类名判断是否高亮
			active(id){
				 return this.selectedList.some(item=> item === id)
			},
			//跳转 或 选择状态
			linkOrCheck(id){
				if(this.showCheck){
					this.checkboxChange(id)
				}else{
					uni.navigateTo({
						url:`/sub_school/pages/detail/index?id=${id}`
					})
				}
			},
			// 选择状态
			checkboxChange(id){
				let bool = this.selectedList.some(item => {
				  return id === item;
				});
							
				if (bool) {
				  let index = this.selectedList.findIndex(item => item === id);
				  if (index !== -1) this.selectedList.splice(index, 1);
				} else {
				  this.selectedList.push(id);
				}
				this.$emit('selectedList',this.selectedList)
			},
			//防止在选择状态下，有已选中的选项 情况点击取消，使其全部默认未选中状态
			selectedListNull(){
				this.selectedList = []
			}
		},
	}
</script>

<style lang="scss">
	.school-list{
		.item{
			padding: 30rpx;
			border-bottom: 10rpx solid #fafafa;
			background: #fff;
			display: flex;
			// align-items: stretch;
			align-items: center;
			.checkbox{
				margin: auto 0;
				margin-right: 20rpx;
				font-size: 30rpx;
				color: #494949;
			}
			.item-left{
				@include w-h-br(84rpx);
				margin-right: 30rpx;
			}
			.item-right{
				flex: 1;
				@include flex-b-c();
				.schoolName{
					font-weight: bold;
					font-family:Microsoft YaHei;
				}
				.label{
					font-size: 24rpx;
					color: #A9A9A9;
					margin: 10rpx 0;
					.text{
						margin-right: 10rpx;
					}
				}
				.address{
					font-size: 24rpx;
					color: #A9A9A9;
				}
			}
			.schoolInfo {
				.detail_title{
					font-weight: bold;
				}
				.item {
					text-align: center;
			
					.num {
						font-weight: bold;
						font-family: SourceHanSansCN;
					}
			
					.title {
						font-size: 24rpx;
					}
				}
				.labelList-tutoring{
					margin: 10rpx 0;
					.labelList-item {
						font-size: 24rpx;
						margin: 10rpx 0;
						color: #A9A9A9;
					}
				}
			}
			.goDetail{
				width:124rpx;
				height:53rpx;
				font-size: 24rpx;
				text-align: center;
				line-height: 53rpx;
				background: $theme-color;
				color: #fff;
				border-radius: 30rpx;
				margin-left: auto;
			}
		}
	}
</style>
