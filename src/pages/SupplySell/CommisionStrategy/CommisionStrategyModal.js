/*
 * @Author: tanmengjia
 * @Date: 2018-01-23 15:28:11
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 08:49:58
 * 添加/编辑分销佣金策略
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Form, Input, Radio, Col, Row, Switch, DatePicker, message, Collapse, Checkbox, notification, InputNumber, Tooltip } from 'antd'
import config from '../../../utils/config'
import { saveCommisionStrategy } from '../../../services/supplySell/commisionStrategy'
import { moneyCheck10 } from '../../../utils/utils'

const RadioGroup = Radio.Group
const FormItem = Form.Item
// const Option = Select.Option
const Panel = Collapse.Panel
const CheckboxGroup = Checkbox.Group

@connect(state => ({
    commisionStrategy: state.commisionStrategy,
}))
@Form.create()
export default class CommisionStrategyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      radioValue: '0',
      isOpen: false,
      isOpen1: false,
      chooseLevel: [],
      chooseSell: [],
      checkSwitch: true,
      init: true,
      chooseLevel1: '',
      chooseSell1: '',
      begin: undefined,
      end: undefined,
      upperLimit: undefined,
      lowerLimit: undefined,
      isFirst: true,
    }
  }
  componentWillMount() {
    if (this.props.selectData) {
      this.props.dispatch({
        type: 'commisionStrategy/getChooseData',
        payload: {
          strategyNo: this.props.selectData.strategyNo,
        },
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.isFirst && nextProps.commisionStrategy.chooseData) {
      this.setState({
        chooseLevel1: nextProps.commisionStrategy.chooseData.distributorNo ? nextProps.commisionStrategy.chooseData.distributorNo : undefined,
        chooseSell1: nextProps.commisionStrategy.chooseData.distributorLevel ? nextProps.commisionStrategy.chooseData.distributorLevel : undefined,
        upperLimit: nextProps.commisionStrategy.chooseData.upperLimit ? nextProps.commisionStrategy.chooseData.upperLimit : undefined,
        lowerLimit: nextProps.commisionStrategy.chooseData.lowerLimit ? nextProps.commisionStrategy.chooseData.lowerLimit : undefined,
        begin: nextProps.commisionStrategy.chooseData.beginTime ? moment(nextProps.commisionStrategy.chooseData.beginTime).format('YYYY-MM-DD') : undefined,
        end: nextProps.commisionStrategy.chooseData.endTime ? moment(nextProps.commisionStrategy.chooseData.endTime).format('YYYY-MM-DD') : undefined,
      })
      if (nextProps.commisionStrategy.chooseData.balanceMode === 1) {
        this.setState({
          radioValue: '1',
        })
      }
      if (nextProps.commisionStrategy.chooseData.balanceValue > -1) {
        this.setState({
          value: nextProps.commisionStrategy.chooseData.balanceValue,
        })
      }
      const { enableStatus } = nextProps.commisionStrategy.chooseData
      if (this.state.init && enableStatus !== undefined) {
        this.setState({
          checkSwitch: enableStatus ? true : false,
          init: false,
          isFirst: false,
        })
      }
    }
  }
  onMinAmount = (e) => {
    this.setState({
      lowerLimit: e.target.value,
    })
  }
  onMaxAmount = (e) => {
    this.setState({
      upperLimit: e.target.value,
    })
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
  onChange1 = (e) => {
    this.setState({ value: e.target.value })
  }
  onSwitch = (checked) => {
    this.setState({
      checkSwitch: checked,
    })
  }
  choose = (e) => {
    if (e.length) {
      this.setState({ isOpen1: true, chooseLevel: e, chooseSell: [] })
    } else {
      this.setState({ isOpen1: false, chooseLevel: e })
    }
  }
  choose1 = (e) => {
    if (e.length) {
      this.setState({ isOpen: true, chooseSell: e, chooseLevel: [] })
    } else {
      this.setState({ isOpen: false, chooseSell: e })
    }
  }
  radioChange = (e) => {
    this.setState({ radioValue: e.target.value })
    this.setState({ value: [] })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
    this.setState({
      isOpen: false,
      isOpen1: false,
      chooseLevel: [],
      chooseSell: [],
      init: true,
      checkSwitch: true,
    })
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if ((this.state.chooseLevel && this.state.chooseLevel.length) | (this.state.chooseSell && this.state.chooseSell.length) | this.state.chooseSell1 > -1 | this.state.chooseLevel1 > -1) {
          if (values.balanceMode * 1 === 1) {
            if (!/^([1]|[0]|([0]\.\d{1,2}))$/.test(this.state.value)) {
              message.error('请输入正确的比例')
              this.setState({ value: [] })
            } else {
              Object.assign(values, { beginTime: moment(values.beginTime).format('YYYY-MM-DD'), endTime: moment(values.endTime).format('YYYY-MM-DD') })
              Object.assign(values, { enableStatus: this.state.checkSwitch ? 1 : 0 })
              const distributorName1 = []
              if (!(this.props.commisionStrategy.chooseData && this.props.commisionStrategy.chooseData.strategyNo)) {
                if (this.state.chooseSell.length && this.state.chooseSell) {
                  this.state.chooseSell.forEach((ele) => {
                    distributorName1.push(this.props.distributor.filter(row => row.distributorNo * 1 === ele * 1)[0].distributorName)
                  })
                }
                const dislevel = this.state.chooseLevel.join(',')
                const disNo = this.state.chooseSell.join(',')
                const disName = distributorName1 && distributorName1.length ? distributorName1.join(',') : ''
                Object.assign(values, { distributorLevels: dislevel, distributorNos: disNo, distributorName: disName })
              }
              Object.assign(values, { balanceValue: this.state.value })
              if (this.props.commisionStrategy.chooseData && this.props.commisionStrategy.chooseData.strategyNo) {
                Object.assign(values, { strategyNo: this.props.commisionStrategy.chooseData.strategyNo })
              }
              saveCommisionStrategy(values).then((json) => {
                if (json) {
                  notification.success({
                    message: '操作成功',
                  })
                  this.props.form.resetFields()
                  this.props.itemModalHidden()
                  this.props.dispatch({ type: 'commisionStrategy/search' })
                  this.setState({
                    isOpen: false,
                    isOpen1: false,
                    chooseLevel: [],
                    chooseSell: [],
                    init: true,
                    checkSwitch: true,
                  })
                }
              })
            }
          } else if (values.balanceMode * 1 === 0) {
            if (!/^(([0-9])|([1-9]\d{0,6}[0-9])|(([0-9]\.\d{1,2}|[1-9]\d{0,6}[0-9]\.\d{1,2})))$/.test(this.state.value)) {
              message.error('固定金额格式错误或长度过大')
              this.setState({ value: [] })
            } else {
              Object.assign(values, { beginTime: moment(values.beginTime).format('YYYY-MM-DD'), endTime: moment(values.endTime).format('YYYY-MM-DD') })
              Object.assign(values, { enableStatus: this.state.checkSwitch ? 1 : 0 })
              const distributorName1 = []
              if (!(this.props.commisionStrategy.chooseData && this.props.commisionStrategy.chooseData.strategyNo > -1)) {
                if (this.state.chooseSell.length && this.state.chooseSell) {
                  this.state.chooseSell.forEach((ele) => {
                    distributorName1.push(this.props.distributor.filter(row => row.distributorNo * 1 === ele * 1)[0].distributorName)
                  })
                }
                const dislevel = this.state.chooseLevel.join(',')
                const disNo = this.state.chooseSell.join(',')
                const disName = distributorName1 && distributorName1.length ? distributorName1.join(',') : ''
                Object.assign(values, { distributorLevels: dislevel, distributorNos: disNo, distributorName: disName })
              }
              if (!values.lowerLimit) {
                Object.assign(values, { lowerLimit: 0 })
              }
              if (!values.upperLimit) {
                Object.assign(values, { upperLimit: 0 })
              }
              Object.assign(values, { balanceValue: this.state.value })
              if (this.props.commisionStrategy.chooseData && this.props.commisionStrategy.chooseData.strategyNo > -1) {
                Object.assign(values, { strategyNo: this.props.commisionStrategy.chooseData.strategyNo })
              }
              saveCommisionStrategy(values).then((json) => {
                if (json) {
                  notification.success({
                    message: '操作成功',
                  })
                  this.props.form.resetFields()
                  this.props.itemModalHidden()
                  this.props.dispatch({ type: 'commisionStrategy/search' })
                  this.setState({
                    isOpen: false,
                    isOpen1: false,
                    chooseLevel: [],
                    chooseSell: [],
                    init: true,
                    checkSwitch: true,
                  })
                }
              })
            }
          }
        } else {
          message.error('请至少选择一个分销等级或分销商')
        }
      }
    })
  }

  checkBeginTime = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.end && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) > new Date(this.state.end.replace(/-/g, '\/'))) {
      callback('开始日期必须小于等于结束日期')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const endTime = getFieldValue('endTime')
      resetFields('endTime')
      setFieldsValue({ endTime })
      callback()
    }
  }
  checkEndTime = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.begin && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) < new Date(this.state.begin.replace(/-/g, '\/'))) {
      callback('结束日期必须大于等于开始日期')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const beginTime = getFieldValue('beginTime')
      resetFields('creditTime')
      setFieldsValue({ beginTime })
      callback()
    }
  }
  checkMaxAmount = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (!moneyCheck10(value)) {
      callback('错误的金额格式或长度过大')
    } else if ((this.state.lowerLimit * 1) && (value * 1) < (this.state.lowerLimit * 1)) {
      callback('最大金额必须大于等于最小金额')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const lowerLimit = getFieldValue('lowerLimit')
      resetFields('lowerLimit')
      setFieldsValue({ lowerLimit })
      callback()
    }
  }
  checkMinAmount = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (!moneyCheck10(value)) {
      callback('错误的金额格式或长度过大')
    } else if ((this.state.upperLimit * 1) && (value * 1) > (this.state.upperLimit * 1)) {
      callback('最小金额必须小于等于最大金额')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const upperLimit = getFieldValue('upperLimit')
      resetFields('upperLimit')
      setFieldsValue({ upperLimit })
      callback()
    }
  }
  checkBlank = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('名称不能输入空格')
      } else {
        callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {
      strategyName,
      beginTime,
      endTime,
      upperLimit,
      lowerLimit,
      priorityLevel,
      balanceType,
      balanceMode,
      strategyNo,
      distributorName,
      distributorLevel,
    } = this.props.commisionStrategy.chooseData ? this.props.commisionStrategy.chooseData : ''
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    const formItemLayout3 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 6 },
      },
    }
    const formItemLayout1 = {
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
    const formItemLayout4 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 0 },
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
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 6 },
      },
    }
    const customPanelStyle = {
      border: 0,
      overflow: 'hidden',
    }
    const text = (
      <div>
        <div>依照订单应付金额的比例</div>
        <div>请输入小数,比如0.1=10%佣金</div>
      </div>
    )
    const text1 = (
      <div>
        <div>如果是现结,指的是下单时间</div>
        <div>如果是定期结算,则指结算时间</div>
      </div>
    )
    const text2 = (
      <div>
        <div>如果是现结,指的是订单应付金额</div>
        <div>如果是定期结算,则汇总后的总金额为空或者为0则不计算</div>
      </div>
    )
    const text3 = (
      <Tooltip placement="top" title={text1}><span style={{ color: 'red' }}>？</span>有效时间</Tooltip>
    )
    return (
      <div>
        <Modal
          maskClosable={false}
          title={this.props.add ?
            '添加佣金策略'
            :
            <div>编辑佣金策略（{distributorName ? distributorName
              :
            <span>{distributorLevel}级分销商</span>}）
            </div>}
          visible={this.props.itemModalVisiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          width={1000}
          key="997"
        >
          <Form
            key="996"
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('strategyName', {
                initialValue: strategyName,
                rules: [{
                  required: true, message: '请输入名称',
                },
                {
                  validator: this.checkBlank,
                }],
            })(
              <Input size={config.InputSize} maxLength="50" />
            )}
            </FormItem>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout1}
                  label={text3}
                >
                  {getFieldDecorator('beginTime', {
                    initialValue: beginTime && moment(beginTime).format('YYYY-MM-DD') !== '1899-11-30' ? moment(moment(beginTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : undefined,
                    rules: [{
                      required: true, message: '请选择有效开始时间',
                    }, {
                      validator: this.checkBeginTime,
                    }],
                })(
                  <DatePicker onChange={this.onBegin} size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout4}
                  label=""
                >
                  {getFieldDecorator('endTime', {
                    initialValue: endTime && moment(endTime).format('YYYY-MM-DD') !== '1899-11-30' ? moment(moment(endTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : undefined,
                    rules: [{
                      required: true, message: '请选择有效结束时间',
                    }, {
                      validator: this.checkEndTime,
                    }],
                })(
                  <DatePicker onChange={this.onEnd} size={config.InputSize} />
                )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout1}
                  label="金额范围"
                >
                  <Tooltip placement="top" title={text2}>
                    {getFieldDecorator('lowerLimit', {
                      initialValue: lowerLimit,
                      rules: [{
                        validator: this.checkMinAmount,
                      }],
                      // {
                      //   required: true, message: '请输入金额',
                      // }, 
                  })(
                    <Input size={config.InputSize} onChange={this.onMinAmount} />
                  )}
                  </Tooltip>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout4}
                  label=""
                >
                  <Tooltip placement="top" title={text2}>
                    {getFieldDecorator('upperLimit', {
                      initialValue: upperLimit,
                      rules: [ {
                        validator: this.checkMaxAmount,
                      }],
                      // {
                      //   required: true, message: '请输入金额',
                      // },
                  })(
                    <Input size={config.InputSize} onChange={this.onMaxAmount} />
                  )}
                  </Tooltip>
                </FormItem>
              </Col>
            </Row>
            <FormItem
              {...formItemLayout2}
              label="优先级"
            >
              <Tooltip placement="top" title="数字越小,优先级越高">
                {getFieldDecorator('priorityLevel', {
                  initialValue: priorityLevel,
                  rules: [{
                    required: true, message: '请输入优先级',
                  }],
              })(
                <InputNumber size={config.InputSize} max={127} min={0} />
              )}
              </Tooltip>
            </FormItem>
            {strategyNo ? '' :
            <Collapse bordered={false} key="993" defaultActiveKey={['994', '995']}>
              <Panel header={<div><span style={{ color: 'red' }}>*</span>指定分销等级</div>} key="995" style={customPanelStyle} >
                <CheckboxGroup onChange={this.choose} value={this.state.chooseLevel} disabled={this.state.isOpen} key="992">
                  <Checkbox value="1" disabled={this.props.fxLevelMax < 1}>1级分销商</Checkbox>
                  <Checkbox value="2" disabled={this.props.fxLevelMax < 2}>2级分销商</Checkbox>
                  <Checkbox value="3" disabled={this.props.fxLevelMax < 3}>3级分销商</Checkbox>
                  <Checkbox value="4" disabled={this.props.fxLevelMax < 4}>4级分销商</Checkbox>
                  <Checkbox value="5" disabled={this.props.fxLevelMax < 5}>5级分销商</Checkbox>
                </CheckboxGroup>
              </Panel>
              <Panel header={<div><span style={{ color: 'red' }}>*</span>指定分销商</div>} key="994" style={customPanelStyle} >
                <CheckboxGroup onChange={this.choose1} value={this.state.chooseSell} disabled={this.state.isOpen1} style={{ width: '100%' }}>
                  { this.props.distributor && this.props.distributor.length ? this.props.distributor.map((ele) => {
                  return (
                    <Col span={6} key={ele.distributorNo}><Checkbox value={ele.distributorNo} >{ele.distributorName}</Checkbox></Col>
                  )
                  })
                  :
                  <div>无分销商</div>
                  }
                </CheckboxGroup>
              </Panel>
            </Collapse>
            }
            <FormItem
              {...formItemLayout}
              label="结算类型"
            >
              {getFieldDecorator('balanceType', {
                initialValue: balanceType > -1 ? String(balanceType) : '',
                rules: [{
                  required: true, message: '请选择结算类型',
                }],
            })(
              <RadioGroup>
                <Col span={13}><Radio value="0"><Tooltip placement="top" title="直接作为优惠金额减少订单的应付金额"><span style={{ color: 'red' }}>？</span>订单现结佣金</Tooltip></Radio></Col>
                <Col span={13}><Radio value="1"><Tooltip placement="top" title="直接作为优惠金额(优惠金额可能为负)增加订单的应付金额"><span style={{ color: 'red' }}>？</span>订单现结费用</Tooltip></Radio></Col>
                <Col span={13}><Radio value="2"><Tooltip placement="top" title="通过定期结算生成佣金，直接充值到分销商的账户余额中"><span style={{ color: 'red' }}>？</span>定期结算佣金</Tooltip></Radio></Col>
                <Col span={13}><Radio value="3"><Tooltip placement="top" title="既可现结佣金又可定期结算，实现佣金重复计算"><span style={{ color: 'red' }}>？</span>定期结算+现结佣金</Tooltip></Radio></Col>
              </RadioGroup>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout3}
              label="结算方式"
            >
              {getFieldDecorator('balanceMode', {
                initialValue: balanceMode > -1 ? String(balanceMode) : this.state.radioValue,
            })(
              <RadioGroup onChange={this.radioChange}>
                <Col span={13}>
                  <Radio value="0">
                    固定金额
                    <Input
                      style={{ marginLeft: 20 }}
                      size="small" disabled={(this.state.radioValue * 1) ? true : false}
                      onChange={this.onChange1} validator={this.valueCheck1}
                      value={(this.state.radioValue * 1) ? '' : this.state.value}
                    />
                  </Radio>
                </Col>
                {/* balance_value */}
                <Col span={13}>
                  <Radio value="1">按比例
                    <Tooltip placement="top" title={text}>
                      <Input
                      style={{ marginLeft: 32 }}
                      size="small"
                      disabled={(this.state.radioValue * 1) ? false : true}
                      onChange={this.onChange1}
                      validator={this.valueCheck}
                      placeholder="比例"
                      value={(this.state.radioValue * 1) ? this.state.value : ''}
                    />
                    </Tooltip>
                  </Radio>
                </Col>
              </RadioGroup>
            )}
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
      </div>)
  }
}
