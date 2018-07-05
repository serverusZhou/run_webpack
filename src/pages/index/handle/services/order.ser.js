import axios from '../interceptor/httpInterceptor';
import {domains} from '../../../../config.js';

class OrderService{

    //下订单
    static makeOrder(userId,params){
        return axios.post(`${domains.orderDomain}/v2/users/${userId}/simple_orders?is_takeout=true&come_from=WEB`,params)
    }
    //获取已下但未支付的订单
    static getUnpayOrder(userId){
        return axios.get(`${domains.orderDomain}/v2/users/${userId}/current_orders`)
    }
    //清除之前下的未支付订单
    static clearUnpayOrder(userId,orderId){
        return axios.put(`${domains.orderDomain}/v1/users/${userId}/orders/${orderId}/cancel_order`)
    }
    //获取订单信息
    static getOrderInfo(orderId){
        return axios.get(`${domains.orderDomain}/v2/orders/${orderId}/simple_bill`)
    }
    //获取已支付订单
    static getPaidOrders(userId){
        return axios.get(`${domains.orderDomain}/v2/users/${userId}/past_orders_only_without_review?page_size=99&locale=zh_CN&order_types=TAKEOUT&come_froms=WEB`)
    }
    static getSimpleBill(orderId,requestBody){
        return axios.get(`${domains.orderDomain}/v2/orders/${orderId}/simple_bill`,{params:requestBody})
    }
    /*
    * 获取支付参数
    * */
    static getOrderPayInfo(orderId,outTradeNo,openId){
        let request = {
            dataType:"json",
            contentType:"application/x-www-form-urlencoded",
        };
        const data={"method":"WECHATPAY","type":"H5","out_trade_no":outTradeNo,"open_id":openId};
        return axios.post(`${domains.orderDomain}/v1/orders/${orderId}/payment/create`,data,request);
    }
}

export default OrderService