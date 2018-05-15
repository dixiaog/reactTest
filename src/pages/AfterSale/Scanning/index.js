/*
 * @Author: tanmengjia
 * @Date: 2018-03-07 09:08:33
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 20:37:56
 * 售后扫描登记(有快递单)
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import update from 'immutability-helper'
import { Button, Card, Input, notification, Row, Form, Col, Avatar, Select, message } from 'antd'
import Jtable from '../../../components/JcTable'
import config from '../../../utils/config'
import styles from '../AfterSale.less'
import OrderDetail from '../../../components/OrderDetail'
import { takeGoods, getSkuDetail, getAfterSkus } from '../../../services/aftersale/scanning'
import { selectOrderNo } from '../../../services/order/search'
import AfterDetail from '../AfterSearch/AfterDetail'
import { viewData } from '../../../services/aftersale/afterSearch'

const { TextArea } = Input
const FormItem = Form.Item
const Option = Select.Option

@connect(state => ({
  scanning: state.scanning,
  orderDetail: state.orderDetail,
}))
@Form.create()
export default class Scanning extends Component {
  constructor(props) {
    super(props)
    this.state = {
      skuNo: undefined,
      type: 0,
      value: undefined,
      expressNo: undefined,
      siteOrderNo: undefined,
      orderDetail: false,
      afterDetail: false,
      record1: {},
      record: {},
      dataList: [],
      barcodess: [],
      columns: [{
        title: '缩略图',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 80,
        render: (text) => {
          return (<Avatar shape="square" src={text} />)
          },
      }, {
        title: '商品编码/款式编码',
        dataIndex: 'skuNo',
        key: 'strategyName',
        width: 150,
        render: (text, record) => {
          return (
            <div>
              <div>{record.skuNo}</div>
              <div>{record.productNo}</div>
            </div>
          )
        },
      }, {
        title: '商品名称/颜色规格',
        dataIndex: 'productName',
        key: 'productName',
        width: 150,
        render: (text, record) => {
          return (
            <div>
              <div>{record.productName}</div>
              <div>{record.productSpec}</div>
            </div>
          )
        },
      }, {
        title: '售后单号',
        dataIndex: 'asNo',
        key: 'asNo',
        width: 100,
        reder: (text, record) => {
          return (
            <a onClick={() => {
              viewData({ asNo: record.asNo }).then((json) => {
                if (json) {
                  this.setState({ afterDetail: true, record1: json })
                }
              })
            }}
            >{text}</a>
          )
        },
      }, {
        title: '内部订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              <a onClick={this.orderDetail.bind(this, record)}>{record.orderNo}</a>
              <div>{record.shopName}</div>
              <div>{record.siteOrderNo}</div>
            </div>
          )
        },
      }, {
        title: '申请/已退',
        dataIndex: 'includeProduct',
        key: 'includeProduct',
        width: 80,
        className: styles.columnCenter,
        render: (text, record) => {
          return (
            <div>
              <div>{record.returnNum}/{record.inNum}</div>
            </div>
          )
        },
      }, {
        title: '本次退货',
        dataIndex: 'nowReturnNum',
        key: 'nowReturnNum',
        width: 80,
        className: styles.columnRight,
        render: (text, record) => {
          return (
            <div style={{ color: 'red' }}>{text}</div>
          )
        },
    }],
    }
  }
  componentDidMount() {
    this.props.dispatch({ type: 'scanning/getReason' })
  }
  orderDetail = (record) => {
    selectOrderNo(record.orderNo).then((json) => {
      if (json) {
        this.setState({ orderDetail: true, record: json })
        this.props.dispatch({
          type: 'orderDetail/fetch',
          payload: { orderNo: record.orderNo, warehouseNo: record.warehouseNo },
        })
      }
    })
  }
  // 回车查询
  onkeypress = (e) => {
    if (e.keyCode === 13) {
      const { setFieldsValue } = this.props.form
      if (this.state.value || this.state.value === 0) {
        if (this.state.type !== 5) {
          if (this.state.type === 0) {
            setFieldsValue({ expressNo: this.state.value })
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                delete values.remark
                delete values.refundReason
                delete values.asType
                delete values.expressCorpNo
                Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
                getAfterSkus(values).then((json) => {
                  if (json) {
                    const list111 = json
                    if (list111.length) {
                      list111.forEach((ele) => {
                        Object.assign(ele, { nowReturnNum: 0 })
                      })
                    }
                    this.setState({
                      type: this.state.type + 1,
                      value: undefined,
                      dataList: list111,
                    })
                  }
                })
              }
            })
          } else if (this.state.type === 1) {
            const isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/
            if (!isMobile.exec(this.state.value) && this.state.value.length !== 11) {
              message.error('请输入正确的手机号')
            } else {
              setFieldsValue({ mobileNo: this.state.value })
              this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  delete values.remark
                  delete values.refundReason
                  delete values.asType
                  delete values.expressCorpNo
                  Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
                  getAfterSkus(values).then((json) => {
                    if (json) {
                      const list111 = json
                      if (list111.length) {
                        list111.forEach((ele) => {
                          Object.assign(ele, { nowReturnNum: 0 })
                        })
                      }
                      this.setState({
                        type: this.state.type + 1,
                        value: undefined,
                        dataList: list111,
                      })
                    }
                  })
                }
              })
            }
          } else if (this.state.type === 2) {
            setFieldsValue({ siteBuyerNo: this.state.value })
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                delete values.remark
                delete values.refundReason
                delete values.asType
                delete values.expressCorpNo
                Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
                getAfterSkus(values).then((json) => {
                  if (json) {
                    const list111 = json
                    if (list111.length) {
                      list111.forEach((ele) => {
                        Object.assign(ele, { nowReturnNum: 0 })
                      })
                    }
                    this.setState({
                      type: this.state.type + 1,
                      value: undefined,
                      dataList: list111,
                    })
                  }
                })
              }
            })
          } else if (this.state.type === 3) {
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                this.setState({
                  siteOrderNo: this.state.value,
                }, () => {
                  delete values.remark
                  delete values.refundReason
                  delete values.asType
                  delete values.expressCorpNo
                  Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
                  getAfterSkus(values).then((json) => {
                    if (json) {
                      const list111 = json
                      if (list111.length) {
                        list111.forEach((ele) => {
                          Object.assign(ele, { nowReturnNum: 0 })
                        })
                      }
                      this.setState({
                        type: this.state.type + 1,
                        value: undefined,
                        dataList: list111,
                      })
                    }
                  })
                })
              }
            })
          } else if (this.state.type === 4) {
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                this.setState({
                  expressNo: this.state.value,
                }, () => {
                  delete values.remark
                  delete values.refundReason
                  delete values.asType
                  delete values.expressCorpNo
                  Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
                  getAfterSkus(values).then((json) => {
                    if (json) {
                      const list111 = json
                      if (list111.length) {
                        list111.forEach((ele) => {
                          Object.assign(ele, { nowReturnNum: 0 })
                        })
                      }
                      this.setState({
                        type: this.state.type + 1,
                        value: undefined,
                        dataList: list111,
                      })
                    }
                  })
                })
              }
            })
          }
        } else {
          setFieldsValue({ receiver: this.state.value })
          this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              delete values.remark
              delete values.refundReason
              delete values.asType
              delete values.expressCorpNo
              Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
              getAfterSkus(values).then((json) => {
                if (json) {
                  const list111 = json
                  if (list111.length) {
                    list111.forEach((ele) => {
                      Object.assign(ele, { nowReturnNum: 0 })
                    })
                  }
                  this.setState({
                    value: undefined,
                    dataList: list111,
                  })
                }
              })
            }
          })
        }
      } else {
        message.error('请输入值')
      }
    }
  }
  // 手动查询
  onkeypress1 = () => {
    const { setFieldsValue } = this.props.form
    if (this.state.value || this.state.value === 0) {
      if (this.state.type !== 5) {
        if (this.state.type === 0) {
          setFieldsValue({ expressNo: this.state.value })
          this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              delete values.remark
              delete values.refundReason
              delete values.asType
              delete values.expressCorpNo
              Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
              getAfterSkus(values).then((json) => {
                if (json) {
                  const list111 = json
                  if (list111.length) {
                    list111.forEach((ele) => {
                      Object.assign(ele, { nowReturnNum: 0 })
                    })
                  }
                  this.setState({
                    type: this.state.type + 1,
                    value: undefined,
                    dataList: list111,
                  })
                }
              })
            }
          })
        } else if (this.state.type === 1) {
          const isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/
          if (!isMobile.exec(this.state.value) || this.state.value.length !== 11) {
            message.error('请输入正确的手机号')
          } else {
            setFieldsValue({ mobileNo: this.state.value })
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                delete values.remark
                delete values.refundReason
                delete values.asType
                delete values.expressCorpNo
                Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
                getAfterSkus(values).then((json) => {
                  if (json) {
                    const list111 = json
                    if (list111.length) {
                      list111.forEach((ele) => {
                        Object.assign(ele, { nowReturnNum: 0 })
                      })
                    }
                    this.setState({
                      type: this.state.type + 1,
                      value: undefined,
                      dataList: list111,
                    })
                  }
                })
              }
            })
          }
        } else if (this.state.type === 2) {
          setFieldsValue({ siteBuyerNo: this.state.value })
          this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              delete values.remark
              delete values.refundReason
              delete values.asType
              delete values.expressCorpNo
              Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
              getAfterSkus(values).then((json) => {
                if (json) {
                  const list111 = json
                  if (list111.length) {
                    list111.forEach((ele) => {
                      Object.assign(ele, { nowReturnNum: 0 })
                    })
                  }
                  this.setState({
                    type: this.state.type + 1,
                    value: undefined,
                    dataList: list111,
                  })
                }
              })
            }
          })
        } else if (this.state.type === 3) {
          this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              this.setState({
                siteOrderNo: this.state.value,
              }, () => {
                delete values.remark
                delete values.refundReason
                delete values.asType
                delete values.expressCorpNo
                Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
                getAfterSkus(values).then((json) => {
                  if (json) {
                    const list111 = json
                    if (list111.length) {
                      list111.forEach((ele) => {
                        Object.assign(ele, { nowReturnNum: 0 })
                      })
                    }
                    this.setState({
                      type: this.state.type + 1,
                      value: undefined,
                      dataList: list111,
                    })
                  }
                })
              })
            }
          })
        } else if (this.state.type === 4) {
          this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              this.setState({
                expressNo: this.state.value,
              }, () => {
                delete values.remark
                delete values.refundReason
                delete values.asType
                delete values.expressCorpNo
                Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
                getAfterSkus(values).then((json) => {
                  if (json) {
                    const list111 = json
                    if (list111.length) {
                      list111.forEach((ele) => {
                        Object.assign(ele, { nowReturnNum: 0 })
                      })
                    }
                    this.setState({
                      type: this.state.type + 1,
                      value: undefined,
                      dataList: list111,
                    })
                  }
                })
              })
            }
          })
        }
      } else {
        setFieldsValue({ receiver: this.state.value })
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            delete values.remark
            delete values.refundReason
            delete values.asType
            delete values.expressCorpNo
            Object.assign(values, { oldExpressNo: this.state.expressNo, siteOrderNo: this.state.siteOrderNo })
            getAfterSkus(values).then((json) => {
              if (json) {
                const list111 = json
                if (list111.length) {
                  list111.forEach((ele) => {
                    Object.assign(ele, { nowReturnNum: 0 })
                  })
                }
                this.setState({
                  value: undefined,
                  dataList: list111,
                })
              }
            })
          }
        })
      }
    } else {
      message.error('请输入值')
    }
  }
  // 扫描商品条码
  onkeydown = (e) => {
    if (e.keyCode === 13) {
      if (this.state.skuNo) {
        const payload = {
          skuNo: this.state.skuNo,
        }
        getSkuDetail(payload).then((json) => {
          if (json) {
            if (this.state.dataList.filter(ele => ele.skuNo === json.skuNo && ele.orderNo === json.orderNo)
              &&
              this.state.dataList.filter(ele => ele.skuNo === json.skuNo && ele.orderNo === json.orderNo).length
            ) {
              if (!json.scanSkuNo) {
                const index1 = this.state.barcodess.findIndex(ele => ele === json.barcode)
                if (index1 > -1) {
                  message.error('重复扫描,同一个条码只能扫描一次')
                  this.setState({
                    skuNo: '',
                  })
                } else {
                  const barcodesss = this.state.barcodess
                  barcodesss.push(json.barcode)
                  is.setState({
                    barcodess: barcodesss,
                  })
                  const index = this.state.dataList.findIndex(ele => ele.skuNo === json.skuNo && ele.orderNo === json.orderNo)
                  const v = this.state.dataList[index].nowReturnNum
                  const b = this.state.dataList[index].barcodes ? this.state.dataList[index].barcodes : []
                  b.push(json.barcode)
                  this.setState(update(
                    this.state, {
                      dataList: { [index]: { $merge: { nowReturnNum: v + 1, barcodes: b } } },
                    }
                  ), () => {
                    this.setState({
                      skuNo: '',
                    })
                  })
                }
              }
            } else {
              if (!json.scanSkuNo) {
                const barcodesss = this.state.barcodess
                barcodesss.push(json.barcode)
                this.setState({
                  barcodess: barcodesss,
                })
              }
              const newList = this.state.dataList
              Object.assign(json, { nowReturnNum: 1 })
              if (json.barcode) {
                Object.assign(json, { barcodes: [json.barcode] })
              } else {
                Object.assign(json, { barcodes: [] })
              }
              newList.push(json)
              this.setState({
                dataList: newList,
              }, () => {
                this.setState({
                  skuNo: '',
                })
              })
            }
          }
        })
      } else if (!this.state.skuNo) {
        message.error('请输入商品条码')
      }
    }
  }
  setSkuNo = (e) => {
    this.setState({
      skuNo: e.target.value,
    })
  }
  changeType = (e) => {
    this.setState({
      type: e,
    })
  }
  changeValue = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
  // 删除商品
  delete = () => {
    let old = this.state.dataList
    this.props.scanning.selectedRows.forEach((ele) => {
      old = old.filter(row => row !== ele)
    })
    this.setState({
      dataList: old,
    })
  }
  // 重置
  clear = () => {
    this.setState({
      type: 0,
      value: undefined,
      skuNo: undefined,
      expressNo: undefined,
      siteOrderNo: undefined,
      dataList: [],
      barcodess: [],
    })
    this.props.dispatch({ type: 'scanning/clean' })
    this.props.form.resetFields()
  }
  // 确认收货
  yesGet = () => {
    if (this.state.dataList && this.state.dataList.length) {
      let payload = {}
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (!values.remark) {
            Object.assign(values, { remark: '' })
          }
          payload = {
            list: this.state.dataList,
            ...values,
          }
          takeGoods(payload).then((json) => {
            if (json) {
              this.setState({
                type: 0,
                value: undefined,
                skuNo: undefined,
                expressNo: undefined,
                siteOrderNo: undefined,
                dataList: [],
                barcodess: [],
              })
              notification.success({
                message: '操作成功',
              })
              this.props.dispatch({ type: 'scanning/clean' })
              this.props.form.resetFields()
            }
          })
        }
      })
    } else {
      message.error('无商品信息，无法确认收货')
    }
  }
  checkMobile = (rulr, value, callback) => {
    if (!value) {
      callback()
    } else {
      const isMobile = /^(((13[0-9]{1})|(16[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/
      if (!isMobile.test(value) || value.length !== 11) {
        callback('请输入正确的手机号')
      } else {
        callback()
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { loading, total, page, selectedRowKeys, selectedRows, refundReasonList } = this.props.scanning
    const tabelToolbar = [
      <Button style={{ marginLeft: 10 }} key="540" type="primary" size="small" premission="TRUE" onClick={this.delete} disabled={selectedRows.length === 0}>删除商品</Button>,
      // <Button type="primary" size="small" premission="TRUE">查看修改日志</Button>,
      // <Button type="primary" size="small" onClick={this.exportOrder} premission="TRUE">导出符合条件的单据</Button>,
      // <Button type="primary" size="small" premission="TRUE">设定赠送触发方式-当前：【下单送】</Button>,
    ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: this.state.dataList,
        total,
        ...page,
        loading,
        columns: this.state.columns,
        nameSpace: 'scanning',
        tableName: 'scanningTable',
        dispatch: this.props.dispatch,
        pagination: false,
        selectedRows,
        selectedRowKeys,
        rowKey: 'asNo',
        noTotal: true,
        pageSizeOptions: ['50'],
        scroll: { x: 740 },
    }
    const selectAfter = (
      <Select defaultValue={0} style={{ width: 100 }} onChange={this.changeType} value={this.state.type}>
        <Option value={0}>快递单号</Option>
        <Option value={1}>手机号</Option>
        <Option value={2}>买家帐号</Option>
        <Option value={3}>线上单号</Option>
        <Option value={4}>原快递单号</Option>
        <Option value={5}>收件人</Option>
      </Select>
    )
    const formItemLayout = {
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
    return (
      <div>
        <Card>
          <Row>
            {/* 左侧树形列表 */}
            <Col span={6} >
              <Card hoverable bordered style={{ height: document.body.clientHeight - 120 }}>
                <div style={{ marginBottom: 10, marginRight: 10, color: 'red' }}>
                  注意：搜索时，如果已有商品信息，会将现有商品信息覆盖
                </div>
                <div style={{ marginBottom: 10, marginRight: 10 }}>
                  <Input addonAfter={selectAfter} size={config.InputSize} onKeyDown={this.onkeypress} onChange={this.changeValue} value={this.state.value} />
                </div>
                  <div>
                    <Button onClick={this.clear} size={config.InputSize} style={{ width: 100, marginRight: 8, marginBottom: 10 }}>重置</Button>
                    <Button style={{ width: 100, marginBottom: 10 }} type="primary" onClick={this.onkeypress1} size={config.InputSize}>查询</Button>
                  </div>
                {/* <div style={{ color: '#BBBBBB', marginBottom: 10 }}>商品条码</div> */}
                <div style={{ marginBottom: 10, marginRight: 10 }}>
                  <Input size={config.InputSize} onChange={this.setSkuNo} value={this.state.skuNo} onKeyDown={this.onkeydown} placeholder="商品条码" />
                </div>
                <div style={{ height: document.body.clientHeight - 300, overflowX: 'hidden' }}>
                <div><b>创建新售后订单时，请完善如下信息</b></div>
                  <Form
                    style={{ marginTop: 10 }}
                    // , height: document.body.clientHeight - 300, overflowX: 'hidden'
                  >
                    <FormItem
                      {...formItemLayout}
                      label="快递公司"
                    >
                      {getFieldDecorator('expressCorpNo', {
                    })(
                      <Input size={config.InputSize} />
                    )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="快递单号"
                    >
                      {getFieldDecorator('expressNo', {
                    })(
                      <Input size={config.InputSize} />
                    )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="手机号码"
                    >
                      {getFieldDecorator('mobileNo', {
                        rules: [{
                          validator: this.checkMobile,
                        }],
                    })(
                      <Input size={config.InputSize} />
                    )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="收件人"
                    >
                      {getFieldDecorator('receiver', {
                    })(
                      <Input size={config.InputSize} />
                    )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="买家账号"
                    >
                      {getFieldDecorator('siteBuyerNo', {
                    })(
                      <Input size={config.InputSize} />
                    )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="售后类型"
                    >
                      {getFieldDecorator('asType', {
                        initialValue: 0,
                    })(
                      <Select size={config.InputSize}>
                        <Option key={0} value={0}>退货</Option>
                        <Option key={1} value={1}>换货</Option>
                      </Select>
                    )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="退货原因"
                    >
                      {getFieldDecorator('refundReason', {
                        initialValue: refundReasonList.length ? refundReasonList[0].itemName : undefined,
                        // refundReasonList.filter(row => row.itemName === '7天无理由退货').length && refundReasonList.filter(row => row.itemName === '7天无理由退货')[0].itemName ?
                        // refundReasonList.filter(row => row.itemName === '7天无理由退货')[0].itemName : undefined : undefined,
                    })(
                      <Select size="small">
                        {refundReasonList.length ? refundReasonList.map((ele, index) => <Option value={ele.itemName} key={index}>{ele.itemName}</Option>) : ''}
                      </Select>
                    )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="备注"
                    >
                      {getFieldDecorator('remark', {
                    })(
                      <TextArea size={config.InputSize} rows={4} />
                    )}
                    </FormItem>
                  </Form>
                {/* <Button onClick={this.clear} size={config.InputSize} style={{ width: 100, marginTop: 10, marginRight: 15 }}>重置</Button> */}
                  <Button size={config.InputSize} style={{ width: 120, marginTop: 10, marginLeft: 55 }} type="primary" onClick={this.yesGet} premisson="SCANNING_TAKEGOODS">确认收货</Button>
                </div>
              </Card>
            </Col>
            {/* 右侧详情列表 */}
            <Col span={18} className={styles.scanLeftCard1}>
              <Col span={24} push={0}>
                <div className={styles.tableList}>
                  <Jtable {...tableProps} />
                </div>
              </Col>
            </Col>
          </Row>
        </Card>
        {this.state.orderDetail ? <OrderDetail
          show={this.state.orderDetail}
          hideModal={() => this.setState({ orderDetail: false, record: {} })}
          record={this.state.record} /> : null }
        {this.state.afterDetail ? <AfterDetail
          show={this.state.afterDetail}
          hideModal={() => { this.setState({ afterDetail: false, record1: {} }) }}
          record={this.state.record1}
        /> : null}
      </div>
    )
  }
}
