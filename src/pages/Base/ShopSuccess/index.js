/*
 * @Author: tanmengjia
 * @Date: 2018-05-12 13:38:34
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-12 14:25:53
 * 授权成功跳转页面
 */
import React, { Component } from 'react'
import { connect } from 'dva'

@connect(state => ({
  shopSuccess: state.shopSuccess,
}))

export default class ShopSuccess extends Component {
  constructor(props) {
    super(props)
    this.state = {
      seconds: 5,
    }
  }
  
  render() {
    if (this.state.seconds > 0) {
      console.log('this.state.seconds', this.state.seconds)
      setTimeout(() => {
        this.setState({
            seconds: this.state.seconds - 1,
        })
      }, 1000)
    } else {
      window.close()
    }
    
    return(
      <div>
        <div>授权成功</div>
        <div>{this.state.seconds}秒后自动关闭页面...</div>
      </div>
    )
  }
}