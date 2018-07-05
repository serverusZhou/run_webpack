<template>
    <div>
        <div>
            <XfHeader :isHasReturn="true" :title="'支付'"></XfHeader>
            <div class="content has-f-h-content">
                <div style="padding:.5rem 0;">
                  <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="手机号：" :value="orderInfo.mobile"></mt-cell>
                  </div>
                  <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="备注：" :value="orderInfo.remake"></mt-cell>
                  </div>
                  <div class="p-cell-list p-cell-list-blod" style="background-color:#fff;">
                    <mt-cell title="取餐时间：" :value="orderInfo.is_now ? '立即取餐' : orderInfo.effective_date"></mt-cell>
                  </div>
                  <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="是否打包：" :value="orderInfo.is_pack ? '打包' : '不打包'"></mt-cell>
                  </div>
                </div>
                <div class="pay-info">
                  <div class="rest-banner-title">
                    <span>{{orderInfo.restName}}</span>
                  </div>
                  <div style="width:34rem;margin:0 auto;">
                    <ul style="background-color:#fff;">
                      <li v-for="item in orderInfo.orderItems" :key="item.item_id" class="p-order-item" style="background-color:#fff;">
                        <p class="p-order-item-name">{{item.item_name}}</p>
                        <p style="width:6rem;font-size:1.6rem;color:#888;">x{{item.quantity}}</p>
                        <p style="width:6rem;text-align:right;font-size:1.6rem;color:#888;" v-if="item.price.amount">￥{{item.price.amount.toFixed(2)}}</p>
                      </li>
                    </ul>
                  </div>
                  <div class="p-cell-list p-cell-list-blod" style="background-color:#fff;">
                    <mt-cell title="小计：" :value="'￥'+totalMoney.toFixed(2)"></mt-cell>
                  </div>
                  <div style="width:34rem;margin:0 auto;" v-if="orderInfo.packFee">
                    <ul>
                      <li class="p-order-item" style="background-color:#fff;">
                        <p class="p-order-item-name">打包费：</p>
                        <p style="width:6rem;font-size:1.6rem;color:#888;">x{{orderInfo.orderNum}}</p>
                        <p style="width:6rem;text-align:right;font-size:1.6rem;color:#888;">￥{{((orderInfo.packFee/orderInfo.orderNum)).toFixed(2)}}</p>
                      </li>
                    </ul>
                  </div>
                  <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="团体折扣:" :value="'-￥'+orderInfo.groupDiscount"></mt-cell>
                  </div>
                  <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="额外减免:" :value="'-￥'+orderInfo.saving"></mt-cell>
                    </div>
                </div>
            </div>
            <div class="cart-btn">
                <div style="color:#cb202d;display:flex;justify-content:space-between;align-items: center;padding-left:1.5rem;">需支付：￥{{orderInfo.totalDue}}</div>
                <div class="pay" @click="pay">确认支付</div>
            </div>
        </div>
    </div>
