/*
 * @Author: chenjie
 * @Date: 2017-12-12 13:46:05
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-02 14:05:23
 * 可编辑的CheckBox
 */

import React, { Component } from 'react'
import { Input, Checkbox } from 'antd'
import styles from './index.less'
import config from '../../utils/config'

export default class EditableCheckBox extends Component {
    constructor(props) {
      super(props)
      this.state = {
          checked: false,
          name: '',
      }
    }
    componentWillMount() {
        const { checked, name } = this.props
        this.setState({
            checked,
            name,
        })
    }
    componentWillReceiveProps(nextProps) {
        const { checked, name } = nextProps
        this.setState({
            checked,
            name,
        })
    }
    handleInputChange = (e) => {
       this.setState({
           name: e.target.value,
       })
    }
    handleInputBlur = (e) => {
        this.props.custormSpecChange(this.props.i, e.target.value)
        e.stopPropagation()
     }
    handleCkChange = (e) => {
       this.setState({
           checked: e.target.checked,
       })
       this.props.onChange(e.target.checked, e.target.value)
       e.stopPropagation()
    }
    render() {
        const { checked, name } = this.state
        const { wEnable } = this.props
        if (wEnable) {
            return (checked ?
              <Checkbox checked={checked} onChange={this.handleCkChange.bind(this)} value={name}>
                <Input
                  className={styles.checkInput}
                  size={config.InputSize}
                  value={name}
                  onChange={this.handleInputChange.bind(this)}
                  onBlur={this.handleInputBlur.bind(this)}
                />
              </Checkbox> :
              <Checkbox checked={checked} onChange={this.handleCkChange.bind(this)} value={name}>{name}</Checkbox>)
        } else {
            return (<Checkbox checked={checked} onChange={this.handleCkChange.bind(this)} value={name}>{name}</Checkbox>)
        }
    }
}
