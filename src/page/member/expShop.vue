<template>
    <div>
        <div class="swiper-box">
             <swiper-banner :swipelist="swipeList" :param = "bannerParam"></swiper-banner>
        </div>
        <div class="exp-shop">
            <h4>日日煮美食生活体验馆上海K11体验店</h4>
            <ul>
                <li>甜点</li>
                <li>料理</li>
                <li>面点</li>
                <li>亲子</li>
                <li>高阶课</li>
            </ul>
            <div class="exp-time-address">
                <div class="exp-time"><i></i>营业时间 10:00-22:00</div>
                <div class="exp-address">
                    <div class="exp-coor"><i></i></div>

                    <div class="exp-addr">
                        <router-link :to="{ name: 'AMap' }">
                            上海市黄浦区淮海中路300号K11艺术购物 地铁1号线黄陂南路2号出口50m
                        </router-link>
                    </div>
                    <div class="exp-iphone" @click="isIphone = true"></div>
                </div>
            </div>
        </div>
        <div class="exp-main">
            <h4><i></i>门店服务</h4>
            <div class="exp-content">
                1111
            </div>
        </div>
        <div class="exp-shop-bg">
            <button class="exp-shop-button" type="button">查看课程</button>
        </div>
        <dia-iphone :is-iphone.sync="isIphone" v-if="isIphone"></dia-iphone>
    </div>
</template>

<script>
    import swiperBanner from '@/components/swiper'
    import diaIphone from '@/components/diaIphone'
    export default {
		data() {
		    return {
                isIphone: false,
                bannerParam:{           //banner swiper 配置
                    auto:false,
                    swiperId:'aboutbanner',
                    showText:false,
                    delay:5000,
                    switchOpen: 1,
                },
                swipeList: [
                    {
                        id:1,
                        imageUrl:'http://img0.daydaycook.com.cn/p/lh/lheroqxzbg.jpg',
                        pageId:1,
                    },
                    {
                        id:2,
                        imageUrl:'http://img0.daydaycook.com.cn/p/lh/lheroqxzbg.jpg',
                        pageId:2,
                    },
                    {
                        id:3,
                        imageUrl:'http://img0.daydaycook.com.cn/p/lh/lheroqxzbg.jpg',
                        pageId:3,
                    }
                ]
            }
        },
        methods:{

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
    }
    .exp-main h4 {
        font-size: 18px;
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
