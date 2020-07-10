<template>
	<view class="team">
		<role-adviser :info="info"></role-adviser>
		<view class="team_tab" v-if="info.koala.id">
			<view 
				:class="['tab_item',current === index ? 'active' : '']"
				v-for="(item,index) of tabList" 
				:key="index"
				@click="tabChange(index,item.value)"
				>
				<view :class="item.iconfont" class="iconfont" style="font-size:30rpx;"></view>
				<view class="words">{{item.title}}</view>
			</view>
		</view>
		<!-- <u-sticky>
			<view class="team_tab">
				<view 
					:class="['tab_item',current === index ? 'active' : '']"
					v-for="(item,index) of tabList" 
					:key="index"
					@click="tabChange(index,item.value)"
					>
					<view :class="item.iconfont" class="iconfont" style="font-size:30rpx;"></view>
					<view class="words">{{item.title}}</view>
				</view>
			</view>
		</u-sticky> -->
		
		<view class="content">
			<view class="item" v-for="(item,index) of list" :key='index'>
				<image class="image" :src="item.avatar"></image>
				<view class="center">
					<view class="name">{{item.name || ''}}<text v-if="item.is_counselor">{{item.growth_values.level.name}}</text></view>
					<view class="date">绑定时间：{{item.bound_at}}</view>
				</view>
				<view class="num" v-if="item.growth_values && item.growth_values.current">{{item.growth_values.current.direct_count || 0}}个邀请</view>
			</view>
			<view v-if="list && !list[0]" class="noneNull">
				暂无记录
			</view>
		</view>
	</view>
</template>

<script>
	import roleAdviser from '@/pages/user/components/role-adviser.vue'
	import api from '@/common/api.js'
	import { mapState } from 'vuex'
	import { copyValue } from '@/common/utils.js'
	export default{
		components:{
			roleAdviser
		},
		data(){
			return {
				current:0,
				current_page:1,
				last_page:0,
				info:{
					koala:{}
				},
				list:null,
				apiUrl:'',
				tabList:[
					{
						iconfont:'icon-zhiyao',
						title:'直邀',
						value:'subordinates'
					},
					{   
						iconfont:'icon-recommend',
						title:'推荐',
						value:'recommends'
					},
					{
						iconfont:'icon-suo',
						title:'锁粉',
						value:'fans'
					}
				]
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad(){
			this.updateUserInfo()
			this.getDataList()
		},
		methods:{
			updateUserInfo(){
				//获取用户信息并保存用户信息到vuex
				this.$http({
					api: api.getUserInfo,
					method: 'GET'
				}).then(res => {
					this.info = res.data
					this.$store.commit('setUserInfo', res.data)
				}).catch(err => {});
			},
			//切换
			tabChange(index,value){
				this.current = index
				let apiUrl = ''
				if(index === 0){
					apiUrl = api.invitees
				}else if(index === 1){
					apiUrl = api.recommends
				}else if(index === 2){
					apiUrl = api.fans
				}
				this.apiUrl = apiUrl
				this.current_page = 1
				this.last_page = 0
				this.list = null
				this.getDataList()
			},
			//获取对应数据
			getDataList(){
					let list = this.list || []
					this.$http({
						api: this.apiUrl || api.invitees,
						method: 'GET',
						params:{
							page:this.current_page
						}
					}).then(res => {
					    this.list = list.concat(res.data.data || [])
						this.current_page = res.data.meta.current_page
						this.last_page = res.data.meta.last_page
					}).catch(err => {
					})
			},
			//复制
			copyBtn(){
				copyValue(this.userInfo.koala.code)
			},
		},
		onPullDownRefresh() {
		   if(this.list){
			   this.current_page = 1
			   this.last_page = 0
			   this.list = null
			   this.getDataList()
		   }
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom(){
			if(this.current_page < this.last_page){
				this.current_page = this.current_page + 1
				this.getDataList()
			}
		}
	}
</script>
<style lang="scss">
	page{background: $page-background;}
</style>
<style lang="scss" scoped>
	.team{
		.team_tab{
			position: sticky;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 1000;
			display: flex;
			justify-content: space-around;
			align-items: center;
			background: #f5f5f5;
			view{
				display: flex;
				align-items: center;
			}
			.tab_item{
				text-align: center;
				padding: 30rpx 60rpx;
				view{
					color:#4C4C4C;
				}
				.words{
					font-size: 30rpx;
					margin-left:14rpx;
				}
			}
			.active{
				view{
					color:#12ADA9 !important;
				}
			}
		}
		.content{
			margin:0 12rpx;
			border-radius:20rpx;
			.item{
				display: flex;
				align-items: center;
				padding:36rpx 20rpx;
				background: #fff;
				margin-bottom: 2rpx;
				.image{
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
				}
				.center{
					margin-left: 30rpx;
					.name{
						font-size: 30rpx;
						color:#000;
						display: flex;
						align-items: center;
						text{
							margin-left:28rpx;
							font-size:18rpx;
							color:#FFC270;
							background: #363636;
							font-size: 18rpx;
							padding:6rpx 10rpx;
							border-radius: 30rpx;
						}
					}
					.date{
						font-size: 24rpx;
						color: #858585;
						margin-top: 12rpx;
					}
				}
				.num{
					margin-left: auto;
					border-left: 2rpx solid #ccc;
					padding: 10rpx 30rpx;
					color: #000;
					font-size: 30rpx;
				}
			}
			.item:first-of-type{
				border-top-left-radius: 20rpx;
				border-top-right-radius: 20rpx;
			}
			.item:last-of-type{
				border-bottom-left-radius: 20rpx;
				border-bottom-right-radius: 20rpx;
			}
		}
	}
</style>
