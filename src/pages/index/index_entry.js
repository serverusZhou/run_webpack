import '../../assets/style/h5-rem.css'
import { domains, wxConfigs, $conf } from '../../config'
import Vue from 'vue';
import app from './handle/App.vue';
import routerConfig from './handle/router_config';
import injectComponent from './handle/component/injectComponent'
import injectDirective from './handle/directive/injectDirective'
import injectSer from './handle/services/injectSer'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import AsyncComputed from 'vue-async-computed'
import Weixin from '../../utils/weixin/Weixin'
import './handle/assets/stylesheets/index.css'


import * as OfflinePluginRuntime from 'offline-plugin/runtime';
console.info(OfflinePluginRuntime);
OfflinePluginRuntime.install();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
        console.info('registrationregistrationregistrationregistration', registration);
        console.info('registration.addEventListenerregistration.addEventListener',typeof registration.addEventListener);
        registration.onfetch = (e) =>{
            console.info(1212121212121);
        }

        registration.addEventListener('fetch', function (evt) {
            console.info('evtevtevtevtevt', evt);
            evt.respondWith(
                caches.match(evt.request).then(function (response) {
                    console.info('have match');
                    if (response) {
                        return response;
                    }
                    var request = evt.request.clone();
                    return fetch(request).then(function (response) {
                        if (!response && response.status !== 200 && !response.headers.get('Content-type').match(/image/)) {
                            return response;
                        }
                        var responseClone = response.clone();
                        caches.open('my-test-cache-v1').then(function (cache) {
                            cache.put(evt.request, responseClone);
                        });
                        return response;
                    });
                })
            )
        })
    })
}

//注入组件
injectComponent();
//注入指令
injectDirective();
//注入方法
injectSer();
//使用mint-ui框架
Vue.use(Mint);
Vue.use(MuseUI)
//使用异步compute
Vue.use(AsyncComputed);
//实例化微信公众平台处理类
$conf.WX = new Weixin(wxConfigs);
$conf.cart = {};
let rootData = {
    'cartQuantity': 0
};

const vueInstance = new Vue({
    el: '#root',
    router: routerConfig,
    data: rootData,
    render: h => h(app)
});
console.log(vueInstance);
export default vueInstance