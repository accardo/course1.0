<template>
    <div id="container">
        <v-title>{{ pageTitle }}</v-title>
        <div id="loading" v-show="!showAll">
            <img src="../../assets/img/profile.png" alt="loading">
        </div>
        <div class="details">
            <div class="banner" style="text-align: center">
                <img :src="allData.imageUrl + '?x-oss-process=image/resize,w_640'" alt="banner" />
                <div class="tip" >
                    <span>{{ allData.cateAttr }}</span>
                </div>
            </div>
            <div class="infoBox">
                <div class="title">{{ allData.courseName }} </div>
                <div class="teacher"><span>{{ allData.teacherName }}</span></div>
                <p class="min">剩余名额
                    <span style="color:#000;">
                        {{ allData.surplusCount}}
                    </span> 人
                </p>
                <span class="minLine"></span>
                <p v-show="allData.reservationState != 12">{{ allData.startTime | formatTimeOne }}-{{ allData.endTime | formatTimeTwo }}</p>
                <p>{{ allData.address }} </p>
            </div>
            <div class="infoItem" v-html="allData.introduction"></div>
            <div class="exp-shop-bg">
                <button v-if="allData.reservationState == 0" class="active">敬请期待</button>
                <button v-if="allData.reservationState == 2" @click="reservationNow">立即预约</button>
                <button v-if="allData.reservationState == 4" class="active">预约已满</button>
                <button v-if="allData.reservationState == 5" class="active">即将开课，无法预约</button>
                <template v-if="isMember">
                    <button v-if="allData.reservationState == 3" class="active">目前无法预约该级别课程</button>
                    <button v-if="allData.reservationState == 6" class="active">超出同一时间预约课程数限制</button>
                    <button v-if="allData.reservationState == 1 && canMake == 1 && !cancel" class="active">即将开课，无法取消预约</button>
                    <button v-if="allData.reservationState == 1 && canMake == 0 && !cancel" @click="cancelNow">取消预约</button>
                    <button v-if="allData.reservationState == 1 && canMake == 2 && !cancel" class="active">已截止</button>
                    <button v-if="allData.reservationState == 2 && cancel" class="active">已取消</button>
                    <button v-if="allData.reservationState == 1 && cancel" class="active">预约成功</button>
                </template>
            </div>
            <div class="popBg" v-show="showNotMPop" @click="showNotMPop=false"></div>
            <div class="popRed" v-show="showNotMPop">
                <div class="img">
                    <img src="../../../static/img/tc_icon_yuyue.png" alt="" />
                </div>
                <div class="tip">您暂无法在线预约</div>
                <div class="des">
                    <p>课程名额有限，即刻联系门店进行预约！</p>
                    <a href="tel:11233455"></a>
                </div>
                <div class="button" @click="showNotMPop=false"><a style="color: #fff" :href="'tel:' + allData.addressPhone">联系门店</a></div>
                <div class="close icon-yk_btn_clear" @click="showNotMPop=false"></div>
            </div>

            <div class="popBg" v-show="RSuccess" @click="RSuccess = false"></div>
            <div class="popRed" v-show="RSuccess">
                <div class="img">
                    <img src="../../../static/img/tc_icon_yuyue.png" alt="" />
                </div>
                <div class="tip">确定预约课程吗？</div>
                <div class="des">
                    <p>开课时间：<br/>
                    {{ allData.startTime | formatTimeOne }}-{{ allData.endTime | formatTimeTwo }}
                    <br/>
                    <br/>
                    开课地点：<br/>
                    {{ allData.address}}
                </p>
                </div>
                <div class="button" @click="onRecommend">{{ recommendTxt }}</div>
                <div class="close icon-yk_btn_clear" @click="RSuccess = false"></div>
            </div>

            <div class="popBg" v-show="CSuccess" @click="CSuccess = false"></div>
            <div class="popRed" v-show="CSuccess">
                <div class="img">
                    <img src="../../../static/img/tc_icon_yuyue.png" alt="" />
                </div>
                <template v-if="allData.cancelCount < 3">
                    <div class="tip" >确定取消预约吗？</div>
                    <div class="des">
                        <p>您本月还有{{ 3 - allData.cancelCount }}次取消预约的机会！<br/> 课程名额灰常紧张！取消预约后课程 名额将留给其他人～</p>
                    </div>
                    <div class="button" @click="cancelRdF">{{ cancelTxt }}</div>
                </template>
                <template v-if="allData.cancelCount >= 3">
                    <div class="tip">无法取消预约</div>
                    <div class="des">
                        <p>您本月取消预约次数已用完，请按时来上课哦！如有特殊情况，请在开课前尽快联系店员～</p>
                    </div>
                    <div class="button" @click="CSuccess = false">知道了</div>
                </template>
                <div class="close icon-yk_btn_clear"  @click="CSuccess = false"></div>
            </div>
        </div>
        <loginLay v-show="needLogin"></loginLay>
    </div>
