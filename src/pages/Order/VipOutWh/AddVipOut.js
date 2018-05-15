/*
 * @Author: tanmengjia
 * @Date: 2018-05-09 09:14:14
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 15:21:05
 * 创建唯品会发货单
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Select, notification, Form, Col, Button, DatePicker, Row, Input, Divider } from 'antd'
import config from '../../../utils/config'
import ChoosePO from './ChoosePO'
import { addVipOut, edit } from '../../../services/order/vipOutWh'

const FormItem = Form.Item
const Option = Select.Option

@connect(state => ({
  vipOutWh: state.vipOutWh,
}))
@Form.create()
export default class VipOutWh extends Component {
  constructor(props) {
    super(props)
    this.state = {
      begin: undefined,
      end: undefined,
      choosePO: false,
      isFirst: false,
      isHave: false,
    }
  }
  componentWillMount() {
    if (this.props.record) {
      this.props.dispatch({
        type: 'vipOutWh/getChooseData',
        payload: { billNo: this.props.record.billNo },
      })
      this.setState({
        isFirst: true,
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.isFirst && this.props.vipOutWh.chooseData) {
      this.setState({
        isFirst: false,
        begin: moment(this.props.vipOutWh.chooseData.deliveryTime).format('YYYY-MM-DD'),
        end: moment(this.props.vipOutWh.chooseData.arrivalTime).format('YYYY-MM-DD HH:mm:ss'),
      })
    }
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
    } else if (this.state.end && moment(value).format('YYYY-MM-DD HH:mm:ss') >= moment(this.state.end).format('YYYY-MM-DD HH:mm:ss')) {
      callback('送货时间必须小于预计到货时间')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const arrivalTime = getFieldValue('arrivalTime')
      resetFields('arrivalTime')
      setFieldsValue({ arrivalTime })
      callback()
    }
  }
  checkEndTime = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.begin && moment(value).format('YYYY-MM-DD HH:mm:ss') <= moment(this.state.begin).format('YYYY-MM-DD HH:mm:ss')) {
      callback('预计到货时间必须大于送货时间')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const deliveryTime = getFieldValue('deliveryTime')
      resetFields('deliveryTime')
      setFieldsValue({ deliveryTime })
      callback()
    }
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.vipAddHidden()
    this.setState({
      begin: undefined,
      end: undefined,
      choosePO: false,
      isHave: false,
      isFirst: false,
    })
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { shops, warehouses } = this.props
        const { expressCorps } = this.props.vipOutWh
        Object.assign(values, { deliveryTime: moment(values.deliveryTime).format('YYYY-MM-DD'), arrivalTime: moment(values.arrivalTime).format('YYYY-MM-DD HH:mm:ss') })
        Object.assign(values, { expressCorpName: expressCorps.filter(ele => ele.expressCorpNo === values.expressCorpNo)[0].expressCorpName })
        Object.assign(values, { warehouseName: warehouses.filter(ele => ele.warehouseNo === values.warehouseNo)[0].warehouseName })
        Object.assign(values, { shopName: shops.filter(ele => ele.shopNo === values.shopNo)[0].shopName })
        console.log('values', values)
        if (this.props.record) {
          Object.assign(values, { billNo: this.props.record.billNo })
          edit(values).then((json) => {
            if (json) {
              notification.success({
                message: '操作成功',
              })
              this.props.form.resetFields()
              this.props.vipAddHidden()
              this.props.dispatch({ type: 'vipOutWh/fetch' })
              this.setState({
                begin: undefined,
                end: undefined,
                choosePO: false,
                isHave: false,
                isFirst: false,
              })
            }
          })
        } else {
          addVipOut(values).then((json) => {
            if (json) {
              notification.success({
                message: '操作成功',
              })
              this.props.form.resetFields()
              this.props.vipAddHidden()
              this.props.dispatch({ type: 'vipOutWh/fetch' })
              this.setState({
                begin: undefined,
                end: undefined,
                choosePO: false,
                isHave: false,
                isFirst: false,
              })
            }
          })
        }
      }
    })
  }
  choose = () => {
    if (!this.props.record) {
      this.setState({
        choosePO: true,
      })
    }
  }
  checkMobile = (rulr, value, callback) => {
    if (!value) {
      callback('请输入承运人电话')
    } else {
      const isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|(16[0-9]{1}))+\d{8})$/
      const isPhone = /^(?:(?:0\d{2,4})-)?(?:\d{7,8})(-(?:\d{3,}))?$/
      if (!isMobile.exec(value) && value.length !== 11 && !isPhone.test(value)) {
        callback('请输入正确的联系方式')
      } else {
        callback()
      }
    }
  }
  checkBlank = (rule, value, callback) => {
    if (!value) {
      callback('请输入PO')
    } else if (value.indexOf(' ') !== -1) {
      callback('PO不能输入空格')
    } else {
      callback()
    }
  }
  checkBlank1 = (rule, value, callback) => {
    if (!value) {
      callback('请输入承运单号')
    } else if (value.indexOf(' ') !== -1) {
        callback('承运单号不能输入空格')
      } else {
        callback()
    }
  }
  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form
    const { expressCorps } = this.props.vipOutWh
    const { shops, warehouses } = this.props
    const { vipInNo, poNo, expressTel, remark,
      arrivalTime, deliveryTime, expressNo,
      expressCorpNo, transportMode, warehouseNo,
      shopNo, billStatus } = this.props.vipOutWh.chooseData ? this.props.vipOutWh.chooseData : ''
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
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
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    const POModalProps = {
      choosePO1: this.state.choosePO,
      POHidden: () => {
        this.setState({
          choosePO: false,
        })
      },
      shops,
      warehouses,
      choosePOs: (POs, callback) => {
        const poNos = []
        POs.forEach((ele) => {
          poNos.push(ele.poNo)
        })
        const allList = poNos.join(',')
        const nowList = []
        allList.split(',').forEach((ele) => {
          if (ele) {
            let isOn = true
            if (nowList.filter(e => e === ele).length) {
              isOn = false
            }
            if (isOn) {
              nowList.push(ele)
            } else {
              isOn = true
            }
          }
        })
        setFieldsValue({ poNo: nowList.join(',') })
        setFieldsValue({ shopNo: POs[0].shopNo })
        setFieldsValue({ warehouseNo: POs[0].warehouseNo })
        this.props.dispatch({ type: 'vipOutWh/getExpressCorp', payload: POs[0].shopNo })
        setFieldsValue({ expressCorpNo: undefined })
        this.setState({
          isHave: true,
        })
        callback()
      },
    }
    const title = this.state.isHave ? "请选择承运商" : "请先选择PO单"
    return (
      <Modal
        maskClosable={false}
        title="唯品会出库"
        visible={this.props.vipAddVisiable}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        // bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        footer={[
          <Button key="789" type="primary" onClick={this.handleOk}>
            保存
          </Button>,
        ]}
        width={800}
      >
        <Form
          style={{ marginTop: 8 }}
        >
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout1}
                label="VIP入库单号"
              >
                {getFieldDecorator('vipInNo', {
                  initialValue: vipInNo,
              })(
                <Input size={config.InputSize} readOnly={true}/>
              )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout2}
                label="状态"
              >
                {getFieldDecorator('billStatus', {
                  initialValue: billStatus > -1 ? billStatus * 1 : 0,
              })(
                <Select size={config.InputSize} style={{ marginTop: 4 }} disabled>
                  <Option key={0} value={0}>待出库</Option>
                  <Option key={1} value={1}>部分上传</Option>
                  <Option key={2} value={2}>已上传</Option>
                  <Option key={3} value={3}>已出库</Option>
                  <Option key={4} value={4}>取消</Option>
                  <Option key={5} value={5}>作废</Option>
                </Select>
              )}
              </FormItem>
            </Col>
          </Row>
          <FormItem
            {...formItemLayout}
            label="PO"
          >
            {getFieldDecorator('poNo', {
              initialValue: poNo,
              rules: [{
                required: true,
                validator: this.checkBlank,
              }],
          })(
            <Input size={config.InputSize} onDoubleClick={this.choose} readOnly/>
            // <DatePicker size={config.InputSize} onChange={this.onBegin} placeholder="开始时间" />
          )}
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout1}
                label="店铺"
              >
                {getFieldDecorator('shopNo', {
                  initialValue: shopNo ? shopNo * 1 : undefined,
                  rules: [{
                    required: true, message: '请选择店铺',
                  }],
              })(
                <Select size={config.InputSize} style={{ marginTop: 4 }} disabled>
                  { shops && shops.length && shops.map(ele => <Option key={ele.shopNo} value={ele.shopNo}>{ele.shopName}</Option>)}
                </Select>
              )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout2}
                label="仓库"
              >
                {getFieldDecorator('warehouseNo', {
                  initialValue: warehouseNo ? warehouseNo * 1 : undefined,
                  rules: [{
                    required: true, message: '请选择仓库',
                  }],
              })(
                <Select size={config.InputSize} style={{ marginTop: 4 }} disabled>
                  { warehouses && warehouses.length && warehouses.map(ele => <Option key={ele.warehouseNo} value={ele.warehouseNo}>{ele.warehouseName}</Option>)}
                </Select>
              )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout1}
                label="运输模式"
              >
                {getFieldDecorator('transportMode', {
                  initialValue: transportMode ? transportMode * 1 : undefined,
                  rules: [{
                    required: true, message: '请选择运输模式',
                  }],
              })(
                <Select size={config.InputSize} style={{ marginTop: 4 }} placeholder="请选择运输模式">
                  <Option key={0} value={0}>汽运</Option>
                  <Option key={1} value={1}>空运</Option>
                </Select>
              )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout2}
                label="承运商"
              >
                {getFieldDecorator('expressCorpNo', {
                  initialValue: expressCorpNo ? expressCorpNo * 1 : undefined,
                  rules: [{
                    required: true, message: '请选择承运商',
                  }],
              })(
                <Select size={config.InputSize} style={{ marginTop: 4 }} placeholder={title}>
                  { expressCorps && expressCorps.length && expressCorps.map(ele => <Option key={ele.expressCorpNo} value={ele.expressCorpNo}>{ele.expressCorpName}</Option>)}
                </Select>
              )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout1}
                label="承运人电话"
              >
                {getFieldDecorator('expressTel', {
                  initialValue: expressTel,
                  rules: [{
                    required: true,
                    validator: this.checkMobile,
                  }],
              })(
                <Input size={config.InputSize}/>
              )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout2}
                label="承运单号"
              >
                {getFieldDecorator('expressNo', {
                  initialValue: expressNo,
                  rules: [{
                    required: true,
                    validator: this.checkBlank1,
                  }],
              })(
                <Input size={config.InputSize}/>
              )}
              </FormItem>
            </Col>
          </Row>
          <FormItem
            {...formItemLayout}
            label="送货时间"
          >
            {getFieldDecorator('deliveryTime', {
              initialValue: deliveryTime && moment(deliveryTime).format('YYYY-MM-DD') !== '1899-11-30' ?
              moment(moment(deliveryTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : undefined,
              rules: [{
                required: true, message: '请选择送货时间',
              },
              {
                validator: this.checkBeginTime,
              }],
          })(
            <DatePicker size={config.InputSize} onChange={this.onBegin} placeholder="送货时间" format="YYYY-MM-DD" />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="预计到货时间"
          >
            {getFieldDecorator('arrivalTime', {
              initialValue: arrivalTime && moment(arrivalTime).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ?
              moment(moment(arrivalTime).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss') : undefined,
              rules: [{
                required: true, message: '请选择预计到货时间',
              },
              {
                validator: this.checkEndTime,
              }],
          })(
            <DatePicker size={config.InputSize} onChange={this.onEnd} placeholder="预计到货时间" showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
          </FormItem>
          <Row style={{ marginTop: 2, marginBottom: 2 }}>
            <Col span={4} style={{ marginTop: 2, textAlign: 'right', marginBottom: 2 }} >
              <div style={{ color: '#2ABC56', marginTop: 2, marginBottom: 2 }}>可选的时间段：</div>
            </Col>
            <Col span={20} style={{ marginTop: 2, marginBottom: 2 }}>
              <div style={{ color: '#2ABC56', marginTop: 2, marginBottom: 2 }}>
                空运：9:00,12:00,16:00,18:00,23:59<Divider type="vertical" />汽运：2:00,9:00,12:00,15:00,16:00,19:00,20:00,22:00,23:59
              </div>
            </Col>
          </Row>
          <FormItem
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator('remark', {
              initialValue: remark,
          })(
            <Input size={config.InputSize} />
          )}
          </FormItem>
        </Form>
        {this.state.choosePO ? <ChoosePO {...POModalProps}/> : null}
      </Modal>
    )
  }
}
