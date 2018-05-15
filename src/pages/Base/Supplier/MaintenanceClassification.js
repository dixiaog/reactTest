/*
 * @Author: Wupeng
 * @Date: 2017-1-2 10:04:11
 * @Last Modified by;
 * 维护分类
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { Modal, Button, Form, Input } from 'antd'
import { updataTypeName } from '../../../services/supplier/supplier'

const FormItem = Form.Item

@Form.create()
export default class MaintenanceClassification extends Component {
        state = {
            visible: false,
            typeName: [],
        }
  componentWillMount() {
    this.setState({
      visible: this.props.data.MaintenanceClassificationvisble,
  })
  }
    handleSubmit = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
            this.props.data.Maintenancedata(values)
            this.setState({
              visible: false,
            })
        }
      })
    }
    handleOk = () => {
      this.setState({
        visible: false,
      })
      this.props.data.MaintenanceClassends()
    }
    handleCancel = () => {
      const type = this.props.form.getFieldValue('type')
      const payload = {}
      if (type === null) {
        payload.type = ''
      } else {
        payload.type = type.trim().replace(/\r\n+/g, ',').replace(/\s+/g, ',').replace(/[;.，。]+/g, ',')
      }
      updataTypeName({
        ...payload,
      }).then((json) => {
        if (json) {
          this.props.data.MaintenanceClassend()
        } else {
          console.log('操作失败请重试？')
        }
      })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          }
        return (
          <Modal
            title="提示"
            visible={this.state.visible}
            onCancel={this.handleOk}
            zIndex={1000}
            width={600}
            mask={false}
            maskClosable={false}
            footer={[
              <Button type="primary" onClick={this.handleCancel}>
                确认
              </Button>,
              <Button onClick={this.handleOk}>
                取消
              </Button>,
            ]}
          >
            <Form onSubmit={this.handleSubmit}>
              <h3>请维护供应商分类，多个分类请用逗号分隔(不区分全角半角)</h3>
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('type', {
                  initialValue: String(this.props.data.Maintext).length > 0 ? this.props.data.Maintext : null,
                })(
                  <Input placeholder="请输入应商分类！" size="small" />
                )}
              </FormItem>
            </Form>
          </Modal>
        )
    }
}
