import cartFunc from './share.ser'
import Vue from 'vue'
export default function(){
    Vue.prototype.$cart = cartFunc
}