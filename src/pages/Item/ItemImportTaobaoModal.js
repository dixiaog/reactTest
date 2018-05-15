/*
 * @Author: chenjie
 * @Date: 2017-12-25 09:14:49
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-05-11 10:51:01
 * 导入淘宝|天猫商品信息
 */

import React, { Component } from 'react'
import { Modal, Form, Input, Radio, Card, Tooltip, Icon, message } from 'antd'
import config from '../../utils/config'
import { getAllShop } from '../../services/utils'

const FormItem = Form.Item
const RadioGroup = Radio.Group

@Form.create()
export default class ItemImportTaobaoModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          shops: [],
          confirmLoading: false,
          visible: false,
          value: '',
          helpiId: '',
        }
    }
    componentDidMount() {
      getAllShop().then((json) => {
        if (json) {
          this.setState({ shops: json })
        }
       })
    }
    onFocus = () => {
      this.setState({
        visible: true,
      })
    }
    onBlur = () => {
      this.setState({
        visible: false,
      })
    }
    onMouseEnter = () => {
      this.setState({
        visible: true,
      })
    }
    onMouseLeave = () => {
      this.setState({
        visible: false,
      })
    }
    onChange = (e) => {
      const { value } = e.target
      const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
      if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.setState({
          value: e.target.value,
        })
      }
    }
    handleOk = () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (!values.shops) {
            message.error('请先选择店铺')
            return false
          }
          this.setState({
            confirmLoading: true,
          })
          console.log(values)
        }
      })
      // this.handleSubmit()
    }
    handleCancel = () => {
      this.setState({
        confirmLoading: false,
        value: '',
      })
      this.props.form.resetFields()
      this.props.itemModalHidden()
    }

    checkiId = (rule, value, callback) => {
      if (!value) {
        this.setState({
          helpiId: '请输入价格系数',
        })
        callback('error')
      } else if (value < 0.01 || value > 10) {
        this.setState({
          helpiId: '价格系数区间0.01~10',
        })
        callback('error')
      } else {
        this.setState({
          helpiId: '',
        })
        const { form } = this.props
        if (value && this.state.confirmDirty) {
          form.validateFields(['InitPwd'], { force: true })
        }
        callback()
      }
    }
    render() {
      const { getFieldDecorator } = this.props.form
      const tooltipTitle = (
        <div>
          <div>针对店铺商品单品销售价的新价格<br /></div>
          <div>数字范围：0.01~10<br /></div>
          <div>店铺销售价*价格系数=新价格<br /></div>
          <div>比如：<br /></div>
          <div>50*1.1=55`50*0.8=40<br /></div>
          <div>如果原价不带小数位，则四舍五入到整数位，否则保留2位小数</div>
        </div>
      )
      // const formItemLayout = {
      //     labelCol: {
      //       xs: { span: 24 },
      //       sm: { span: 3 },
      //     },
      //     wrapperCol: {
      //       xs: { span: 24 },
      //       sm: { span: 12 },
      //       md: { span: 8 },
      //     },
      //   }
      const formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 14 },
    }
      return (
        <div>
          <Modal
            maskClosable={false}
            title="导入淘宝|天猫商品信息"
            visible={this.props.importTbVisiable}
            onOk={this.handleOk}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}
            bodyStyle={{ height: 500, overflowX: 'hidden' }}
          >
            <Form
              style={{ marginTop: 8 }}
            >
              <Card style={{ marginBottom: 10 }}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('itemStatus', {
                    initialValue: '1',
                    rules: [{
                    }],
                })(
                  <RadioGroup >
                    <Radio value="1">出售中的商品（宝贝）</Radio>
                    <Radio value="2">仓库中待上架的商品（宝贝）</Radio>
                    <Radio value="3">仓库中已售完的商品（宝贝）</Radio>
                  </RadioGroup>
                )}
                </FormItem>
              </Card>
              <Card style={{ marginBottom: 10 }}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('judge', {
                    initialValue: '1',
                    rules: [{
                    }],
                })(
                  <RadioGroup >
                    <Radio value="1">系统中存在相同的编码不处理</Radio>
                    <Radio value="2">系统中存在相同的编码时用淘宝的数据覆盖</Radio>
                  </RadioGroup>
                )}
                </FormItem>
              </Card>
              <FormItem
                help={this.state.helpiId}
                {...formItemLayout}
                label="价格系数"
              >
                {getFieldDecorator('iId', {
                  rules: [{
                  required: true, message: '请输入价格系数',
                  }, {
                    validator: this.checkiId,
                  }],
              })(
                <div>
                  <span>
                    <Input
                      onFocus={this.onFocus}
                      onBlur={this.onBlur}
                      onChange={this.onChange}
                      size={config.InputSize}
                      style={{ width: '150px', marginRight: '10px' }}
                      placeholder="请输入0.01~10的数字"
                      value={this.state.value}
                    />
                    <span>
                      <Tooltip placement="top" title={tooltipTitle} visible={this.state.visible}>
                        <Icon
                          type="question-circle"
                          style={{ fontSize: 16 }}
                          onMouseEnter={this.onMouseEnter}
                          onMouseLeave={this.onMouseLeave}
                        />
                      </Tooltip>
                    </span>
                  </span>
                </div>
              )}
              </FormItem>
              <div style={{ marginBottom: 10, maxHeight: 200, overflowX: 'hidden' }}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('shops', {
                })(
                  <RadioGroup >
                    {
                      this.state.shops.length ?
                        this.state.shops.map((shop, index) => <Radio style={{ height: 30, lineHeight: '30px', display: 'block' }} value={shop.shopNo} key={index}>{shop.shopName}</Radio>) : '暂无店铺'
                    }
                  </RadioGroup>
                )}
                </FormItem>
              </div>
            </Form>
          </Modal>
        </div>
      )
    }
}
