// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/index';
import token from '@/components/token';
import common from '@/components/common';
import { isWeChatFun } from '@/utils/utils.js';
import 'mint-ui/lib/style.min.css';
import mintUI from 'mint-ui';

Vue.use(mintUI);

Vue.config.productionTip = false;
/*if (typeof ddcApp !== "undefined") {
	Vue.prototype.$ddcApp = ddcApp;
} else {
	Vue.prototype.$ddcApp = {};
}*/
/**
 * Description: 判断是否登录
 */
router.beforeEach((to, from, next) => {
	let isLogin = localStorage.getItem('isLogin');
	if (isLogin === 'true') {
		store.state.isLogin = true;
	} else {
		store.state.isLogin = false;
	}
	if (to.meta.requireAuth) {     // 判断该路由是否需要登录权限
		if (isLogin === 'true') {   // 通过vuex state获取是否登录
			next();
		} else {
			next({path: '/'});
		}
	} else {
		next();
	}
})

Vue.filter('formatDate',function(va){
	function setv(v){v = v < 10?'0' + v : v; return v; }
	var v = new Date(va);
	var y = v.getFullYear();   //年
	var m = v.getMonth() + 1; //上个月
	var d = v.getDate();      //天getDate.getDate()
	return y + '/' + setv(m) + '/' + setv(d)
})

Vue.filter('formatDateMore',function(va){
	function setv(v){v = v < 10?'0' + v : v; return v; }
	if(va){
		var v = new Date(va);
		var y = v.getFullYear();   //年
		var mm = v.getMonth() + 1; //上个月
		var d = v.getDate();      //天getDate.getDate()
		var h = v.getHours()
		var m = v.getMinutes()
		var s = v.getSeconds()
		return y + '/' + mm + '/' + d + " " +  setv(h) + ':' + setv(m)
	}
})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {App},
	created() {
		this.weChatLogin();
		let isLogin = localStorage.getItem('isLogin');
		if (isLogin === 'true') {
			this.isMemberFun().then((obj) => {
				if (obj.code === '200') {
					this.$store.state.isMember = obj.data;
					localStorage.setItem('isMember', obj.data);
				}
			});
		}
	},
	methods: {
		/**
		* Description: 请求数据
		* */
		isMemberFun() {
			let uid = this.$store.state.uid || localStorage.getItem('uid');
			let userUniqueId = this.$store.state.userUniqueId || localStorage.getItem('userUniqueId');
			let isMenberUrl = `/daydaycook/server/offline/reservationUser/isBuyCourse.do?uid=${uid}&userUniqueId=${userUniqueId}`;
			return new Promise((resolve) => {
				this.ajaxDataFun('post', isMenberUrl, (data) => {
					return resolve(data);
				});
			});
		},
		/**
		 *  Description: 微信第一层
		 * */
		getWxInfo() {
			let wxCode = common.getUrlPars(locaUrl).code || ''; // 微信code
			let getWxInfoUrl = `/daydaycook/server/offline/wechat/getInfo.do?code=${wxCode}`;
			return new Promise((resolve) => {
				this.ajaxDataFun('post', getWxInfoUrl, (data) => {
					return resolve(data);
				});
			});
		},
		/**
		 *  Description: 微信第二层
		 * */
		upWxInfo(obj) {
			let upWxInfoUrl = `/daydaycook/server/user/getWxUserInfo.do?
				userName=${obj.data.unionid}&
				imageUrl=${obj.data.imageUrl}&
				sex=${obj.data.sex - 1}&
				nickName=${obj.data.userName}&
				openId=${obj.data.openId}`;
			return new Promise((resolve) => {
				this.ajaxDataFun('post', upWxInfoUrl, (data) => {
					return resolve(data);
				})
			})
		},
		/*
		* Description: 判断是否微信登录
		* */
		weChatLogin() {
			let locaUrl = window.location.href;
			let isWx = isWeChatFun();   // 判断是否是微信
			let uid = localStorage.getItem('uid');
			let isLogin = localStorage.getItem('isLogin');  //是否已登录
			let upWeixin = localStorage.getItem('upWeixin');
			store.state.isLogin = isLogin;
			if (!isWx) { //微信外
				if (isLogin !== 'true') {
					store.state.isShowLogin = true;
				}
			} else { //微信内
				if (upWeixin) {
					//已登录去掉code 跳转去授权分享
					if (locaUrl.indexOf('code=') > -1 || locaUrl.indexOf('from=') > -1 || locaUrl.indexOf('autoreply') > -1) {
						// console.log("微信信息已录入,跳转到无code Url")
						// _this.loadPage(_locaUrl)
					}
					if (isLogin !== 'true') {
						store.state.isShowLogin = true;
					}
				} else { //微信信息未录入
					if (locaUrl.indexOf('code=') < 0) {  //没有code跳转获取微信信息
						// console.log("微信信息未录入,无code==>跳转！")
						window.location.href =`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3f387bc42ee75493&redirect_uri=
							${encodeURIComponent(locaUrl)}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
					} else {
						// console.log('未录入微信信息，！url存在code,更新用户信息' + _wxCode)
						this.getWxInfo().then((obj) => {
							if (obj.code === '200') {
								this.upWxInfo(obj).then((data) => {
									if (data.code === '200') {
										this.$store.state.uid = data.data.id;
										localStorage.setItem('uid', data.data.id);
										localStorage.setItem('upWeixin', '1');
										// console.log('获取uid成功！')
										// console.log('成功更新upWeixin，跳转到无code Url')
										if (isLogin !== 'true') {
											store.state.isShowLogin = true;
										}
									}
								})
							}
						})
					}
				}
			}
		}
	}
})
