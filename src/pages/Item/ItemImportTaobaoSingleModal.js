/*
 * @Author: chenjie
 * @Date: 2017-12-25 09:14:49
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-05-11 10:50:34
 * 单个导入淘宝|天猫商品信息
 */

import React, { Component } from 'react'
import { Modal, Form, Input, Radio, Card, Checkbox, message } from 'antd'
import config from '../../utils/config'
import { getAllShop } from '../../services/utils'

const FormItem = Form.Item
const RadioGroup = Radio.Group
@Form.create()
export default class ItemImportTaobao extends Component {
    constructor(props) {
        super(props)
        this.state = {
          shops: [],
          confirmLoading: false,
        }
    }
    componentDidMount() {
      getAllShop().then((json) => {
        if (json) {
          this.setState({ shops: json })
        }
       })
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
    }
    handleCancel = () => {
      this.setState({
        confirmLoading: false,
      })
      this.props.form.resetFields()
      this.props.itemModalHidden()
    }
    render() {
      const { getFieldDecorator } = this.props.form
      const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 3 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
            md: { span: 8 },
          },
        }
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 0,
          },
        },
      }
      return (
        <div>
          <Modal
            maskClosable={false}
            title="请选择所在店铺并输入商品编码"
            visible={this.props.importTbSingleVisiable}
            onOk={this.handleOk}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}
          >
            <Form
              style={{ marginTop: 8 }}
            >
              <Card style={{ marginBottom: 10, maxHeight: 200, overflowX: 'hidden' }}>
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
              </Card>
              <FormItem {...tailFormItemLayout}>
                {getFieldDecorator('isCover', {
                })(
                  <Checkbox>如果已下载则覆盖</Checkbox>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="商品编码"
              >
                {getFieldDecorator('iId', {
                  rules: [{
                  required: true, message: '请输入商品编码',
                  }],
              })(
                <Input size={config.InputSize} />
              )}
              </FormItem>
            </Form>
          </Modal>
        </div>
      )
    }
}
