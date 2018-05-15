/*
 * @Author: tanmengjia
 * @Date: 2018-05-08 14:50:25
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 15:28:56
 * 唯品会店铺商品
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Select, Input, notification } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from '../Item.less'
import { deleteAll } from '../../../services/item/vipShopSku'
// import { getOtherStore } from '../../../utils/otherStore'
import { effectFetch } from '../../../utils/utils'
import VipShopSkuModal from './VipShopSkuModal.js'

const { Option } = Select

@connect(state => ({
  vipShopSku: state.vipShopSku,
}))
export default class VipShopSku extends Component {
  constructor(props) {
    super(props)
    this.state = {
      vipModalVisiable: false,
    }
  }
  componentDidMount() {
    // const { vipShopSku } = getOtherStore()
    // if (!vipShopSku || vipShopSku.list.length === 0) {
    //   this.props.dispatch({ type: 'vipShopSku/fetch' })
    // }
    effectFetch('vipShopSku', this.props.dispatch)
    this.props.dispatch({ type: 'vipShopSku/getShopName' })
  }
  componentWillReceiveProps(nextProps) {
  }
  deleteAll = () => {
    const { selectedRowKeys } = this.props.vipShopSku
    deleteAll(selectedRowKeys).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'vipShopSku/search',
        })
        notification.success({
          message: '操作成功',
        })
      }
    })
  }
  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows, lists } = this.props.vipShopSku
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
        title: '店铺',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 140,
      }, {
        title: '商品编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 170,
      }, {
        title: '平台编码',
        dataIndex: 'shopSkuNo',
        key: 'shopSkuNo',
        width: 170,
      }, {
        title: '平台货号',
        dataIndex: 'shopProductNo',
        key: 'shopProductNo',
        width: 170,
      }, {
        title: '修改时间',
        dataIndex: 'lastSyncTime',
        key: 'lastSyncTime',
        width: 200,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null)
      }]
    const tabelToolbar = [
      <Button key={0} type="primary" size="small" premission="VIPSHOPSKU_DELETE" onClick={this.deleteAll} disabled={!(selectedRows && selectedRows.length)}>批量删除</Button>,
      <Button key={2} type="primary" size="small" premission="VIPSHOPSKU_DOWNLOAD" onClick={() => this.setState({ vipModalVisiable: true })}>手动下载商品(按时间)</Button>,
    ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'vipShopSku',
        tableName: 'vipShopSkuTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { x: 930 },
    }
    const searchBarItem = [{
    decorator: 'skuNo',
    components: <Input placeholder="商品编码" size="small" />,
    }, {
      decorator: 'shopNo',
      components: (
        <Select placeholder="店铺" size="small" style={{ marginTop: 4 }}>
          {lists && lists.length ? lists.map(ele => <Option key={ele.shopNo} value={ele.shopNo}>{ele.shopName}</Option>) : ''}
        </Select>
      ),
    }]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'vipShopSku',
      searchParam,
    }
    const vipModalProps = {
      vipModalVisiable: this.state.vipModalVisiable,
      vipModalHidden: () => {
        this.setState({
          vipModalVisiable: false,
        })
      },
      shops: lists,
    }
    return (
      <div>
        <div className={styles.contentBoard}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </div>
        {this.state.vipModalVisiable ? <VipShopSkuModal {...vipModalProps}/> : null}
      </div>
    )
  }
}
