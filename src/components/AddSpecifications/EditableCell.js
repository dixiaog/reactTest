/*
 * @Author: Wupeng
 * @Date: 2018-04-28 10:26:32 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-28 10:27:03
 * 编辑类目规格属性名 
 */
import React, { Component } from 'react'
// import update from 'immutability-helper'
import { Input, Form, Popconfirm, Modal, Button } from 'antd'
// import styles from './index.less'

const FormItem = Form.Item
@Form.create()
class EditableCell extends Component {
    state = {
      value: {},
      index: null,
      validateStatus: 'success',
    }
    componentWillMount() {
      this.setState({
        value: this.props.EditableCellv,
        index: this.props.EditableCellindex,

      })
    }
handeOk = (index) => {
  const specName = this.props.form.getFieldValue('specName')
  this.props.EditableCelltroo(specName, index)
}
specNames = (rule, value, callback) => {
if (value.length < 1) {
  this.setState({
    validateStatus: 'error',
  })
  callback('属性名不能为空')
} else if (value.length > 20) {
  this.setState({
    validateStatus: 'error',
  })
  callback('属性名长度不能大于20')
} else if (/[\s]/g.test(value)) {
  this.setState({
    validateStatus: 'error',
  })
  callback('属性名不能包含空格')
} else if (/[，]/g.test(value)) {
  this.setState({
    validateStatus: 'error',
  })
  callback('属性名不能包含，')
} else if (/[\s]/g.test(value)) {
  this.setState({
    validateStatus: 'error',
  })
  callback('属性名不能包含空格')
} else if (/[；]/g.test(value)) {
  this.setState({
    validateStatus: 'error',
  })
  callback('属性名不能包含；')
} else if (/[;]/g.test(value)) {
  this.setState({
    validateStatus: 'error',
  })
  callback('属性名不能包含;')
} else if (/[。]/g.test(value)) {
  this.setState({
    validateStatus: 'error',
  })
  callback('属性名不能包含。')
} else if (/[.]/g.test(value)) {
  this.setState({
    validateStatus: 'error',
  })
  callback('属性名不能包含.')
} else {
  this.setState({
    validateStatus: 'success',
  })
  callback()
}
}
render() {
  const { getFieldDecorator } = this.props.form
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  }
    return (
      <Modal
        title="编辑类目规格属性名"
        visible={this.props.EditableCellvis}
        onCancel={this.props.EditableCelltwo}
        style={{ top: 150 }}
        maskClosable={false}
        footer={[
          <Popconfirm
            title={`是否确认删除${(this.props.EditableCellvis) ? this.state.value.specName : ''}值`}
            onConfirm={this.props.EditableCelldelect.bind(this, this.state.index)}
            okText="确定"
            cancelText="取消"
          >
            {/* onClick={this.props.EditableCelldelect.bind(this)} */}
            <Button style={{ backgroundColor: 'red', color: 'white' }} >删除</Button>
          </Popconfirm>,
          <Button type="primary" loading={this.state.loading} onClick={this.handeOk.bind(this, this.state.index)}>返回修改后的值</Button>,
        ]}
      >
        <div>
          <Form>
            <FormItem
              {...formItemLayout}
              label="属性名"
              hasFeedback
              validateStatus={this.state.validateStatus}
            >
              {getFieldDecorator('specName', {
                initialValue: (this.props.EditableCellvis) ? this.state.value.specName : '',
                rules: [{ required: true, validator: this.specNames, len: 20 }],
            })(
              <Input style={{ width: '60%', marginRight: 8 }} />
            )}
            </FormItem>
          </Form>
        </div>
      </Modal>
      )
    }
  }

  export default EditableCell
