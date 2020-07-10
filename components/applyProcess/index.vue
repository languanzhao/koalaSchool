<template>
	<view class="applyProcess">
		<image class="image" :src="item.school.avatar"></image>
		<view class="info">
			<view class="title">{{item.closed ? '已取消该报名' : applyProcess.title}}</view>
			<view class="schoolName">{{item.school.name}}</view>
			<view class="summary">{{item.closed ? '已取消' : applyProcess.summary}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		components:{
			
		},
		props:{
			item:{
				type:Object,
				default:() => {}
			}
		},
		data(){
			return {
				applyProcess:{}
			}
		},
		computed: {
			
		},
		mounted(){
			
		},
		methods:{
			
		},
		watch:{
			item: {
				immediate: true,
				deep: true,
				handler(value) {
					let title = '',summary = ''
					if(value.pass_status === 'pending'){
						title = '已报名交费'
						summary = '当前正在审核，请耐心等待'
					}else if(value.pass_status === 'failed'){
						title = '报名失败'
						let type = value.school.type != 'tutoring' ? '院校' : '机构'
						summary = '重新报名或者挑选其他优质' + type
					}else if(value.pass_status === 'success'){
							title = '报名成功'
						if(value.school.type != 'tutoring'){
							if(value.ship_status === 'pending'){
								summary = '录取通知书（待处理）'
							}else if(value.ship_status === 'delivered'){
								summary = '录取通知书（邮寄中）'
							}
						}
						if(value.refund_status === 'applied'){
							title = '已发起退款申请'
							summary = '待审核'
						}else if(value.refund_status === 'success'){
							title = '退款成功'
							summary = '已处理'
						}else if(value.refund_status === 'failed'){
							title = '退款失败'
							summary = '已处理'
						}
					}else if(value.pass_status === 'finish'){
						title = '入学报到'
						summary = '请注意领取您的助学计划'
					}
					this.$set(this.applyProcess,'title',title)
					this.$set(this.applyProcess,'summary',summary)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.applyProcess{
		display: flex;
		align-items: center;
		margin: 20rpx 0;
		.image{
			@include w-h-br(120rpx);
		}
		.info{
			margin-left: 20rpx;
			.title{
				font-weight: bold;
			}
			.schoolName{
				font-size: 28rpx;
				@include  line-clamp-one;
				margin: 10rpx 0;
			}
			.summary{
				font-size: 26rpx;
				color: #999;
				white-space: nowrap;
				@include  line-clamp-one;
				max-width: 400rpx;
			}
		}
	}
</style>
