<template>
<div class="anchor">
    <div class="anchol-bar">
      <ul>
        <li v-for="(anchor,index) in anchors" :key="anchor" @click="jumpAnchor($event,anchor)" :ref="'key'+anchor" :class="index==0 ? 'anchol-item active': 'anchol-item'">
            <slot :name="anchor"></slot>
        </li>
      </ul>
    </div>
    <div class="anchol-field" @scroll="fieldScroll($event)">
        <div v-for="anchor in anchors" :key="anchor" :ref="'field'+anchor">
          <slot :name="anchor+'field'"></slot>
        </div>
    </div>
</div>
</template>
<script>
export default {
  name: "anchor",
  data() {
    return {
      'anchorPosition':{}
    };
  },
  props:{
    'anchors': Array
  },
  watch:{
    'anchors':function(value){
      let self =this;
      if(value){
        setTimeout(function(){
          for(let anchor of value){
           self.anchorPosition[anchor] = self.$refs['field'+anchor][0].offsetTop;
          }
        },300)
      }
    }
  },
  methods:{
    'jumpAnchor':function(event,anchor){
      let self =this;
      let $ele = (this.$refs['field'+anchor] && this.$refs['field'+anchor][0])?this.$refs['field'+anchor][0]:undefined;
      if($ele){
        for(let anchor of self.anchors){
            self.$refs['key'+anchor][0].setAttribute("class","anchol-item");
        }
        self.$refs['key'+anchor][0].setAttribute("class","anchol-item active");
        let scrollTop = self.$refs['field'+anchor][0].offsetTop;
        $ele.parentNode.scrollTop = scrollTop;
      }else{
        console.error("锚点节点有误！！！");
      }
    },
    'fieldScroll':function(event){
      let self =this;
      let scrollTop = event.target.scrollTop;
      let height = event.target.clientHeight;
      let scrollHeight = event.target.scrollHeight;
      let rightAtPoint = 0;
      for(let item in self.anchorPosition){
        if(scrollTop>=parseInt(self.anchorPosition[item])){
          rightAtPoint = item;
        }else{
          break
        }
      }
      if(rightAtPoint && (height+scrollTop+10) < scrollHeight){
        for(let anchor of self.anchors){
            self.$refs['key'+anchor][0].setAttribute("class","anchol-item");
        }
        let rightRef=this.$refs['key'+rightAtPoint][0];
        rightRef.setAttribute("class","anchol-item active");
      }
    }
  }
};
</script>
<style scoped>
  .anchor{display: flex;}
  .anchol-bar{width:10.5rem;height:100%;background-color:#f6f6f6;overflow-y: scroll;}
  .anchol-field{width:26.5rem;height:100%;overflow-y: scroll;background-color: #fff;}
  .anchol-item{display: flex;height:6rem;align-items: center;justify-content: center;overflow: hidden;text-overflow: ellipsis;}
  .anchol-item.active{border-left:.5rem red solid;background-color: #fff;}
</style>


