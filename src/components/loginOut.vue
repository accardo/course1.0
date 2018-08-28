<template>
    <div>
        <div class="popBg than"></div>
        <div class="popOr">
            <div class="tip">确认退出当前帐号吗？</div>
            <div class="clearfix">
                <div class="fleft btn" @click="cancelLogin">取消</div>
                <div class="fright btn" @click="changeLogin">确认</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props: {
            loginOutShow: {
                type: Boolean,
                default: false
            },
        },
        mounted() {
        },

        methods: {
            /*
             * Description: 取消退出
             * Author: yanlichen <lichen.yan@daydaycook.com.cn>
             * Date: 2018/8/10
             */
            cancelLogin() {
                this.$emit('update:loginOutShow', false);
            },
            changeLogin:function() {
               // window.location.href = '/index'
                this.$router.push({name: 'entrance'})
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
                localStorage.removeItem('tip')
                localStorage.removeItem('addressId')
                localStorage.removeItem('addressTxt')
                localStorage.removeItem('contractId')
                localStorage.removeItem('uid')
            },
        }
    }
</script>
