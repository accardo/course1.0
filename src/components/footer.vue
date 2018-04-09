<template>
    <div class="footer" :class="{isIPhoneX:isIPhoneX}">
        <ul class="clearfix">
            <li :class="{ active: position == '1'}">
                <router-link to="/"> 预约课程 </router-link>
            </li>
            <li v-if="$store.state.isMember"  :class="{ active: position == '2'}"  @click="$store.state.listLoaded=false">
                <router-link to="/member"> 个人中心 </router-link>
            </li>
            <li v-if="!$store.state.isMember" :class="{ active: position == '2'}"  @click="$store.state.listLoaded=false">
                <router-link to="/notMember"> 个人中心 </router-link>
            </li>
        </ul>
    </div>
</template>
<script>
    import common from '@/components/common.js'
    export default {
        name: 'footers',
        data () {
            return {
                pageTitle: '底部模版',
                isIPhoneX: false,
            }
        },
        props: ['position'],
        created () {
            this.isIphoneX()
        },
        methods: {
            isIphoneX:function(){
                let h = common.getWindowHeight()
                if(h === 724){
                    this.isIPhoneX = true
                }
            }
        },
        mounted(){
            common.wxShare()
        }
    }
</script>