/*
 * @Author: tanmengjia
 * @Date: 2018-05-09 15:41:10
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 21:30:03
 * 装箱信息
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Card, Button, Select, Input } from 'antd'
import SearchBar from '../../../components/SearchBar'
import styles from './VipOutWh.less'
import Jtable from '../../../components/JcTable'

const { Option } = Select

@connect(state => ({
  // vipOutWh: state.vipOutWh,
  // vipOutWhModal: state.vipOutWhModal,
  details: state.details,
}))
@Form.create()
export default class Details extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount() {
    if (this.props.selectData) {
      this.props.dispatch({
        type: 'details/fetch',
        payload: { autoNo: this.props.selectData.autoNo },
      })
    }
  }
  componentWillReceiveProps(nextProps) {

  }
  handleOk = () => {
    this.props.detailHidden()
    this.props.dispatch({
      type: 'details/reset',
    })
  }
  handleCancel = () => {
    this.props.detailHidden()
    this.props.dispatch({
      type: 'details/reset',
    })
  }
  render() {
    const { list, loading, total, page, searchParam } = this.props.details
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
      title: '箱号',
      dataIndex: 'casecode',
      key: 'casecode',
      width: 150,
    }, {
      title: '商品编号',
      dataIndex: 'skuNo',
      key: 'skuNo',
      width: 150,
    }, {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'billNo',
      width: 120,
    }, {
      title: '数量',
      dataIndex: 'skuNum',
      key: 'skuNum',
      width: 80,
    }, {
      title: '是否上传',
      dataIndex: 'isUpload',
      key: 'isUpload',
      width: 80,
      render: (text) => {
        if (text * 1 === 0) {
          return '未上传'
        } else if (text * 1 === 1) {
          return '已上传'
        }
      },
    }]
    const tableProps = {
        // toolbar: tabelToolbar,
        noListChoose: true,
        noSelected: true,
        dataSource: list,
        total,
        isPart: true,
        ...page,
        loading,
        columns,
        nameSpace: 'choosePO',
        tableName: 'choosePOTable',
        custormTableClass: 'tablecHeightFix340',
        dispatch: this.props.dispatch,
        rowKey: 'poNo',
        scroll: { y: 300 },
    }
    const searchBarItem = [{
      decorator: 'casecode',
      components: <Input placeholder="箱号" size="small" />,
    }, {
      decorator: 'skuNo',
      components: <Input placeholder="商品编码" size="small" />,
    }, {
      decorator: 'isUpload',
      components: (
        <Select placeholder="上传状态" size="small" style={{ marginTop: 4 }}>
          <Option key={0} value={0}>未上传</Option>
          <Option key={1} value={1}>已上传</Option>
        </Select>
      ),
    }]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'details',
      searchParam,
    }
    return (
      <div>
        <Modal
          maskClosable={false}
          title="装箱信息"
          visible={this.props.detailVisible}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          width={1000}
          bodyStyle={{
            minHeight: 500,
          }}
          footer={[
            <Button key={0} type="primary" onClick={this.handleOk}>
              确定并返回
            </Button>,
          ]}
        >
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <SearchBar {...searchBarProps} />
              </div>
              <Jtable {...tableProps} />
            </div>
          </Card>
        </Modal>
      </div>
    )
  }
}
