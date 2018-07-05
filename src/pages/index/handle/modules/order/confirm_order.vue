<template>
    <div>
        <XfHeader :isHasReturn="true" :title="'订单确认'"></XfHeader>
        <div class="content has-f-h-content">
            <div class="co-wapper">
                <div class="co-form" style="padding:.5rem 0;">
                    <div class="from-list">
                        <mt-field label="手机号*" placeholder="请输入手机号" v-model="orderInfo.phone" type="tel"></mt-field>
                    </div>
                    <div class="from-list from-list-textarea" style="height:auto;">
                        <mt-field label="备注" placeholder="请输入备注" type="textarea" rows="3" v-model="orderInfo.note"></mt-field>
                    </div>
                    <div class="from-list" style="display:flex;align-items:center;justify-content:space-between;">
                        <p style="font-size:1.6rem;">是否立即取餐</p>
                        <mt-switch v-model="orderInfo.isEatNow"></mt-switch>
                    </div>
                    <div class="from-list" style="display:flex;align-items:center;justify-content:space-between;" v-if="!orderInfo.isEatNow">
                        <p style="font-size:1.6rem;">取餐时间*</p>
                        <p style="color:#888;font-size:1.6rem;" @click="pickTime()">{{orderInfo.getFoodTime || '请选择取餐时间'}}</p>
                        <!-- <mu-time-picker :hintText="orderInfo.getFoodTime || '请选择取餐时间'" v-model="orderInfo.getFoodTime" format="24hr" container="inline" :input="checkTime" /> -->
                        <!-- <p style="color:#888;font-size:1.6rem;" @click="isShow = true">{{orderInfo.getFoodTime || '请选择取餐时间'}}</p> -->
                    </div>
                    <div class="from-list" style="display:flex;align-items:center;justify-content:space-between;">
                        <p style="font-size:1.6rem;">是否打包</p>
                        <mt-switch v-model="orderInfo.isPackage"></mt-switch>
                    </div>
                </div>
            </div>
        </div>
        <div class="cart-btn">
            <div style="color:#cb202d;display:flex;justify-content:space-between;align-items: center;padding-left:1.5rem;">总计：￥{{totalMoney.toFixed(2)}}</div>
            <div class="pay" @click="makeOrder" :style="{color: ((checkPhone && (!(!orderInfo.isEatNow && !orderInfo.getFoodTime))) ? '#fff':'#999'),backgroundColor:((checkPhone && (!(!orderInfo.isEatNow && !orderInfo.getFoodTime))) ? '#cb202d':'#ccc')}">确认下单</div>
        </div>
        <!-- <div v-if="isShow">
            <Time-picker :hours="hours" :minutes="minutes"  v-model="orderInfo.getFoodTime" ref="timpicker" @tellChange="tellChange"></Time-picker>
        </div> -->
        <mt-datetime-picker
            ref="picker"
            type="time"
            :startHour = "(restInfo.startHour > (new Date()).getHours())? restInfo.startHour : (new Date()).getHours()"
            :endHour = "restInfo.endHour"
            @confirm = "checkTime"
            v-model="orderInfo.getFoodTime" >
        </mt-datetime-picker>
    </div>
