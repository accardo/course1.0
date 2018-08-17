import Vue from 'vue'
import store from '../store/index'
import CryptoJS from 'crypto-js'
import Fingerprint from 'fingerprintjs'
import _hex_md5 from 'md5'
import _crypto from 'crypto'
import jsencrypt from 'jsencrypt'
import _axios from 'axios'
import Common from './common'


var domainAdd = window.location.protocol + "//" + window.location.host;
if(domainAdd.indexOf('localhost') > -1 || domainAdd.indexOf('127') > -1 || domainAdd.indexOf('mobile-test') > -1 || domainAdd.indexOf('mobile-staging') > -1 || domainAdd.indexOf('test') > -1){
	domainAdd = "https://test.daydaycook.com.cn";

}else{
    domainAdd = "//api.daydaycook.com.cn";
}
	//domainAdd = "http://192.168.18.226:8080";
var nowBrush = Date.parse(new Date());
var tokenBrush = "FB5A1FF3D574DF222E51B6AB862067A246049A01" + nowBrush;
tokenBrush = _hex_md5(tokenBrush).toUpperCase();

var foreverCid = new Fingerprint().get(); //设备id

var pubKeyUrl; // 请求公钥地址
var publickKey; //公钥
var randomKey; //随机生成key
var cryptoKey; //crypto 第一次生成字节
var cryptoKey_two;
var totalKey; //通过公钥和随机生成的key 去请求accessTokenId接口
var accessTokenUrl; //请求accessTokenId url
var acctoken;
var clearToken; //解密后的token
var device = '6'; //device = 6代表pc
var RASencrypt = new jsencrypt.JSEncrypt(); //RAS加密

var linshiKey; //第二个key
//header 请求头参数 通过linshiKey AESEncrypt加密
//linshiUrlkey 通过 randomKey AESEncrypt  对linshiKey进行加密
var linshiHeader = {};
var linshiHeadToken;
var linshiUrlkey;
var linshidevice;
var linshitokenBrush;
var linshinowBrush;

//AES加密
function AESEncrypt(type,word){
    var key = CryptoJS.enc.Base64.parse(type);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}
