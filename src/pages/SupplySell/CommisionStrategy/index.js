/*
 * @Author: tanmengjia
 * @Date: 2018-01-23 14:18:20
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 15:29:13
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Select, Input, Dropdown, Icon, Menu, message, DatePicker, Checkbox } from 'antd'
import Jtable from '../../../components/JcTable'
import config from '../../../utils/config'
import SearchBar from '../../../components/SearchBar'
import styles from '../SupplySell.less'
import { checkPremission, effectFetch } from '../../../utils/utils'
import CommisionStrategyModal from './CommisionStrategyModal'
import { enableCommisionStrategy } from '../../../services/supplySell/commisionStrategy'

const { Option } = Select
const balanceType = (record) => {
  if (record.balanceType * 1 === 0) {
    return '订单现结佣金'
  } else if (record.balanceType * 1 === 1) {
    return '订单现结费用'
  } else if (record.balanceType * 1 === 2) {
    return '定期结算佣金'
  } else if (record.balanceType * 1 === 3) {
    return '定期结算+现结佣金'
  }
}
const balanceMode = (record) => {
    if (record.balanceMode * 1 === 0) {
      return '固定金额'
    } else if (record.balanceMode * 1 === 1) {
      return '按比例'
    }
  }
@connect(state => ({
    commisionStrategy: state.commisionStrategy,
}))
export default class CommisionStrategy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemModalVisiable: false,
      add: false,
      selectData: null,
      startValue: null,
      endValue: null,
    }
  }
  componentDidMount() {
    effectFetch('commisionStrategy', this.props.dispatch)
    // const { commisionStrategy } = getOtherStore()
    // if (!commisionStrategy || commisionStrategy.list.length === 0) {
    //   this.props.dispatch({ type: 'commisionStrategy/fetch' })
    // }
    this.props.dispatch({ type: 'commisionStrategy/getDistributor' })
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
  editModal = (record) => {
    this.setState({
      itemModalVisiable: true,
      selectData: record,
      add: false,
    })
  }
handleMenuClick = (e) => {
    const values = {}
    if (e.key * 1 === 0) {
      Object.assign(values, {
        enableStatus: 0,
      })
    } else if (e.key * 1 === 1) {
      Object.assign(values, {
        enableStatus: 1,
      })
    }
      const ids = []
      this.props.commisionStrategy.selectedRows.forEach((ele) => {
        if ((e.key > ele.enableStatus) || (e.key < ele.enableStatus)) {
          if (ele.ID === undefined) {
            ids.push(ele.strategyNo)
          } else {
            ids.push(ele.ID)
          }
        }
      })
      if (ids.length === 0) {
        message.warn('未选择菜单或状态无需变更')
      } else {
        Object.assign(values, {
          strategyNos: ids.join(','),
        })
        enableCommisionStrategy(values).then((json) => {
          if (json) {
            this.props.dispatch({
              type: 'commisionStrategy/clean',
            })
            this.props.dispatch({
              type: 'commisionStrategy/search',
            })
          }
        })
    }
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
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows, fxLevelMax } = this.props.commisionStrategy
    // const { startValue, endValue } = this.state
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
        title: '佣金策略名称',
        dataIndex: 'strategyName',
        key: 'strategyName',
        width: 150,
    }, {
        title: '优先级',
        dataIndex: 'priorityLevel',
        key: 'priorityLevel',
        width: 60,
        className: styles.columnRight,
      },
      {
          title: '操作',
          dataIndex: 'opreation',
          key: 'opreation',
          width: 60,
          // className: styles.columnCenter,
          render: (text, record) => {
            // return (
            //   <span>
            if (checkPremission('COMMISION_SAVE')) {
              return <a onClick={this.editModal.bind(this, record)}>编辑</a>
            }
            //   </span>
            // )
          },
      }, {
        title: '起始生效时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
        width: 120,
        render: text => (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30' ? moment(text).format('YYYY-MM-DD') : null),
      }, {
        title: '终止生效时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 120,
        render: text => (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30' ? moment(text).format('YYYY-MM-DD') : null),
      }, {
        title: '启用',
        dataIndex: 'enableStatus',
        key: 'enableStatus',
        width: 80,
        className: styles.columnCenter,
        render: (text, record) => (
          <Checkbox checked={record.enableStatus} />
        ),
      }, {
        title: '金额上限',
        dataIndex: 'upperLimit',
        key: 'upperLimit',
        width: 80,
        className: styles.columnRight,
      }, {
        title: '金额下限',
        dataIndex: 'lowerLimit',
        key: 'lowerLimit',
        width: 80,
        className: styles.columnRight,
      }, {
        title: '分销商等级',
        dataIndex: 'distributorLevel',
        key: 'distributorLevel',
        width: 100,
        className: styles.columnCenter,
        render: (text, record) => {
            // distributorLevel(text, record)
            return (
              text > 0 ? <div>{text}级分销商</div> : null
            )
          },
      }, {
        title: '分销商',
        dataIndex: 'distributorName',
        key: 'distributorName',
        width: 150,
      }, {
        title: '结算类型',
        dataIndex: 'balanceType',
        key: 'balanceType',
        width: 120,
        render: (text, record) => (
            balanceType(record)
          ),
      }, {
        title: '结算方式',
        dataIndex: 'balanceMode',
        key: 'balanceMode',
        width: 80,
        render: (text, record) => (
            balanceMode(record)
          ),
      }, {
        title: '结算值',
        dataIndex: 'balanceValue',
        key: 'balanceValue',
        width: 100,
        className: styles.columnRight,
    }]
    const itemModalProps = {
        distributor: this.props.commisionStrategy.distributor,
        itemModalVisiable: this.state.itemModalVisiable,
        dispatch: this.props.dispatch,
        fxLevelMax,
        add: this.state.add,
        selectData: this.state.selectData,
        itemModalHidden: () => {
          this.props.dispatch({ type: 'commisionStrategy/clear' })
          this.setState({
            itemModalVisiable: false,
            add: false,
            selectData: null,
          })
        },
      }
    const menu = (
      <Menu onClick={this.handleMenuClick} key="menu">
        <Menu.Item key="1" premission="COMMISION_ENABLE">启用</Menu.Item>
        <Menu.Item key="0" premission="COMMISION_ENABLE">禁用</Menu.Item>
      </Menu>
    )
    const tabelToolbar = [
      <Button key="COMMISION_SAVE" type="primary" size="small" onClick={() => { this.setState({ itemModalVisiable: true, add: true }) }} premission="COMMISION_SAVE">添加佣金策略</Button>,
      <Dropdown key="COMMISION_ENABLE" overlay={menu} disabled={selectedRows.length === 0} premission="COMMISION_ENABLE">
        <Button type="primary" size="small" premission="COMMISION_ENABLE">
          启用/禁用 <Icon type="down" />
        </Button>
      </Dropdown>,
    ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'commisionStrategy',
        tableName: 'commisionStraTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'strategyNo',
        scroll: { x: 1370 },
    }
    const searchBarItem = [{
      decorator: 'strategyName',
      components: <Input placeholder="佣金策略名称" size="small" />,
    }, {
      decorator: 'beginTime',
      components: (<DatePicker
        size={config.InputSize}
        placeholder="有效起始时间起"
        disabledDate={this.disabledStartDate}
        onChange={this.onStartChange}
      />),
    }, {
      decorator: 'endTime',
      components: (<DatePicker
        size={config.InputSize}
        placeholder="有效结束时间止"
        disabledDate={this.disabledEndDate}
        onChange={this.onEndChange}
      />),
    }, {
      decorator: 'distributorLevel',
      components: (
        <Select placeholder="分销等级" size="small" style={{ marginTop: 4 }}>
          <Option value="1" disabled={fxLevelMax < 1}>1级分销商</Option>
          <Option value="2" disabled={fxLevelMax < 2}>2级分销商</Option>
          <Option value="3" disabled={fxLevelMax < 3}>3级分销商</Option>
          <Option value="4" disabled={fxLevelMax < 4}>4级分销商</Option>
          <Option value="5" disabled={fxLevelMax < 5}>5级分销商</Option>
        </Select>
      ),
    }, {
        decorator: 'distributorNo',
        components: (
          <Select placeholder="分销商" size="small" style={{ marginTop: 4 }}>
            {this.props.commisionStrategy.distributor && this.props.commisionStrategy.distributor.length ?
              this.props.commisionStrategy.distributor.map(e => <Option key={e.distributorNo}>{e.distributorName}</Option>) : []}
          </Select>
        ),
        // ),
      },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'commisionStrategy',
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
        { this.state.itemModalVisiable ? <CommisionStrategyModal {...itemModalProps} /> : null }
      </div>
    )
  }
}
