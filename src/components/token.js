import Vue from 'vue'
import store from '../store/index'
import _axios from 'axios'


var domainAdd = window.location.protocol + "//" + window.location.host;
if(domainAdd.indexOf('localhost') > -1 ||  domainAdd.indexOf('192') > -1 || domainAdd.indexOf('127') > -1 || domainAdd.indexOf('mobile-test') > -1 || domainAdd.indexOf('mobile-staging') > -1 || domainAdd.indexOf('test') > -1){
	domainAdd = "https://offline-course-t.daydaycook.com.cn";
	//domainAdd = "https://test.daydaycook.com.cn";
}else{
    domainAdd = "//api.daydaycook.com.cn";
}
   //  domainAdd = "http://101.37.81.46"
Vue.prototype.ajaxDataFun = function(method,url,callSuccess,jsonM){
    var _method = method
    var thisUrl = domainAdd + url;
    _axios({
        method:_method,
        url:thisUrl,
        crossDomain:true,
    }).then(function (obj) {
        // console.log(obj.data)
        var thistype = typeof(obj.data);
        if(thistype == 'string' && !jsonM){
            obj = JSON.parse(obj.data);
        }
        if(obj.data.code == '4010' || obj.data.code == '4050' || obj.data.code == '4060' || obj.data.code == '4020') {
	        if(obj.data.code == '200'){
		        getData_two(url);
	        }else if(obj.data.code == '4010' || obj.data.code == '4050' || obj.data.code == '4060' || obj.data.code == '4020'){
		        window.reload();
	        }
        }else {
            callSuccess(obj.data)
        }

    }).catch(function (error) {console.log(error)});

    var getData_two = function(address){
        console.log("4010 后重新请求")
        var addUrl = domainAdd + address;
        _axios({
            method:_method,
            url:addUrl,
            crossDomain:true,
        }).then(function (obj) {
            if(obj.data.code == '4010' || obj.data.code == '4050' || obj.data.code == '4060'|| obj.data.code == '4020'){
                window.location.reload();
            }
            var thistype = typeof(obj.data);
            if(thistype == 'string' && !jsonM){
                obj = JSON.parse(obj.data);
            }
            if(obj.data.code == '200'){
                store.state.loadingTxt = ''
            }
            callSuccess(obj.data)
        }).catch(function (error) {console.log(error)});
    }
}

export default domainAdd


