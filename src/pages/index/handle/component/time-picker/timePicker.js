import TimePickerComponent from './time_picker.vue'
const TimePicker = {
    install: function (Vue) {
        Vue.component('TimePicker', TimePickerComponent);
    }
};
export default TimePicker;