<template>
    <div id="container">
        <v-title>{{ pageTitle }}</v-title>
        <div id="loading" v-show="!showAll">
            <img src="../../../static/img/profile.png" alt="loading">
        </div>
        <article class="entrance">
            <section class="entrance-user">
                <img :src="userInfo.userHeader" alt="">
                <dl v-if="userLogin=='true'">
                    <dt>{{userInfo.lineUserName}}</dt>
                    <dd v-if="userInfo.buyCourseNum" >剩余<strong>{{userInfo.buyCourseNum}}</strong>次可预约，{{userInfo.endtime}}到期</dd>
                    <dd v-else>您尚未购买课程，暂无约课权限</dd>
                </dl>
                <div v-else @click="showLogin" class="nologin">点击登录</div>
            </section>
            <!-- 最近预约 -->
            <section class="entrance-bespoke" v-if="isShowMake">
                <div class="lately-bespoke">
                    <span>最近预约</span>
                    <p><span>{{courseData.addressName}}</span><span> | {{courseData.teacherName}}</span></p>
                </div>
                <div class="bespoke-time">
                    <img class="bespoke-img"  :src="courseData.imageUrl" alt="">
                    <dl>
                        <dt class="one-line">{{courseData.courseName}}</dt>
                        <dd>{{courseData.startTime}}-{{courseData.endTime}}</dd>
                    </dl>
                </div>
                <img class="bespoke-bg" src="../../../static/img/pic_bear1_1.png" alt="">
            </section>
            <!-- 最新课程 -->
            <section class="entrance-model" v-if="coursesData && coursesData.length > 0">
                <div class="entrance-tit">
                    <strong>最新课程</strong>
                    <router-link to="/" tag="span"> 查看更多 </router-link>
                </div>
                <div class="lesson-list">
                    <!-- <class-list :list-data="listData1" :list-type="listType"></class-list> -->
                    <div class="lesson-item" v-for="(item,index) in coursesData" :key="index">
                        <div class="lesson-img">
                            <img :src="item.courseImage" alt="">
                            <span>{{item.courseCategoryName}}</span>
                        </div>
                        <div class="lesson-info">
                            <p class="tit two-line">{{item.courseTitle}}</p>
                            <p class="lesson-p">{{item.startTime}}</p>
                            <p class="lesson-p">{{item.courseTeacherName }} | 剩余名额<strong>{{item.courseReservationCount}}</strong>人</p>
                        </div>
                    </div>
                </div>
            </section>
            <!-- 门店导航 -->
            <section class="entrance-model" v-if="shopList.length > 0">
                <div class="entrance-tit">
                    <strong>门店导航</strong>
                </div>
                <div class="store-list">
                    <div class="lesson-item" v-for="(item,index) in shopList" :key="index">
                        <router-link :to="{ name: 'expShop' }">
                            <div class="lesson-img">
                                <img :src="item.image" alt="">
                            </div>
                            <div class="store-info lesson-info">
                                <p class="tit one-line" >{{item.name}}</p>
                                <p class="lesson-p two-line">{{item.address}}</p>
                            </div>
                        </router-link>
                    </div>
                </div>
            </section>
            <!-- 关于我们 -->
            <section class="entrance-about">
                <div class="entrance-tit">
                    <strong>关于我们</strong>
                </div>
                <div class="swiper-box">
                    <swiper-banner :swipelist="swipeList" :param = "bannerParam"></swiper-banner>
                </div>
               <div class="about-txt">
                    <p>在日日煮美食生活体验馆</p>
                    <p>我们和你通过厨艺课程</p>
                    <p class="mb20">一起持续、专注地探索和发现一切与美食相关的乐趣</p>
                    <p>让“吃“相关的一切感官体验得到淋漓极致的享受</p>
                    <p>一起将美味传递给更多人的同时</p>
                    <p>也带来与众不同的生活方式和乐趣</p>
                    <p class="mb50">辐射每一个平凡而闪亮的人</p>
               </div>
            </section>
        </article>
        <div  id="map_gaode"></div>
        <!-- 登录 -->
        <login-lay v-show="isShowLogin"></login-lay>
    </div>
