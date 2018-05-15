/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 13:56:00
 * 修改卖家备注
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, message } from 'antd'
import { editOrderMark } from '../../services/order/search'

const FormItem = Form.Item
const { TextArea } = Input

@connect(state => ({
  search: state.search,
}))
@Form.create()
export default class ModifySelRem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sellerRemark: undefined,
      confirmLoading: false,
      orderNo: null,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.btnModify) {
      this.setState({
        sellerRemark: nextProps.record.sellerRemark,
        orderNo: nextProps.record.orderNo,
      })
    } else {
      const { selectedRows } = nextProps.search
      if (selectedRows.length) {
        this.setState({ sellerRemark: selectedRows[0].sellerRemark, orderNo: selectedRows[0].orderNo  })
      }
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        Object.assign(values, { orderNos: [this.state.orderNo] })
        editOrderMark(values).then((json) => {
          if (json) {
            message.success('卖家备注修改成功')
            this.hideModal()
            this.props.dispatch({
              type: 'search/search',
            })
            this.props.dispatch({
              type: 'search/changeState',
              payload: { selectedRowKeys: [], selectedRows: [] },
            })
          }
          this.setState({
            confirmLoading: false,
          })
        })
      }
    })
  }
  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    this.setState({
      confirmLoading: false,
    })
    hideModal()
    this.handleReset()
  }
   // 重置表单
   handleReset = () => {
    this.props.form.resetFields()
  }
  remark = (flag, rule, value, callback) => {
    const reg = /[~#^$@%&!！?%*()-+()]/gi
    if (reg.test(value)) {
      this.props.form.setFields({
        [flag]: {
          value,
        },
      })
      callback(`${ flag === 'sellerRemark' ? '卖家' : '买家' }备注不能输入[特殊字符]只能输入[数字,字母,中文]`)
    } else {
      this.props.form.setFields({
        [flag]: {
          value,
        },
      })
      callback()
    }
  }
  render() {
    const { show } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Modal
          title="修改卖家备注"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem>
              {getFieldDecorator('sellerRemark', {
                initialValue: this.state.sellerRemark,
                rules: [{
                  validator: this.remark.bind(this, 'sellerRemark'),
                }],
              })(
                <TextArea style={{ marginBottom: 10 }} rows={4} maxLength="250" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
