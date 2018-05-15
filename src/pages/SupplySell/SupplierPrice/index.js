/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 10:46:37
 * 供销-设定商品供销价格
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import update from 'immutability-helper'
import { Avatar, Button, Input, Select, Popconfirm, Divider, message, Tag } from 'antd'
import styles from '../SupplySell.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import DefaultRate from './DefaultRate'
import ModifyPrice from './ModifyPrice'
import ImportPrice from './ImportPrice'
import { exportDB, listEdit } from '../../../services/supplySell/supplierPrice'
import { getLocalStorageItem, checkPremission, effectFetch } from '../../../utils/utils'

const tishi = (
  <div>
    <div style={{ textAlign: 'left' }}>价格不能输入空格</div>
    <div style={{ textAlign: 'left' }}>价格不能大于等于100000</div>
    <div style={{ textAlign: 'left' }}>价格不能小于等于-100000</div>
    <div style={{ textAlign: 'left' }}>价格小数位数不能超过3位</div>
    <div style={{ textAlign: 'left' }}>价格不能以.开始</div>
    <div style={{ textAlign: 'left' }}>价格不能以.结尾</div>
  </div>)
const content1 = (
  <div>
    <span>吊牌价有误,请修改.</span>
    {tishi}
  </div>
)
const content2 = (
  <div>
    <span>供销价格有误,请修改.</span>
    {tishi}
  </div>
)
const content3 = (
  <div>
    <span>分销售价有误,请修改.</span>
    {tishi}
  </div>
)

