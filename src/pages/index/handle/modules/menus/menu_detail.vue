<template>
  <div>
       <XfHeader :isHasReturn="true" :isAbs="true" :isHasCart="true" :isWhite="true"></XfHeader>
       <div class="content" v-bind:style="{height:style.contentHeight+'px'}">
          <div style="width:100%;height:21rem;border-bottom:1px #f1f1f1 solid;box-shadow:0 0 .5rem #f1f1f1;">
              <img :src="menuImg" v-if="menuImg" style="width:100%;height:100%;"/>
              <img src="../../assets/images/fill.png" v-else style="width:100%;height:100%;" />
          </div>
          <div style="border-bottom:1px #f1f1f1 solid;padding-bottom:1rem;width:34rem;margin:0 auto;">
              <p style="height:5rem;line-height:6.5rem;font-size:1.8rem;">{{menuName}}</p>
              <p style="color:#cb202d;font-size:1.6rem;">￥{{menuPrice}}</p>
          </div>
          <div style="padding-bottom:1.2rem;width:34rem;margin:0 auto;">
              <p style="height:5.3rem;line-height:6.5rem;font-size:1.6rem;">菜品简介</p>
              <p style="">{{menuDesc || "抱歉，暂无此菜品的介绍！"}}</p>
          </div>
       </div>
       <div class="btn add-to-cart" @click="addToCart($event)">添加到购物车</div>
    </div>
</template>
<script>
import {$conf} from '../../../../../config'
import { MessageBox } from 'mint-ui';
export default {
    name: 'Menu_detail',
    data() {
        return {
            'menuId':this.$route.query.menuId,
            'restId':this.$route.query.restId,
            'menuImg':this.$route.query.menuImg,
            'menuName':this.$route.query.menuName,
            'menuPrice':this.$route.query.menuPrice,
            'menuDesc':this.$route.query.menuDesc,
            'style':{
                contentHeight: window.innerHeight - window.innerWidth/37.5*5,
            },
        }
    },
    created(){
        
    },
    methods:{
        'addToCart':function(event){
            console.log('eventeventeventevent',event);
            let self =this;
            let [quantity,addSuc] = self.$cart.addCart(self.restId,self.menuId,self.menuImg,self.menuName,self.menuPrice);
            if(addSuc){
                self.$root.$data.cartQuantity = quantity;
            }
        }
    }
}
</script>
<style>
    .add-to-cart{height:5rem;background-color:#cb202d;display:flex;justify-content: center;align-items: center;color:#fff;font-size:16px;}
</style>


