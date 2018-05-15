/*
 * @Author: Wupeng
 * @Date: 2018-05-08 09:35:39 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-08 09:37:15
 * 编辑类目属性
 */
import React, { Component } from 'react'
// import { connect } from 'dva'
import { Modal, Form, Button, Input, Switch, InputNumber } from 'antd'
// import { selAttributeByAutoNo } from '../../../services/category/category'
// import style from './index.less'

const FormItem = Form.Item
const { TextArea } = Input

// EditDelete 删除
// EditSpecifications 编辑
@Form.create()
class Editattributes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: {},
    }
  }
componentWillMount() {
  // console.log('看看是不是每次都会调用', this.props.address)
  this.setState({
    address: this.props.address,
  })
}
// 编辑类目属性保存
handleSubmit = (e) => {
  e.preventDefault()
  this.props.form.validateFieldsAndScroll((err, values) => {
    const data = this.state.address
    if (!err) {
      const value = values
      value.optionalValue = values.optionalValue.replace(/[;.，。]+/g, ',')
      if (this.props.address.autoNo === undefined) {
        value.inputFlag = (data.inputFlag === undefined) ? 1 : data.inputFlag
        value.enableStatus = (data.enableStatus === undefined) ? 1 : data.enableStatus
        value.categoryNo = this.props.bjectEditvisvis.categoryNo
        value.companyNo = this.props.bjectEditvisvis.companyNo
        console.log(value)
        this.props.handelEditattributeshide(value)
       } else {
        value.inputFlag = data.inputFlag
        value.enableStatus = data.enableStatus
        this.props.addressdata({})
        this.props.Editattributesdata(value)
      }
      this.props.form.resetFields()
    }
  })
}
handelchangeeS = (value) => {
  const address1 = this.state.address
  address1.enableStatus = (value) ? 1 : 0
  this.setState({
    address: address1,
  })
}
handelchangeIF = (value) => {
  const address1 = this.state.address
  address1.inputFlag = (value) ? 1 : 0
  this.setState({
    address: address1,
  })
}
sortOrderval = (rule, value, callback) => {
  if (/^\d+(\.\d+)?$/.test(value)) {
    callback()
  } else {
    callback('请输入正确的排序号')
  }
}
render() {
  const { getFieldDecorator } = this.props.form
  const formItemLayout = {
    labelCol: {
      xs: { span: 16 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 12 },
    },
  }
return (
  <Modal
    maskClosable={false}
    visible={this.props.Editattributesvis}
    onOk={this.handleOk}
    footer={null}
    zIndex={1000}
    onCancel={this.props.onCancelhandelEditattributeshide}
  >
    <Form onSubmit={this.handleSubmit}>
      <FormItem
        {...formItemLayout}
        label={(
          <span>
            名称&nbsp;
          </span>
        )}
      >
        {getFieldDecorator('attributeName', {
            initialValue: (this.props.address.attributeName === undefined) ? '' : this.props.address.attributeName,
            rules: [{ required: true, message: '请输入名称', max: 50, whitespace: true }],
          })(
            <Input size="small" />
          )}
      </FormItem>
      <br />
      <FormItem
        {...formItemLayout}
        label={(
          <span>
            排序&nbsp;
          </span>
          )}
      >
        {getFieldDecorator('sortOrder', {
          initialValue: (this.props.address.sortOrder === undefined) ? '' : this.props.address.sortOrder,
          rules: [{ required: true, validator: this.sortOrderval }],
        })(
          <InputNumber
            size="small"
           // defaultValue={this.props.updatae.sortOrder}
          />
        )}
      </FormItem>
      <br />
      <FormItem
        {...formItemLayout}
        label={(
          <span>
           可输入&nbsp;
          </span>
        )}
      >
        {getFieldDecorator('inputFlag')(
          <Switch
          // checkedChildren="开"
          // unCheckedChildren="关"
          // 必输标志(0:非必输; 1:必输)
            defaultChecked={(this.state.address.inputFlag === 0) ? !true : true}
            onChange={this.handelchangeIF}
          />)}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={(
          <span>
            启用&nbsp;
          </span>
         )}
      >
        {/* switch false (关) true 开 */}
        {getFieldDecorator('enableStatus')(
          <Switch
            // checkedChildren="开"
            // unCheckedChildren="关"
            defaultChecked={(this.state.address.enableStatus === 0) ? !true : true}
            onChange={this.handelchangeeS}
          />)}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={(
          <span>
          可选属性值&nbsp;
          </span>
          )}
      >
        {getFieldDecorator('optionalValue', {
          initialValue: (this.props.address.optionalValue === undefined) ? '' : this.props.address.optionalValue,
          rules: [{ required: true, message: '请输入属性值', max: 100, whitespace: true }],
        })(<TextArea
          rows={12}
          placeholder="多个属性使用逗号分隔，单值长度不能超过100字符，如下所示：立领,连帽"
        />)}
      </FormItem>
      <br />
      <FormItem style={{ marginLeft: '17%' }}>
        <Button type="primary" size="small" htmlType="submit" >保存</Button>
      </FormItem>
    </Form>
  </Modal>
        )
    }
}

export default Editattributes
