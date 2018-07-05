<template>
<div>
  <footer class="xf-footer">
    <div class="footer-tab footer-rest-tab" :class="{'active':(tab=='rest')}"  v-route-to="''">
      <div class="footer-button-icon"></div>
      <p class="footer-tab-name">餐厅</p>
    </div>
    <div class="footer-tab footer-order-tab" :class="{'active':(tab=='order')}" v-route-to="'orderList'">
      <div class="footer-button-icon"></div>
      <p class="footer-tab-name">订单</p>
    </div>
  </footer>
</div>
</template>
<script>
export default {
  name: "XfHeader",
  data() {
    return {
      popupVisible: false,
      isHasReturn: false,
      isHasSearch: true,
    };
  },
  props: {
    tab: String  //定义传值的类型<br>
  }
};
</script>
<style scoped>
  .xf-footer {
    position: relative;
    z-index: 11;
    height: 4.9rem;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 .4rem .9rem 0 rgba(114,114,114,0.50);
  }
  .xf-footer > div {
    display: flex;
    width: 50%;
    justify-content: center;
    align-items: center;
  }
  .xf-footer > div:active{
    color:red;
  }
  .active{color:red;}
  .footer-tab{display: flex;flex-direction: column;align-items: center;}
  .footer-button-icon{width:1.8rem;height:1.8rem;}
  .footer-tab-name{text-align: center;height: 1.7rem;font-size: 1.2rem;line-height: 1.4rem;padding-top:.3rem;}
  .footer-tab.active p.footer-tab-name{color:#CB202D;}
  .footer-tab.footer-rest-tab div.footer-button-icon{background: url(../../assets/images/tab_icon_home.svg) no-repeat;background-size: 100% 100%;background-position: center;}
  .footer-tab.footer-order-tab div.footer-button-icon{background: url(../../assets/images/tab_icon_order.svg) no-repeat;background-size: 100% 100%;background-position: center;}
  .footer-tab.footer-rest-tab.active div.footer-button-icon{background: url(../../assets/images/tab_icon_home_selected.svg) no-repeat;background-size: 100% 100%;background-position: center;}
  .footer-tab.footer-order-tab.active div.footer-button-icon{background: url(../../assets/images/tab_icon_order_selected.svg) no-repeat;background-size: 100% 100%;background-position: center;}
</style>


