import React, { Component } from 'react';
import CountDown from '../../componts/CountDown'
import { setTimeout } from 'timers';
class Home extends Component {
  constructor() {
    super();
    this.state = {
      countSeconds: 100
    }
  }
  render() {
    let self =this;
    // 生成头部
    function Head() {
      return (
        <div className="download-app">
          <div className="download-des pull-left ib_dis_content">
            <img src={require("../../assets/img/logo_fandien_h5.png")} />
            <span>下载饭蛋APP</span>
          </div>
          <a className="download-now pull-right" href="http://a.app.qq.com/o/simple.jsp?pkgname=agilie.fandine&g_f=991653">立即下载</a>
        </div>
      )
    }
    //广告部分
    function AdviceBanner() {
      return (
        <header className="adv">
          <a className="activity-rule">活动规则</a>
        </header>
      )
    }
    //主体业务逻辑部分
    function Content() {
      return (
        <div className="main-body">
          <CountDown countSeconds={self.state.countSeconds} callback={self.countEnd} hahah={self.state.hahah}></CountDown>
        </div>
      )
    }
    return (
      <div>
        <Head></Head>
        <AdviceBanner></AdviceBanner>
        <Content></Content>
      </div>
    );
  }
  componentDidMount() {
    setTimeout(()=>{
      this.setState({
        countSeconds:60
      })
    },4000)
  }
  // 倒计时结束
  countEnd(){
    console.log("倒计时结束啦！");
  }
}
export default Home;