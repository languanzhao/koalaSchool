<template>
	<view class="category">
		<view class="topPart">
			<!-- 搜索 -->
			<view class="header">
				<view class="search" @click="searchLink">
					<text class="iconfont icon-search"></text>
					<text class="input">搜索</text>
				</view>
			</view>
			<!-- tab页签 -->
			<view class="tab">
				<view :class="['item',educationValue === item.value ? 'current' : '']" v-for="(item,index) of educationList" :key="index" @click="educationClick(item.value)">
					<view :class="['icon','iconfont',item.icon]"></view>
					<view class="title">{{item.title}}</view>
				</view>
			</view>
		</view>
		<!-- 视图层 -->
		<view class="viewPort">
			<!-- 左边 -->
			<scroll-view class="scroll-left" scroll-y="true" :style="{'height':scrollViewHeight + 'px'}">
				<view :class="['item',!leftSelectedList[0] ? 'leftActive' :'']" @click="leftListClick('all')">
					<view class="">全部</view>
					<view class="iconfont icon-duigou" v-if="!leftSelectedList[0]"></view>
				</view>
				<view v-for="(item,index) of leftList" :key='index' :class="['item',selectActive(1,item.id) ? 'leftActive' :'']" @click="leftListClick(item)">
					<view class="name">{{item.name}}</view>
					<view :class="['iconfont',selectActive(1,item.id)? 'icon-duigou' : '']"></view>
				</view>
			</scroll-view>
			<!-- 右边 -->
			<scroll-view class="scroll-right" scroll-y="true" :style="{'height':scrollViewHeight + 'px'}">
					<view class="child" v-if="!leftSelectedList[0]">全部</view>
					<view :class="['item']" v-for="(item,index) of rightList" :key='index'>
						<view class="" v-for="(iitem,iindex) of item.children" :key='iindex'>
							<view class="itemTitle">{{iitem.name}}</view>
							<view class="child" v-for="(iiitem,iiindex) of iitem.children" :key='iiindex' :class="['',selectActive(2,iiitem.id) ? 'rightActive' :'']" @click="rightListClick(item,iiitem)">
								<view class="name">{{iiitem.name}}</view>
								<view :class="['iconfont',selectActive(2,iiitem.id)? 'icon-duigou' : '']"></view>
							</view>
						</view>
					</view>
			</scroll-view>
		</view>
		<view class="fixed-bottom-btn-two">
			<view class="fixed-bottom-btn">
				<view class="left" @click="resetBtn">重置</view>
				<view class="right" @click="searchBtn">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	export default{
		components:{
			
		},
		data(){
			return {
				categoryList:[],
				educationObj:{
					'secondary':'中专',
					'junior':'大专',
					'adult':'继续教育',
					'training':'技能培训'
				},
				educationList:[
					{
						title:'中专',
						value:'secondary',
						icon:'icon-fangzi2'
					},
					{
						title:'大专',
						value:'junior',
						icon:'icon-fangzi1'
					},
					{
						title:'继续教育',
						value:'adult',
						icon:'icon-jiaoyu'
					},
					{
						title:'技能培训',
						value:'training',
						icon:'icon-jineng'
					}
				],
				educationValue:'secondary',
				leftSelectedList:[],
				sameLeftSelectedList:[],
				rightList:[],
				rightSelectedList:[],
				leftList:[],
				phoneHeight:0,
				topViewHeight:0,
				scrollViewHeight:0,
			}
		},
		onLoad(options){
			if(options.params){
				let params = JSON.parse(options.params)
				this.educationValue = params.intentionValue || 'secondary'
			}
			this.getMajorsList().then(() => {
				if(options.params){
					let params = JSON.parse(options.params)
					if(params.intentionList){
						this.leftList.map((item,index) => {
							params.intentionList.map((iitem,iindex) => {
								if(item.id === iitem.id){
									this.leftSelectedList.push(item)
								}
							})
						})
					}
					this.rightList.map((item,index) => {
						if(params.intentionList){
							params.intentionList.map((iitem,iindex) => {
								for(var key in item.children){
									for(var i in item.children[key].children){
										if(item.children[key].children[i].id === iitem.id){
											this.rightSelectedList.push(item.children[key].children[i])
											this.sameLeftSelectedList.push(item)
										}
									}
								}
							})
						}
					})
				}
			})
		},
		methods:{
			searchLink(){
				uni.navigateTo({
					url:'/pages/search/index'
				})
			},
			//学历弹窗 选择专业类型
			educationClick(value){
					this.educationValue = value
					this.rightList = []
					this.getMajorsList()
			},
			//专业列表
			getMajorsList(){
				return new Promise((resolve,reject) => {
					this.leftSelectedList = []
					this.rightSelectedList = []
					this.$http({
						api: api.getMajorsList,
						method: 'GET',
						params:{
							education:this.educationValue
						}
					}).then(res => {
						this.leftList = res.data
						this.leftList.map((item,index) => {
								this.rightList.push(item)
						})
						resolve()
					}).catch(err => {
						reject()		
					})
				})
			},
			//是否选中
			selectActive(type,id){
				if(type === 1){
					return this.leftSelectedList.some(item => item.id === id)
				}else if(type === 2){
					return this.rightSelectedList.some(item => item.id === id)
				}
			},
			//左边多选
			leftListClick(objItem){
				if(objItem === 'all'){
					//全选
					this.leftSelectedList = []
					this.rightSelectedList = []
					this.rightList = []
					this.leftList.map((item,index) => {
							this.rightList.push(item)
					})
				}else{
					//多选
					let bool = this.leftSelectedList.some(item => item.id === objItem.id)
					if(bool){
						//判断左边多选选项
						let index = this.leftSelectedList.findIndex(iitem => iitem.id === objItem.id)
						if (index !== -1) this.leftSelectedList.splice(index,1)
						
						let currentIndex = this.sameLeftSelectedList.findIndex(iitem => iitem.id === objItem.id)
						if (currentIndex !== -1) this.sameLeftSelectedList.splice(currentIndex,1)
						
						//根据取消选择删除对应内容
						let current = this.rightList.findIndex(item => item.id === objItem.id)
						if (current !== -1) this.rightList.splice(current,1)
						//取消的同时也要将右边已选的去掉
						let cancelRightIdArr = []
						for(var key in objItem.children){
							for(var i in objItem.children[key].children){
								 cancelRightIdArr.push(objItem.children[key].children[i])
							}
						}
						cancelRightIdArr.map((item,index) => {
							let current = this.rightSelectedList.findIndex(iitem => iitem.id === item.id)
							if(current !== -1) this.rightSelectedList.splice(current,1)
						})
						//取消所有选择时，左边选中的是全部，右边对应的是全部的内容
						if(!this.leftSelectedList[0]){
							this.leftList.map((item,index) => {
									this.rightList.push(item)
							})
						}
					}else{
						//从全部改为 多选时，应清空右边内容，改为多选选择的内容
						if(!this.leftSelectedList[0]){
							this.rightList = []
						}
						//判断左边多选选项
						this.leftSelectedList.push(objItem)
						//根据左边选项获取对应内容放到右边
						this.leftList.map((item,index) => {
							if(item.id === objItem.id){
								this.rightList.unshift(item)
								this.rightList = this.rightList.reduce((all,next)=>all.some((item)=>item['id']==next['id'])?all:[...all,next],[])
							}
						})
					}
				}
			},
			//右边多选
			rightListClick(bigItem,objItem){
				let bool = this.rightSelectedList.some(item => item.id === objItem.id)
				if(bool){
					let index = this.rightSelectedList.findIndex(iitem => iitem.id === objItem.id)
					if (index !== -1) this.rightSelectedList.splice(index,1)
					//删除其父级的id
					let sameArr = []
					this.sameLeftSelectedList.map((item,index) => {
						if(item.id === bigItem.id){
							sameArr.push(item)
							this.sameLeftSelectedList.splice(index,1)
						}
					})
				    if(!sameArr[0]){
						let i = this.leftSelectedList.findIndex(item => item.id === bigItem.id)
						if (i !== -1) this.leftSelectedList.splice(i,1)
					}
				}else{
					this.rightSelectedList.push(objItem)
					//点击右边 左边高亮
					let haveBool = this.leftSelectedList.some(item => item.id === bigItem.id)
					if(!haveBool){
						this.leftSelectedList.push(bigItem)
					}
					this.sameLeftSelectedList.push(bigItem)
				}
				console.log(this.leftSelectedList,'leftSelectedList')
			},
			//重置
			resetBtn(){
				this.leftSelectedList = []
				this.rightSelectedList = []
			},
			//搜索
			searchBtn(){
				// const res = new Map();
				// console.log(this.leftSelectedList.filter(item => !res.has(item.id) && res.set(item.id, 1)))
				//1、获取 点击右边需要将左边对应的父级(去重)
				const sameLeftSelectedList = this.sameLeftSelectedList.reduce((all,next)=>all.some((item)=>item['id']==next['id'])?all:[...all,next],[])
				console.log(sameLeftSelectedList,'listsss')
				//2、左边选择的数据，如果 sameLeftSelectedList 有相同的数据则 删除掉，由此获得 对应的 父级
				let searchList = [
					...this.leftSelectedList
				]
				sameLeftSelectedList.map((item,index) => {
					let current = searchList.findIndex(iitem => iitem.id === item.id)
					if(current !== -1) searchList.splice(current,1)
				})
				//3、左边的和右边的合并数组
				let searchArr = searchList.concat(this.rightSelectedList)
				if(searchArr.length > 3){
					uni.showToast({
						icon:'none',
						title:'只能选择3个哦'
					})
				}else{
					this.purposesSave(searchArr)
				}
			},
			//保存报读意向
			purposesSave(list){
				let arr = list.map((item,index) => {
					return item.id
				})
				this.$http({
					api: api.purposeSave,
					method: 'POST',
					params:{
						categories:arr.join(',')
					},
				}).then(res => {
					uni.$emit('purposes')
					uni.switchTab({
						url:'/pages/index/index'
					})
				}).catch(err => {
							
				})
			}
		},
		onReady(){
			uni.getSystemInfo({
				success:res=>{
					//手机屏幕高度
					this.phoneHeight = res.windowHeight
					//顶部高度
					let topView = uni.createSelectorQuery().select(".topPart")
					topView.boundingClientRect(data => {
						this.topViewHeight = data.height
						//剩余空间即scroll-view的高度
						this.scrollViewHeight = this.phoneHeight - this.topViewHeight - 80
					}).exec()
				}
			})
		}
	}
