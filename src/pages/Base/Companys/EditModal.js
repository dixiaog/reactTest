/*
 * @Author: Chen Xinjie
 * @Date: 2018-01-02 10:40:53
 * @Last Modified by: Chen Xinjie
 * @Last Modified time: 2018-02-28 09:05:33
 * 新增编辑公司信息维护
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input } from 'antd'
import config from '../../../utils/config'
import { Update, GetViewData } from '../../../services/base/companys'

const FormItem = Form.Item
@connect(state => ({
    companys: state.companys,
}))
@Form.create()
export default class CompanyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      company: {},
    }
  }
  componentWillMount() {
    const { company } = this.props
    if (company.companyNo) {
      GetViewData(company).then((json) => {
        this.setState({
          company: json,
        })
      })
    }
  }

  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.companyModalHidden()
    this.setState({
      company: {},
    })
  }
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Object.assign(values, {
          companyNo: this.state.company.companyNo,
          enableStatus: this.state.company.enableStatus,
          shortName: values.shortName.trim(),
        })
        Update(values).then((json) => {
          if (json) {
            const { dispatch } = this.props
            this.props.form.resetFields()
            this.props.companyModalHidden()
            dispatch({
              type: 'companys/search',
            })
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { company } = this.props
    const { companyName, shortName } = company

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

    return (
      <div>
        <Modal
          maskClosable={false}
          title="编辑公司信息"
          visible={this.props.editModalVisiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="公司名称"
            >
              {companyName}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="公司简称"
            >
              {getFieldDecorator('shortName', {
                initialValue: shortName,
                rules: [{
                  required: true, message: '请输入公司简称',
                },
                { max: 10, message: '公司简称不能超过10个字符' }],
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
