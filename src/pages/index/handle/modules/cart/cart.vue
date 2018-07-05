<template>
  <div>
      <XfHeader :isHasReturn="true" :isHasClearCart="true" :title="'购物车'" :class="{'has-f-content':!Object.keys(cartInfo).length}"></XfHeader>
      <div class="content has-f-h-content">
         <div v-for="(rest,key) in cartInfo" :key="key" style="width:34rem;margin:0 auto;" v-if="Object.keys(cartInfo).length">
              <div v-for="(menu,key1)  in rest" :key="key1" style="width:34rem;padding:1.7rem 0;display:flex;justify-content:space-between;border-bottom:1px solid #ececec;">
                  <div class="menu-img" style="width:16rem;height:9rem;overflow:hidden;border-radius:.3rem;">
                    <img :src="menu.menuImg" style="width:100%;height:100%;"/>
                  </div>
                  <div class="menu-detail-content"
                        style="width:18rem;height:9rem;display:flex;justify-content:space-between;flex-direction:column;">
                    <p style="padding-left:1rem;font-size:1.6rem;">{{menu.menuName}}</p>
                    <div style="display:flex;justify-content:space-between;">
                      <div class="menu-price" 
                            style="width:7rem;display:flex;justify-content:center;align-items: center;color:red;font-size:1.6rem;color:#cb212e;">
                            ￥{{menu.menuPrice}}
                      </div>
                      <div class="qulity-action">
                        <p class="menu-circle reduce" @click="removeFromCart(key,key1)"></p>
                        <p style="width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;font-size:1.6rem;">{{menu.quantity}}</p>
                        <p class="menu-circle add" @click="addToCart(key,key1,menu.menuImg,menu.menuName,menu.menuPrice)"></p>
                      </div>
                    </div>
                  </div>
              </div>
         </div>
         <div v-if="!Object.keys(cartInfo).length" style="text-align:center;padding:3rem;">
           你的购物车是空的
         </div>
      </div>
      <div class="cart-btn" v-if="Object.keys(cartInfo).length">
        <div style="color:#cb212e;display:flex;justify-content:space-between;align-items: center;padding-left:1.5rem;">总计：￥{{totalMoney.toFixed(2)}}</div>
        <div class="pay" @click="goComfirmOrder">继续</div>
      </div>
  </div>
</template>
<script>
import { $conf } from "../../../../../config";
import { MessageBox } from "mint-ui";
export default {
  name: "cart",
  data() {
    return {
      cartInfo: $conf.cart,
    };
  },
  created() {},
  watch: {
    '$root.$data.cartQuantity':function(){
      this.cartInfo = $conf.cart;
    }
  },
  computed: {
    totalMoney: function() {
      let money = 0;
      for (let key in this.cartInfo) {
        if (this.cartInfo && this.cartInfo[key]) {
          for (let key1 in this.cartInfo[key]) {
            money +=
              parseFloat(this.cartInfo[key][key1].menuPrice) *
              this.cartInfo[key][key1].quantity;
          }
        }
      }
      return money;
    }
  },
  methods: {
    addToCart: function(restId, menuId, menuImg, menuName, menuPrice) {
      let self = this;
      let [quantity, addSuc] = self.$cart.addCart(
        restId,
        menuId,
        menuImg,
        menuName,
        menuPrice
      );
      self.$root.$data.cartQuantity = quantity;
      self.cartInfo = {};
      self.cartInfo = $conf.cart;
    },
    removeFromCart: function(restId, menuId) {
      let self = this;
      let quantity = self.$cart.removeCart(restId, menuId);
      self.$root.$data.cartQuantity = quantity;
      self.cartInfo = {};
      self.cartInfo = $conf.cart;
    },
    goComfirmOrder: function() {
      if (Object.keys(this.cartInfo).length) {
        this.$router.push({
          path: "/confirmOrder"
        });
      } else {
        MessageBox.alert("你购物车没有商品！", "跳转失败提示");
      }
    }
  }
};
</script>
<style>
.content.has-f-h-content {
  height: calc(100vh - 4.9rem - 4.8rem);
  overflow: scroll;
}
.content.has-f-h-content.has-f-content{
  height: calc(100vh - 4.9rem);
  overflow: scroll;
}
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
.menu-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
}
.menu-circle.add {
  background: url(../../assets/images/icon_plus.png) no-repeat;
  background-size: 100% 100%;
}
.menu-circle.reduce {
  background: url(../../assets/images/icon_reduce.png) no-repeat;
  background-size: 100% 100%;
}
.qulity-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 9rem;
  margin: 0 auto;
}
.menu-circle:active {
  background-color: #ccc;
}
</style>


