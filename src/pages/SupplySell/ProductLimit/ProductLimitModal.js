/*
 * @Author: tanmengjia
 * @Date: 2018-01-25 13:25:19
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-07 09:10:52
 * 添加/编辑分销商品限制
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Form, Input, Radio, notification, Col, Switch, Tooltip, Button } from 'antd'
import config from '../../../utils/config'
import ChooseItem from '../../../components/ChooseItem/index'
import { saveProductLimit } from '../../../services/supplySell/productLimit'

const { TextArea } = Input
const RadioGroup = Radio.Group
const FormItem = Form.Item
const Option = Select.Option

@connect(state => ({
    productLimit: state.productLimit,
}))
@Form.create()
export default class ProductLimitModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkSwitch: true,
      productNoVal: '',
      two: false,
      init: true,
      isFirst: true,
    }
  }
  componentWillMount() {
    // this.props.dispatch({ type: 'commisionStrategy/getDistributor' })
    if (this.props.selectData && this.props.selectData.autoNo > -1) {
      this.props.dispatch({ type: 'productLimit/getChooseData', payload: this.props.selectData.autoNo })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.productLimit.chooseData && this.state.isFirst) {
      this.setState({
        productNoVal: nextProps.productLimit.chooseData.productNo ? nextProps.productLimit.chooseData.productNo : '',
        isFirst: false,
      })
      const { enableStatus } = nextProps.productLimit.chooseData
      if (this.state.init && enableStatus !== undefined) {
        this.setState({
          checkSwitch: enableStatus === 1,
          init: false,
        })
      }
    }
  }
  onSwitch = (checked) => {
    this.setState({
      checkSwitch: checked,
    })
  }
  chooseItem = () => {
    this.setState({
      two: true,
    })
  }
  changeProductNoVal = (e) => {
    this.setState({
      productNoVal: e.target.value,
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.limitModalHidden()
    this.setState({
      init: true,
      checkSwitch: true,
      productNoVal: '',
    })
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Object.assign(values, { enableStatus: this.state.checkSwitch ? 1 : 0 })
        Object.assign(values, { distributorName: this.props.distributor.filter(row => row.distributorNo * 1 === values.distributorNo * 1)[0].distributorName })
        if (this.props.productLimit.chooseData && this.props.productLimit.chooseData.autoNo > -1) {
          Object.assign(values, { autoNo: this.props.productLimit.chooseData.autoNo })
        }
        saveProductLimit(values).then((json) => {
          if (json) {
            notification.success({
              message: '操作成功',
            })
            this.props.form.resetFields()
            this.props.limitModalHidden()
            this.props.dispatch({ type: 'productLimit/fetch' })
            this.setState({
              productNoVal: '',
              init: true,
              checkSwitch: true,
            })
          }
        })
      }
    })
  }
  chooseModalHidden = () => {
    this.setState({
      two: false,
    })
  }
  choose = (value, callback) => {
    const { setFieldsValue } = this.props.form
    callback()
    this.setState({
      productNoVal: this.state.productNoVal ? this.state.productNoVal.concat(',').concat(value.join(',')) : value.join(','),
    }, () => {
      const value2 = this.state.productNoVal.split(',')
      const value3 = []
      value2.forEach((ele) => {
        if (ele) {
          let isOn = true
          if (value3.filter(e => e === ele).length) {
            isOn = false
          }
          if (isOn) {
            value3.push(ele)
          } else {
            isOn = true
          }
        }
      })
      setFieldsValue({ productNo: value3.join(',') })
    })
  }
  checkBlank1 = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('款式编号不能输入空格')
      } else {
        callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { limitType, distributorNo, productNo } = this.props.productLimit.chooseData ? this.props.productLimit.chooseData : ''
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    const formItemLayout2 = {
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
    console.log('this.state.productNoVal', this.state.productNoVal)
    return (
      <div>
        <Modal
          maskClosable={false}
          title={this.props.add ? '新增供销商品限定' : '编辑供销商品限定'}
          visible={this.props.itemModalVisiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          // bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          width={700}
          key="997"
        >
          <Form
            key="996"
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="分销商名称"
            >
              {getFieldDecorator('distributorNo', {
                initialValue: distributorNo,
                rules: [{
                  required: true, message: '请选择分销商名称',
                }],
            })(
              <Select size={config.InputSize} style={{ marginTop: 4 }} disabled={this.props.productLimit.chooseData ? true : false}>
                { this.props.distributor.map(ele => <Option key={ele.distributorNo} value={ele.distributorNo}>{ele.distributorName}</Option>)}
              </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<Tooltip title="系统只支持款式编号的限定，不支持颜色规则级别的限定"><a style={{ color: 'red' }}>?</a>限定款式编号</Tooltip>}
            >
              {getFieldDecorator('limitType', {
                initialValue: limitType ? String(limitType) : '0',
                rules: [{
                  required: true,
                }],
            })(
              <RadioGroup disabled={this.props.productLimit.chooseData ? true : false}>
                <Radio value="0">允许销售</Radio>
                <Radio value="1">禁止销售</Radio>
              </RadioGroup>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout2}
              label="款式编号"
            >
              <Col span={18}>
                {getFieldDecorator('productNo', {
                  initialValue: productNo,
                  rules: [{
                    required: true, message: '请输入款式编号',
                  },
                  {
                    validator: this.checkBlank1,
                  }],
              })(
                <TextArea rows={4} onChange={this.changeProductNoVal} />
                // <Input size={config.InputSize} />
              )}
              </Col>
              <Col span={5} offset={1} ><Button type="primary" size="small" onClick={this.chooseItem}>挑选商品</Button></Col>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="启用"
            >
              {getFieldDecorator('enableStatus')(
                <Switch checked={this.state.checkSwitch} onChange={this.onSwitch} />
            )}
            </FormItem>
          </Form>
        </Modal>
        { this.state.two ? <ChooseItem changeModalVisiable={this.state.two}
                              productNos={this.state.productNoVal ? this.state.productNoVal.split(',') : null}
                              fromName="productLimit"
                              itemModalHidden={this.chooseModalHidden}
                              choose={this.choose} /> : null }
      </div>
    )
  }
}
