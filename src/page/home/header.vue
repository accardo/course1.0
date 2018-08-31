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
                              "f-icon-active": (getData.filterSubData.reservationType !== "" ||
                              getData.filterSubData.timeScope !== "" ||
                              getData.filterSubData.categoryId.length > 0 ||
                              getData.filterSubData.teacherId.length > 0)}'><!-- f-icon 筛选前， f-icon-active 筛选后 ； triangle 下三角，triangle-active 上三角-->
                    <div v-if="listFilter.packageList == null">无套餐</div>
                    <div v-else @click="()=> { pfShow.package = true; pfShow.filter = false;}">{{packageText}}<i></i></div>
                    <div @click="()=> { pfShow.filter = true; pfShow.package = false;}"><b></b>筛选</div>
                </div>
                <div class="package-tip" :class='{"package-tip-active": tip}'>不同套餐点此切换</div>
            </div>
            <div class="fication-content">
                <ul class="fication-package" v-show="pfShow.package" >
                    <li v-for="(item, index) in listFilter.packageList "
                        :class='{"active icon-yk_icon_select": index == listIndex}'
                        @click="packgeList(item.packageName, item.contractId, index)"
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
                </div>
                <div class="fication-button" v-show="pfShow.filter">
                    <span @click="filterClear">重置</span>
                    <span @click="filterSub">确定</span>
                </div>
            </div>
        </div>
       <listLay :get-data="getData" :is-refresh.sync="isRefresh" v-on:scroll-y="scrollY" ref="listRefresh"></listLay>
        <div  class="popNotWrap big">
            <img :src="imgIcon.img_1" alt="" />
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
                <img :src="imgIcon.img_2" alt="" />
            </div>
            <div class="tip">选择您最近的上课门店</div>
            <div class="choose" :class="{min: addListDate.length < 4}">
                <p v-for="item in addListDate" @click="chooseAddFun(item.id, item.name)"  :class="{active: item.name == addressTxt}" >
                    <span class="icon icon-yk_icon_locate" v-show="item.name == addressTxt"></span>
                    {{ item.name }}
                </p>
            </div>
            <div class="close icon-yk_btn_clear" v-show="getData.addressId" @click="closeAddPop"></div>
        </div>
    </section>
</template>

