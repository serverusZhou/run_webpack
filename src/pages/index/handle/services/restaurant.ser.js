/**
 * Created by DELL on 2017/11/6.
 */
import axios from '../interceptor/httpInterceptor';
import {domains} from '../../../../config.js';

class RestaurantService{

    //获取餐厅列表
    static getRestaurantList(params){
        return axios.get(domains.restauantDomain + "/v3/nearby_restaurants",{
            params: params
        })
    }
    //获取餐厅信息
    static getRestaurantInfo(restId){
        return axios.get(domains.restauantDomain  + `/v1/restaurants/${restId}/common_attributes`)
    }
    //获取餐厅的菜单信息
    static getRestaurantMenus(restId){
        return axios.get(domains.restauantDomain  + `/v1/restaurants/${restId}/catalogues_menus?is_takeout=true&menu_type=is_takeout&locale=zh_CN`)
    }
    static getScanCode(authorization,tableScanCode){
        let request = {
            dataType:"json",
            contentType:"application/x-www-form-urlencoded",
            headers: {
                'Authorization': authorization,
            },
        };
        return axios.get(config.restApi + "/v2/table_scan_codes/"+encodeURIComponent(tableScanCode),request)
    }
}

export default RestaurantService