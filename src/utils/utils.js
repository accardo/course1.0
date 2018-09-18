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


// 获取用户session
export function getSessionId() {

	return new Promise((resolve,reject) => {
		if(sessionId_app) resolve(sessionId_app)
		console.log(sessionId_app, 'sessionId_app')
		checkDdcApp((isApp) => {
			if (isApp) {
				ddcApp.getSystemInfo();
				console.log('after ddcApp.getSystemInfo')
				let num = 0;
				let timer = setInterval(() => {
					num++
					if (num > 60) {
						clearInterval(timer);
						reject('用户信息获取失败')
					} else {
						if(userInfo_app) {
							console.log(userInfo_app,'userInfo_app')
							localStorage.setItem('uid', userInfo_app.uid);
							resolve(userInfo_app)
							clearInterval(timer);
						}
					}
				},30)
			}
		})
	})
}
export function navTo({
   title = '线下课程',
   pathname = window.location.pathname,
   router = null,
   query = null,
   url = null,
   fullScreen = false,
   that = null,
   replace = false
}) {
	if (!url) {
		// pathname begin with '/' and end without '?'
		pathname = /^\//.test(pathname) ? pathname.replace(/\?*$/, '') : `/${pathname.replace(/\?*$/, '')}`
		// combine query
		let queryStr = query ? '?' : ''
		for (let key in query) {
			queryStr = (/\?$/).test(queryStr) ? `${queryStr}${key}=${query[key]}` : `${queryStr}&${key}=${query[key]}`
		}
		// combine url with origin pathname router & query
		url = `${window.location.origin}${pathname}`
		if (router) {
			url = `${url}#/${router}${queryStr}`
		} else {
			url = `${url}${queryStr}`
		}
	}

	checkDdcApp((res) => {
		console.log('是否app内跳转')
		console.log(res);
		if (res) {
			if (!(/\#\/index/.test(url))) {
				let params = {title, url, fullScreen}
				if (!replace) {
					ddcApp.navigateTo(params)
				} else {
					ddcApp.redirectTo(params)
				}
			} else {
				ddcApp.goCategory()
			}
		} else {
			if (that && router) {
				let params = {
					name: router,
					query: query || {}
				}
				if (!replace) {
					that.$router.push(params)
				} else {
					that.$router.replace(params)
				}
			} else {
				window.location = url
			}
		}
	})
}

export function checkDdcApp(cb) {
	if (inApp()) {
		let num = 0;
		let timer = setInterval(() => {
			num++
			if (num > 60) {
				clearInterval(timer) // stop interval and do nothing
				console.log('check ddcApp fail')
			} else {
				if (typeof ddcApp == 'object' && Object.keys(ddcApp).length > 0){
					'function' == typeof cb && cb(true)
					clearInterval(timer)
				}
			}
		}, 50)
	} else {
		'function' == typeof cb && cb(false)
	}
}

export function inApp () {
	let userAgent = navigator.userAgent
	if (/daydaycook/.test(userAgent)) {
		return true
	} else {
		return false
	}
}

//关闭loading
export function closeLoading(){
	let num = 0;
	let timer = setInterval(() => {
		num++;
		if(num > 60 || typeof ddcApp == 'object'){
			clearInterval(timer);
		}
		if(typeof ddcApp == 'object'){
			//关闭loading
			ddcApp.closeLoading();
		}
	},50)
}

export default {
	isWeChatFun,
	timeStamp,
	formatTimeArray,
	getSessionId,
	navTo,
	closeLoading,
	checkDdcApp,
	inApp,
};

