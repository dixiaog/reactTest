import React, { Component } from 'react'
// import { connect } from 'dva'
import { Button, message } from 'antd'
// import styles from '../index.less'

export default class ButtonExt extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  onClick = () => {
    if (this.props.isAlert) {
      message.warning(this.props.alertMsg)
    } else {
      this.props.clickAct()
    }
  }
  render() {
    const { name, type } = this.props
    return(
      <Button
        size="small"
        type={type ? type : 'primary'}
        onClick={this.onClick}
      >
        {name}
      </Button>
    )
  }
}