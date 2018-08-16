<template>
   <section> <!-- filter-fixed 当筛选时 固定屏幕-->
        <div id="top">
            <div class="topBar justify">
                <div class="box left" @click="chooseFun">
                    <span class="icon icon-yk_icon_locate"></span>
                    <p>{{ addressTxt }}</p>
                </div>
            </div>
        </div>
        <div class="classification" :class='{"filter-fixed":fixedTop}'>
            <div class="fication-head">
                <div class="fication-flex triangle f-icon"
                     :class='{"triangle-active": pfShow.package,
                              "f-icon-active": (filterSubData.reservationType !== null ||
                              filterSubData.startDay !== null ||
                              filterSubData.categoryId.length > 0 ||
                              filterSubData.teacherId.length > 0)}'><!-- f-icon 筛选前， f-icon-active 筛选后 ； triangle 下三角，triangle-active 上三角-->
                    <div v-if="isMember == 'false'">非会员</div>
                    <div v-else @click="()=> { pfShow.package = true; pfShow.filter = false;}">{{packageText}}<i></i></div>
                    <div @click="()=> { pfShow.filter = true; pfShow.package = false;}"><b></b>筛选</div>
                </div>
                <div class="package-tip" :class='{"package-tip-active": tip}'>不同套餐点此切换</div>
            </div>
            <div class="fication-content">
                <ul class="fication-package" v-show="pfShow.package" >
                    <li v-for="(item, index) in listFilter.packageList "
                        :class='{"active icon-yk_icon_select": index == listIndex}'
                        @click="packgeList(item.packageName,item.packageId, index)"
                    >{{item.packageName}}</li>
                </ul>
                <div class="fication-filter" v-show="pfShow.filter">
                    <dl v-for="(item) in listFilter.selectList"
                        :class="{fold: item.title === '教师', 'fold-active': foldIs}"
                        v-if="item.list.length > 0"
                    >
                        <dt>{{item.title}}</dt>
                        <dd v-for="(itemA, indexA) in item.list"
                            :class="{active: itemA.isActive}"
                            @click="filterList(item, itemA, itemA.isActive, indexA)"
                        >
                            {{itemA.name}}
                        </dd>
                        <div class="fold-button" v-if='item.title === "教师" && item.list.length > 6'>
                            <button @click="() => {foldIs = !foldIs}">{{foldIs ? '收起' : '展开'}}</button>
                        </div>
                    </dl>
                    <div class="fication-button">
                        <span @click="filterClear">重置</span>
                        <span @click="filterSub">确定</span>
                    </div>
                </div>
            </div>
        </div>

        <listLay :listData="listData" myCourse="false" :validContractCount="validContractCount" ></listLay>
        <div class="popNotWrap big">
            <img src="../../../static/img/not_1.png" alt="" />
            <p>咦!?找不到哎!</p>
        </div>
       <!-- 筛选遮罩层-->
        <div class="popBg"
             v-show="pfShow.package || pfShow.filter"
             @click="()=> {pfShow.package = false; pfShow.filter = false}"
        ></div>
        <div class="popBg than" v-show="showChooseAdd" @click="closeAddPop"></div>
        <div class="popRed than" v-show="showChooseAdd">
            <div class="img">
                <img src="../../../static/img/tc_icon_mendian.png" alt="" />
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
    </section>
</template>

