/**
 * 
 * @param {*} router 
 * @description 路由拦截
 */
import authService from '../services/auth.ser'
import {$conf} from '../../../../config'
import Util from '../../../../utils/util/Util'
import URLSearchParams from 'url-search-params';
const util = new Util();
export default function(router){
    //  判断是否需要登录权限 以及是否登录
    router.beforeEach(async (to, from, next) => {
        if (localStorage.getItem('Authorization')) {// 判断是否登录
          $conf.token = localStorage.getItem('Authorization');
          $conf.axios.defaults.headers.common['Authorization'] = $conf.token;
        } 
       if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
         if (localStorage.getItem('Authorization')) {// 判断是否登录
             next()
         } else {// 没登录则跳转到登录界面
            localStorage.setItem('ShouldReturnPage',location.href);
            $conf.WX.wxLogin();
         }
       } else {
        let urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has("code")){
            if(localStorage.getItem('Authorization')){
              location.href=location.protocol+"//"+location.host+location.pathname;
            }else{
              authService.getAuthorization(urlParams.get("code")).then(function(response){
                localStorage.setItem('Authorization',"Bearer "+response.data.access_token);
                let ShouldReturnPage = localStorage.getItem('ShouldReturnPage');
                localStorage.removeItem('ShouldReturnPage');
                location.href=ShouldReturnPage;
              })
            }
        }else{
          next();
        }
       }
     })
}