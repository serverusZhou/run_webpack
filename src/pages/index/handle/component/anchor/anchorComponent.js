import AnchorComponent from './Anchor.vue'
const Anchor = {
    install: function (Vue) {
        Vue.component('anchor', AnchorComponent);
        // Vue.component('anchor-bar', {
        //     template: '<div>A custom component!</div>'
        //   });
        // Vue.component('anchor-field', {
        //     template: '<div>A custom component!</div>'
        //   });
    }
};
export default Anchor;