<template>
<div>
  <header class="xf-header"  v-bind:class="{'isAbs':isAbs,'isWhite':isWhite}">
    <div>
      <div class="xflogo" v-if="isHasLogo"></div>
      <!--回退按钮-->
      <button class="mint-button mint-xfbutton" v-if="isHasReturn" @click="$router.go(-1)" style="padding-left:1.55rem;">
        <span class="mint-button-icon">
          <i class="mintui mintui-back"></i>
        </span>
        <label class="mint-button-text"></label>
      </button>
    </div>
    <div v-if="title" class="xf-title">{{title}}</div>
    <div class='align-right'>
     <!--搜索按钮-->
      <button class="mint-button mint-xfbutton" v-if="isHasSearch" @click="goSearch" style="margin-right:2.5rem;">
        <span class="mint-button-icon">
          <i class="mintui mintui-searchfd"></i>
        </span>
        <label class="mint-button-text"></label>
      </button>
      <!--购物车按钮-->
      <button class="mint-button mint-xfbutton" v-if="isHasCart" style="position:relative;padding-right:.3rem;" v-route-to="'cart'">
         <div class="cart-num-title" ref="cartnum" v-if="$root.$data.cartQuantity > 0">
           {{$root.$data.cartQuantity}}
         </div>
        <span class="mint-button-icon">
          <i class="mintui mintui-cart"  style="font-size:2.4rem;"></i>
        </span>
        <label class="mint-button-text"></label>
      </button>
      <!--清空购物车-->
      <div v-if="isHasClearCart && ($root.$data.cartQuantity > 0)" @click="clearCart">清空购物车</div>
    </div>
  </header>
</div>
</template>
<script>
import { MessageBox } from 'mint-ui';
export default {
  name: "XfHeader",
  data() {
    return {
    };
  },
  props:{
    isAbs: Boolean,
    isHasReturn: Boolean,
    isHasSearch: Boolean,
    isHasCart: Boolean,
    isHasLogo: Boolean,
    isHasClearCart: Boolean,
    title: String,
    isWhite: Boolean
  },
  methods:{
    clearCart(){
      MessageBox.confirm('是否确认清空购物车?').then(action => {
        this.$root.$data.cartQuantity=this.$cart.clearCart();
      });
    },
    goSearch(){
      localStorage.removeItem('searchKey');
      this.$router.push({
        path: '/restSearch'
        })
    }
  },
  watch:{
    '$root.$data.cartQuantity': function(){
      if(this.$refs.cartnum){
        this.$refs.cartnum.setAttribute("class","cart-num-title cart-num-title-big");
        setTimeout(()=>{
          this.$refs.cartnum.setAttribute("class","cart-num-title");
        },300)
      }
    }
  },
  created(){
    console.log(this.isAbs);
  }
};
</script>
<style>
  .xf-header {
    position: relative;
    z-index: 1;
    height: 4.8rem;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 0 1rem #ccc;
  }
  .mintui-cart{
    display: block;
    background: url(../../assets/images/icon_cart_black.svg) no-repeat;
    background-size: 100%;
    width:1.8rem;
    height:1.8rem;
  }
  .mintui-searchfd{
    display: block;
    background: url(../../assets/images/icon_search.svg) no-repeat;
    background-size: 100%;
    width:1.8rem;
    height:1.8rem;
  }
  .xf-header.isAbs{
    position: absolute;
    background-color: transparent;
    box-shadow: 0 0 0 #ccc;
    width:100%;
  }
  .xf-header.isAbs.isWhite{
    color:#fff;
  }
  .xf-header.isAbs.isWhite .mintui-cart{
    display: block;
    background: url(../../assets/images/iocn_cart_white.svg) no-repeat;
    background-size: 100%;
    width:1.8rem;
    height:1.8rem;
  }
  .xf-header > div {
    display: flex;
    width: 33%;
    justify-content: flex-start;
    align-items: center;
  }
  .xf-header > div.align-right {
    justify-content: flex-end;
    padding-right:1.55rem;
  }
  .mint-xfbutton {
    border: none;
    background-color: transparent;
    box-shadow: none;
  }
  .xf-header > div>.xflogo {
    width:5.25rem;
    height:1.5rem;
    background: url(../../assets/images/fandanlogo.png) no-repeat;
    background-size: 3.7rem 1.5rem;
    background-position: center right;
  }
  .xf-header > div.xf-title{
    justify-content: center;
    align-items: center;
    font-size:1.6rem;
  }
  .cart-num-title{
    display:block;
    font-size:.8rem;
    position:absolute;
    top:.6rem;
    right:0;
    width:14px;
    height:14px;
    border-radius:50%;
    background-color:red;
    color:#fff;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0;
    text-indent: 0;
    padding:0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cart-num-title-big{
     animation: addCart .3s;
    -moz-animation: addCart .3s;	/* Firefox */
    -webkit-animation: addCart .3s;	/* Safari 和 Chrome */
    -o-animation: addCart .3s;
  }

  .from-list .mint-switch-input:checked + .mint-switch-core{
    border-color: rgb(203, 32, 45);
    background-color: rgb(203, 32, 45);

  }
  @keyframes addCart
  {
    0% {
      width:14px;
      height:14px;
    }
    50% {
      width:17px;
      height:17px;
    }
    100% {
      width:14px;
      height:14px;
    }
  }

  @-moz-keyframes addCart /* Firefox */
  {
    0% {
      width:14px;
      height:14px;
    }
    50% {
      width:17px;
      height:17px;
    }
    100% {
      width:14px;
      height:14px;
    }
  }

  @-webkit-keyframes addCart /* Safari 和 Chrome */
  {
    0% {
      width:14px;
      height:14px;
    }
    50% {
      width:17px;
      height:17px;
    }
    100% {
      width:14px;
      height:14px;
    }
  }

  @-o-keyframes addCart /* Opera */
  {
    0% {
      width:14px;
      height:14px;
    }
    50% {
      width:17px;
      height:17px;
    }
    100% {
      width:14px;
      height:14px;
    }
  }
</style>


