<template>
    <div id="container">
        <v-title>{{ pageTitle }}</v-title>
        <div id="loading" v-show="!showAll">
            <img src="../../../static/img/profile.png" alt="loading">
        </div>
        <div class="details">
            <div class="banner">
                <img :src="allData.imageUrl + '?x-oss-process=image/resize,w_640'" alt="banner" />
                <div class="tip" v-if="chLen > 0">
                    <span v-for="item in allData.childs">{{ item.attributeName }}{{ allData.categoryName }}</span>
                </div>
                <div class="tip" v-if="chLen == 0">
                    <span>
                        {{ allData.categoryName }}
                    </span>
                </div>
            </div>
            <div class="infoBox">
                <div class="title">{{ allData.title }} </div>
                <div class="teacher"><span>{{ allData.teacherName }}</span></div>
                <p class="min">剩余名额
                    <span style="color:#000;">
                        {{ allData.totalCount - allData.reservationCount}}
                    </span> 人
                </p>
                <span class="minLine"></span>
                <p v-show="allData.reservationState != 12">{{ allData.startDate | formatTimeOne }}-{{ allData.endDate | formatTimeTwo }}</p>
                <p>{{ allData.addressName }} </p>
            </div>
            <div class="infoItem" v-html="allData.introduction"></div>
            <template v-if="!isMember && canMake">
                <div class="btButton active 1" v-if="!isLogin" @click="needLogin=true"> 立即预约 </div>
                <div class="btButton active 2" v-if="isLogin && allData.reservationState != 5" @click="showNotMPop=true">
                    立即预约
                </div>
                <div class="btButton" v-if="allData.reservationState == 5"> 预约已满 </div>
            </template>

            <template v-if="isMember && canMake">
                <div class="btButton active 3" v-if="allData.reservationState == 1" @click="RSuccess = true">
                    立即预约
                </div>
                <div class="btButton active 4" v-if="allData.reservationState == 9 || allData.reservationState == 11" @click="showNotMPop=true">
                    立即预约
                </div>
                <div class="btButton active 5" v-if="allData.reservationState == 7" @click="CSuccess=true">
                    取消预约
                </div>
                <div class="btButton 6" v-if="allData.reservationState == 5"> 预约已满 </div>
                <div class="btButton 7" v-if="allData.reservationState != 1 && allData.reservationState != 7 && allData.reservationState != 9 && allData.reservationState != 11" >
                    {{ allData.stateReason }}
                </div>
            </template>
            <template v-if="!canMake && reservationState == '1'">
                <div class="btButton active 3 gray">
                    即将开课，无法预约
                </div>
            </template>

            <div class="popBg" v-show="showNotMPop" @click="showNotMPop=false"></div>
            <div class="popRed" v-show="showNotMPop">
                <div class="img">
                    <img src="../../../static/img/clock.png" alt="" />
                </div>
                <div class="tip">无法预约</div>
                <div class="des">
                    <p>由于您还不具备预约资格，无法预约该课程，请拨打门店电话咨询哦！</p>
                    <!--正式 start-->
                        <p v-if="isHostUrl == 'mobile' && allData.addressId && allData.addressId == 4"><span style="font-size: 16px">上海K11体验店：</span><a href="tel:02163233279" class="call" style="color: #fff; font-size: 16px">021-63233279</a></p>
                        <p v-if="isHostUrl == 'mobile' && allData.addressId && allData.addressId == 6"><span style="font-size: 16px">广州K11体验店：</span><a href="tel:02088835253" class="call" style="color: #fff; font-size: 16px">020-88835253</a></p>
                    <!--正式 end-->
                    <!--测试 start-->
                        <p v-if="isHostUrl !== 'mobile' && allData.addressId == '103'"><span style="font-size: 16px">上海K11体验店：</span><a href="tel:02163233279" class="call" style="color: #fff; font-size: 16px">021-63233279</a></p>
                        <p v-if="isHostUrl !== 'mobile' && allData.addressId == '110'"><span style="font-size: 16px">广州K11体验店：</span><a href="tel:02088835253" class="call" style="color: #fff; font-size: 16px">020-88835253</a></p>
                    <!--测试 end-->
                </div>
                <div class="button" @click="showNotMPop=false">知道了</div>
                <div class="close icon-yk_btn_clear" @click="showNotMPop=false"></div>
            </div>

            <div class="popBg" v-show="RSuccess" @click="RSuccess = false"></div>
            <div class="popRed" v-show="RSuccess">
                <div class="img">
                    <img src="../../../static/img/clock.png" alt="" />
                </div>
                <div class="tip">确定预约课程吗？</div>
                <div class="des">
                    <p>开课时间：<br/>
                    {{ allData.startDate | formatTimeOne }}-{{ allData.endDate | formatTimeTwo }}
                    <br/>
                    <br/>
                    开课地点：<br/>
                    {{ allData.addressName}}
                </p>
                </div>
                <div class="button" @click="onRecommend">{{ recommendTxt }}</div>
                <div class="close icon-yk_btn_clear" @click="RSuccess = false"></div>
            </div>

            <div class="popBg" v-show="CSuccess" @click="CSuccess = false"></div>
            <div class="popRed" v-show="CSuccess">
                <div class="img">
                    <img src="../../../static/img/clock.png" alt="" />
                </div>
                <template v-if="cancelCount < 3">
                    <div class="tip" >确定取消预约吗？</div>
                    <div class="des">
                        <p>您本月还有{{ 3 - cancelCount }}次取消预约的机会！<br/> 课程名额灰常紧张！取消预约后课程 名额将留给其他人～</p>
                    </div>
                    <div class="button" @click="cancelRdF">{{ cancelTxt }}</div>
                </template>
                <template v-if="cancelCount >= 3">
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
                canMake:true,           //默认可以预约
                isHostUrl: ''

            }
        },
        created () {
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
                let locaUrl = window.location.href
                if(locaUrl.indexOf('id=') > -1){
                    this.id = common.getUrlPars(locaUrl).id
                }
                this.uid = this.$store.state.uid || localStorage.getItem('uid')
                this.phone = localStorage.getItem('phone') || localStorage.getItem('phoneBack') || this.$store.state.phone
                this.isMember = this.$store.state.isMember || localStorage.getItem('isMember')

                // console.log("uid==" + this.uid)
                // console.log("phone==" + this.phone)
                // console.log("isMember==" + this.isMember)
                this.getCourseInfo();
            },
            getCourseInfo:function(){
                var _this = this
                var _shareUrl = window.location.protocol + '//' + window.location.host  + '/course/index.html#/details?id=' + _this.id

                var _detailsUrl = '/daydaycook/server/offline/reservationUser/viewMyReservation.do?offlineCourseId=' +_this.id + '&mobile=' + _this.phone + '&uid=' + this.uid;
                this.ajaxDataFun('post', _detailsUrl ,function(obj){
                    if(obj.code == '200'){
                        _this.allData = obj.data
                        _this.chLen = obj.data.childs.length
                        _this.pageTitle = obj.data.title
                        _this.cancelCount = obj.data.cancelCount
                        _this.showAll = true;
                        _this.endTime = obj.data.endDate;
                        _this.isHost();
                       // common.wxShare(_this.pageTitle, '日日煮线下美食课程预约', '',  _shareUrl)
                        common.wxShare('日日煮线下美食课程预约', '生活就要极致', '',  _shareUrl);
                        _this.calcIfEnd();
                    }
                })
            },
            calcIfEnd(){
                //判断是否在预约时间内
                var _this = this;
                var count = 1;
                var timer = setInterval(function(){
                    count++;
                    if(count > 10){
                        clearInterval(timer)
                    }
                    var arr = common.transTime(_this.endTime-86400000);
                    var _time = arr[0]+'-'+arr[1]+'-'+arr[2]+' '+'20:00:00:00';
                    var date = new Date(_time);
                    var endTime = date.getTime();
                    var nowTime = +new Date();
                    // console.log(_time)
                    // console.log(common.transTime(_this.endTime))
                    if(nowTime > endTime && _this.reservationState == 1){
                        _this.canMake = false;
                        clearInterval(timer)
                    }
                },1000)
            },
            onRecommend:function(){
                if(!this.isLogin){
                    this.needLogin = true
                    return
                }
                this.recommendTxt = '预约中...'
                var _this = this
                var _RUrl = '/daydaycook/server/offline/reservationUser/save.do?offlineCourseId=' + this.id + '&mobile=' + this.phone + '&uid=' + this.uid;
                this.ajaxDataFun('post', _RUrl, function(obj){
                     _this.recommendTxt = '确定'
                    if(obj.code == '200'){
                        _this.RSuccess = false
                        _this.$store.state.listLoaded = false
                        popMin.show("icon-yk_icon_success","预约成功")
                        _this.getCourseInfo()
                    }else if(obj.code == '416'){
                        popMin.show("icon-yk_icon_warning","已预约,不能重复预约")
                        _this.RSuccess = false
                    }else if(obj.code == '417'){
                        _this.RSuccess = false
                        popMin.show("icon-yk_icon_warning","没有购买此课程或者课程次数已经用完")
                    }else if(obj.code == '414'){
                        window.location.reload()
                    }
                })
            },
            cancelRdF:function(){
                this.cancelTxt = '取消中...'
                var _this = this
                var _canlUrl = '/daydaycook/server/offline/reservationUser/cancel.do?id=' + _this.allData.reservationId + '&offlineCourseId=' + _this.id + "&mobile=" + this.phone + '&uid=' + this.uid
                this.ajaxDataFun('post', _canlUrl, function(obj){
                    if(obj.code == '200'){
                        _this.$store.state.listLoaded = false
                        _this.CSuccess =  false
                        _this.getCourseInfo()
                        _this.cancelTxt = '确定'
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
        mounted (){
            document.body.className = ''
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
</style>
