<template>
    <div class="restaurant-earch">
        <div class="back" @click="$router.go(-1)">
            <button class="mint-button" 
                    style="width:3rem;border-radius:0;background-color:#fff;height:3rem;">
                <span class="mint-button-icon">
                <i class="mintui mintui-back" style="font-size:18px;"></i>
                </span>
                <label class="mint-button-text"></label>
            </button>
        </div>
        <div class="search-content">
            <mt-search v-model="searchKey" cancel-text="取消" placeholder="搜索餐厅">
              <div style="padding-top:1.3rem;width:28.4rem;margin:0 auto;">
                <div v-for="item in result" v-bind:key="item._id" @click="intoRestInfo(item)" style="width:28.4rem;padding:1.7rem 0;display:flex;justify-content:space-between;border-bottom:1px solid #ececec;">
                  <!-- <p style="height:3.5rem;line-height:3.5rem;font-size:1.6rem;">{{(item.longNames && item.longNames[0])?item.longNames[0].name : '未设置名称'}}</p> -->
                  <div class="menu-img" style="width:16rem;height:9rem;overflow:hidden;border-radius:.3rem;">
                    <img v-if="item.photos && item.photos[0]" :src="item.photos[0].path" style="width:100%;height:100%;"/>
                    <img v-else src='../../assets/images/fill.png' style="width:100%;height:100%;"/>
                  </div>
                  <div class="menu-detail-content"
                        style="width:12.4rem;height:9rem;display:flex;justify-content:space-between;flex-direction:column;">
                    <p style="padding-left:1.7rem;font-size:1.6rem;font-weight:700;height:2.5rem;line-height:1.8rem;">{{(item.longNames && item.longNames[0])?item.longNames[0].name:'未设置名称'}}</p>
                    <p class="rl-item-bottom-distance">{{(item.distance / 1000).toFixed(1) + 'km'}}</p>
                    <p class="rl-item-bottom-perconsume" v-if="item.average_price">{{(item.average_price).toFixed(2)}}</p>
                    <p class="rl-item-bottom-perconsume" v-else>--</p>
                    <p class="rl-item-bottom-cuisine" v-if="item.cuisinesStr">
                        {{item.cuisinesStr}}
                    </p>
                    <p class="rl-item-bottom-cuisine" v-else>--</p>
                  </div>
                </div>
                <div v-if="!result || result.length == 0" style="text-align:center;padding:1.2rem;">未搜索到餐厅</div>
              </div>
            </mt-search>
        </div>
    </div>
</template>
<script>
import RestaurantService from "../../services/restaurant.ser";
import restaurantMixin from "../../mixins/restaurant.mixin";
import {$conf} from '../../../../../config'
import { Toast } from 'mint-ui';
export default {
  name: 'Restaurant_Search',
  mixins:[restaurantMixin],
  data() {
    return {
      result: [],
      searchKey: localStorage.getItem('searchKey') ? localStorage.getItem('searchKey') : ''
    };
  },
  asyncComputed: {
    async result() {
      let self = this;
      let requestParas = {
        lat: localStorage.getItem('lat') || 31.26,
        lon: localStorage.getItem('lon') || 121.45,
        distance: 400000,
        from: 1,
        page_size: 50,
        order_type: "TAKEOUT",
        restaurant_type: "all",
        keyword: self.searchKey
      };
      let response = await RestaurantService.getRestaurantList(requestParas);
      return self.formatAllRestsData(response.data);
    }
  },
  methods: {
    intoRestInfo: function(rest) {
      let self = this;
      // 将searchKey存放到localStorage中，以便返回时需要
      localStorage.setItem('searchKey', self.searchKey);
      // 跳转餐厅详情页面（方法在restaurantMixin中）
      self.goToRestInfoPage(rest);
    },
  }
};
</script>
<style>
.restaurant-earch {
  display: flex;
}
.back {
  width: 2rem;
  height: 52px;
  position: relative;
  z-index: 111111;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1.55rem;
  background-color: #fff;
}
.search-content {
  width: 34rem;
}
.mint-searchbar {
  background-color: #fff;
}
.mint-searchbar-inner .mintui-search {
  font-size: 2.2rem;
  padding-right: 0.5rem;
}
.mint-searchbar-cancel {
  color: #333;
  font-size: 1.6rem;
}

.rl-item-bottom-distance {
  height: 2rem;
  color: #999;
  padding-left: 4.1rem;
  background: url(../../assets/images/icon_distance.svg) no-repeat;
  background-size: 1.52rem 1.52rem;
  background-position: 2rem center;
  font-size: 1.4rem;
  display: flex;
  line-height:2.5rem;
}
.rl-item-bottom-perconsume {
  height: 2rem;
  color: #999;
  padding-left: 4.1rem;
  background: url(../../assets/images/icon_perperson.svg) no-repeat;
  background-size: 1.52rem 1.52rem;
  background-position: 2rem center;
  font-size: 1.4rem;
  display: flex;
  line-height:2.5rem;
}
.rl-item-bottom-cuisine {
  height: 2rem;
  color: #999;
  padding-left: 4.1rem;
  background: url(../../assets/images/icon_cuisine.svg) no-repeat;
  background-size: 1.52rem 1.52rem;
  background-position: 2rem center;
  font-size: 1.4rem;
  display: flex;
  line-height:2.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.search-content .mint-searchbar-inner{border:1px #efefef solid;}
.back .mint-button-icon{padding-left:.3rem;}
</style>


