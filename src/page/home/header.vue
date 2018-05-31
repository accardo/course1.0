<template>
   <section>
        <div id="top" :class="{fixed:fixedTop}">
            <div class="topBar justify">
                <div class="box left" @click="chooseFun">
                    <span class="icon icon-yk_icon_locate"></span>
                    <p>{{ addressTxt }}</p>
                    <em v-show="addressLen > 2">[切换]</em>
                </div>
                <div class="box right" @click="changePhone = true">登出</div>
            </div>
            <div class="tagList" :class="{three:isMember == 'true' && categoryCount > 1 && validContractCount != 0}">
                <ul class="clearfix">
                    <li @click="chooseCate(0)" v-show="isMember != 'true' || (isMember == 'true' && categoryCount > 1) || validContractCount == 0">
                        <p>{{ categoryName }}</p>
                        <span :class="{up:pIndex == '0' && showCate }"></span>
                    </li>
                    <li @click="chooseCate(1)" v-if="isMember == 'true' && validContractCount != 0">
                        <p>{{ courseStatusTxt }}</p>
                        <span :class="{up:pIndex == '1' && showCate}"></span>
                    </li>
                    <li @click="chooseCate(2)">
                        <p>{{ startdayTxt }} </p>
                        <span :class="{up:pIndex == '2' && showCate}"></span>
                    </li>
                    <li @click="chooseCate(3)" v-if="isMember == 'true'">
                        <p>{{ teacherName }} </p>
                        <span :class="{up:pIndex == '3' && showCate}"></span>
                    </li>
                </ul>
            </div>
            <div class="tagContent" v-show="showCate">
                <ul v-show="pIndex == '0'">
                    <li @click="filterA(0,' ','全部分类')" :class="{active: categoryName == '全部分类'}">
                        全部分类
                        <span class="icon-yk_icon_select"></span>
                    </li>
                    <li v-for="(item,index) in cateList" @click="filterA(index, item.id, item.categoryName)" :class="{active: categoryName == item.categoryName}">
                        {{ item.categoryName }}
                        <span class="icon-yk_icon_select"></span>
                    </li>
                </ul>
                 <ul v-show="pIndex == '1' && isMember == 'true' && validContractCount != 0">
                    <li @click="filterB(0, '全部课程')" :class="{active:courseStatusTxt == '全部课程'}">
                        全部课程
                        <span class="icon-yk_icon_select"></span>
                    </li>
                    <li @click="filterB(1, '可预约课程')" :class="{active:courseStatusTxt == '可预约课程'}">
                        可预约课程 <span class="icon-yk_icon_select"></span>
                    </li>
                    <li @click="filterB(2, '已预约课程')" :class="{active:courseStatusTxt == '已预约课程'}">
                        已预约课程
                        <span class="icon-yk_icon_select"></span>
                    </li>
                </ul>
                <ul v-show="pIndex == '2'">
                    <li @click="filterC('', '全部时间')" :class="{active:startdayTxt == '全部时间'}">
                        全部时间
                        <span class="icon-yk_icon_select"></span>
                    </li>
                    <li @click="filterC(0, '最近7天')" :class="{active:startdayTxt == '最近7天'}">
                        最近7天
                        <span class="icon-yk_icon_select"></span>
                    </li>
                    <li @click="filterC(1, '最近14天')" :class="{active:startdayTxt == '最近14天'}">
                        最近14天
                        <span class="icon-yk_icon_select"></span>
                    </li>
                    <li @click="filterC(2, '最近30天')" :class="{active:startdayTxt == '最近30天'}">
                        最近30天
                        <span class="icon-yk_icon_select"></span>
                    </li>
                    <li @click="filterC(3, '只看周末')" :class="{active:startdayTxt == '只看周末'}">
                        只看周末
                        <span class="icon-yk_icon_select"></span>
                    </li>
                </ul>
                <ul v-show="pIndex == '3'">
                    <li v-for="(item,index) in teacherList" @click="filterD(index,item.id,item.name)" :class="{active:teacherName == item.name}">
                        {{ item.name }}
                        <span class="icon-yk_icon_select"></span>
                    </li>
                </ul>
            </div>
        </div>
        <listLay :listData="listData" myCourse="false" :validContractCount="validContractCount" :class="{paddingMore:fixedTop}"></listLay>

        <div class="popNotWrap big">
            <img src="../../../static/img/not_1.png" alt="" />
            <p>咦!?叔找不到哎!</p>
        </div>
        <div class="popBg" v-show="showCate" @click="showCate=false"></div>
        <div class="popBg than" v-show="showChooseAdd" @click="closeAddPop"></div>
        <div class="popRed than" v-show="showChooseAdd">
            <div class="img">
                <img src="../../../static/img/lesson.png" alt="" />
            </div>
            <div class="tip">选择您最近的上课门店</div>
            <div class="choose" :class="{min: addListDate.length < 4}">
                <p v-for="item in addListDate" @click="chooseAddFun(item.id, item.name)"  :class="{active: item.name == addressTxt}" >
                    <span class="icon icon-yk_icon_locate" v-show="item.name == addressTxt"></span>
                    {{ item.name }}
                </p>
            </div>
            <div class="close icon-yk_btn_clear" v-show="addressId" @click="closeAddPop"></div>
        </div>
        <div class="popBg than" v-show="changePhone" @click="changePhone = false"></div>
        <div class="popOr" v-show="changePhone">
            <div class="tip">确认退出当前帐号吗？</div>
            <div class="clearfix">
                <div class="fleft btn" @click="changePhone = false">取消</div>
                <div class="fright btn" @click="changeLogin()">确认</div>
            </div>
        </div>
    </section>
