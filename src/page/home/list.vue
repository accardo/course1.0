<template>
     <div class="courseList">
        <div class="courseItem" v-for="item in listData">
            <router-link :to="'/details?id=' + item.offlineCourseId">
            <div class="img">
                <img :src="item.imageUrl + '?x-oss-process=image/resize,w_640'" alt="">
                <div class="tip">
                    <span v-if="myCourse == 'false' && item.reservationState == 0">
                        已预约
                    </span>
                    <span v-if="myCourse == 'true' && item.reservationState == 0 && item.courseState == '未开始'">未开课</span>
                    <span v-if="myCourse == 'true' && item.reservationState == 0 && item.courseState == '已结束' && myCourse=='true'" class="off">       
                        已结束
                    </span>
                    <span v-for="attribute in item.childs" v-if="item.childs.length">
                        {{ attribute.attributeName }}{{ item.categoryName }}
                    </span>
                    <span v-if="!item.childs.length">
                        {{ item.categoryName }}
                    </span>
                </div>
            </div>
            <div class="title">{{ item.title }} </div>
            <div class="teacher"><span>{{ item.teacherName }}</span></div>
            <div class="info" v-if="$store.state.isMember == true">
                <template v-if="myCourse == 'false'">
                    <p class="time" v-if="item.reservationState == 1">
                        剩余名额<i>{{ item.totalCount-item.reservationCount }}</i>人
                    </p>
                    <p class="time" v-if="item.reservationState == 2">
                        剩余名额<i>0</i>人
                    </p>
                    <p v-if="item.reservationState == 3">未满足预约条件</p>
                </template>
                <p> 
                    <template v-if="item.appointState != 3">
                        {{ item.startTime | formatTimeOne }}-{{ item.endTime | formatTimeTwo }}
                    </template>
                </p>
                <span v-if="myCourse == 'true'">{{ item.address }}</span>
            </div>
            <div class="info" v-if="$store.state.isMember != true">
                <p class="time" v-if="myCourse == 'false'">
                    剩余名额 <i>{{ item.totalCount - item.reservationCount }} </i>人
                </p>
                <p> 
                    <template v-if="item.appointState != 3">
                    {{ item.startTime | formatTimeOne }}-{{ item.endTime | formatTimeTwo }}
                    </template>
                </p>
                <span v-if="myCourse =='true'">{{ item.addressName }}</span>
            </div>
            <div class="address" v-show="coursefrom">{{item.address}}</div>
            <!-- reservationState 0 已约 1可约 2约满 3不能约-->
            <template v-if="$store.state.isMember != true || validContractCount == 0">
                <div class="button" :class="{active:item.reservationState != 2 && item.appointState != 3}">
                    预约
                </div>
            </template>
            <template v-if="$store.state.isMember == true && validContractCount != 0">
                <div class="button" v-if="item.reservationState == 2 || item.reservationState == 3"> 预约</div>
                <div class="button active" v-if="item.reservationState == 1">预约</div>
                <div class="button active" v-if="item.reservationState == 0 ">查看</div>
            </template>
            </router-link>
        </div>
        <p class="isLoading"> {{ $store.state.loadingTxt }} </p>
    </div>
</template>

<script>
    import common from '@/components/common.js'
    export default {
        data () {
            return {    
                pageTitle: '首页列表',
            }
        },
        created () {
            // console.log(this.from)
        },
        components: {

        },
        props:['listData', 'myCourse', 'validContractCount','coursefrom'],
        methods: { },
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
