// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import token from '@/components/token'
import common from '@/components/common'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.min.css'
import mintUI  from 'mint-ui'
Vue.use(mintUI);


Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    var isLogin = localStorage.getItem('isLogin')
    if(isLogin == 'true'){
        store.state.isLogin = true
        // console.log('小哥已登录...')
    }else{
        store.state.isLogin = false
        // console.log('小哥木有登录!!!')
    }
    if(to.meta.requireAuth) {       // 判断该路由是否需要登录权限
        if(isLogin == 'true') {   // 通过vuex state获取是否登录
            next()
        }else{
            next({ path: '/'})
        }
    }else{
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
	components: { App },
    created () {
        this.weChatLogin()
        var isLogin = localStorage.getItem('isLogin')
        if(isLogin == 'true'){
            this.isMemberFun()
        }
    },
    methods:{
        isWeChatFun: function (){ 
            var ua = window.navigator.userAgent.toLowerCase(); 
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
                return true
            }else{ 
                return false
            } 
        },
        isMemberFun:function(){
            let uid = this.$store.state.uid || localStorage.getItem('uid')
            var _this = this
            var _isMenberUrl = '/daydaycook/server/offline/reservationUser/isBuyCourse.do?uid=' + uid 
            this.ajaxDataFun('post',_isMenberUrl,function(obj){
                if(obj.code == '200'){
                    _this.$store.state.isMember = obj.data
                    localStorage.setItem('isMember', obj.data)
                }
            })
        },
        // loadPage:function(url){
        //     var _locaUrl = window.location.href 
        //     var left = _locaUrl.split('?')[0]
        //     var right = _locaUrl.split('#/')[1]
        //     var allStr = left + '#/' + right
        //     window.location.href = allStr
        // },
        weChatLogin:function(){
            var _this = this 
            var _locaUrl = window.location.href 
            var _isWx = this.isWeChatFun()   //在微信里面
            var _wxCode = ''            //微信code 
            var _getWxInfoUrl = ''
            var uid = localStorage.getItem('uid');
            var isLogin = localStorage.getItem('isLogin')  //是否已登录
            var upWeixin = localStorage.getItem('upWeixin') 
                store.state.isLogin = isLogin
            if(!_isWx){   //微信外
                if(isLogin != 'true'){
                    store.state.isShowLogin = true
                }
                // console.log("不是微信浏览器")
            }else{  //微信内
                // console.log("微信浏览器")
                if(upWeixin){   //微信信息已录入
                    if(_locaUrl.indexOf('code=') > -1 || _locaUrl.indexOf('from=') > -1 || _locaUrl.indexOf('autoreply') > -1 ){ //已登录去掉code 跳转去授权分享
                        // console.log("微信信息已录入,跳转到无code Url")
                        // _this.loadPage(_locaUrl)
                    }
                    // else{ // 无code 判断是否登录
                    //     if(isLogin != 'true'){
                    //         store.state.isShowLogin = true
                    //     }
                    // }

                    if(isLogin != 'true'){
                        store.state.isShowLogin = true
                    }
                }else{ //微信信息未录入
                    if(_locaUrl.indexOf('code=') < 0 ){  //没有code跳转获取微信信息
                        // console.log("微信信息未录入,无code==>跳转！")
                        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3f387bc42ee75493&redirect_uri=" + encodeURIComponent(_locaUrl) + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
                    }else{
                        _wxCode = common.getUrlPars(_locaUrl).code || ''
                        // console.log('未录入微信信息，！url存在code,更新用户信息' + _wxCode)
                        _getWxInfoUrl = '/daydaycook/server/offline/wechat/getInfo.do?code=' + _wxCode
                        _this.ajaxDataFun('post',_getWxInfoUrl,function(obj){
                            if(obj.code == '200'){
                                var _data = obj.data
                                var _upWxInfoUrl = "/daydaycook/server/user/getWxUserInfo.do?userName=" + _data.unionid + "&imageUrl=" + _data.imageUrl + "&sex=" + (_data.sex-1) + "&nickName=" + _data.userName + "&openId=" + _data.openId
                                _this.ajaxDataFun('post',_upWxInfoUrl,function(obj){
                                    if(obj.code == '200'){
                                        _this.$store.state.uid = obj.data.id
                                        localStorage.setItem('uid', obj.data.id)
                                        localStorage.setItem('upWeixin','1')
                                        // console.log('获取uid成功！')
                                        // console.log('成功更新upWeixin，跳转到无code Url')
                                        // _this.loadPage(_locaUrl)

                                        if(isLogin != 'true'){
                                            store.state.isShowLogin = true
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            } 
        },
    }
})
