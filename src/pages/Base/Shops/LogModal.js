/*
 * @Author: chenjie
 * @Date: 2018-01-05 13:16:39
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-26 14:33:19
 * 日志查看
 */

import React, { Component } from 'react'
import { Modal, Tag } from 'antd'
import moment from 'moment'
import { connect } from 'dva'
import Jtable from '../../../components/JcTable'
import styles from '../Base.less'

const columns = [{
  title: '店铺编码',
  dataIndex: 'shopNo',
  key: 'shopNo',
  width: 100,
}, {
  title: '店铺名称',
  dataIndex: 'shopName',
  key: 'shopName',
  width: 150,
}, {
  title: '站点名称',
  dataIndex: 'siteName',
  key: 'siteName',
  width: 100,
}, {
  title: '接口类型',
  dataIndex: 'interfaceType',
  key: 'interfaceType',
  width: 100,
  render: (text) => {
    switch (text * 1) {
      case 0:
        return <Tag>库存</Tag>
      case 1:
      return <Tag>订单</Tag>
      case 2:
      return <Tag>发货</Tag>
      case 3:
      return <Tag>商品图片</Tag>
      default:
      break
    }
  },
}, {
  title: '间隔(毫秒)',
  dataIndex: 'syncInterval',
  key: 'syncInterval',
  width: 100,
}, {
  title: '最近执行时间',
  dataIndex: 'lastExecuteTime',
  key: 'lastExecuteTime',
  width: 160,
  render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
}, {
  title: '耗时(秒)',
  dataIndex: 'timeConsuming',
  key: 'timeConsuming',
  width: 80,
}, {
    title: '成功(次)',
    dataIndex: 'successCount',
    key: 'successCount',
    width: 80,
  }, {
    title: '失败(次)',
    dataIndex: 'errorCount',
    key: 'errorCount',
    width: 80,
  }, {
    title: '最近出错时间',
    dataIndex: 'lastErrorTime',
    key: 'lastErrorTime',
    render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    width: 200,
  }, {
    title: '最近错误码',
    dataIndex: 'lastErrorCode',
    key: 'lastErrorCode',
    width: 200,
  }, {
    title: '最近错误信息',
    dataIndex: 'lastErrorInfo',
    key: 'lastErrorInfo',
    render: text => {
      return text
    },
  },
]

@connect(state => ({
  shopInterfaceLog: state.shopInterfaceLog,
}))
export default class ExpressLogModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (this.props.visiable !== nextProps.visiable &&  nextProps.visiable) {
      this.props.dispatch({
        type: 'shopInterfaceLog/fetch',
        payload: {
          shopNo: this.props.shopNo,
        },
      })
    }
  }
  onOk = () => {
    
  }
  handleOk = () => {
    this.props.hidden()
  }
  handleCancel = () => {
    this.props.hidden()
  }
  render() {
    const { list, loading, total, page, selectedRowKeys, selectedRows } = this.props.shopInterfaceLog
    const tableProps = {
      rowSelection: { type: 'radio' },
      noSelected: false,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'shopInterfaceLog',
      tableName: 'shopInterfaceLogTable',
      rowKey: 'shopNo',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      scroll: { x: 2000 },
    }
    return (
      <div>
        <Modal
          title="授权接口日志"
          visible={this.props.visiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          <div className={styles.tableList}>
            <Jtable {...tableProps} />
          </div>
        </Modal>
      </div>)
  }
}
