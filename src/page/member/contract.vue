<template>
	<div id="container" class="contractPage">
        <v-title>{{ pageTitle }}</v-title>
        <div class="sliderWrap">
            <div class="leftIcon icon-icon_contract_left" v-show="conLen > 1"></div>
            <div class="rightIcon icon-icon_contract_left" v-show="conLen > 1"></div>
            <mt-swipe :show-indicators="false" :auto="0">
                <mt-swipe-item v-for="(item,index) in conList" :key="index">
                    <div class="silderCont">
                        <div class="top" v-if="item.state == 30">
                            <img src="../../../static/img/20.png" alt="">
                            <p>生效中</p>
                        </div>
                        <div class="top" v-if="item.state == 40">
                            <img src="../../../static/img/30.png" alt="">
                            <p>已结束</p>
                        </div>
                        <div class="top" v-if="item.state == 50">
                            <img src="../../../static/img/40.png" alt="">
                            <p>已解除</p>
                        </div>
                        <div class="top" v-if="item.state == 60">
                            <img src="../../../static/img/50.png" alt="">
                            <p>已核销</p>
                        </div>
                        <ul>
                            <li>合同编号：{{ item.contractNo }}</li>
                            <li>生效日期：{{ item.startTime | formatDate}}</li>
                            <li>结束日期：{{ item.endTime | formatDate}}</li>
                            <li>有效时间：{{ item.effectiveTime }}</li>
                        </ul>
                        <p class="tip">已使用次数／购买次数：</p>
                        <template v-if="item.category && item.category.length > '0'">
                            <div class="list" v-for="list in item.category">
                                <span>{{ list.categoryName }}</span>
                                <p v-for="child in list.childs">
                                    <i v-if="child.attributeName">{{ child.attributeName }}</i>
                                    {{ child.totalBuyCount - child.retainCount }}/{{ child.totalBuyCount - child.refundCount }}次
                                </p>
                            </div>
                        </template>
                        <template v-else>
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
                        </template>
                    </div>
                    <div class="sliderNum">
                        {{ index + 1 }} / <span>{{ conList.length }}</span>
                    </div>
                </mt-swipe-item>
            </mt-swipe>
        </div>
        <footerLay v-bind:position="position"></footerLay>
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
                uid: '',
                conList: '',
                conLen: 0,
                position:2
            }
        },
        created () {
            this.initUserInfo()
        },
        components: {
            VTitle,
        	footerLay,
        },
        methods: {
            initUserInfo() {
                this.uid = this.$store.state.uid || localStorage.getItem('uid');
                this.getConList();
            },
            getConList() {
                var conUrl = `/daydaycook/server/contract/myContract.do?uid=${this.uid}`;
                this.ajaxDataFun('post', conUrl, (obj) => {
                    if(obj.code == '200'){
                        this.conList = obj.data
                        this.conLen = obj.data.length
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
<style type="text/css">
    html{ height:100%; }
</style>
