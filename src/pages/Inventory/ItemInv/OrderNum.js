/*
 * @Author: tanmengjia
 * @Date: 2018-03-28 20:01:11
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-09 15:06:42
 * 商品库存订单占有数
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Form, Card } from 'antd'
import styles from '../Inventory.less'
import Jtable from '../../../components/JcTable'

const columns = [{
  title: '序号',
  dataIndex: 'key',
  key: 'key',
  width: 60,
  render: (text, record, index) => {
    return (
      <span>
        {index + 1}
      </span>)
    },
  }, {
    title: '内部订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 90,
    }, {
    title: '线上订单号',
    dataIndex: 'siteOrderNo',
    key: 'siteOrderNo',
    width: 100,
    render: (text) => {
      if (text) {
        const ii = text.split(',')
        return (
          <div>{ii[ii.length-1]}</div>
        )
      }
    }
    }, {
    title: '买家账号',
    dataIndex: 'siteBuyerNo',
    key: 'siteBuyerNo',
    width: 100,
    }, {
    title: '店铺',
    dataIndex: 'shopName',
    key: 'shopName',
    width: 100,
    }, {
    title: '状态',
    dataIndex: 'orderStatus',
    key: 'orderStatus',
    width: 100,
    render: (text) => {
      switch (text) {
      case (0):
      return '待付款'
      case (1):
      return '已付款待审核'
      case (2):
      return '发货中'
      case (3):
      return '已发货'
      case (4):
      return '异常'
      case (10):
      return '已客审待财审'
      case (20):
      return '等待第三方发货'
      case (40):
      return '已取消'
      case (41):
      return '被合并'
      case (42):
      return '被拆分'
      default:
    }
    },
    }, {
    title: '下单时间',
    dataIndex: 'orderTime',
    key: 'orderTime',
    width: 120,
    render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
    }, {
    title: '数量',
    dataIndex: 'orderNum',
    key: 'orderNum',
    width: 60,
    className: styles.columnRight,
  }]

@connect(state => ({
  orderNum: state.orderNum,
  }))
  @Form.create()
export default class MainStorehouse extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
      }
      componentWillMount() {
        this.props.dispatch({ type: 'orderNum/search', payload: { skuNo: this.props.skuNo } })
        this.props.dispatch({ type: 'orderNum/setSkuNo', payload: this.props.skuNo })
      }
      handleCancel = () => {
        this.props.form.resetFields()
        this.props.itemModalHidden()
      }
render() {
    const { list1, loading1, total1, page } = this.props.orderNum
    const tableProps = {
        noListChoose: true,
        noSelected: true,
        dataSource: list1,
        total: total1,
        isPart: true,
        ...page,
        loading: loading1,
        columns,
        nameSpace: 'orderNum',
        tableName: 'orderNumTable',
        custormTableClass: 'tablecHeightFix340',
        dispatch: this.props.dispatch,
        rowKey: 'autoNo',
        scroll: { y: 300 },
    }
    return (
      <div>
        <Modal
          className="mainStorehouse"
          maskClosable={false}
          title="已下单未发货列表(指定商品包含在组合装中,不能准确反应,已付款锁定库存的,该列表并未排除未付款的订单)"
          visible={this.props.orderNumVisiable}
          onCancel={this.handleCancel}
          width="1000px"
          bodyStyle={{
            minHeight: 500,
          }}
          footer={[
            // <Button key="submit" type="primary" onClick={this.handleCancel}>
            //   确定
            // </Button>,
          ]}
        >
          <Card bordered={false}>
            <div className={styles.tableList}>
              <Jtable {...tableProps} />
            </div>
          </Card>
        </Modal>
      </div>
    )
  }
}
