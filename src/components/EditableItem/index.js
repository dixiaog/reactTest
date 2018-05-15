/*
 * @Author: chenjie
 * @Date: 2018-01-29 16:00:54
 * 可编辑输入框
 */

import React, { PureComponent } from 'react'
import { Input, Icon, message } from 'antd'
import styles from './index.less'
import { checkNumber } from '../../utils/utils'

export default class EditableItem extends PureComponent {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const { value } = e.target
    this.setState({ value })
  }
  check = () => {
    if (this.props.format === 'number') {
      if (!checkNumber(this.state.value)) {
        message.error('错误的数据格式')
        return false
      }
      if (this.props.max && this.props.max < this.state.value) {
        message.error(this.props.maxError)
        return false
      }
    }
    this.setState({ editable: false })
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    }
  }
  edit = () => {
    this.setState({ editable: true })
  }
  render() {
    const { value, editable } = this.state
    return (
      <div className={styles.editableItem}>
        {
          editable ?
            <div className={styles.wrapper}>
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className={styles.icon}
                onClick={this.check}
              />
            </div>
            :
            <div className={styles.wrapper}>
              <span>{value}</span>
              <Icon
                type="edit"
                className={styles.icon}
                onClick={this.edit}
              />
            </div>
        }
      </div>
    )
  }
}
