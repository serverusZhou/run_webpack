import Vue from 'vue'
import Header from './xf-header/headerComponent'
import Footer from './xf-footer/footerComponent'
import Anchor from './anchor/anchorComponent'
import TimePicker from './time-picker/timePicker'
export default function(){
    Vue.use(Header);
    Vue.use(Footer);
    Vue.use(Anchor);
    Vue.use(TimePicker);
}
