/**
 * Created by DELL on 2017/10/30.
 */
import wx from 'weixin-js-sdk';
import sha1 from 'js-sha1';
const weixin = wx;
class Weixin {
    constructor(config){
        this.config = config;
    }
    /*
     **微信登录
     **@explain
     **configs：func
     */
    wxLogin(){
        if(!localStorage.getItem('Authorization')) {
            localStorage.setItem('login-retun-url',location.href);
            location.href = this.config.redirectUrl;
        }
    }
    /*
     **微信的准备完全状态
     **@explain
     **configs：func
     */
    wxReady(func){
      weixin.ready(function() {
        func();
      })
    }
    /*
     **微信的api conf 配置方法
     **@explain
     **configs：{jsapi_ticket，noncestr，timestamp，href，appid,suc,fail}
     */
    wxSetConfig(configs) {
        const config = this.config;
        //拼接簽名字符串
        const jsapi_ticket="jsapi_ticket="+configs.jsapi_ticket+"&noncestr="+config.noncestr+"&timestamp="+config.timestamp+"&url="+configs.href;
        //生成sha1簽名
        const signature=sha1(jsapi_ticket);
        weixin.config({
            debug: config.wxDebug,
            appId: config.appId, // 必填，公众号的唯一标识
            timestamp:parseInt(config.timestamp), // 必填，生成签名的时间戳
            nonceStr: config.noncestr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名，见附录1
            jsApiList: ['onMenuShareAppMessage','scanQRCode','getLocation','openLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        weixin.ready(function(){
            configs.suc && configs.suc();
          });
        weixin.error(function(res){
            configs.fail && configs.fail();
        });
    }

    /*
     **微信分享
     **@explain
     **configs：{jsapi_ticket，noncestr，timestamp，href，appid}
     */
    wxShare(configs){
        weixin.onMenuShareAppMessage({
            title:configs.title, // 分享标题
            desc:configs.describe,//分享描述
            link:configs.href,
            imgUrl:configs.imgUrl
        });
    }
    /*
     **微信支付調用
     **@explain
     **configs：{jsapi_ticket，noncestr，timestamp，href，appid}
     */
    wxPay(configs){
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            {
                "appId":configs.appid,     //公众号名称，由商户传入
                "timeStamp":configs.timeStamp,//时间戳，自1970年以来的秒数
                "nonceStr":configs.noncestr, //随机串
                "package":configs.package,
                "signType":"MD5",         //微信签名方式：
                "paySign": configs.pay_sign //微信签名
            },
            function(res){
                if(typeof configs.finalFunc == "function"){
                    configs.finalFunc();
                }
                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                    if(typeof configs.func == "function"){
                        configs.func();
                    }
                }  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            }
        );
    }
    /*
     **微信扫一扫
     **@explain
     **configs：{needResult，scanType:Array}
     */
    wxScan(configs){
      weixin.scanQRCode({
        needResult: configs.needResult, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: configs.scanType, // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          if(typeof configs.suc == 'function')
              configs.suc(result)
        }
      });
    }

  /*
   **微信获取地理位置
   **@explain
   **configs：{needResult，scanType:Array}
   */
    getLocation(func,errorFunc){
      weixin.getLocation({
        type: 'wgs84',
        success: function (res) {
          if(typeof func == 'function')
            func(res);
        },
        fail: function (error) {
            if(typeof errorFunc == 'function')
                errorFunc(error);
        }  
      })
    }
    /*
     **打开微信地图
     **@explain
     **
     */
    openLocation(config){
        weixin.openLocation({
            latitude: config.lat, // 纬度，浮点数，范围为90 ~ -90
            longitude: config.lon, // 经度，浮点数，范围为180 ~ -180。
            name: config.name || "", // 位置名
            address: config.address || "", // 地址详情说明
            scale: config.scale || 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: config.address || '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    }
}
export default Weixin;