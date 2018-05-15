/*
 * @Author: Wupeng
 * @Date: 2018-05-02 21:25:01 
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 10:04:24
 * 库存盘点
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import moment from 'moment'
import { DatePicker, Input, Button, Select, Tag, Form } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
// import { getOtherStore } from '../../../utils/otherStore'
import { effectFetch } from '../../../utils/utils'
import config from '../../../utils/config'
import { getWarehouse } from '../../../services/division/division'
import { exportDB } from '../../../services/inventory/stockinventory'




const Option = Select.Option
@connect(state => ({
    stockinventory: state.stockinventory,
}))
@Form.create()
export default class Stockinventory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            childer: [],
            startValue: null,
            endValue: null,
            endOpen: false,
        }
    }
    componentDidMount() {
        // 此处获取外部store判断是否需要重新加载页面
        // const { stockinventory } = getOtherStore()
        // if (!stockinventory || stockinventory.list.length === 0) {
        //   this.props.dispatch({ type: 'stockinventory/fetch' })
        // }
        effectFetch('stockinventory', this.props.dispatch)
        getWarehouse({}).then((json) => {
            if (json) {
                const data = json.length && json.map((k) => {
                    return (
                      <Option key={k.warehouseNo} value={k.warehouseNo}>{k.warehouseName}</Option>
                    )
                  })
                  this.setState({
                    childer: data,
                  })
            }
          })
          this.props.dispatch({
            type: 'stockinventory/fetch',
          })
      }
      componentWillReceiveProps(nextProps) {
        if (nextProps.stockinventory.searchParam.checkTimeEnd === undefined) {
          this.setState({
            endValue: null,
          })
        } 
        if (nextProps.stockinventory.searchParam.checkTimeStart === undefined) {
          this.setState({
            startValue: null,
          })
        }
      }
    //   时间控制
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
// 时间控制
    exportDB = () => {
        const { searchParam } = this.props.stockinventory
        const payload = Object.assign(searchParam,{
          fileName: '出库单.xls',
        })
        exportDB({
          ...payload,
        }).then((json) => {})
      }
    render() {
        const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.stockinventory
        const { endOpen } = this.state
        const searchBarItem = [
            {
              decorator: 'warehouseNo',
              components: <Select style={{ width: 100 }} size="small" placeholder="请选择仓储方">
              {this.state.childer}
            </Select>,
            },
            {
              decorator: 'autoNo',
              components: <Input placeholder="盘点单号" size="small" />,
            },
          {
              decorator: 'checkTimeStart',
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
            decorator: 'checkTimeEnd',
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
                decorator: 'skuNo',
                components: <Input placeholder="商品编码" size="small" />,
            },
       ]
        // 搜索栏参数
        const searchBarProps = {
            colItems: searchBarItem,
            dispatch: this.props.dispatch,
            nameSpace: 'stockinventory',
            searchParam,
        }
        const columns = [
            {
              title: '盘点单号',
              dataIndex: 'autoNo',
              key: 'autoNo',
              width: 100,
            },
            {
              title: '商品编码',
              dataIndex: 'skuNo',
              key: 'skuNo',
              width: 130,
            },
            {
              title: '商品名称',
              dataIndex: 'productName',
              key: 'productName',
              width: 100,
            },
            {
              title: '颜色规格',
              dataIndex: 'productSpec',
              key: 'productSpec',
              width: 100,
            },
            {
              title: '实盘数量',
              dataIndex: 'checkNum',
              key: 'checkNum',
              width: 100,
            },
            {
              title: '盈亏数量',
              dataIndex: 'profitLossNum',
              key: 'profitLossNum',
              width: 100,
            },
            {
              title: '款式编码',
              dataIndex: 'productNo',
              key: 'productNo',
              width: 100,
            },
        // {
        //   title: '供应商款号',
        //   dataIndex: 'productNo',
        //   key: 'productNo',
        //   width: 100,
        // },
            {
               title: '单据日期',
               dataIndex: 'checkTime',
               key: 'checkTime',
               width: 130,
               render: text => (moment(text).format('YYYY-MM-DD HH:mm:ss')),
            },
            {
               title: '状态',
               dataIndex: 'checkStatus',
               key: 'checkStatus',
               width: 100,
               render: (text) => {
                 switch (text) {
                   case 0:
                     return <Tag color="#87d068">待确认</Tag>
                   case 1:
                     return <Tag color="#FF0000">已确认</Tag>
                   default:
                 }
               },
            },
            {
                title: '仓库',
                dataIndex: 'warehouseName',
                key: 'warehouseNo',
                width: 100,
            },
            {
              title: '创建人',
              dataIndex: 'createUser',
              key: 'createUser',
              width: 100,
            },
            // {
            //     title: '备注',
            //     dataIndex: 'remake',
            //     key: 'remake',
            //     width: 100,
            // },
        ]
              // 操作栏
      const tabelToolbar = [
        <Button key={1} type="primary" onClick={this.exportDB.bind(this)} premission="STOCKINVE_EXPORTDB" size="small">导出</Button>,
      ]
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
            nameSpace: 'stockinventory',
            tableName: 'stockinventoryTable',
            dispatch: this.props.dispatch,
            selectedRows,
            selectedRowKeys,
            rowKey: 'autoNo',
        }
        return(
          <div className={styles.contentBoard}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <SearchBar {...searchBarProps} />
              </div>
              <Jtable {...tableProps} />
            </div>
          </div>
        )
    }
}
