<template>
    <div>
       <XfHeader :isAbs="true" :isHasReturn="true" :isHasCart="true" :isWhite="true"></XfHeader>
       <div class="content has-h-content" style="background-color:#FAFAFA;">
           <div style="height:21.96rem;">
               <mt-swipe>
                    <mt-swipe-item v-for="(item,index) in restInfo.photos" :key="index" :prevent="true" :showIndicators="false">
                        <img v-if="item.path" :src="item.path" style="width:37.5rem;height:21.96rem;" />
                        <img v-else src="../../assets/images/fill.png" style="width:37.5rem;height:21.96rem;" />
                    </mt-swipe-item>
                </mt-swipe>
           </div>
           <div class="ri-rest-title">
               <div style="display:flex;align-items:center;justify-content: space-between;">
                   <p class="rest-name">{{restInfo.name}}</p>
                   <p style="height:2.5rem;width:2.5rem;border-radius:.3rem;line-height:2.5rem;text-align:center;background-color:#cb202d;color:#fff;font-size:1.2rem;">{{restInfo.rat}}</p>
               </div>
               <div style="display:flex;align-items:center;justify-content: flex-start;">
                   <p class="rest-distence">{{restInfo.distance  + 'km'}}</p>
                   <p class="rest-distence" v-if="restInfo.per" style="width:auto;padding-left:1rem;padding-right:1rem;margin-left:.3rem;margin-right:.3rem;">{{'￥'+(restInfo.per || '---')}}</p>
                   <p class="rest-distence" v-if="restInfo.cuisines" style="width:auto;padding-left:1rem;padding-right:1rem;margin-left:.3rem;margin-right:.3rem;">{{restInfo.cuisines || '---'}}</p>
               </div>
           </div>
           <div class="rest-info-content">
                <p class="rest-info-title" style="font-weight:700;">餐厅简介</p>
               <p style="padding: 0 0 1.5rem;font-size:1.4rem;color:#666;">
                   {{restInfo.description}}
               </p>
           </div>
           <div class="rest-info-content">
               <p class="rest-info-title" style="font-weight:700;">餐厅信息</p>
               <ul>
                   <li class="fi-list-item" v-if="restInfo.openHours">
                       <div>
                           <div slot="icon" class="fi-list-item-img icon-clock"></div>
                           <p>{{restInfo.openHours}}</p>
                        </div>
                   </li>
                   <li class="fi-list-item" @click="showPosition" v-if="restInfo.address">
                       <div>
                           <div slot="icon" class="fi-list-item-img icon-location"></div>
                           <p>{{restInfo.address}}</p>
                        </div>
                   </li>
                   <li class="fi-list-item" v-if="restInfo.phone">
                       <div>
                           <div slot="icon" class="fi-list-item-img icon-telephone"></div>
                           <a :href="'tel:'+restInfo.phone">{{restInfo.phone}}</a>
                        </div>
                   </li>
               </ul>
           </div>
       </div>
       <div class="order" @click="goToMenus">订餐</div>
    </div>
</template>
<script>
    import {domains,wxConfigs,$conf} from '../../../../../config'
    import restaurantMixin from "../../mixins/restaurant.mixin";
    import RestaurantService from "../../services/restaurant.ser";
    import { Toast } from 'mint-ui';
    export default {
        name: 'Restaurant_info',
        mixins:[restaurantMixin],
        data() {
            return {
                'restId': this.$route.params.restId,
                'restInfo':{
                    'photos': [],
                    'distance': (this.$route.query.distance/1000).toFixed(1)
                },
            }
        },
        created() {
            let self = this;
            self.getRestaurantInfo().then(function(restInfo){
                self.restInfo = Object.assign(restInfo,self.restInfo);
            });
        },
        methods:{
            goToMenus(){
                let self =this;
                let now = new Date();
                let nowHour = now.getHours();
                let nowMinute = now.getMinutes();
                let endHour;
                let endMinute;
                function showTip(){
                    let instance = Toast('餐厅已歇业，请去其它餐厅订餐！');
                    setTimeout(() => {
                        instance.close();
                    }, 3000);
                }
                if(self.restInfo.openHours && self.restInfo.openHours.split('-') && self.restInfo.openHours.split('-').length > 0){
                    endHour = self.restInfo.openHours.split('-')[1].split(':')[0];
                    endMinute = self.restInfo.openHours.split('-')[1].split(':')[1];
                    if(endHour){
                        if(nowHour > parseInt(endHour) || (parseInt(endHour) == nowHour && nowMinute > parseInt(endMinute))){
                            showTip();
                            return
                        }
                    }else{
                        showTip();
                        return
                    }
                }else{
                    showTip();
                    return
                }
                self.$router.push({
                    path: '/restMenu/'+this.restId,
                })
            },
            showPosition(){
                let self = this;
                $conf.WX.openLocation({
                    latitude: parseFloat(self.restInfo.addresses.location.lat),
                    longitude: parseFloat(self.restInfo.addresses.location.lon),
                    name: self.restInfo.name,
                })
            },
        }
    }
</script>
<style>
    .content{
        background-color: #f9f9f9;
    }
    .content.has-h-content{
        height:calc(100vh - 5rem);
        overflow: scroll;
    }
    .ri-rest-title{
        padding: 0 1.3rem;
        display:flex;
        justify-content: space-between;
        background-color:#fff;
        flex-direction: column;
    }
    .rest-name{
        padding: 1.2rem 0 .5rem;
        font-size: 1.8rem;
        line-height: 2.5rem;
        font-weight: 700;
    }
    .rest-distence{
        width:7rem;
        border-radius: 1.2rem;
        font-size: 1.2rem;
        height:2.5rem;
        color:#999;
        background-color:#f0f0f0;
        text-align: center;
        line-height: 2.5rem;
        margin-bottom:1.2rem;
    }
    .rest-info-content{
        margin-top: 1.5rem;
        background-color: #fff;
        padding: 1.5rem 1.3rem 0;
    }
    .fi-list-item{
        display:flex;
        justify-content: space-between;
        background-color:#fff;
        align-items:center;
        height:3.6rem;
    }
    .fi-list-item>div{
        display:flex;
        justify-content: space-between;
        align-items:center;
    }
    .fi-list-item>div>p,.fi-list-item>div>a{
        font-size:1.4rem;
        color:#666;
    }
    .fi-list-item-img{
        display: inline-block;
        margin-right:1rem;
        width:1.8rem;
        height:1.8rem;
    }
    .fi-list-item-img.icon-clock{
        background: url(../../assets/images/icon_clock.svg) no-repeat;
        background-position: center center;
    }
    .fi-list-item-img.icon-location{
        background: url(../../assets/images/icon_location.svg) no-repeat;
        background-position: center center;
    }
    .fi-list-item-img.icon-telephone{
        background: url(../../assets/images/icon_telephone.svg) no-repeat;
        background-position: center center;
    }
    .rest-info-title{
        height: 3rem;
        line-height: 3rem;
        font-size:1.6rem;
        color:#333;
    }
    .order{
        height:5rem;
        background-color:#cb202d;
        display:flex;
        justify-content: center;
        align-items: center;
        color:#fff;font-size:16px;
    }
    .order:active{
        color:#ccc;
    }
    .call{
        text-align: left;
        color:#000;
        text-decoration: underline ;
    }
    .mint-cell-wrapper{
        background-image:none;
        padding-left:0;
    }
</style>