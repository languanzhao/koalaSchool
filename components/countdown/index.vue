<template>
	<view class="countdown">
		<view :class="[!state ? 'getting' : 'noGet']">{{state ? '稍等' + secondsTime + 's' : '获取验证码'}}</view>
	</view>
</template>

<script>
	export default{
		props:{
			seconds:{
				type:Number,
				default:60
			}
		},
		components:{
			
		},
		data(){
			return {
				timer:null,
				state:false,
				secondsTime:0
			}
		},
		computed: {
			
		},
		onLoad(){
			
		},
		methods:{
			sendCode(){
					this.secondsTime = this.seconds
					this.state = true
					this.timer = setInterval(() => {
						this.secondsTime--
						if(this.secondsTime <= 0){
							this.state = false
							this.secondsTime = this.seconds
							clearInterval(this.timer)
							return
						}
					},1000)
			},
			//判断是否在获取中，只有在出现'获取验证码'时才能点击
			stateBool(){
				if(this.state){
					return true
				}else{
					return false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.getting{
		color: $theme-color;
	}
	.noGet{
		color: #999;
	}
</style>
