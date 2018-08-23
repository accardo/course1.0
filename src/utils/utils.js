/*
* 判断是否是微信浏览器
* */
export function isWeChatFun() {
	let ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) === 'micromessenger') {
		return true;
	} else {
		return false;
	}
}

/**
 * Description: 时间戳转换
 * Author: yanlichen <lichen.yan@daydaycook.com>
 * Date: 2018/5/16
 */
export function timeStamp(time) {
	let stamp = new Date(parseInt(time));
	let Y = stamp.getFullYear();
	let M = stamp.getMonth()+1 < 10 ? '0'+(stamp.getMonth()+1) : stamp.getMonth()+1;
	let D = stamp.getDate();
	return {
		Y,
		M,
		D,
	}
}


/* 时间格式转换 */
export function formatTime(time){
	function setv(v){v = v < 10?'0' + v : v; return v; }
	var wstr = ''
	var v = new Date(time)
	var y = v.getFullYear()   //年
	var mt = v.getMonth() + 1 //上个月
	var d = v.getDate()      //天getDate.getDate()
	var h = v.getHours()
	var mn = v.getMinutes()

	var ww = v.getDay()
	if (ww == 0) {
		wstr = "日";
	} else if (ww == 1) {
		wstr = "一";
	} else if (ww == 2) {
		wstr = "二";
	} else if (ww == 3) {
		wstr = "三";
	} else if (ww == 4) {
		wstr = "四";
	} else if (ww == 5) {
		wstr = "五";
	} else if (ww == 6) {
		wstr = "六";
	}
	return `${mt}/${d}周${wstr} ${setv(h)}:${setv(mn)}`
}

/* 时间格式转换 2*/
export function formatTimeTwo(str){
	function setv(v){v = v < 10?'0' + v : v; return v; }
	var v = new Date(str)
	var h = v.getHours()
	var mn = v.getMinutes()
	return setv(h) + ':' + setv(mn)
}

//将时间戳转换成年月日的形式
export function formatTimeArray(temp){
	if(!temp) return '';
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
	let myDate 		 = new Date(temp);
	let postYear     = myDate.format('yyyy');
    let postMonth    = myDate.format('mm');
    let postDate     = myDate.format('dd');
    let postHours    = myDate.format('hh');
    let postMinutes  = myDate.format('nn');
    let postMM       = myDate.format('ss');
    return new Array(postYear,postMonth,postDate,postHours,postMinutes,postMM)
}

//判断浏览器还是app 进行 页面跳转
export function jumpUrlByIsApp(params){
	if(typeof ddcApp == 'object'){
		//内嵌在APP中执行
		let _url = window.location.origin + window.location.pathname+'#/'+params.url;
		ddcApp.navigateTo({
			title:params.pageTitle || '',
			url:_url,
			fullScreen:params.fullScreen || false
		})
	}else{
		//获取ddcApp方法失败后，当前浏览器直接跳转
		params._this.$router.push({
			name:params.url,
			query:params.query || {}
		})
	}
}

export default {
	isWeChatFun,
	timeStamp,
	formatTimeArray
};

