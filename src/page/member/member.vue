<template>
   <div id="container">
     	<v-title>{{ pageTitle }}</v-title>
       <div class="member justify">
           <div class="top box">
	           	<router-link to="/myInfo">
	               	<div class="avar">
	                   <img v-if="avar && avar != 'null'" :src="avar" />
	                   <img v-if="!avar || avar == 'null'" src="../../../static/img/default.png" />
	               	</div>
	               	<div class="name">
                     <p v-if="lineUserName != 'null'">{{ lineUserName }}</p>
                     <p v-if="lineUserName == 'null'">{{ nickName }}</p>
	                   <span>日日煮厨艺学员</span>
	               	</div>
	           </router-link>
           </div>
           <div class="contract box" v-show="isHaveContract">
           		<router-link to="/contract">
               		<p>{{ contractEndTime | formatDate }}到期</p>
               		<span class="icon-arrow icon-icon_contract_left rotate"></span>
           		</router-link>
           </div>
       </div>
       <reserveList></reserveList>
       <div class="colList">
           <ul>
               <li>
	               	<router-link to="/notice">
	                   <img src="../../../static/img/xiaoxi.png" alt="" />
	                   <p> 消息通知 </p>
	                   <div class="right">
	                       <span class="num" v-show="unreadCount">{{ unreadCount }} </span>
	                       <span class="icon icon-icon_contract_left rotate"></span>
	                   </div>
	                </router-link>
               </li>
               <li>
                   <img src="../../../static/img/kechng.png" alt="" />
                   <p>我的预约</p>
               </li>
           </ul>
       </div>
       <listLay :coursefrom="1" :listData="listData" v-if="listData.length"></listLay>
       <div class="popNotWrap">
           <img src="../../../static/img/not_2.png" alt="" />
           <p>还没有预约过课程，快去瞅瞅吧</p>
       </div>
       <footerLay v-bind:position="position"></footerLay>
   </div>
</template>

<script>
    import footerLay from '@/components/footer'
    import common from '@/components/common'
    import listLay from '../home/list'
    import reserveList from './reserveList'
    import VTitle from '@/components/title'

    export default {
        data () {
            return {
                pageTitle: '个人中心',
                uid: '',
                avar: '',
                phone: '',
                nickName: '',
                lineUserName: '',
                unreadCount: '',
                currentPage: 1,
                listData: '',
                isHaveContract: '',
                endListen: false,
                position:2,
                contractEndTime: '' // 到期日期
            }
        },
        created () {
            let isMember = this.$store.state.isMember || localStorage.getItem('isMember')
            if(isMember == true || isMember == 'true'){
                this.initUserInfo()
            }else{
                this.$router.push('/notMember')
            }
        },
        components: {
        	listLay,
        	common,
        	VTitle,
        	reserveList,
        	footerLay,
        },
        methods: {
            /**
             * Description: 获取到期日期
             * Author: yanlichen <lichen.yan@daydaycook.com>
             * Date: 2018/5/16
             */
            getDateEnd() {
                let uid = this.$store.state.uid || localStorage.getItem('uid');
                let infoUrl = `/daydaycook/server/contract/userInfo.do?uid=${uid}`;
                return new Promise((resolve) => {
                    this.ajaxDataFun('post', infoUrl, (obj) => {
                        if(obj.code == '200'){
                            return resolve(obj);
                        }
                    });
                });
            },
        	initUserInfo(){
        		this.avar = this.$store.state.avar || localStorage.getItem('avar')
                this.uid = this.$store.state.uid || localStorage.getItem('uid')
        		this.phone = this.$store.state.phone || localStorage.getItem('phone')
        		this.lineUserName = this.$store.state.lineUserName || localStorage.getItem('lineUserName')
        		this.nickName = this.$store.state.nickName || localStorage.getItem('nickName')
        		this.getList()  //获取我的课程列表
        		this.getInfoNum()  //获取消息数量
                this.getDateEnd().then((data) => { // 获取到期日期
                    if (data.code == '200') {
                        this.contractEndTime = data.userContract.contractEndTime;
                        // let endTime = timeStamp(data.userContract.contractEndTime);
                        // this.contractEndTime = `${endTime.Y}/${endTime.M}/${endTime.D}`;
                    }
                });
        	},
        	getInfoNum:function(){
        		var _this = this
        		var _infoNumUrl = '/daydaycook//server/offline/record/unreadCount.do?userPhone=' + this.phone + '&uid=' + this.uid
        		this.ajaxDataFun('post', _infoNumUrl, function(obj){
        		    if(obj.code==200){
        		        _this.unreadCount = obj.data.unreadCount
                        _this.isHaveContract = obj.data.isHaveContract
                        _this.$nextTick(() => {
                          	window.scrollTo(0, 1)
                          	window.scrollTo(0, 0)
                        })
        		    }
        		})
        	},
        	getList:function(scroll){  //获取课程列表
                var _this = this
                var _listUrl = '/daydaycook/server/offline/reservationUser/offlineCourseList.do?type=2&mobile=' + this.phone + '&pageSize=5&currentPage=' + this.currentPage + '&uid=' + this.uid
                console.log(_listUrl, '获取课程列表');
                this.ajaxDataFun('post', _listUrl, function(obj){
                    if(obj.code == '200'){
                        if(scroll){
                            var objLen = obj.data.list.length;
                            if(objLen){
                                for(let j=0; j < objLen; j++){
                                    _this.listData.push(obj.data.list[j]);
                                }
                                _this.$set(_this.$data, 'listData', _this.listData);
                            }else{
                                _this.endListen = true
                                _this.$store.state.loadingTxt = ''
                            }
                        }else{
                            _this.categoryCount = obj.data.categoryCount
                            _this.listData = obj.data.list
                        }
                    }
                })
            },
        },
        mounted (){
            var _this = this
            document.body.className = ''
            window.onscroll = function(){
            	let t = common.getScrollTop()
            	let h = common.getWindowHeight()
            	let s = common.getScrollHeight()

            　　if(t + h == s){
                    if(!_this.endListen){
                        _this.currentPage++
                        _this.getList(1)
                    }
                    console.log(_this.currentPage)
            　　}
            }
        },
        watch:{
        	listData:function(){
                let l = this.listData
                let e = document.querySelector('.popNotWrap')
                if(l == 0){
                    e.classList.add('show')
                }else{
                  	e.classList.remove('show')
                }
            }
        }
    }
</script>
