<template>
    <div class="goods-list" 
         v-if="goodsList && goodsList.length > 0">
        <div class="goods-item flex-row" 
             v-for="(item, index) in goodsList"
             :key="item.id"
             v-if="(!showMore && 3 > index) || showMore"
             @click.stop="goToProductDetail(item.id)">
            <img v-if="item.thumb" :src="item.thumb + '?imageView/1/w/750/h/750'" alt="">
            <img v-else :src="'../../static/img/logo.png'" alt="">
            <div class="goods-info flex-column cc">
                <div class="name">{{item.productName}}</div>
                <div class="flex-row cb ac">
                    <span class="price"><span>￥</span>{{item.price}}</span>
                    <span class="buy-btn">立即购买</span>
                </div>
            </div>
        </div>
        <div class="flex-column cc ac" v-if="goodsList.length > 3" @click.stop="showMore=!showMore">
            <span class="more" v-if="!showMore">查看更多</span>
            <span class="collapse" v-else>收起</span>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import * as util from '@/utils/utils.js'
export default {
    name: 'goods',
    props: {
        goodsIds: {
            type: Array,
            value: []
        }
    },
    data() {
        return {
            goodsList: [],
            showMore: false
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.getGoodsByIds()
        },
        getGoodsByIds() {
            
            let _url = window.location.href;
            // 0开发环境  1测试环境  2stagng环境  3生产环境
            let status = (_url.indexOf('127') > -1 || _url.indexOf('localhost') > -1)?0:_url.indexOf('mobile-test') > -1?1:_url.indexOf('mobile-staging') > -1?2:3;
            status = 1
            let ajaxUrl8 = status== 0? 'https://commission-app-d.daydaycook.com.cn': status==1?'https://commission-app-t.daydaycook.com.cn':status==2?'https://commission-app-s.daydaycook.com.cn':'https://commission-app.daydaycook.com.cn';

            if (this.goodsIds && this.goodsIds.length > 0) {
                axios.post(ajaxUrl8 + '/product-query/queryItemByItemIds',{
                    itemIds: this.goodsIds
                }).then(res => {
                    if(res.status == 200 && res.data){
                        if (res.data.rows && res.data.rows.length > 0) {
                            this.goodsList = res.data.rows
                        }
                    }else{
                        console.log(res.message || '未知错误')
                    }
                }).catch(error => {
                    console.log(error)
                })
            }
        },
        goToProductDetail(goodsId) {
            let url = `${window.origin}${util.inApp() ? '/app2/' : '/shop/'}#/productdetail?productId=${goodsId}`
            util.navTo({
                title: '商品详情',
                url
            })
        }
    },
    watch: {
        goodsIds(cur, pre) {
            this.getGoodsByIds()
        }
    }
}
</script>

<style scoped>
.goods-list {
    width: 100%;
    padding-left: 14px;
    box-sizing: border-box;
}
.goods-list .goods-item {
    padding-top: 10px;
    padding-bottom: 15px;
    border-bottom: 1px solid #EEEEEE;
}
.goods-list .goods-item img{
    width: 90px;
    height: 90px;
}
.goods-list .goods-item .goods-info{
    flex: 1;
    margin-left: 10px;
    margin-right: 28px;
}
.goods-item .goods-info .name {
    margin-bottom: 18px;
    font-size: 14px;
    color: #000000;
}
.goods-item .goods-info .price {
    font-size: 16px;
    color: #FF5269;
}
.goods-item .goods-info .price span {
    font-size: 12px;
}
.goods-item .goods-info .buy-btn {
    padding: 8px 15px;
    font-size: 12px;
    color: #FFFFFF;
    border-radius: 100px;
    background-image: linear-gradient(45deg, #393939 0%, #2F2F2F 100%);
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.20);
}
.more, .collapse {
    position: relative;
    margin-top: 14px;
    padding-right: 15px;
    font-size: 12px;
    color: #7F7F7F;
}
.more:after,
.collapse:after {
    display: block;
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%) rotate(90deg);
    width: 9px;
    height: 15px;
    background: url('../../static/img/icon_arrow.png') no-repeat;
    background-size: 100% 100%;
}
.collapse:after {
    transform: translateY(-50%) rotate(-90deg);
    background: url('../../static/img/icon_arrow.png') no-repeat;
    background-size: 100% 100%;
}
.flex-column {
    display: flex;
    flex-direction: column;
}
.flex-row {
    display: flex;
    flex-direction: row;
}
.cb { /* flex content at space between horizontal */
    justify-content: space-between;
}
.cc { /* flex content at center horizontal */
    justify-content: center;
}
.cs { /* flex content at start horizontal */
    justify-content: flex-start;
}
.ce { /* flex content at end horizontal */
    justify-content: flex-end;
}
.ac { /* flex content center vertical */
    align-items: center;
}
</style>
