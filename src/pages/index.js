import React, { Component } from 'react'
import { connect } from 'dva'

@connect(state => ({
    global: state.global,
}))
export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
    
    }
  }
  render() {
    return (
      <div>
        这里显示首页
      </div>
    )
  }
}
