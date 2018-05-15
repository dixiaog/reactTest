import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Avatar, Input } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from '../Item.less'

const columns = [{
    title: '序号',
    dataIndex: 'key',
    key: 'key',
    width: 80,
    render: (text, record, index) => {
      return (
        <span>
          {index + 1}
        </span>)
      },
  }, {
    title: '图片',
    dataIndex: 'img',
    key: 'img',
    width: 120,
    render: (text) => {
      return (<Avatar src={text} />)
      },
  }, {
    title: '款式编码（货号）',
    dataIndex: 'iId',
    key: 'iId',
    width: 250,
  }, {
    title: '商品编码',
    dataIndex: 'skuNo',
    key: 'skuNo',
    width: 180,
  }, {
    title: '商品名',
    dataIndex: 'productName',
    key: 'productName',
    width: 100,
  }, {
    title: '颜色及规格',
    dataIndex: 'specMapping',
    key: 'specMapping',
    width: 100,
  }, {
    title: '操作人',
    dataIndex: 'creater',
    key: 'creater',
    width: 80,
  }, {
    title: '操作时间',
    dataIndex: 'creatTime',
    key: 'creatTime',
    width: 80,
  }]
@connect(state => ({
    itemDeleteLog: state.itemDeleteLog,
}))
export default class ItemDeleteLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
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
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.itemDeleteLog
    const searchBarItem = [{
        decorator: 'iId',
        components: <Input placeholder="款式编码|款式" size="small" />,
      }, {
        decorator: 'skuNo',
        components: <Input placeholder="商品名称" size="small" />,
      },
      ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'itemDeleteLog',
      searchParam,
    }
    const tableProps = {
        dataSource: list,
        loading,
        columns,
        noSelected: false,
        total,
        ...page,
        nameSpace: 'items',
        tableName: 'itemLogTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
      }
    return (
      <div>
        <Card className={styles.contentBoard}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} style={{ marginBottom: 10 }}>
              <SearchBar {...searchBarProps} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </Card>
      </div>)
  }
}
