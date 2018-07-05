import React, { Component } from 'react';
import Util from '../../../../utils/util/Util'
let util = new Util();
class CountDown extends Component {
  constructor(props) {
    super(props);
    let { countSeconds=24*60*60  , interval = 1000 ,callback = function(){console.log('it is the end');}} = props;
    this.interval = interval;
    this.callback = callback;
    this.intervalFunc = null;
    this.state = {
        countSeconds: countSeconds,
    }
  }
  render() {
    let self = this;
    let leftDate =Math.floor(this.state.countSeconds / (60*60*24));
    let leftHour =Math.floor(this.state.countSeconds / 60 /60- leftDate * 24);
    let leftMinute =Math.floor(this.state.countSeconds / 60 - leftDate * 24 * 60 - leftHour*60);
    let leftSecond =Math.floor(this.state.countSeconds - leftDate*24*60*60 - leftHour*60*60 - leftMinute * 60);

    let prefixLeftDate = (leftDate < 1000) ? util.prefixInteger(leftDate,3) : '999';
    let prefixLeftHour = util.prefixInteger(leftHour,2);
    let prefixLeftMinute = util.prefixInteger(leftMinute,2);
    let prefixLeftSecond = util.prefixInteger(leftSecond,2);
    return (
      <div>{`${prefixLeftDate}天${prefixLeftHour}时${prefixLeftMinute}分${prefixLeftSecond}秒`}</div>
    );
  }
  componentDidMount() {
    this.intervalFunc = setInterval(() => {
      if(this.state.countSeconds <= 0 && this.intervalFunc){
        clearInterval(this.intervalFunc);
        this.callback && this.callback();
        return
      } 
      let remainSeconds = this.state.countSeconds-1;
      this.setState({
        countSeconds: remainSeconds 
      })
    },this.interval)
  }
  componentWillReceiveProps(nextProps){
    if(this.intervalFunc){
      clearInterval(this.intervalFunc);
    }
    console.log(nextProps);
  }
  componentWillUnmount(){
    if(this.intervalFunc){
      clearInterval(this.intervalFunc);      
    }
  }
}
export default CountDown;