</template>
<script>
import { $conf } from "../../../../../config";
import { MessageBox } from "mint-ui";
import authSer from "../../services/auth.ser";
import OrserSer from "../../services/order.ser";
import paymentSer from "../../services/payment.ser";
import Weixin from "../../../../../utils/weixin/Weixin"
export default {
  name: "Payment",
  data() {
    return {
      orderId: this.$route.query.orderId,
      userId: "",
      socialAccId: "",
      orderInfo: {
        mobile: this.$route.query.mobile,
        remake: this.$route.query.remark,
        is_now: this.$route.query.is_now,
        is_pack: this.$route.query.is_pack,
        effective_date:this.$route.query.effective_date,
        tax: 0,
        tip: 0,
        groupDiscount: 0,
        saving: 0,
        totalDue: 0,
        packFee:0,
        orderNum:0
      },
      cartInfo: $conf.cart,
      unablePay: false, //控制不能重复点击（寻找更好的方式）
    };
  },
  computed: {
    totalMoney: function() {
      let money = 0;
      for (let key in this.cartInfo) {
        if (this.cartInfo && this.cartInfo[key]) {
          for (let key1 in this.cartInfo[key]) {
            money += parseFloat(this.cartInfo[key][key1].menuPrice) *this.cartInfo[key][key1].quantity;
          }
        }
      }
      return money;
    }
  },
  created() {
    let self = this;
    console.log('cartInfocartInfo',self.cartInfo);
    OrserSer.getOrderInfo(self.orderId).then(
      function(response) {
        // 如果订单状态不是SUBMITTED的，此页面已经失效，将跳转到首页
        if(response.data.status != "SUBMITTED"){
          self.$router.push({
            path: '/'
          })
          return
        }
        self.orderInfo.tax = response.data.total_tax ? response.data.total_tax.toFixed(2) : '0.00';
        self.orderInfo.tip = response.data.tip ? response.data.tip.toFixed(2) : '0.00';
        self.orderInfo.totalDue = (parseFloat(response.data.total_amount_to_pay_with_bd_and_gd) -parseFloat(response.data.group_discount ? response.data.group_discount : 0)).toFixed(2);
        self.orderInfo.saving = parseFloat(response.data.blue_dollar_savings? response.data.blue_dollar_savings: 0).toFixed(2);
        self.orderInfo.groupDiscount = parseFloat(response.data.group_discount ? response.data.group_discount : 0).toFixed(2);
        self.orderInfo.restName = response.data.restaurant_name;
        self.orderInfo.orderItems = response.data.order_items;
        self.orderInfo.packFee = parseFloat(response.data.pack_fee ? response.data.pack_fee : 0);
        if(self.orderInfo.orderItems && self.orderInfo.orderItems.length>0){
          for(let index in self.orderInfo.orderItems){
            let item = self.orderInfo.orderItems[index];
            self.orderInfo.orderNum += parseInt(item.quantity);
          }
        }
        //self.orderInfo.totalDue = (parseFloat(self.orderInfo.tip) + parseFloat(self.orderInfo.subT) + parseFloat(self.orderInfo.tax) - parseFloat(self.orderInfo.saving)).toFixed(2) - (parseFloat(self.orderInfo.groupDiscount)).toFixed(2);
      },
      function(err) {
        console.error("获取订单信息失败！", JSON.stringify(err));
      }
    );
    authSer.getUserInfo(localStorage.getItem("Authorization")).then(
      function(response) {
        self.userId = response.data.id;
        self.socialAccId = response.data.socialAccId;
      },
      function(err) {
        console.error("获取用户信息失败", JSON.stringify(err));
      }
    );
  },
  methods: {
    pay() {
      let self = this;
      if (self.unablePay) return;
      self.unablePay = true;
      OrserSer.getSimpleBill(self.orderId, {
        user_id: self.userId,
        is_server: true,
        come_from: "WEB",
        is_online_payment: true,
        locale: "zh_CN"
      }).then(orderDetail => {
        paymentSer.getOrderPayInfo(self.orderId,orderDetail.data.out_trade_no,self.socialAccId).then(payInfo => {
            $conf.WX.wxPay({
              noncestr: payInfo.data.nonce_str,
              timeStamp: payInfo.data.timestamp,
              appid: payInfo.data.app_id,
              package: payInfo.data.pkg,
              pay_sign: payInfo.data.pay_sign,
              func: function() {
                self.$root.$data.cartQuantity=self.$cart.clearCart();
                self.$router.push({
                    path:'receipt',
                    query: {
                        'orderId':self.orderId,
                    }
                })
              },
              finalFunc: function() {
                  self.unablePay = false;
              }
            });
            console.info("获取支付信息成功！");
          }).catch(function(error) {
            self.unablePay = false;
            console.error("获取支付信息出错！" + JSON.stringify(error));
          });
      });
    }
  }
};
</script>
<style>
.content.has-f-h-content{height:calc(100vh - 4.9rem - 4.8rem);overflow: scroll;}
.cart-btn {
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 16px;
  box-shadow: 0 0 0.5rem #ccc;
}
.pay {
  background-color: #cb202d;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  color: #fff;
  height: 100%;
}
.mint-cell-value {
  max-width: 22rem;
}
.p-cell-list{
  padding:0 1.75rem;
  width:34rem;
  margin: 0 auto;
  border-bottom:1px #fafafa solid;
}
.p-cell-list .mint-cell-wrapper{
  background-image: none;
  padding-left:0;
  padding-right: 0;
}
.p-cell-list .mint-cell-text{
  font-size:1.6rem;
}
.p-cell-list .mint-cell-value{
  font-size:1.6rem;
}
.p-cell-list .mint-cell:last-child{
  background-image: none;
}
.p-cell-list.p-cell-list-blod .mint-cell-text , .p-cell-list.p-cell-list-blod .mint-cell-value{
  font-weight: 700;
  color: #000;
}
.rest-banner-title{
  height: 6rem;
  background: url(../../assets/images/bg_gray.png) no-repeat;
  background-size: contain;
  padding:0 2rem;
  display: flex;
  align-items:center;
  justify-content:space-between;
}
.rest-banner-title>span{
  font-size: 1.8rem;
  color:#4a4a4a;
}
.p-order-item{
  display: flex;
  height:48px;
  border-bottom:1px #fafafa solid;
  align-items: center;
}
.p-order-item-name{
  width:22rem;
  font-size:1.6rem;
}
</style>
