<template>
	<div class="reserveList">
        <div class="reserve-wrap clearfix" v-for="item in bookList">
            <!-- 不限次数-->
            <div class="list-wrap no-limit-img no-limit-left" v-if="item.sellingCourseTypeId == '3'">
                <span @click="bookeDetails(item.detail.contractId, item.sellingCourseTypeId)">{{item.showText}}</span>
                <div class="reserve-icon"></div>
            </div>
            <!-- 分类 -->
            <div v-if="item.sellingCourseTypeId === '1'" >
                <div class="list-cast" v-for="itemA in item.detail">
                    <div class="cast-title">
                        <span>{{ itemA.categoryName }}</span>
                        <span>可预约</span>
                    </div>
                    <div class="cast-list-num" v-for="(itemB, index) in itemA.childs">
                        <router-link :to="'/bookeDetails?contractId='+ itemA.contractId + '&attributeId=' + itemB.attributeId + '&categoryId=' + itemA.categoryId + '&sellingCourseTypeId=' + item.sellingCourseTypeId + '&index=' + index">
                            <div class="cast-dj">
                                <span>{{ itemB.attributeName }}</span>
                                <span><b>{{ itemB.retainCount - itemB.refundCount - itemB.endCount }}</b>次</span>
                            </div>
                        </router-link>
                    </div>
                    <img :src="itemA.imageUrl" :alt="itemA.categoryName">
                    <div class="reserve-icon"></div>
                </div>
            </div>
            <!--不限分类-->
            <div class="list-wrap no-limit-img no-limit-class" v-if="item.sellingCourseTypeId === '2'">
                <div class="cast-title">
                    <span>{{ item.showText }}</span>
                    <span>可预约</span>
                </div>
                <div class="cast-list-num">
                <router-link class="limit-class-num" :to="'/bookeDetails?contractId=' + item.detail.contractId + '&sellingCourseTypeId='+ item.sellingCourseTypeId + '&from=2'">
                    <div class="limit-font"><b>{{item.detail.reservableCount}}</b>次</div>
                </router-link>
                </div>
                <div class="reserve-icon"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as util from '@/utils/utils.js'

    export default {
        data () {
            return {
                pageTitle: '预约次数',
                uid: '',
                phone: '',
                bookList: '',
                userUniqueId: '',
            }
        },
        created () {
            this.initUserInfo()
        },
        components: {

        },
        methods: {
            initUserInfo() {
                this.uid = this.$store.state.uid || localStorage.getItem('uid');
                this.phone = this.$store.state.phone || localStorage.getItem('phone');
                this.userUniqueId = this.$store.state.userUniqueId || localStorage.getItem('userUniqueId');
                this.getNumList()
            },
            getNumList() {
                var numUrl = `/daydaycook/server/contract/queryAllCourseCountByUser.do?uid=${this.uid || ''}&userUniqueId=${this.userUniqueId}&mobile=${this.phone}`;
                this.ajaxDataFun('post', numUrl, (obj) => {
                    if(obj.code == '200'){
                        this.bookList = obj.data
                    }
                })
            },
            bookeDetails(cId, sId) {
                let params = {
                    that: this,
                    router: 'bookeDetails',
                    query: {
                        contractId: cId,
                        sellingCourseTypeId: sId,
                        from: 1,
                    },
                    title: '我的约课明细',
                }
                util.navTo(params);
            }
        },
    }
</script>
<style scoped>
    .list-wrap {
        position: relative;
        width: 100%;
        height: 55px;
        border-bottom: #eee solid 1px;
    }
    .no-limit-left {
        display: flex;
        align-items: center;
        text-indent: 5px;
    }
    .no-limit-left a {
        width: 100%;
        line-height: 54px;
        height: 100%;
        display: block;
        font-weight: bold;
        color: #000;
    }
    .list-cast {
        position: relative;
        height: 55px;
        display: flex;
        align-items: center;
        border-bottom: #eee solid 1px;
    }
    .list-cast img{
        position: absolute;
        bottom: 0;
        left: 0;
        display: block;
        width: 60px;
        height: 40px;
        z-index: -1;
    }
    .cast-title {
        width: 70px;
        float: left;
        /*flex:1;*/
    }
    .cast-title span{
        display: block;
        font-size: 14px;
        color: #7f7f7f;
    }
    .cast-list-num {
        float: left;
        display: flex;
        width: 20%;
        margin-left: 12px;
    }
    .cast-list-num a{
        color: #7F7F7F;
    }
    .cast-list-num a b{
        color: #000;
    }
    .cast-list-num .cast-dj {
        flex: 1;
    }
    .cast-list-num .cast-dj span:first-of-type {
        color: #7f7f7f;
    }
    .cast-list-num .cast-dj span{
        line-height: 18px;
        display: block;
    }
    .cast-list-num .cast-dj span b{
       font-size: 16px;
    }
    .no-limit-class {
        display: flex;
        align-items: center;
    }
    .no-limit-class .cast-title {
        /*flex: 100px 1;*/
    }
    .no-limit-class .limit-class-num {
        width: 100%;
    }
    .reserve-icon {
        width: 0;
        overflow: hidden;
        font-size: 0;
        line-height: 0;
        border-color: transparent transparent transparent #c4c4c4;
        border-style: dashed dashed dashed solid;
        border-width: 4px;
        position: absolute;
        top: 25px;
        right: 0;
    }
    .no-limit-img {
        background: url("data:image/png;base64,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") no-repeat;
        background-size: contain;
    }
    .reserveList {
        padding: 15px;
    }
    .limit-font {
        color: #7f7f7f;
    }
    .limit-font b{
        color: #000;
        font-size: 16px;
    }
</style>
