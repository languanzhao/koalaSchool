<template>
	<view class="collected">
		<view class="fixed-header-place">
			<view class="collected-header" v-if="list && list[0]">
				<view class="checked" v-if="showCheck">已选中<text class="checkedNum">{{checkedList.length}}</text>个</view>
				<view class="edit" @click="edit(true)">编辑</view>
			</view>
		</view>
		
		<view v-if="list && list[0]">
			<collected-list :list='list' :showCheck='showCheck' ref='schoolList' @selectedList='selectedList'></collected-list>
		</view>
		
		<view v-if="list && !list[0]" style="text-align: center;">
			{{type == 2 ? "暂无收藏" : '暂无浏览记录'}}
		</view>
		<view class="fixed-place" v-if="showCheck">
			<view class="bottomBtnFixed">
				<view class="fixed-item cancelBtn" @click="edit(false)">取消</view>
				<view class="fixed-item delBtn" @click="delBtn">删除</view>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	const jweixin = require('jweixin-module')
	// #endif
	import collectedList from '@/components/school-list'
	import api from '@/common/api.js'
	import { hideMenuItems } from '@/common/utils.js'
	const app = getApp()
	export default{
		components:{
			collectedList
		},
		data(){
			return {
				wxRightMargin:0,
				showCheck:false,
				checkedList:[],
				list:null,
				current_page:1,
				last_page:0,
				type:'',
			}
		},
		onLoad(options){
			// #ifdef H5
			hideMenuItems(jweixin)
			// #endif
			this.type = options.type
			console.log(this.type)
			if(options.type == 2){
				this.getDatalist()
			}else if(options.type == 1){
				uni.setNavigationBarTitle({
					title:"我的浏览记录"
				})
				//浏览记录数组去重
				  let obj = {}; 
				  this.list = app.globalData.historyRecord.reduce((item, next)=> {
				     obj[next.id] ? '' : obj[next.id] = true && item.push(next);
				       return item;
				   }, []);
				   
			}
			console.log(this.list)
		},
		methods:{
			//获取数据
			getDatalist(){
				uni.showLoading({
					title:'加载中'
				})
				let list = this.list || []
				this.$http({
					api: api.favoritesList,
					method: 'GET',
					params:{
						page:this.current_page
					}
				}).then(res => {
					this.list = list.concat(res.data.data || [])
					this.current_page = res.data.meta.current_page
					this.last_page = res.data.meta.last_page
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()		
				})
			},
			//编辑 或 取消
			edit(bool){
				if(bool){
					this.showCheck = true
				}else{
					this.showCheck = false
					this.checkedList = []
					this.$refs.schoolList.selectedListNull()
				}
			},
			//选中
			selectedList(e){
				this.checkedList = e
			},
			
			//删除
			delBtn(){
				// console.log(222)
				if(this.checkedList && this.list){
					// 浏览记录
					if(this.type == 1){
							this.checkedList.map(item=>{
								let checkNuber = item
								this.list.map(value=>{
								    let valueId = value.id
									if(checkNuber==valueId){
										this.list.splice(0,1)
										this.showCheck = false
									}
								})
							})
							//刷新list
							app.globalData.historyRecord = this.list
					}
					// 收藏记录
					else{
						this.$http({
							api: api.favoritesDeletes,
							method: 'POST',
							params:{
								ids:this.checkedList.join(',')
							}
						}).then(res => {
								this.edit(false)
								if(this.list[0]){
									   this.current_page = 1
									   this.last_page = 0
									   this.list = null
									   this.getDatalist()
								}
							}).catch(err => {});
					}
					uni.showToast({
						title:"删除成功"
					})
				}
			}
		},
		onPullDownRefresh() {
			if(this.list[0] && this.type == 2){
				   this.current_page = 1
				   this.last_page = 0
				   this.list = null
				   this.getDatalist()
			}
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom(){
			if(this.type == 2){
				if(this.current_page < this.last_page){
					this.current_page = this.current_page + 1
					this.getDatalist()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
page{background: $page-background;}
	.fixed-header-place{
		height: 90rpx;
		.collected-header{
			background: #f5f5f5;
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;
			align-items: center;
			box-sizing: border-box;
			position: fixed;
			width: 100%;
			height: 90rpx;
			left: 0;
			top: 0;
			z-index: 1;
			.checkedNum{
				color: $theme-color;
			}
			.edit{
				margin-left: auto;
			}
		}
	}
	.fixed-place{
		height: 200rpx;
		.bottomBtnFixed{
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 30rpx;
			background: #fff;
			display: flex;
			justify-content: space-between;
			box-sizing: border-box;
			.fixed-item{
				padding: 20rpx 0;
				text-align: center;
				border-radius: 10rpx;
			}
			.cancelBtn{
				background: #999;
				width: 50%;
				margin-right: 30rpx;
				color: #fff;
			}
			.delBtn{
				width: 50%;
				background: $theme-color;
				color: #fff;
			}
		}
	}
</style>
