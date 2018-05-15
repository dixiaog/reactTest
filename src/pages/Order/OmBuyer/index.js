/*
 * @Author: tanmengjia
 * @Date: 2018-02-05 09:52:13
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 10:25:09
 * 客户管理
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Select, Input } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import { checkPremission, effectFetch } from '../../../utils/utils'
import styles from '../Order.less'
import OmBuyerModal from './OmBuyerModal'
// import { getOtherStore } from '../../../utils/otherStore'

const { Option } = Select

@connect(state => ({
    omBuyer: state.omBuyer,
}))
export default class OmBuyer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buyerModalVisiable: false,
      selectData: null,
      typeData: [],
      add: true,
      select: [],
      columns: [{
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
        title: '买家账号',
        dataIndex: 'siteBuyerNo',
        key: 'siteBuyerNo',
        width: 100,
    }, {
        title: '商店站点',
        dataIndex: 'siteName',
        key: 'siteName',
        width: 80,
      },
      {
          title: '操作',
          dataIndex: 'opreation',
          key: 'opreation',
          width: 80,
          className: styles.columnCenter,
          render: (text, record) => {
            if (checkPremission('OMBUYER_EDIT')) {
              return (
                  <a onClick={this.edit.bind(this, record)}>编辑</a>
              )
            }
          },
      }, {
        title: '用户姓名',
        dataIndex: 'receiver',
        key: 'receiver',
        width: 100,
      }, {
        title: '联系地址',
        dataIndex: 'address',
        key: 'address',
        width: 200,
        render: (text, record) => {
          const { province, city, county, address } = record
          return (
            <div>
              <div>{province ? (city ? (county ? `${province}/${city}/${county}` : `${province}/${city}`) : `${province}`) : null}</div>
              <div>{address ? address : null}</div>
            </div>
          )
        },
      }, {
        title: '电话',
        dataIndex: 'telNo',
        key: 'telNo',
        width: 100,
        render: (text) => {
          return (
            <span>{text ? `*****${text.substring(text.length-3)}` : null}</span>
          )
        },
      }, {
        title: '手机',
        dataIndex: 'mobileNo',
        key: 'mobileNo',
        width: 100,
        render: (text) => {
          return (
            <span>{text ? `${text.substr(0, 3)}*****${text.substr(8)}` : null}</span>
          )
        },
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 100,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      }, {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 100,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    }],
    }
  }
  componentDidMount() {
    // const { omBuyer } = getOtherStore()
    // if (!omBuyer || omBuyer.list.length === 0) {
    //   this.props.dispatch({ type: 'omBuyer/fetch' })
    // }
    effectFetch('omBuyer', this.props.dispatch)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.omBuyer.sites && nextProps.omBuyer.sites.length) {
      const allSites = []
      nextProps.omBuyer.sites.forEach((ele) => {
        allSites.push({ value: ele.siteName, name: ele.siteName })
      })
      this.setState({
        typeData: allSites,
      })
    }
  }
edit = (record) => {
  this.setState({
    buyerModalVisiable: true,
    add: false,
    selectData: record,
  })
}
  render() {
    const { loading, searchParam, total, page, selectedRowKeys, selectedRows, sites, tabelToolbarJ, list } = this.props.omBuyer
    const buyerModalProps = {
        buyerModalVisiable: this.state.buyerModalVisiable,
        dispatch: this.props.dispatch,
        sites,
        selectData: this.state.selectData,
        add: this.state.add,
        itemModalHidden: () => {
          this.props.dispatch({ type: 'omBuyer/search' })
          this.setState({
            buyerModalVisiable: false,
            selectData: null,
            add: true,
          })
        },
      }
    const tabelToolbar = [
      <Button key={0} type="primary" size="small" onClick={() => { this.setState({ buyerModalVisiable: true }) }} premission="OMBUYER_ADD">添加新的客户</Button>,
    ]
    const tableProps = {
        toolbar: tabelToolbarJ ? [] : tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns: this.state.columns,
        nameSpace: 'omBuyer',
        tableName: 'omBuyerTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'buyerNo',
        scroll: { x: 1460 },
        rowSelection: tabelToolbarJ ? { type: 'radio' } : {},
    }
    const searchBarItem = [{
      decorator: 'receiver',
      components: <Input placeholder="客户名" size="small" />,
    }, {
      decorator: 'siteBuyerNo',
      components: <Input placeholder="线上账号，如旺旺" size="small" />,
    }, {
      decorator: 'mobileNo',
      components: <Input placeholder="手机" size="small" />,
    }, {
      decorator: 'siteName',
      components: (
        <Select placeholder="客户来源站点" size="small" style={{ marginTop: 4 }}>
          {sites.length ? sites.map((ele, index) => { return <Option key={index} value={ele.siteName}>{ele.siteName}</Option> }) : ''}
        </Select>
      ),
    },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'omBuyer',
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
        { this.state.buyerModalVisiable ? <OmBuyerModal {...buyerModalProps} /> : null }
      </div>
    )
  }
}
