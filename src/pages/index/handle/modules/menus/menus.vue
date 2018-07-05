<template>
    <div>
       <XfHeader :isHasReturn="true" :title="'菜单'" :isHasCart="true"></XfHeader>
       <div class="content has-h-content">
           <anchor :anchors="anchors">
                <li class="catalogue-item" v-for="(catalogue,catalogueName) in menus" v-bind:key="catalogue._id" :slot="catalogue._id">
                    <div class="catalogue-item-name">{{catalogueName.substring(0,10)}}</div>
                </li>
                <div v-for="(catalogue,catalogueName) in menus" v-bind:key="catalogue._id" :slot="catalogue._id+'field'" class="field-item">
                    <p class="catalogue-name">{{catalogueName}}</p>
                    <div class="menus-content">
                        <ul>
                            <li v-for="(menu,menuName) in catalogue" v-bind:key="menu._id" v-if="menuName !== '_id'">
                                <img v-if="menu.photos && menu.photos[0]" :src="menu.photos[0].path"  @click="goMenuDetail(menu)"/>
                                <img v-else src="../../assets/images/fill.png" @click="goMenuDetail(menu)"/>
                                <p style="font-size:1.4rem;height:3.5rem;line-height:4.5rem;">{{menu.longNames[0].name}}</p>
                                <div style="height:3rem;justify-content:space-between;display:flex;">
                                    <p class="menu-price">￥{{menu.BasePrice.toFixed(2)}}</p>
                                    <p class="order-to-cart" @click="addIntoCart(menu)"></p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
           </anchor>
       </div>
    </div>
</template>
<script>
    import {domains,wxConfigs,$conf} from '../../../../../config'
    import RestaurantService from "../../services/restaurant.ser";
    export default {
        name: 'Restaurant_menu',
        data() {
            return {
                'restId': this.$route.params.restId,
                'menus': [],
                'style':{
                    contentHeight: window.innerHeight - window.innerWidth/37.5*4.5,
                },
                'nowAnchor': '123456',
                'anchors':[],
            }
        },
        created() {
         let self = this;
            RestaurantService.getRestaurantMenus(this.restId).then(function(response){
                let anchors = [];
                //生成唯一key
                for(let key in response.data){
                    response.data[key]['_id'] = (new Date()).getTime()+Math.floor(Math.random()*1000);
                    anchors.push(response.data[key]['_id']);
                }
                self.anchors = anchors
                self.menus = response.data;
            })
        },
        methods:{
            'goMenuDetail':function(menu){
                let self = this;
                self.$router.push({
                    path: `/menuDetail`,
                    query: {
                            'restId':self.restId,
                            'menuId':menu._id,
                            'menuImg':(menu.photos && menu.photos[0])?menu.photos[0].path : undefined,
                            'menuName':menu.longNames[0].name,
                            'menuPrice':menu.BasePrice.toFixed(2),
                            'menuDesc':(menu.description && menu.description[0])?menu.description[0].name : undefined,
                        }
                    })
            },
            'addIntoCart':function(menu){
                let self =this;
                let [quantity,addSuc] = self.$cart.addCart(self.restId,menu._id,(menu.photos && menu.photos[0])?menu.photos[0].path : undefined,menu.longNames[0].name,menu.BasePrice.toFixed(2));
                addSuc && (function(){self.$root.$data.cartQuantity = quantity})();
            }
        }
    }
</script>
<style scoped>
    .content{display: flex;}
    .content.has-h-content{
        height:calc(100vh - 5rem);
        overflow: scroll;
    }
    .catalogues{width:10.5rem;height:100%;background-color:#f6f6f6;overflow-y: scroll;}
    .catalogue-item-name{width: 8rem;text-align: center;}
    .menus-content{width:27rem;height:100%;overflow-y: scroll;}
    .catalogue-item{display: flex;height:4rem;align-items: center;justify-content: center;overflow: hidden;text-overflow: ellipsis;}
    .catalogue-item.active{border-left:2px red solid;}
    .catalogue-name{display: flex;justify-content: flex-start;height: 6rem;font-size: 1.6rem;width:23.3rem;line-height: 8rem;}
    .field-item{width:23.3rem;margin:0 auto;}
    .menus-content{width:100%;overflow: hidden;}
    .menus-content>ul{width:100%;}
    .menus-content>ul>li{width:100%;}
    .menus-content>ul>li>img{width:100%;height:13rem;}
    .menu-price{display: flex;align-items: center;justify-content: center;font-size:1.4rem;display: flex;justify-content: center;color:#d96c72;}
    .order-to-cart{width:2.5rem;height:2.5rem;border-radius:50%;background: url(../../assets/images/icon_plus.png) no-repeat;background-size: contain;background-position: center center;}
    .order-to-cart:active{background-color:#ccc;}
</style>
