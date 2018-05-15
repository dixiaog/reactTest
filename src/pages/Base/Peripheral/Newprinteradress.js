/*
 * @Author: Wupeng
 * @Date: 2018-03-24 17:06:32
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-28 19:03:20
 * 编辑打印机
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input } from 'antd'
// import { selectAllClassify, editsave, save } from '../../../services/supplier/supplier'
import { editSave } from '../../../services/base/peripheral/peripheral.js'

const FormItem = Form.Item

@connect(state => ({
    peripheral: state.peripheral,
  }))
@Form.create()
export default class Newprinteradress extends Component {
   constructor(props) {
       super(props)
       this.state = {
           loading: false,
           pronteraddresstext: '请输入正确的打印机IP',
           pronterporttext: '请输入正确的端口号',
       }
   }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.setState({
              loading: true,
            })
            values.autoNo = this.props.data.autoNo
            editSave({
              ...values,
            }).then((json) => {
              if (json) {
                this.setState({
                  loading: true,
                })
                this.props.dispatch({
                  type: 'peripheral/search',
                })
                this.props.data.Newprinteraddresstwo()
              } else {
                this.setState({
                  loading: false,
                })
              }
            })
            console.log(values)
          } else {
              console.log('组件报错，没办法')
          }
        })
      }
      handleOk = () => {
          this.handleSubmit()
      }
    //   校验IP
    printerAdressone = (rules, value, callback) => {
        if (/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])/.test(value)) {
            callback()
        } else {
            callback('error')
        }
    }
    // 校验端口号
    printerPortone = (rule, value, callback) => {
        if (/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/.test(value)) {
            callback()
        } else {
            callback('error')
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 5 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
              md: { span: 9 },
            },
          }
        return (
          <Modal
            title="编辑的打印机"
            visible={this.props.data.Newprinteraddressvis}
            okText="保存"
            cancelText="取消"
            onOk={this.handleOk}
            onCancel={this.props.data.Newprinteraddresstwo}
            maskClosable={false}
            confirmLoading={this.state.loading}
            zIndex={50}
          >
            <Form onSubmit={this.handleSubmit} >
              <FormItem
                label="打印机IP"
                labelCol={{ span: 5 }}
                {...formItemLayout}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('printerAddess', {
                initialValue: this.props.data.Newprinteraddressreacord.printerAddess,
                rules: [{
                    required: true,
                    message: this.state.pronteraddresstext,
                    max: 20,
                    whitespace: true,
                    validator: this.printerAdressone,
                    }],
                })(
                  <Input size="small" />
                )}
              </FormItem>
              <FormItem
                label="打印机端口"
                labelCol={{ span: 5 }}
                {...formItemLayout}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('printerPort', {
                initialValue: this.props.data.Newprinteraddressreacord.printerPort,
                rules: [{
                    required: true,
                    message: this.state.pronterporttext,
                    max: 5,
                    whitespace: true,
                    validator: this.printerPortone,
                    }],
                })(
                  <Input size="small" />
                )}
              </FormItem>
            </Form>
          </Modal>
        )
    }
}
