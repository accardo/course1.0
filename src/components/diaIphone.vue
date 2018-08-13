<template>
    <div class="mask-iphone" data-cancel="cancel" @click="cancelIphone">
        <div class="iphone-wrap">
            <div>拨打门店电话</div>
            <div><a href="tel:021-63230886">021-63230886</a></div>
            <div><a href="tel:021-63233279">021-63233279</a></div>
            <div data-cancel="cancel" @click="cancelIphone">取消</div>
        </div>
    </div>
</template>

<script>
	export default {
        data() {
            return {}
        },
        props: {
            isIphone: {
                type: Boolean,
                default: false
            },
        },
        mounted() {

        },
        methods:{
            /*
             * Description: 取消拨打
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/10
             */
            cancelIphone(e) {
                if (e.target.dataset.cancel == 'cancel') {
                    this.$emit('update:isIphone', false);
                }
            }
        },
	}
</script>

<style scoped>
    .mask-iphone {
        position: fixed;
        background: rgba(0,0,0, 0.5);
        z-index: 1;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .iphone-wrap{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        background: #fff;
    }
    .iphone-wrap div {
        height: 50px;
        line-height: 50px;
        border-bottom: #eee solid 1px;
        text-align: center;
        font-size: 16px;
        color:  #1A1A1A;
    }
    .iphone-wrap div a {
        color:  #1A1A1A;
    }
    .iphone-wrap div:first-of-type {
        font-size: 12px;
        color: #a5a4a4;
    }
    .iphone-wrap div:last-of-type {
       border-top: 5px solid #eee;
    }

</style>

