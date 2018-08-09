<template>
    <div>
        <div class="swiper-container  img-swiper" :id="swiperId" :ref="swiperId" v-if="param.switchOpen == 1">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in swipelist" :key="item.id">
                    <a v-if="item.link" :href="item.link">
                        <img :src="item.imageUrl || item.thumb" />
                    </a>
                    <img v-if="!item.link" :src="item.imageUrl || item.thumb" />
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
        <div class="swiper-member" :id="swiperId" :ref="swiperId"  v-if="param.switchOpen == 2">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in swipelist" :key="">
                    <strong class="member-title">{{item.title}}</strong>
                    <div class="member-date">{{item.date | formatDate }}到期</div>
                    <div class="member-num">剩余<b>{{item.num}}</b>次可预约</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Swiper from 'swiper/dist/js/swiper.min.js';
    import 'swiper/dist/css/swiper.css';
    export default {
        name: 'swipernew',
        data() {
            return {
                pageTitle: 'banner',
                swiperId: 'swiperbanner',
                mySwiper: ''
            }
        },
        props: ['swipelist', 'param'],
        mounted() {
            this.setImglist();
        },
        updated() {
            this.setImglist();
        },
        methods: {
            setImglist() {
                //根据参数 设置swiper 展示方式
                let { param = {}, swipelist = [] } = this.$props;
                this.swiperId = param.swiperId; //实例化swiper 的配置参数  id为  indexseckill || infospaceswiper 时显示title
                let pagination = (this.swiperId.indexOf('infospaceswiper') > -1 || this.swiperId == 'indexseckill') ? '' : '.swiper-pagination';
                this.$nextTick(() => {
                    if (this.mySwiper) {
                        // 如果存在 清除swiper 重新实例化
                        this.mySwiper.destroy();
                    }
                    this.mySwiper = new Swiper(`#${this.swiperId}`, {
                        loop: swipelist.length > 1 ? true : false,              //循环播放
                        autoplay: param.auto || false,
                        delay: param.delay || 5000,     //自动播放间隔
                        slidesPerView: 'auto',
                        observer: true,
                        disableOnInteraction: false,
                        observeParents: true,
                        preventClicks: false,
                        centeredSlides: true,
                        preloadImages: true,
                        updateOnImagesReady: true,
                        spaceBetween: 10,
                        watchOverflow: true,
                        pagination: {
                            el: pagination
                        },
                        on: {
                            //解决 手动滑动后 不自动轮播
                            slideChangeTransitionEnd: function () {
                                if (param.auto) {
                                    this.autoplay.start()
                                }
                            }
                        }
                    })
                })
            }
        }
    }
</script>
<style>
    .swiper-container {
        width: 100%;
        height: 100%;
        overflow: initial;
    }

    .swiper-container.showtxt {
        overflow: initial;
    }

    .img-swiper .swiper-slide {
        text-align: center;
        font-size: 18px;
        width: 90%;
        display: flex;
        box-shadow: 1px 2px 10px rgba(0,0,0,.2);
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    .img-swiper .swiper-slide img,
    .img-swiper .swiper-slide>a {
        display: block;
        width: 100%;
        height: 100%;
    }
    .img-swiper .swiper-slide img{
        box-shadow: 1px 1px 10px rgba(0,0,0,.1);
    }

    /* 有文字说明时追加的class 名称 */

    .img-swiper.showtxt .swiper-slide img,
    .img-swiper.showtxt .swiper-slide a {
        display: block;
        border-radius: 8px;
    }

    .img-swiper.showtxt .swiper-slide {
        flex-wrap: wrap;
        align-items: flex-start;
    }

    .img-swiper.showtxt .swiper-pagination {
        bottom: .3rem !important;
    }

    .img-swiper .swiper-slide .swiper-tite {
        width: 100% !important;
        text-align: left !important;
        font-size: 14px;
        font-weight: bold;
        margin-top: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #000;
        overflow: hidden;
    }

    .img-swiper .swiper-pagination-bullet {
        width: 4px !important;
        height: 4px !important;
        background-color: #7A7A7C !important;
        border: 1px solid #fff;
    }

    .img-swiper .swiper-pagination-bullet-active {
        background-color: #fff !important;
        border: 1px solid #7A7A7C;
    }
    /* 会员 样式 */
    .swiper-member {
        margin-top: -20px;
    }
    .swiper-member .swiper-slide {
        padding: 20px;
        width: 90%;
        height: 107px;
        background: #fff;
        box-shadow: 1px 1px 5px 0 rgba(0,0,0,0.05);
        border-radius: 8px;
    }
    .swiper-member .swiper-slide:after {
        content: '';
        background: url("../../static/img/pic_bear1.png") no-repeat;
        background-size: cover;
        width: 83px;
        height: 64px;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 1;
    }
    .swiper-member .member-title {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 16px;
        color: #1a1a1a;
    }
    .swiper-member .member-date {
        font-size: 12px;
        color: #A5A4A4;
    }
    .swiper-member .member-num {
        margin-top: 10px;
        font-size: 12px;
        color: #A5A4A4;
    }
    .swiper-member .member-num b{
        font-size: 16px;
        color: #000;
    }
</style>
