<template>
    <div class="wrapper">
        <router-view class="template"></router-view>
    </div>
</template>
<script>
    import { wxConfigs,$conf } from "../../../config";
    import authSer from "./services/auth.ser";
    export default {
        name: 'app',
        created() {
            if(localStorage.getItem('cart')){
                $conf.cart = JSON.parse(localStorage.getItem('cart'));
                this.$root.$data.cartQuantity = this.$cart.getQuantity();
            }
          
        },
    }
</script>