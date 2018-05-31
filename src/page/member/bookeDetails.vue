<template>
    <div id="container">
        <v-title>{{ pageTitle }}</v-title>
        <div class="booked ">
            <div class="fixFilter"
                 :class="{ two: cateLen == '2'}"
                 v-if="from != '1' || from != '2'"
            >
                <ul class="clearfix">
                    <li v-for="(item) in category">
                            <span v-for="(itemA, i) in item.childs" :class="{active: i == index}" @click="changeCate1(i,itemA.attributeId)">
                                {{itemA.attributeName}}{{ item.categoryName }}
                            </span>
                    </li>
                </ul>
            </div>
            <div class="num" :class="{one:cateLen == 1}">
                <div v-if="from == '1'">
                    不限制次数
                </div>
                <div  v-if="from != '1'">
                    <template v-if="cateLen == 1">
                    <span v-if="category.childs"
                          v-for="(item,i) in category.childs"
                          v-show="i == index">{{ item.attributeName }}
                    </span>
                        {{ category.categoryName }}</template>剩余{{ totalSurplusCount }}次预约机会
                </div>
            </div>
            <div class="list">
                <div class="item" v-for="item in dataList">
                    <img v-if="item.type == '1'" src="../../../static/img/10.png" alt="" />
                    <img v-if="item.type == '2'" src="../../../static/img/20.png" alt="" />
                    <img v-if="item.type == '3'" src="../../../static/img/canlBig.png" alt="" />
                    <img v-if="item.type == '4'" src="../../../static/img/40.png" alt="" />
                    <img v-if="item.type == '5'" src="../../../static/img/30.png" alt="" />
                    <div class="tip" v-show="item.type == '2'">预约成功 {{ item.content }} </div>
                    <div class="tip" v-show="item.type == '3'">取消预约 {{ item.content }} </div>
                    <div class="tip" v-show="item.type != '2' && item.type != '3'">{{ item.content }} </div>
                    <div class="time"> {{ item.createDate | formatDateMore }} </div>
                    <div class="right" v-show="item.type == '1' || item.type == '3'">
                        <template v-if="item.counts != null && item.counts != 0 ">
                            <em>+</em><span>{{ item.counts }} </span>次
                        </template>
                    </div>
                    <div class="right" v-show="item.type == '2' || item.type == '4' || item.type == '5'">
                        <em>-</em><span>{{ item.counts }} </span>次
                    </div>
                </div>
            </div>
        </div>
        <footerLay v-bind:position="position"></footerLay>
    </div>
</template>