</script>
<style lang="scss">
	page{
		background: #fff;
		overflow-y:hidden;
	}
</style>
<style lang="scss" scoped>
	.category{
		.header{
			padding: 10rpx 30rpx;
			box-shadow: 0 10rpx 10rpx #f4f4f4;
			font-size: 26rpx;
			color: #757474;
			.search{
				height: 64rpx;
				line-height: 64rpx;
				border-radius: 40rpx;
				background: #f4f4f4;
				font-size: 26rpx;
				.icon-search{
					margin:0 14rpx 0 25rpx;
				}
			}
		}
		.tab{
			display: flex;
			margin:30rpx;
			justify-content: space-between;
			align-items: center;
			position: relative;
			.item{
				width: 48%;
				text-align: center;
				height: 90rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #f4f4f4;
				color: #a2a2a2;
				font-family:SourceHanSansCN;
				font-weight:bold;
				font-size: 22rpx;
				.majorChoose{
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
					padding: 0 20rpx;
				}
				.icon{
					font-size: 36rpx;
					margin-right: 16rpx;
				}
			}
			.current{
				color: #040404;
				font-size: 25rpx;
			}
			.level-bg{
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: transparent;
				z-index: 2;
			}
			.levelBox{
				position: absolute;
				right: 0;
				top: 100rpx;
				width: 48%;
				z-index: 3;
				background: #F5F5F5;
				border: 1rpx solid #ccc;
				.level-item{
					text-align: center;
					padding: 10rpx 0;
					border-bottom: 1rpx solid #ccc;
				}
			}
		}
		.viewPort{
			display: flex;
			justify-content: space-between;
			border-top: 4rpx solid #f4f4f4;
			.scroll-left{
				width: 30%;
				background: #f2f2f2;
				box-shadow:6rpx 0 8rpx #f4f4f4;
				margin-left: 20rpx;
				.item{
					text-align: center;
					padding: 20rpx 0;
					color: #3c3b3b;
					font-size: 28rpx;
				}
				.leftActive{
					color: #040404;
					background: #fff;
					position: relative;
					font-size: 35rpx;
					&::before{
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 8rpx;
						height: 30rpx;
						background: #f0250f;
					}
					.icon-duigou{
						position: absolute;
						right: 10rpx;
						top: 50%;
						transform: translateY(-50%);
						color: #9ad925;
					}
				}
			}
			.scroll-right{
				width: 62%;
				background: #fff;
				box-shadow:-6rpx 0 8rpx #f4f4f4;
				.child{
					height: 80rpx;
					line-height: 80rpx;
					padding-left: 84rpx;
					margin: 10rpx 0;
				}
				.item{
					color: #3D3D3D;
					font-size: 32rpx;
					.itemTitle{
						background: #d7d6d5;
						height: 80rpx;
						line-height: 80rpx;
						padding-left: 84rpx;
					}
					.rightActive{
						position: relative;
						.icon-duigou{
							position: absolute;
							right: 62rpx;
							top: 50%;
							transform: translateY(-50%);
							color: #9ad925;
						}
					}
				}
			}
		}
		.fixed-bottom-btn-two{
			height: 100rpx;
		.fixed-bottom-btn{
			position: fixed;
			bottom: 0;
			left: 0;
			background: #f4f4f4;
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx 24rpx;
			box-sizing: border-box;
			text-align: center;
			font-size: 35rpx;
			color: #fff;
			.left{
				width: 30%;
				background: #828387;
				margin-right: 30rpx;
				border-radius: 10rpx;
				padding: 20rpx 0;
			}
			.right{
				width: 70%;
				background: $theme-color;
				border-radius: 10rpx;
				padding: 20rpx 0;
			}
		}
		}
	}
</style>
