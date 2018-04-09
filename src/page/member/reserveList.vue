<template>
	<div class="reserveList">
        <ul class="clearfix" v-for="item in bookList">
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
