<template>
    <div id="container">
        <v-title>{{ pageTitle }}</v-title>
        <div class="member justify">
            <div class="top box">
                <div class="avar">
                    <img v-if="avar && avar != 'null'" :src="avar" />
                    <img v-if="!avar || avar == 'null'" src="../../../static/img/default.png" />
                </div>
                <div class="name inline">
                    <p v-if="lineUserName != 'null'">{{ lineUserName }}</p>
                    <p v-if="lineUserName == 'null'">{{ nickName }}</p>
                    <div class="not">普通用户</div>
                   <!-- <div class="not"> 您尚未购买课程，暂无约课权限</div>-->
                </div>
            </div>
            <div class="login-out"  v-if="!isApp" @click="loginOutShow = true">登出</div>
        </div>
        <div class="notMemner" v-html="notMemberData"></div>
        <login-out :login-out-show.sync="loginOutShow" v-if="loginOutShow"></login-out>
       <!-- <footerLay v-bind:position="position"></footerLay>-->
    </div>
</template>

<script>
    import VTitle from '@/components/title'
    /*import footerLay from '@/components/footer'*/
    import loginOut from '@/components/loginOut'
    import * as util from '@/utils/utils.js'

    export default {
        data () {
            return {
                pageTitle: '个人中心',
                nickName: '',
                lineUserName: '',
                avar: '',
                position: 2,
                notMemberData: '',
                loginOutShow: false,
                isApp: localStorage.getItem('isApp') || false,
            }
        },
        mounted () {
            this.$nextTick(() => {
                let isMember = this.$store.state.isMember || localStorage.getItem('isMember')
                if(isMember == true || isMember == 'true'){
                    let params = {
                        that: this,
                        router: 'member',
                        title: '个人中心',
                    }
                    util.navTo(params);
                } else {
                    this.noMemner();
                }
                this.avar = this.$store.state.avar || localStorage.getItem('avar')
                this.nickName = this.$store.state.nickName || localStorage.getItem('nickName') || '游客'
                this.lineUserName = this.$store.state.lineUserName || localStorage.getItem('lineUserName')
            })

        },
        components: {
            VTitle,
         /*   footerLay,*/
            loginOut
        },
        methods: {
            /*
            * 不是会员用户显示
            * */
            noMemner() {
                var noMemnerUrl = '/daydaycook/server/offline/address/courseIntroduce.do';
                this.ajaxDataFun('post', noMemnerUrl , (obj) => {
                    if (obj.code == '200') {
                        this.notMemberData = obj.data;
                    }
                })
            },
        }
    }
</script>
<style scoped>
    .member {
        background: url("../../../static/img/grzx_pic_bg.jpg") no-repeat;
        background-size: cover;
    }
    .member .top .name .not {
        font-size: 16px;
        opacity: 1;
    }
    .login-out {
        width: 68px;
        height: 26px;
        background: rgba(255,255,255,0.3);
        display: inline-block;
        font-size: 14px;
        color: #fff;
        text-align: center;
        box-shadow: 0 1px 10px 0 rgba(0,0,0,0.05);
        border-radius: 100px;
        line-height: 26px;
        margin-right: 10px;
        margin-bottom: 15px;
    }
</style>
