/*
 * @Author: Wupeng
 * @Date: 2017-1-23 10:04:11
 * @Last Modified by;
 * 销售出库单
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { DatePicker, Input, Button, Form, Tag, Select, Tooltip } from 'antd'
import Jtable from '../../../components/JcTable' // 导入表格组件
import SearchBar from '../../../components/SearchBar'
// import SearchBar from './SearchBar'
// import OrderDetail from '../../Order/SearchOrder/OrderDetail'
import OrderDetail from '../../../components/OrderDetail'
import OrderNos from '../../Order/SearchOrder/OrderNos'
import styles from './Treasury.less'
import { getShopName } from '../../../services/item/shopProduct'
import { exportDB } from '../../../services/base/treasury/treasury'
import config from '../../../utils/config'
import { selectOrderNo, getOrderMergeQuery } from '../../../services/order/search'
// import { getOtherStore } from '../../../utils/otherStore'

// const InputGroup = Input.Group
const Option = Select.Option
@connect(state => ({
    treasury: state.treasury,
    orderDetail: state.orderDetail,
  }))
  @Form.create()
  export default class Treasury extends Component {
    constructor(props) {
        super(props)
        this.state = {
          orderDetail: false,
          shops: [],
          record: {},
          endOpen: false,
          startValue: null,
          // startValue: moment().subtract(7, 'days'),
          // endValue: moment().subtract(0, 'days'),
          endValue: null,
          orderNos: [],
          showOrderNos: false,
          orderNodata: 'orderNo',
          orderText: '请先选择内部订单号',
          skuNodata: 'skuNo',
          skuNoText: '请选择商品编码',
        }
    }
    componentWillMount() {
      this.props.dispatch({
        type: 'treasury/fetch',
        payload: {
          orderNodata: 'orderNo',
          skuNodata: 'skuNo',
        },
      })
      this.props.dispatch({
        type: 'orderDetail/getExpresscorp',
      })
    }
    componentWillReceiveProps(nextProps) {
      // console.log(nextProps.treasury)
      if (nextProps.treasury.searchParam.endBillDate === undefined) {
        this.setState({
          endValue: null,
        })
      } 
      if (nextProps.treasury.searchParam.startBillDate === undefined) {
        this.setState({
          startValue: null,
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
    handleStartOpenChange = (open) => {
      if (!open) {
        this.setState({ endOpen: false })
      }
    }
    handleEndOpenChange = (open) => {
      this.setState({ endOpen: open })
    }
  orderDetail = (record) => {
    selectOrderNo(record.orderNo).then((json) => {
      if (json) {
        this.setState({ orderDetail: true, record: json })
        this.props.dispatch({
          type: 'orderDetail/fetch',
          payload: { orderNo: record.orderNo },
        })
      }
    })
  }
    stocu = () => {
      getShopName({}).then((json) => {
        this.setState({
          shops: json,
        })
      })
    }
    exportDB = () => {
      const { searchParam } = this.props.treasury
      const payload = Object.assign(searchParam,{
        fileName: '出库单.xls',
      })
      exportDB({
        ...payload,
      }).then((json) => {})
    }
    orderNoonchange = (e, s) => {
      this.setState({
        orderNodata: e,
        orderText: s.props.children,
      })
    }
    skuNodata = (e, s) => {
      this.setState({
        skuNodata: e,
        skuNoText: s.props.children,
      })
    }
      // 获取多个订单号
  getOrderList = (orderNo, e) => {
    getOrderMergeQuery({ orderNo, siteOrderNo: e }).then((json) => {
      if (json) {
        this.setState({
          orderNos: json,
          showOrderNos: true,
        })
      }
    })
  }
    render() {
      // 表格组件参数
      const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.treasury
      const { endOpen } = this.state
      const { expressList } = this.props.orderDetail
      // 操作栏
      const tabelToolbar = [
        <Button key={1} type="primary" onClick={this.exportDB.bind(this)} premission="TRESURY_EXPORTDB" size="small">导出</Button>,
      ]
        const columns = [{
          title: '序号',
          // 供应商编码
          dataIndex: 'autoNo',
          key: 'autoNo',
          width: 100,
          render: (text, record, index) => {
              return (
                <span>{index + 1}</span>
              )
          },
          }, {
          title: '出仓单号',
          dataIndex: 'billNo',
          key: 'billNo',
          width: 100,
        }, {
          title: '内部订单号',
          dataIndex: 'orderNo',
          key: 'orderNo',
          width: 100,
          render: (text, record) => {
            return (
              <a onClick={this.orderDetail.bind(this, record)}>{text}</a>
            )
          },
        }, {
          title: '线上订单号',
          dataIndex: 'siteOrderNo',
          key: 'siteOrderNo',
          width: 150,
          render: (text, record) => {
            if (text.indexOf(',') !== -1) {
              const data = text.split(',').map((e) => {
                return <div style={{ marginTop: 5 }}><a onClick={this.getOrderList.bind(this, record.orderNo, text)}>{e}{1}</a></div>
              })
              return data
            } else {
              return text
            }
          },
        }, {
          title: '单据日期',
          dataIndex: 'billDate',
          key: 'billDate',
          width: 100,
          render: text => (moment(text).format('YYYY-MM-DD')),
        },  {
          title: '下单时间',
          dataIndex: 'orderTime',
          key: 'orderTime',
          width: 150,
        }, {
          title: '状态',
        dataIndex: 'billStatus',
        key: 'billStatus',
        width: 120,
        render: (text) => {
          switch (text) {
            case 0:
              return <Tag style={{ backgroundColor: '#FFFF00', borderWidth: 0,}}>待发货</Tag>
            case 1:
              return <Tag style={{ backgroundColor: '#fce6ae', borderWidth: 0,}}>已发货待出库</Tag>
            case 2:
              return <Tag color="#00CD00">已出库</Tag>
            default:
              return <Tag color="#FF0000">已取消</Tag>
          }
        },
        }, {
          title: '物流公司',
          dataIndex: 'expressCorpName',
          key: 'expressCorpName',
          width: 100,
        }, {
          title: '物流单号',
          dataIndex: 'expressNo',
          key: 'expressNo',
          width: 130,
        }, {
          title: '批次号',
          dataIndex: 'batchNo',
          key: 'batchNo',
          width: 100,
        }, {
          title: '商品',
          dataIndex: 'skuNo',
          key: 'skuNo',
          width: 130,
          render: (text) => {
            const ovwhieed = {
              width: 130,
              overflow: 'hidden',/*内容超出后隐藏*/
              textOverflow: 'ellipsis',/* 超出内容显示为省略号*/
              whiteSpace: 'nowrap',/*文本不进行换行*/
            }
            const test = text.replace(';', ';\n')
            const overlayStyle = {
              width: 160,
              textAlign: 'center',
            }
            return(
              <Tooltip title={test} overlayStyle={overlayStyle}>
                <div style={ovwhieed}>{text}</div>
              </Tooltip>
            )
          }
        }, {
          title: '卖家留言',
          dataIndex: 'buyerRemark',
          key: 'buyerRemark',
          width: 100,
        }, {
          title: '收货地址',
          dataIndex: 'address',
          key: 'address',
          width: 100,
        }, {
          title: '收货人',
          dataIndex: 'receiver',
          key: 'receiver',
          width: 100,
        }, {
          title: '手机',
          dataIndex: 'mobileNo',
          key: 'mobileNo',
          width: 100,
        }, {
          title: '预估重量',
          dataIndex: 'estimateWeight',
          key: 'estimateWeight',
          width: 100,
        }, {
          title: '实际称重',
          dataIndex: 'actualWeight',
          key: 'actualWeight',
          width: 100,
        }, {
          title: '运费',
          dataIndex: 'expressAmount',
          key: 'expressAmount',
          width: 100,
        }, {
          title: '物流电话',
          dataIndex: 'expressTel',
          key: 'expressTel',
          width: 100,
        }, {
          title: '送货时间',
          dataIndex: 'deliveryTime',
          key: 'deliveryTime',
          width: 100,
          render: text => {
            if (text < 0) {
              return (
                ''
              )
            } else {
              return (
                (moment(text).format('YYYY-MM-DD'))
              )
            }
          },
        }, {
          title: '预计到货时间',
          dataIndex: 'arrivalTime',
          key: 'arrivalTime',
          width: 100,
          render: text => {
            if (text < 0) {
              return (
                ''
              )
            } else {
              return (
                (moment(text).format('YYYY-MM-DD'))
              )
            }
          },
        }]
        // 表格参数
        const tableProps = {
          toolbar: tabelToolbar,
          noSelected: false,
          dataSource: list,
          total,
          ...page,
          loading,
          columns,
          bordered: true,
          nameSpace: 'treasury',
          tableName: 'treasuryTable',
          dispatch: this.props.dispatch,
          selectedRows,
          selectedRowKeys,
          rowKey: 'billNo',
        }
        // 搜索栏
        const searchBarItem = [
          {
            decorator: 'orderNodata',
            components: (
              <Select size="small" placeholder="请选择查询订单号" onChange={this.orderNoonchange}>
                <Option value="orderNo">内部订单号</Option>
                <Option value="siteOrderNo">线上订单号</Option>
                <Option value="billNo">出仓单号</Option>
                <Option value="expressNo">快递单号</Option>
              </Select>
              ),
          },
          {
            decorator: this.state.orderNodata,
            components: (<Input placeholder={this.state.orderNodata === 'orderNod' ? `${this.state.orderText}` : `请输入${this.state.orderText}`} size="small" />),
          },
          {
              decorator: 'startBillDate',
              components: <DatePicker
                disabledDate={this.disabledStartDate}
                format="YYYY-MM-DD"
                onChange={this.onStartChange}
                onOpenChange={this.handleStartOpenChange}
                size={config.InputSize}
                placeholder="单据开始日期"
                />,
          },
          {
            decorator: 'endBillDate',
            components: <DatePicker
              disabledDate={this.disabledEndDate}
              format="YYYY-MM-DD"
              onChange={this.onEndChange}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange}
              size={config.InputSize}
              placeholder="单据截止日期" />,
        },
          {
            decorator: 'deliveryWarehouseNo',
            components: (
              <Select size="small" placeholder="请选择发货仓">
                <Option value="0">主仓</Option>
                <Option value="1">分仓</Option>
                <Option value="2">第三方仓</Option>
              </Select>
              ),
          },
          {
            decorator: 'billStatus',
            components: (
              <Select size="small" placeholder="请选择出库订单状态">
                <Option value="0">待发货</Option>
                <Option value="1">已发货待出库</Option>
                <Option value="2">已出库</Option>
                <Option value="3">已取消</Option>
              </Select>
              ),
          },
          {
            decorator: 'skuNodata',
            components: (
              <Select size="small" placeholder="请选择商品编码" onChange={this.skuNodata}>
                <Option value="skuNo">商品编码</Option>
                <Option value="productNo">款式编码</Option>
              </Select>
              ),
          },
          {
            decorator: this.state.skuNodata,
            components: (<Input placeholder={this.state.skuNodata === 'skuNod' ? `${this.state.skuNoText}` : `请输入${this.state.skuNoText}`} size="small" />),
          },
          {
            decorator: 'shopNo',
            components: (
              <Select
                placeholder="请选择店铺"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onFocus={this.stocu}
                size="small"
                style={{ marginTop: 4 }}
                // key="shopNo123"
                showSearch
                // labelInValue
              >
                {this.state.shops ? this.state.shops.map((ele) => {return(<Option value={ele.shopNo}>{ele.shopName}</Option>)}) : ''}
              </Select>
              ),
          },
          {
            decorator: 'expressCorpNo',
            components: (
              <Select size="small" placeholder="请选择快递公司">
                {expressList ? expressList.map(ele => <Option key={ele.expressCorpNo} value={ele.expressCorpNo}>{ele.expressCorpName}</Option>) : ''}
              </Select>
              ),
          },
          {
            decorator: 'receiver',
            components: <Input placeholder="请输入收货人" size="small" />,
          },
          {
            decorator: 'buyerRemark',
            components: <Input placeholder="请输入备注" size="small" />,
          },
        ]
        // 搜索栏参数
        const searchBarProps = {
          colItems: searchBarItem,
          dispatch: this.props.dispatch,
          nameSpace: 'treasury',
          searchParam,
        }
        // const props = {
        //   nameSpace: 'manager',
        //   dispatch: this.props.dispatch,
        //   searchParam: this.props.manager.searchParam,
        // }
        return (
          <div>
            <div className={styles.contentBoard}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  <SearchBar {...searchBarProps} />
                  {/* <SearchBar {...props} /> */}
                </div>
                <Jtable {...tableProps} />
              </div>
            </div>
            <OrderNos orderNos={this.state.orderNos} show={this.state.showOrderNos} hideModal={() => this.setState({ showOrderNos: false })} />
            {this.state.orderDetail ? <OrderDetail show={this.state.orderDetail} hideModal={() => this.setState({ orderDetail: false, record: {} })} record={this.state.record} /> : null}
          </div>
        )
    }
}

