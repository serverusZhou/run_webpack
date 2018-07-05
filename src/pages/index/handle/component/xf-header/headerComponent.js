import HeaderComponent from './Header.vue'
const Header = {
    install: function (Vue) {
        Vue.component('XfHeader', HeaderComponent);
    }
};
export default Header;