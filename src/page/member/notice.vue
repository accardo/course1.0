<template>
	<div id="container">
        <v-title>{{ pageTitle }}</v-title>
        <div class="notic" v-show="infoList.length">
            <ul>
                <li v-for="item in infoList" @click="readFun(item.id, item.courseId, item.isRead)">
                    <div class="img">
                        <img :src="item.imageUrl" alt="" />
                        <span v-if="item.isRead == 0"></span>
                    </div>
                    <div class="info">
                        <div class="title" v-if="item.type==2"> 预约成功 </div>
                        <div class="title" v-if="item.type==3"> 预约取消 </div>
                        <div class="tip" v-if="item.type==2"> 您已成功预约“{{ item.content }}”课程！ </div>
                        <div class="tip" v-if="item.type==3"> 您已成功取消“{{ item.content }}”课程！ </div>
                        <div class="time"> {{ item.createDate | timeInfo}} </div>
                    </div>
                </li>
            </ul>
        </div>
        <p class="isLoading">{{ $store.state.loadingTxt }}</p>
        <div class="popNotWrap moreBig" :class="{show:infoList.length == 0}">
            <img src="../../../static/img/no_news.png" alt="" />
            <p>杳无音讯呀!</p>
        </div>
        <footerLay v-bind:position="position"></footerLay>
    </div>
</template>

<script>
    import footerLay from '@/components/footer'
    import VTitle from '@/components/title'
    export default {
        data () {
            return {
                pageTitle: '消息通知',
                infoList: '',
                phone: '',
                conList: '',
                position:2
            }
        },
        created () {
            this.phone = this.$store.state.phone || localStorage.getItem('phone')
            this.getList('')
        },
        components: {
            VTitle,
        	footerLay
        },
        methods: {
            readFun:function(id,cid,type){
                var _this = this
                if(type == 0){
                    var _readUrl = '/daydaycook/server/offline/record/updateRead.do?id=' + id;
                    this.ajaxDataFun('post', _readUrl,function(obj){
                        if(obj.code == '200'){
                            _this.$router.push({ path:'details', query:{'id':cid} })
                        }
                    })
                }else{
                    _this.$router.push({ path:'details', query:{'id':cid} })
                }
            },
            getList:function(scroll){
                var _this = this
                var _infoUrl = '/daydaycook/server/offline/record/noticeList.do?userPhone=' + this.phone
                this.ajaxDataFun('post', _infoUrl, function(obj){
                    if(obj.code == '200'){
                        if(scroll){
                            var objLen = obj.data.length;
                            if(objLen){
                                for(let j=0; j < objLen; j++){
                                    _this.infoList.push(obj.data[j]);
                                }
                                _this.$set(_this.$data, 'infoList', _this.infoList);
                            }else{
                                _this.endListen = true
                                _this.$store.state.loadingTxt = ''
                            }
                        }else{
                            _this.infoList = obj.data
                        }
                    }
                })
            }
        },
        mounted (){
            let app = document.getElementById('container')
            app.className = 'bgGray'
            document.body.className  = 'maxHeight bgGray'
        },
        filters:{
            timeInfo:function (dd){
                var mydate = Date.parse(new Date());
                var minus = mydate - dd;
                if (minus/1000 < 60) {
                    return Math.floor(minus/1000) + "秒前"
                } else if (minus/1000/60 < 60) {
                    return Math.floor(minus/1000/60) + "分钟前"
                } else if (minus/1000/60/60 < 24) {
                    return Math.floor(minus/1000/60/60) + "小时前"
                } else if (minus/1000/60/60 < 48) {
                    return "昨天";
                } else {
                    var dy = new Date(dd);
                    var year=dy.getFullYear();
                    var month=dy.getMonth()+1;
                    var day=dy.getDate();
                    var hour=dy.getHours();
                    var minute=dy.getMinutes();
                    var second=dy.getSeconds();
                    month = month<10?"0"+month:month;
                    day = day<10?"0"+day:day;
                    hour = hour<10?"0"+hour:hour;
                    minute = minute<10?"0"+minute:minute;
                    second = second<10?"0"+second:second;
                    return year+"/"+month+"/"+day+"  "+hour+":"+minute;
                }
            },
        }
    }
</script>
<style type="text/css">
    html{  height:100%}
</style>
