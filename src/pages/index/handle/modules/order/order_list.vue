<template>
    <div>
        <XfHeader :isHasCart="true" :title="'订单列表'"></XfHeader>
        <div class="content has-f-h-content">
            <div class="orders-content">
                <div class="order-item" v-for="item in orderList" :key="item.order_id" v-if="orderList.length > 0">
                    <div class="menu-pic-content">
                        <img :src="item.restaurant_logo" style="width:100%;height:100%;"/>
                    </div>
                    <div style="display:flex;align-items:left;flex-direction: column;height:9rem;width:17.5rem;"  @click="checkOrderDetail(item.order_id)">
                        <p style="font-size:1.6rem;font-weight:600;padding:0;line-height:1.8rem;">{{item.restaurant_name}}</p>
                        <p style="font-size:1.6rem;font-size:1.6rem;color:#888;margin-top:.7rem;">{{item.submitTime}}</p>
                        <p style="font-size:1.6rem;font-size:1.6rem;color:#888;margin-top:.3rem;">{{item.cuisinesStr}}</p>
                    </div>
                </div>
                <div v-if="noOrder" style="text-align:center;font-size:1.4rem;padding:3rem;">
                    你还未下过订单哦！
                </div>
            </div>
        </div>
        <XfFooter :tab="'order'"></XfFooter>
    </div>
</template>
<script>
    import authSer from '../../services/auth.ser'
    import OrderSer from '../../services/order.ser'
    import Util from "../../../../../utils/util/Util";
    let util = new Util();
    export default {
        name: 'OrderList',
        data() {
            return {
                'userId':'',
                'orderList':[],
                'noOrder':false,
            }
        },
        created() {
            let self = this;
            authSer.getUserInfo(localStorage.getItem('Authorization')).then(function(response){
                self.userId = response.data.id;
                OrderSer.getPaidOrders(self.userId).then(function(response){
                    self.orderList = response.data;
                    if(self.orderList.length < 1)
                        self.noOrder = true
                    for(let index in self.orderList){
                        let singleOrder = self.orderList[index];
                        let sbTime = new Date(singleOrder.submit_time);
                        singleOrder.submitTime = util.checkTimeIfToday(sbTime);
                        let cuisinesStr="";
                        for(let i in singleOrder.order_items){
                            let item = singleOrder.order_items[i];
                            if(i > 1){
                                break
                            }
                            if(item.menu_item_name){
                                cuisinesStr += item.menu_item_name+" ";
                            }
                        }
                        singleOrder.cuisinesStr = cuisinesStr;
                    }
                },function(){

                })
            },function(){
                MessageBox.alert('获取用户信息失败','警告')
            })
        },
        methods: {
            checkOrderDetail(orderId){
                let self = this;
                self.$router.push({
                    path:'receipt',
                    query: {
                        'orderId':orderId,
                    }
                })
            }
        }
    }
</script>
<style>
 .content{overflow: scroll;}
 .content.has-f-h-content{height:calc(100vh - 4.9rem - 4.8rem)}
 .order-item{display: flex;justify-content:space-between;align-items: center;width:34.5rem;margin:0 auto;padding:1.7rem 0;border-bottom:1px #efefef solid;}
 .menu-pic-content{width:16rem;height:9rem;border-radius:.3rem;overflow: hidden;}
 .search-btn{width:10rem;height:3rem;display: flex;align-items: center;justify-content: center;box-shadow: 0 0 .5rem #ccc;}
 .search-btn:active{background-color: #efefef;}
</style>