</template>
<script>
    import {$conf} from '../../../../../config'
    import { MessageBox } from 'mint-ui';
    import restSer from '../../services/restaurant.ser'
    import authSer from '../../services/auth.ser'
    import OrserSer from '../../services/order.ser'
    // import { Group , Datetime } from 'vux'
    export default {
        name: 'ConfirmOrder',
        data() {
            return {
                'userId':'',
                'restId':'',
                'orderInfo':{
                    'phone':localStorage.getItem('userMobile'),// 如果localStorage中存放了userMobile，如果没有就是undefined
                    'note':'',
                    'isEatNow':true,
                    'isPackage':false,
                    'getFoodTime':null
                },
                'restInfo':{},
                'cartInfo':$conf.cart,
                'style':{
                    contentHeight: window.innerHeight - window.innerWidth/37.5*(5+4.5),
                },
            }
        },
        created(){
            let self = this;
            if(!self.$root.$data.cartQuantity){
                self.$router.push({
                    path:'/',
                })
                return
            }
            self.restId=Object.keys(self.cartInfo)[0];
            authSer.getUserInfo(localStorage.getItem('Authorization')).then(function(response){
                self.userId = response.data.id;
            },function(){
                MessageBox.alert('获取用户信息失败，需重新登录','提示');
            })
            restSer.getRestaurantInfo(self.restId).then(function(response){
                self.restInfo = response.data;
                if(self.restInfo.regular_hours && self.restInfo.regular_hours[0]){
                    let restRunningHour = self.restInfo.regular_hours[0];
                    try {
                        self.restInfo.startHour = parseInt(restRunningHour.split("-")[0].split(":")[0]);
                        self.restInfo.startMinute = parseInt(restRunningHour.split("-")[0].split(":")[1]);
                        self.restInfo.endHour = parseInt(restRunningHour.split("-")[1].split(":")[0]);
                        self.restInfo.endMinute = parseInt(restRunningHour.split("-")[1].split(":")[1]);
                        console.log(self.restInfo);
                    } catch (error) {
                        console.error('餐厅的开放时间设置有误',error)
                    }
                }
            })
        },
        computed:{
            'totalMoney':function(){
                let money=0;
                for(let key in this.cartInfo){
                    if(this.cartInfo && this.cartInfo[key]){
                        for(let key1 in this.cartInfo[key]){
                            money +=parseFloat(this.cartInfo[key][key1].menuPrice) * this.cartInfo[key][key1].quantity
                        }
                    }
                }
                return money
            },
            'checkPhone':function(){
                return /^1[3|4|5|8][0-9]\d{8}$/.test(this.orderInfo.phone);
            }
        },
        methods: {
           makeOrder(){
               let self = this;
               (async function(){
                   //生成请求数需要的参数
                    let orderItems = self.$cart.generateOrderReqParas();
                    if(self.checkPhone && (!(!self.orderInfo.isEatNow && !self.orderInfo.getFoodTime))){
                        try {
                            let unpayOrder = await OrserSer.getUnpayOrder(self.userId);
                            if(Object.keys(unpayOrder.data).length > 0){
                                await OrserSer.clearUnpayOrder(self.userId,unpayOrder.data.order_id);
                            }
                            function getDate(time) {
                                if(time && time.split(':').length > 1){
                                    let rightNow = new Date();
                                    rightNow.setHours(parseInt(time.split(':')[0]));
                                    rightNow.setMinutes(parseInt(time.split(':')[1]));
                                    return rightNow.toISOString();
                                }else{
                                    return "0000-00-00 00:00"
                                }
                            }
                            let orderRes = await OrserSer.makeOrder(self.userId,{
                                'restaurant_id': self.restId,
                                'order_items': orderItems,
                                'note': {
                                    "mobile": self.orderInfo.phone,
                                    "remark": self.orderInfo.note,
                                    'is_now': self.orderInfo.isEatNow,
                                    "is_pack": self.orderInfo.isPackage,
                                    "effective_date":getDate(self.orderInfo.getFoodTime)
                                }
                            })
                            localStorage.setItem('userMobile',self.orderInfo.phone);
                            self.$router.push({
                                path:'/pay',
                                query: {
                                    'orderId':orderRes.data.id,
                                    'mobile': self.orderInfo.phone,
                                    "remark": self.orderInfo.note,
                                    'is_now': self.orderInfo.isEatNow,
                                    "is_pack": self.orderInfo.isPackage,
                                    "effective_date":self.orderInfo.getFoodTime
                                }
                            })
                        } catch (error) {
                            if(error.response && error.response.status && error.response.status =='409'){
                                MessageBox.alert(JSON.stringify(error.response))
                                //MessageBox.alert('抱歉，餐厅已歇业，请去其它餐厅订餐','提示');
                            }
                        }
                    }
               })()   
           },
           pickTime(){
               let self =this;
               if(!self.orderInfo.getFoodTime){
                   let rightNow = new Date();
                    if(rightNow.getMinutes() < 50){
                        self.orderInfo.getFoodTime = rightNow.getHours() + ":" + (rightNow.getMinutes()+10);
                    }else{
                        self.orderInfo.getFoodTime = (rightNow.getHours()+1) + ":00";
                    }
               }
               self.$refs.picker.open();
           },
           checkTime(value){
               let self =this;
               let rightNow = new Date();
               if(parseInt(value.split(':')[0]) < rightNow.getHours() || (parseInt(value.split(':')[0]) == rightNow.getHours() && parseInt(value.split(':')[1]) < rightNow.getMinutes())){
                   if(rightNow.getMinutes() < 50){
                        self.orderInfo.getFoodTime = rightNow.getHours() + ":" + (rightNow.getMinutes()+10);
                   }else{
                       self.orderInfo.getFoodTime = (rightNow.getHours()+1) + ":00";
                   }
               }
           }
        },
    }
</script>
<style>
    .content.has-f-h-content{height:calc(100vh - 4.9rem - 4.8rem);overflow: scroll;}
    .co-wapper{background-color: #f6f6f6;min-height:100%;}
    .cart-btn{height:5rem;display:flex;justify-content:space-between;align-items: center;color:#fff;font-size:16px;box-shadow: 0 0 .5rem #ccc;}
    .pay{background-color:#cb202d;display:flex;justify-content: center;align-items: center;width:50%;color:#fff;height:100%;}
    .from-list{border-bottom:1px #f4f4f4 solid;height:6rem;display:flex;justify-content: center;align-items: center;padding:0 2rem;background-color: #fff;overflow: hidden;width:30rem;}
    .co-form{display: flex;align-items: center;justify-content: center;flex-direction: column;}
    .from-list .mint-cell-wrapper{background-image: none;}
    .from-list .mint-cell:last-child{background-image: none;}
    .from-list.from-list-textarea .mint-cell-wrapper{align-items: flex-start;}
    .from-list .mint-cell{width:100%;}
    .from-list .mint-cell-wrapper{padding:0;}
    .from-list .mint-field-core{text-align: right;color:#888;}
    .mu-time-display{background-color:#cb202d;}
    .mu-clock-pointer{background-color:#cb202d;}
    .mu-clock-number.selected{background-color:#cb202d;}
    .mu-flat-button-primary{color:#cb202d;}
    .mu-text-field-content{padding:0;width:auto;}
    .mu-text-field{padding:0;margin:0;display: flex;align-items: center;justify-content: center;}
    .mu-text-field-hint{text-align: right;}
    .mu-time-picker{width:auto;}
    .mu-text-field{width:auto;}
    .mu-text-field-input{text-align: right;color:#888;}
</style>