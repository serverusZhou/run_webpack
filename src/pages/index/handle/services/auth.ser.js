/**
 * Created by DELL on 2017/11/6.
 */
import axios from '../interceptor/httpInterceptor';
import {domains} from '../../../../config.js';
import URLSearchParams from 'url-search-params';

class AuthService{
    /*
        获取Authorization
   * */
    static getAuthorization(code){
      let request = {
        dataType:"json",
        contentType:"application/x-www-form-urlencoded",
      };
      let params = new URLSearchParams();
      params.append('password', code);
      params.append('username', 'WEIXIN_H5');
      params.append('grant_type', 'password');
      return axios.post(domains.authDomain + "/oauth/token",params,request)
    }
    /*
      获取用户信息
    * */
   static getUserInfo(authorization){
      let request = {
        dataType:"json",
        contentType:"application/x-www-form-urlencoded",
      };
      return axios.get(domains.authDomain + "/oauth/currentuser",request);
  }
  /*
    微信基础配置以及调用微信分享
  * */
  static getWxTicket(){ return axios.get(`${domains.authDomain}/v1/weixin_jsapi_ticket`) }
}

export default AuthService