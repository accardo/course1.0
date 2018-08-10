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

/*
 * Description: 退出账号
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/8/10
 */
export function loginOut(_self) {
	_self.$router.push({
		name: 'index',
	});
	_self.changePhone = false
	_self.$store.state.isShowLogin = true
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
}
export default {
	isWeChatFun,
	timeStamp,
	loginOut,
};

