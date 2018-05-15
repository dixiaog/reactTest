/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 14:31:55
 * 订单详情
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import numeral from 'numeral'
import moment from 'moment'
import update from 'immutability-helper'
import { message, Modal, Steps, Card, Form, Col, Row, Checkbox, Radio, Input, Button, Table, Popconfirm } from 'antd'
import styles from './index.less'
import { updatePaySingleReview, selectOrderNo, updateOrder, updateOrderReview,
  cancelAbnormal, insertOrderDInfo, updateOrderDeditor, deleteOrderD, selectOrderNoLog } from '../../services/order/search'
import AddressCas from '../AddressCas'
import AddGood from '../ChooseItem/index'
import CourierCompany from '../../pages/Order/SearchOrder/CourierCompany'
import BillAbnormal from '../../pages/Order/SearchOrder/BillAbnormal'
import BillCancel from '../../pages/Order/SearchOrder/BillCancel'
import Payment from '../../pages/Order/SearchOrder/Payment'
import ChangePay from '../../pages/Order/SearchOrder/ChangePay'
import { checkNumeral } from '../../utils/utils'
import ShowImg from '../ShowImg'

const EditableCell = ({ editable, value, onChange, save }) => (
  <div>
    {editable
      ? <Input
          onPressEnter={save}
          maxLength="8"
          defaultValue={value.props.children[1].toString().indexOf(',') ? value.props.children[1].toString().replace(/,/g, '') : value.props.children[1]}
          style={{ margin: '-5px 0' }}
          onChange={e => onChange(e.target.value)}
        />
      : value
    }
  </div>
)
const Step = Steps.Step
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const { TextArea } = Input

