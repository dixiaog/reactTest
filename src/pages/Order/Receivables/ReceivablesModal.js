/*
 * @Author: tanmengjia
 * @Date: 2018-02-05 14:58:10
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-05-07 16:18:37
 * 编辑收款管理
 */
import React, { Component } from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { Modal, Select, Form, Input, DatePicker} from 'antd'
import config from '../../../utils/config'
import { moneyCheck, checkEmpty } from '../../../utils/utils'
import { editSave } from '../../../services/order/receivables'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class ReceivablesModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
        options: [],
        position: [],
        select: [],
        record: {},
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.record) {
      this.setState({
        record: nextProps.record,
      })
    }
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          editSave({
            autoNo: this.state.record.autoNo,
            amount: values.amount.replace(/,/g,''),
            remark: values.remark,
          }).then((json) => {
            if (json) {
              this.props.form.resetFields()
              this.props.hidden()
              this.props.dispatch({
                type: 'receivables/search',
              })
            }
          })
        }
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.hidden()
  }

  checkPrice = (rule, value, callback) => {
    if (checkEmpty(value)) {
      callback('请填写金额')
    } else {
      if (!moneyCheck(value.replace(/,/g, ''))) {
        callback('金额格式错误，后面最多两位小数字')
      } else {
        const { setFieldsValue } = this.props.form
        setFieldsValue({ amount: numeral(value.replace(/,/g, '')).format('0,0.00')})
        callback()
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { innerNo, billDate, amount, remark, siteBuyerNo } = this.state.record
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 16 },
      },
    }
    const selectAfter = getFieldDecorator('prefix1', {
      initialValue: 'innerNo',
    })(
      <Select style={{ width: 105 }}>
        <Option value="innerNo">内部订单号</Option>
      </Select>
    )
    return (
      <div>
        <Modal
          maskClosable={false}
          title="编辑收款信息"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="订单编号"
            >
              {getFieldDecorator('innerNo', {
                initialValue: innerNo,
                rules: [{
                  required: true, message: '请输入订单编号',
                  }],
            })(
              <Input readOnly addonAfter={selectAfter} size={config.InputSize} placeholder="请输入订单编号" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="单据日期"
            >
              {getFieldDecorator('billDate', {
                initialValue: billDate ? moment(billDate) : undefined,
                rules: [{
                  required: true, message: '请选择单据日期',
                  }],
            })(
              <DatePicker disabled />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="买家账号"
            >
              {getFieldDecorator('siteBuyerNo', {
                initialValue: siteBuyerNo,
            })(
              <Input size={config.InputSize} readOnly />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="金额"
            >
              {getFieldDecorator('amount', {
                initialValue: amount ? numeral(amount).format('0,0.00') : 0,
                rules: [{
                  validator: this.checkPrice,
                }],
            })(
              <Input size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark', {
                initialValue: remark,
            })(
              <Input.TextArea rows={3} size={config.InputSize} />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