</template>

<script>
    import common from '@/components/common';
    import VTitle from '@/components/title'
    import swiperBanner from '@/components/swiper'
    import LoginLay from '@/components/login'
    import AMap from 'AMap'
    import classList from '@/components/classlist'
    import * as util from '@/utils/utils.js'

    export default {
        name:'entrance',
        data () {
            return {
                pageTitle:'线下课程',
                currentPage: 1,
                uid: '',
                isShowLogin:'', //是否显示登录弹窗
                isShowMake:'',  //是否显示预约 课程
                showAll:false,
                userLogin:'',     //是否登录
                userInfo:{
                    userHeader:'../../../static/img/pic_touxiang.png',//用户头像 未登录
                    userphone:'', //用户手机号
                    lineUserName:'',
                    buyCourseNum:0,
                },    //用户信息
                courseData:{},      //最近预约课程信息
                positionData:'',     //用户 gps 地址
                getTimeArray:util.formatTimeArray(),    
                bannerParam:{           //banner swiper 配置
                    auto:false,
                    swiperId:'aboutbanner',
                    showText:false,
                    delay:5000,
                    switchOpen: 1,
                },
                shopList:[],        //店铺信息
                coursesData:[],     //最新课程
                swipeList: [
                    {
                        id:1,
                        imageUrl:'../../../static/img/pic_aboutus1.jpg',
                        pageId:1,
                    },
                    {
                        id:2,
                        imageUrl:'../../../static/img/pic_aboutus2.jpg',
                        pageId:2,
                    },
                    {
                        id:3,
                        imageUrl:'../../../static/img/pic_aboutus3.jpg',
                        pageId:3,
                    },
                    {
                        id:4,
                        imageUrl:'../../../static/img/pic_aboutus4.jpg',
                        pageId:4,
                    },
                    {
                        id:5,
                        imageUrl:'../../../static/img/pic_aboutus5.jpg',
                        pageId:5,
                    },
                    {
                        id:6,
                        imageUrl:'../../../static/img/pic_aboutus6.jpg',
                        pageId:6,
                    }
                ],
                listType: 1, //
            }
        },
        created(){
            this.init();
            this.getUserGps();
        },
        methods:{
            /* 初始化 */
            init(){
                let self = this;
                if(typeof ddcApp == 'object'){
                    //如果在app内 显示分享按钮
                    ddcApp.shareBtn({
                        title:'线下课程',
                        desc:'线下课程分享信息描述',
                        imgUrl:'https://mobile.daydaycook.com.cn/logo.png',
                        linkUrl:window.location.href
                    });
                    self.showAll = true;
                }else{
                    self.userLogin = self.$store.state.isLogin || localStorage.getItem('isLogin');    //用户是否登录
                    if(self.userLogin == 'true' || self.userLogin == true){
                        // 如果用户已登录    获取用户信息
                        self.uid = localStorage.getItem('uid') || self.$store.state.uid;
                        self.userphone = localStorage.getItem('phone') || self.$store.state.phone;
                        self.getUserByUid(self.uid).then(res => {
                            console.log('获取的用户信息',res);
                            self.userInfo['userHeader'] = res.img ? res.img : '../../../static/img/profile.png';
                            self.userInfo['lineUserName'] = res.lineUserName;
                            self.userInfo['buyCourseNum'] = res.refundCount;
                            let endtime = res.endTime ? self.getTimeArray(res.endTime) : '';
                            self.userInfo.endtime = endtime ? `${endtime[0]}/${endtime[1]}/${endtime[2]}` : '';
                        })
                        self.getLastCourseByuid(self.userphone);
                    }
                }
                self.showAll = true;
                self.getShopInfoByUid();
            },

            /* 获取用户gps */
            getUserGps(){
                let self =this;
                let map = new AMap.Map("map_gaode", {
                    resizeEnable: true,
                    center: [121.439106,31.188968],// 地图中心点
                    zoom: 13 // 地图显示的缩放级别
                });
                map.plugin('AMap.Geolocation', function() {
                   let geolocation = new AMap.Geolocation({
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        buttonPosition:'RB'
                    });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition();
                    //返回定位信息
                    AMap.event.addListener(geolocation, 'complete', function(data){
                        if(data.position){
                            self.positionData =  data.position.O +','+data.position.P;
                            self.getCourseList(self.positionData);
                        }
                    });
                });
            },

            /* 根据用户uid 获取用户信息 */
            getUserByUid(uid){
                let infoUrl = `/daydaycook/server/contract/userInfo.do?uid=${uid}`;
                return new Promise((resolve,reject) => {
                    this.ajaxDataFun('post', infoUrl, (obj) => {
                        if(obj.code == '200'){
                            resolve(obj.userContract);
                        }else{
                            this.showAll = true;
                            this.userLogin = false;
                        }
                    });
                });
            },

            // 获取最近预约课程
            getLastCourseByuid(userphone){
                let self = this;
                let _listUrl = '/daydaycook/server/offline/reservationUser/theLastTimeRes.do?mobile='+userphone;
                this.ajaxDataFun('get',_listUrl, function(res){
                    if(res.code =='200'){
                        self.courseData = res.data;
                        self.courseData['startTime'] = res.data.startTime ? util.formatTime(res.data.startTime) : '';
                        self.courseData['endTime'] = res.data.endTime ? util.formatTimeTwo(res.data.endTime) : '';
                        self.isShowMake = true;
                    }
                })
            },

            /* 根据Uid 获取店铺信息 */
            getShopInfoByUid(){
                let self = this;
                let _listUrl = '/daydaycook/server/newCourse/getAddressInfoByUid.do?uid='+ self.uis;
                this.ajaxDataFun('get',_listUrl, function(res){
                    if(res &&  res.code =='200'){
                        let listdata = res.list;
                        self.shopList = listdata;
                    }
                })
            },

            /* 显示登录弹窗 */
            showLogin(){
                this.isShowLogin =!this.userLogin;
            },

            /* 获取课程列表 */
            getCourseList(gps){
                let self = this;
                var _listUrl = '/daydaycook/server/newCourse/getAddressCourseInfo.do?uid=' + this.uid + '&gps='+gps;
                this.ajaxDataFun('post', _listUrl, function(obj){
                    if(obj.code == '200'){
                        if(obj.list && obj.list.length >0){
                            let coursesList =  obj.list;
                            coursesList.map(item => {
                                item.startTime = item.courseStartTime ? util.formatTime(item.courseStartTime) : '';
                            })
                            self.coursesData =  coursesList;
                        }
                    }
                })
            }
        },
        components: {
        	common,
            VTitle,
            swiperBanner,
            LoginLay,
            classList,
        },
    }
