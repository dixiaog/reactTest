/*
 * @Author: tanmengjia
 * @Date: 2018-01-23 14:00:19
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-04 13:32:22
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Form, Input, Radio, notification, Col, Tooltip, Button, DatePicker, Collapse, Table, Checkbox, Row, message, InputNumber } from 'antd'
import config from '../../../utils/config'
import ChooseItem from '../../../components/ChooseItem/index'
import { save } from '../../../services/supplySell/priceStrategy'
import styles from '../SupplySell.less'

const RadioGroup = Radio.Group
const FormItem = Form.Item
const Panel = Collapse.Panel
const CheckboxGroup = Checkbox.Group

@connect(state => ({
    priceStrategy: state.priceStrategy,
    // strategyModal: state.strategyModal,
}))
@Form.create()
export default class StrategyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      specifyType: '0',
      chooseSell: [],
      isOpen: false,
      isOpen1: false,
      distributor: [],
      dataSource: [],
      two: false,
      isFirst: true,
      selectedRowKeys: [],
      discount: false,
      setMoney: false,
      moneyValue: '',
      discountValue: '',
      begin: undefined,
      end: undefined,
      isFirst1: true,
    }
  }
  componentWillMount() {
    if (this.props.selectData) {
      this.props.dispatch({
        type: 'priceStrategy/getChooseData',
        payload: this.props.selectData.strategyNo,
      })
    }
    this.setState({
      distributor: this.props.distributor,
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.priceStrategy.chooseData && nextProps.priceStrategy.chooseData.strategyNo > -1 && this.state.isFirst1) {
      if (nextProps.priceStrategy.chooseData.specifyDistributor[0] * 1 === 0) {
        this.setState({
          chooseSell: ['0'],
          isOpen: true,
          // oldData: [],
          isFirst1: false,
        })
      } else {
        this.setState({
          chooseSell: nextProps.priceStrategy.chooseData.specifyDistributor ? nextProps.priceStrategy.chooseData.specifyDistributor.split(',') : null,
          isFirst1: false,
        })
      }
      this.setState({
        specifyType: String(nextProps.priceStrategy.chooseData.specifyType),
        isOpen1: true,
      })
    }
    if (nextProps.childs && nextProps.childs.length && this.state.isFirst) {
      this.setState({
        isFirst: false,
        dataSource: nextProps.childs,
      }, () => {
        const dataSource1 = this.state.dataSource
        dataSource1.forEach((ele) => {
          Object.assign(ele, { product: ele.productName.concat('/', ele.productSpec) })
        })
        this.setState({
          dataSource: dataSource1,
        })
      })
    }
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
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
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
  }
  cancelDiscount = () => {
    this.setState({
      discount: false,
      discountValue: '',
    })
  }
  cancelMoney = () => {
    this.setState({
      setMoney: false,
      moneyValue: '',
    })
  }
  okDiscount = () => {
    if (this.state.discountValue === '') {
      message.error('请输入折扣')
    } else if (!/^0\.(0[1-9]|[1-9]{1,2})$/.test(this.state.discountValue)) {
      message.error('请输入正确的折扣格式')
    } else {
      this.state.selectedRowKeys.forEach((ele) => {
        Object.assign(this.state.dataSource.filter(row => row.autoNo * 1 === ele * 1)[0],
                      { specifyPrice: this.state.discountValue * this.state.dataSource.filter(row => row.autoNo * 1 === ele * 1)[0].retailPrice })
      })
      this.setState({
        discount: false,
        discountValue: '',
      })
    }
  }
  okMoney = () => {
    if (this.state.moneyValue === '') {
      message.error('请输入供销价格')
    } else if (!/^(([1-9])|([1-9]\d{0,4}[0-9])|(([0-9]\.\d{1,2}|[1-9]\d{0,4}[0-9]\.\d{1,2})))$/.test(this.state.moneyValue)) {
      message.error('价格格式错误或长度过长')
    } else {
      this.state.selectedRowKeys.forEach((ele) => {
        Object.assign(this.state.dataSource.filter(row => row.autoNo * 1 === ele * 1)[0], { specifyPrice: this.state.moneyValue })
        // this.state.dataSource.filter(row => row.autoNo * 1 === ele * 1)[0]
      })
      this.setState({
        setMoney: false,
        moneyValue: '',
      })
    }
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // Object.assign(values, { beginTm: this.props.distributor.filter(row => row.distributorNo * 1 === values.distributorNo * 1)[0].distributorName })
        Object.assign(values, { specifyType: this.state.specifyType })
        Object.assign(values, { beginTime: moment(values.beginTime).format('YYYY-MM-DD'), endTime: moment(values.endTime).format('YYYY-MM-DD') })
        if (this.props.priceStrategy.chooseData && this.props.priceStrategy.chooseData.strategyNo > -1) {
          Object.assign(values, { strategyNo: this.props.priceStrategy.chooseData.strategyNo })
        }
        Object.assign(values, { list: this.state.dataSource })
        let isNull = false
        if (!isNull) {
          this.state.dataSource.forEach((ele) => {
            if (!(ele.specifyPrice * 1 > 0)) {
              isNull = true
            }
          })
        }
        let isYes = true
        if (!(this.state.chooseSell && this.state.chooseSell.length)) {
          isYes = false
          message.error('请选择分销商')
        } else if (this.state.chooseSell !== '0') {
          Object.assign(values, { specifyDistributor: this.state.chooseSell.join(',') })
        } else {
          Object.assign(values, { specifyDistributor: this.state.chooseSell })
        }
        if (!isNull) {
          if (isYes) {
            save(values).then((json) => {
              if (json) {
                notification.success({
                  message: '操作成功',
                })
                this.props.form.resetFields()
                this.props.itemModalHidden()
                this.props.dispatch({ type: 'priceStrategy/search' })
              }
            })
          }
        } else {
          message.error('指定价格不能为空')
        }
      }
    })
  }
  chooseModalHidden = () => {
    this.setState({
      two: false,
    })
  }
  choose2 = (e) => {
    this.setState({
      specifyType: e.target.value,
    })
  }
  choose1 = (e) => {
    if (e.filter(ele => ele * 1 === 0).length > 0) {
      this.setState({ chooseSell: e.filter(ele => ele * 1 === 0), isOpen: true })
    } else {
      this.setState({ chooseSell: e, isOpen: false })
    }
  }
  choose = (value, keys, callback) => {
    callback()
    if (this.state.specifyType * 1 === 0) {
      let add = value
      this.state.dataSource.forEach((ele) => {
        add = add.filter(e => e.skuNo !== ele.skuNo)
        // this.setState({
        //   dataSource: this.state.dataSource.concat(ele),
        // })
      })
      this.setState({
        dataSource: this.state.dataSource.concat(add),
      }, () => {
        const dataSource1 = this.state.dataSource
        dataSource1.forEach((ele) => {
          Object.assign(ele, { product: ele.productName.concat('/', ele.productSpec) })
        })
        this.setState({
          dataSource: dataSource1,
        })
      })
    } else if (this.state.specifyType * 1 === 1) {
      const set = new Set(value.map(e => e.productNo))
      const newSet = [...set]
      const add2 = []
      value.forEach((row) => {
        if (newSet.indexOf(row.productNo) > -1) {
          const findIndex = newSet.findIndex(e => e === row.productNo)
          newSet.splice(findIndex, 1)
          add2.push(row)
        }
      })
      let add1 = add2
      this.state.dataSource.forEach((ele) => {
        add1 = add1.filter(e => e.productNo !== ele.productNo)
      })
      this.setState({
        dataSource: this.state.dataSource.concat(add1),
      }, () => {
        const dataSource1 = this.state.dataSource
        dataSource1.forEach((ele) => {
          Object.assign(ele, { product: ele.productName.concat('/', ele.productSpec) })
        })
        this.setState({
          dataSource: dataSource1,
        })
      })
    }
    this.setState({
      isOpen1: true,
    })
  }
  allDelete = () => {
    if (this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
      let del = this.state.dataSource
      this.state.selectedRowKeys.forEach((ele) => {
        del = del.filter(e => e.autoNo !== ele)
      })
      this.setState({
        dataSource: del,
        selectedRowKeys: [],
      })
    } else {
      message.error('请勾选需要批量删除的商品信息')
    }
  }
  changeDiscount = (e) => {
    this.setState({
      discountValue: e.target.value,
    })
  }
  changeMoney = (e) => {
    this.setState({
      moneyValue: e.target.value,
    })
  }
  checkBeginTime = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.end && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) > new Date(this.state.end.replace(/-/g, '\/'))) {
      callback('开始日期必须小于或等于结束日期')
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
      // new Date(d1.replace(/-/g,"\/")) > new Date(d2.replace(/-/g,"\/")
    } else if (this.state.begin && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) < new Date(this.state.begin.replace(/-/g, '\/'))) {
      callback('结束日期必须大于或等于开始日期')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const beginTime = getFieldValue('beginTime')
      resetFields('creditTime')
      setFieldsValue({ beginTime })
      callback()
    }
  }
  checkBlank = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('策略名称不能输入空格')
    } else if (value.length > 50) {
      callback('策略名称长度过大')
    } else {
      callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { strategyName, priorityLevel, timeType, beginTime, endTime } = this.props.priceStrategy.chooseData ? this.props.priceStrategy.chooseData : ''
    const columns = [{
      title: (<div style={{ color: 'red' }}>商品编码</div>),
      dataIndex: 'skuNo',
      key: 'skuNo',
      width: 100,
    }, {
      title: '款式编码(货号)',
      dataIndex: 'productNo',
      key: 'productNo',
      width: 100,
    }, {
      title: '名称/颜色规格',
      dataIndex: 'product',
      key: 'product',
      width: 100,
    }, {
      title: (<div style={{ color: 'red' }}>指定价格</div>),
      dataIndex: 'specifyPrice',
      key: 'specifyPrice',
      width: 100,
    }]
    const columns1 = [{
      title: (<div style={{ color: 'red' }}>款式编码(货号)</div>),
      dataIndex: 'productNo',
      key: 'productNo',
      width: 100,
    }, {
      title: '名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 100,
    }, {
      title: (<div style={{ color: 'red' }}>指定价格</div>),
      dataIndex: 'specifyPrice',
      key: 'specifyPrice',
      width: 100,
    }]
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
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
        sm: { span: 3 },
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
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
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
    const customPanelStyle = {
      border: 0,
      overflow: 'hidden',
    }
    const titleText = (
      // <div>指定分销商<Input size={config.InputSize} style={{ width: '100px', marginLeft: '10px' }} /></div>
      <div><a style={{ color: 'red' }}>*</a>指定分销商</div>
    )
    return (
      <div>
        <Modal
          maskClosable={false}
          title={this.props.add ? '新增策略' : '编辑策略'}
          visible={this.props.itemModalVisiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          // bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          width={1000}
          key="997"
        >
          <Form
            key="996"
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="策略名称"
            >
              {getFieldDecorator('strategyName', {
                initialValue: strategyName,
                rules: [{
                  required: true, message: '请输入策略名称',
                },
                {
                  validator: this.checkBlank,
                }],
            })(
              <Input size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout2}
              label="优先级"
            >
              {getFieldDecorator('priorityLevel', {
                initialValue: priorityLevel,
                rules: [{
                  required: true,
                  message: '请输入优先级',
                }],
            })(
              // <Input size={config.InputSize} />
              <InputNumber min={1} max={127} size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="有效时间范围"
            >
              {getFieldDecorator('timeType', {
                initialValue: timeType > -1 ? String(timeType) : '',
                rules: [{
                  required: true,
                  message: '请选择类型',
                }],
            })(
              <RadioGroup>
                <Radio value="0"><Tooltip title="指线上客户下单的时间"><a style={{ color: 'red' }}>？</a>参考下单时间</Tooltip></Radio>
                <Radio value="1"><Tooltip title="指线上客户在线付款的时间"><a style={{ color: 'red' }}>？</a>参考付款时间</Tooltip></Radio>
                <Radio value="2"><Tooltip title="指分销商审核订单，订单推送到供销商时间。如果反复推送，每次推送重新计算"><a style={{ color: 'red' }}>？</a>参考分销审核推送时间</Tooltip></Radio>
              </RadioGroup>
            )}
            </FormItem>
            <Row>
              <Col span={3}><div /></Col>
              <Col span={4}>
                <FormItem
                  {...formItemLayout1}
                  label=""
                >
                  {getFieldDecorator('beginTime', {
                    initialValue: beginTime && moment(beginTime).format('YYYY-MM-DD') !== '1899-11-30' ? moment(moment(beginTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : undefined,
                    rules: [{
                      required: true, message: '请选择开始时间',
                    }, {
                      validator: this.checkBeginTime,
                    }],
                })(
                  // <Input size={config.InputSize} />
                  <DatePicker onChange={this.onBegin} size={config.InputSize} placeholder="开始时间" />
                )}
                </FormItem>
              </Col>
              <Col span={1}><div /></Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout4}
                  label=""
                >
                  {getFieldDecorator('endTime', {
                    initialValue: endTime && moment(endTime).format('YYYY-MM-DD') !== '1899-11-30' ? moment(moment(endTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : undefined,
                    rules: [{
                      required: true, message: '请选择结束时间',
                    }, {
                      validator: this.checkEndTime,
                    }],
                })(
                  // <Input size={config.InputSize} />
                  <DatePicker onChange={this.onEnd} size={config.InputSize} placeholder="结束时间" />
                )}
                </FormItem>
              </Col>
            </Row>
            <Collapse bordered={false} key="993" defaultActiveKey={['994', '995']}>
              <Panel header={titleText} key="994" style={customPanelStyle} >
                <CheckboxGroup onChange={this.choose1.bind(this)} value={this.state.chooseSell} key="978" style={{ width: '100%' }}>
                  <Col span={24} key="0"><Checkbox value="0" >所有分销商</Checkbox></Col>
                  { this.state.distributor && this.state.distributor.length ? this.state.distributor.map((ele) => {
                  return (
                    <Col span={6} key={ele.distributorNo}><Checkbox value={String(ele.distributorNo)} disabled={this.state.isOpen} >{ele.distributorName}</Checkbox></Col>
                  )
                  })
                  : []}
                </CheckboxGroup>
              </Panel>
              <Panel header="指定分销价格" key="995" style={customPanelStyle} >
                <RadioGroup onChange={this.choose2} value={this.state.specifyType} disabled={this.state.isOpen1} key="992">
                  <Radio value="0">按颜色规格(商品编码)指定，不同子商品允许不同的分销价格</Radio>
                  <Radio value="1">按款式(货号)指定，同款商品统一分销价格</Radio>
                </RadioGroup>
              </Panel>
            </Collapse>
          </Form>
          <br />
          <div style={{ marginLeft: '20px' }} className={styles.tabelToolbarItem} >
            <Button type="primary" size="small" onClick={() => { this.setState({ two: true }) }}>添加商品</Button>
            <Button type="primary" size="small" onClick={() => { this.setState({ setMoney: true }) }} disabled={this.state.selectedRowKeys.length === 0}>批量设价格</Button>
            <Button type="primary" size="small" onClick={() => { this.setState({ discount: true }) }} disabled={this.state.selectedRowKeys.length === 0}>批量设折扣</Button>
            <Button type="primary" size="small" onClick={this.allDelete}>批量删除</Button>
          </div>
          <Table style={{ marginLeft: '20px' }}
            size="middle"
            rowKey={record => record.autoNo}
            rowSelection={rowSelection}
            dataSource={this.state.dataSource}
            columns={this.state.specifyType === '0' ? columns : columns1} />
        </Modal>
        { this.state.two ? <ChooseItem changeModalVisiable={this.state.two}
                            fromName="strategyModal"
                            itemModalHidden={this.chooseModalHidden}
                            choose={this.choose}
                            enableStatus="1"
                            haveData={this.state.dataSource}
                            specifyType={this.state.specifyType} /> : null }
        <Modal
          maskClosable={false}
          title="提示!"
          visible={this.state.discount}
          onOk={this.okDiscount}
          onCancel={this.cancelDiscount}
          // bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          key="967"
        >
          <div>
            <div>根据输入的折扣计算指定价格.(八折请输入0.8)</div>
            <br />
            <Input size="small" onChange={this.changeDiscount} value={this.state.discountValue} />
          </div>
        </Modal>
        <Modal
          maskClosable={false}
          title="提示!"
          visible={this.state.setMoney}
          onOk={this.okMoney}
          onCancel={this.cancelMoney}
          // bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          key="957"
        >
          <div>
            <div>请输入供销价格</div>
            <br />
            <Input size="small" onChange={this.changeMoney} value={this.state.moneyValue} />
          </div>
        </Modal>
      </div>
    )
  }
}
