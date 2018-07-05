import RestaurantService from "../services/restaurant.ser";
export default {
    methods: {
        //获取餐厅信息
        getRestaurantInfo: function () {
            let self = this;
            let promise = new Promise((resolve, reject) => {
                    RestaurantService.getRestaurantInfo(self.restId).then(function (response) {
                        let restInfo = {};
                        // 处理图片列表
                        let photos = [];
                        if (response.data.photos && response.data.photos.length > 0) {
                            for (let item of response.data.photos) {
                                if (item.size == 'large') {
                                    self.restInfo.photos.push(item);
                                }
                            }
                        }
                        restInfo.addresses = {
                            location: {
                                lat: (response.data.location && response.data.location.lat) ? response.data.location.lat : 31.228833,
                                lon: (response.data.location && response.data.location.lon) ? response.data.location.lon : 121.47519,
                            }
                        }
                        restInfo.name = (response.data.longNames && response.data.longNames[0]) ? response.data.longNames[0].name : '未命名餐厅';
                        restInfo.openHours = (response.data.regular_hours && response.data.regular_hours[0]) ? response.data.regular_hours[0] : null;
                        restInfo.address = response.data.addresses ? response.data.addresses.address1 : null;
                        restInfo.phone = response.data.officialPhone;
                        restInfo.description = (response.data.description && response.data.description[0]) ? response.data.description[0].name : '未设置餐厅简介';
                        restInfo.rat = response.data.rating || '0';
                        restInfo.per = response.data.average_price || '0.00';
                        restInfo.cuisines = self.formatCuisines(response.data.cuisines);
                        resolve(restInfo);
                    },function(err){
                        reject(err);
                    })
                }
            );
            return promise
        },
        //处理返回的餐厅列表信息
        formatAllRestsData: function (restsData) {
            for (let num in restsData) {
                let rest = restsData[num];
                if (rest.cuisines && rest.cuisines.length > 0) {
                    let cuisinesStr = "";
                    for (let index in rest.cuisines) {
                        let item = rest.cuisines[index];
                        if (index > 1) {
                            break
                        }
                        if (item.names && item.names.length > 0) {
                            for (let i in item.names) {
                                cuisinesStr += item.names[i].name + " ";
                            }
                        }
                    }
                    rest.cuisinesStr = cuisinesStr;
                }
            }
            return restsData
        },
        //处理菜系信息，将菜系信息整合成一个字符串
        formatCuisines: function (cuisines) {
            if (cuisines && cuisines.length > 0) {
                let cuisinesStr = "";
                for (let index in cuisines) {
                    let item = cuisines[index];
                    if (index > 1) {
                        break
                    }
                    if (item.names && item.names.length > 0) {
                        for (let i in item.names) {
                            cuisinesStr += item.names[i].name + " ";
                        }
                    }
                }
                return cuisinesStr
            }
        },
        // 跳转到餐厅信息页面
        goToRestInfoPage: function (rest) {
            var self = this;
            this.$router.push({
                path: "/restInfo/" + rest._id,
                query: {
                    distance: rest.distance
                }
            });
        },
        // 进入菜单页面
        goToMenusPage: function(runningHour){
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
            if(runningHour && runningHour.split('-') && runningHour.split('-').length > 0){
                endHour = runningHour.split('-')[1].split(':')[0];
                endMinute = runningHour.split('-')[1].split(':')[1];
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
        }
    }
}