</script>
<style scoped>
    a{
        display: inherit;
    }
   .entrance{
       width: 100%;
       height: auto;
       min-height: 100%;
   }
   .entrance-user{
       display:flex;
       padding: 30px 20px 10px;
       flex-wrap: nowrap;
       align-items: center;
       box-sizing: border-box;
       width: 100%;

   }
   .entrance-user > img{
       display: inline-block;
       width: 50px;
       height: 50px;
       border-radius: 50%;
       margin-right: 10px;
       border:1px solid #fff;
       box-shadow:  0px 7px 5px rgba(148,148,148,0.2);
   }
   .entrance-user > dl > dt{
       font-size: 16px;
       font-weight: bold;
       color: #1a1a1a;
   }
   .entrance-user > dl > dd{
       font-size: 12px;
       color: #a5a4a4;
   }
   .entrance-user strong{
       color: #1a1a1a;
   }
   .entrance-user.no-user dl{
       display: none;
    }
    .entrance-user.no-user .nologin{
      font-size: 16px;
      color: #1a1a1a;
      font-weight: bold;
    }
   .entrance-bespoke{
       margin: 20px 20px 10px;
       position: relative;
       background-image: linear-gradient(43deg,#FFB179 0%, #FF6580 100%);
       border-radius: 8px;
       padding: 10px;
       -webkit-box-shadow:1px 10px 15px rgba(255,177,121,.3);
       box-shadow:1px 10px 15px rgba(255,177,121,.3);
   }
   .entrance-bespoke .bespoke-bg{
       position: absolute;
       right: 0;
       bottom: 0;
       width: 23%;
       max-width: 85px;
   }
   .lately-bespoke{
       display: flex;
       margin-bottom: 10px;
       justify-content: space-between;
   }
   .lately-bespoke span{
       color: #fff;
       font-size: 12px;
       font-weight: 600;
   }

   .bespoke-time{
       display: flex;
       justify-content: space-between;
       align-items: center;
   }
   .bespoke-time .bespoke-img{
       width: 70px;
       height: 40px;
       border-radius: 2px;
       margin-right: 10px;
   }

   .bespoke-time dl{
       flex: 2;
       margin-right: 20px;
       overflow: hidden;
   }
   .bespoke-time dt{
       font-size: 14px;
       font-weight: bold;
       color: #fff;
   }
   .bespoke-time dd{
       font-size: 12px;
       color: #fff;
       opacity: .8;
   }
   .entrance-model{
       padding: 20px 20px 0;
       box-sizing: border-box;

   }
   .entrance-tit{
       display: flex;
       justify-content: space-between;
       flex-wrap: nowrap;
       padding-bottom: 10px;
       box-sizing: border-box;
       align-items: flex-end;
   }
   .entrance-tit > strong{
       font-size: 24px;
       color: #000;
   }
   .entrance-tit > span{
       font-size: 12px;
       padding-right: 8px;
       color:#A5A4A4;
       background: url('../../../static/img/icon_arrow.png') no-repeat right center;
       background-size: 4px 8px;
   }
   .lesson-item{
       display: flex;
       margin-bottom: 10px;
       flex-wrap: nowrap;
       align-items: center;
   }
   .lesson-img{
       position: relative;
       width: 150px;
       margin-right: 10px;
   }
   .layer-box{
       position: absolute;
       left: 0;
       top: 0;
       bottom: 0;
       right: 0;
       background-color: rgba(0,0,0,1);
       opacity: 0;
       z-index: 11;
       transition: all .3s ease-in-out;
   }

   .lesson-img > img{
       display: inline-block;
       box-shadow: 1px 2px 3px rgba(0,0,0,.12);
   }
   .lesson-img > span{
       position: absolute;
       display: inline-block;
       padding:3px;
       top:4px;
       right: 4px;
       transform: scale(.8);
       box-sizing: border-box;
       background-color: #000;
       font-size: 12px;
       color: #fff;
       border-radius: 3px;
       z-index: 10;
   }
   .lesson-info{
       flex: 2;
       overflow: hidden;
   }
   .lesson-info .tit{
       font-size: 16px;
       line-height: 20px;
       margin-bottom: 5px;
       color: #000;
   }
   .lesson-info .lesson-p{
       font-size: 12px;
       color: #a5a4a4;
       box-sizing: border-box;
   }
   .entrance-about .entrance-tit{
       padding: 20px 20px 10px;
       box-sizing: border-box;
   }
   .entrance-about .about-txt{
       margin: 0 20px;
   }

   .about-txt > p{
       font-size: 14px;
       color: #474747;
       letter-spacing: -0.2px;
       line-height: 22px;
   }

   .swiper-box{
        margin:10px 0 20px;
        width: 100%;
    }
   .mb20{
       margin-bottom: 20px;
   }
   .mb50{
       margin-bottom: 50px;
   }

   .one-line {
        white-space: nowrap;
        -webkit-text-overflow: ellipsis;
        -moz-text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .two-line {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /*! autoprefixer: on */
    }
</style>
