import _axios from 'axios'
import wx from 'weixin-js-sdk';

export default{
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date()
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
        var expires = 'expires=' + d.toUTCString() + ';path=/'
        cvalue = encodeURI(cvalue, 'utf-8')
        document.cookie = cname + '=' + cvalue + '; ' + expires
    },
    getCookie: function (cname) {
        var name = cname + '='
        var ca = decodeURI((document.cookie), 'utf-8').split(';')
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim()
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length)
        }
        return ''
    },
    clearCookie: function (cname) {
        this.setCookie(cname, '', -1)
    },
    uniqueArr:function(arr) { //数组去重
        var n = [];
        for (var i = 0; i < arr.length; i++) {
            if (n.indexOf(arr[i]) == -1) {
                n.push(arr[i]);
            }
        }
        return n;
    },
    removeArr:function(val) { //数组删除值
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    },
    getUrlPars:function(u){
        if(u.indexOf("?") > -1){
            var o = {};
            var s = u.split('?')[1];
            if(u.split('?').length > 2){
                s = u.split('?')[1] + "&" + u.split('?')[2]
            }
            var t = s.split('&')
            var i = 0;
            var x;
            for(i; i < t.length; i++) {
                 x = t[i].split('=');
                 o[x[0]] = x[1];
            }
            return o;
        }
    },
    getScrollTop:function(){
    　　 var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    　　 if(document.body) {
    　　　　   bodyScrollTop = document.body.scrollTop;
    　　 }
    　　 if(document.documentElement){
    　　　　   documentScrollTop = document.documentElement.scrollTop;
    　　 }
    　　 scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    　　 return scrollTop;
     },
    //文档的总高度
    getScrollHeight:function(){
    　　var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    　　if(document.body){
    　　　　 bodyScrollHeight = document.body.scrollHeight;
    　　}
    　　if(document.documentElement){
    　　　　 documentScrollHeight = document.documentElement.scrollHeight;
    　　}
    　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    　　return scrollHeight;
    },
    //浏览器视口的高度
    getWindowHeight:function(){
    　　var windowHeight = 0;
    　　if(document.compatMode == "CSS1Compat"){
    　　　　 windowHeight = document.documentElement.clientHeight;
    　　}else{
    　　　　 windowHeight = document.body.clientHeight;
    　　}
    　　return windowHeight;
    },
    transTime:function(temp){
        //确保时间戳为13位
        temp = temp.toString().length==10?temp*1000:temp;
        Date.prototype.format = function(format) {
            if (isNaN(this)) return '';
            var o = {
                'm+': this.getMonth() + 1,
                'd+': this.getDate(),
                'h+': this.getHours(),
                'n+': this.getMinutes(),
                's+': this.getSeconds(),
                'S': this.getMilliseconds(),
                'W': ["日", "一", "二", "三", "四", "五", "六"][this.getDay()],
                'q+': Math.floor((this.getMonth() + 3) / 3)
            };
            if (format.indexOf('am/pm') >= 0) {
                format = format.replace('am/pm', (o['h+'] >= 12) ? '下午' : '上午');
                if (o['h+'] >= 12) o['h+'] -= 12;
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }
        let myDate       = new Date(temp);
        let postYear     = myDate.format('yyyy');
        let postMonth    = myDate.format('mm');
        let postDate     = myDate.format('dd');
        let postHours    = myDate.format('hh');
        let postMinutes  = myDate.format('nn');
        let postMM       = myDate.format('ss');
        let postSS       = myDate.format('S');
        return new Array(postYear,postMonth,postDate,postHours,postMinutes,postMM,postSS)
    },
    getUrl(){
        var domainAdd = window.location.protocol + "//" + window.location.host;
        if(domainAdd.indexOf('localhost') > -1 || domainAdd.indexOf('127') > -1 || domainAdd.indexOf('mobile-test') > -1 || domainAdd.indexOf('mobile-staging') > -1 || domainAdd.indexOf('test') > -1){
            domainAdd = "http://test.daydaycook.com.cn";
        }else{
            domainAdd = "http://api.daydaycook.com.cn";
        }
        return domainAdd
    },
    wxShare:function (title, desc, img, url){
        // alert('share')
        var _thisUrl = window.location.href
        var _shareTitle = title || '日日煮线下美食课程预约'
        var _shareDesc = desc || '生活就要极致'
        var _shareImg = img || 'http://api.daydaycook.com.cn/daydaycook/page/course/static/img/share.png'
        var _shareUrl = url || _thisUrl
        var _configUrl = this.getUrl()+"/daydaycook/wechat/getSignature.do?url=" + window.location.href;

        var ua = window.navigator.userAgent.toLowerCase(); 
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            // alert(_configUrl)
            _axios.get(_configUrl)
            .then(function (obj) {
                var thisId = obj.data.appId
                var thisTimestamp = obj.data.timestamp
                var thisNonceStr = obj.data.nonceStr
                var thisSignature = obj.data.signature
                wx.config({
                    debug: false,
                    appId: thisId,
                    timestamp: thisTimestamp,
                    nonceStr: thisNonceStr,
                    signature: thisSignature,
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone','hideMenuItems']
                })

                wx.ready(function() {
                    // 获取“ 分享到朋友圈” 按钮点击状态及自定义分享内容接口
                    wx.onMenuShareTimeline({
                        title: _shareTitle, // 分享标题
                        link: _shareUrl,
                        imgUrl: _shareImg, // 分享图标
                        success: function() {},
                        cancel: function() {}
                    })
                    // 获取“ 分享给朋友” 按钮点击状态及自定义分享内容接口
                    wx.onMenuShareAppMessage({
                        title: _shareTitle, // 分享标题
                        desc: _shareDesc, // 分享描述
                        link: _shareUrl,
                        imgUrl: _shareImg, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function() {},
                        cancel: function() {}
                    })
                    // 获取“分享到QQ”按钮点击状态及自定义分享内容接口
                    wx.onMenuShareQQ({
                        title: _shareTitle, // 分享标题
                        desc: _shareDesc, // 分享描述
                        link: _shareUrl, // 分享链接
                        imgUrl: _shareImg, // 分享图标
                        success: function() {},
                        cancel: function() {}
                    })
                    // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
                    wx.onMenuShareWeibo({
                        title: _shareTitle, // 分享标题
                        desc: _shareDesc, // 分享描述
                        link: _shareUrl, // 分享链接
                        imgUrl: _shareImg, // 分享图标
                        success: function() {},
                        cancel: function() {}
                    })
                    // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
                    wx.onMenuShareQZone({
                        title: _shareTitle, // 分享标题
                        desc: _shareDesc, // 分享描述
                        link: _shareUrl, // 分享链接
                        imgUrl: _shareImg, // 分享图标
                        success: function() {},
                        cancel: function() {}
                    })
                })
            }).catch(function (error) {console.log(error)})
        }
    },
}