<script>
    import common from '@/components/common'
    import VTitle from '@/components/title'
    import footerLay from '@/components/footer'

    export default {
        data () {
            return {
                pageTitle: '我的约课明细',
                index:'',
                uid: '',
                phone: '',
                category: '',
                cateLen: '',
                dataList: '',
                totalSurplusCount: '',
                position:2,
                from: '',
            }
        },
        mounted () {
           this.initDate()
        },
        components: {
            VTitle,
            footerLay
        },
        methods: {
            /**
             * Description: 初始化数据
             * Author: yanlichen <lichen.yan@daydaycook.com>
             * Date: 2018/5/17
             */
            initDate(){
                this.uid = this.$store.state.uid ||  localStorage.getItem('uid');
                this.phone = this.$store.state.phone ||  localStorage.getItem('phone');
                this.index = this.$route.query.index;
                this.from = this.$route.query.from;
                this.getCate().then((data) => {
                    if (data.code == '200') {
                        this.category = data.data;
                        /*if (this.from == '1') {
                            this.category = data.data[2];
                        } else if (this.from == '2') {
                            this.category = data.data[1];
                        } else {
                            data.data[0].detail.forEach((item, index) => {
                                if (item.categoryId == this.$route.query.categoryId) {
                                    this.category = data.data[0].detail[index];
                                    this.cateLen = data.data[0].detail.length;
                                }
                            })
                        }*/
                    }
                })
                this.changeCate().then((data) => {
                    if (data.code == '200') {
                        this.dataList = data.data.maplist;
                        this.totalSurplusCount = data.data.totalSurplusCount;
                    }
                })
            },
            /**
             * Description: 次数显示接口
             * Author: yanlichen <lichen.yan@daydaycook.com>
             * Date: 2018/5/16
             */
            getCate() {
               // let cateUrl = `/daydaycook/server/contract/queryAllCourseCountByUser.do?uid=${this.uid}&userPhone=${this.phone}&categoryId=${this.$route.query.categoryId || ''}`;
                let categoryId = (this.$route.query.categoryId == 'null' ||
                    this.$route.query.categoryId == 'undefined') ? 0 : this.$route.query.categoryId || 0;
                // let sellingCourseTypeId = (this.$route.query.sellingCourseTypeId == 'null' ||
                //     this.$route.query.sellingCourseTypeId == 'undefined') ? 0 : this.$route.query.sellingCourseTypeId || 0;
                let cateUrl = `/daydaycook/server/contract/queryAllCourseByUser.do?uid=${this.uid}&mobile=${this.phone}&categoryId=${categoryId}`;
                return new Promise((resolve) => {
                    this.ajaxDataFun('post', cateUrl, (data) => {
                        if(data.code== '200'){
                            resolve(data);
                        }
                    })
                })
            },
            changeCate1:function(index, cid){
                let categoryId = (this.$route.query.categoryId == 'null' ||
                    this.$route.query.categoryId == 'undefined') ? 0 : this.$route.query.categoryId || 0;
                let contractId = (this.$route.query.contractId == 'null' ||
                    this.$route.query.contractId == 'undefined') ? 0 : this.$route.query.contractId || 0;
                let sellingCourseTypeId = (this.$route.query.sellingCourseTypeId == 'null' ||
                    this.$route.query.sellingCourseTypeId == 'undefined') ? 0 : this.$route.query.sellingCourseTypeId || 0;
                this.index = index;
                let listUrl = `/daydaycook/server/offline/record/list.do?uid=${this.uid}&userPhone=${this.phone}&categoryId=${categoryId}&attributeId=${cid || 0}&contractId=${contractId}&sellingCourseType=${sellingCourseTypeId}`;
                this.ajaxDataFun('post', listUrl, (obj) => {
                    if(obj.code == '200'){
                        this.dataList = obj.data.maplist
                        this.totalSurplusCount = obj.data.totalSurplusCount
                    }
                })
            },
            /**
             * Description: 约课明细接口
             * Author: yanlichen <lichen.yan@daydaycook.com>
             * Date: 2018/5/16
             */
            changeCate() {
                let categoryId = (this.$route.query.categoryId == 'null' ||
                    this.$route.query.categoryId == 'undefined') ? 0 : this.$route.query.categoryId || 0;
                let attributeId = (this.$route.query.attributeId == 'null' ||
                    this.$route.query.attributeId == 'undefined') ? 0 : this.$route.query.attributeId || 0;
                let contractId = (this.$route.query.contractId == 'null' ||
                    this.$route.query.contractId == 'undefined') ? 0 : this.$route.query.contractId || 0;
                let sellingCourseTypeId = (this.$route.query.sellingCourseTypeId == 'null' ||
                    this.$route.query.sellingCourseTypeId == 'undefined') ? 0 : this.$route.query.sellingCourseTypeId || 0;
                let listUrl = `/daydaycook/server/offline/record/list.do?uid=${this.uid}&userPhone=${this.phone}&categoryId=${categoryId}&attributeId=${attributeId}&contractId=${contractId}&sellingCourseType=${sellingCourseTypeId}`;
                return new Promise((resolve) => {
                   this.ajaxDataFun('post', listUrl, (obj) => {
                       if(obj.code == '200'){
                           resolve(obj);
                       }
                   })
                })
            },
        },
    }
</script>
<style scoped>
    .booked .fixFilter li {
        width: 100%;
        text-align: left;
        float: none;
        color: #fff !important;
        opacity: 1;
    }
    .booked .fixFilter li span {
        padding: 0 15px;
        display: inline-block;
        position: relative;
        color: #fff !important;
    }
    .booked .fixFilter li span.active:after{
        content: '';
        width: 16px;
        height: 2px;
        display: inline-block;
        background-color: #fff;
        position: absolute;
        bottom: -10px;
        left: 0;
        right: 0;
        margin: auto;
        color: #fff;
    }
</style>