</template>

<script>
    import popMin from '@/components/popMin.js'
    import common from '@/components/common.js'
    import listLay from './list'

    export default {
        name: 'login',
        data () {
            return {
                pageTitle: '头部模版',
                showChooseAdd: false,
                fixedTop: false,
                cateList: '',
                pIndex: '',
                listData: '',
                addListDate: [],
                currentPage: 1,
                showCate: false,
                categoryId: this.$store.state.categoryId,  //分类id
                categoryName: this.$store.state.categoryName,
                courseStatus: this.$store.state.courseStatus,  //可预约  不可预约
                courseStatusTxt: this.$store.state.courseStatusTxt,     //可预约  不可预约文本
                startday: this.$store.state.startday,       //时间周期
                startdayTxt: this.$store.state.startdayTxt,   //时间文本
                addressId: '',
                addressTxt: this.$store.state.addressTxt,
                addressLen: '2',
                uid: '',
                categoryCount: '',
                changePhone: false,
                isMember: false,
                validContractCount: '',
                endListen: false,
                firstLoadData: true,
                teacherList:[],         //上课老师列表
                teacherId:this.$store.state.teacherId,            //筛选老师ID
                teacherName:this.$store.state.teacherName
            }
        },
        created () {
            var isLogin = this.$store.state.isLogin || localStorage.getItem('isLogin')

            if(isLogin == 'true' || isLogin == true){
                this.initDate()      //获取全局数据
                this.getCateList()   //获取分类列表

                if(this.$store.state.listLoaded == true){ //是否有缓存数据
                    this.currentPage = this.$store.state.currentPage
                    this.listData = this.$store.state.listData
                    this.$store.state.loadingTxt = ''
                    this.firstLoadData = false
                    // console.log(this.listData)
                }else{
                    // console.log("重新获取数据")
                    this.watchChange()
                    this.getAddList()    //获取地址列表
                }
            }
        },
        components: {
            listLay,
        },
        methods: {
            initDate:function(){
                var _this = this;
                this.isMember = localStorage.getItem('isMember') || this.$store.state.isMember

                this.categoryCount = this.$store.state.categoryCount || localStorage.getItem('categoryCount')
                this.validContractCount = this.$store.state.validContractCount || localStorage.getItem('validContractCount')

                this.categoryId = localStorage.getItem('categoryId') || this.$store.state.categoryId
                this.categoryName = localStorage.getItem('categoryName') || this.$store.state.categoryName

                if(this.isMember == false || this.isMember == 'false'){
                    this.courseStatus = 0
                }else{
                    this.courseStatus = localStorage.getItem('courseStatus') ||  this.$store.state.courseStatus
                    this.courseStatusTxt = localStorage.getItem('courseStatusTxt') ||  this.$store.state.courseStatusTxt
                }

                this.startday = localStorage.getItem('startday') || this.$store.state.startday
                this.startdayTxt = localStorage.getItem('startdayTxt') || this.$store.state.startdayTxt

                this.teacherId = localStorage.getItem('teacherId') || this.$store.state.teacherId || 0

                this.teacherName = localStorage.getItem('teacherName') || this.$store.state.teacherName || '全部老师'

                this.addressId = localStorage.getItem('addressId') || this.$store.state.addressId
                this.addressTxt = localStorage.getItem('addressTxt') || this.$store.state.addressTxt

                this.phone = localStorage.getItem('phone') || this.$store.state.phone
                this.uid = localStorage.getItem('uid') || this.$store.state.uid

                //获取上课老师列表
                var _listUrl = '/daydaycook/server/offline/reservationUser/teacherList.do?addressId='+this.addressId
                this.ajaxDataFun('post', _listUrl, function(obj){
                    if(obj.code = '200'){
                        obj.data.unshift({id:0,name:'全部老师'})
                        _this.teacherList = obj.data;
                    }
                })
                this.getAddList();
                // console.log("==================================")
                // console.log("isMember===> " + this.isMember)
                // console.log("phone===> " + this.phone)
                // console.log("uid===> " + this.uid)
                // console.log("==================================")

                // console.log("categoryId===> " + this.categoryId)
                // console.log("categoryName===> " + this.categoryName)

                // console.log("==================================")
                // console.log("startday===> " + this.startday)
                // console.log("startday===> " + this.startdayTxt)

                // console.log("==================================")
                // console.log("courseStatus===> " + this.courseStatus)
                // console.log("courseStatusTxt===> " + this.courseStatusTxt)

                // console.log("==================================")
                // console.log("addressId===> " + this.addressId)
                // console.log("addressTxt===> " + this.addressTxt)
                // console.log("==================================")
            },
            filterA:function(index, value, txt){  //筛选分类蛋糕/面点/烹饪
                this.categoryId = value
                this.categoryName = txt

                this.$store.state.categoryId = value
                this.$store.state.categoryName = txt

                localStorage.setItem('categoryId',value)
                localStorage.setItem('categoryName',txt)

                this.watchChange()
            },
            filterB:function(iv, txt){  //筛选课程状态 可约/不可约
                this.courseStatus = iv
                this.courseStatusTxt = txt

                this.$store.state.courseStatus = iv
                this.$store.state.courseStatusTxt = txt

                localStorage.setItem('courseStatus',iv)
                localStorage.setItem('courseStatusTxt',txt)

                this.watchChange()
            },
            filterC:function(iv, txt){ //筛选时间周期 /7/14/30
                this.startday = iv
                this.startdayTxt = txt

                this.$store.state.startday = iv
                this.$store.state.startdayTxt = txt

                localStorage.setItem('startday',iv)
                localStorage.setItem('startdayTxt',txt)

                this.watchChange()
            },
            filterD(index,teacherId,teacherName){
                this.teacherId = teacherId;
                this.teacherName = teacherName;
                this.$store.state.teacherName = teacherName;

                localStorage.setItem('teacherId',teacherId)
                localStorage.setItem('teacherName',teacherName)

                this.watchChange();
                // console.log(teacherId)
            },
            chooseAddFun:function(id, txt){ //切换地址
                this.showChooseAdd = false

                this.addressId = id
                this.addressTxt = txt

                this.$store.state.addressId = id
                this.$store.state.addressTxt = txt

                localStorage.setItem('addressId', id)
                localStorage.setItem('addressTxt', txt)

                this.watchChange()
            },
            chooseFun:function(){
                if(this.addressLen == '2'){
                    return
                }else{
                    this.showChooseAdd = true
                }
            },
            closeAddPop:function(){
                if(this.addressId){
                    this.showChooseAdd = false
                }
            },
            watchChange:function(){
                window.scrollTo(0, 0)
                this.endListen = false
                this.currentPage = 1
                this.showCate = false
                this.getList('')
            },
            getList:function(scroll){  //获取课程列表
                var _this = this
                var _listUrl = '/daydaycook/server/offline/reservationUser/offlineCourseList.do?startDay=' + this.startday +'&reservationType=' + this.courseStatus + '&categoryId=' + this.categoryId + '&pageSize=5' + '&currentPage=' + this.currentPage + "&mobile=" + this.phone + "&type=1&uid=" + this.uid + '&addressId=' + this.addressId;
                if(this.teacherId > 0){
                    _listUrl += '&teacherId='+this.teacherId
                }

                let el = document.querySelector('.isLoading')

                _this.$store.state.loadingTxt = '加载中...'
                this.ajaxDataFun('post', _listUrl, function(obj){
                    if(obj.code == '200'){
                        //先过滤不可预约课程
                        obj.data.list.map(function(item){
                            var arr = common.transTime(item.endTime-86400000);
                            var _time = arr[0]+'-'+arr[1]+'-'+arr[2]+' '+'20:00:00:00';
                            var date = new Date(_time);
                            var endTime = date.getTime();
                            var nowTime = +new Date();
                            return nowTime < endTime
                        })
                        var objLen = obj.data.list.length;
                        _this.firstLoadData = false
                        if(scroll){
                            if(objLen){
                                for(let j=0; j < objLen; j++){
                                    _this.listData.push(obj.data.list[j]);
                                }
                                // _this.listData = obj.data
                                _this.$set(_this.$data, 'listData', _this.listData);
                            }else{
                                console.log("加载完毕, 没有数据了")
                                _this.endListen = true
                                el.classList.add('line')
                                _this.$store.state.loadingTxt = '我们是有底线的'
                            }
                        }else{
                            el.classList.remove('line')
                            _this.$store.state.loadingTxt = ''
                            _this.listData = obj.data.list
                            _this.categoryCount = obj.data.categoryCount
                        }

                        _this.$store.state.categoryCount = obj.data.categoryCount
                        localStorage.setItem('categoryCount', obj.data.categoryCount)
                    }
                })
            },
            chooseCate:function(i){
                this.pIndex = i
                this.showCate = true
            },
            getAddList: function(){  //获取地址列表
                var _this = this
                var addUrl = '/daydaycook/server/offline/address/list.do?uid=' + this.uid
                this.ajaxDataFun('post', addUrl, function(obj){
                    if(obj.code == '200'){
                        var objLen = obj.data.length
                        _this.addressLen = objLen

                        if(objLen == 2){
                            _this.addressId = obj.data[1].id
                            _this.addressTxt = obj.data[1].name
                            _this.$store.state.addressId = obj.data[1].id
                            _this.$store.state.addressTxt = obj.data[1].name
                            localStorage.setItem('addressId', obj.data[1].id)
                            localStorage.setItem('addressTxt', obj.data[1].name)
                        }else{
                            // console.log(obj.data)
                            _this.addListDate = obj.data
                            var isSelectAdd = localStorage.getItem('addressId')
                            if(!isSelectAdd){
                                _this.showChooseAdd = true
                            }
                        }
                        _this.getList('')
                    }
                })
            },
            getCateList:function(){
                var _this = this
                var _cateUrl = '/daydaycook/server/offline/webcourse/categorylist.do?userId=' + this.uid;
                var _contUrl = '/daydaycook/server/contract/validContractCount.do?uid=' + this.uid

                this.ajaxDataFun('post', _cateUrl, function(obj){
                    if(obj.code == '200'){
                        _this.cateList = obj.data
                    }
                })

                this.ajaxDataFun('post', _contUrl, function(obj){
                    if(obj.code == '200'){
                        _this.validContractCount = obj.data
                        _this.$store.state.validContractCount = obj.data
                        localStorage.setItem('validContractCount', obj.data)

                        if(_this.validContractCount == 0){
                            _this.courseStatus = 0
                            _this.$store.state.courseStatus = 0
                            localStorage.setItem('courseStatus',0)
                        }
                    }
                })
            },
            changeLogin:function(){
                this.changePhone = false
                this.$store.state.isShowLogin = true
                document.body.className = 'overflow'
                localStorage.removeItem('isLogin')
                localStorage.removeItem('isMember')
                // localStorage.removeItem('uid')  //有可能刷新页面不能清除uid
                localStorage.removeItem('avar')
                localStorage.removeItem('phone')
                localStorage.removeItem('addressId')
                localStorage.removeItem('addressTxt')
                localStorage.removeItem('categoryId')
                localStorage.removeItem('categoryName')
                localStorage.removeItem('courseStatus')
                localStorage.removeItem('courseStatusTxt')
                localStorage.removeItem('startday')
                localStorage.removeItem('startdayTxt')
                localStorage.removeItem('nickName')
                localStorage.removeItem('lineUserName')
                localStorage.removeItem('indexPageY')
                localStorage.removeItem('newIndexPageY')
                localStorage.removeItem('validContractCount')
                localStorage.removeItem('categoryCount')
                localStorage.removeItem('phoneBack')
                localStorage.removeItem('teacherId')
                localStorage.removeItem('teacherName')
            }
        },
        mounted (){
            var _this = this;
            let py = localStorage.getItem('newIndexPageY')

            if(py){
                window.scrollTo(0, py)
            }

            window.onscroll = function(){
                let y = common.getScrollTop()
                let h = common.getWindowHeight()
                let s = common.getScrollHeight()

                _this.$store.state.indexPageY = y
                localStorage.setItem('indexPageY', y)

            　　 if(y >= 44){
                    _this.fixedTop = true
            　　 }else{
                    _this.fixedTop = false
                }

            　　if(y + h == s){
                    if(!_this.endListen && !_this.firstLoadData){
                        _this.currentPage++
                        _this.getList(1)
                    }
                    console.log("滑动加载:" + _this.currentPage)
            　　}
            }
        },
        computed: {
            isLogin:function(){
                return this.$store.state.isLogin || localStorage.getItem('isLogin')
            }
        },
        watch: {
            isLogin:function(){
                if(this.isLogin == 'true' || this.isLogin == true){
                    this.initDate()      //获取全局数据
                    this.getCateList()   //获取分类列表
                    this.getAddList()    //获取地址列表
                }
            },
            showChooseAdd:function(){
                if(this.showChooseAdd == true){
                    document.body.className = 'overflow'
                }else{
                    document.body.className = ''
                }
            },
            listData:function(){
                this.$store.state.listLoaded = true  //有储存列表值
                this.$store.state.currentPage = this.currentPage
                this.$store.state.listData = this.listData
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
<style type="text/css">
    html{ height:100%; }
</style>
