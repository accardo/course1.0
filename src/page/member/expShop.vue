<template>
    <div>
        <div class="swiper-box" v-if="swipeList.length >0">
             <swiper-banner :swipelist="swipeList" :param = "bannerParam"></swiper-banner>
        </div>
        <div class="exp-shop">
            <h4>{{shopInfo.brand}}{{shopInfo.name}}</h4>
            <ul v-if="shopInfo.lable && shopInfo.lable.length >0 ">
                <li v-for="(item,index) in shopInfo.lable" :key="index">{{item}}</li>
                <!-- <li>料理</li>
                <li>面点</li>
                <li>亲子</li>
                <li>高阶课</li> -->
            </ul>
            <div class="exp-time-address">
                <div class="exp-time"><i></i>营业时间 {{shopInfo.startTime}}-{{shopInfo.endTime}}</div>
                <div class="exp-address">
                    <div class="exp-coor"><i></i></div>
                    <div class="exp-addr" @click="goMap">
                        {{shopInfo.address}}
                    </div>
                    <div class="exp-iphone" @click="isIphone = true"></div>
                </div>
            </div>
        </div>
        <div class="exp-main">
            <h4><i></i>门店服务</h4>
            <div class="exp-content" v-html="shopInfo.introduce"></div>
        </div>
        <div class="exp-shop-bg">
            <button class="exp-shop-button" @click="lookcourse" type="button">查看课程</button>
        </div>
        <dia-iphone :phone-array="shopInfo.phone" :is-iphone.sync="isIphone" v-if="isIphone"></dia-iphone>
    </div>
</template>

<script>
    import swiperBanner from '@/components/swiper'
    import diaIphone from '@/components/diaIphone'
    import * as util from '@/utils/utils.js'
    export default {
		data() {
		    return {
                isIphone: false,
                shopid:'',      //店铺id
                bannerParam:{           //banner swiper 配置
                    auto:false,
                    swiperId:'aboutbanner',
                    showText:false,
                    delay:5000,
                    switchOpen: 1,
                },
                shopInfo:[],        //获取到的 店铺信息
                swipeList: [],
            }
        },
        created(){
            let query = this.$router.history.current.query;
            if(query && query.id){
                this.shopid = query.id;
                this.init();
            }
        },
        methods:{

            /* 初始化 */
            init(){
                let self = this;
                let _listUrl = '/daydaycook/server/newCourse/getAddressInfoByAid.do?aid='+this.shopid;
                this.ajaxDataFun('get',_listUrl, function(res){
                    if(res.code =='200' && res.list){
                        self.shopInfo = res.list[0];
                        let shopData = res.list[0];
                        if(shopData.phone){
                            shopData.phone = shopData.phone.split(',');
                        }
                        if(shopData.lable){
                            shopData.lable = shopData.lable.split(',');
                        }
                        if(shopData.image && shopData.image.length >0){
                            shopData.image.map(item => {
                                let imageUrl = item +'?x-oss-process=image/resize,w_750';
                                self.swipeList.push({imageUrl})
                            })
                        }
                        self.shopInfo = shopData;
                    }
                })
            },

            /* 跳转到 地图 */
            goMap(){
                let self = this;
                let xxkc_gps = sessionStorage.getItem('xxkc_gps');
                let mapUrl = `https://uri.amap.com/navigation?from=${xxkc_gps},我的位置,&via=${self.shopInfo.gps},${self.shopInfo.name},&mode=car&src=DDC LIFE&callnative=1`
                if (typeof ddcApp !== 'object') {
                    window.open(mapUrl)
                }
                /*util.checkDdcApp((isApp)=> {
                    if (isApp) {
                       console.log(self.shopInfo.gps, self.shopInfo.name, self.shopInfo.address, '进入app1');
                      // return false;
                        // 调用地图导航API
                        ddcApp.navMap({
                            latitude : self.shopInfo.gps.split(',')[1],
                            longitude: self.shopInfo.gps.split(',')[0],
                            title : self.shopInfo.name,
                            subTitle : self.shopInfo.address
                        })

                    } else {
                        // 调启高德App导航
                        window.open(mapUrl)
                    }
                })*/
            },

            /* 查看课程*/
            lookcourse(){
                let params = {
                    that: this,
                    router: 'entrance',
                    title: '课程列表',
                    query: {shopid:this.shopid}
                }
                localStorage.setItem(
                    'addressId', this.shopid)
                localStorage.setItem('addressTxt', this.shopInfo.name);
                util.navTo(params);
            },
        },
        components: {
            swiperBanner,
            diaIphone
        },
	}
</script>

<style scoped>
    .swiper-box{
        margin:10px 0 20px;
        width: 100%;
    }
    .exp-shop {
        margin: 20px;
    }
    .exp-shop h4{
        display: block;
        font-size: 20px;
        color: #1a1a1a;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .exp-shop ul {
        margin-top: 10px;
    }
    .exp-shop ul li{
        padding: 0px 6px;
        display: inline-block;
        margin-right:7px;
        background: #eee;
        border-radius: 2px;
        color: #7F7F7F;
        text-align: center;
        line-height: 24px;
    }
    .exp-time-address {
        margin-top: 26px;
    }
    .exp-time-address .exp-time{
        color: #1a1a1a;
        font-size: 14px;
    }
    .exp-time-address .exp-time i {
        margin-right: 5px;
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url("../../../static/img/mdxq_icon_time.png") no-repeat;
        background-size: cover;
        vertical-align: middle;
    }
    .exp-time-address .exp-address {
        margin-top: 12px;
        display: flex;
        display: -webkit-flex;
    }
    .exp-time-address .exp-address .exp-coor {
    }
    .exp-time-address .exp-address .exp-coor i {
        margin-right: 5px;
        display: inline-block;
        width: 15px;
        height: 16px;
        background: url("../../../static/img/mlgb_icon_add.png") no-repeat;
        background-size: cover;
        vertical-align: middle;
    }
    .exp-time-address .exp-address .exp-addr {
        padding-right: 20px;
        width: 85%;
        border-right: 1px solid #c4c4c4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /*! autoprefixer: on */
    }
    .exp-time-address .exp-address .exp-addr a {
        color: #1a1a1a;
    }
    .exp-time-address .exp-address .exp-iphone {
        margin-left: 12px;
        display: inline-block;
        width: 36px;
        height: 36px;
        background: url("../../../static/img/mdxq_icon_phone.png") no-repeat;
        background-size: cover;
    }
    .exp-main {
        padding-top: 16px;
        padding-bottom: 30px;
        box-sizing: border-box;
    }
    .exp-main h4 {
        font-size: 18px;
        margin-bottom: 20px;
        color: #1a1a1a;
    }
    .exp-main h4 i {
        margin-right: 16px;
        width: 4px;
        height: 15px;
        display: inline-block;
        background-image: linear-gradient(45deg, #FF6583 0%, #FF794D 46%, #FFBE67 100%);
    }
    .exp-shop-bg {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
        background: url("../../../static/img/bottombar_mengceng@3x.png") no-repeat;
        background-size: cover;
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-align-items: center;
        align-items: center;
    }
    .exp-shop-button {
        width: 72%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #fff;
        background-image: linear-gradient(45deg, #393939 0%, #2F2F2F 100%);
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.20);
        border-radius: 100px;
    }
</style>
