<template>
    <div>
        <XfHeader :isHasLogo="true" :isHasSearch="true" :isHasCart="true"></XfHeader>
        <div class="content has-f-h-content" style="background-color:'#f3f3f3';" ref="sc">
            <div class="head-tip">—— 饭蛋为您精挑细选 ——</div>
            <mt-loadmore :top-method="reflesh" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :bottomDistance="30" :distanceIndex="1" :autoFill="false">
                <ul class="rl-items">
                    <li v-for="item in lists" v-bind:key="item._id" @click="goToRestInfoPage(item)" class="rl-item" style="position:relative;">
                        <p class="rl-rat" v-if="item.rating && (parseInt(item.rating) > 1)">{{parseInt(item.rating).toFixed(1)}}</p>
                        <div class="rl-item-top">
                            <img v-if="item.photos && item.photos[0]" v-lazy="item.photos[0].path" src="../../assets/images/fill.png" class="rl-item-img"/>
                            <img v-else src="../../assets/images/fill.png" class="rl-item-img"/>
                        </div>
                        <div class="rl-item-bottom">
                            <p class="rl-item-bottom-name">{{(item.longNames && item.longNames[0])?item.longNames[0].name:'未设置名称'}}</p>
                            <div style="display:flex;">
                                <p class="rl-item-bottom-distance">{{(item.distance / 1000).toFixed(1) + 'km'}}</p>
                                <p class="rl-item-bottom-perconsume" v-if="item.average_price">{{(item.average_price).toFixed(2)}}</p>
                                <p class="rl-item-bottom-cuisine" v-if="item.cuisinesStr">
                                    {{item.cuisinesStr}}
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </mt-loadmore>
        </div>
        <XfFooter :tab="'rest'"></XfFooter>
    </div>
