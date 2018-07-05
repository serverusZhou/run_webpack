/**
 * Created by DELL on 2017/10/31.
 */
class Util{
  /*
   *@explain 获取浏览器类型
   */
  getAgentVersion(){
    const u = navigator.userAgent;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == " qq" //是否QQ
    };
  }
  /*
   *@explain 获取设备的操作系统类型
   */
  getOs(){
    let userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
    return os;
  }

  /*
    Format Url
  * */
  formatUrl(url,params){
      let jsonArray = url.split("$");
      let finalUrl = "";
      jsonArray.forEach(function(urlvalue,i){
          for(let p in params){
              if(urlvalue == p){
                  jsonArray[i]= params[p];
              }
          }
      });
      jsonArray.forEach(function(urlvalue,i){
          finalUrl+=urlvalue;
      });
      return finalUrl
  }
  /*
  * 将日期转为年月日 时分格式
  * */
  formatChineseDate(date,type){
      let dateObj = new Date(date);
      function formatNumToTwo(num) {
          if(!num)
              return "00";
          else if(num < 10)
              return ("0" + num);
          else
              return num
      }
      if(type == "ymd")
          return dateObj.getFullYear() + "-" + formatNumToTwo(dateObj.getMonth()+1) + "-" + formatNumToTwo(dateObj.getDate());
      if(type == "hm")
          return formatNumToTwo(dateObj.getHours()) + ":" + formatNumToTwo(dateObj.getMinutes());
      return dateObj.getFullYear() + "-" + formatNumToTwo(dateObj.getMonth()+1) + "-" + formatNumToTwo(dateObj.getDate())+"  " + formatNumToTwo(dateObj.getHours()) + ":" + formatNumToTwo(dateObj.getMinutes());
  }
  /*
  * 日期如果是今天改成 今天 00：00
  * */
  checkTimeIfToday(time){
    if(!(time instanceof Date)){
      return '这不是Date类型'
    }
    let today = new Date();
    if(time.getFullYear() == today.getFullYear() && time.getMonth() == today.getMonth() && time.getDate()== today.getDate()){
      return '今天 '+time.getHours() +':' +time.getMinutes()
    }else{
      return this.formatChineseDate(time.toISOString());
    }
  }
  getLocation(){
    return new Promise(function (resolve, reject) {
      if (navigator.geolocation)
      {
          let geoSuccess = function(position){
            resolve(position);   
          }
          let geoError = function(event) {
            resolve(event);
          }
          navigator.geolocation.getCurrentPosition(geoSuccess,geoError);
      }
      else{
        resolve("Geolocation is not supported by this browser.");
      }
    });
  }
  // 数字补位
  prefixInteger(num,length){
    return (Array(length).join('0') + num).slice(-length);
  }
}
export default Util;