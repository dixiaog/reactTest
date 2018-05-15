/*
 * @Author: chenjie 
 * @Date: 2018-04-21 08:59:32 
 * 选择缺货批次
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Input, Card, Tag, DatePicker, Checkbox, Select } from 'antd'
import moment from 'moment'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from './index.less'

const Option = Select.Option
@connect(state => ({
    selectBatch: state.selectBatch,
}))
export default class SelectBatchModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          startValue: null,
          endValue: null,
        }
    }
    componentWillMount() {
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.visible !== nextProps.visible && nextProps.visible) {
        this.props.dispatch({
          type: 'selectBatch/fetch',
          payload: { billNoList: this.props.billNoList },
        })
      }
    }
    onStartChange = value => {
      this.onChange("startValue", value)
    }
  
    onEndChange = value => {
      this.onChange("endValue", value)
    }
    onChange = (field, value) => {
      this.setState({
        [field]: value,
      })
    }
    disabledEndDate = endValue => {
      const startValue = this.state.startValue
      if (!endValue || !startValue) {
        return false
      }
      return endValue.valueOf() <= startValue.valueOf()
    }
  
    disabledStartDate = startValue => {
      const endValue = this.state.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    }
    handleCancel = () => {
      this.props.hidden()
    }
  render() {
      const { list, total, loading, selectedRows, selectedRowKeys, searchParam } = this.props.selectBatch
      const searchBarItem = [
        // 搜索栏
        {
          decorator: "billNo",
          components: <Input placeholder="批次号" size="small" />,
        },
        {
          decorator: "startBillDate",
          components: (
            <DatePicker disabledDate={this.disabledStartDate} format="YYYY-MM-DD" placeholder="开始时间" size="small" onChange={this.onStartChange} onOpenChange={this.handleStartOpenChange} />
          ),
        },
        {
          decorator: "endBillDate",
          components: (
            <DatePicker disabledDate={this.disabledEndDate} format="YYYY-MM-DD" placeholder="结束时间" size="small" onChange={this.onEndChange} onOpenChange={this.handleEndOpenChange} />
          ),
        },
        {
          decorator: "batchMark",
          components: <Input placeholder="标志" size="small" />,
        },
        {
          decorator: "operateUser",
          components: (
            <Select className={styles.operateUser} mode="multiple" placeholder="拣货员" size="small">
              {this.props.operateUsers && this.props.operateUsers.length
                ? this.props.operateUsers.map((e, i) => (
                    <Option key={i} value={e}>
                      {e}
                    </Option>
                  ))
                : null}
            </Select>
          ),
        },
        {
          decorator: "skuNo",
          components: <Input placeholder="商品编码" size="small" />,
        },
        {
          decorator: "billType",
          components: (
            <Select placeholder="拣货类型" size="small">
              <Option key="0">单件批次</Option>
              <Option key="1">多件批次</Option>
              <Option key="2">直发批次</Option>
              <Option key="3">现场大单</Option>
              <Option key="4">补货批次</Option>
              <Option key="5">唯品会批次</Option>
              <Option key="6">移库下架</Option>
              <Option key="7">门店补货</Option>
            </Select>
          ),
        },
        {
          decorator: "billStatus",
          components: (
            <Select placeholder="批次状态" size="small">
              <Option key="0">等待拣货</Option>
              <Option key="1">正在拣货</Option>
              <Option key="2">终止拣货</Option>
              <Option key="3">已完成</Option>
            </Select>
          ),
        },
        {
          decorator: "arrangeStatus",
          components: (
            <Select placeholder="安排情况" size="small">
              <Option key="0">未安排</Option>
              <Option key="1">部分安排</Option>
              <Option key="2">已安排</Option>
            </Select>
          ),
        },
      ]
          
    
  // 搜索栏参数
  const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'selectBatch',
      searchParam,
    }
  const columns = [
  {
    title: '拣货批次',
    dataIndex: 'billNo',
    key: 'billNo',
    width: 100,
    // render: (text, record) => <a >{text}</a>,
  },
  {
    title: '类型',
    dataIndex: 'billType',
    key: 'billType',
    width: 100,
    render: text => {
        switch(text*1) {
            case 0:
            return <Tag color="green">单件批次</Tag>
            case 1:
            return <Tag color="volcano">多件批次</Tag>
            case 2:
            return <Tag color="orange">直发批次</Tag>
            case 3:
            return <Tag color="magenta">现场大单</Tag>
            case 4:
            return <Tag color="gold">补货批次</Tag>
            case 5:
            return <Tag color="cyan">唯品会批次</Tag>
            case 6:
            return <Tag color="blue">移库下架</Tag>
            case 7:
            return <Tag color="geekblue">门店补货</Tag>
            default:
            return <Tag color="red">未知</Tag>
        }
    },
  },
  {
    title: '订单数',
    dataIndex: 'numberOfOrders',
    key: 'numberOfOrders',
    className: styles.columnRight,
    width: 70,
  },
  {
    title: '单品种类数',
    dataIndex: 'singleSkuNum',
    key: 'singleSkuNum',
    className: styles.columnRight,
    width: 120,
  },
  {
    title: '商品总数',
    dataIndex: 'billNum',
    key: 'billNum',
    className: styles.columnRight,
    width: 120,
  },
  {
    title: '已拣数',
    dataIndex: 'pickedNum',
    key: 'pickedNum',
    className: styles.columnRight,
    width: 70,
  },
  {
    title: '未拣数',
    dataIndex: 'unPickedNum',
    key: 'unPickedNum',
    className: styles.columnRight,
    width: 70,
  },
  {
    title: '缺货数',
    dataIndex: 'stockoutNum',
    key: 'stockoutNum',
    className: styles.columnRight,
    width: 70,
  },
  {
    title: '状态',
    dataIndex: 'billStatus',
    key: 'billStatus',
    width: 120,
    render: text => {
        switch(text*1) {
            case 0:
            return <Tag color="#87d068">等待拣货</Tag>
            case 1:
            return <Tag color="#2db7f5">正在拣货</Tag>
            case 2:
            return <Tag color="magenta">终止拣货</Tag>
            case 3:
            return <Tag color="#108ee9">已完成</Tag>
            default:
            return <Tag color="red">未知</Tag>
        }
    },
  },
  {
    title: '安排情况',
    dataIndex: 'arrangeStatus',
    key: 'arrangeStatus',
    width: 120,
    render: text => {
        switch(text*1) {
            case 0:
            return <Tag color="#87d068">未安排</Tag>
            case 1:
            return <Tag color="magenta">部分安排</Tag>
            case 2:
            return <Tag color="#108ee9">已安排</Tag>
            default:
            return <Tag color="red">未知</Tag>
        }
    },
  },
  {
    title: '生成日期',
    dataIndex: 'billDate',
    key: 'billDate',
    width: 120,
    render: e => moment(e).format('YYYY-MM-DD'),
  },
  {
    title: '标志',
    dataIndex: 'batchMark',
    key: 'batchMark',
    width: 120,
  },{
    title: '混合拣货',
    dataIndex: 'isMixed',
    key: 'isMixed',
    width: 120,
    render: e => <Checkbox checked={e} />,
  }]
      // 表格参数
      const tableProps = {
          noSelected: false,
          dataSource: list,
          total,
          loading,
          columns,
          nameSpace: 'selectBatch',
          tableName: 'selectBatchTable',
          dispatch: this.props.dispatch,
          selectedRows,
          selectedRowKeys,
          rowKey: 'billNo',
          scroll: { y: 300, x: 1500 },
          custormTableClass: 'tablecHeightFix500',
      }
      return (
        <Modal
          title="指定拣货批次"
          visible={this.props.visible}
          width={1000}
          maskClosable={false}
          onCancel={this.handleCancel}
          onOk={() => {
            this.props.handleSelect(selectedRowKeys)
          }}
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
