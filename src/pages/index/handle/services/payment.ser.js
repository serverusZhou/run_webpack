import axios from '../interceptor/httpInterceptor';
import {domains} from '../../../../config.js';

class OrderService{
    /*
    * 获取支付参数
    * */
    static getOrderPayInfo(orderId,outTradeNo,openId){
        let request = {
            dataType:"json",
            contentType:"application/x-www-form-urlencoded",
        };
        const data={"method":"WECHATPAY","type":"H5","out_trade_no":outTradeNo,"open_id":openId};
        return axios.post(`${domains.paymentDomain}/v1/orders/${orderId}/payment/create`,data,request);
    }
}

export default OrderService