</template>
<script>
    import common from '@/components/common'
    import popMin from '@/components/popMin'
    import loginLay from '@/components/login'
    import VTitle from '@/components/title'
    export default {
        data () {
            return {
                pageTitle: '预约课程',
                id: '',
                uid: '',
                userUniqueId: '',
                phone: '',
                phoneBack: '',
                isMember: '',
                allData: '',
                showNotMPop: false,
                RSuccess: false, //预约成功
                CSuccess: false, //取消预约成功
                needLogin: false,
                cancelCount: '',
                showAll: false,
                chLen: 0,
                recommendTxt: '确定',
                cancelTxt: '确定',
                canMake: '',           //默认可以预约
                isHostUrl: '',
                contractId: '', // 合同id
                status: '',
                cancel: false, // 控制已取消
            }
        },
        mounted () {
            document.body.className = ''
            let y = localStorage.getItem('indexPageY')
            if(y){
                localStorage.setItem('newIndexPageY', y)
            }
            this.initDate();
        },
        components: {
            VTitle,
            loginLay,
        },
        methods: {
            initDate:function(){
                this.uid = this.$store.state.uid || localStorage.getItem('uid')
                this.userUniqueId = this.$store.state.userUniqueId || localStorage.getItem('userUniqueId')
                this.phone = localStorage.getItem('phone') || localStorage.getItem('phoneBack') || this.$store.state.phone
                this.isMember = localStorage.getItem('isMember');
                this.contractId = localStorage.getItem('contractId');

                // console.log("uid==" + this.uid)
                // console.log("phone==" + this.phone)
                // console.log("isMember==" + this.isMember)
                this.getCourseInfo();
            },
            getCourseInfo() {
                var _shareUrl = window.location.protocol + '//' + window.location.host  + '/course/index.html#/details?id=' + this.$route.query.courseId
                var _detailsUrl = `/daydaycook/server/offline/reservationUser/courseDetail.do?courseId=${this.$route.query.courseId}&mobile=${this.phone}&reservationState=${this.$route.query.state}&status=${this.status}`;
                console.log(_detailsUrl)
                this.ajaxDataFun('post', _detailsUrl , (obj) =>{
                    if(obj.code == '200'){
                        this.allData = obj.data
                        this.showAll = true;
                        /*his.chLen = obj.data.childs.length
                        this.pageTitle = obj.data.title
                        this.cancelCount = obj.data.cancelCount

                        this.endTime = obj.data.endDate;*/
                        this.isHost();
                       // common.wxShare(this.pageTitle, '日日煮线下美食课程预约', '',  _shareUrl)
                        common.wxShare('日日煮线下美食课程预约', '生活就要极致', '',  _shareUrl);
                        this.calcIfEnd();
                    }
                })
            },
            calcIfEnd(){
                //判断是否在预约时间内
                var getTimes = this.allData.startTime - (new Date().getTime());
                if(getTimes > 86400000){ // 24小时外
                    this.canMake = 0
                }else if (getTimes > 0 && getTimes < 86400000){ // 24小时内
                    this.canMake = 1;
                } else { // 已截止
                    this.canMake = 2;
                }
            },
            /*
             * Description: 立即预约
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/22
             */
            reservationNow() {
                if(!this.isLogin){
                    this.needLogin = true
                    return
                }
                console.log(!JSON.parse(this.isMember))
                if (this.contractId === null) {
                    this.showNotMPop = true
                } else {
                    this.RSuccess = true;
                }
            },
            /*
             * Description: 取消预约
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/22
             */
            cancelNow() {
              this.CSuccess = true;
            },
            onRecommend:function(){
                this.recommendTxt = '预约中...'
                var _RUrl = `/daydaycook/server/offline/reservationUser/save.do?offlineCourseId=${this.$route.query.courseId}&mobile=${this.phone}&uid=${this.uid}&userUniqueId=${this.userUniqueId}&contractId=${this.contractId}`;
                console.log(_RUrl, '立即预约')
                this.ajaxDataFun('post', _RUrl, (obj) => {
                    this.recommendTxt = '确定'
                    if(obj.code == '200'){
                        this.RSuccess = false;
                        this.$store.state.listLoaded = false;
                        popMin.show("icon-yk_icon_success","预约成功");
                        this.status = 'res';
                       // window.location.reload()
                        this.cancel = true;
                        this.getCourseInfo()
                    }else if(obj.code == '416'){
                        popMin.show("icon-yk_icon_warning","已预约,不能重复预约")
                        this.RSuccess = false
                    }else if(obj.code == '417'){
                        this.RSuccess = false
                        popMin.show("icon-yk_icon_warning","没有购买此课程或者课程次数已经用完")
                    }else if(obj.code == '414'){
                        window.location.reload()
                    }
                })
            },
            cancelRdF(){
                this.cancelTxt = '取消中...'
                var _canlUrl = `/daydaycook/server/offline/reservationUser/cancel.do?id=${this.$route.query.resId}&offlineCourseId=${this.$route.query.courseId}&mobile=${this.phone}&uid=${this.uid}&userUniqueId=${this.userUniqueId}`;
                console.log(_canlUrl);
                this.ajaxDataFun('post', _canlUrl, (obj) => {
                    if(obj.code == '200'){
                        this.$store.state.listLoaded = false
                        this.CSuccess =  false;
                        this.status = 'cancel';
                        this.cancel = true;
                        this.getCourseInfo()
                        this.cancelTxt = '确定'
                        popMin.show("icon-yk_icon_success","取消成功")
                    }else if(obj.code == '414'){
                        window.location.reload()
                    }
                })
            },
            // 判断正式环境 or 测试环境
            isHost() {
                let  host = window.location.host;
                this.isHostUrl = host.split('.')[0];
            }
        },
        computed: {
            isLogin:function(){
                return this.$store.state.isLogin || localStorage.getItem('isLogin')
            }
        },
        watch: {
            isLogin:function(){
                if(this.isLogin){
                   this.needLogin = false
                   this.initDate()
                }
            },
            '$route':function(to, from) {
                this.initDate()
            },
        },
        filters:{
            formatTimeOne:function(str){
                function setv(v){v = v < 10?'0' + v : v; return v; }
                var wstr = ''
                var v = new Date(str)
                var y = v.getFullYear()   //年
                var mt = v.getMonth() + 1 //上个月
                var d = v.getDate()      //天getDate.getDate()
                var h = v.getHours()
                var mn = v.getMinutes()

                var ww = v.getDay()
                if (ww == 0) {
                    wstr = "日";
                } else if (ww == 1) {
                    wstr = "一";
                } else if (ww == 2) {
                    wstr = "二";
                } else if (ww == 3) {
                    wstr = "三";
                } else if (ww == 4) {
                    wstr = "四";
                } else if (ww == 5) {
                    wstr = "五";
                } else if (ww == 6) {
                    wstr = "六";
                }
                return y + '年' + mt + '月' + d + '日 周' + wstr + ' ' + setv(h) + ':' + setv(mn)
            },
            formatTimeTwo:function(str){
                function setv(v){v = v < 10?'0' + v : v; return v; }
                var v = new Date(str)
                var h = v.getHours()
                var mn = v.getMinutes()
                return setv(h) + ':' + setv(mn)
            }
        }
    }