@Form.create()
@connect(state => ({
  orderDetail: state.orderDetail,
  search: state.search,
  chooseItem: state.chooseItem,
}))
export default class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      phone: '',
      telNo: '',
      data: [],
      dataCopy: [],
      noClick: false,
      expressAmount: '',
      showModal: false,
      courierCompany: false,
      sellerRemark: '',
      expressCorpName: '',
      expressCorpNo: null,
      status: true,
      sure: false,
      loadingSure: false,
      orderStatus: null,
      warehouse: {},
      noAbnormal: false,
      cancelAbnormal: false,
      unable: false,
      billAbnormal: false,
      billCancel: false,
      abnormalName: '',
      init: true,
      initData: true,
      orderAmount: 0, // 订单总金额
      expressNum: 0,
      orderAmountT: 0, // 总金额=订单总金额 + 运费
      preferential: 0, // 优惠金额
      payment: false,
      payValue: [], // 支付情况
      buttonStatus: null,
      money: false,
      actualPayment: null,
      invoiceType: [],
      youhui: 0,
      listLog: [],
      invoiceTaxNo: '',
      orderStatusT: null,
      changePay: false,
      ele: {},
    }
    this.columns = [{
      title: '图片',
      dataIndex: 'productImage',
      key: 'productImage',
      width: 80,
      render: (text, record) => {
        return (
          <ShowImg record={record} />
        )
      },
    }, {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 350,
      render: (text, record) => {
        if (record.isGift === 0) {
          return (
          <div>
            <div style={{ fontSize: 14 }}>{text}</div>
            <div>
              <span style={{ marginRight: 15, color: '#999' }}>{record.productNo}</span>
              <span style={{ marginRight: 15 }}>{record.skuNo}</span>
              <span style={{ color: '#999' }}>{record.productSpec}</span>
            </div>
          </div>
          )
         } else {
           return (
            <div>
              <div><span className={styles.spanCircle}>赠</span><span style={{ fontSize: 14 }}>{text}</span></div>
              <div style={{ marginTop: 5 }}>
                <span style={{ marginRight: 15, color: '#999' }}>{record.productNo}</span>
                <span style={{ marginRight: 15 }}>{record.skuNo}</span>
                <span style={{ color: '#999' }}>{record.productSpec}</span>
              </div>
            </div>
           )
         }
      },
    }, {
      title: <div>订单数量<div>(回车保存)</div></div>,
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 120,
      render: (text, record) => this.renderColumns(<div style={{ color: 'blue' }}>×{numeral(text).format('0,0')}</div>, record, 'orderNum'),
    }, {
      title: <div>单价<div>(回车保存)</div></div>,
      dataIndex: 'salePrice',
      key: 'salePrice',
      width: 120,
      render: (text, record) => {
        if (record.isGift === 0) {
         return this.renderColumns(<div style={{ color: 'red' }}>¥{numeral(text).format('0,0.00')}</div>, record, 'salePrice')
        } else {
          return <div style={{ color: 'red' }}>¥{numeral(text).format('0,0.00')}</div>
        }
      },
    }, {
      title: '原价',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      width: 120,
      render: (text) => {
        return `¥${numeral(text).format('0,0.00')}`
      },
    }, {
      title: '成交金额',
      dataIndex: 'saleAmount',
      key: 'saleAmount',
      width: 120,
      render: (text) => {
        return `¥${numeral(text).format('0,0.00')}`
      },
    }, {
      title: '可配货库存',
      dataIndex: 'waitNum',
      key: 'waitNum',
      width: 120,
      render: (text, record) => {
        const status = this.props.record.orderStatus
        if (status === 0 || status === 1 || status === 4 || status === 10) {
          const states = Number(record.inventoryNum) - Number(record.occupyNum) + Number(record.virtualNum) + Number(record.lockInventory) - (Number(record.lockNum) - Number(record.lockOccupyNum))
          return states
        } else {
          return 0
        }
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 140,
      render: (text, record) => {
        if (this.state.noClick) {
          return (
            <div className="editable-row-operations">
              <Popconfirm title="是否确认删除商品信息?" onConfirm={() => this.deleteSingleGood(record)}>
                <a>删除</a>
              </Popconfirm>
            </div>
          )
        } else {
          return '不可编辑'
        }
      },
    }]
    this.cacheData = this.state.data.map(item => ({ ...item }))
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.record.orderStatus === 0 || nextProps.record.orderStatus === 1 || nextProps.record.orderStatus === 4) {
      this.setState({
        money: true,
      })
    }
    if (this.state.initData && nextProps.orderDetail.list.length) {
      this.orderAmount(nextProps.orderDetail.list)
      this.payAmount(nextProps.orderDetail.list)
      this.preferential(nextProps.orderDetail.list)
      this.setState({
       data: nextProps.orderDetail.list,
       dataCopy: nextProps.orderDetail.list,
       initData: false,
     })
   }
    if (this.state.init && nextProps.record.orderNo) {
      this.orderAmount(nextProps.orderDetail.list)
      this.payAmount(nextProps.orderDetail.list)
      this.preferential(nextProps.orderDetail.list)
      let money = 0
      nextProps.record.listDmFund.forEach((ele) => {
        if (ele.status === 1) {
          money = money + ele.amount
        }
      })
      this.setState({
        listLog: nextProps.record.listLog,
        abnormalName: nextProps.record.abnormalName,
        init: false,
        noAbnormal: nextProps.record.orderStatus !== 4 || nextProps.record.moneyCheck,
        warehouse: { province: nextProps.record.province, city: nextProps.record.city, county: nextProps.record.county },
        expressNum: nextProps.record.expressAmount,
        orderAmountT: nextProps.record.expressAmount + nextProps.record.orderAmount,
        payValue: nextProps.record.listDmFund,
        actualPayment: money,
        invoiceType: nextProps.record.invoiceType !== 2 ? [nextProps.record.invoiceType] : [],
        youhui: nextProps.record.orderOrigin === 1 ? Number(nextProps.record.discountAmount) : Number(nextProps.record.commisionAmount), 
      })
      if ((nextProps.record.orderStatus === 0 || nextProps.record.orderStatus === 1 || nextProps.record.orderStatus === 4) && !(nextProps.record.moneyCheck)) {
        this.setState({
          noClick: true,
        })
      }
      if (nextProps.record.orderStatus !== undefined && this.state.status) {
        const orderStatus = nextProps.record.orderStatus
        let final = null
        if (orderStatus === 0) {
          final = 0
        } else if (orderStatus === 1) {
          final = 1
        } else if (orderStatus === 2) {
          final = 3
        } else if (orderStatus === 3) {
          final = 4
        } else if (orderStatus === 10) {
          final = 2
        }
        this.setState({
          sellerRemark: nextProps.record.sellerRemark,
          expressCorpName: nextProps.record.expressCorpName,
          expressCorpNo: nextProps.record.expressCorpNo,
          status: false,
          orderStatusT: final,
          orderStatus,
        })
      }
    }
  }
  // 设定快递公司
  setExpressCom = () => {
    this.setState({
      courierCompany: true,
    })
    this.props.dispatch({
      type: 'orderDetail/getExpresscorp',
    })
  }
  // 计算订单总金额
  orderAmount = (data) => {
    let orderAmount = 0
    data.forEach((ele) => {
      orderAmount = orderAmount + ele.saleAmount
    })
    this.setState({
      orderAmount,
    })
  }
  // 应支付金额
  payAmount = (data) => {
    let payAmount = 0
    let orderAmountT = 0
    data.forEach((ele) => {
      payAmount = payAmount + ele.orderNum * ele.salePrice
    })
    orderAmountT = Number(payAmount) + Number(this.state.expressNum)
    this.setState({
      orderAmountT,
    })
  }
  // 优惠金额
  preferential = (data) => {
    let preferential = 0
    data.forEach((ele) => {
      preferential = preferential + ele.orderNum * ele.retailPrice - ele.saleAmount
    })
    this.setState({
      preferential,
    })
  }
  orderStatus = (orderType) => {
    let final = null
    if (orderType === 0) {
      final = 0
    } else if (orderType === 1) {
      final = 1
    } else if (orderType === 2) {
      final = 3
    } else if (orderType === 3) {
      final = 4
    } else if (orderType === 10) {
      final = 2
    }
    this.setState({
      orderStatusT: final,
      orderStatus: orderType,
    })
  }
  // 取消异常标记
  cancelAbnormal = () => {
    this.setState({
      cancelAbnormal: true,
    })
    cancelAbnormal([this.props.record.orderNo]).then((json) => {
      if (json.review) {
        this.setState({
          noAbnormal: true,
          abnormalName: '',
        })
        this.selectOrderNoLog()
        message.success('取消异常标记成功')
        this.props.dispatch({
          type: 'search/search',
        })
      } else {
        message.warning(json.errorMessage)
      }
      this.setState({
        cancelAbnormal: false,
      })
    })
  }
  changePay = (status, e) => {
    this.setState({
      buttonStatus: status,
    })
    updatePaySingleReview({ status, autoNo: e.autoNo, innerNo: this.props.record.orderNo }).then((json) => {
      let money = 0
      if (json && json.review) {
        this.orderStatus(json.orderType)
        this.selectOrderNoLog()
        this.setState({
          payValue: json.listDm,
        })
        json.listDm.forEach((ele) => {
          if (ele.status === 1) {
            money = money + ele.amount
          }
        })
        this.setState({
          actualPayment: money,
        })
      }
      this.orderDetail()
      this.setState({
        buttonStatus: null,
      })
    })
  }
  // 获取省市区地址
  addrSelect = (selectedOptions) => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({
      provinceCC: selectedOptions,
    })
  }
  addGood = () => {
    this.setState({ showModal: true, unable: true })
    this.props.dispatch({
      type: 'chooseItem/changeState',
      payload: { searchParam: { enableStatus: '1' }, searchParamT: true, jt: true, forbid: this.props.search.forbidList },
    })
    this.props.dispatch({
      type: 'chooseItem/fetch',
      payload: { enableStatus: '1' },
    })
  }
  orderDetail = () => {
    selectOrderNo(this.props.record.orderNo).then((json) => {
      if (json) {
        this.setState({
          abnormalName: json.abnormalName,
        })
        if (json.abnormalName === '') {
          this.setState({
            noAbnormal: true,
          })
        } else {
          this.setState({
            noAbnormal: false,
          })
        }
        if (json.orderStatus === 0 || json.orderStatus === 1 || json.orderStatus === 4) {
          this.setState({
            noClick: true,
          })
        } else {
          this.setState({
            noClick: false,
          })
        }
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        })
        Object.assign(values, {
          province: values.provinceCC[0],
          city: values.provinceCC[1],
          county: values.provinceCC[2],
          expressCorpName: this.state.expressCorpName,
          expressCorpNo: this.state.expressCorpNo,
          orderNo: this.props.record.orderNo,
          // sellerRemark: this.state.sellerRemark,
          invoiceType: this.state.invoiceType[0] === 0 || this.state.invoiceType[0] === 1 ? this.state.invoiceType[0] : 2,
        })
        delete values.provinceCC
        updateOrder(values).then((json) => {
          if (json && json.review) {
            this.orderStatus()
            this.props.dispatch({
              type: 'search/search',
            })
            const orderAmountT = Number(this.state.orderAmount) + Number(this.props.form.getFieldValue('expressAmount'))
            this.setState({
              expressNum: this.props.form.getFieldValue('expressAmount'),
              orderAmountT,
            })
            this.selectOrderNoLog()
            message.success('保存订单基本信息成功')
            this.orderStatus(json.orderType)
          } else {
            message.error('保存订单基本信息失败')
          }
          this.setState({
            loading: false,
          })
        })
      }
    })
  }
  // 获取订单操作日志
  selectOrderNoLog = () => {
    selectOrderNoLog(this.props.record.orderNo).then((json) => {
      this.setState({
        listLog: json,
      })
    })
  }
  // 审核确认
  changeStatus = () => {
    this.setState({
      loadingSure: true,
    })
    updateOrderReview([this.props.record.orderNo]).then((json) => {
      if (json.review) {
        message.success('订单审核成功')
        this.selectOrderNoLog()
        this.setState({
          sure: true,
          orderStatus: json.orderType,
        })
      } else {
        message.warning(json.errorMessage)
      }
      this.setState({
        loadingSure: false,
      })
    })
  }
  // 删除单条商品
  deleteSingleGood = (record) => {
    deleteOrderD({
      orderNo: record.orderNo,
      autoNo: record.autoNo,
    }).then((json) => {
      if (json && json.review) {
        this.orderStatus(json.orderType)
        this.selectOrderNoLog()
        this.orderDetail()
        const index = this.state.data.findIndex(e => e.autoNo === record.autoNo)
        const newCollection = update(this.state.data, { $splice: [[index, 1]] })
        this.setState({
          data: newCollection,
          dataCopy: newCollection,
        })
        this.orderAmount(newCollection)
        this.payAmount(newCollection)
        this.preferential(newCollection)
        const keys = []
        const giftKey = []
        newCollection.forEach((ele) => {
          if (ele.isGift === 0) {
            keys.push(ele.skuNo)
          } else {
            giftKey.push(ele.skuNo)
          }
        })
        this.props.dispatch({
          type: 'orderDetail/changeState',
          payload: { initKey: keys, giftKey },
        })
      }
    })
  }
  // 关闭窗口
  hideModal = () => {
    const clearData = update(this.state.data, { $splice: [[0, this.state.data.length]] })
    this.setState({
      noClick: false,
      loading: false,
      status: true,
      orderStatus: null,
      rderStatusT: null,
      init: true,
      initData: true,
      warehouse: {},
      data: clearData,
      dataCopy: clearData,
      buttonStatus: null,
      money: false,
      phone: '',
      telNo: '',
      invoiceType: [],
    })
    this.handleReset()
    const { hideModal } = this.props
    hideModal()
    this.props.dispatch({
      type: 'orderDetail/changeState',
      payload: { list: [] },
    })
    if(!this.props.record.moneyCheck) {
      this.props.dispatch({
        type: 'search/search',
      })
    }
    this.props.dispatch({
      type: 'chooseItem/changeState',
      payload: { jt: false, forbid: [] },
    })
    this.props.form.setFields({
      mobileNo: {
        errors: '',
      },
    })
    this.props.form.setFields({
      telNo: {
        errors: '',
      },
    })
  }
  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }
  // 检测运费
  checkExpressAmount = (rule, value, callback) => {
    if (!value) {
      this.setState({
        expressAmount: '',
      })
      callback()
    } else if (value.toString().indexOf('.') !== -1 && value.toString().charAt(0) === '.') {
      this.setState({
        expressAmount: '运费不能以.开始',
      })
      callback('error')
    } else if (value.toString().indexOf('.') !== -1 && value.toString().charAt([value.length - 1]) === '.') {
      this.setState({
        expressAmount: '运费不能以.结尾',
      })
      callback('error')
    } else if (value.toString().indexOf('.') !== -1 && value.toString().split('.')[1].length > 2) {
      this.setState({
        expressAmount: '运费小数位不超2位',
      })
      callback('error')
    } else if (isNaN(value)) {
        this.setState({
          expressAmount: '运费请输入数字',
        })
        callback('error')
      } else if (value < 0) {
        this.setState({
          expressAmount: '运费不能小于0',
        })
        callback('error')
      } else if (value >= 100000) {
        this.setState({
          expressAmount: '运费必须小于100000',
        })
        callback('error')
      } else if (value.toString().indexOf(' ') !== -1) {
        this.setState({
          expressAmount: '运费不能输入空格',
        })
        callback('error')
      } else {
        this.setState({
          expressAmount: '',
        })
        callback()
    }
  }
  // 检验座机--TelNo
  checkTelNo = (rule, value, callback) => {
    const { getFieldValue, getFieldError } = this.props.form
    const mobileNo = getFieldValue('mobileNo')
    const errorM = getFieldError('mobileNo')
    if (!value && !mobileNo) {
      this.setState({
        telNo: '联系电话,联系手机必填一项',
        phone: '联系电话,联系手机必填一项',
      })
      callback('error')
      this.props.form.setFields({
        mobileNo: {
          value: '',
          errors: [new Error()],
        },
      })
    } else if (value && mobileNo && !(/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value))) {
        this.setState({
          telNo: '请输入正确的联系电话',
        })
        callback('error')
        this.props.form.setFields({
          mobileNo: {
            value: mobileNo,
            errors: errorM,
          },
        })
      } else if (value && !mobileNo && !(/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value))) {
        this.setState({
          telNo: '请输入正确的联系电话',
          phone: '',
        })
        callback('error')
        this.props.form.setFields({
          mobileNo: {
            value: '',
            errors: '',
          },
        })
      } else {
        this.setState({
          telNo: '',
        })
        callback()
        this.props.form.setFields({
          mobileNo: {
            value: mobileNo,
            errors: errorM,
          },
        })
    }
  }
  // 检验手机--MobileNo
  checkMobileNo = (rule, value, callback) => {
    const { getFieldValue, getFieldError } = this.props.form
    const errorM = getFieldError('telNo')
    const telNo = getFieldValue('telNo')
    if (!value && !telNo) {
      this.setState({
        telNo: '联系电话,联系手机必填一项',
        phone: '联系电话,联系手机必填一项',
      })
      callback('error')
      this.props.form.setFields({
        telNo: {
          value: '',
          errors: [new Error()],
        },
      })
    } else if (value && telNo && value.length !== 11) {
        this.setState({
          phone: '请输入11位手机号码',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: telNo,
            errors: errorM,
          },
        })
      } else if (value && !telNo && value.length !== 11) {
        this.setState({
          phone: '请输入11位手机号码',
          telNo: '',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: '',
            errors: '',
          },
        })
      } else if (value && telNo && !(/^1[345678]\d{9}$/.test(value))) {
        this.setState({
          phone: '请输入正确的手机号码',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: telNo,
            errors: errorM,
          },
        })
      } else if (value && !telNo && !(/^1[345678]\d{9}$/.test(value))) {
        this.setState({
          phone: '请输入正确的手机号码',
          telNo: '',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: '',
            errors: '',
          },
        })
      } else {
        this.setState({
          phone: '',
        })
        callback()
        this.props.form.setFields({
          telNo: {
            value: telNo,
            errors: errorM,
          },
        })
    }
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.autoNo)[0]
    const index = newData.findIndex(item => key === item.autoNo)
    let NewData = []
    if (column === 'salePrice') {
      NewData = update(newData, { [index]: { $merge: { [column]: value, saleAmount: value * target.orderNum } } })
    } else {
      NewData = update(newData, { [index]: { $merge: { [column]: value, saleAmount: value * target.salePrice } } })
    }
    if (target) {
      this.setState({
        data: NewData,
      })
    }
  }
  edit(key) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.autoNo)[0]
    if (target) {
      target.editable = true
      this.setState({ data: newData })
    }
  }
  save(key) {
      let status = true
      const params = {}
      const newData = [...this.state.data]
      const target = newData.filter(item => key === item.autoNo)[0]
      if (!target.orderNum) {
        message.error('订单数量不能为空')
        status = false
      } else if (isNaN(target.orderNum)) {
        message.error('订单数量请输入数字')
        status = false
      } else if (target.orderNum < 0) {
        message.error('订单数量不能小于0')
        status = false
       } else if (Math.round(Number(target.orderNum)) !== Number(target.orderNum) || target.orderNum.toString().indexOf('.') !== -1) {
        message.error('订单数量请输入整数(不带小数点)')
        status = false
       } else if (target.orderNum.toString().indexOf(' ') !== -1) {
        message.error('订单数量不能输入空格')
        status = false
       }
       if (!target.salePrice && target.salePrice !== 0) {
        message.error('单价不能为空')
        status = false
      } else if (isNaN(target.salePrice)) {
        message.error('单价请输入数字')
        status = false
      } else if (target.salePrice < 0) {
        message.error('单价不能小于0')
        status = false
       } else if (target.salePrice.toString().indexOf(' ') !== -1) {
        message.error('单价不能输入空格')
        status = false
       } else if (target.salePrice.toString().indexOf('.') !== -1 && target.salePrice.toString().split('.')[1].length > 2) {
        message.error('单价小数不超过2位')
        status = false
       }
       if (status) {
        Object.assign(params, {
          autoNo: target.autoNo,
          orderNo: this.props.record.orderNo,
          salePrice: target.salePrice,
          orderNum: target.orderNum,
         })
        updateOrderDeditor(params).then((json) => {
          if (json && json.review) {
            this.selectOrderNoLog()
            this.orderDetail()
            message.success('编辑订单明细成功')
            const initialArray = []
            const newArray = update(initialArray, { $push: json.listOmDTO })
            this.setState({
              data: newArray,
              dataCopy: newArray,
            })
            this.orderAmount(newArray)
            this.payAmount(newArray)
            this.preferential(newArray)
            this.orderStatus(json.orderType)
          }
        })
       }
    }

  cancel(key) {
    const newData = [...this.state.dataCopy]
    const target = newData.filter(item => key === item.autoNo)[0]
    if (target) {
      Object.assign(target, newData.filter(item => key === item.autoNo)[0])
      delete target.editable
      this.setState({ data: newData })
    }
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.autoNo, column)}
        save={() => this.save(record.autoNo)}
      />
    )
  }
  invoiceType = (e) => {
    if (!e.length) {
      this.setState({
        invoiceType: [],
        invoiceTaxNo: '',
      })
      this.props.form.setFields({
        invoiceTitle: {
          value: this.props.form.getFieldValue('invoiceTitle'),
        },
        invoiceTaxNo: {
          value: this.props.form.getFieldValue('invoiceTaxNo'),
        },
      })
    } else {
      const last = []
      const data = this.state.invoiceType
      e.length && e.forEach((ele) => {
        if (data.indexOf(ele) === -1) {
          last.push(ele)
        }
      })
      this.setState({
        invoiceType: last,
      })
      this.props.form.setFields({
        invoiceType: {
          value: last,
        },
      })
    }
  }
  invoiceChange = (e) => {
    if (!e.target.value) {
      if (e.target.id === 'invoiceTitle') {
        if (!this.props.form.getFieldValue('invoiceTaxNo')) {
          this.props.form.setFields({
            invoiceType: {
              value: this.state.invoiceType,
              errors: [new Error('')],
            },
          })
        }
      } else if (!this.props.form.getFieldValue('invoiceTitle')) {
          this.props.form.setFields({
            invoiceType: {
              value: this.state.invoiceType,
              errors: [new Error('')],
            },
          })
        }
      }
  }
  checkInvoiceTaxNo = (rule, value, callback) => {
    if (!value) {
      this.setState({
        invoiceTaxNo: this.state.invoiceType.length ? '请输入发票税号' : '',
      })
      this.state.invoiceType.length ? callback('error') : callback()
    } else if (value.indexOf(' ') !== -1) {
      this.setState({
        invoiceTaxNo: '发票税号不允许输入空格',
      })
      callback('error')
    } else if (value.length < 18) {
      this.setState({
        invoiceTaxNo: '请输入18位发票税号',
      })
      callback('error')
    } else {
        this.setState({
          invoiceTaxNo: '',
        })
        callback()
        this.props.form.setFields({
          invoiceTaxNo: {
            value: this.props.form.getFieldValue('invoiceTaxNo').substr(0, 18).toLocaleUpperCase(),
          },
        })
    }
  }
  remark = (flag, rule, value, callback) => {
    const reg = /[~#^$@%&!！?%*()-+()]/gi
    if (reg.test(value)) {
      this.props.form.setFields({
        [flag]: {
          value,
        },
      })
      callback(`${ flag === 'sellerRemark' ? '卖家' : '买家' }备注不能输入[特殊字符]只能输入[数字,字母,中文]`)
    } else {
      this.props.form.setFields({
        [flag]: {
          value,
        },
      })
      callback()
    }
  }
  render() {
    const { loading } = this.props.orderDetail
    const { show } = this.props
    const { orderNo, shopName, orderTime, siteOrderNo, siteBuyerNo, payTime,
            expressAmount, buyerRemark, invoiceType, invoiceTitle, invoiceTaxNo, address,
            receiver, mobileNo, expressNo, telNo, orderFlag, orderOrigin, sellerRemark } = this.props.record
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const formItemLayoutRow = {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
    }
    const formItemLayoutT = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
    }
    const addProps = {
      fromName: 'jt',
      unable: this.state.unable,
      changeModalVisiable: this.state.showModal,
      enableStatus: '1',
      itemModalHidden: () => { this.setState({ showModal: false }) },
      chooseDataKeys: this.props.orderDetail.initKey,
      chooseData: (rows, keys, callback) => {
        const orderList = rows.map((e) => {
          return {
            orderNo: this.props.record.orderNo,
            skuNo: e.skuNo,
            productNo: e.productNo,
            productName: e.productName,
            productImage: e.imageUrl,
            productSpec: e.productSpec,
            orderNum: 1,
            retailPrice: e.retailPrice,
            salePrice: e.retailPrice,
            referWeight: e.referWeight,
            isPresale: 0,
            isGift: 0,
          }
        })
        insertOrderDInfo(orderList).then((json) => {
          if (json && json.review) {
            this.orderDetail()
            this.orderStatus(json.orderType)
            this.props.dispatch({
              type: 'chooseItem/changeState',
              payload: { jt: false, forbid: [] },
            })
            this.selectOrderNoLog()
            callback()
            const initialArray = []
            const newArray = update(initialArray, { $push: json.listOmDTO })
            this.setState({
              data: newArray,
              dataCopy: newArray,
            })
            this.orderAmount(newArray)
            this.payAmount(newArray)
            this.preferential(newArray)
            const initKey = []
            const giftKey = []
            json.listOmDTO.forEach((ele) => {
              if (ele.isGift === 0) {
                initKey.push(ele.skuNo)
              } else {
                giftKey.push(ele.skuNo)
              }
            })
            this.props.dispatch({
              type: 'orderDetail/changeState',
              payload: { initKey, giftKey },
            })
          }
        })
      },
    }
    return (
      <div>
        <Modal
          title="订单详情"
          visible={show}
          onCancel={this.hideModal}
          width={1000}
          bodyStyle={{ maxHeight: 550, overflowX: 'hidden' }}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={this.hideModal}>关闭</Button>,
          ]}
        >
          <Steps size="small" current={this.state.orderStatusT}>
            <Step title="待付款" />
            <Step title="已付款待审核" />
            <Step title="已客审待财审" />
            <Step title="发货中" />
            <Step title="已发货" />
          </Steps>
          <Form
            style={{ marginTop: 8, float: 'left' }}
          >
            <Card type="inner" title="订单基本信息" style={{ width: '700px' }}>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="订单编号"
                  >
                    <span>{orderNo}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="店铺"
                  >
                    <span>{shopName}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="下单时间"
                  >
                    <span>{moment(orderTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="订单来源"
                  >
                    <span>{orderOrigin === 0 ? '线上订单' : '手工订单'}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="线上订单号"
                  >
                    <span>{siteOrderNo && siteOrderNo.indexOf(',') !== -1 ? siteOrderNo.split(',')[siteOrderNo.split(',').length - 1] : siteOrderNo}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="买家账号"
                  >
                    <span>{siteBuyerNo}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="付款时间"
                  >
                    <span>{payTime > 0 ? moment(payTime).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="快递公司"
                  >
                    <span>{this.state.expressCorpName}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="快递单号"
                  >
                    <span>{expressNo}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    help={this.state.expressAmount}
                    {...formItemLayout}
                    label="运费"
                  >
                    {getFieldDecorator('expressAmount', {
                      initialValue: expressAmount,
                      rules: [{
                        validator: this.checkExpressAmount,
                      }],
                    })(
                      <Input maxLength="8" size="small" style={{ width: '200px' }} readOnly={!this.state.noClick} />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem
                    {...formItemLayoutT}
                    label="买家留言"
                    className={styles.formItem}
                  >
                    <span>{buyerRemark}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ paddingLeft: '9px' }}>
                <Col span={24}>
                  <FormItem
                    {...formItemLayoutRow}
                    label="订单旗帜"
                  >
                    {getFieldDecorator('orderFlag', {
                      initialValue: orderFlag,
                    })(
                      <RadioGroup>
                        { ['无', 'redFlag', 'yellowFlag', 'greenFlag', 'blueFlag', 'purpleFlag', 'blackFlag'].map((ele, index) => {
                          if (index) {
                            return <Radio key={index} disabled={!this.state.noClick} value={index}>
                                    <img alt="" src={require(`../../images/${ele}.png`)} style={{ width: '20px', height: '20px' }} />
                                   </Radio>
                          } else {
                            return <Radio key={index}  disabled={!this.state.noClick} value={index}>{ele}</Radio>
                          }
                        }
                        ) }
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem
                    {...formItemLayoutRow}
                    label="卖家备注"
                  >
                    {getFieldDecorator('sellerRemark', {
                      initialValue: sellerRemark,
                      rules: [{
                        validator: this.remark.bind(this, 'sellerRemark'),
                      }],
                    })(
                      <TextArea style={{ marginBottom: 10 }} readOnly={!this.state.noClick} rows={4} maxLength="250" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ paddingLeft: '9px' }}>
                <Col span={24}>
                  <FormItem
                    {...formItemLayoutRow}
                    label="发票类型"
                  >
                    {getFieldDecorator('invoiceType', {
                      initialValue: invoiceType !== 2 ? [invoiceType] : [],
                      rules: [{
                        required: this.props.form.getFieldValue('invoiceTitle') || this.props.form.getFieldValue('invoiceTaxNo'), message: '填写发票抬头或发票税号需选择发票类型',
                      }],
                    })(
                      <CheckboxGroup readOnly={!this.state.noClick} onChange={this.invoiceType}>
                        <Checkbox disabled={(this.state.invoiceType[0] !== 0 && this.state.invoiceType[0] !== undefined) || !this.state.noClick ? true : false} value={0}>个人</Checkbox>
                        <Checkbox disabled={(this.state.invoiceType[0] !== 1 && this.state.invoiceType[0] !== undefined) || !this.state.noClick ? true : false} value={1}>公司</Checkbox>
                      </CheckboxGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ paddingLeft: '9px' }}>
                <Col span={24}>
                  <FormItem
                    {...formItemLayoutRow}
                    label="发票抬头"
                  >
                    {getFieldDecorator('invoiceTitle', {
                      initialValue: invoiceTitle,
                      rules: [{
                        required: this.state.invoiceType.length, message: '请输入发票抬头',
                      }],
                    })(
                      <Input maxLength="500" onChange={this.invoiceChange} readOnly={!this.state.noClick} size="small" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ paddingLeft: '9px' }}>
                <Col span={24}>
                  <FormItem
                    {...formItemLayoutRow}
                    label="发票税号"
                    help={this.state.invoiceTaxNo}
                  >
                    {getFieldDecorator('invoiceTaxNo', {
                      initialValue: invoiceTaxNo,
                      rules: [{
                        required: this.state.invoiceType.length, message: '请输入发票税号',
                      }, {
                        validator: this.checkInvoiceTaxNo,
                      }],
                    })(
                      <Input onChange={this.invoiceChange} maxLength="18" readOnly={!this.state.noClick} size="small" />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card type="inner" title="收货地址信息" style={{ width: '700px', marginTop: '20px' }}>
              <FormItem
                {...formItemLayoutT}
                label="收货地址"
              >
                {getFieldDecorator('provinceCC', {
                    rules: [{
                      required: true, message: '请选择省市县',
                    }],
                  })(
                    <AddressCas disabled={!this.state.noClick} addrSelect={this.addrSelect} wh={this.state.warehouse} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayoutT}
                label="具体地址"
              >
                {getFieldDecorator('address', {
                    initialValue: address,
                    rules: [{
                      required: true, message: '请输入具体地址',
                    }],
                  })(
                    <Input readOnly={!this.state.noClick} maxLength="250" size="small" style={{ width: '400px' }} placeholder="请输入具体地址" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayoutT}
                label="收件人名"
              >
                {getFieldDecorator('receiver', {
                  initialValue: receiver,
                  rules: [{
                    required: true, message: '请输入收件人',
                  }],
                })(
                  <Input readOnly={!this.state.noClick} maxLength="20" style={{ width: '200px' }} size="small" placeholder="请输入收件人" />
              )}
              </FormItem>
              <FormItem
                help={this.state.telNo}
                {...formItemLayoutT}
                label="联系电话"
              >
                {getFieldDecorator('telNo', {
                  initialValue: telNo,
                  rules: [{
                    validator: this.checkTelNo,
                  }],
                })(
                  <Input readOnly={!this.state.noClick} maxLength="25" style={{ width: '150px' }} size="small" />
              )}
                <span style={{ color: '#55d4fd', fontWeight: 'bold', marginLeft: '5px' }}>更改才输入，如果不更改，不要输入，要删除原号码，则输入空格</span>
              </FormItem>
              <FormItem
                help={this.state.phone}
                {...formItemLayoutT}
                label="联系手机"
              >
                {getFieldDecorator('mobileNo', {
                  initialValue: mobileNo,
                  rules: [{
                    validator: this.checkMobileNo,
                  }],
                })(
                  <Input readOnly={!this.state.noClick} maxLength="11" style={{ width: '150px' }} size="small" />
              )}
                <span style={{ color: '#55d4fd', fontWeight: 'bold', marginLeft: '5px' }}>更改才输入，如果不更改，不要输入，要删除原号码，则输入空格</span>
              </FormItem>
            </Card>
            <Button disabled={!this.state.noClick} loading={this.state.loading} style={{ float: 'right', marginTop: '10px' }} type="primary" onClick={this.handleSubmit} className="login-form-button">
              保存订单基本信息
            </Button>
          </Form>
          <div style={{ float: 'left', width: '200px', marginTop: '8px', marginLeft: '30px' }}>
            <p>
              <Button
                loading={this.state.loadingSure}
                onClick={this.changeStatus}
                disabled={!(this.state.orderStatus === 1) ||
                this.state.sure ||
                this.props.record.moneyCheck}
                type="primary"
                size="small"
              >
                审核确认
              </Button>
            </p>
            <p><Button disabled={!this.state.noClick} onClick={this.setExpressCom} type="primary" size="small">设定快递公司</Button></p>
            <p>
              <span>{this.state.abnormalName === '' ? '(当前无异常)' : `(当前异常:${this.state.abnormalName})`}</span>
              <span><Button loading={this.state.cancelAbnormal} disabled={this.state.noAbnormal} onClick={this.cancelAbnormal} type="primary" size="small">取消异常标记</Button></span>
            </p>
            <p>
              <Button
                disabled={!(this.props.record.orderStatus === 0 ||
                  this.props.record.orderStatus === 1 ||
                  this.props.record.orderStatus === 2 ||
                  this.props.record.orderStatus === 4 ||
                  this.props.record.orderStatus === 20) || this.props.record.moneyCheck}
                type="primary"
                size="small"
                onClick={() => {
                  this.setState({ billAbnormal: true })
                  this.props.dispatch({
                    type: 'search/getAbnormal',
                  })
                }}
              >
                标记异常
              </Button>
            </p>
            <p>
              <Button
                size="small"
                type="primary"
                disabled={!(this.props.record.orderStatus === 0 ||
                  this.props.record.orderStatus === 1 ||
                  this.props.record.orderStatus === 2 ||
                  this.props.record.orderStatus === 4 ||
                  this.props.record.orderStatus === 20) ||
                  this.props.record.moneyCheck}
                onClick={() => {
                  this.setState({
                    billCancel: true,
                  })
                }}
              >
                取消订单
              </Button>
            </p>
          </div>
          <div style={{ clear: 'both' }} />
          <Card
            style={{ marginTop: '20px' }}
            type="inner"
            title={
              <div>订单支付情况<span style={{ marginLeft: '20px' }}>
                <Button size="small" type="primary" disabled={!this.state.money || this.props.record.moneyCheck} onClick={() => { this.setState({ payment: true }) }}>
                  添加手工支付
                </Button></span>
              </div>
            }
          >
            {this.state.payValue && this.state.payValue.length ? this.state.payValue.map((ele, i) => {
              return (
                <div key={i}>
                  <Col span={19} style={{ marginTop: 16 }}>
                    <Col span={6}><span style={{ color: '#999' }}>支付方式:</span><span style={{ marginLeft: '5px' }}>{ele.modeName}</span></Col>
                    <Col span={8}><span style={{ color: '#999' }}>
                      <div style={{ width: 29, float: 'left' }}>单号:</div></span>
                      <div style={{ marginLeft: '5px', float: 'left', width: 208 }}>{ele.billNo}</div>
                    </Col>
                    <Col span={5}><span style={{ color: '#999' }}>支付日期:</span><span style={{ marginLeft: '5px' }}>{moment(ele.billDate).format('YYYY-MM-DD')}</span></Col>
                    <Col span={5}><span style={{ color: '#999' }}>金额:</span><span style={{ marginLeft: '5px' }}>¥{checkNumeral(ele.amount)}</span></Col>
                  </Col>
                  <Col span={5}>
                    {ele.status === 0 ?
                      <Button
                        size="small"
                        disabled={!this.state.money || this.props.record.moneyCheck}
                        loading={this.state.buttonStatus === 1}
                        onClick={this.changePay.bind(this, 1, ele)}
                        type="primary"
                        style={{ marginRight: '20px', marginTop: '10px' }}
                      >
                        审核通过
                      </Button> : ''
                    }
                    {ele.status === 1 ?
                      <Button
                        size="small"
                        disabled={!this.state.money || this.props.record.moneyCheck}
                        loading={this.state.buttonStatus === 0}
                        onClick={this.changePay.bind(this, 0, ele)}
                        type="primary"
                        style={{ marginRight: '20px', marginTop: '10px' }}
                      >
                        取消审核通过
                      </Button> : ''
                    }
                    {ele.status === 0 ?
                      <Button size="small"
                      disabled={!this.state.money || this.props.record.moneyCheck}
                      loading={this.state.buttonStatus === 3}
                      onClick={() => this.setState({ changePay: true, ele })}
                      type="primary" style={{ marginTop: '10px' }}
                      >
                        作废
                      </Button> : ''
                    }
                  </Col>
                </div>
              )
            })
          :
          '暂无支付'
          }
          </Card>
          <Card
            style={{ marginTop: '30px' }}
            type="inner"
            title={<div>订单商品<span style={{ marginLeft: '20px' }}><Button disabled={!this.state.noClick} size="small" type="primary" onClick={this.addGood}>添加新的商品</Button></span></div>}
          >
            <Table
              dataSource={this.state.data}
              loading={loading}
              columns={this.columns}
              pagination={false}
              rowKey={record => record.autoNo}
              onRow={(record) => {
                if (this.state.noClick) {
                  return {
                    onMouseEnter: () => {
                      this.edit(record.autoNo)
                    },
                    onMouseLeave: () => {
                      this.cancel(record.autoNo)
                    },
                  }
                } else {
                  return ''
                }
              }}
            />
            <div style={{ marginTop: '10px', float: 'right' }}>
              <p><span className={styles.left}>商品总成交金额:</span><span>¥{numeral(this.state.orderAmount).format('0,0.00')}</span></p>
              <p><span className={styles.left}>优惠抵扣金额|佣金:</span><span>¥{numeral(this.state.youhui).format('0,0.00')}</span></p>
              {/* <p><span className={styles.left}>取消的商品总金额:</span><span>¥88.00</span></p> */}
              <p><span className={styles.left}>运费:</span><span>¥{numeral(this.state.expressNum).format('0,0.00')}</span></p>
              <p><span className={styles.left}>应付总金额:</span><span style={{ color: 'red' }}>¥{numeral(this.state.orderAmountT - this.state.youhui).format('0,0.00')}</span></p>
              <p><span className={styles.left}>实际支付(支付已审核):</span><span style={{ color: 'red' }}>¥{numeral(this.state.actualPayment).format('0,0.00')}</span></p>
            </div>
          </Card>
          <div style={{ lineHeight: '30px', fontSize: 18 }}>订单操作进程及日志</div>
          {this.state.listLog && this.state.listLog.length ? this.state.listLog.map((ele, i) => 
            <Row key={i} style={{ marginTop: 5 }}>
              <span style={{ width: 140, display: 'inline-block' }}>{moment(ele.operateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
              <span style={{ width: 60, display: 'inline-block' }}>{ele.operateUser}</span>
              <span style={{ width: 100, display: 'inline-block' }}>{ele.operateWay}</span>
              <span style={{ width: 400, display: 'inline-block' }}>{ele.operateDesc}</span>
            </Row>
          ) : '暂无操作日志'}
        </Modal>
        <CourierCompany
          orderStatus={this.props.record.orderStatus}
          listLog={() => { this.selectOrderNoLog() }}
          orderType={(orderType) => {
            this.orderStatus(orderType)
          }}
          orderNo={this.props.record.orderNo}
          show={this.state.courierCompany}
          hideModal={() => {
            this.setState({ courierCompany: false })
            this.props.dispatch({ type: 'chooseItem/changeState', payload: { searchParamT: false } })
          }}
          onOk={(value) => {
            if (value === -1) {
              this.setState({
                expressCorpNo: '',
                expressCorpName: '',
              })
            } else {
              this.setState({
                expressCorpNo: value.expressCorpNo,
                expressCorpName: value.expressCorpName,
              })
            }
          }}
        />
        {this.state.showModal ? <AddGood {...addProps} /> : null}
        <BillAbnormal
          listLog={() => { this.selectOrderNoLog() }}
          callback={(value) => { this.setState({ abnormalName: value, noAbnormal: false }) }}
          show={this.state.billAbnormal}
          hideModal={() => {
            this.setState({
              billAbnormal: false,
            })
          }}
          record={this.props.record}
        />
        <BillCancel
          listLog={() => { this.selectOrderNoLog() }}
          show={this.state.billCancel}
          hideModal={() => {
            this.setState({
              billCancel: false,
            })
          }}
          record={this.props.record}
        />
        <Payment
          listLog={() => { this.selectOrderNoLog() }}
          record={this.props.record}
          show={this.state.payment}
          getBack={(value) => {
            let money = 0
            value.forEach((ele) => {
              if (ele.status === 1) {
                money = money + ele.amount
              }
            })
            this.setState({
              payValue: value,
              actualPayment: money,
            })
          }}
          hideModal={() => {
            this.setState({
              payment: false,
            })
          }}
        />
        <ChangePay
          show={this.state.changePay}
          hideModal={() => this.setState({ changePay: false, ele: {} })}
          sure={() => this.changePay(3, this.state.ele)}
        />
      </div>)
  }
}
