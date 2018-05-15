/*
 * @Author: Wupeng
 * @Date: 2018-03-23 14:30:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-14 10:16:54
 * 添加标准分类
 */
import React, { Component } from 'react'
import { Modal, Cascader, Row, Col, Form, Button } from 'antd'
import { addStandardCategory } from '../../services/category/category'

const FormItem = Form.Item

class Specclassification extends Component {
  state = {
    hendelonChange: [],
    loading: false,
  }
  onChange=(value, selectedOptions) => {
    const i = selectedOptions.length - 1
    if (selectedOptions[i] !== undefined) {
      this.setState({
        hendelonChange: selectedOptions[i],
      })
    } else {
      this.setState({
        hendelonChange: [],
      })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const categoryDTO = this.state.hendelonChange
    this.setState({ loading: true })
    this.props.form.validateFieldsAndScroll((err) => {
    if (!err) {
      addStandardCategory({
        ...categoryDTO,
      }).then((data) => {
      if (data) {
          this.props.form.resetFields()
          this.setState({ loading: false })
          this.props.handleCancel()
      } else {
        console.log('保存失败')
      }
      })
    } else {
      console.log('位置错误')
    }
    })
  }
  handelDe3lect = () => {
    this.setState({
      hendelonChange: [],
    })
    this.props.form.resetFields('categoryno')
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 6 },
      },
     }
  return (
    <Modal
      title="请选择商品分类"
      visible={this.props.Specclassifications}
      footer={null}
      width={800}
      cancelText="取消"
      okText="确定"
      onCancel={this.props.handleCanceltwo}
    >
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label="请选择商品分类:">
              {getFieldDecorator('categoryno')(<Cascader
                style={{ width: 400 }}
                options={this.props.cnames}
                placeholder="请选择商品分类"
                size="small"
                onClick={this.handelDe3lect}
                onChange={this.onChange}
              />)}
            </FormItem>
          </Col>
        </Row>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Button
          type="primary"
          style={{ marginLeft: '75%' }}
          onClick={this.props.handleCanceltwo}
        >
          取消
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={this.state.loading}
          style={{ marginLeft: '5%' }}
          disabled={this.state.hendelonChange.length === 0}
        >
          确定
        </Button>
      </Form>
    </Modal>
        )
    }
}
export default Specclassification
