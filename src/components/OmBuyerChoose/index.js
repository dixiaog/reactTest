/*
 * @Author: tanmengjia
 * @Date: 2018-02-05 16:15:30
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-12 10:07:30
 * 用户选择页面
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Select, Input, message, Modal, Form } from 'antd'
import Jtable from '../../components/JcTable'
import SearchBar from '../../components/SearchBar'
import styles from './index.less'

const { Option } = Select

@connect(state => ({
    omBuyerChoose: state.omBuyerChoose,
    omBuyer: state.omBuyer,
}))
@Form.create()
export default class OmBuyerChoose extends Component {
  constructor(props) {
    super(props)
    this.state = {
    //   buyerModalVisiable: false,
    //   add: false,
    //   selectData: {},
    }
  }
  componentDidMount() {
    this.props.dispatch({ type: 'omBuyerChoose/fetch' })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
    this.props.dispatch({ type: 'omBuyerChoose/clean' })
  }
  handleOk = (selectedRows) => {
    if (!this.props.omBuyerChoose.selectedRows.length) {
      message.warning('请选择客户')
    } else {
      this.props.chooseBuyer(selectedRows, () => {
        this.props.form.resetFields()
        this.props.itemModalHidden()
        this.props.dispatch({ type: 'omBuyerChoose/clean' })
      })
    }
    // this.props.form.resetFields()
    // this.props.itemModalHidden()
    // this.props.dispatch({ type: 'omBuyerChoose/clean' })
  }
  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows, sites, tabelToolbarJ } = this.props.omBuyerChoose
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
        title: '买家账号',
        dataIndex: 'siteBuyerNo',
        key: 'siteBuyerNo',
        width: 80,
    }, {
        title: '商店站点',
        dataIndex: 'siteName',
        key: 'siteName',
        width: 50,
      }, {
        title: '用户姓名',
        dataIndex: 'receiver',
        key: 'receiver',
        width: 70,
      }, {
        title: '联系地址',
        dataIndex: 'address',
        key: 'address',
        width: 70,
      }, {
        title: '电话',
        dataIndex: 'telNo',
        key: 'telNo',
        width: 80,
      }, {
        title: '手机',
        dataIndex: 'mobileNo',
        key: 'mobileNo',
        width: 80,
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 70,
        // render: (text) => {
        //   if (text < 0) {
        //     return ''
        //   } else {
        //     return moment(text).format('YYYY-MM-DD HH:mm:ss')
        //   }
        // },
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      }, {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 70,
        // render: (text) => {
        //   if (text < 0) {
        //     return ''
        //   } else {
        //     return moment(text).format('YYYY-MM-DD HH:mm:ss')
        //   }
        // },
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    }]
    const tableProps = {
        // toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'omBuyerChoose',
        tableName: 'omBuyerChooseTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'buyerNo',
        scroll: { x: 1500, y: 300 },
        rowSelection: tabelToolbarJ ? { type: 'radio' } : {},
        custormTableClass: 'tablecHeightFix340',
    }
    const searchBarItem = [{
        decorator: 'siteName',
        components: (
          <Select placeholder="客户来源站点" size="small" style={{ marginTop: 4 }}>
            {sites.length ? sites.map((ele, index) => { return <Option key={index} value={ele.siteName}>{ele.siteName}</Option> }) : ''}
          </Select>
        ),
    }, {
      decorator: 'receiver',
      components: <Input placeholder="用户姓名" size="small" />,
    }, {
      decorator: 'siteBuyerNo',
      components: <Input placeholder="买家账号" size="small" />,
    },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'omBuyerChoose',
      searchParam,
    }
    return (
      <Modal
        className="omBuyerChoose"
        maskClosable={false}
        title="选择客户"
        visible={this.props.buyerChooseVisiable}
        onCancel={this.handleCancel}
        // onOk={this.handleOk.bind(this, selectedRows)}
        width="1000px"
        bodyStyle={{
        minHeight: 500,
        }}
        footer={[
          <Button key="submit" type="primary" onClick={this.handleOk.bind(this, selectedRows)}>
            确认选择的用户
          </Button>,
        ]}
      >
        <div className={styles.contentBoard111}>
          <div className={styles.tableList} >
            <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </div>
      </Modal>
    )
  }
}
