<template>
    <div id="container">
        <v-title>{{ pageTitle }}</v-title>
        <div class="member justify">
            <div class="top box">
                <div class="avar">
                    <img v-if="avar && avar != 'null'" :src="avar" />
                    <img v-if="!avar || avar == 'null'" src="../../../static/img/default.png" />
                </div>
                <div class="name inline">
                    <p v-if="lineUserName != 'null'">{{ lineUserName }}</p>
                    <p v-if="lineUserName == 'null'">{{ nickName }}</p>
                    <span>普通用户</span>
                    <div class="not"> 您尚未购买课程，暂无约课权限</div>
                </div>
            </div>
        </div>
        <div class="notMemner"  v-html="notMemberData">
        </div>
       <!-- <div class="notMember">
            <div class="section" style="text-indent: 2em">
                欢迎您光顾日日煮美食生活体验馆。我们的美食教室拥有甜点、面点、料理三大类美食课程，并且涵盖数十种精品美食教学，汇聚多位来自法国、瑞士、美国等厨艺名校的明星讲师，只为您打造追求极致的美味体验。欢迎您来店体验和咨询，日日煮将和您一起打造都市厨房新空间。
            </div>
            <div class="section img">
                <img src="../../../static/img/c_shop0.jpg" alt="" />
            </div>
            <div class="section img">
                <img src="../../../static/img/c_shop1.jpg" alt="" />
            </div>
            <div class="section img">
                <img src="../../../static/img/c_shop2.jpg" alt="" />
            </div>
            <div class="section img">
                <a href="https://h5.youzan.com/v2/goods/3nrlsexlo2brm?fromStore=true">
                    <img src="../../../static/img/c1.jpg" alt="" />
                </a>
            </div>
            <div class="section img">
                <a href="https://h5.youzan.com/v2/goods/2ov884cdvvfqa?fromStore=true">
                    <img src="../../../static/img/c2.jpg" alt="" />
                </a>
            </div>
            <div class="section img">
                <a href="https://h5.youzan.com/v2/goods/3642ez6698z02?fromStore=true">
                    <img src="../../../static/img/c3.jpg" alt="" />
                </a>
            </div>
            <div class="section">
                <h2>上海店</h2>
                <p>店址：上海市黄浦区淮海中路300号K11购物艺术中心B2-11商铺</p>
                <p>电话：021-63233279，021-63230886</p>
            </div>
            <div class="section">
                <h2>广州店</h2>
                <p>店址：广州市天河区珠江东路6号K11购物艺术中心B2-12商铺</p>
                <p>电话：020-88835253，020-88835176</p>
            </div>
&lt;!&ndash;             <div class="section txtCenter img">
                <img style="width:50%;" src="../../../static/img/c_code.png" alt="" />
            </div> &ndash;&gt;
        </div>-->
        <footerLay v-bind:position="position"></footerLay>
    </div>
</template>

<script>
    import VTitle from '@/components/title'
    import footerLay from '@/components/footer'

    export default {
        data () {
            return {
                pageTitle: '个人中心',
                nickName: '',
                lineUserName: '',
                avar: '',
                position: 2,
                notMemberData: '',
            }
        },
        mounted () {
            this.$nextTick(() => {
                let isMember = this.$store.state.isMember || localStorage.getItem('isMember')
                if(isMember == true || isMember == 'true'){
                    this.$router.push('/member')
                } else {
                    this.noMemner();
                }
                this.avar = this.$store.state.avar || localStorage.getItem('avar')
                this.nickName = this.$store.state.nickName || localStorage.getItem('nickName') || '游客'
                this.lineUserName = this.$store.state.lineUserName || localStorage.getItem('lineUserName')
            })

        },
        components: {
            VTitle,
            footerLay
        },
        methods: {
            /*
            * 不是会员用户显示
            * */
            noMemner() {
                var noMemnerUrl = '/daydaycook/server/offline/address/courseIntroduce.do';
                this.ajaxDataFun('post', noMemnerUrl , (obj) => {
                    if (obj.code == '200') {
                        this.notMemberData = obj.data;
                    }
                })
            }
        }
    }
</script>
