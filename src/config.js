/**
 * @description
 * 接口域名设置
 */
let apiLabel = (isQa ? '-qa' : (isBeta ? '-beta' : '-qa'));

exports.domains={
    restauantDomain:`http://restaurant${apiLabel}.services.fandanfanli.com`,
    authDomain:`http://oauth${apiLabel}.services.fandanfanli.com`,
    orderDomain: `http://order${apiLabel}.services.fandanfanli.com`,
    paymentDomain: `http://payment${apiLabel}.services.fandanfanli.com`,
};
//非qa环境去除console.log
!isQa && (console.log = function(){return});
/**
 * @description
 * 微信公众平台参数设置
 */
let wxConfigs= function(){
    let appId = `wx72e523b991255618`;
    let backUrl = location.protocol+`//`+location.host+location.pathname;//登录认证的返回地址
    let redirectUrl = `http://www.fandanfanli.com/yueba/authRediretPage.html?appid=${appId}&back_url=${backUrl}`;
    let noncestr = "Wm3WZYTPz0wzccnW";
    let timestamp = "1414587457";
    let wxDebug = false;
    return {
        'appId': appId,
        'redirectUrl': redirectUrl,
        'noncestr': noncestr,
        'timestamp':timestamp,
        'wxDebug':wxDebug
    }
}
exports.wxConfigs=wxConfigs();
/**
 * @description
 * 其它的参数，可由后期动态配置
 */
let $conf={
    'token': "Basic dGVzdGNsaWVudDp0ZXN0dGVzdA==",
    'location': {}
}
exports.$conf=$conf