const Option = Select.Option
const EditableCell = ({ editable, value, onChange, save }) => (
  <div>
    {editable
      ? <Input onPressEnter={save} maxLength="9" defaultValue={value} style={{ margin: '-5px 0' }} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)

@connect(state => ({
  supplierPrice: state.supplierPrice,
}))
export default class SupplierPrice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      dataCopy: [],
      defaultRate: false,
      modifyPrice: false,
      importPrice: false,
    }
    this.columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 50,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>
          )
        },
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (text) => {
        return <Avatar shape="square" src={text} />
      },
    },
    {
      title: '款式编码',
      dataIndex: 'productNo',
      key: 'productNo',
      width: 120,
    },
    {
      title: '商品编码',
      dataIndex: 'skuNo',
      key: 'skuNo',
      width: 120,
    },
    {
      title: '颜色及规格',
      dataIndex: 'productSpec',
      key: 'productSpec',
      width: 120,
    },
    {
      title: '商品名',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
    }, {
      title: '启用状态',
      dataIndex: 'enableStatus',
      key: 'enableStatus',
      width: 100,
      render: (text) => {
        switch (text) {
        case 0:
          return <Tag color="red">禁用</Tag>
        case 1:
          return <Tag color="#2db7f5">启用</Tag>
        default:
          return <Tag color="#87d068">备用</Tag>
        }
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      render: (text, record) => {
        const { editable } = record
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.save(record.skuNo)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm title="确定取消编辑?" onConfirm={() => this.cancel(record.skuNo)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                : checkPremission('SUPPLIERPRICE_EDIT') ?
                  <span><a onClick={() => this.edit(record.skuNo)}>编辑</a></span> : null
            }
          </div>
        )
      },
    }, {
      title: '吊牌价',
      dataIndex: 'tagPrice',
      key: 'tagPrice',
      width: 100,
      render: (text, record) => this.renderColumns(text, record, 'tagPrice'),
    }, {
      title: '1级供销价格',
      dataIndex: 'supplyPrice1',
      key: 'supplyPrice1',
      width: 100,
      render: (text, record) => this.renderColumns(text, record, 'supplyPrice1'),
    }, {
      title: '2级供销价格',
      dataIndex: 'supplyPrice2',
      key: 'supplyPrice2',
      width: 100,
      render: (text, record) => this.renderColumns(text, record, 'supplyPrice2'),
    }, {
      title: '3级供销价格',
      dataIndex: 'supplyPrice3',
      key: 'supplyPrice3',
      width: 100,
      render: (text, record) => this.renderColumns(text, record, 'supplyPrice3'),
    }, {
      title: '4级供销价格',
      dataIndex: 'supplyPrice4',
      key: 'supplyPrice4',
      width: 100,
      render: (text, record) => this.renderColumns(text, record, 'supplyPrice4'),
    }, {
      title: '5级供销价格',
      dataIndex: 'supplyPrice5',
      key: 'supplyPrice5',
      width: 100,
      render: (text, record) => this.renderColumns(text, record, 'supplyPrice5'),
    }, {
      title: '1级分销管控价格',
      dataIndex: 'distributionPrice1',
      key: 'distributionPrice1',
      width: 120,
      render: (text, record) => this.renderColumns(text, record, 'distributionPrice1'),
    }, {
      title: '2级分销管控价格',
      dataIndex: 'distributionPrice2',
      key: 'distributionPrice2',
      width: 120,
      render: (text, record) => this.renderColumns(text, record, 'distributionPrice2'),
    }, {
      title: '3级分销管控价格',
      dataIndex: 'distributionPrice3',
      key: 'distributionPrice3',
      width: 120,
      render: (text, record) => this.renderColumns(text, record, 'distributionPrice3'),
    }, {
      title: '4级分销管控价格',
      dataIndex: 'distributionPrice4',
      key: 'distributionPrice4',
      width: 120,
      render: (text, record) => this.renderColumns(text, record, 'distributionPrice4'),
    }, {
      title: '5级分销管控价格',
      dataIndex: 'distributionPrice5',
      key: 'distributionPrice5',
      width: 120,
      render: (text, record) => this.renderColumns(text, record, 'distributionPrice5'),
    }, {
      title: '成本价',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 100,
    }, {
      title: '国际条形码',
      dataIndex: 'barcode',
      key: 'barcode',
      width: 100,
    }]
    this.cacheData = this.state.data.map(item => ({ ...item }))
  }

  componentDidMount() {
    // this.props.dispatch({ type: 'supplierPrice/fetch' })
    effectFetch('supplierPrice', this.props.dispatch)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: [],
      dataCopy: [],
    })
    if (nextProps.supplierPrice.list.length) {
       this.setState({
        data: nextProps.supplierPrice.list,
        dataCopy: nextProps.supplierPrice.list,
      })
    }
  }
  // 导出所有符合条件的单据
  exportAll = () => {
    exportDB(this.props.supplierPrice.searchParam)
  }
  default = () => {
    this.setState({ defaultRate: true })
    this.props.dispatch({
      type: 'supplierPrice/getDefault',
      payload: { CompanyNo: `${getLocalStorageItem('companyNo')}` },
    })
  }
  modifyPrice = () => {
    if (this.props.supplierPrice.selectedRows.length) {
      this.setState({
        modifyPrice: true,
      })
    } else {
      message.warning('至少选择一条数据')
    }
  }
  save(key) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    let retailPrice = 0
    let supplyPrice = 0
    let distributionPrice = 0
    const waitCheck = ['tagPrice', 'supplyPrice1', 'supplyPrice1', 'supplyPrice2', 'supplyPrice3', 'supplyPrice4',
    'supplyPrice5', 'distributionPrice1', 'distributionPrice2', 'distributionPrice3', 'distributionPrice4', 'distributionPrice5']
    waitCheck.forEach((ele) => {
      const bool = target[ele] ? (target[ele].toString().indexOf('.') !== -1 ? (target[ele].toString().split('.')[1].length > 10 ? !false : false) : false) : false
      if (target[ele]) {
        if (isNaN(target[ele])) {
          if (ele.charAt(0) === 'r') {
            retailPrice++
          } else if (ele.charAt(0) === 's') {
            supplyPrice++
          } else {
            distributionPrice++
          }
        } else if (target[ele] <= -100000) {
          if (ele.charAt(0) === 'r') {
            retailPrice++
          } else if (ele.charAt(0) === 's') {
            supplyPrice++
          } else {
            distributionPrice++
          }
        } else if (target[ele] >= 100000) {
          if (ele.charAt(0) === 'r') {
            retailPrice++
          } else if (ele.charAt(0) === 's') {
            supplyPrice++
          } else {
            distributionPrice++
          }
        } else if ((target[ele].toString()).indexOf(' ') !== -1) {
          if (ele.charAt(0) === 'r') {
            retailPrice++
          } else if (ele.charAt(0) === 's') {
            supplyPrice++
          } else {
            distributionPrice++
          }
        } else if ((target[ele].toString()).charAt(0) === '.') {
          if (ele.charAt(0) === 'r') {
            retailPrice++
          } else if (ele.charAt(0) === 's') {
            supplyPrice++
          } else {
            distributionPrice++
          }
        } else if ((target[ele].toString()).charAt([target[ele].length - 1]) === '.') {
          if (ele.charAt(0) === 'r') {
            retailPrice++
          } else if (ele.charAt(0) === 's') {
            supplyPrice++
          } else {
            distributionPrice++
          }
        } else if (bool) {
          if (ele.charAt(0) === 'r') {
            retailPrice++
          } else if (ele.charAt(0) === 's') {
            supplyPrice++
          } else {
            distributionPrice++
          }
        }
      }
    })

    if (retailPrice !== 0) {
      message.error(content1)
    } else if (supplyPrice !== 0) {
      message.error(content2)
    } else if (distributionPrice !== 0) {
      message.error(content3)
    } else {
      const param = {}
      Object.assign(param, {
        skuNo: target.skuNo,
        autoNo: target.autoNo,
        companyNo: target.companyNo,
        distributionPrice1: target.distributionPrice1,
        distributionPrice2: target.distributionPrice2,
        distributionPrice3: target.distributionPrice3,
        distributionPrice4: target.distributionPrice4,
        distributionPrice5: target.distributionPrice5,
        supplyPrice1: target.supplyPrice1,
        supplyPrice2: target.supplyPrice2,
        supplyPrice3: target.supplyPrice3,
        supplyPrice4: target.supplyPrice4,
        supplyPrice5: target.supplyPrice5,
        tagPrice: target.tagPrice,
      })
      listEdit(param).then((json) => {
        if (json) {
          if (target) {
            delete target.editable
            this.setState({ data: newData })
            this.cacheData = newData.map(item => ({ ...item }))
          }
          this.props.dispatch({ type: 'supplierPrice/search' })
        }
      })
    }
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data]
    let t = null
    const target = newData.filter(item => key === item.skuNo)[0]
    newData.forEach((ele, index) => {
      if (key === ele.skuNo) {
        t = index
      }
    })
    const NewData = update(newData, { [t]: { $merge: { [column]: value } } })
    if (target) {
      this.setState({ data: NewData })
    }
  }
  edit(key) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    if (target) {
      target.editable = true
      this.setState({ data: newData })
    }
  }
  cancel(key) {
    const newData = [...this.state.dataCopy]
    const target = newData.filter(item => key === item.skuNo)[0]
    if (target) {
      Object.assign(target, this.state.dataCopy.filter(item => key === item.skuNo)[0])
      delete target.editable
      this.setState({ data: this.state.dataCopy })
    }
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.skuNo, column)}
        save={() => this.save(record.skuNo)}
      />
    )
  }
  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.supplierPrice
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'skuNo',
        components: (<Input placeholder="商品编码|款式编码|条形码" size="small" />),
      },
      {
        decorator: 'productName',
        components: (<Input placeholder="商品名称" size="small" />),
      },
      {
        decorator: 'enableStatus',
        components: (
          <Select placeholder="启用状态" size="small">
            <Option value="">全部</Option>
            <Option value="0">禁用</Option>
            <Option value="1">启用</Option>
            <Option value="2">备用</Option>
          </Select>),
      },
    ]

    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'supplierPrice',
      searchParam,
    }

    // 操作栏
    const tabelToolbar = [
      <Button premission="SUPPLIERPRICE_DEFAUL" type="primary" size="small" onClick={this.default}>设定默认供销折扣率</Button>,
      <Button premission="SUPPLIERPRICE_MODIFY"	type="primary" size="small" onClick={this.modifyPrice}>批量调整分销价格</Button>,
      <Button premission="SUPPLIERPRICE_IMPORT" type="primary" size="small" onClick={() => { this.setState({ importPrice: true }) }}>导入更新价格</Button>,
      <Button premission="SUPPLIERPRICE_EXPORT" type="primary" size="small" onClick={this.exportAll}>导出所有符合条件的单据</Button>,
      <span premission="TRUE" style={{ color: 'red', backgroundColor: '#fff2e6', padding: '4px' }}>供销价格为负(小于0)则禁止该级供销商销售</span>,
    ]
    // 表格参数
    const tableProps = {
      toolbar: tabelToolbar,
      dataSource: list,
      total,
      ...page,
      loading,
      columns: this.columns,
      nameSpace: 'supplierPrice',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      scroll: { x: 2300 },
      rowKey: 'skuNo',
      tableName: 'supplierPriceTable',
    }
    const defaultRateProps = {
      show: this.state.defaultRate,
      hideModal: () => { this.setState({ defaultRate: false }) },
    }
    const modifyPriceProps = {
      show: this.state.modifyPrice,
      hideModal: () => { this.setState({ modifyPrice: false }) },
    }
    const importPriceProps = {
      show: this.state.importPrice,
      hideModal: () => { this.setState({ importPrice: false }) },
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
        <DefaultRate {...defaultRateProps} />
        <ModifyPrice {...modifyPriceProps} />
        <ImportPrice {...importPriceProps} />
      </div>
    )
  }
}
