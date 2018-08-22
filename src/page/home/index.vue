<template>
   <div id="container">
        <VTitle>{{ pageTitle }} </VTitle>
        <HeaderLay></HeaderLay>
       <!-- <FooterLay v-bind:position="position"></FooterLay>-->
        <LoginLay v-show="$store.state.isShowLogin == true"></LoginLay>
    </div>
</template>

<script>
    import common from '@/components/common.js'
    import VTitle from '@/components/title'
    import HeaderLay from './header'
    import FooterLay from '@/components/footer'
    import LoginLay from '@/components/login'

    export default {
        name: 'login',
        data () {
            return {
                pageTitle: '预约课程',
                fixedTop: false,
                position:1
            }
        },
        created () {
        },
        components: {
            HeaderLay,
            FooterLay,
            VTitle,
            LoginLay,
        },
        methods: {},
        mounted (){
            document.body.className = ''
            let isLogin = this.$store.state.isLogin || localStorage.getItem('isLogin')
            if(isLogin == 'true' || isLogin == true){
                this.$store.state.isShowLogin = false
            }else{
                this.$store.state.isShowLogin = true
            }
        }
    }
</script>
