/*
 * @Author: chenjie
 * @Date: 2017-12-12 13:46:05
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-03 13:21:48
 * 可编辑的Input
 */

import React, { Component } from 'react'
import { Input } from 'antd'
import config from '../../utils/config'

export default class EditInputCell2 extends Component {
    constructor(props) {
      super(props)
      this.state = {
          editEnable: false,
          value: '',
      }
    }
    componentWillMount() {
        // const { editEnable, value } = this.props
        // this.setState({
        //     editEnable,
        //     value,
        // })
    }
    componentWillReceiveProps(nextProps) {
        const { editEnable, value } = nextProps
        this.setState({
            editEnable,
            value,
        })
    }
    handleInputChange = (e) => {
       this.setState({
           value: e.target.value,
       }, () => {
        this.props.onInputChange(this.state.value, this.props.record, this.props.column)
       })
    }
    handleInputBlur = (e) => {
        // this.props.onInputChange(e.target.value, this.props.autoNo, this.props.column)
        e.stopPropagation()
     }
    render() {
        const { editEnable, value } = this.state
        return (editEnable ?
          <Input
            size={config.InputSize}
            value={value}
            onChange={this.handleInputChange.bind(this)}
            onBlur={this.handleInputBlur.bind(this)}
          /> :
          <span>{this.props.value ? `*****${this.props.value.substring(this.props.value.length-3)}` : null}</span>)
    }
}
