<template>
<div style="width:37.5rem;">
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom" :style="{width:'100%'}" :defaultIndex="defaultIndex">
      <div style="width:37.5rem;display:flex;">
        <div style="width:50%;display:flex;align-items:center;justify-content: center;height:3rem;" @click="close">取消</div>
        <div style="width:50%;display:flex;align-items:center;justify-content: center;height:3rem;" @click="popupVisible = false">确定</div>
      </div>
      <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    </mt-popup>
</div>
</template>
<script>
export default {
  name: "fd-time-picker",
  data() {
    return {
      popupVisible:true,
      model: {
        prop: 'time',
        event: 'change'
      },
      lastHour:'',
      lastMinute:'',
      slots: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: ':',
          className: 'slot2'
        }, {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        }
      ],
      defalutMinutes:['00','05','10','15','20','25','30','35','40','45','50','55'],
    };
  },
  created(){
      let self = this;
      self.slots[0].values = self.hours;
      self.slots[2].values = self.minutes;
  },
  props:{
    hours:Array,
    minutes:Array,
  },
  watch:{
    'time':function(val){
      console.log('time changed');
    },
    'isShow':function(val){
      console.log(val);
      self.popupVisible = val;
    }
  },
  methods:{
   onValuesChange:function(picker, values){
     let self = this;
     console.log(values);
     let tempHour = values[0];
     if(!(self.lastHour == values[0])){
        if(values[0] == this.hours[0]){
          self.slots[2].values = self.minutes;
        }else{
          self.slots[2].values = self.defalutMinutes;
        }
     }
   },
   close(){
     this.$emit('tellChange',false)
   }
  }
};
</script>
<style scoped>

</style>


