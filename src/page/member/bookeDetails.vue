<template>
    <div id="container">
        <v-title>{{ pageTitle }}</v-title>
        <div class="booked ">
            <div class="fixFilter" :class="{ two: cateLen == '2'}" v-show="cateLen > 1">
                <ul class="clearfix">
                    <li v-for="(item,i) in category.childs" :class="{active:i == index}" @click="changeCate(i,item.attributeId)">
                        {{ item.attributeName }}{{ category.categoryName }}
                    </li> 
                </ul>
            </div>
            <div class="num" :class="{one:cateLen == 1}">
                <template v-if="cateLen == 1">
                    <span v-if="category.childs" v-for="(item,i) in category.childs" v-show="i == index">{{ item.attributeName }}</span>{{ category.categoryName }}</template>剩余{{ totalSurplusCount }}次预约机会
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
                        <em>+</em><span>{{ item.counts }} </span>次
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
                id: '',
                cid: '',
                index:'',
                uid: '',
                phone: '',
                category: '',
                cateLen: '',
                dataList: '',
                totalSurplusCount: '',
                position:2
            }
        },
        created () {
           this.initDate()
        },
        components: {
            VTitle,
            footerLay
        },
        methods: { 
            initDate:function(){
                let locaUrl = window.location.href
                if(locaUrl.indexOf('id=') > -1){
                    this.id = common.getUrlPars(locaUrl).id
                    this.cid = common.getUrlPars(locaUrl).cid
                    this.index = common.getUrlPars(locaUrl).index
                }
                this.uid = this.$store.state.uid ||  localStorage.getItem('uid')
                this.phone = this.$store.state.phone ||  localStorage.getItem('phone')
                this.getCate()

                if(this.cid == 'null' || this.cid == null){
                    this.cid = ''
                }
                this.changeCate(this.index,this.cid)
            },
            getCate:function(){
                var _this = this
                var _cateUrl = '/daydaycook/server/contract/queryAllCourseCountByUser.do?uid=' + _this.uid + '&userPhone=' + _this.phone + "&categoryId=" + _this.id 

                this.ajaxDataFun('post', _cateUrl, function(obj){
                    if(obj.code== '200'){
                        _this.category = obj.data[0]
                        _this.cateLen = obj.data[0].childs.length
                    }
                })
            },
            changeCate:function(index, cid){
                console.log(index)
                var _this = this
                this.index = index
                var _listUrl = "/daydaycook/server/offline/record/list.do?uid=" + _this.uid + "&userPhone=" + _this.phone + "&categoryId=" + _this.id + "&attributeId=" + (cid || '') 
                this.ajaxDataFun('post', _listUrl, function(obj){
                    if(obj.code == '200'){
                        _this.dataList = obj.data.maplist
                        _this.totalSurplusCount = obj.data.totalSurplusCount
                    }
                })
            },  
        },
    }
</script>
