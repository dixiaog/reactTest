import React, { Component } from 'react'
import { Input, Icon, message } from 'antd'
import styles from '../Item.less'
import { floatCheck1 } from '../../../utils/utils'

export default class EditableCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      editable: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (/^(([1-9])|([1-9]\d{0,9}[0-9])|(([0-9]\.\d{1,2}|[1-9]\d{0,6}[0-9]\.\d{1,2})))$/.test(nextProps.value)) {
      this.setState = {
        value: nextProps.value,
      }
    }
  }
  handleChange = (e) => {
    const value = e.target.value
    this.setState({ value })
  }
  check = () => {
    this.setState({ editable: false })
    if (this.props.type === 'money') {
      if (/^(([1-9])|([1-9]\d{0,6}[0-9])|(([0-9]\.\d{1,2}|[1-9]\d{0,6}[0-9]\.\d{1,2})))$/.test(this.state.value)) {
        if (this.props.onChange) {
          this.props.onChange(this.state.value)
        }
      } else {
        message.error('请输入正确的金额格式并且长度不超过8位')
        this.setState({
          value: 1,
        }, () => {
          if (this.props.onChange) {
            this.props.onChange(this.state.value)
          }
        })
      }
    } else if (this.props.type === 'count') {
      if (floatCheck1(this.state.value)) {
        if (this.state.value.length < 12 || this.state.value.length === undefined) {
          if (this.props.onChange) {
            this.props.onChange(this.state.value)
          }
        } else {
          message.error('请输入最高不超过11位数')
          this.setState({
            value: 1,
          }, () => {
            if (this.props.onChange) {
              this.props.onChange(this.state.value)
            }
          })
        }
      } else {
        message.error('请输入正确的数量格式')
        this.setState({
          value: 1,
        }, () => {
          if (this.props.onChange) {
            this.props.onChange(this.state.value)
          }
        })
      }
    }
  }
  edit = () => {
    this.setState({ editable: true })
  }
  render() {
    const { value, editable } = this.state
    return (
      <div className={styles.editableCell}>
        {
          editable ?
            <div className={styles.editableCellInputWrapper}>
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className={styles.editableCellIconCheck}
                onClick={this.check}
              />
            </div>
            :
            <div className={styles.editableCellTextWrapper}>
              {value || ' '}
              <Icon
                type="edit"
                className={styles.editableCellIcon}
                onClick={this.edit}
              />
            </div>
        }
      </div>
    )
  }
}
