/**
 * http配置
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import Weixin from '../../../../utils/weixin/Weixin'
import {$conf} from '../../../../config'
import { Indicator } from 'mint-ui';
$conf.axios = axios;
// 超时时间
axios.defaults.timeout = 5000;
// 统一设置Authorization
axios.defaults.headers.common['Authorization'] = $conf.token;
// http请求拦截器
axios.interceptors.request.use(config => {
    Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
    });
    return config
}, error => {
    Indicator.close();
    return Promise.reject(error)
});
// http响应拦截器
axios.interceptors.response.use(data => {
    Indicator.close();
    return data
}, error => {
    Indicator.close();
    if(error.response.status == 401 || error.response.status == 403){
        localStorage.removeItem('Authorization');
        $conf.WX.wxLogin();
    }
    if(error.response.status == 404 && error.response.data.fieldName == "CURRENT_USER_NOT_EXIST"){
        localStorage.removeItem('Authorization');
        $conf.WX.wxLogin();
    }
    if(error.response.status == 401 && error.response.data.fieldName == "accessToken"){
        localStorage.removeItem('Authorization');
        $conf.WX.wxLogin();
    }
    if(error.response.status == 409 && error.response.data.fieldName == "wechat jsapi create order error"){
        alert(Weixin.wxLogin);
    }
    return Promise.reject(error)
});

export default axios