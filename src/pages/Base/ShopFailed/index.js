/*
 * @Author: tanmengjia
 * @Date: 2018-05-12 13:39:05
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-12 14:54:05
 * 授权失败跳转页面
 */
import React, { Component } from 'react'
import { connect } from 'dva'

@connect(state => ({
  shopFailed: state.shopFailed,
}))

export default class ShopFailed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      seconds: 5,
    }
  }
  
  render() {
    if (this.state.seconds > 0) {
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
        <div>授权失败</div>
        <div>{this.state.seconds}秒后自动关闭页面...</div>
      </div>
    )
  }
}