</template>
<script>
import { domains, wxConfigs, $conf } from "../../../../../config";
import restaurantMixin from "../../mixins/restaurant.mixin";
import Util from "../../../../../utils/util/Util";
import RestaurantService from "../../services/restaurant.ser";
import authSer from "../../services/auth.ser";
import { Toast } from "mint-ui";
const util = new Util();
export default {
  name: "Restaurant_List",
  mixins: [restaurantMixin],
  data() {
    return {
      requestParas: {
        //请求餐厅列表的参数
        lat: 31.25,
        lon: 121.45,
        distance: 400000,
        from: 1,
        page_size: 10,
        order_type: "TAKEOUT",
        restaurant_type: "all"
      },
      lists: [], //餐厅列表
      allLoaded: false,
      loadLock: true //阻止现在是否可以加载
    };
  },
  created() {
    let self = this;
    $conf.location.lat = 31.25;
    $conf.location.lon = 121.45;
    /*
    * 微信
    * */
    authSer
      .getWxTicket()
      .then(response => {
        $conf.WX.wxSetConfig({
          jsapi_ticket: response.data.ticket,
          href: location.href.split("#")[0],
          suc: function() {
            $conf.WX.wxShare({
              title: "小饭",
              describe: "小饭自取!",
              imgUrl:
                "http://ownerweb.qa.services.fandanfanli.com/assets/img/icon_logo.png",
              link: location.protocol + `//` + location.host + location.pathname
            });
            $conf.WX.getLocation(
              function(res) {
                self.requestParas.lat = res.latitude;
                self.requestParas.lon = res.longitude;
                $conf.location.lat = res.latitude;
                $conf.location.lon = res.longitude;
                localStorage.setItem("lat", res.latitude);
                localStorage.setItem("lon", res.longitude);
                self.reflesh();
              },
              function() {
                localStorage.setItem("lat", 31.25);
                localStorage.setItem("lon", 121.45);
                let instance = Toast("获取地理位置失败，将启用默认地址");
                setTimeout(() => {
                  instance.close();
                }, 2000);
                self.reflesh();
              }
            );
          },
          fail: function() {
            localStorage.setItem("lat", 31.25);
            localStorage.setItem("lon", 121.45);
            self.reflesh();
          }
        });
      })
      .catch(e => {
        console.error("获取jsapi_ticket失败", e);
      });
  },
  methods: {
    reflesh() {
      let self = this;
      if(self.loadLock){
        self.loadLock = false;
        self.requestParas.from = 1;
        RestaurantService.getRestaurantList(this.requestParas).then(function(
          response
        ) {
          self.lists = self.formatAllRestsData(response.data);
          self.$refs.loadmore.onTopLoaded();
          self.requestParas.from++;
          self.allLoaded = false;
          self.loadLock = true;
        },function(){
          self.loadLock = true;
        });
      }
    },
    loadBottom() {
      console.log('loadBottom');
      let self = this;
      if(self.loadLock){
        self.loadLock=false;
        RestaurantService.getRestaurantList(this.requestParas).then(function(
          response
        ) {
          if (response.data.length > 0) {
            self.lists = self.lists.concat(
              self.formatAllRestsData(response.data)
            );
            self.$refs.loadmore.onBottomLoaded();
            // 下面判断是迫不得已，mnit插件会自动向上滚动一个header的距离，这边是强制将其设为0
            if (self.requestParas.from == 1) {
              setTimeout(() => {
                self.$refs.sc.scrollTop = "0px";
              }, 100);
            }
            self.requestParas.from++;
            self.loadLock = true;
          } else {
            self.allLoaded = true;
            self.$refs.loadmore.onBottomLoaded();
            self.loadLock = true;
          }
        });
      }
    }
  }
};
</script>
<style>
.content {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.content.has-f-h-content {
  height: calc(100vh - 4.9rem - 4.8rem);
}
.head-tip {
  height: 4.5rem;
  text-align: center;
  line-height: 4.5rem;
  color: #999;
}
.rl-items {
  margin: 0 auto;
  width: 34.4rem;
}
.rl-item {
  border-radius: 0.6rem;
  overflow: hidden;
  margin: 0 0 1.5rem;
  width: 34.4rem;
  background-color: #fff;
  list-style: none;
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
}
.rl-item-img {
  height: 21rem;
  width: 35rem;
  display: block;
}
.rl-item-top {
  width: 34.4rem;
  margin: 0 auto;
  overflow: hidden;
}
.rl-rat {
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 0.3rem;
  line-height: 2.5rem;
  text-align: center;
  background-color: #cb202d;
  color: #fff;
  font-size: 1.2rem;
  position:absolute;
  right:1rem;
  top:1rem;
}
.rl-item-bottom {
  width: 34.4rem;
  margin: 0 auto;
  padding: 1.3rem 0 1.3rem;
}
.rl-item-bottom-name {
  font-size: 1.8rem;
  font-weight: 600;
  height: 2.5rem;
  line-height: 2.5rem;
  padding-left: 1.8rem;
  padding-bottom: 1rem;
}
.rl-item-bottom-distance {
  height: 2rem;
  color: #999;
  padding-left: 4.1rem;
  background: url(../../assets/images/icon_distance.svg) no-repeat;
  background-size: 1.52rem 1.52rem;
  background-position: 2rem 0.2rem;
  font-size: 1.4rem;
  display: flex;
  line-height: 2.3rem;
}
.rl-item-bottom-perconsume {
  height: 2rem;
  color: #999;
  padding-left: 4.1rem;
  background: url(../../assets/images/icon_perperson.svg) no-repeat;
  background-size: 1.52rem 1.52rem;
  background-position: 2rem 0.2rem;
  font-size: 1.4rem;
  display: flex;
  line-height: 2.3rem;
}
.rl-item-bottom-cuisine {
  height: 2rem;
  color: #999;
  padding-left: 4.1rem;
  background: url(../../assets/images/icon_cuisine.svg) no-repeat;
  background-size: 1.52rem 1.52rem;
  background-position: 2rem 0.2rem;
  font-size: 1.4rem;
  display: flex;
  line-height: 2.3rem;
}
</style>

