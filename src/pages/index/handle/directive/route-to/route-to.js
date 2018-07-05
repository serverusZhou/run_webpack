import Vue from 'vue'
export default function(){
    // 注册一个全局自定义指令 `route-to`
    Vue.directive('routeTo', {
        // 当被绑定的元素插入到 DOM 中时……
        inserted: function (el,binding) {
        // 聚焦元素
        el.onclick = function(){
            location.href="#/"+binding.value;
        }
        }
    })
} 