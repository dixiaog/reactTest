/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 15:56:46
 * 创建新的售后单
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import numeral from 'numeral'
import { Modal, Form, Select, Input, DatePicker, Table, Col, Radio, Row, message } from 'antd'
import SearchBar from '../../../components/SearchBar'
import styles from '../AfterSale.less'
import { insertNewOrderList } from '../../../services/aftersale/afterSearch'
import ShowImg from '../../../components/ShowImg'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

@Form.create()
@connect(state => ({
  addAfter: state.addAfter,
  afterSearch: state.afterSearch,
}))
export default class AddAfter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      startValue: null,
      endValue: null,
      endOpen: false,
      radio: null,
      num: '',
      buyer: '',
      seller: '',
      asNo: 0,
      info: 0,
      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: [],
      salePrice: 0, // 保存商品单价
      backMoney: 0, // 退货金额
      returnNum: 1, // 记录数量
      sellerCompensate: 0, // 卖家补偿
      buyerCompensate: 0, // 买家补偿
      exchangeAmount: 0, // 换货金额
      actualReturnAmount: 0, // 实退金额
      flag: 'siteOrderNo',
      flagT: 'siteBuyerNo',
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.addAfter.disabled) {
      this.setState({
        startValue: null,
        endValue: null,
      })
      this.props.dispatch({
        type: 'addAfter/changeState',
        payload: { disabled: false },
      })
    }
    if (nextProps.addAfter.expand) {
      this.setState({
        expandedRowKeys: [],
      })
      this.props.dispatch({
        type: 'addAfter/changeState',
        payload: { expand: false },
      })
    }
  }

  onChangeRadio = (e) => {
    this.setState({
      radio: e.target.value,
    })
    if (e.target.value === 3) {
      this.setState({
        returnNum: 0,
      })
    }
    if (e.target.value === 3 || e.target.value === 2) {
      this.setState({
        backMoney: 0,
        actualReturnAmount: this.state.sellerCompensate - this.state.buyerCompensate,
      })
    }
  }
  onStartChange = (value) => {
    this.onChange('startValue', value)
  }

  onEndChange = (value) => {
    this.onChange('endValue', value)
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }
  // 获取子元素
  getChild = (expanded, record) => {
    const newKeys = this.state.expandedRowKeys
    const index = newKeys.findIndex(ele => ele === record.orderNo)
    if (expanded) {
      newKeys.push(record.orderNo)
    } else {
      newKeys.splice(index, 1)
    }
    this.setState({
      expandedRowKeys: newKeys,
    })
    if (expanded) {
      this.props.dispatch({
        type: 'addAfter/changeState',
        payload: { orderNo: record.orderNo },
      })
      this.props.dispatch({
        type: 'addAfter/getChild',
        payload: { orderNo: record.orderNo },
      })
    }
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }
  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        Object.assign(values, {
          skuNo: this.state.selectedRows[0].skuNo,
          productName: this.state.selectedRows[0].productName,
          productSpec: this.state.selectedRows[0].productSpec,
          actualReturnAmount: this.state.actualReturnAmount,
          backMoney: this.state.backMoney,
          orderNo: this.state.selectedRows[0].orderNo,
          warehouseNo: values.warehouse.key,
          warehouseName: values.warehouse.label,
          refundReason: values.type.label,
        })
        delete values.warehouse
        delete values.type
        if (!this.state.selectedRows.length) {
          message.warning('请选择一款商品')
        } else {
          insertNewOrderList(values).then((json) => {
            if (json) {
              this.props.dispatch({
                type: 'afterSearch/search',
              })
              this.hideModal()
            }
          })
        }
      }
    })
  }
  // 选取线上/内部/快递单号
  asNo = (e) => {
    this.setState({
      asNo: e,
    })
    this.props.dispatch({
      type: 'addAfter/changeState',
      payload: { billNo: e },
    })
    if (e === 0) {
      this.setState({
        flag: 'siteOrderNo',
      })
    } else if (e === 1) {
      this.setState({
        flag: 'orderNo',
      })
    } else {
      this.setState({
        flag: 'expressNo',
      })
    }
  }
  // 选取买家账号/收货人/手机号码
  Info = (e) => {
    this.setState({
      info: e,
    })
    this.props.dispatch({
      type: 'addAfter/changeState',
      payload: { Info: e },
    })
    if (e === 0) {
      this.setState({
        flagT: 'siteBuyerNo',
      })
    } else if (e === 1) {
      this.setState({
        flagT: 'receiver',
      })
    } else {
      this.setState({
        flagT: 'mobileNo',
      })
    }
  }
  // 关闭窗口
  hideModal = () => {
    this.props.hideModal()
    this.setState({
      confirmLoading: false,
      asNo: 0,
      info: 0,
      expandedRowKeys: [],
      radio: null,
      num: '',
      buyer: '',
      seller: '',
      selectedRowKeys: [],
      selectedRows: [],
      salePrice: 0, // 保存商品单价
      backMoney: 0, // 退货金额
      returnNum: 0, // 记录数量
    })
    this.handleReset()
    this.props.dispatch({
      type: 'addAfter/changeState',
      payload: { current: 1, pageSize: 20, searchParam: { beginTime: moment().subtract(0, 'days').format('YYYY-MM-DD'), endTime: moment().subtract(-7, 'days').format('YYYY-MM-DD') } },
    })
  }
   // 重置表单
   handleReset = () => {
    this.props.form.resetFields()
  }
  checkNum = (rule, value, callback) => {
    if (!this.state.selectedRows.length) {
      message.warning('请选择一款商品')
      this.setState({
        num: '',
      })
      callback()
      this.props.form.setFields({
        returnNum: {
          value: '',
        },
      })
    } else if (value) {
      if (isNaN(value) || !/^\d+$/.test(value)) {
        this.setState({
          num: '数量请输入整数(不带小数点)',
        })
        callback('error')
      } else if (value.toString().charAt(0) === '.') {
        this.setState({
          num: '数量不能以.开始',
        })
        callback('error')
      } else if (value < 1) {
        this.setState({
          num: '数量不能小于1',
        })
        callback('error')
      } else if (value.toString().charAt([value.length - 1]) === '.') {
        this.setState({
          num: '数量不能以.结尾',
        })
        callback('error')
      } else if (value.toString().indexOf(' ') !== -1) {
        this.setState({
          num: '数量不能输入空格',
        })
        callback('error')
      } else {
        this.setState({
          num: '',
          returnNum: value,
          backMoney: Number(this.state.salePrice) * Number(value),
          actualReturnAmount: Number(this.state.sellerCompensate) - Number(this.state.buyerCompensate) + Number(this.state.salePrice) * Number(value) - Number(this.state.exchangeAmount),
        })
        callback()
      }
    } else {
      this.setState({
        num: '',
        backMoney: 0,
        returnNum: 0,
        actualReturnAmount: Number(this.state.sellerCompensate) - Number(this.state.buyerCompensate) - Number(this.state.exchangeAmount),
      })
      callback()
    }
  }
  checkSeller = (rule, value, callback) => {
    if (value) {
      if (isNaN(value)) {
        this.setState({
          seller: '补偿金额请输入数字',
        })
        callback('error')
      } else if (value.toString().charAt(0) === '.') {
        this.setState({
          seller: '补偿金额不能以.开始',
        })
        callback('error')
      } else if (value < 0) {
        this.setState({
          seller: '补偿金额不能小于0',
        })
        callback('error')
      } else if (value >= 100000) {
        this.setState({
          seller: '补偿金额必须小于100000',
        })
        callback('error')
      } else if (value.toString().charAt([value.length - 1]) === '.') {
        this.setState({
          seller: '补偿金额不能以.结尾',
        })
        callback('error')
      } else if (value.toString().indexOf(' ') !== -1) {
        this.setState({
          seller: '补偿金额不能输入空格',
        })
        callback('error')
      } else {
        this.setState({
          seller: '',
          sellerCompensate: value,
          actualReturnAmount: Number(value) - Number(this.state.buyerCompensate) + Number(this.state.backMoney) - Number(this.state.exchangeAmount),
        })
        callback()
      }
    } else {
      this.setState({
        seller: '',
        sellerCompensate: 0,
        actualReturnAmount: Number(this.state.buyerCompensate) + Number(this.state.backMoney) - Number(this.state.exchangeAmount),
      })
      callback()
    }
  }
  checkBuyer = (rule, value, callback) => {
    if (value) {
      if (isNaN(value)) {
        this.setState({
          buyer: '补偿金额请输入数字',
        })
        callback('error')
      } else if (value.toString().charAt(0) === '.') {
        this.setState({
          buyer: '补偿金额不能以.开始',
        })
        callback('error')
      } else if (value < 0) {
        this.setState({
          buyer: '补偿金额不能小于0',
        })
        callback('error')
      } else if (value >= 100000) {
        this.setState({
          buyer: '补偿金额必须小于100000',
        })
        callback('error')
      } else if (value.toString().charAt([value.length - 1]) === '.') {
        this.setState({
          buyer: '补偿金额不能以.结尾',
        })
        callback('error')
      } else if (value.toString().indexOf(' ') !== -1) {
        this.setState({
          buyer: '补偿金额不能输入空格',
        })
        callback('error')
      } else {
        this.setState({
          buyer: '',
          buyerCompensate: value,
          actualReturnAmount: Number(this.state.sellerCompensate) - Number(value) + Number(this.state.backMoney) - Number(this.state.exchangeAmount),
        })
        callback()
      }
    } else {
      this.setState({
        buyer: '',
        buyerCompensate: 0,
        actualReturnAmount: Number(this.state.sellerCompensate) + Number(this.state.backMoney) - Number(this.state.exchangeAmount),
      })
      callback()
    }
  }
  render() {
    const { endOpen } = this.state
    const { list, total, loading, searchParam, current, pageSize, warehouseList, refundReasonList, shopList, suppliers, expressList } = this.props.addAfter
    const selectAfter = (
      <Select value={this.state.asNo} style={{ width: 90 }} onChange={this.asNo}>
        {/* <Option value={-1}>不限</Option> */}
        <Option value={0}>线上单号</Option>
        <Option value={1}>内部单号</Option>
        <Option value={2}>快递单号</Option>
      </Select>
    )
    const user = (
      <Select value={this.state.info} style={{ width: 90 }} onChange={this.Info}>
        {/* <Option value={-1}>不限</Option> */}
        <Option value={0}>买家账号</Option>
        <Option value={1}>收货人</Option>
        <Option value={2}>手机号</Option>
      </Select>
    )
    const { show } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    }
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (rowKeys, rows) => {
        this.setState({
          selectedRowKeys: rowKeys,
          selectedRows: rows,
          salePrice: rows[0].salePrice,
          backMoney: Number(rows[0].salePrice) * Number(this.state.returnNum),
          actualReturnAmount: Number(this.state.sellerCompensate) - Number(this.state.buyerCompensate) + Number(rows[0].salePrice) * Number(this.state.returnNum) - Number(this.state.exchangeAmount),
        })
      },
    }
    const columns = [
      {
        title: <div className={styles.margin}>订单号</div>,
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 120,
      },
      {
        title: <div className={styles.margin}>订单日期</div>,
        dataIndex: 'orderDate',
        key: 'orderDate',
        width: 120,
        render: (text) => {
          return moment(text).format('YYYY-MM-DD')
        },
      },
      {
        title: <div className={styles.margin}>买家账号</div>,
        dataIndex: 'siteBuyerNo',
        key: 'siteBuyerNo',
        width: 120,
      },
      {
        title: <div className={styles.margin}>店铺</div>,
        dataIndex: 'shopName',
        key: 'shopName',
        width: 120,
      },
      {
        title: <div className={styles.margin}>店铺(外部)订单号</div>,
        dataIndex: 'siteOrderNo',
        key: 'siteOrderNo',
        width: 220,
      },
      {
        title: <div className={styles.margin}>应付金额</div>,
        dataIndex: 'payAmount',
        key: 'payAmount',
        width: 120,
      },
      {
        title: <div className={styles.margin}>运费</div>,
        dataIndex: 'actualPayment',
        key: 'actualPayment',
        width: 120,
      },
      {
        title: <div className={styles.margin}>订单类型</div>,
        dataIndex: 'orderType',
        key: 'orderType',
        width: 120,
        render: (text) => {
          switch (text) {
            case 0:
              return '普通订单'
            case 1:
              return '换货订单'
            case 2:
              return '补发订单'
            case 3:
              return '分销订单'
            case 4:
              return '门店补货'
            default: 
              return '门店铺货'
          }
        },
      },
      {
        title: <div className={styles.margin}>收货人</div>,
        dataIndex: 'receiver',
        key: 'receiver',
        width: 120,
      },
      {
        title: <div className={styles.margin}>移动电话</div>,
        dataIndex: 'mobileNo',
        key: 'mobileNo',
        width: 120,
      },
      {
        title: <div className={styles.margin}>固定电话</div>,
        dataIndex: 'telNo',
        key: 'telNo',
        width: 140,
      },
      {
        title: <div className={styles.margin}>卖家备注</div>,
        dataIndex: 'sellerRemark',
        key: 'asStatus',
        width: 120,
      },
      {
        title: <div className={styles.margin}>买家留言</div>,
        dataIndex: 'buyerRemark',
        key: 'buyerRemark',
        width: 120,
      },
      {
        title: <div className={styles.margin}>收货地址</div>,
        dataIndex: 'address',
        key: 'address',
        width: 150,
      },
      {
        title: <div className={styles.margin}>快递公司</div>,
        dataIndex: 'expressCorpName',
        key: 'expressCorpName',
        width: 120,
      },
      {
        title: <div className={styles.margin}>快递单号(运单号)</div>,
        dataIndex: 'expressNo',
        key: 'expressNo',
        width: 180,
      },
    ]
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'beginTime',
        components: (<DatePicker
          disabledDate={this.disabledStartDate}
          format="YYYY-MM-DD"
          placeholder="订单开始时间"
          size="small"
          onChange={this.onStartChange}
        />),
      },
      {
        decorator: 'endTime',
        components: (<DatePicker
          disabledDate={this.disabledEndDate}
          format="YYYY-MM-DD"
          placeholder="订单结束时间"
          size="small"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />),
      },
      {
        decorator: 'shopNo',
        components: (
          <Select
            placeholder="选择店铺"
            size="small"
          >
            {shopList.length ? shopList.map(ele => <Option key={ele.shopNo} value={ele.shopNo}>{ele.shopName}</Option>) : ''}
          </Select>
        ),
      },
      {
        decorator: 'expressCorpNo',
        components: (
          <Select
            placeholder="快递公司"
            size="small"
          >
            {expressList.length ? expressList.map(ele => <Option key={ele.expressCorpNo} value={ele.expressCorpNo}>{ele.expressCorpName}</Option>) : ''}
          </Select>
        ),
      },
      {
        decorator: 'distributorNo',
        components: (
          <Select
            placeholder="分销商"
            size="small"
          >
            {suppliers.length ? suppliers.map(ele => <Option key={ele.supplierNo} value={ele.supplierNo}>{ele.supplierName}</Option>) : ''}
          </Select>
        ),
      },
      {
        decorator: 'warehouseNo',
        components: (
          <Select
            placeholder="发货仓"
            size="small"
          >
            {warehouseList.length ? warehouseList.map(ele => <Option value={ele.warehouseNo} key={ele.warehouseNo}>{ele.warehouseName}</Option>) : ''}
          </Select>
        ),
      },
      {
        decorator: this.state.flag,
        components: (
          <Input size="small" placeholder="输入单号" addonAfter={selectAfter} style={{ width: 220 }} />
        ),
      },
      {
        decorator: this.state.flagT,
        components: (
          <Input size="small" placeholder="输入对应信息" addonAfter={user} style={{ width: 220, marginLeft: 80 }} />
        ),
      },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'addAfter',
      searchParam,
    }
    // 子元素渲染
    const expandedRowRenderT = (data) => {
      const columnS = [
        {
          title: '图片',
          dataIndex: 'productImage',
          key: 'productImage',
          width: 120,
          render: (text, record) => {
            return (
              <ShowImg record={record} />
            )
          },
        }, {
          title: '商品名称',
          dataIndex: 'productName',
          key: 'productName',
          width: 200,
        }, {
          title: '颜色及规格',
          dataIndex: 'productSpec',
          key: 'productSpec',
          width: 200,
          render: (text) => {
            return `颜色及规格:${text}`
          },
        }, {
          title: '采购单价',
          dataIndex: 'salePrice',
          key: 'salePrice',
          width: 150,
          render: (text) => {
            return `单价:${text}`
          },
        }, {
          title: '采购数量',
          dataIndex: 'orderNum',
          key: 'orderNum',
          width: 150,
          render: (text) => {
            return `数量:${text}`
          },
        }, {
          title: '采购金额',
          dataIndex: 'saleAmount',
          key: 'saleAmount',
          width: 150,
          render: (text) => {
            return `金额:${text}`
          },
        },
    ]
      return (
        <Table
          loading={data.loading}
          columns={columnS}
          dataSource={data.child}
          pagination={false}
          rowKey={record => record.autoNo}
          showHeader={false}
          rowSelection={rowSelection}
          className={styles.table}
        />
      )
    }
    return (
      <div>
        <Modal
          title="创建新的售后单"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          width={1200}
          bodyStyle={{ maxHeight: 480, overflowX: 'hidden', padding: 0 }}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <div className={styles.contentBoardJ}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <SearchBar {...searchBarProps} />
              </div>
              <Table
                className={styles.page}
                expandedRowKeys={this.state.expandedRowKeys}
                scroll={ list.length ? { x: 1600, y: 250 } : {}}
                onExpand={(expanded, record) => this.getChild(expanded, record)}
                expandedRowRender={record => expandedRowRenderT(record)}
                rowKey={record => record.orderNo}
                loading={loading}
                columns={columns}
                dataSource={list}
                pagination={
                  {
                    size: 'small',
                    total,
                    current,
                    showTotal: () => { return `当前显示 ${((current - 1) * pageSize) + 1} 到 ${current * pageSize > total ? total : current * pageSize} 条数据,共 ${total} 条数据` },
                    pageSize,
                    onChange: (PageIndex) => {
                      this.props.dispatch({
                        type: 'addAfter/search',
                        payload: {
                          current: PageIndex,
                          pageSize,
                        },
                      })
                      this.props.dispatch({
                        type: 'addAfter/changeState',
                        payload: {
                          current: PageIndex,
                          pageSize,
                        },
                      })
                    },
                    showSizeChanger: true,
                    pageSizeOptions: ['20', '50', '100'],
                    onShowSizeChange: (c, PageSize) => {
                      this.props.dispatch({
                        type: 'addAfter/search',
                        payload: Object.assign(searchParam, { current: c, pageSize: PageSize }),
                      })
                      this.props.dispatch({
                        type: 'addAfter/changeState',
                        payload: {
                          current: c,
                          pageSize: PageSize,
                        },
                      })
                    },
                  }
                }
              />
            </div>
          </div>
          {this.state.selectedRows.length ?
          <div style={{ scrollY: 50 }}>
            <Form style={{ marginTop: 8 }}>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="退货仓库"
                  >
                    {getFieldDecorator('warehouse', {
                      rules: [{
                        required: true, message: '请选择退货仓库',
                      }],
                    })(
                      <Select labelInValue size="small" placeholder="请选择退货仓库">
                        {warehouseList.length ? warehouseList.map(ele => <Option value={ele.warehouseNo} key={ele.warehouseNo}>{ele.warehouseName}</Option>) : ''}
                      </Select>
                  )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="售后问题"
                  >
                    {getFieldDecorator('type', {
                      rules: [{
                        required: true, message: '请选择售后问题',
                      }],
                    })(
                      <Select labelInValue size="small" placeholder="请选择售后问题">
                        {refundReasonList.length ? refundReasonList.map(ele => <Option value={ele.autoNo} key={ele.autoNo}>{ele.itemName}</Option>) : ''}
                      </Select>
                  )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="售后类型"
                  >
                    {getFieldDecorator('asType', {
                      initialValue: 0,
                      rules: [{
                        required: true, message: '请选择售后类型',
                      }],
                    })(
                      <RadioGroup onChange={this.onChangeRadio}>
                        <Radio style={{ padding: 0, margin: 0 }} value={0}>退货</Radio>
                        <Radio style={{ padding: 0, margin: 0 }} value={1}>换货</Radio>
                        <Radio style={{ padding: 0, margin: 0 }} value={2}>补发</Radio>
                        <Radio style={{ padding: 0, margin: 0 }} value={3}>其他</Radio>
                      </RadioGroup>
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="买家退回快递"
                  >
                    {getFieldDecorator('expressCorpNo')(
                      <Input maxLength="10" size="small" />
                  )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="买家退回快递单号"
                  >
                    {getFieldDecorator('expressNo')(
                      <Input maxLength="20" size="small" />
                  )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    help={this.state.buyer}
                    {...formItemLayout}
                    label="买家补偿金额"
                  >
                    {getFieldDecorator('buyerCompensate', {
                      rules: [{
                        validator: this.checkBuyer,
                      }],
                    })(
                      <Input maxLength="8" size="small" />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem
                    help={this.state.seller}
                    {...formItemLayout}
                    label="卖家补偿金额"
                  >
                    {getFieldDecorator('sellerCompensate', {
                      rules: [{
                        validator: this.checkSeller,
                      }],
                    })(
                      <Input maxLength="8" size="small" />
                  )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  {this.state.radio !== 3 ?
                    <FormItem
                      help={this.state.num}
                      {...formItemLayout}
                      label="数量"
                    >
                      {getFieldDecorator('returnNum', {
                        initialValue: 1,
                        rules: [{
                          validator: this.checkNum,
                        }],
                      })(
                        <Input maxLength="11" size="small" />
                    )}
                    </FormItem> : ''}
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="备注"
                  >
                    {getFieldDecorator('remark')(
                      <Input maxLength="250" size="small" />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  {this.state.radio !== 3 ?
                    <FormItem
                      {...formItemLayout}
                      label="商品"
                    >
                      {this.state.selectedRows.length ? this.state.selectedRows[0].skuNo + ',' + this.state.selectedRows[0].productName + this.state.selectedRows[0].productSpec : ''}
                    </FormItem> : ''}
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="实退金额"
                  >
                    {numeral(this.state.actualReturnAmount).format('0,0.00')}
                  </FormItem>
                </Col>
                <Col span={8}>
                  {this.state.radio === 2 || this.state.radio === 3 ?
                    '' :
                    <FormItem
                      {...formItemLayout}
                      label="退货金额"
                    >
                      {numeral(this.state.backMoney).format('0,0.00')}
                    </FormItem>}
                </Col>
              </Row>
            </Form>
          </div>
          : ''}
        </Modal>
      </div>)
  }
}
