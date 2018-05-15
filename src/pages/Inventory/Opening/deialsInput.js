/*
 * @Author: Wupeng
 * @Date: 2017-12-12 13:46:05
 * @Last Modified by: chenjie
 * @Last Modified time: 2017-12-13 09:12:50
 * 可编辑的Input
 */

import React, { Component } from 'react'
import { Input } from 'antd'
// import styles from './index.less'
// import config from '../../../utils/config'

export default class DeialsInput extends Component {
    constructor(props) {
      super(props)
      this.state = {
      }
    }
    componentWillMount() {
    }
    render() {
      return (
        <div>
          {this.props.editable
      ? <Input style={{ margin: '-5px 0' }} size="small" value={this.props.value} onChange={e => this.props.onChange(e.target.value)} onBlur={e => this.props.onBlur(e.target)} />
      : this.props.value
    }
        </div>
      )
    }
}
