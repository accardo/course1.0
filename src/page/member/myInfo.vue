<template>
	<div id="container">
        <v-title>{{ pageTitle }}</v-title>
	    <div class="myInfo">
	        <div class="wrap">
	            <div class="logo">
	                <img class="one" src="../../assets/img/profile.png" alt="logo" />
	                <img class="two" src="../../../static/img/member.png" alt="logo" />
	            </div>
	            <div class="avar">
                    <img v-if="userContract.image" :src="userContract.image" />
                    <img v-if="!userContract.image || userContract.image == 'null'" src="../../../static/img/default.png" />
	                <span v-if="userContract.sex == 0" class="icon icon-icon_profile_male"></span>
	                <span v-if="userContract.sex == 1" class="icon icon-icon_profile_female"></span>
	            </div>
	            <div class="name">{{ userContract.lineUserName }}</div>
	            <div class="info">
	                <p>手机号码 : {{ userContract.userName }}</p>
	                <p>出生日期 : {{ userContract.birthday | infoDate }}</p>
	            </div>
	            <div class="time" v-if="userContract.startTime">入学时间 : {{ userContract.startTime | formatDate}}</div>
	        </div>
	    </div>
<!--
	    <footerLay v-bind:position="position"></footerLay>
-->
	</div>
</template>

<script>
    import VTitle from '@/components/title'
  // import footerLay from '@/components/footer'
    export default {
        data () {
            return {
                pageTitle: '我的资料',
                userContract: '',
                position:2
            }
        },
        created () {
            this.initUserInfo()
        },
        components: {
            VTitle,
        	//footerLay
        },
        methods: {
            initUserInfo:function(){
                let uid = this.$store.state.uid || localStorage.getItem('uid')
                let userUniqueId = this.$store.state.uid || localStorage.getItem('userUniqueId')
                var _this = this
                var _infoUrl = `/daydaycook/server/contract/userInfo.do?uid=${uid}&userUniqueId=${userUniqueId}`;
                this.ajaxDataFun('post', _infoUrl, function(obj){
                    if(obj.code == '200'){
                        _this.userContract = obj.userContract
                    }
                })
            },
        },
        mounted (){
            let app = document.getElementById('app')
            let con = document.getElementById('container')
            document.body.className = 'maxHeight'
            app.className = 'maxHeight'
            con.className = 'maxHeight'
        },
        filters:{
            infoDate:function(va){
                function setv(v){v = v < 10?'0' + v : v; return v; }
                var v = new Date(va)
                var y = v.getFullYear()   //年
                var m = v.getMonth() + 1 //上个月
                var d = v.getDate()      //天getDate.getDate()
                return y + ' / ' + setv(m) + ' / ' + setv(d)
            }
        }
    }
</script>
<style type="text/css">
    html{ height:100%; }
</style>
