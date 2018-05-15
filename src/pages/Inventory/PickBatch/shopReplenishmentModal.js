/*
 * @Author: Wupeng
 * @Date: 2018-04-11 09:51:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-21 14:40:25
 * 生成门店补货
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Input, Card, Button, DatePicker, InputNumber, Checkbox, Select, Tooltip } from 'antd'
// import numeral from 'numeral'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import { setLocalStorageItem } from '../../../utils/utils'
import { getSite } from '../../../services/api'
import { getAllShop } from '../../../services/utils'
import styles from './index.less'

const Option = Select.Option
@connect(state => ({
  // shopreple: state.shopreple,
  createBatch: state.createBatch,
}))
export default class ShopReplenishment extends Component {
    constructor(props) {
        super(props)
        this.state = {
          sites: [],
          shops: [],
        }
    }
    componentWillMount() {
      this.props.dispatch({
        type: 'createBatch/fetch',
        payload: {
          batchType: this.props.batchType,
        },
      })
      getSite().then((json) => {
        const sites = json.map(e => {
          return {
            shortName: e.shortName,
            siteName: e.siteName,
          }
        })
        this.setState({
          sites,
        })
      })
      getAllShop().then((json) => {
        const shops = json.map(e => {
          return {
            shopNo: e.shopNo,
            shopName: e.shopName,
          }
        })
        this.setState({
          shops,
        })
      })
    }
    handleCancel = () => {
      this.props.hidden()
    }
    changeMaxNumber = (e) => {
      setLocalStorageItem('maxNumber',e)
    }
    export = () => {
      this.props.dispatch({
        type: 'createBatch/storeExport',
      })
    }
    CASFR = () => {
      this.props.dispatch({
        type: 'createBatch/CASFR',
      })
    }
 render() {
    const { shops, sites } = this.state
    // const { batchType } = this.props
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.createBatch
    const searchBarItem = [
        {
          decorator: 'orderTime',
          components: <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss" width={120} placeholder="截止时间" size="small" />,
        }, {
            decorator: 'maxNumber',
            components: <InputNumber onChange={this.changeMaxNumber.bind(this)} placeholder="最大订单数" size="small" />,
          }].concat(
          [{
            decorator: 'siteShortName',
            components: <Select placeholder="平台" size="small" >
              {sites.length && sites.map(e => <Option key={e.shortName}>{e.siteName}</Option>)}
            </Select>,
          }, {
            decorator: 'shopNo',
            components: <Select placeholder="店铺" size="small" >
              {shops.length && shops.map(e => <Option key={e.shopNo}><Tooltip title={e.shopName}>{e.shopName}</Tooltip></Option>)}
            </Select>,
          },  {
            decorator: 'startLocationNo',
            components: <Input size="small" placeholder="起始仓位" />,
          },
          {
            decorator: 'endLocationNo',
            components: <Input size="small" placeholder="结束仓位" />,
          }, {
            decorator: 'elevatedFlag',
            components: <Checkbox size="small" >高架拣货</Checkbox>,
          }],
          [{
            decorator: 'accordingToOrder',
            components: <Checkbox size="small" >根据订单</Checkbox>,
          }]
        )
        
        // 操作栏
    const tabelToolbar = [
      <Button
        key={0}
        type="primary"
        premission="PICKBATCH_CREATEMORE"
        size="small"
       // disabled={selectedRowKeys.length === 0}
       onClick={this.CASFR.bind(this)}
      >生成批次</Button>,
      <Button
        key={1}
        type="primary"
        premission="PICKBATCH_STOREEXPOR"
        size="small"
        onClick={this.export.bind(this)}
      >
          导出
      </Button>,
          ]
// 搜索栏参数
const searchBarProps = {
  colItems: searchBarItem,
  dispatch: this.props.dispatch,
  nameSpace: 'createBatch',
  searchParam,
  requestParam: { batchType: this.props.batchType },
  }
  // 下单时间 订单编号 数量 货号 颜色 尺码 
  // timeType orderNo billNo productList  productSpec
 const columns = [
  // {
  //   title: '商品编码',
  //   dataIndex: 'skuNo',
  //   key: 'skuNo',
  //   width: 100,
  // },
  {
    title: '下单时间',
    dataIndex: 'orderTime',
    key: 'orderTime',
    width: 100,
  }, 
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 100,
  }, 
  {
    title: '数量',
    dataIndex: 'deliveryNum',
    key: 'deliveryNum',
    width: 100,
  }, 
  {
    title: '货号',
    dataIndex: 'skuNo',
    key: 'skuNo',
    width: 100,
  }, 
  {
    title: '规格',
    dataIndex: 'productSpec',
    key: 'productSpec',
    width: 100,
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
        nameSpace: 'createBatch',
        tableName: 'createBatchTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'skuNo',
        scroll: { y: 300 },
        custormTableClass: 'tablecHeightFix500',
    }
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        footer={null}
        width={1000}
        maskClosable={false}
        onCancel={this.handleCancel}
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
    )
}
}
