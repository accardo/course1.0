import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const state = {
    loadingTxt: '加载中...',
    isShowLogin: false,
    isLogin: false,
    uid: '',
    avar: '',
    nickName: '',
    lineUserName: '',
    isMember: false,
    phone: '',
    categoryId: ' ',   //分类id
    categoryName: '全部分类',      //分类名称
    courseStatus: '1',     //课程状态 可预约 不可预约
    courseStatusTxt: '可预约课程',      //约课状态名称
    startday: '',          //约课时间
    startdayTxt: '全部时间',        //约课时间文本
    addressId: '',
    addressTxt: '选择上课门店',
    listLoaded: false,
    listData: [],
    categoryCount: 0,
    validContractCount: '',
    indexPageY: 0,
    currentPage: 1,
}


export default new Vuex.Store({
    state,
});