<template>
    <section>
        <div class="popBg than"></div>
        <div class="loginMain">
            <div class="loginTitle">
                <img v-show="pageTitle == ''" src="../../static/img/login_logo.png" alt="logo" />
                <p>{{ pageTitle }} </p>
            </div>
            <ul>
                <li class="first" v-show="!setPwd">
                    <input class="input" type="number" name="phone" v-model="phoneVal" @keyup.enter="getCodeFun()" placeholder="请输入手机号" />
                    <button class="getCode" @click="getCodeFun()" :class="{active:rightPhone,hide:beginCount || reSend}" v-show="!loginPwd || forgetPwd">
                        获取验证码
                    </button>
                    <button class="getCode" v-show="beginCount && (!loginPwd || forgetPwd)" >
                        已发送({{timeLeng}}s)
                    </button>
                    <button class="getCode active" @click="getCodeFun()" v-show="reSend && (!loginPwd || forgetPwd)">
                        重新发送
                    </button>
                    <span class="clearTel clear" v-show="phoneVal" @click="phoneVal = ''"
                    :class="{right:loginPwd && !forgetPwd }">
                        <img src="../../static/img/cha.png" alt="" />
                    </span>
                </li>
                <li class="second" v-show="!loginPwd && !setPwd || forgetPwd">
                    <input class="input" type="number" name="code" v-model="codeVal" @keyup.enter="loginFun()"  placeholder="请输入验证码" />
                    <span class="clearCode clear" @click="codeVal = ''" v-show="codeVal">
                        <img src="../../static/img/cha.png" alt="" />
                    </span>
                </li>
                <li class="second" v-show="loginPwd && !setPwd && !forgetPwd">
                    <input class="input" type="password" name="password" v-model="password" @keyup.enter="loginFun()"  placeholder="请输入密码" v-show="!showPass" />
                    <input class="input" type="text" name="password" v-model="password" @keyup.enter="loginFun()"  placeholder="请输入密码"  v-show="showPass"/>
                    <span class="clearCode clear">
                        <img src="../../static/img/cha.png" alt=""  @click="password = ''" v-show="password" />
                        <img class="big" src="../../static/img/icon_xianshi.png" alt="" v-show="showPass" @click="showPass = !showPass" />
                        <img class="big" src="../../static/img/icon_yingcang.png" alt="" v-show="!showPass" @click="showPass = !showPass" />
                    </span>
                </li>

                <!-- 重新设置密码 -->
                <li class="second" v-show="setPwd">
                    <input class="input" type="password" name="relPassword" v-model="relPassword" @keyup.enter="loginFun()"  placeholder="请输入6-20位密码" />
                    <span class="clearCode clear">
                        <img src="../../static/img/cha.png" alt=""  @click="relPassword = ''" v-show="relPassword"/>
                    </span>
                </li>

                <li class="second" v-show="setPwd">
                    <input class="input" type="password" name="relPasswordTwo" v-model="relPasswordTwo" @keyup.enter="loginFun()"  placeholder="重复以上密码" />
                    <span class="clearCode clear">
                        <img src="../../static/img/cha.png" alt=""  @click="relPasswordTwo = ''" v-show="relPasswordTwo"/>
                    </span>
                </li>

                <li class="justify loginType" v-show="forgetPwd" @click="backLoginCode">
                    <p class="box"></p>
                    <p class="box">又想起来了?</p>
                </li>

                <li class="justify loginType" v-show="!setPwd && !forgetPwd">
                    <p class="box" @click="forgetPwdFun">
                        <span style="color:#7F7F7F;" v-show="loginPwd">
                            忘记密码
                        </span>
                    </p>
                    <p class="box" @click="changeLoginPwd">{{ loginTypeTxt }}</p>
                </li>
                <div class="loginButton" :class="{active: isActive}" @click="loginFun()" >
                    {{ loginTxt }}
                </div>
            </ul>
        </div>
    </section>
</template>

