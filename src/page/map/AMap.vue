<template>
    <div class="main-content">
        <div id="container"></div>
    </div>
</template>

<script>
    import AMap from 'AMap';   //在页面中引入高德地图
    import WebStorageCache from 'web-storage-cache'
    const wsCache = new WebStorageCache();
	export default {
        data () {
            return {
                gps:'',
                name:'',
                address:'',
            }
        },
        created(){
            let query = this.$router.history.current.query;
            console.log(query)
            if(query){
                this.gps = query.gps;
                // 测试 地址定位
                this.name = query.name;
                this.address = query.address;
            }
        },
        mounted (){
            this.Amap()
        },
        methods: {
            Amap() {
                let self = this;
                let shopGps = this.gps.split(',');
                var map = new AMap.Map("container", {
                    resizeEnable: true,
                    center: shopGps,// 地图中心点
                    zoom: 13 // 地图显示的缩放级别
                });
                let marker = new AMap.Marker({
                    map: map,
                    icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    position: shopGps,
                    offset: new AMap.Pixel(-60, -60), //相对于基点的偏移位置
                    draggable: false,  //是否可拖动
                    content: `<div class="marker-route">\
                                    <div class="marker-left"><p>${this.name}</p><p>${this.address}</p></div>\
									<div class="marker-right" id="openMapDoc"><i></i>导航</div>\
							  </div>`,  //自定义点标记覆盖物内容
                });
                map.add(marker);
                marker.on('click', function() {
                    let xxkc_gps = wsCache.get('xxkc_gps');
                    let userCurrentddress = localStorage.getItem('userCurrentAddress') || '我的位置';
                    let mapUrl = `https://uri.amap.com/navigation?from=${xxkc_gps},${userCurrentddress},&to=${self.gps},${self.name},&mode=car&src=DDC LIFE&callnative=1`
                    // 调启高德App导航
                    window.open(mapUrl)
                   /* if(typeof ddcApp == 'object' && shopGps.length){
                        // 调用地图导航API
                        ddcApp.navMap({
                            latitude : shopGps[0],
                            longitude: shopGps[1],
                            title : self.name,
                            subTitle : self.address
                        })
                    } else {
                        // 调启高德App导航

                    }*/
                });
            },
        }
	}
</script>
<style scoped>
    html, body {
        margin: 0;
        height: 100%;
        width: 100%;
        position: absolute;
    }
    #container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
    }

    .button-group {
        position: absolute;
        bottom: 20px;
        right: 20px;
        font-size: 12px;
        padding: 10px;
    }

    .button-group .button {
        height: 28px;
        line-height: 28px;
        background-color: #0D9BF2;
        color: #FFF;
        border: 0;
        outline: none;
        padding-left: 5px;
        padding-right: 5px;
        border-radius: 3px;
        margin-bottom: 4px;
        cursor: pointer;
    }
    .button-group .inputtext {
        height: 26px;
        line-height: 26px;
        border: 1px;
        outline: none;
        padding-left: 5px;
        padding-right: 5px;
        border-radius: 3px;
        margin-bottom: 4px;
        cursor: pointer;
    }
    #tip {
        background-color: #fff;
        padding-left: 10px;
        padding-right: 10px;
        position: absolute;
        font-size: 12px;
        right: 10px;
        top: 20px;
        border-radius: 3px;
        border: 1px solid #ccc;
        line-height: 30px;
    }
    #myPageTop {
        position: absolute;
        top: 5px;
        right: 10px;
        background: #fff none repeat scroll 0 0;
        border: 1px solid #ccc;
        margin: 10px auto;
        padding:6px;
        font-family: "Microsoft Yahei", "微软雅黑", "Pinghei";
        font-size: 14px;
    }
    #myPageTop label {
        margin: 0 20px 0 0;
        color: #666666;
        font-weight: normal;
    }
    #myPageTop input {
        width: 170px;
    }
    #myPageTop .column2{
        padding-left: 25px;
    }

</style>
<style>
    .marker-route {
        position: relative;
        width: 240px;
        height: 60px;
        background: #fff;
        border: #f0f0f0 solid 1px;
        border-radius: 4px;
    }
    .marker-route:before {
        display: block;
        position: absolute;
        content: ' ';
        left: 70px;
        bottom: -8px;
        z-index: 2;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid #fff;
    }
    .marker-route:after {
        display: block;
        position: absolute;
        content: ' ';
        left: 69px;
        bottom: -9px;
        z-index: 1;
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 9px solid #ededed;
    }
    .marker-left {
        padding: 6px 0 6px 10px;
        float: left;
        width: 65%;
    }
    .marker-left p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .marker-left p:first-of-type {
        font-size: 16px;
        color: #333;
    }
    .marker-left p:last-of-type{
        color: #666666;
        font-size: 10px;
    }
    .marker-right{
        float: right;
        width: 25%;
        padding: 0 3px;
        height: 100%;
        background-image: linear-gradient(45deg, #393939 0%, #2F2F2F 100%);
        border-radius: 0 4px 4px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
    }
    .marker-right i{
        display: inline-block;
        background: url("../../../static/img/dh.png") no-repeat;
        width: 12px;
        height: 14px;
        background-size: contain;
        margin-right: 2px;
        vertical-align: middle;
    }
</style>
