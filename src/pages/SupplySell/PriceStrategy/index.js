/*
 * @Author: tanmengjia
 * @Date: 2018-01-22 18:43:15
 * @Last Modified by: tanmengjia
 * 设定特殊价格策略
 * @Last Modified time: 2018-05-14 10:41:16
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Select, Input, Popconfirm, Divider, DatePicker, Popover, notification } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from '../SupplySell.less'
import config from '../../../utils/config'
import StrategyChild from './StrategyChild'
import ImportPriceStrategy from './ImportPriceStrategy'
import StrategyModal from './StrategyModal'
import { checkPremission, effectFetch } from '../../../utils/utils'
import { deletePriceStrategy } from '../../../services/supplySell/priceStrategy'

const { Option } = Select
const timeType = (record) => {
  if (record.timeType === 0) {
    return '下单时间'
  } else if (record.timeType === 1) {
    return '付款时间'
  } else if (record.timeType === 2) {
    return '推送时间'
  }
}
const specifyType = (record) => {
  if (record.specifyType === 0) {
    return 'SKU指定'
  } else if (record.specifyType === 1) {
    return '货号指定'
  }
}

@connect(state => ({
  priceStrategy: state.priceStrategy,
}))
export default class PriceStrategy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      importModalVisiable: false,
      add: false,
      selectData: null,
      strategyNo: null,
      flag: true,
      startValue: null,
      endValue: null,
    }
  }
  componentDidMount() {
    // const { priceStrategy } = getOtherStore()
    // if (!priceStrategy || priceStrategy.list.length === 0) {
    //   this.props.dispatch({ type: 'priceStrategy/fetch' })
    // }
    effectFetch('priceStrategy', this.props.dispatch)
    this.props.dispatch({ type: 'priceStrategy/getDistributor' })
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }
  onStartChange = (value) => {
    this.onChange('startValue', value)
  }
  onEndChange = (value) => {
    this.onChange('endValue', value)
  }
  popContent = (record) => {
    return (
      <div>
        <StrategyChild
          record={record}
          hideModal={() => {
            this.setState({
              flag: true,
              strategyNo: null,
            })
            this.props.dispatch({ type: 'priceStrategy/clean' })
          }}
        />
      </div>
    )
}
editModal = (record) => {
  const payload = {
    specifyType: record.specifyType,
    strategyNo: record.strategyNo,
  }
  this.props.dispatch({ type: 'priceStrategy/getChild', payload })
  this.setState({
    itemModalVisiable: true,
    selectData: record,
    add: false,
  })
}
confirm = (id) => {
  const payload = { strategyNo: id }
  deletePriceStrategy(payload).then((json) => {
    if (json) {
      notification.success({
        message: '操作成功',
      })
      this.props.dispatch({
        type: 'priceStrategy/search',
       })
    }
  })
}
exportStrategy = () => {
  this.props.dispatch({
    type: 'priceStrategy/exportStrategy',
    payload: { strategyNo: this.props.priceStrategy.selectedRows[0].strategyNo, specifyType: this.props.priceStrategy.selectedRows[0].specifyType, IDLst: [], fileName: '供销价格策略商品资料.xls' },
  })
}
disabledStartDate = (startValue) => {
  const endValue = this.state.endValue
  if (!startValue || !endValue) {
    return false
  }
  return startValue.valueOf() > endValue.valueOf()
}
disabledEndDate = (endValue) => {
  const startValue = this.state.startValue
  if (!endValue || !startValue) {
    return false
  }
  return endValue.valueOf() <= startValue.valueOf()
}
  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows, distributor, childs } = this.props.priceStrategy
    const importModalProps = {
      strategyNo: selectedRows && selectedRows.length ? selectedRows[0].strategyNo : '',
      specifyType: selectedRows && selectedRows.length ? selectedRows[0].specifyType : '',
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          importModalVisiable: false,
        })
      },
      importModalVisiable: this.state.importModalVisiable,
    }
    const itemModalProps = {
      childs,
      distributor,
      itemModalVisiable: this.state.itemModalVisiable,
      dispatch: this.props.dispatch,
      add: this.state.add,
      selectData: this.state.selectData,
      itemModalHidden: () => {
        this.props.dispatch({ type: 'priceStrategy/clean' })
        this.setState({
          itemModalVisiable: false,
          add: false,
          selectData: null,
        })
      },
    }
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 40,
        render: (text, record, index) => {
          return (
            <span>
              {index + 1}
            </span>)
          },
      }, {
        title: '策略名称',
        dataIndex: 'strategyName',
        key: 'strategyName',
        width: 100,
        render: (text, record) => (
          <Popover
            visible={record.strategyNo === this.state.strategyNo ? !false : false}
            placement="right"
            content={this.popContent(record)}
            trigger="click"
            onVisibleChange={() => {
              if (this.state.flag) {
                this.props.dispatch({ type: 'priceStrategy/getChild', payload: { specifyType: record.specifyType, strategyNo: record.strategyNo } })
                this.setState({
                  flag: false,
                  strategyNo: record.strategyNo,
                })
              }
            }}
          >
            <a>{text}</a>
          </Popover>
        ),
      }, {
        title: '优先级',
        dataIndex: 'priorityLevel',
        key: 'priorityLevel',
        width: 40,
      }, {
        title: '操作',
        dataIndex: 'opreation',
        key: 'opreation',
        width: 70,
        className: styles.columnCenter,
        render: (text, record) => {
          if (checkPremission('PRICESTRETEGY_SAVE')) {
            return (
              <span>
                <a onClick={this.editModal.bind(this, record)}>详情</a>
                <Divider type="vertical" />
                <Popconfirm placement="top" title="你确定要删除这行内容?" onConfirm={this.confirm.bind(this, record.strategyNo)} okText="确定" cancelText="取消">
                  <a>删除</a>
                </Popconfirm>
              </span>
            )
          }
        },
      }, {
        title: '生效时间类型',
        dataIndex: 'timeType',
        key: 'timeType',
        width: 60,
        render: (text, record) => (
          timeType(record)
        ),
      }, {
        title: '起始生效时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
        width: 80,
        render: text => (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30' ? moment(text).format('YYYY-MM-DD') : null),
      }, {
        title: '终止生效时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 80,
        render: text => (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30' ? moment(text).format('YYYY-MM-DD') : null),
      }, {
        title: '指定分销商',
        dataIndex: 'specifyDistributorNanme',
        key: 'specifyDistributorNanme',
        width: 150,
      }, {
        title: '指定类型',
        dataIndex: 'specifyType',
        key: 'specifyType',
        width: 60,
        render: (text, record) => (
          specifyType(record)
        ),
    }]
    const tabelToolbar = [
      <Button key="PRICESTRETEGY_SAVE"
        type="primary"
        size="small"
        onClick={() => { this.setState({ itemModalVisiable: true, add: true }) }}
        premission="PRICESTRETEGY_SAVE"
      >添加策略</Button>,
      <Button key="IMPORT"
        type="primary"
        size="small"
        onClick={() => { this.setState({ importModalVisiable: true }) }}
        disabled={selectedRows.length === 0}
        premission="PRICESTRETEGY_IMPORT"
      >导入商品</Button>,
      <Button key="PRICESTRETEGY_EXPORT"
        type="primary"
        size="small"
        onClick={this.exportStrategy}
        disabled={selectedRows.length === 0}
        premission="PRICESTRETEGY_EXPORT"
      >导出商品</Button>,
    ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'priceStrategy',
        tableName: 'priceStrategyTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'strategyNo',
        scroll: { x: 1500 },
        rowSelection: {
          type: 'radio',
        },
        class: styles.tableEllipsis,
    }
    const searchBarItem = [{
      decorator: 'strategyName',
      components: <Input placeholder="策略名称" size="small" />,
    }, {
      decorator: 'specifyType',
      components: (
        <Select placeholder="指定类型" size="small" style={{ marginTop: 4 }}>
          <Option value="1">货号指定</Option>
          <Option value="0">SKU指定</Option>
        </Select>
      ),
    }, {
      decorator: 'beginTime',
      components: (<DatePicker
        size={config.InputSize}
        placeholder="生效时间起"
        disabledDate={this.disabledStartDate}
        onChange={this.onStartChange}
      />),
    }, {
      decorator: 'endTime',
      components: (<DatePicker
        size={config.InputSize}
        placeholder="生效时间止"
        disabledDate={this.disabledEndDate}
        onChange={this.onEndChange}
      />),
    }, {
      decorator: 'skuNo',
      components: <Input placeholder="商品编码/款式编码" size="small" />,
    }, {
      decorator: 'distributorNo',
      components: (
        <Select placeholder="分销商" size="small" style={{ marginTop: 4 }}>
          {this.props.priceStrategy.distributor && this.props.priceStrategy.distributor.length
            ?
            this.props.priceStrategy.distributor.map(e => <Option key={e.distributorNo}>{e.distributorName}</Option>) : []}
        </Select>
      ),
    }, {
        decorator: 'timeType',
      components: (
        <Select placeholder="生效时间类型" size="small" style={{ marginTop: 4 }}>
          <Option value="0">下单时间</Option>
          <Option value="1">付款时间</Option>
          <Option value="2">推送时间</Option>
        </Select>
      ),
    },
    //   decorator: 'shopNo',
    //   components: (
    //     <Select placeholder="店铺" size="small" style={{ marginTop: 4 }}>
    //       {this.state.shops.map(ele => <Option key={ele.autoNo} value={ele.shopNo}>{ele.shopName}</Option>)}
    //     </Select>
    //   ),
    // }, {
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'priceStrategy',
      searchParam,
      clearState: () => {
        this.setState({
          startValue: null,
          endValue: null,
        })
      },
      clear: 1,
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
        { this.state.itemModalVisiable ? <StrategyModal {...itemModalProps} /> : null }
        <ImportPriceStrategy {...importModalProps} />
      </div>
    )
  }
}
