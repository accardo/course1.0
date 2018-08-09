<template>
    <div id="container">
        <v-title>{{ pageTitle }}</v-title>
        <article class="entrance">
            <section class="entrance-user">
                <img src="../../../static/img/profile.png" alt="">
                <!-- <img src="../../../static/img/pic_touxiang.png" alt=""> -->
                <dl>
                    <dt>Arki爱厨艺</dt>
                    <!-- <dd>剩余<strong>8</strong>次可预约，2021/11/22到期</dd> -->
                    <dd>您尚未购买课程，暂无约课权限</dd>
                </dl>
                <div class="nologin">点击登录</div>
            </section>
            <section class="entrance-bespoke">
                <div class="lately-bespoke">
                    <span>最近预约</span>
                    <p><span>上海K11体验店</span><span> | 张学世</span></p>
                </div>
                <div class="bespoke-time">
                    <img class="bespoke-img"  src="../../../static/img/c_shop0.jpg" alt="">
                    <dl>
                        <dt class="one-line">健康时蔬双色蛋糕卷蔬双色蛋糕双色蛋蛋糕双色蛋</dt>
                        <dd>9/23周六 15:00-17:00</dd>
                    </dl>
                </div>
                <img class="bespoke-bg" src="../../../static/img/pic_bear1.png" alt="">
            </section>
            <!-- 最新课程 -->
            <section class="entrance-model">
                <div class="entrance-tit">
                    <strong>最新课程</strong>
                    <span>查看更多</span>
                </div>
                <div class="lesson-list">
                    <div class="lesson-item">
                        <div class="lesson-img">
                            <img src="../../../static/img/c_shop0.jpg" alt="">
                            <span>体验课</span>
                            <div class="layer-box"></div>
                        </div>
                        <div class="lesson-info">
                            <p class="tit two-line">巧克力甜甜圈体验课巧克力甜甜圈体验课甜甜圈体验课</p>
                            <p class="lesson-p">9/23周六 15:00-17:00</p>
                            <p class="lesson-p">俞斌老师 | 剩余名额<strong>3</strong>人</p>
                        </div>
                    </div>
                    <div class="lesson-item">
                        <div class="lesson-img">
                            <img src="../../../static/img/c_shop0.jpg" alt="">
                            <span>体验课</span>
                            <div class="layer-box"></div>
                        </div>
                        <div class="lesson-info">
                            <p class="tit two-line">巧克力甜甜圈体验课巧克力甜甜圈体验课甜甜圈体验课</p>
                            <p class="lesson-p">9/23周六 15:00-17:00</p>
                            <p class="lesson-p">俞斌老师 | 剩余名额<strong>3</strong>人</p>
                        </div>
                    </div>
                    <div class="lesson-item">
                        <div class="lesson-img">
                            <img src="../../../static/img/c_shop0.jpg" alt="">
                            <span>体验课</span>
                            <div class="layer-box"></div>
                        </div>
                        <div class="lesson-info">
                            <p class="tit two-line">巧克力甜甜圈体验课巧克力甜甜圈体验课甜甜圈体验课</p>
                            <p class="lesson-p">9/23周六 15:00-17:00</p>
                            <p class="lesson-p">俞斌老师 | 剩余名额<strong>3</strong>人</p>
                        </div>
                    </div>
                    <div class="lesson-item">
                        <div class="lesson-img">
                            <img src="../../../static/img/c_shop0.jpg" alt="">
                            <span>体验课</span>
                            <div class="layer-box"></div>
                        </div>
                        <div class="lesson-info">
                            <p class="tit two-line">巧克力甜甜圈体验课巧克力甜甜圈体验课甜甜圈体验课</p>
                            <p class="lesson-p">9/23周六 15:00-17:00</p>
                            <p class="lesson-p">俞斌老师 | 剩余名额<strong>3</strong>人</p>
                        </div>
                    </div>
                </div>
            </section>
            <!-- 门店导航 -->
            <section class="entrance-model">
                <div class="entrance-tit">
                    <strong>门店导航</strong>
                </div>
                <div class="store-list">
                    <div class="lesson-item">
                        <div class="lesson-img">
                            <img src="../../../static/img/c_shop0.jpg" alt="">
                            <div class="layer-box"></div>
                        </div>
                        <div class="store-info lesson-info">
                            <p class="tit one-line">上海K11体验店</p>
                            <p class="lesson-p two-line">上海市淮海中路300号K11购物艺术中心B2层-11商铺 </p>
                        </div>
                    </div>
                    <div class="lesson-item">
                        <div class="lesson-img">
                            <img src="../../../static/img/c_shop0.jpg" alt="">
                            <div class="layer-box"></div>
                        </div>
                        <div class="store-info lesson-info">
                            <p class="tit one-line">上海K11体验店</p>
                            <p class="lesson-p two-line">上海市淮海中路300号K11购物艺术中心B2层-11商铺 </p>
                        </div>
                    </div>
                    <div class="lesson-item">
                        <div class="lesson-img">
                            <img src="../../../static/img/c_shop0.jpg" alt="">
                            <div class="layer-box"></div>
                        </div>
                        <div class="store-info lesson-info">
                            <p class="tit one-line">上海K11体验店</p>
                            <p class="lesson-p two-line">上海市淮海中路300号K11购物艺术中心B2层-11商铺 </p>
                        </div>
                    </div>
                </div>
            </section>
            <!-- 关于我们 -->
            <section class="entrance-about">
                <div class="entrance-tit">
                    <strong>关于我们</strong>
                </div>
                <div class="swiper-box">
                    <swiper-banner :swipelist="swipeList" :param = "bannerParam"></swiper-banner>
                </div>
               <div class="about-txt">
                    <p>在日日煮美食生活体验馆</p>
                    <p>我们和你通过厨艺课程</p>
                    <p class="mb20">一起持续、专注地探索和发现一切与美食相关的乐趣</p>
                    <p>让“吃“相关的一切感官体验得到淋漓极致的享受</p>
                    <p>一起将美味传递给更多人的同时</p>
                    <p>也带来与众不同的生活方式和乐趣</p>
                    <p class="mb20">辐射每一个平凡而闪亮的人</p>
               </div>
            </section>
        </article>
    </div>
