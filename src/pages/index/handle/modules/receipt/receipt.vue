<template>
    <div>
        <XfHeader :isHasReturn="true" :title="'订单详情'"></XfHeader>
        <div class="content has-h-content" style="overflow:scroll;">
            <div>
                <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="手机号：" :value="orderInfo.phone"></mt-cell>
                </div>    
                 <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="备注：" :value="orderInfo.note"></mt-cell>
                </div>
                <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="取餐方式：" :value="orderInfo.isPack ? '打包' : '堂食'"></mt-cell>
                </div>
                <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="下单时间：" :value="orderInfo.createTime"></mt-cell>
                </div>
                <div class="p-cell-list p-cell-list-blod" style="background-color:#fff;">
                    <mt-cell title="取餐时间：" :value="orderInfo.pickedUpTime"></mt-cell>
                </div>
                <div class="pay-info">
                  <div class="code-banner-title">
                    <p style="color:#333;padding-left:1.6rem;font-size:1.6rem;padding-top:1.5rem;">{{orderInfo.restName}}</p>
                    <p style="font-size:1.6rem;color:#888;padding:.4rem 0 1rem;padding-left:1.6rem;">{{orderInfo.restAddr}}</p>
                    <p style="height:8rem;line-height:10rem;font-size:4.8rem;color:#333;padding-left:1.6rem;font-weight:700;"><span style="font-size:4.6rem;font-weight:700;">取餐号：</span>{{orderInfo.orderNo}}</p>
                  </div>
                  <div style="width:34rem;margin:0 auto;">
                    <ul style="background-color:#fff;">
                      <li v-for="item in orderInfo.orderItems" :key="item.item_id" class="p-order-item" style="background-color:#fff;">
                        <p class="p-order-item-name">{{item.item_name}}</p>
                        <p style="width:6rem;font-size:1.6rem;color:#888;">x {{item.quantity}}</p>
                        <p style="width:6rem;text-align:right;font-size:1.6rem;color:#888;">￥{{item.price.amount.toFixed(2)}}</p>
                      </li>
                    </ul>
                  </div>
                  <div class="p-cell-list p-cell-list-blod" style="background-color:#fff;">
                    <mt-cell title="小计：" :value="'￥'+orderInfo.subTotal.toFixed(2)"></mt-cell>
                  </div>
                  <!-- <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="打包费:" :value="'￥'+orderInfo.packFee"></mt-cell>
                  </div> -->
                  <div style="width:34rem;margin:0 auto;">
                    <ul style="background-color:#fff;">
                      <li class="p-order-item" style="background-color:#fff;">
                        <p class="p-order-item-name">打包费：</p>
                        <!-- <p style="width:6rem;font-size:1.6rem;color:#888;" v-if="orderInfo.packFee">x {{orderInfo.orderNum}}</p> -->
                        <p style="width:6rem;font-size:1.6rem;color:#888;"> </p>
                        <p style="width:6rem;text-align:right;font-size:1.6rem;color:#888;" v-if="orderInfo.packFee">￥{{((orderInfo.packFee)).toFixed(2)}}</p>
                        <p style="width:6rem;text-align:right;font-size:1.6rem;color:#888;" v-else>￥0.00</p>
                      </li>
                    </ul>
                  </div>
                  <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="团体折扣:" :value="'-￥'+orderInfo.groupDiscount"></mt-cell>
                  </div>
                  <div class="p-cell-list" style="background-color:#fff;">
                    <mt-cell title="额外减免:" :value="'-￥'+orderInfo.saving"></mt-cell>
                  </div>
                  <div class="p-cell-list p-cell-list-blod" style="background-color:#fff;">
                    <mt-cell title="已支付:" :value="'￥'+orderInfo.finalpay"></mt-cell>
                  </div>
                  <div style="height:100px;width:30rem;">
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import authSer from "../../services/auth.ser";
import OrderSer from "../../services/order.ser";
import Util from "../../../../../utils/util/Util";
let util = new Util();
export default {
  name: "OrderList",
  data() {
    return {
      orderId: this.$route.query.orderId,
      orderInfo: {
        phone: "",
        note: "",
        orderNo: "",
        subTotal: 0,
        saving: "",
        totalDue: "",
        isPack: false,
        orderNum:0
      }
    };
  },
  created() {
    let self = this;
    OrderSer.getOrderInfo(self.orderId).then(function(res) {
      self.orderInfo.phone = res.data.note.mobile;
      if (res.data.note && res.data.note.remark) {
        self.orderInfo.note = res.data.note.remark;
        self.orderInfo.isPack = res.data.note.is_pack;
      } else {
        self.orderInfo.note = "无备注";
      }
      self.orderInfo.subTotal = res.data.sub_total_before_first_visit_savings;
      self.orderInfo.orderNo = res.data.order_no;
      self.orderInfo.totalDue = (parseFloat(
        res.data.total_amount_to_pay_with_bd_and_gd
      ) - parseFloat(res.data.group_discount ? res.data.group_discount : 0)
      ).toFixed(2);
      self.orderInfo.groupDiscount = parseFloat(res.data.group_discount ? res.data.group_discount : 0).toFixed(2);
      self.orderInfo.saving = (parseFloat(
        res.data.blue_dollar_savings ? res.data.blue_dollar_savings : 0
      ) +
        parseFloat(
          res.data.blue_dollar_amount_paid
            ? res.data.blue_dollar_amount_paid
            : 0
        )
      ).toFixed(2);
      self.orderInfo.restName = res.data.restaurant_name;
      self.orderInfo.restAddr = res.data.restaurant_addresses.address1;
      self.orderInfo.packFee = res.data.pack_fee ? res.data.pack_fee : 0
      self.orderInfo.orderItems =  res.data.order_items;
      self.orderInfo.finalpay = (res.data.sub_total_after_discounts ? res.data.sub_total_after_discounts : 0).toFixed(2);
      self.orderInfo.pickedUpTime = util.checkTimeIfToday(new Date(res.data.picked_up_time));
      self.orderInfo.createTime =  util.checkTimeIfToday(new Date(res.data.create_time));
      if(self.orderInfo.orderItems && self.orderInfo.orderItems.length>0){
          for(let index in self.orderInfo.orderItems){
            let item = self.orderInfo.orderItems[index];
            self.orderInfo.orderNum += parseInt(item.quantity);
          }
        }
    });
  },
  methods: {}
};
</script>
<style>
.content {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.content.has-h-content{
  height:calc(100vh - 4.96rem);
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 34.5rem;
  margin: 0 auto;
  padding: 1.7rem 0;
  border-bottom: 1px #efefef solid;
}
.menu-pic-content {
  width: 16rem;
  height: 9rem;
  border-radius: 0.3rem;
  overflow: hidden;
}
.search-btn {
  width: 10rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0.5rem #ccc;
}
.search-btn:active {
  background-color: #efefef;
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
.code-banner-title{
  height: 18rem;
  background: url(../../assets/images/bg_large.png) no-repeat;
  background-size: contain;
  display: flex;
  align-items: flex-start;
  justify-content:flex-start;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}
.code-banner-title>span{
  font-size: 1.8rem;
  color:#4a4a4a;
}
.p-order-item{
  display: flex;
  height:4.9rem;
  border-bottom:1px #fafafa solid;
  align-items: center;
}
.p-order-item-name{
  width:22rem;
  font-size:1.6rem;
}
.p-cell-list.p-cell-list-blod .mint-cell-text , .p-cell-list.p-cell-list-blod .mint-cell-value{
  font-weight: 700;
  color: #000;
}
</style>