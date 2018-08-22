<template>
    <div>
        <div class="lesson-item" v-for="item in listData" :key="">
            <router-link :to="{ name: 'expShop', params: { userId: 123 }}">
                <div class="lesson-img">
                    <img :src="item.imageUrl" alt="">
                    <span v-if="listType ==1">{{item.tip}}</span><!--listType 1 导航列表  2 个人中心-->
                    <span v-if="listType ==2"
                          :class="[item.courseStatus == 1 ? 'tip-active' : '']"
                    >{{item.courseStatus == 1 ? '已结束' : '未开始'}}</span> <!--member 已结束 tip-active-->
                </div>
                <div class="lesson-info">
                    <p class="tit two-line">{{item.courseName}}</p>
                    <p class="lesson-p">{{item.startTime | formatTimeOne }}-{{item.endTime | formatTimeTwo}}</p>
                    <p v-if="listType ==1" class="lesson-p">{{item.teacher}} | 剩余名额<strong> {{item.num}} </strong>人</p>
                    <p v-if="listType ==2" class="lesson-p">{{item.address}} | {{item.teacherName}}</p>
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        props: {
            listData: {
                type: Array,
                value: []
            },
            listType: {
                type: Number,
                value: 0
            }
        },
        mounted() {

        },
        methods: {
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
                return `${mt}/${d}周${wstr} ${setv(h)}:${setv(mn)}`
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
    .lesson-img > img{
        display: inline-block;
        width: 150px;
        height: 82px;
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
    .lesson-img > span.tip-active {
        background: #A5A4A4;
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
    .two-line {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /*! autoprefixer: on */
    }
</style>