</template>

<script>
    import common from '@/components/common';
    import VTitle from '@/components/title'
    import swiperBanner from '@/components/swiper'

    export default {
        name:'entrance',
        data () {
            return {
                pageTitle:'线下课程',
                swipeList:[],   //banner 图片
                bannerParam:{           //banner swiper 配置
                    auto:false,
                    swiperId:'aboutbanner',
                    showText:false,
                    delay:5000
                },
            }
        },
        created(){
            this.getbanner();
        },
        methods:{
            getbanner(){
                let swiperInfo = {
                    id:21,
                    imageUrl:'http://img0.daydaycook.com.cn/p/lh/lheroqxzbg.jpg',
                    pageId:1,
                }
                for(var i=0;i<=3;i++){
                    swiperInfo.id=i;
                    this.swipeList.push(swiperInfo);
                }
            }
        },
        components: {
        	common,
            VTitle,
            swiperBanner
        },
    }
</script>
<style>
   .entrance{
       width: 100%;
       height: auto;
       min-height: 100%;
   }
   .entrance-user{
       display:flex;
       padding: 30px 20px;
       flex-wrap: nowrap;
       align-items: center;
       box-sizing: border-box;
       width: 100%;

   }
   .entrance-user > img{
       display: inline-block;
       width: 50px;
       height: 50px;
       border-radius: 50%;
       margin-right: 10px;
       border:1px solid #fff;
       box-shadow:  0px 7px 5px rgba(148,148,148,0.2);
   }
   .entrance-user > dl > dt{
       font-size: 16px;
       font-weight: bold;
       color: #1a1a1a;
   }
   .entrance-user .nologin{
       display: none;
   }
   .entrance-user > dl > dd{
       font-size: 12px;
       color: #a5a4a4;
   }
   .entrance-user strong{
       color: #1a1a1a;
   }
   .entrance-user.no-user dl{
       display: none;
    }
    .entrance-user.no-user .nologin{
      font-size: 16px;
      color: #1a1a1a;
      font-weight: bold;
    }
   .entrance-bespoke{
       margin: 0 20px;
       position: relative;
       background-image: linear-gradient(43deg,#FFB179 0%, #FF6580 100%);
       border-radius: 8px; 
       padding: 10px;
       -webkit-box-shadow:1px 10px 15px rgba(255,177,121,.3); 
       box-shadow:1px 10px 15px rgba(255,177,121,.3);
   }
   .entrance-bespoke .bespoke-bg{
       position: absolute;
       right: 0;
       bottom: 0;
       width: 23%;
       max-width: 85px;
   }
   .lately-bespoke{
       display: flex;
       margin-bottom: 10px;
       justify-content: space-between;
   }
   .lately-bespoke span{
       color: #fff;
       font-size: 12px;
       font-weight: 600;
   }
  
   .bespoke-time{
       display: flex;
       justify-content: space-between;
       align-items: center;
   }
   .bespoke-time .bespoke-img{
       width: 70px;
       height: 40px;
       border-radius: 2px;
       margin-right: 10px;
   }
   
   .bespoke-time dl{
       flex: 2;
       margin-right: 20px;
       overflow: hidden;
   }
   .bespoke-time dt{
       font-size: 14px;
       font-weight: bold;
       color: #fff;
   }
   .bespoke-time dd{
       font-size: 12px;
       color: #fff;
       opacity: .8;
   }
   .entrance-model{
       padding: 40px 20px 0;
       box-sizing: border-box;

   }
   .entrance-tit{
       display: flex;
       justify-content: space-between;
       flex-wrap: nowrap;
       padding-bottom: 10px;
       box-sizing: border-box;
       align-items: flex-end;
   }
   .entrance-tit > strong{
       font-size: 24px;
       color: #000;
   }
   .entrance-tit > span{
       font-size: 12px;
       padding-right: 8px;
       color:#A5A4A4;
       background: url('../../../static/img/icon_arrow.png') no-repeat right center;
       background-size: 4px 8px;
   }
   .lesson-item{
       display: flex;
       margin-bottom: 10px;
       flex-wrap: nowrap;
       align-items: center;
   }
   .lesson-img{
       position: relative;
       width: 150px;
       margin-right: 10px;
   }
   .layer-box{
       position: absolute;
       left: 0;
       top: 0;
       bottom: 0;
       right: 0;
       background-color: rgba(0,0,0,1);
       opacity: 0;
       z-index: 11;
       transition: all .3s ease-in-out;
   }
   
   .lesson-img > img{
       display: inline-block;
       width: 150px;
       height: 82px;
       box-shadow: 1px 2px 3px rgba(0,0,0,.12); 
   }
   .lesson-img > span{
       position: absolute;
       display: inline-block;
       padding:3px;
       top:4px;
       right: 4px;
       transform: scale(.8);
       box-sizing: border-box;
       background-color: #000;
       font-size: 12px;
       color: #fff;
       border-radius: 3px;
       z-index: 10;
   }
   .lesson-info{
       flex: 2;
       overflow: hidden;
   }
   .lesson-info .tit{
       font-size: 16px;
       line-height: 20px;
       margin-bottom: 5px;
       color: #000;
   }
   .lesson-info .lesson-p{
       font-size: 12px;
       color: #a5a4a4;
       box-sizing: border-box;
   }
   .entrance-about .entrance-tit{
       padding: 20px 20px 10px;
       box-sizing: border-box;
   }
   .entrance-about .about-txt{
       margin: 0 20px;
   }

   .about-txt > p{
       font-size: 14px;
       color: #474747;
       letter-spacing: -0.2px;
       line-height: 22px;
   }

   .swiper-box{
        margin:10px 0 20px;
        width: 100%;
    }
   .mb20{
       margin-bottom: 20px;
   }

   .one-line {
        white-space: nowrap;
        -webkit-text-overflow: ellipsis;
        -moz-text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .two-line {
        display: -webkit-box;  
        -webkit-line-clamp: 2;  
        overflow: hidden;  
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /*! autoprefixer: on */
    }
</style>
