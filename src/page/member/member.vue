<template>
   <div id="container">
       <v-title>{{ pageTitle }}</v-title>
       <div class="member justify">
           <div class="top box">
                <div @click="myInfo">
                    <div class="avar">
                       <img v-if="avar && avar != 'null'" :src="avar" />
                       <img v-if="!avar || avar == 'null'" :src="imgIcon.img_1" />
                    </div>
                    <div class="name">
                     <p v-if="lineUserName != 'null'">{{ lineUserName }}</p>
                     <p v-if="lineUserName == 'null'">{{ nickName }}</p>
                     <div class="not">课程会员</div>
                    </div>
                </div>
           </div>
           <div class="login-out" @click="loginOutShow = true">登出</div>
       </div>
       <div class="swiper-box">
           <swiper-banner v-if="isshwoSwiper" :swipelist="swipelist" :param="bannerParam"></swiper-banner>
       </div>
       <div class="make-appointment">
           <h4>我的预约</h4>
           <div class="make-list">
               <class-list :list-data="listData" :list-type="listType"></class-list>
           </div>
       </div>
       <div class="popNotWrap">
           <img :src="imgIcon.img_2"  alt="" />
           <p>还没有预约过课程，快去瞅瞅吧</p>
       </div>
       <login-out :login-out-show.sync="loginOutShow" v-if="loginOutShow"></login-out>
       <!--<footerLay v-bind:position="position"></footerLay>-->
   </div>
</template>

<script>
    import footerLay from '@/components/footer'
    import common from '@/components/common'
    import listLay from '../home/list'
    // import reserveList from './reserveList'
    import VTitle from '@/components/title'
    import swiperBanner from '@/components/swiper'
    import classList from '@/components/classlist'
    import loginOut from '@/components/loginOut'
    import * as util from '@/utils/utils.js'

    export default {
        data () {
            return {
                pageTitle: '个人中心',
                uid: localStorage.getItem('uid'),
                avar: '',
                phone: localStorage.getItem('phone'),
                nickName: localStorage.getItem('nickName'),
                lineUserName: localStorage.getItem('lineUserName'),
                unreadCount: '',
                currentPage: 1,
                isHaveContract: '',
                loginOutShow: false,
                endListen: false,
                position:2,
                contractEndTime: '', // 到期日期
                bannerParam:{           //banner swiper 配置
                    auto: false,
                    swiperId:'aboutbanner',
                    showText:false,
                    delay:5000,
                    switchOpen: 2,
                    isAutoFalse: true,
                },
                swipelist: [],
                isshwoSwiper:false,
                listType: 2, // 2 -> mermber页面
                listData: [],
                imgIcon: {
                    img_1: './static/img/default.png',
                    img_2: './static/img/not_1.png'
                }
            }
        },
        mounted () {
            let isMember = this.$store.state.isMember || localStorage.getItem('isMember')
            if(isMember == true || isMember == 'true'){
                this.initUserInfo();
                this.getContPackage();
            }else{
                let params = {
                    that: this,
                    router: 'notMember',
                    title: '个人中心',
                }
                util.navTo(params);
            }
        },
        components: {
        	listLay,
        	common,
        	VTitle,
        	// reserveList,
        	footerLay,
            swiperBanner,
            classList,
            loginOut
        },
        methods: {
            /**
             * Description: 我得预约
             * Author: yanlichen <lichen.yan@daydaycook.com>
             * Date: 2018/5/16
             */
            getPersonalResList() {
                let infoUrl = `/daydaycook/server/offline/reservationUser/personalResList.do?mobile=${this.phone}`;
                return new Promise((resolve) => {
                    this.ajaxDataFun('post', infoUrl, (obj) => {
                        if(obj.code == '200'){
                            return resolve(obj);
                        }
                    });
                });
            },
        	initUserInfo(){
                this.getPersonalResList().then((res) => {
                    if (res.code == '200') {
                        this.listData = res.data;
                    }
                })
        	},
            /*
            * Description: 套餐合同
            * Author: yanlichen <lichen.yan@daydaycook.com.cn>
            * Date: 2018/8/22
            */
            getContPackage() {
                let packageUrl = `/daydaycook/server/newCourse/getContractPackageInfoByUid.do?uid=${this.uid}`;
                console.log(packageUrl)
                this.ajaxDataFun('post', packageUrl, (obj) => {
                    if(obj.code==200){
                        this.swipelist = obj.list;
                        this.isshwoSwiper = true;
                    }
                })
            },
            /*
             * Description: 跳转
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/28
             */
            myInfo() {
                let params = {
                    that: this,
                    router: 'myInfo',
                    title: '我的资料',
                }
                util.navTo(params);
            }
        },
        watch:{
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
    .member .top .name p {
        margin-bottom: 0;
    }
    .make-appointment {
        margin: 20px;
    }
    .make-appointment h4{
        padding: 16px 0 14px 0;
        font-size: 22px;
        color: #1a1a1a;
        font-weight: 100;
    }
    .make-list {

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
