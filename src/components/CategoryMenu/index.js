/*
 * @Author: Wupeng
 * @Date: 2017-1-5 10:04:11
 * @Last Modified by;
 * 商品类目 添加自定义分类
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { Form, Modal, Button, Input, Radio } from 'antd'
import { addCustomCategory } from '../../services/category/category'

const FormItem = Form.Item
const RadioGroup = Radio.Group

@Form.create()
class CategoryMenu extends Component {
  state = {
    value: 2,
    specClassification: ['颜色分类', '尺寸', '颜色', '尺码'],
    Nocolor: '',
    text: '颜色,尺码',
  }
  onChange = (e) => {
    if (e.target.value === 2) {
      this.setState({
        Nocolor: '',
        value: e.target.value,
        text: '颜色,尺码',
      })
    } else if (e.target.value === 1) {
      this.setState({
        Nocolor: '',
        value: e.target.value,
        text: '尺码',
      })
    } else {
      console.log('保存')
    }
  }
      handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            values.enableSpec = (values.agreement === 1) ? 0 : 1
            values.specClassification = values.specClassification.trim().replace(/\r\n+/g, ',').replace(/\s+/g, ',').replace(/[;.，。]+/g, ',')
            addCustomCategory({
              ...values,
            }).then((json) => {
              console.log('添加自定义分类data', json)
              if (json) {
                setTimeout(() => {
                  this.props.form.resetFields()
                }, 1000)
                this.props.handelCategoryMenus()
              } else {
                console.log('添加自定义失败')
              }
            })
          }
        })
      }
      colorNospan = (index) => {
        const Nocolor = this.state.Nocolor
        if (Nocolor.length === 0) {
          this.setState({
            Nocolor: `${index}`,
          })
        } else {
          this.setState({
            Nocolor: `${Nocolor},${index}`,
          })
        }
      }
      specClassificationfrom = (rules, value, callback) => {
        if (this.state.value === 1) {
          const patt1 = new RegExp('尺码')
          if (patt1.test(value)) {
            callback()
            return false
          } else {
            callback('请输入颜色规则分类项目，逗号分隔,必须包含尺码')
          }
        } else if (this.state.value === 2) {
          const patt1 = new RegExp('颜色')
          const patt2 = new RegExp('尺码')
          if (patt1.test(value) && patt2.test(value)) {
            callback()
            return false
          } else {
            callback('请输入颜色规则分类项目，逗号分隔,必须包含颜色,尺码')
          }
        } else {
          callback()
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
        const tailFormItemLayout = {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 3,
            },
          },
        }
        const specClassification = this.state.specClassification.map((index) => {
          return (<span onClick={this.colorNospan.bind(this, index)}>{index}&nbsp;</span>)
        })
        return (
          <Modal
            footer={null}
            width={800}
            okText="确定"
            cancelText="取消"
            maskClosable={false}
            title="请选择商品分类"
            visible={this.props.CategoryMenuvis}
            onCancel={this.props.handelCategoryMenustwo}
          >
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    分类名&nbsp;
                  </span>
                )}
              >
                {getFieldDecorator('categoryName', {
                    rules: [{ required: true, message: '请输入分类名', whitespace: true }],
                })(
                  <Input size="small" />
                )}
              </FormItem>
              <FormItem
                style={{ marginTop: 10 }}
                {...formItemLayout}
                label={(
                  <span>
                    排序&nbsp;
                  </span>
                )}
              >
                {getFieldDecorator('sortOrder', {
                    rules: [{ required: true, message: '请输入排序', whitespace: true }],
                })(
                  <Input size="small" />
                )}
              </FormItem>
              <h4 style={{ marginLeft: '10%', marginTop: 10 }}>添加颜色规则分类信息</h4>
              <FormItem {...tailFormItemLayout}>
                {getFieldDecorator('agreement', {
                  initialValue: this.state.value,
                  valuePropName: 'checked',
                })(
                  <RadioGroup onChange={this.onChange} value={this.state.value} >
                    <Radio value={1}>该分类商品不区分颜色规则，每款商品只有一个单品</Radio>
                    <Radio value={2}>该分类商品区分颜色规则，需要根据 颜色规则属性来区分不同单品</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={(<span>颜色分类&nbsp;</span>)}>
                {getFieldDecorator('specClassification', {
                  initialValue: this.state.text,
                  rules: [{ required: true, validator: this.specClassificationfrom, whitespace: true }],
                })(
                  <Input
                    placeholder="请输入颜色规则分类项目，逗号分隔"
                    size="small"
                  />
                )}
              </FormItem>
              <p style={{ marginLeft: '10%', marginTop: 10 }}>已有分类历史:<a>{specClassification}</a></p>
              <FormItem style={{ marginLeft: '80%' }}>
                <Button type="primary" htmlType="submit" >保存</Button>
              </FormItem>
            </Form>
          </Modal>
        )
    }
}
export default CategoryMenu
