/*
 * @Author: chenjie 
 * @Date: 2018-04-21 09:00:00 
 * 生成拣货批次
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Input, Card, Button, DatePicker, InputNumber, Checkbox, Select, Tooltip, notification} from 'antd'
import moment from 'moment'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import { setLocalStorageItem, getLocalStorageItem } from '../../../utils/utils'
import { getSite } from '../../../services/api'
import { getAllShop } from '../../../services/utils'
import styles from './index.less'
import { zcGenerateBatch, ljGenerateBatch, createMoreThanBatch, createSceneBigSheet } from '../../../services/inventory/pickBatch'

const Option = Select.Option
@connect(state => ({
  createBatch: state.createBatch,
  pickBatch: state.pickBatch,
}))
export default class CreateBatchModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          sites: [],
          shops: [],
          shops1: [],
          maxNumber: getLocalStorageItem('maxNumber') ? getLocalStorageItem('maxNumber') : 40,
          isFirst: true,
          btnloading: false,
        }
    }
    componentWillMount() {
      getSite().then((json) => {
        const sites = json.length && json.map(e => {
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
            siteShortName: e.siteShortName,
          }
        })
          this.setState({
            shops,
            shops1: shops,
          })
      })
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.visible !== nextProps.visible && nextProps.visible) {
        this.props.dispatch({
          type: 'createBatch/clear',
        })
        this.props.dispatch({
          type: 'createBatch/fetch',
          payload: {
            batchType: nextProps.batchType,
          },
        })
      }
    }
    changeShops = (e) => {
      if(e) {
        this.setState({
          shops: this.state.shops1.filter(ele => ele.siteShortName === e),
        })
      } else {
        this.setState({
          shops: shops1,
        })
      }
    }
    handleCancel = () => {
      this.setState({btnloading: false})
      this.props.hidden()
      this.props.dispatch({
        type: 'createBatch/clear',
      })
    }
    changeMaxNumber = (e) => {
      setLocalStorageItem('maxNumber',e)
      this.setState({
        maxNumber: e,
      })
    }
    handleExport = () => {
      const skuInfo = this.props.createBatch.selectedRows.map(e => {return {billNo: e.billNo, skuNo: e.skuNo}})
      console.log('this.props.createBatch.searchParam', this.props.createBatch.searchParam)
      let fileName = ''
      switch (this.props.batchType * 1) {
        case 1:
          fileName = '一单一件(整存)批次.xls'
         break
        case 2:
          fileName = '一单一件(零检)批次.xls'
         break
        case 3:
          fileName = '多件批次.xls'
         break
        case 4:
          fileName = '生成现场取货或大订单批次.xls'
         break
        case 6:
          fileName = '唯品会批次.xls'
         break
        default:
        fileName = '批次.xls'
         break
      }
      this.props.dispatch({
        type: 'createBatch/export',
        payload: {
          batchType: this.props.batchType,
          exportPayload: {
            fileName,
            skuInfo: skuInfo.length === 0 ? null : skuInfo,
            ...this.props.createBatch.searchParam,
          },
        },
      })
    }
    handleGenerateBatch = (searchParam) => {
      this.setState({
        btnloading: true,
      })
      const skuInfo = this.props.createBatch.selectedRows.map(e => {return {billNo: e.billNo}})
      // const searchParam = this.props.createBatch
      const searchP = Object.assign(searchParam,{
        jingDongToPay : searchParam.jingDongToPay && searchParam.jingDongToPay !== 'N' ? 'Y' : 'N',
        accordingToOrder : searchParam.accordingToOrder && searchParam.accordingToOrder !== 'N' ? 'Y' : 'N',
        elevatedFlag : searchParam.elevatedFlag && searchParam.elevatedFlag !== 'N' ? 'Y' : 'N',
      })
      switch (this.props.batchType * 1) {
        case 1 :
        zcGenerateBatch({
          skuInfo: skuInfo.length === 0 ? null : skuInfo,
            ...searchP,
        }).then((json) => {
          if (json.success && json.data) {
            notification.success({ message: json.errorMessage })
            this.props.dispatch({ type: 'pickBatch/search' })
            this.props.dispatch({ type: 'createBatch/clean' })
            this.handleCancel()
          } else {
            this.setState({
              btnloading: false,
            })
          }
        })
        break
        case 2 :
        ljGenerateBatch({
          skuInfo: skuInfo.length === 0 ? null : skuInfo,
            ...searchP,
        }).then((json) => {
          if (json.success && json.data) {
            notification.success({ message: json.errorMessage })
            this.props.dispatch({ type: 'pickBatch/search' })
            this.props.dispatch({ type: 'createBatch/clean' })
            this.handleCancel()
          } else {
            this.setState({
              btnloading: false,
            })
          }
        })
        break
        case 3 :
        createMoreThanBatch({
          skuInfo: skuInfo.length === 0 ? null : skuInfo,
            ...searchP,
        }).then((json) => {
          if (json.success && json.data) {
            notification.success({ message: json.errorMessage })
            this.props.dispatch({ type: 'pickBatch/search' })
            this.props.dispatch({ type: 'createBatch/clean' })
            this.handleCancel()
          } else {
            this.setState({
              btnloading: false,
            })
          }
        })
        break
        case 4 :
        createSceneBigSheet({
          skuInfo: skuInfo.length === 0 ? null : skuInfo,
            ...searchP,
        }).then((json) => {
          if (json.success && json.data) {
            notification.success({ message: json.errorMessage })
            this.props.dispatch({ type: 'pickBatch/search' })
            this.props.dispatch({ type: 'createBatch/clean' })
            this.handleCancel()
          } else {
            this.setState({
              btnloading: false,
            })
          }
        })
        break
        case 5 :
        break
        case 6 :
        break
        case 7 :
        break
        case 8 :
        break
        case 9 :
        break
        default :
        break
      }
    }
 render() {
    const { shops, sites, shops1, btnloading } = this.state
    const { batchType } = this.props
    const site1 =batchType * 1 === 6 ? sites: sites.filter(e =>  e.shortName !== 'Vip')
    // const siteShortName = this.state.sites.length && this.state.sites.filter(e => e.siteName === '唯品会')[0].shortName
    const shop1 = batchType * 1 === 6 ? shops1.filter(ele => ele.siteShortName === 'Vip') : shops
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.createBatch
    const searchBarItem = [
        {
          decorator: 'orderTime',
          components: <DatePicker
            showTime
            disabledDate={(e)=> e >= moment() }
            format="YYYY-MM-DD HH:mm:ss" placeholder="截止时间" size="small" />,
        }].concat(
          ['1', '2','3','6'].indexOf(batchType) > -1 ? [{
            decorator: 'maxNumber',
            components: <Tooltip title="最大订单数"><InputNumber value={this.state.maxNumber} onChange={this.changeMaxNumber.bind(this)} placeholder="最大订单数" size="small" /></Tooltip>,
          }] : [],
          [{
            decorator: 'shopNo',
            components: <Select placeholder="店铺" size="small" >
              {shop1.length && shop1.map(e => <Option key={e.shopNo}><Tooltip title={e.shopName}>{e.shopName}</Tooltip></Option>)}
            </Select>,
          },{
            decorator: 'siteShortName',
            components: <Select placeholder="平台" size="small" disabled={batchType * 1 === 6} onChange={this.changeShops.bind(this)}>
              {site1.length && site1.map(e => <Option key={e.shortName}>{e.siteName}</Option>)}
            </Select>,
          }],
          batchType === '5' ? [
            {
              decorator: 'startLocationNo',
              components: <Input size="small" placeholder="起始仓位" />,
            },
            {
              decorator: 'endLocationNo',
              components: <Input size="small" placeholder="结束仓位" />,
            },
          ]:[],
          ['1','3','4','5'].indexOf(batchType) > -1 ? [{
            decorator: 'elevatedFlag',
            components: <Checkbox size="small" >高架拣货</Checkbox>,
          }] :[],
          ['1','2','3','4','5','6'].indexOf(batchType) > -1 ? [{
            decorator: 'accordingToOrder',
            components: <Checkbox size="small" >根据订单</Checkbox>,
          }] : [],
          ['1','2','3','4','5'].indexOf(batchType) > -1 ? [{
            decorator: 'jingDongToPay',
            components: <Checkbox size="small" >京东到付</Checkbox>,
          }] : [],
        )
        
        // 操作栏
    const tabelToolbar = [
      <Button
       key={0}
       loading={btnloading}
       type="primary"
       premission="PICKBATCH_CREATE"
       //disabled={selectedRowKeys.length === 0}
       size="small" onClick={btnloading ? null : this.handleGenerateBatch.bind(this, searchParam)}>生成批次</Button>,
      <Button
        key={1}
        type="primary"
        premission="PICKBATCH_EXPORT"
        size="small"
        onClick={this.handleExport.bind(this)}
      >
          导出
      </Button>,
    ]
// 搜索栏参数
console.log('searchParam', searchParam)
const sp = batchType * 1 === 6 ? Object.assign(searchParam, { siteShortName: 'Vip' }) : searchParam
const rp = batchType * 1 === 6 ? { batchType: this.props.batchType, siteShortName: 'Vip' } : { batchType: this.props.batchType }
const searchBarProps = {
    colItems: searchBarItem,
    dispatch: this.props.dispatch,
    nameSpace: 'createBatch',
    searchParam: sp,
    requestParam: rp,
    reset: () => {
      this.setState({
        shops: this.state.shops1,
      })
    }
  }
 const columns = [{
    title: '下单时间',
    dataIndex: 'orderTime',
    key: 'orderTime',
    width: 160,
    render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
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
    dataIndex: 'productNo',
    key: 'productNo',
    width: 200,
  },
  {
    title: '规格',
    dataIndex: 'productSpec',
    key: 'productSpec',
    width: 200,
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
        rowKey: 'autoNo',
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