//AES解密
function AESDecrypt(type,word){
    var key = CryptoJS.enc.Base64.parse(type);
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

//更新请求时间戳
function updateBrush(){
    nowBrush = Date.parse(new Date());
    tokenBrush = "FB5A1FF3D574DF222E51B6AB862067A246049A01" + nowBrush;
    tokenBrush = _hex_md5(tokenBrush).toUpperCase();
};

function newHeader(){
    randomKey = Common.getCookie("randomKey");
    acctoken = Common.getCookie("acctoken");

    clearToken = AESDecrypt(randomKey,acctoken);
    updateBrush();

    cryptoKey_two = _crypto.randomBytes(16);
    linshiKey = cryptoKey_two.toString('base64')
    // 对header参数进行加密
    linshitokenBrush = AESEncrypt(linshiKey,tokenBrush);
    linshinowBrush = AESEncrypt(linshiKey,nowBrush);
    linshidevice = AESEncrypt(linshiKey,device); // pc端
    linshiHeadToken = AESEncrypt(linshiKey,clearToken); //通过临时key加密临时token
    linshiUrlkey = AESEncrypt(randomKey,linshiKey); //临时秘钥

    linshiHeader = {
        "signature":linshitokenBrush,
        "timestamp":linshinowBrush,
        "device":linshidevice,
        "accessTokenId":linshiHeadToken,
        "cid":foreverCid,
        "key":linshiUrlkey
    }
}

pubKeyUrl = domainAdd + "/auth/server/auth/key.do?cid=" + foreverCid;
function changeUrlArg(url, arg, val){
    var pattern = arg+'=([^&]*)';
    var replaceText = arg+'='+val;
    var returnUrl = url.match(pattern) ? url.replace(eval('/('+ arg+'=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url+'&'+replaceText : url+'?'+replaceText);
    return returnUrl;
}

//过滤url 进行 三次 encodeURIComponent编码
function filterUrl(url,type){
    var thisUrl = url;
    var urlArr = [];
    var arrPar = [];
    var arrLeft = [];
    var arrRight = [];
    var urlArrlen;
    var returnUrl = "";

    if(thisUrl.indexOf('?') > -1){
        if(thisUrl.indexOf('ver=') > -1){
            thisUrl  = changeUrlArg(thisUrl,'version','3.3.3');
        }else if(thisUrl.indexOf('version=') > -1){
            thisUrl = changeUrlArg(thisUrl,'version','3.3.3');
        }else{
            thisUrl += "&version=3.3.3";
        }
    }else{
        return thisUrl;
    }

    urlArr = thisUrl.split("?");
    arrPar = urlArr[1].split("&");

    arrPar.forEach(function(e,i){
        if(e.indexOf('=') > -1){
            arrLeft[i] = e.split("=")[0];
            arrRight[i] = e.split("=")[1];
            arrRight[i] = encodeURIComponent(encodeURIComponent(AESEncrypt(linshiKey,arrRight[i])));
            arrPar[i] =  arrLeft[i] + "=" + arrRight[i];
        }
    });
    returnUrl = urlArr[0] + "?" + arrPar.join("&");
    return returnUrl;
}
//获取公钥 将randomKey和acctoken 写入缓存
function getPubFunction(){
    console.log("key过期，重新请求");
    Common.clearCookie("randomKey")
    Common.clearCookie("acctoken");
    updateBrush();

    cryptoKey = _crypto.randomBytes(16);
    randomKey = cryptoKey.toString('base64')
    Common.setCookie("randomKey",randomKey,0.5);

    _axios.get(pubKeyUrl)
    .then(function (obj) {
        if(obj.data.code == '200'){
            publickKey = obj.data.data.publickKey;
            RASencrypt.setPublicKey(publickKey); //通过公钥进行RAS加密
            totalKey = encodeURIComponent(RASencrypt.encrypt(randomKey));
            //需要url编码作为参数去请求accessTokenUrl

            accessTokenUrl = domainAdd + "/auth/server/auth/authKey.do?cid=" + foreverCid + "&key=" + totalKey;
            _axios.get(accessTokenUrl)
            .then(function (obj) {
                if(obj.data.code == '200'){
                    acctoken = obj.data.data.accessTokenId;
                    Common.setCookie("acctoken",acctoken,0.5);
                    newHeader();
                }
            }).catch(function (error) {console.log(error)});
        }
    }).catch(function (error) {console.log(error)});
}

Vue.prototype.ajaxDataFun = function(method,url,callSuccess,jsonM){
    var _method = method
    newHeader();
    var thisUrl ='';
    if(url && url.indexOf('getAddressInfoByUid') >-1 || url.indexOf('getAddressCourseInfo') > -1){
        thisUrl = 'http://192.168.18.222:8080' + filterUrl(url);
    }else{
        thisUrl = domainAdd + filterUrl(url);
    }
    // var thisUrl = domainAdd + filterUrl(url);
    _axios({
        method:_method,
        url:thisUrl,
        crossDomain:true,
        headers:linshiHeader
    }).then(function (obj) {
        // console.log(obj.data)
        var thistype = typeof(obj.data);
        if(thistype == 'string' && !jsonM){
            obj = JSON.parse(obj.data);
        }
        if(obj.data.code == '4010' || obj.data.code == '4050' || obj.data.code == '4060' || obj.data.code == '4020') {
            Common.clearCookie("randomKey")
            Common.clearCookie("acctoken");
            updateBrush();
            cryptoKey = _crypto.randomBytes(16);
            randomKey = cryptoKey.toString('base64')
            Common.setCookie("randomKey",randomKey,0.5);
            _axios.get(pubKeyUrl)
            .then(function (obj) {
                if(obj.data.code == '200'){
                    publickKey = obj.data.data.publickKey;
                    RASencrypt.setPublicKey(publickKey); //通过公钥进行RAS加密
                    totalKey = encodeURIComponent(RASencrypt.encrypt(randomKey));
                    //需要url编码作为参数去请求accessTokenUrl

                    accessTokenUrl = domainAdd + "/auth/server/auth/authKey.do?cid=" + foreverCid + "&key=" + totalKey;
                    _axios.get(accessTokenUrl)
                    .then(function (obj) {
                        if(obj.data.code == '200'){
                            acctoken = obj.data.data.accessTokenId;
                            Common.setCookie("acctoken",acctoken,0.5);
                            newHeader();
                            getData_two(url);
                        }else if(obj.data.code == '4010' || obj.data.code == '4050' || obj.data.code == '4060' || obj.data.code == '4020'){
                            window.reload();
                        }
                    }).catch(function (error) {console.log(error)});
                }
            }).catch(function (error) {console.log(error)});
        }else {
            callSuccess(obj.data)
        }

    }).catch(function (error) {console.log(error)});

    var getData_two = function(address){
        console.log("4010 后重新请求")
        var addUrl = domainAdd + filterUrl(address);
        _axios({
            method:_method,
            url:addUrl,
            crossDomain:true,
            headers:linshiHeader
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

randomKey = Common.getCookie("randomKey");  // 缓存中获取
acctoken = Common.getCookie("acctoken");

if(!randomKey || !acctoken || randomKey == 'underfine' || acctoken == 'underfine') {
    getPubFunction();
}



