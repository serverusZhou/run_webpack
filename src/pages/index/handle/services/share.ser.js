import {$conf} from '../../../../config'
import { MessageBox } from 'mint-ui';
export default {
    //向购物车中添加商品
    addCart:function(restId,menuId,menuImg,menuName,menuPrice){
        let cart = $conf.cart;
        let addSuc = false;
        if(cart[restId] || (Object.keys(cart).length == 0)){
            cart[restId] =  cart[restId] || {};
            if(cart[restId][menuId]){
                cart[restId][menuId].quantity ++;
            }else{
                cart[restId][menuId]={
                    quantity: 1,
                    menuImg: menuImg,
                    menuName:menuName,
                    menuPrice: menuPrice
                };
            }
            addSuc = true;
        }else{
            MessageBox.alert('你的购物车中已经存在其它餐厅的菜品，请先清空！', '添加失败提示');
        }
        let quantity = 0;
        for(let key in cart){
            for(let key1 in cart[key]){
              quantity += cart[key][key1].quantity;
            }
        }
        localStorage.setItem('cart',JSON.stringify(cart))
        return [quantity,addSuc]
    },
    //向购物车中减少商品
    removeCart:function(restId,menuId){
        let cart = $conf.cart;
        if(cart[restId]&&cart[restId][menuId]){
            if(cart[restId][menuId].quantity>1){
                cart[restId][menuId].quantity -- ;
            }else{
                if(cart[restId][menuId].quantity == 1){
                    delete  cart[restId][menuId];
                    if(Object.keys(cart[restId]).length == 0)
                        delete  cart[restId]
                }
            }
        }
        let quantity = 0;
        for(let key in cart){
            for(let key1 in cart[key]){
              quantity += cart[key][key1].quantity;
            }
        }
        localStorage.setItem('cart',JSON.stringify(cart))
        return quantity
    },
    //清空购物车
    clearCart:function(){
        $conf.cart = {}
        localStorage.setItem('cart',JSON.stringify($conf.cart))
        return 0
    },
    //直接获取购物车的菜品的数量
    getQuantity:function(){
        let quantity = 0;
        let cart = $conf.cart;
        for(let key in cart){
            for(let key1 in cart[key]){
              quantity += cart[key][key1].quantity;
            }
        }
        return quantity
    },
    //根据购物车生成生成订单的参数
    generateOrderReqParas:function(){
        let orderItems =[];
        let cart = $conf.cart;
        for(let key in cart){
            for(let key1 in cart[key]){
                let item = {
                    item_id: key1,
                    quantity: cart[key][key1].quantity
                }
                orderItems.push(item);
            }
        }
        return orderItems
    },
    //计算总金额
    calculationTotalMoney:function(){

    }
}