<script>
    import popMin from '@/components/popMin.js'
    import common from '@/components/common.js'
    import * as util from '@/utils/utils.js'
    import _hex_md5 from 'md5'
    import _axios from 'axios'

    export default {
        name: 'login',
        data () {
            return {
                pageTitle: '',
                loginTxt: '登录',
                phoneVal: '',
                codeVal: '',
                rightPhone: false,
                rightCode: false,
                isgetCode: false,
                timeLeng: 60,
                timeTxt: '',
                timeInt: null,
                reSend: false,
                beginCount:false,
                loginType:'',
                isWeChat: true,
                password: '',   //登录密码
                relPassword: '',   //登录密码
                relPasswordTwo: '',  //第二次密码
                loginPwd: false,   //用密码登录
                forgetPwd: false,  //忘记密码
                resetPwd: false,   //忘记密码 重新设置密码
                setPwd: false,   //设置密码
                loginTypeTxt: '切换密码登录',
                noPassword: false,
                showPass: false,
            }
        },
        created () {

        },
        components: {},
        props: ['isFrom'],
        methods: {
            forgetPwdFun:function(){
                this.forgetPwd = true
                this.resetPwd =  false
                this.loginTxt = '下一步'
                this.pageTitle = '忘记密码'
            },
            backLoginCode:function(){
                this.forgetPwd = false
                this.loginTxt = '登录'
                this.pageTitle = ''
            },
            changeLoginPwd:function(){
                this.loginPwd = !this.loginPwd
                console.log(this.loginPwd)
                this.pageTitle = ''
                if(this.loginPwd){
                    this.loginTypeTxt = '切换验证码登录'
                }else{
                    this.loginTypeTxt = '切换密码登录'
                }
            },
            isWeChatFun: function (){
                var _this = this
                var ua = window.navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                    this.isWeChat = true
                }else{
                    this.isWeChat = false
                }
                console.log("_this.isWeChat ______" + this.isWeChat )
            },
            getLoginType:function(){
                var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
                var isIOS = !! u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                if(isIOS){// 登录类型1.android 2.ios 3.pc端
                    this.loginType = 2;
                }else if(isAndroid){
                    this.loginType = 1;
                }else{
                    this.loginType = 3;
                }
            },
            getScore:function (uid){ //注册送分车页
                var getScoreUrl  = "/daydaycook/server/score/gainScore.do?uid=" + uid + "&scoreCode=login_first&objId=&title=pgcLogin&scoreCount=3"
                this.ajaxDataFun('post',getScoreUrl,function(obj){
                    console.log(obj);
                });
            },
            getCodeFun: function() {
                var _this = this;
                var _codeUrl = "/daydaycook/server/utils/getRegCode.do?&type=2&languageId=3&mainland=1&deviceId=PC&username=" + _this.phoneVal
                if(_this.rightPhone){
                    this.timefunc()  // 倒计时
                    this.ajaxDataFun('post',_codeUrl,function(obj){
                        if(obj.code == '200'){
                            _this.isgetCode = true
                        }else if(obj.code == '202'){
                            console.log(202)
                            popMin.show('icon-sign',obj.msg)
                            _this.clearCountF()
                        }else if(obj.code == '402'){
                            popMin.show('icon-sign','短信发送失败,请稍后重试！')
                            _this.clearCountF()
                        }else{
                            popMin.show('icon-sign','短信发送失败,请稍后重试！')
                            _this.clearCountF()
                        }
                    })
                }else if(!_this.rightPhone){
                    popMin.show("icon-yk_icon_warning","请填写正确的手机号码")
                }
            },
            loginFun:function(){
                var _this = this
                var uid = this.$store.state.uid || localStorage.getItem('uid')
                console.log("uid===" + uid)
                _this.isWeChatFun()
                _this.getLoginType()

                if(this.forgetPwd){  //忘记密码
                    this.forgetPwdDo()
                }else if(this.setPwd){   //设置密码
                    this.setPwdFun()
                }else if(this.loginPwd){  //密码登录
                    this.loginPwdFun()
                }else{                      //验证码登录
                    if(_this.isWeChat){
                        if(uid){
                            console.log("存在uid,微信中登录！")
                            _this.loginInWechat()
                        }else{
                            console.log("不存在uid,手机号登录")
                            _this.loginOutWechat()
                        }
                    }else{
                        console.log("微信外面登录！")
                        _this.loginOutWechat()
                    }
                }
            },
            forgetPwdDo:function(){
                var _this = this
                var _checkCodeUrl = '/daydaycook/server/user/validateCode.do?userName=' + _this.phoneVal + '&code=' + _this.codeVal

                if(!_this.rightPhone){
                    popMin.show("icon-yk_icon_warning","请填写正确的手机号")
                }else if(!_this.isgetCode){
                    popMin.show("icon-yk_icon_warning","请获取验证码")
                }else if(_this.isgetCode && !_this.rightCode){
                    popMin.show("icon-yk_icon_warning","请填写正确的验证码")
                }else{
                    this.ajaxDataFun('post', _checkCodeUrl, function(obj){
                        if(obj.code == '200'){
                            _this.forgetPwd = false
                            _this.resetPwd = true   //重新设置密码
                            _this.setPwd = true
                            _this.loginTxt = "确定"
                            _this.pageTitle = "重设密码"
                        }else if(obj.code == '406'){
                            popMin.show("icon-yk_icon_warning","验证码错误，请重新填写")
                        }else if(obj.code == '415'){
                            popMin.show("icon-yk_icon_warning","验证码过期，请重新获取")
                        }
                    })
                }
            },
            setPwdFun:function(){
                this.loginTxt = '登录中...'
                var _resPwdUrl = '';
                var _this = this
                var _regPass = /^[0-9A-Za-z]{6,20}$/

                if(this.resetPwd){
                    console.log("重新设置密码")
                    _resPwdUrl = '/daydaycook/server/user/retrievePassword.do?userName=' + this.phoneVal + '&password=' + _hex_md5(this.relPassword) + "&code=" + this.codeVal
                }else{
                    console.log("没有密码，设置密码")
                    _resPwdUrl = '/daydaycook/server/user/resetpwd.do?userName=' + this.phoneVal + '&password=' + _hex_md5(this.relPassword);
                }

                if(!this.relPassword){
                    popMin.show("icon-yk_icon_warning","请输入密码")
                    _this.loginTxt = '确定'
                }else if (!_regPass.test(this.relPassword)) {
                    popMin.show("icon-yk_icon_warning","密码格式错误（6-20位，字母，数字，区分大小写", "big")
                    _this.loginTxt = '确定'
                }else if(!this.relPasswordTwo){
                    popMin.show("icon-yk_icon_warning","请重复以上密码")
                    _this.loginTxt = '确定'
                }else if(this.relPassword != this.relPasswordTwo){
                    popMin.show("icon-yk_icon_warning","2次输入密码不同，请检查")
                    _this.loginTxt = '确定'
                }else{
                    this.ajaxDataFun('post', _resPwdUrl, function(obj){
                        if(obj.code == '200'){
                            if(_this.noPassword){
                                popMin.show("icon-yk_icon_success","登录密码设置成功")
                            }else{
                                popMin.show("icon-yk_icon_success","密码重设成功")
                            }
                            _this.loginPwdFun()
                        }
                    })
                }
                console.log('设置新密码')
            },
            loginPwdFun:function(){
                this.loginTxt = "登录中..."
                console.log('用密码登录...')
                var _this = this
                var _loginPwdUrl = '/daydaycook/server/user/login.do?userName=' + this.phoneVal + '&password=' + _hex_md5(this.password) + '&dynamicLogin=0&code='

                if(_this.resetPwd){
                    _loginPwdUrl = '/daydaycook/server/user/login.do?userName=' + this.phoneVal + '&password=' + _hex_md5(this.relPassword) + '&dynamicLogin=0&code='
                }

                if(!_this.rightPhone){
                    popMin.show("icon-yk_icon_warning","请填写正确的手机号")
                    _this.loginTxt = "登录"
                }else if(!this.password && !_this.resetPwd){
                    popMin.show("icon-yk_icon_warning","请填写密码")
                    _this.loginTxt = "登录"
                }else{
                    this.ajaxDataFun('post', _loginPwdUrl, function(obj){
                        if(obj.code == '200'){
                            _this.loginSuccess(obj.data,1)
                            console.log('密码登录成功')
                        }else if(obj.code == '405'){
                            _this.loginPwd = false
                            _this.password = ''
                            _this.loginTypeTxt = ''
                            _this.loginTxt = '登录'
                            popMin.show("icon-yk_icon_warning", "您还未设置登录密码，请先使用验证码登录", "big")
                        }else if(obj.code == '406'){
                            popMin.show("icon-yk_icon_warning", obj.msg)
                            _this.loginTxt = "登录"
                        }else if(obj.code == '408'){
                            popMin.show("icon-yk_icon_warning", obj.msg)
                            _this.loginTxt = "登录"
                        }
                    })
                }
            },
            loginInWechat:function(){  //微信里验证码登录
                console.log("微信里&验证码登录")
                var _this = this
                var uid = _this.$store.state.uid || localStorage.getItem('uid')

                if(_this.rightPhone && _this.rightCode){  //手机号正确 验证码正确
                    _this.loginTxt = "登录中..."
                    var _checkCodeUrl = '/daydaycook/server/user/validateCode.do?userName=' + _this.phoneVal + '&code=' + _this.codeVal

                    var _checkPhone = '/daydaycook/server/user/checkUserByPhone.do?phone=' + _this.phoneVal + '&uid=' + uid;

                    var _bindUrl = '/daydaycook/server/user/registeredByPhone.do?uid=' + uid + '&userName=' + _this.phoneVal + '&password=&type=' + _this.loginType

                    this.ajaxDataFun('post', _checkCodeUrl, function(obj){
                        if(obj.code == '200'){
                            _this.ajaxDataFun('post', _checkPhone, function(obj){
                                if(obj.code == '200' || obj.code == '414'){  //414 已注册未绑定 200未注册未绑定
                                    _this.ajaxDataFun('post', _bindUrl, function(obj){
                                        if(obj.code == '200'){
                                            _this.loginSuccess(obj.data)
                                        }else if(obj.code == '403'){
                                            _this.loginOutWechat()
                                        }
                                    })
                                }else if(obj.code == '405'){
                                    _this.setPwd = true
                                    _this.resetPwd = true
                                    _this.noPassword = true

                                    _this.loginTypeTxt = ''
                                    _this.pageTitle = '设置登录密码'
                                    _this.loginTxt = '确定'
                                }else if(obj.code == '201' || obj.code == '415'){
                                    //201当前登录用户不存在 415重复绑定
                                    _this.loginOutWechat()
                                }
                            })
                        }else if(obj.code == '406'){
                            popMin.show("icon-yk_icon_warning","验证码错误，请重新填写")
                            _this.loginTxt = "登录"
                        }else if(obj.code == '415'){
                            popMin.show("icon-yk_icon_warning","验证码过期，请重新获取")
                            _this.loginTxt = "登录"
                        }
                    })
                }else if(!_this.rightPhone){
                    popMin.show("icon-yk_icon_warning","请填写正确的手机号")
                    _this.loginTxt = "登录"
                }else if(!_this.isgetCode){
                    popMin.show("icon-yk_icon_warning","请获取验证码")
                    _this.loginTxt = "登录"
                }else if(_this.isgetCode && !_this.rightCode){
                    popMin.show("icon-yk_icon_warning","请填写正确的验证码")
                    _this.loginTxt = "登录"
                }
            },
            loginOutWechat:function(){  //微信外验证码登录
                console.log("微信外&验证码登录")
                var _this = this
                if(_this.rightPhone && _this.rightCode){  //手机号正确 验证码正确
                    _this.loginTxt = "登录中..."
                    var _loginUrl = "/daydaycook/server/user/login.do?dynamicLogin=1&userName=" + _this.phoneVal + "&code=" + _this.codeVal
                    this.ajaxDataFun('post',_loginUrl,function(obj){
                        if(obj.code == '200'){
                            _this.loginSuccess(obj.data,1)
                            _this.loginTxt = "登录"
                        }else if(obj.code == '405'){
                            _this.setPwd = true
                            _this.resetPwd = true
                            _this.noPassword = true
                            _this.loginTypeTxt = ''
                            _this.pageTitle = '设置登录密码'
                            _this.loginTxt = '确定'
                        }else if(obj.code == '406'){
                            popMin.show("icon-yk_icon_warning","验证码错误，请重新填写")
                            _this.loginTxt = "登录"
                        }else if(obj.code == '415'){
                            popMin.show("icon-yk_icon_warning","验证码已失效，请重新获取")
                            _this.loginTxt = "登录"
                        }
                    })
                }else if(!_this.rightPhone){
                    popMin.show("icon-yk_icon_warning","请填写正确的手机号")
                    _this.loginTxt = "登录"
                }else if(!_this.isgetCode){
                    popMin.show("icon-yk_icon_warning","请获取验证码")
                    _this.loginTxt = "登录"
                }else if(_this.isgetCode && !_this.rightCode){
                    popMin.show("icon-yk_icon_warning","请填写正确的验证码")
                    _this.loginTxt = "登录"
                }
            },
            loginSuccess:function(data,type){
                document.body.className = ''

                popMin.show("icon-yk_icon_success","登录成功")

                this.$store.state.uid = data.id
                localStorage.setItem('uid', data.id)

                this.$store.state.avar = data.image
                localStorage.setItem('avar', data.image)

                this.$store.state.nickName = data.nickName
                localStorage.setItem('nickName', data.nickName)

                this.$store.state.lineUserName = data.lineUserName
                localStorage.setItem('lineUserName', data.lineUserName)

                this.$store.state.phone = this.phoneVal
                localStorage.setItem('phone', this.phoneVal)

                localStorage.setItem('phoneBack', data.userName)

                this.$store.state.isShowLogin = false
                localStorage.setItem('isLogin', true)

                this.clearCountF()
                this.isMemberFun(data.id)

                this.getScore(data.id)

                this.reSend = false  //重置重新发送
                this.setPwd = false
                this.loginPwd = false  //用密码登录
                this.forgetPwd = false  //忘记密码
                this.resetPwd = false
                this.noPassword = false
                this.loginTxt = '登录'
                this.pageTitle = ''
                this.loginTypeTxt = '切换密码登录'

                this.phoneVal = ''
                this.codeVal = ''
                this.password = ''
                this.relPassword = ''
                this.relPasswordTwo = ''

                if(type){
                    if (this.$route.name == 'details') {
                        let params = {
                            that:this,
                            router: 'entrance',
                            title: '线下课程',
                        }
                        util.navTo(params);
                    } else {
                        window.location.reload()
                    }
                }
            },
            isMemberFun:function(id){
                var _this = this
                var _isMenberUrl = '/daydaycook/server/offline/reservationUser/isBuyCourse.do?uid=' + id
                this.ajaxDataFun('post',_isMenberUrl,function(obj){
                    if(obj.code == '200'){
                        _this.$store.state.isMember = obj.data
                        localStorage.setItem('isMember', obj.data)

                        localStorage.setItem('isLogin', true)
                        _this.$store.state.isLogin = true
                    }
                    console.log("_this.$store.state.isMember===" + _this.$store.state.isMember)
                    console.log("_this.$store.state.isMember===" + localStorage.getItem('isMember'))
                })
            },
            countDown: function(){  //倒计时函数
                var _this = this
                console.log("开始倒计时")
                if(_this.rightPhone){
                    _this.timeLeng--
                    if(_this.timeLeng <= 0){
                        _this.clearCountF()
                    }
                }
            },
            clearCountF:function(){
                var _this = this
                if(_this.timeInt){
                    clearInterval(_this.timeInt)
                    _this.timeLeng = 60
                    _this.timeInt = null
                    _this.beginCount = false
                    _this.reSend = true
                }
            },
            timefunc:function(){
                this.beginCount = true
                this.reSend = false
                this.timeInt = setInterval(this.countDown,1000)
            },
        },
        watch:{
            phoneVal:function(){
                let phonTest = (/^1[345789]\d{9}$/.test(this.phoneVal));
                if(phonTest){
                    this.rightPhone = true
                }else{
                    this.rightPhone = false
                }

            },
            codeVal:function(){
                if(this.codeVal.length == 4 && this.isgetCode){
                    this.rightCode = true
                }else{
                    this.rightCode = false
                }
            },
        },
        computed:{
            isActive:function(){
                if(this.forgetPwd){
                    if(this.rightPhone && this.rightCode){
                        return true
                    }else{
                        return false
                    }
                }

                if(this.setPwd){
                    if(this.relPassword && this.relPasswordTwo){
                        return true
                    }else{
                        return false
                    }
                }

                if(this.loginPwd){  //密码登录 验证手机跟密码
                    if(this.rightPhone && this.password){
                        return true
                    }else{
                        return false
                    }
                }

                if(!this.loginPwd){   //验证码登录或者找回密码验证手机跟code
                    if(this.rightPhone && this.rightCode){
                        return true
                    }else{
                        return false
                    }
                }
            }
        }
    }
</script>