<script>
    import popMin from '@/components/popMin.js'
    import common from '@/components/common.js'
    import listLay from './list'
    import * as dict from '@/dictionary/dict'
    import * as utils from '@/utils/logic'
    const logic = new utils.Logic();
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
                isMember: false,
                validContractCount: '',
                endListen: false,
                firstLoadData: true,
                teacherList:[],         //上课老师列表
                teacherId:this.$store.state.teacherId,            //筛选老师ID
                teacherName:this.$store.state.teacherName,
                pfShow: {
                    package: false,
                    filter: false
                },
                // 假数据
                listIndex: '',
                packageText: '',
                tip: false,
               // listFilter: [],
                foldIs: false,
                listFilter: {},
                filterSubData: {
                    categoryId: [],
                    teacherId: [],
                    reservationType: null,
                    startDay: null,
                },
                packageId: 0,
                pageSize: 5,
            }
        },
        created () {
            var isLogin = this.$store.state.isLogin || localStorage.getItem('isLogin')

            if(isLogin == 'true' || isLogin == true){
                console.log(this.showChooseAdd, 'showChooseAdd')
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
                this.memberClass();
                this.getAddList();
            },
            /*
             * Description: 获取筛选分类
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/13
             */
            memberClass() {
                // let _cateUrl = `/daydaycook/server/offline/webcourse/filterList.do?userId=${this.uid}&addressId=${this.addressId}`
                let _cateUrl = '/daydaycook/server/offline/webcourse/filterList.do?userId=11&addressId=2';
                logic.ajaxGetData(_cateUrl).then(({data}) => {
                    data.selectList.forEach((item) => {
                        item.pick = 2
                        if (item.title =='条件' || item.title == '时间') {
                            item.pick = 1
                        }
                        item.list.forEach((itemA) => {
                            this.$set(itemA, 'isActive', false)
                        })
                    })
                    if (this.isMember == true) {
                        this.packageText = data.packageList[0].packageName;
                        this.packageId = data.packageList[0].packageId;
                    }
                     this.listFilter = data;
                })
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
                this.tipShow();
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
                 //var _listUrl = '/daydaycook/server/offline/reservationUser/offlineCourseList.do?startDay=' + this.startday +'&reservationType=' + this.courseStatus + '&categoryId=' + this.categoryId + '&pageSize=5' + '&currentPage=' + this.currentPage + "&mobile=" + this.phone + "&type=1&uid=" + this.uid + '&addressId=' + this.addressId;
                 var _listUrl = '/daydaycook/server/offline/reservationUser/offlineCourseListNew.do?reservationType=0&pageSize=5&currentPage=1&addressId&categoryId&mobile=18616592129&uid=11&packageId=1';
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
                             console.log(obj.data)
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
                /*  var _cateUrl = '/daydaycook/server/offline/webcourse/categorylist.do?userId=' + this.uid;*/
                var _contUrl = '/daydaycook/server/contract/validContractCount.do?uid=' + this.uid

              /*  this.ajaxDataFun('post', _cateUrl, (obj) => {
                    if(obj.code == '200'){
                        this.listFilter[1].list= obj.data
                    }
                })
*/
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
            /*
             * Description: 单选套餐
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/8
             */
            packgeList(txt, packageid, index) {
                this.listIndex = index;
                this.pfShow.package = false;
                this.packageId = packageid;
                this.packageText = txt;
            },
            /*
             * Description: 第一次进入显示气泡
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/8
             */
            tipShow() {
                let tip = localStorage.getItem('tip');
                console.log(tip, '1')
                if (!tip) {
                    this.tip = true
                    setTimeout(()=> {
                        this.tip = false
                        localStorage.setItem('tip', true);
                    }, 5000)
                }
            },
            /*
             * Description: 选择
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/13
             */
            filterList(data, dataA, isActive, indexA) {
                if (data.pick === 1) { // 单选 互斥
                    data.list.map((item, index) => {
                        item.isActive = false
                        if (index == indexA) {
                            item.isActive = true
                        }
                        data.list[indexA].isActive = !isActive
                    })
                } else if(data.pick === 2){ // 多选 互斥
                    dataA.isActive = !isActive
                }
                if (data.title === '条件') {
                    this.filterTh(dataA, 'reservationType');
                }else if(data.title === '时间') {
                    this.filterTh(dataA, 'startDay');
                }else if(data.title === '分类') {
                    this.filterTd(dataA, 'categoryId');
                } else if (data.title === '教师') {
                    this.filterTd(dataA, 'teacherId');
                }
            },
            /*
             * Description: 条件 时间 重复代码合并
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/16
             */
            filterTh(data, key) {
                if (data.isActive) {
                    this.filterSubData[key] = data.id;
                } else {
                    this.filterSubData[key] = null;
                }
            },
            /*
             * Description: 分类 教师  重复代码合并
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/15
             */
            filterTd(data, key) {
                if (data.isActive) {
                    this.filterSubData[key].push(data.id);
                } else {
                    this.filterSubData[key].forEach((item, index) => {
                        if (item == data.id) {
                            this.filterSubData[key].splice(index, 1)
                        }
                    })
                }
            },
            /*
             * Description: 提交筛选数据
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/15
             */
            filterSub() {
                let fromData = {
                    startDay: this.filterSubData.startDay, // 时间id
                    reservationType: this.filterSubData.reservationType, // 条件id type Array
                    categoryId: this.filterSubData.categoryId.length > 0 ? this.filterSubData.categoryId : null, // 分类id type Array
                    teacherId: this.filterSubData.teacherId.length > 0 ? this.filterSubData.teacherId : null, // 教师id
                    packageId: this.packageId || null, // 套餐id
                    pageSize: this.pageSize, // 条数
                    currentPage: this.currentPage, // 页数
                    mobile: this.phone, // 电话
                    uid: Number(this.uid), // 用户id
                    addressId: Number(this.addressId), // 店铺id
                }
                this.pfShow.package = false
                this.pfShow.filter = false
                console.log(fromData);
            },
            /*
             * Description: 重置筛选条件
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/15
             */
            filterClear() {
                this.filterSubData = {
                    categoryId: [],
                    teacherId: [],
                    reservationType: null,
                    startDay: null,
                };
                this.listFilter.selectList.forEach((item) => {
                    item.list.forEach((itemA) => {
                        this.$set(itemA, 'isActive', false)
                    })
                })
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
            },
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
<style type="text/css" scoped>
    html{ height:100%; }
    .popRed {
        width: 72%;
        background: #FFFFFF;
        border-radius: 8px;
        height: 390px;
    }
    .popRed .img{
        box-shadow: 0 3px 8px 0 rgba(255,82,105,0.30);
    }
    .popRed .tip {
        font-size: 16px;
        color: #1A1A1A;
        line-height: 16px;
    }
    .popRed .choose p {
        background: #F8F8F8;
        border-radius: 100px;
        color: #1A1A1A;
        border: none;
    }
    .popRed .choose p.active {
        background-image: linear-gradient(45deg, #393939 0%, #2F2F2F 100%);
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.20);
        border-radius: 100px;
        color: #fff;
    }
    .topBar {
        line-height: inherit;
        height: auto;
        padding: 8px 10px;
    }
    .topBar .left {
        background: #F8F8F8;
        border-radius: 100px;
        padding: 6px 12px;
    }
    /*筛选功能重写*/
    .mask-pop {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0, 0.5);
        overflow: hidden;
        z-index: 800;
    }

    .classification {
        position: relative;
        width: 100%;
        z-index: 1002;
        margin-top: -1px;
    }
    .fixed-fication {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1002;
    }
    .filter-fixed {
        position: fixed;
        top: 0;
        z-index: 1002;
    }
    .fication-head {
        background: #fff;
        position: relative;
    }
    .package-tip {
        display: none;
        background: url("../../../static/img/kclb_pic_tishi.png") no-repeat;
        background-size: cover;
        width: 116px;
        height: 30px;
        font-size: 12px;
        color: #fff;
        line-height: 34px;
        text-align: center;
        position: absolute;
        left: 10px;
        top: 35px;
        z-index: 1;
    }
    .package-tip-active {
        display: block;
    }
    .fication-flex {
        border-bottom: #eee solid 1px;
        padding: 12px 10px;
        display: -webkit-flex;
        display: flex;
        -webkit-align-content: space-between;
        justify-content: space-between;;
        -webkit-align-items: center;
        align-items: center;
    }
    .fication-flex i {
        display: inline-block;
        width: 0;
        height: 0;
        vertical-align: middle;
        margin-left: 4px;
    }
    .triangle i{
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-top: 4px solid #474747;
    }
    .triangle-active i{
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-bottom: 4px solid #474747;
    }
    .fication-flex b{
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: middle;
    }
    .f-icon div:last-of-type {
        color: #474747;
    }
    .f-icon-active div:last-of-type {
        color: #FF5269;
    }
    .f-icon b {
        background: url("../../../static/img/kclb_icon_shaixuan_black.png") no-repeat;
        background-size: cover;
        margin-right: 4px;
    }
    .f-icon-active b{
        background: url("../../../static/img/kclb_icon_shaixuan_red.png") no-repeat;
        background-size: cover;
        margin-right: 4px;
    }
    .fication-content {
        margin-top: -1px;
        max-height: 388px;
        overflow-x: auto;
    }
    .fication-package {
        border-top: #eee solid 1px;
        background: #fff;
        animation-duration: 2s;
    }
    .fication-package li{
        position: relative;
        margin-left: 10px;
        border-top: #eee solid 1px;
        height: 44px;
        line-height: 44px;
    }
    .fication-package li:first-of-type {
        border: 0;
    }
    .fication-package li.active{
        color: #FF5269;
    }
    .fication-package li.active:before {
        position: absolute;
        right: 14px;
        top: 0px;
    }
    .fication-filter {
        background: #fff;
    }
    .fication-filter dl {
        padding: 20px 20px 20px 20px;
        color: #474747;
    }
    .fication-filter dl dt {
        display: block;
        font-weight: bold;
    }
    .fication-filter dl dd {
        display: inline-block;
        margin: 5px;
        width: 30%;
        height: 30px;
        background: #f8f8f8;
        border-radius: 100px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
    }
    .fication-filter dl dd.active {
        background: #FFF6F7;
        color: #FF5269;
    }
    .fication-filter dl.fold {
        height: 141px;
        overflow: hidden;
        position: relative;
    }
    .fication-filter dl.fold-active {
        height: auto;
    }
    .fication-filter dl.fold .fold-button {
        width: 100%;
        background: #fff;
        text-align: center;
        position: absolute;
        bottom: -2px;
        margin-left: -25px;
    }
    fold-active
    .fication-filter dl.fold .fold-button button {
        padding: 5px;
    }
    .fication-button {
        display: -webkit-flex;
        display: flex;
        height: 45px;
        margin-top: 20px;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-align-items: center;
        align-items: center;
    }
    .fication-button span {
        margin: 0 5px;
        display: inline-block;
        width: 105px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border-radius: 100px;
    }
    .fication-button span:first-of-type {
        border: 1px solid #7F7F7F;
        background: #fff;
        color: #1A1A1A;
    }
    .fication-button span:last-of-type {
        background-image: linear-gradient(45deg, #393939 0%, #2F2F2F 100%);
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.20);
        color: #fff;
    }
</style>
