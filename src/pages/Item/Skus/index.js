/*
 * @Author: Chen Xinjie
 * @Date: 2017-12-26 10:57:28
 * @Last Modified by: Chen Xinjie
 * @Last Modified time: 2018-05-14 20:43:45
 * 商品库容资料 - 列表
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import update from 'immutability-helper'
import { Button, Avatar, Select, Input, Tag, Popconfirm, Divider, Modal, Alert } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from './Skus.less'
import ImportLimit from './ImportLimit'
import { getOtherStore } from '../../../utils/otherStore'
import { checkPremission, getLocalStorageItem } from '../../../utils/utils'
import { Update } from '../../../services/item/skus'
import EditInputCell from '../../../components/EditInputCell'

const { Option } = Select
@connect(state => ({
  skus: state.skus,
}))
export default class Skus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      importLimitVisiable: false,
      data: [],
      ephemeralData: {},
      dataWhenCancel: [],
      virtualNum1: false,
      columns: [{
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
        title: '图片',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 80,
        render: (text) => {
          return (<Avatar src={text} />)
          },
        }, {
        title: '款式编码',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 120,
        }, {
        title: '商品编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 130,
        }, {
          title: '操作',
          dataIndex: 'opreation',
          key: 'opreation',
          width: 120,
          className: styles.columnCenter,
          render: (text, record) => {
            const { editable } = record
            if (checkPremission('SKUCAPACITY_EDIT')) {
              return (
                <div className="editable-row-operations">
                  {
                    editable ?
                      <span>
                        <Popconfirm title="保存吗?" onConfirm={() => this.save(record.autoNo)}>
                          <a>保存</a>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <a onClick={this.cancel.bind(this, record.autoNo)} >取消</a>
                      </span>
                      : <a onClick={this.edit.bind(this, record.autoNo)} >编辑</a>
                  }
                </div>
              )
            }
          },
        }, {
        title: '商品名',
        dataIndex: 'productName',
        key: 'productName',
        width: 160,
        }, {
        title: '零售库容上限',
        dataIndex: 'retailCapacityLimit',
        key: 'retailCapacityLimit',
        width: 70,
        render: (text, record) => this.renderColumns(text, record, 'retailCapacityLimit'),
        }, {
        title: '整存库容上限',
        dataIndex: 'entireCapacityLimit',
        key: 'entireCapacityLimit',
        width: 70,
        render: (text, record) => this.renderColumns(text, record, 'entireCapacityLimit'),
        }, {
        title: '标准装箱数量',
        dataIndex: 'standardBoxing',
        key: 'standardBoxing',
        width: 120,
        render: (text, record) => this.renderColumns(text, record, 'standardBoxing'),
        }, {
        title: '商品简称',
        dataIndex: 'shortName',
        key: 'shortName',
        width: 130,
        }, {
        title: '颜色及规格',
        dataIndex: 'productSpec',
        key: 'productSpec',
        width: 80,
        }, {
        title: '品牌',
        dataIndex: 'brandName',
        key: 'brandName',
        width: 60,
        }, {
        title: '启用',
        dataIndex: 'enableStatus',
        key: 'enableStatus',
        width: 60,
        render: (text) => {
          if (text * 1 === 1) {
            return <Tag color="#2db7f5" >启用</Tag>
          } else if (text * 1 === 0) {
            return <Tag color="#ccc" >禁用</Tag>
          } else {
            return <Tag color="#87d068">备用</Tag>
          }
        },
        }],
    }
  }

  componentDidMount() {
    // 此处获取外部store判断是否需要重新加载页面
    const { skus } = getOtherStore()
    const tabKeys = getLocalStorageItem('skus')
    const isInTab = tabKeys ? tabKeys.split(',').indexOf('skus') > -1 : false
    if (!skus || (skus.list.length === 0 && !isInTab)) {
      this.props.dispatch({ type: 'skus/fetch' })
    } else {
      this.setState({
        data: skus.list,
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.skus.list,
      dataWhenCancel: nextProps.skus.list,
    })
  }
  importLimit = () => {
    this.setState({
      importLimitVisiable: true,
    })
  }

  exportItem = () => {
    const { searchParam } = this.props.skus
    this.props.dispatch({
      type: 'skus/exportSku',
      payload: { searchParam, fileName: '商品库容资料.xls' },
    })
  }

  handleChange(value, record, column) {
    if (value === '') {
      const index = this.state.data.findIndex(e => e.autoNo === record.autoNo)
      this.setState(update(
        this.state, {
          ephemeralData: {
            [record.autoNo]: { $merge: { [column]: value } },
          },
          data: { [index]: { $merge: { [column]: value } } },
          }
      ))
    } else if (/(-)|(-(\d)|(\d))$/.test(value)) {
      const index = this.state.data.findIndex(e => e.autoNo === record.autoNo)
      this.setState(update(
        this.state, {
          ephemeralData: {
            [record.autoNo]: { $merge: { [column]: value } },
          },
          data: { [index]: { $merge: { [column]: value } } },
          }
      ))
    } else {
      this.setState({
        virtualNum1: true,
      })
    }
  }

  handleOk = () => {
    this.setState({
      virtualNum1: false,
    })
  }

  edit = (autoNo) => {
    const { data } = this.state
    const target = data.filter(item => autoNo === item.autoNo)[0]
    if (target) {
      target.editable = true
      this.setState({ data, ephemeralData: Object.assign(this.state.ephemeralData, { [autoNo]: target }) })
    }
  }
  save(autoNo) {
    const { ephemeralData, data, dataWhenCancel } = this.state
    const target = ephemeralData[autoNo]// newData.filter(item => autoNo === item.autoNo)[0]
    const index = data.findIndex(e => e.autoNo === autoNo)
    delete ephemeralData[autoNo]
    if (target) {
      const payload = {
        autoNo: target.autoNo,
        retailCapacityLimit: target.retailCapacityLimit,
        entireCapacityLimit: target.entireCapacityLimit,
        standardBoxing: target.standardBoxing,
      }
      Update(payload).then((json) => {
        if (json) {
          target.editable = false
          data[index] = target
          dataWhenCancel[index] = target
          this.setState({ data, ephemeralData, dataWhenCancel })
        }
      })
    }
  }
  cancel(autoNo) {
    const { ephemeralData, dataWhenCancel, data } = this.state
    delete ephemeralData[autoNo]
    const target = dataWhenCancel.filter(item => autoNo === item.autoNo)[0]
    target.editable = false
    const index = data.findIndex(e => e.autoNo === autoNo)
    data[index] = target
    this.setState({ data, ephemeralData })
  }
  renderColumns(text, record, column) {
    return (
      <EditInputCell
        editEnable={record.editable}
        value={text}
        autoNo={record.autoNo}
        column={column}
        record={record}
        onInputChange={this.handleChange.bind(this)}
      />
    )
  }

  render() {
    const { loading, searchParam, total, page } = this.props.skus
    // console.log('this.state.data', this.state.data)
    // 菜单栏
    const tabelToolbar = [
      <Button key="1" type="primary" size="small" onClick={this.importLimit.bind()} premission="SKUCAPACITY_IMPORT">导入库容上限</Button>,
      <Button key="0" type="primary" size="small" onClick={this.exportItem.bind(this)} premission="SKUCAPACITY_EXPORT">导出符合条件的单据</Button>,
    ]

    // 表格参数
    const tableProps = {
      toolbar: tabelToolbar,
      noSelected: true,
      dataSource: this.state.data,
      total,
      ...page,
      loading,
      columns: this.state.columns,
      nameSpace: 'skus',
      tableName: 'skusTable',
      dispatch: this.props.dispatch,
      rowKey: 'autoNo',
    }
    // 查询
    const searchBarItem = [{
      decorator: 'skuNo',
      components: <Input placeholder="商品编码|款式编码|国际码" size="small" />,
    }, {
      decorator: 'productName',
      components: <Input placeholder="商品名称" size="small" />,
    }, {
      decorator: 'shortName',
      components: <Input placeholder="商品简称" size="small" />,
    }, {
      decorator: 'productSpec',
      components: <Input placeholder="颜色规格" size="small" />,
    }, {
      decorator: 'enableStatus',
      components: (
        <Select placeholder="状态" size="small" style={{ marginTop: 4 }}>
          <Option value="">全部</Option>
          <Option value={1}>启用</Option>
          <Option value={0}>禁用</Option>
        </Select>
      ),
    },
    ]
    // 搜索栏参数
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'skus',
      searchParam,
    }
    // 导入库容上限
    const importLimitProps = {
      importLimitVisiable: this.state.importLimitVisiable,
      dispatch: this.props.dispatch,
      skuModalHidden: () => {
        this.setState({
          importLimitVisiable: false,
        })
      },
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
        <Modal
          maskClosable={false}
          title="提示"
          visible={this.state.virtualNum1}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          footer={[
            <Button type="primary" key="999" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <Alert message="输入的不是正确的整数，请输入有效的整数" type="warning" showIcon />
        </Modal>
        { this.state.importLimitVisiable ? <ImportLimit {...importLimitProps} /> : null}
      </div>
    )
  }
}