</script>
<style scoped>
    .gray{
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: grayscale(100%);
        filter: gray;
    }
    .details .infoBox {
        border-radius: 4px;
    }
    .details .infoBox .title {
        font-size: 20px;
    }
    .details button {
        background: linear-gradient(45deg, #393939 0%, #2F2F2F 100%);
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.20);
        border-radius: 100px;
        width: 232px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        position: fixed;
        z-index: 20;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 15px;
    }
    .details button.active {
        background: #CDCDCD;
        box-shadow: 0 2px 10px 0 rgba(126, 126, 126, 0.45);
        border-radius: 100px;
    }
    .popRed {
        background: #fff;
        border-radius: 8px;
    }
    .popRed .tip {
        color: #000;
        font-size: 16px;
    }
    .popRed .des, .popRed p {
        color: #474747;
        font-size: 14px;
    }
    .popRed .button {
        background-image: linear-gradient(45deg, #393939 0%, #2F2F2F 100%);
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.20);
        border-radius: 100px;
        color: #fff;
        font-size: 16px;
    }
    .popRed .img {
        padding: 0;
        -webkit-box-shadow: 0 3px 8px 0 rgba(255,82,105,0.30);
        box-shadow: 0 3px 8px 0 rgba(255,82,105,0.30);
    }
    .exp-shop-bg {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
        background: url("../../../static/img/bottombar_mengceng@3x.png") no-repeat;
        background-size: cover;
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-align-items: center;
        align-items: center;
    }
    .popRed .close {
        margin-right: -15px;
        bottom: -50px;
        right: 50%;
        top: auto;
    }
</style>
