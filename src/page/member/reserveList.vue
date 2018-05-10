<template>
	<div class="reserveList">
        <ul class="clearfix">
            <li class="position-fixed"><img src="../../../static/img/icon_pengren.png" alt=""></li>
            <li class="no-limit">
                不限制预约次数
            </li>
            <li class="position-fixed">
                <div class="reserve-icon"></div>
            </li>
        </ul>
        <ul class="clearfix" v-for="item in bookList">
            <li class="position-fixed"><img src="../../../static/img/icon_pengren.png" alt=""></li>
            <li v-for="(list, index) in item.childs" v-if="index == 0">
                <router-link :to="'/bookeDetails?cid=' + list.attributeId + '&id=' + item.categoryId + '&index=' + index">
                    <span>{{ item.categoryName }}</span>
                    <p>可预约</p>
                 </router-link>
            </li>
            <li v-for="(list, index) in item.childs">
                <router-link :to="'/bookeDetails?cid=' + list.attributeId + '&id=' + item.categoryId + '&index=' + index">
                    <span>{{ list.attributeName }}</span>
                    <span class="blank" v-if="!list.attributeName "></span>
                    <p>
                        <i>{{ list.retainCount - list.refundCount - list.endCount}}</i>次
                    </p>
                </router-link>
            </li>
            <li v-for="(list, index) in item.childs">
                <router-link :to="'/bookeDetails?cid=' + list.attributeId + '&id=' + item.categoryId + '&index=' + index">
                    <span>{{ list.attributeName }}</span>
                    <span class="blank" v-if="!list.attributeName "></span>
                    <p>
                        <i>{{ list.retainCount - list.refundCount - list.endCount}}</i>次
                    </p>
                </router-link>
            </li>
            <li class="position-fixed">
                <div class="reserve-icon"></div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                pageTitle: '预约次数',
                uid: '',
                phone: '',
                bookList: '',
            }
        },
        created () {
            this.initUserInfo()
        },
        components: {

        },
        methods: {
            initUserInfo:function(){
                this.uid = this.$store.state.uid || localStorage.getItem('uid')
                this.phone = this.$store.state.phone || localStorage.getItem('phone')
                this.getNumList()
            },
            getNumList:function(){
                var _numUrl = '/daydaycook/server/contract/queryAllCourseCountByUser.do?uid=' + this.uid + '&mobile='+ this.phone;
                var _this = this
                this.ajaxDataFun('post', _numUrl, function(obj){
                    if(obj.code == '200'){
                        _this.bookList = obj.data
                    }
                })
            }
        },
    }
</script>
<style scoped>
    .reserveList ul {
        position: relative;
        display: flex;
    }
    .reserveList ul li {
        float: none;
        width: auto;
        flex: 1;
    }
    .reserveList ul li:first-of-type {
        position: absolute;
        bottom: 0;
        z-index: 1;
    }
    .reserveList ul li:nth-of-type(2) {
        position: relative;
        z-index: 2;
    }
    .position-fixed {
        width: auto;
    }
    .position-fixed img {
        display: block;
        width: 60px;
        height: 40px;
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
        right: 0;
    }
    .reserveList ul li:last-of-type {
        position: absolute;
        bottom: 30px;
        right: 20px;
        z-index: 1;
    }
    .no-limit {
        padding: 10px 0;
        font-weight: bold;
    }
</style>