<script>
    import popMin from '@/components/popMin.js'
    import common from '@/components/common.js'
    import listLay from './list'
    import * as utils from '@/utils/logic'
    const logic = new utils.Logic();
    export default {
        name: 'login',
        data () {
            return {
                pageTitle: '头部模版',
                showChooseAdd: false, // 门店显示遮罩
                fixedTop: false,
                cateList: '',
                pIndex: '',
                listData: [],
                addListDate: [],
                showCate: false,
                categoryId: this.$store.state.categoryId,  //分类id
                categoryName: this.$store.state.categoryName,
                courseStatus: this.$store.state.courseStatus,  //可预约  不可预约
                courseStatusTxt: this.$store.state.courseStatusTxt,     //可预约  不可预约文本
                startday: this.$store.state.startday,       //时间周期
                startdayTxt: this.$store.state.startdayTxt,   //时间文本
                addressTxt: localStorage.getItem('addressTxt') || '选择门店地址',
                addressLen: '2',
                categoryCount: '',
                isMember: false, // 是否是会员
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
                listIndex: 0,
                packageText: '',
                tip: false,
               // listFilter: [],
                foldIs: false,
                listFilter: {
                    selectList: []
                },
                isRefresh: false, // 当筛选的时候是否执行子组件重新加载
                getData: { // 需要传的参数
                    uid: localStorage.getItem('uid') !== null ?  localStorage.getItem('uid') : '', // 用户id
                    phone: localStorage.getItem('phone') !== null ?  localStorage.getItem('phone') : '', // 电话
                    addressId: localStorage.getItem('addressId') !== null ?  localStorage.getItem('addressId') : '', // 门店地址
                    contractId: localStorage.getItem('contractId') !== null ?  localStorage.getItem('contractId') : '', // 套餐 id
                    userUniqueId:  localStorage.getItem('userUniqueId') !== null ?  localStorage.getItem('userUniqueId') : '', // 套餐id 编码
                    filterSubData: {
                        categoryId: [], // 分类id
                        teacherId: [], // 老师id
                        reservationType: '', // 条件
                        timeScope: '', // 时间
                    },
                },
                imgIcon: {
                    img_1: './static/img/not_1.png',
                    img_2: './static/img/tc_icon_mendian.png',
                },
            }
        },
        mounted (){
            this.$nextTick(()=> {
                this.initDate()      //获取全局数据
            })
        },
        components: {
            listLay,
        },
        methods: {
            initDate() {
                let  addressTxt = localStorage.getItem('addressTxt');
                let  addressId = localStorage.getItem('addressId');
                this.isMember =  localStorage.getItem('isMember');
                if (!addressTxt && !addressId) {
                    this.showChooseAdd = true;
                }
                if (addressId) {
                    this.tipShow();
                }
                this.initSelectList();
                this.memberClass();
                this.getAddList();
            },
            initSelectList() {
                let selectList = JSON.parse(localStorage.getItem('selectList'));
                let getData = JSON.parse(localStorage.getItem('getData'));
                if (selectList && getData) {
                    this.listFilter.selectList = selectList
                    this.getData = getData
                }
            },
            /*
             * Description: 获取筛选分类
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/13
             */
            memberClass() {
                let _cateUrl = `/daydaycook/server/offline/webcourse/filterList.do?uid=${this.getData.uid}&userUniqueId=${this.getData.userUniqueId}&addressId=${this.getData.addressId}`
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

                    if (data.packageList !== null) { // 有套餐需要把第一项赋值
                        let contractId = localStorage.getItem('contractId');
                        let packageText = localStorage.getItem('packageText');
                        let listIndex = localStorage.getItem('listIndex');
                        if (contractId && packageText) {
                            this.packageText = packageText;
                            this.getData.contractId = contractId;
                        } else {
                            this.packageText = data.packageList[0].packageName;
                            this.getData.contractId = data.packageList[0].contractId;
                        }
                        if (listIndex) {
                            this.listIndex = listIndex
                        }
                        localStorage.setItem('contractId', this.getData.contractId);
                        localStorage.setItem('packageText', this.packageText);

                    }
                     this.listFilter = data;
                     this.initSelectList();
                })
            },
            chooseAddFun:function(id, txt){ // 切换地址
                let getData = JSON.parse(localStorage.getItem('getData'));
                localStorage.setItem('addressTxt', txt);
                localStorage.setItem('addressId', id);
                this.getData = { // 切换重置 数据
                    phone: this.getData.phone,
                    addressId: id,
                    uid: this.getData.uid,
                    contractId: this.getData.contractId,
                    userUniqueId: this.getData.userUniqueId,
                    filterSubData: getData.filterSubData
                }
                localStorage.setItem("getData",JSON.stringify(this.getData));
                this.addressTxt = txt
                this.showChooseAdd = false;
                this.listFilter.selectList.forEach((item) => {
                    item.list.forEach((itemA) => {
                        this.$set(itemA, 'isActive', false)
                    })
                })
                this.memberClass();
                this.tipShow();
                this.isRefresh = true
            },
            chooseFun:function(){
                this.showChooseAdd = true
            },
            closeAddPop:function(){
                if(this.getData.addressId){
                    this.showChooseAdd = false
                }
            },
            getAddList() {  //获取地址列表
                var addUrl = `/daydaycook/server/offline/address/list.do?uid=${this.getData.uid}&userUniqueId=${this.getData.userUniqueId}`;
                this.ajaxDataFun('post', addUrl, (res) => {
                    if(res.code == '200') {
                        this.addListDate = res.data;
                    }
                })
            },
            /*
             * Description: 单选套餐
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/8
             */
            packgeList(txt, contractId, index ) {
                this.listIndex = index;
                this.pfShow.package = false;
                this.getData.contractId = contractId;
                this.packageText = txt;
                this.isRefresh = true;
                localStorage.setItem('contractId', contractId);
                localStorage.setItem('packageText', txt);
                localStorage.setItem('listIndex', index);
            },
            /*
             * Description: 第一次进入显示气泡
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/8
             */
            tipShow() {
                let tip = localStorage.getItem('tip');
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
               /* let docH = document.querySelector('.fication-content');
                alert(docH.clientHeight)*/
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
                    this.filterTh(dataA, 'timeScope');
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
                    this.getData.filterSubData[key] = data.id;
                } else {
                    this.getData.filterSubData[key] = '';
                }
            },
            /*
             * Description: 分类 教师  重复代码合并
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/15
             */
            filterTd(data, key) {
                if (data.isActive) {
                    this.getData.filterSubData[key].push(data.id);
                } else {
                    this.getData.filterSubData[key].forEach((item, index) => {
                        if (item == data.id) {
                            this.getData.filterSubData[key].splice(index, 1)
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
                this.isRefresh = true
                this.pfShow.package = false
                this.pfShow.filter = false
                localStorage.setItem("selectList",JSON.stringify(this.listFilter.selectList));
                localStorage.setItem("getData",JSON.stringify(this.getData));
               // this.$store.state.selectList = this.listFilter.selectList
            },
            /*
             * Description: 重置筛选条件
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/15
             */
            filterClear() {
                this.getData.filterSubData = {
                    categoryId: [],
                    teacherId: [],
                    reservationType: '',
                    timeScope: '',
                };
                this.listFilter.selectList.forEach((item) => {
                    item.list.forEach((itemA) => {
                        this.$set(itemA, 'isActive', false)
                    })
                })
            },
            /*
             * Description: 设置筛选条件是否浮动
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/21
             */
            scrollY(y) {
                if(y >= 44){
                    this.fixedTop = true
                }else{
                    this.fixedTop = false
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
                   // this.getCateList()   //获取分类列表
                    this.getAddList()    //获取地址列表
                }
            },
          /*  showChooseAdd:function(){
                if(this.showChooseAdd == true){
                    document.body.className = 'overflow'
                }else{
                    document.body.className = ''
                }
            },*/
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
        border-top: none;
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
        position: relative;
        margin-top: -1px;
        max-height: 388px;
        overflow:scroll;

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
        max-height: 388px;
        overflow:scroll;

        padding-bottom: 55px;
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
    .fication-filter dl.fold .fold-button button {
        padding: 5px;
    }
    .fication-button {
        border-top: 1px solid #eee;
        width: 100%;
        background: #fff;
        left: 0;
        bottom: 0;
        position: absolute;
        display: -webkit-flex;
        display: flex;
        height: 45px;
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

    /* 筛选后 无数据 */
    .popNotWrap-img {
        position: fixed;
        height: 100%;
        background-color: #fff;
        padding-bottom: 100px;
        text-align: center;
    }
    .popNotWrap-img.popnotimg{
        display: none;
    }
    .popNotWrap-img.big {
        padding-top: 24%
    }

    .popNotWrap-img.moreBig {
        padding-top: 43%
    }

    .popNotWrap-img img {
        width: 42.6666666667%
    }

    .popNotWrap-img p {
        font-size: 12px;
        color: #9B9B9B;
        margin-top: 3px
    }
</style>
