<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
import api from '@/common/api.js';
export default {
	data() {
		return {
			url: ''
		};
	},
	onLoad(options) {
		this.getLatestApplications().then(() => {
			this.openService()
		})
	},
	methods: {
		// 获取报读信息
		getLatestApplications(){
			return new Promise((resolve,reject) => {
				this.$http({
					api: api.latestApplications,
					method: 'GET',
				}).then(res => {
					let applyInfo = {}
					if(res.data){
						applyInfo = {
							majorName:res.data.major && res.data.major.name ? res.data.major.name : '',
							schoolName:res.data.school && res.data.school.name ? res.data.school.name : '',
							time:res.data.created_at
						}
					}
					this.applyInfo = applyInfo
					resolve()
				})
			})
		},
		//打开客服聊天界面
		openService() {
			let customer = {
				head: this.$store.state.userInfo.koala.avatar,
				'名称':this.$store.state.userInfo.koala.name,
				'真实姓名': this.$store.state.userInfo.koala.id_name,
				'手机': this.$store.state.userInfo.phone,
				'报读院校': this.applyInfo.schoolName,
				'报读专业': this.applyInfo.majorName,
				'当前学历': this.$store.state.userInfo.koala.education === 'middle' ? '初中' : '高中',
				'户籍地址':
					this.$store.state.userInfo.koala.id_province +
					this.$store.state.userInfo.koala.id_city +
					this.$store.state.userInfo.koala.id_district,
				'申请时间': this.applyInfo.time,
			};
			//将 json 格式转为字符串
			customer = JSON.stringify(customer);
			//用 encodeURIComponent 进行编码
			customer = encodeURIComponent(customer);
			//生成最终的对话链接
			let url = this.$projectUrl +  '/chat.html?history=true&&customer=' + customer
			this.url = url;
		},
	}
};
</script>

<style></style>
