/*
 * @Author: chenjie
 * @Date: 2018-01-03 14:32:58
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 09:47:43
 * 店铺管理
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Select, Input, Checkbox, DatePicker, Tag, Menu, Icon, Dropdown, message } from 'antd'
import moment from 'moment'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import config from '../../../utils/config'
import styles from '../Base.less'
import Step1 from './Step1'
import Step2 from './Step2'
import LogModal from './LogModal'
import EditModal from './EditModal'
import { getAuthorize } from '../../../services/system'
import { getLocalStorageItem, effectFetch } from '../../../utils/utils'

const { Option } = Select

@connect(state => ({
  shops: state.shops,
}))

export default class Shops extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step1Visiable: false,
      step2Visiable: false,
      logVisiable: false,
      eidtVisiable: false,
      site: {},
      code: '',
      shop: {},
      startValue: null,
      endValue: null,
      sites: [],
    }
  }

  componentDidMount() {
    // const { shops } = getOtherStore()
    // if (!shops || shops.list.length === 0) {
    //   this.props.dispatch({ type: 'shops/fetch' })
    // }
    effectFetch('shops', this.props.dispatch)
    getAuthorize({ pageSize: 1000, current: 1, enableStatus: 1 }).then((json) => {
      if (json.list.length) {
        this.setState({
          sites: json.list,
        })
      }
    })
  }
  onStartChange = (value) => {
    this.setState({
      startValue: value,
    })
  }
  onEndChange = (value) => {
    this.setState({
      endValue: value,
    })
  }
  handleEdit = (record) => {
    this.setState({
      eidtVisiable: true,
      shop: record,
    })
  }
  modelHidden = () => {
    this.setState({
      step1Visiable: false,
      step2Visiable: false,
      logVisiable: false,
      eidtVisiable: false,
    })
  }
  nextStep = (item, code) => {
    this.setState({
      site: item,
      code,
      step1Visiable: false,
      step2Visiable: true,
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
  enableChage = (e) => {
    const { selectedRows } = this.props.shops
    const values = { enableStatus: e.key }

    const ids = []
    selectedRows.forEach((ele) => {
        ids.push(ele.shopNo)
    })
    if (ids.length === 0) {
      message.warn('未选择菜单或状态无需变更')
    } else {
      Object.assign(values, {
        IDLst: ids,
      })
      this.props.dispatch({
        type: 'shops/enable',
        payload: values,
      })
    }
  }
  shouquan = () => {
    const companyNo = getLocalStorageItem('companyNo')
    const distributorNo = getLocalStorageItem('distributorNo')
    const shopNo = this.props.shops.selectedRowKeys[0]
    this.props.shops.selectedRows[0].siteName
    const chooseSite = this.state.sites.filter(ele => ele.siteName === this.props.shops.selectedRows[0].siteName)[0]
    const urls = chooseSite.authorizeAddress + '&companyNo=' + companyNo + '&shopNo=' + shopNo + '&distributorNo=' + distributorNo
    const win = window.open(urls)
    const loop = setInterval(() => {
      console.log('winwinwin', win)
      console.log('looplooploop', loop)
      if (win.closed) {
        clearInterval(loop)
        this.props.dispatch({ type: 'shops/fetch' })
      }
    }, 1000)
  }
  render() {
    const { sites, list, loading, searchParam, total, page, selectedRowKeys, selectedRows } = this.props.shops
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'siteName',
        components: (
          <Select placeholder="站点名称" size="small" style={{ marginTop: 4 }}>
            {sites.length ? sites.map((ele, index) => { return <Option key={index} value={ele.siteName}>{ele.siteName}</Option> }) : ''}
          </Select>),
      },
      {
        decorator: 'mainAccount',
        components: (<Input placeholder="主账号" size={config.InputSize} />),
      },
      {
        decorator: 'shopName',
        components: (<Input placeholder="店铺名称" size={config.InputSize} />),
      },
      {
        decorator: 'startCreateTime',
        components: (<DatePicker
          size={config.InputSize}
          disabledDate={this.disabledStartDate}
          placeholder="创建时间起"
          onChange={this.onStartChange}
          // onOpenChange={this.handleStartOpenChange}
        />),
      },
      {
        decorator: 'endCreateTime',
        components: (<DatePicker
          size={config.InputSize}
          placeholder="创建时间讫"
          disabledDate={this.disabledEndDate}
          onChange={this.onEndChange}
          // onOpenChange={this.handleStartOpenChange}
        />),
      },
      {
        decorator: 'authorizeStatus',
        components: (
          <Select placeholder="授权状态" size="small" style={{ marginTop: 4 }}>
            <Option value={0}>未授权</Option>
            <Option value={1}>已授权</Option>
            <Option value={2}>已过期</Option>
          </Select>),
      },
      {
        decorator: 'enableStatus',
        components: (
          <Select placeholder="是否启用" size="small" style={{ marginTop: 4 }}>
            <Option value="1">启用</Option>
            <Option value="0">禁用</Option>
          </Select>),
      },
    ]
    const menu = (
      <Menu onClick={this.enableChage.bind(this)} >
        <Menu.Item key={1}><Icon type="check-circle-o" /> 启用</Menu.Item>
        <Menu.Item key={0}><Icon type="close-circle-o" /> 禁用</Menu.Item>
      </Menu>
    )
    // 菜单栏
    const tabelToolbar = [
      <Button key={1} premission="SHOPS_ADD" type="primary" size="small" onClick={() => { this.setState({ step1Visiable: true }) }}>添加店铺</Button>,
      <Button
        key={2}
        premission="TRUE"
        type="primary"
        size="small"
        disabled={!(selectedRowKeys.length && selectedRows.length && selectedRows[0].authorizeStatus !== 1)}
        onClick={this.shouquan}>接口授权</Button>,
      <Button
        key={3}
        premission="TRUE"
        type="primary"
        size="small"
        disabled={selectedRowKeys.length === 0}
        onClick={() => { this.setState({ logVisiable: true }) }}>接口日志</Button>,
      <Dropdown key={4} premission="TRUE" overlay={menu}>
        <Button type="primary" size="small">
            启用/禁用 <Icon type="down" />
        </Button>
      </Dropdown>,
    ]
    const columns = [{
        title: '店铺编号',
        dataIndex: 'shopNo',
        key: 'shopNo',
        width: 120,
      }, {
        title: '店铺名称',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 100,
      }, {
        title: '站点名称',
        dataIndex: 'siteName',
        key: 'siteName',
        width: 100,
      }, {
        title: '店铺简称',
        dataIndex: 'shopShortName',
        key: 'shopShortName',
        width: 100,
      }, {
        title: '操作',
        dataIndex: 'opreation',
        key: 'opreation',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              <a onClick={this.handleEdit.bind(this, record)}>编辑</a>
            </div>)
        },
      }, {
        title: '店铺地址',
        dataIndex: 'shopAddress',
        key: 'shopAddress',
        width: 100,
      }, {
        title: '主账号',
        dataIndex: 'mainAccount',
        key: 'mainAccount',
        width: 100,
      }, {
        title: '负责人',
        dataIndex: 'principal',
        key: 'principal',
        width: 100,
      }, {
        title: '联系电话',
        dataIndex: 'telNo',
        key: 'telNo',
        width: 100,
      }, {
        title: '授权状态',
        dataIndex: 'authorizeStatus',
        key: 'authorizeStatus',
        width: 100,
        render: (text) => {
          if (text === 0) {
            return <Tag color="#2db7f5">未授权</Tag>
          } else if (text === 1) {
            return <Tag color="#87d068">已授权</Tag>
          } else {
            return <Tag color="#f50">已过期</Tag>
          }
        },
      }, {
        title: '过期时间',
        dataIndex: 'expireTime',
        key: 'expireTime',
        width: 100,
        render: text => (moment(text).format('YYYY-MM-DD')),
      }, {
        title: '订单下载',
        dataIndex: 'isOrderDownload',
        key: 'isOrderDownload',
        width: 100,
        render: text => (<Checkbox checked={text} />),
      }, {
        title: '发货上传',
        dataIndex: 'isDeliveryUpload',
        key: 'isDeliveryUpload',
        width: 100,
        render: text => (<Checkbox checked={text} />),
      }, {
        title: '库存上传',
        dataIndex: 'isInventoryUpload',
        key: 'isInventoryUpload',
        width: 100,
        render: text => (<Checkbox checked={text} />),
      }, {
        title: '售后下载',
        dataIndex: 'isSupportDownload',
        key: 'isSupportDownload',
        width: 100,
        render: text => (<Checkbox checked={text} />),
      }, {
        title: '淘宝供销',
        dataIndex: 'isTaobaoSupply',
        key: 'isTaobaoSupply',
        width: 100,
        render: text => (<Checkbox checked={text} />),
      }, {
        title: '启用',
        dataIndex: 'enableStatus',
        key: 'enableStatus',
        width: 60,
        render: text => (<Checkbox checked={text} />),
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 120,
        render: text => (moment(text).format('YYYY-MM-DD')),
      }, {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 120,
        render: text => (moment(text).format('YYYY-MM-DD')),
      },
    ]

     // 表格参数
     const tableProps = {
      toolbar: tabelToolbar,
      rowSelection: { type: 'radio' },
      noSelected: false,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'shops',
      tableName: 'shopsTable',
      rowKey: 'shopNo',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      scroll: { x: 2000 },
    }

    // 搜索栏参数
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'shops',
      searchParam,
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
        <Step1 visiable={this.state.step1Visiable} hidden={this.modelHidden} nextStep={this.nextStep} />
        <Step2
          visiable={this.state.step2Visiable}
          hidden={this.modelHidden}
          site={this.state.site}
          code={this.state.code}
        />
        <LogModal shopNo={selectedRowKeys.length ? selectedRowKeys[0]:0} visiable={this.state.logVisiable} hidden={this.modelHidden} />
        { this.state.eidtVisiable ? <EditModal shop={this.state.shop} visiable={this.state.eidtVisiable} hidden={this.modelHidden} /> : null }
      </div>
    )
  }
}
