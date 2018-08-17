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

export default {
	isWeChatFun,
	timeStamp,
};

