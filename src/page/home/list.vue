<template>
     <div id="mescroll" :class="scrollY ?  'courseList mescroll' : 'courseList mescroll mescroll-top'" >
         <div id="dataList">
            <div class="courseItem" v-for="item in listData">
                <div class="list-img" @click="details(item.courseId, item.reservationState, item.resId)">
                    <div style="text-align: center">
                        <img :src="item.imageUrl + '?x-oss-process=image/resize,w_640'" alt="">
                    </div>
                    <div class="tip">
                        <span>{{ item.cateAttr }}</span>
                    </div>
                    <div class="list-content">
                        <div class="list-button">
                            <strong>{{item.courseName}}</strong>
                            <div class="list-time">{{item.startTime | formatTimeOne }} - {{ item.endTime | formatTimeTwo}}</div>
                            <div class="list-teacher">{{item.teacherName}}老师 |
                                <template v-if="item.reservationState == 2 || item.reservationState === 1 || item.reservationState == 4">
                                    剩余名额<b>{{item.surplusCount}}</b>人
                                </template>
                                <template v-else-if="item.reservationState == 0">
                                    暂未开放预约
                                </template>
                                <template v-else-if="item.reservationState == 1">
                                    不可预约
                                </template>
                                <template v-else-if="item.reservationState == 3">
                                    未满足预约条件
                                </template>
                                <template v-else-if="item.reservationState == 5">
                                    已超过预约截止时间
                                </template>
                                <template v-else-if="item.reservationState == 6">
                                    超出同一时间预约课程数限制
                                </template>
                            </div>
                        </div>
                        <div>
                            <button v-if="item.reservationState === 0" class="list-disabled">敬请期待</button>
                            <button v-if="item.reservationState === 1">查看</button>
                            <button v-if="item.reservationState === 2">预约</button>
                            <button v-if="item.reservationState === 3 || item.reservationState === 4 || item.reservationState === 6"
                                    class="list-disabled"
                            >预约</button>
                            <button v-if="item.reservationState === 5" class="list-disabled">已截止</button>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    </div>
</template>

<script>
    import common from '@/components/common.js'
    //引入mescroll.min.js和mescroll.min.css
    import MeScroll from 'mescroll.js'
    import 'mescroll.js/mescroll.min.css'
    import popMin from '@/components/popMin'
    import * as util from '@/utils/utils.js'

    export default {
        props: {
            getData: {
                type: Object,
                default: {}
            },
            isRefresh: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                pageTitle: '首页列表',
                listData: [],
                mescroll: null, //mescroll实例对象
                scrollY:0,  //滚动的距离
            }
        },
        mounted () {
            //创建MeScroll对象
            this.mescroll = new MeScroll("mescroll", { //在vue的mounted生命周期初始化mescroll,确保此处配置的id能够被找到
                up: {
                    callback: this.upCallback,
                    isBounce: false,
                    auto: true,
                    onScroll: (mescroll, y, isUp) => {
                        this.scrollY = y > 44;
                        this.$emit('scroll-y', y);
                    },
                    empty: {
                        warpId: "dataList",
                        //列表第一页无任何数据时,显示的空提示布局; 需配置warpId或clearEmptyId才生效;
                        icon: './static/img/not_1.png',
                        tip: "咦!?找不到哎!!!", //提示
                    },
                    htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中...</p>',
                    htmlNodata: '<p class="upwarp-nodata">-- 我也是有底线的 --</p>', //无数据的布局
                }
             });
            this.mescroll.lockDownScroll(true);
        },
        components: {
        },
        methods: {
            upCallback(page) {
                let _listUrl = `/daydaycook/server/offline/reservationUser/offlineCourseList.do?timeScope=${this.getData.filterSubData.timeScope}&reservationType=${this.getData.filterSubData.reservationType || 0}&categoryId=${this.getData.filterSubData.categoryId}&mobile=${this.getData.phone}&uid=${this.getData.uid || ''}&userUniqueId=${this.getData.userUniqueId}&addressId=${this.getData.addressId}&contractId=${this.getData.contractId}&teacherId=${this.getData.filterSubData.teacherId}&pageSize=${page.size = 7}&currentPage=${page.num}`;
                console.log(_listUrl, '子层')
                this.ajaxDataFun('post', _listUrl, (res) => {
                    if(res.code == '200') {
                       // if(res.data && res.data.length >0){
                            if (page.num == 1) this.listData = [];
                            this.listData = this.listData.concat(res.data != null ? res.data : []);
                            this.$emit('update:isRefresh', false);
                            this.$nextTick(() => {
                                this.mescroll.endSuccess(res.data.length);
                            })
                          //  this.$emit('isshowfun',true);
                       // }
                        //else{
                           // this.$emit('isshowfun',false);
                          //  this.mescroll.endErr();
                       // }
                        console.log(res.data, 'upCallback');
                    } else if(res.code == '911') {
                        popMin.show("icon-yk_icon_warning",res.msg);
                        localStorage.removeItem('contractId')
                        localStorage.removeItem('getData')
                        window.location.reload();
                    }

                })
            },
            details(cId, rState, rId) {
                let params = {
                     that:this,
                     router: 'details',
                     title: '课程详情',
                     query: {
                        courseId: cId,
                        state: rState,
                        resId: rId
                    }
                }
                util.navTo(params);
            }
        },
        watch: {
            isRefresh(val) {
                console.log(val, '加载...')
                if (val) {
                    this.mescroll.resetUpScroll(true);
                }
            }
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
                // var w = v.getDay()      //天getDate.getDate()
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
    .courseItem .title {
        font-size: 20px;
    }
    .courseItem .info {
        padding-top: 10px;
    }
    .courseItem .info p {
        color: #A5A4A4;
    }
    .courseItem .button {
        width: 76px;
    }
    .courseItem .button.active {
        background-image: linear-gradient(45deg, #393939 0%, #2F2F2F 100%);
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.20);
        border-radius: 100px;
        color: #fff;
        border: none;
    }
    .list-content{
        display: flex;
        display: -webkit-flex;
        padding: 2px 14px 0;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        -webkit-align-items: center;
        align-items: center;
        position: relative;
    }
    .list-content .list-time, .list-teacher {
        font-size: 12px;
        color: #A5A4A4;
    }
    .list-teacher b{
        color: #000;
        font-size: 14px;
        padding: 0 2px;
    }

    .list-content strong {
        display: block;
        font-size: 16px;
        color: #000;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .list-content .list-button {
        width: 70%;
    }
    .list-content div:last-of-type button {
        padding: 4px 20px;
        background-image: linear-gradient(45deg, #393939 0%, #2F2F2F 100%);
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.20);
        border-radius: 100px;
        font-size: 14px;
        color: #FFFFFF;
        text-align: center;
    }
    .list-content div:last-of-type button.list-disabled {
        background: #C4C4C4;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
        border-radius: 100px;
    }
    .tip {
        position: absolute;
        right: 10px;
        top: 10px;
    }
    .list-img .tip span {
        background-color: #000;
        color: #fff;
        font-size: 10px;
        margin-left: 2px;
        padding: 2px 7px;
        border-radius: 2px;
        display: inline-block;
        line-height: normal;
    }
    /*通过fixed固定mescroll的高度*/
    .mescroll {
        position: fixed;
        top: 44px;
        bottom: 0;
        height: auto;
    }
     .mescroll-top{
         top:90px;
     }
</style>
<style>
    #dataList .mescroll-empty {
        padding-top: 180px;
    }
</style>
