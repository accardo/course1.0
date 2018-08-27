<template>
	<div id="container" class="contractPage">
        <v-title>{{ pageTitle }}</v-title>
        <div class="sliderWrap">
            <div class="leftIcon icon-icon_contract_left" v-show="conLen > 1"></div>
            <div class="rightIcon icon-icon_contract_left" v-show="conLen > 1"></div>
            <mt-swipe :show-indicators="false" :auto="0">
                <mt-swipe-item v-for="(item,index) in conList" :key="index">
                    <div class="silderCont">
                        <div class="top" v-if="item.status == 30">
                            <img src="../../../static/img/20.png" alt="">
                            <p>生效中</p>
                        </div>
                        <div class="top" v-if="item.status == 40">
                            <img src="../../../static/img/30.png" alt="">
                            <p>已结束</p>
                        </div>
                        <div class="top" v-if="item.status == 50">
                            <img src="../../../static/img/40.png" alt="">
                            <p>已解除</p>
                        </div>
                        <div class="top" v-if="item.status == 60">
                            <img src="../../../static/img/50.png" alt="">
                            <p>已核销</p>
                        </div>
                        <ul>
                            <li>合同套餐：{{ item.packageName }}</li>
                            <li>合同编号：{{ item.contractNo }}</li>
                            <li>生效日期：{{ item.paperStartTime | formatDate}}</li>
                            <li>结束日期：{{ item.paperEndTime | formatDate}}</li>
                            <li>有效时间：{{ item.effectiveTime }}</li>
                        </ul>
                        <p class="tip" v-if="item.sellingCourseType != 3">已使用次数／购买次数：</p>
                        <template v-if="item.sellingCourseType == 1 && item.categoryInfo && item.categoryInfo.length > '0'">
                            <div class="list" v-for="itemA in item.categoryInfo">
                                <span>{{ itemA.title }}</span>
                                <p v-for="itemB in itemA.level">
                                    <i v-if="itemB.attributeName !== ''">{{ itemB.attributeName }}</i>
                                    {{ itemB.retainCount}}/{{ itemB.totalBuyCount}}次
                                </p>
                            </div>
                        </template>
                        <template v-if="item.sellingCourseType == 2">
                            <div class="list">
                                <span>{{item.haveUserRule == 0 ? '不限制课程' : '限制课程'}}</span>
                                <p>
                                    <i></i>
                                    <template>
                                        {{ item.retainCount }}/{{ item.totalBuyCount }}次
                                    </template>
                                </p>
                            </div>
                        </template>
                        <!--<template v-else>
                            <div class="list">
                                <span>{{ item.category.categoryName }}</span>
                                <p>
                                    <i></i>
                                    <template v-if="item.category.categoryName === '不限次数'">
                                        {{item.category.categoryName}}
                                    </template>
                                    <template v-else-if="item.category.categoryName === '不限分类' && item.category.totalBuyCount === '不限次数'">
                                        {{ item.category.useCount }}/{{ item.category.totalBuyCount }}
                                    </template>
                                    <template v-else>
                                        {{ item.category.useCount }}/{{ item.category.totalBuyCount }}次
                                    </template>
                                </p>
                            </div>
                        </template>-->
                    </div>
                   <!-- <div class="sliderNum">
                        {{ index + 1 }} / <span>{{ conList.length }}</span>
                    </div>-->
                </mt-swipe-item>
            </mt-swipe>
        </div>
<!--
        <footerLay v-bind:position="position"></footerLay>
-->
    </div>
</template>

<script>
    import { Swipe, SwipeItem } from 'mint-ui';
    import VTitle from '@/components/title'
    import footerLay from '@/components/footer'
    export default {
        data () {
            return {
                pageTitle: '我的合同',
                conList: '',
                conLen: 0,
                position:2
            }
        },
        created () {
            this.getConList();
        },
        components: {
            VTitle,
        	footerLay,
        },
        methods: {
            getConList() {
                var conUrl = `/daydaycook/server/newCourse/getContractPackageInfoByPid.do?pid=${this.$route.query.pid}`;
                console.log(conUrl, '套餐合同详情');
                this.ajaxDataFun('post', conUrl, (obj) => {
                    if(obj.code == '200'){
                        console.log(obj, '套餐合同详情')
                        this.conList = obj.list
                        this.conLen = obj.list.length
                    }
                })
            }
        },
        mounted (){
            let app = document.getElementById('app');
            document.body.className = 'maxHeight';
            app.className = 'maxHeight';
        }
    }
</script>
<style>
    html{ height:100%; }
    .contractPage {
        background: url("../../../static/img/htxq-_bg.jpg") no-repeat;
        background-size: cover;
    }
</style>
