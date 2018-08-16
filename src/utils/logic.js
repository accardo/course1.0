import Vue from 'vue'
/*
 * Description: 逻辑整理
 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
 * Date: 2018/8/15
 */
export class Logic {
	constructor() {

	}

	/*
	 * Description: ajax 请求
	 * Author: yanlichen <lichen.yan@daydaycook.com.cn>
	 * Date: 2018/8/15
	 */
	ajaxGetData(url, ajaxData) {
		return new Promise((resolve) => {
			Vue.prototype.ajaxDataFun('get', url, (data) => {
				if (data.code == '200') {
					return resolve(data);
				}
			}, ajaxData)
		})
	}
}
export default {
	Logic
}
