import echarts from 'echarts/lib/echarts';
import Sockjs from 'sockjs-client'
import socketIo from 'socket.io-client'
import CnCheers from './games/chinese_cheers/index'

import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();

require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
// 引入柱状图
require('echarts/lib/chart/pie');
let self = this;
// let websocket = new WebSocket('ws://localhost/HorseRunJava/webSocketServer/info');
// websocket.onopen = function(evt) { 
//   console.info('Info: connection opened.');
// }; 
// websocket.onclose = function(evt) { 
//   console.info('Info: connection closed.');
// }; 
// websocket.onmessage = function(evt) { 
//   console.log('evt.data',evt.data);
//   self.setState({
//       num:evt.data
//   })
// }; 
// let socket = socketIo('http://localhost:9092');
// socket.on('connect', function(){});
// socket.on('event', function(data){});
// socket.on('disconnect', function(){});
// websocket.onerror = function(evt) { 
//   console.error(evt);
// };

// let myChart = echarts.init(document.getElementById('main'));
// // 绘制图表
// myChart.setOption({
//   title: {
//     text:'饭蛋国际全球分布图'
//   },
//   series: [{
//     name: '饭蛋国际全球人数',
//     type: 'pie',
//     roseType: 'angle',
//     itemStyle: {
//       normal: {
//       },
//       emphasis: {
//           shadowBlur: 200,
//           shadowColor: 'rgba(0, 0, 0, 0.5)'
//       }
//   },
//     data: [
//       { value: 3, name: '美国' },
//       { value: 10, name: '加拿大' },
//       { value: 15, name: '中国' },
//       { value: 6, name: '新加波' },
//     ]
//   }]

// if (navigator.serviceWorker != null) {
//   console.warn('there is something good!!');
//   navigator.serviceWorker.register('/servicework.js')
//       .then(function (registration) {
//           console.log('Registered events at scope: ', registration.scope);
//       });
// }else{
//   console.warn('there is some thing bad!!');
// }


new CnCheers({
  'canvasId': 'main',
  'canvas': {
    w: document.body.clientWidth, // 初始将canvas的宽度设为屏宽
    h: 1000 // 初始将canvas的高度设为屏高
  }
});
// });