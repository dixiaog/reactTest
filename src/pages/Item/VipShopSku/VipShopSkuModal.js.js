/*
 * @Author: tanmengjia
 * @Date: 2018-05-08 15:40:17
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-10 14:41:08
 * 手工下载商品(按时间)
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Select, Form, notification, Col, Button, DatePicker, Row, Checkbox } from 'antd'
import config from '../../../utils/config'
import { download } from '../../../services/item/vipShopSku'

const FormItem = Form.Item
const Option = Select.Option

@connect(state => ({
  vipShopSku: state.vipShopSku,
}))
@Form.create()
export default class VipShopSkuModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      begin: undefined,
      end: undefined,
      checked: false,
      loading1: false,
    }
  }
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  onBegin = (e) => {
    this.setState({
      begin: e ? e.format('YYYY-MM-DD') : undefined,
    })
  }
  onEnd = (e) => {
    this.setState({
      end: e ? e.format('YYYY-MM-DD') : undefined,
    })
  }
  checkBeginTime = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.end && moment(value).format('YYYY-MM-DD') > moment(this.state.end).format('YYYY-MM-DD')) {
      callback('开始日期必须小于等于结束日期')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const endQuery = getFieldValue('endQuery')
      resetFields('endQuery')
      setFieldsValue({ endQuery })
      callback()
    }
  }
  checkEndTime = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.begin && moment(value).format('YYYY-MM-DD') < moment(this.state.begin).format('YYYY-MM-DD')) {
      callback('结束日期必须大于等于开始日期')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const startQuery = getFieldValue('startQuery')
      resetFields('startQuery')
      setFieldsValue({ startQuery })
      callback()
    }
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.vipModalHidden()
    this.setState({
      begin: undefined,
      end: undefined,
      checked: false,
    })
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.checked) {
          delete values.startQuery
          delete values.endQuery
        } else {
          Object.assign(values, { startQuery: moment(values.startQuery).format('YYYY-MM-DD'), endQuery: moment(values.endQuery).format('YYYY-MM-DD') })
        }
        console.log('立即下载', values)
        this.setState({
          loading1: true,
        }, () => {
          download(values).then((json) => {
            if (json) {
              notification.success({
                message: '操作成功',
              })
              this.props.form.resetFields()
              this.props.vipModalHidden()
              this.props.dispatch({ type: 'vipShopSku/fetch' })
              this.setState({
                begin: undefined,
                end: undefined,
                checked: false,
                loading1: false,
              })
            }
          })
        })
        
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { shops } = this.props
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
    return (
      <Modal
        maskClosable={false}
        title="手工下载商品(按时间)"
        visible={this.props.vipModalVisiable}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        // bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        footer={[
          <Button key="789" type="primary" onClick={this.handleOk} loading={this.state.loading1}>
            立即下载
          </Button>,
        ]}
        width={500}
      >
        <Form
          style={{ marginTop: 8 }}
        >
          <FormItem
            {...formItemLayout}
            label="店铺"
          >
            {getFieldDecorator('shopNo', {
              rules: [{
                required: true, message: '请选择店铺',
              }],
          })(
            <Select size={config.InputSize} style={{ marginTop: 4 }}>
              { shops && shops.length && shops.map(ele => <Option key={ele.shopNo} value={ele.shopNo}>{ele.shopName}</Option>)}
            </Select>
          )}
          </FormItem>
          <Row style={{ marginTop: 2, marginBottom: 2 }}><Col span={6} style={{ marginTop: 2, marginBottom: 2 }} />
            <Col span={18} style={{ marginTop: 2, marginBottom: 2 }}>
              <Checkbox onChange={e => this.setState({ checked: e.target.checked })} checked={this.state.checked} style={{ marginTop: 2, marginBottom: 2 }}>忽略时间全部下载</Checkbox>
            </Col>
          </Row>
          <FormItem
            {...formItemLayout}
            label="开始时间"
          >
            {getFieldDecorator('startQuery', {
              rules: [{
                required: true, message: '请选择开始时间',
              },
              {
                validator: this.checkBeginTime,
              }],
          })(
            <DatePicker size={config.InputSize} onChange={this.onBegin} placeholder="开始时间" />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="结束时间"
          >
            {getFieldDecorator('endQuery', {
              rules: [{
                required: true, message: '请选择结束时间',
              },
              {
                validator: this.checkEndTime,
              }],
          })(
            <DatePicker size={config.InputSize} onChange={this.onEnd} placeholder="结束时间" />
          )}
          </FormItem>
          <Row style={{ marginTop: 2 }}><Col span={3} style={{ marginTop: 2 }} /><Col span={21} style={{ marginTop: 2 }}><div style={{ marginTop: 2 }}>.时间跨度不能超过三天</div></Col></Row>
          <Row style={{ marginTop: 4 }}><Col span={3} style={{ marginTop: 4 }} /><Col span={21} style={{ marginTop: 4 }}><div style={{ marginTop: 4 }}>.当商品数量较多的时候下载时间较慢,请耐心等待</div></Col></Row>
          {/* <Col span={18} />
          
          <Col span={18} /> */}
        </Form>
      </Modal>
    )
  }
}
