/*
 * @Author: Wupeng
 * @Date: 2017-1-23 10:04:11
 * @Last Modified by;
 * 期初库存
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Icon, Input, Button, Form, message } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import OpeningModal from './openingModal'
import OpeningNew from './OpeningNew'
import DelectModal from './delectModal'
import Deialsmodal from './deialsModal'
import styles from './index.less'
import { selectWarehouse } from '../../../services/opening/opening'
import { effectFetch } from '../../../utils/utils'
// import { getOtherStore } from '../../../utils/otherStore'


@connect(state => ({
    opening: state.opening,
    deialsmodal: state.deialsmodal,
    selectList: [],
  }))
  @Form.create()
  export default class Opening extends Component {
      state = {
        OpeningNewvis: false,
        DelectModalvis: false,
        deialsModalvis: false,
        openingModalvis: false,
        delete: true,
        deialsModalList: {},
        text: '',
        delectnumer: [],
        positionList: [],
      }
      componentDidMount() {
        // 此处获取外部store判断是否需要重新加载页面
        // const { opening } = getOtherStore()
        // if (!opening || opening.list.length === 0) {
        //   this.props.dispatch({ type: 'opening/fetch' })
        // }
        effectFetch('opening', this.props.dispatch)
      }
      componentWillReceiveProps(nextProps) {
        // 判断期初库存强制作废
        // billStatus
        if (nextProps.opening.selectedRows.length > 0) {
          const billStatus = []
          for(let i = 0; i < nextProps.opening.selectedRows.length; i++) {
            billStatus.push(nextProps.opening.selectedRows[i].billStatus)
          }
          // 生效为1 待确认为0 作废为2
          if(billStatus.indexOf(2) === -1 && billStatus.indexOf(0) === 0 && billStatus.indexOf(1) === -1) {
            this.setState({
              delete: false,
            })
          } else {
            this.setState({
              delete: true,
            })
          }
        } else {
          this.setState({
            delete: true,
          })
        }
      }
      onFocusadd = () => {
        this.setState({
            openingModalvis: true,
        })
    }
    // 商品选择modal初始化
    onFocusaddvis = () => {
        this.setState({
            openingModalvis: false,
        })
    }
    //  仓位选择弹框
    onOpeningNewdatavis = () => {
      selectWarehouse({}).then((json) => {
        if (json.length > 0) {
          this.setState({
              positionList: json,
              OpeningNewvis: true,
          })
        } else {
          console.log('没有拿到仓位的数据')
          message.config({
            top: 10,
            duration: 2,
            maxCount: 3,
          })
          message.info('该用户没有仓库')
        }
    })
    }
    onDelectModalvis = (selectedRows) => {
        const billNoList = []
        for (let i= 0; i < selectedRows.length; i++) {
          billNoList.push(selectedRows[i].billNo)
        }
        // console.log(billNo.toString())
        this.props.dispatch({
          type: 'opening/deleteByBillNo',
          payload: {
            billNos: billNoList.toString(),
          },
        })
      // this.props.dispatch({
      //   type: 'opening/deleteByBillNo',
      //   payload: {
      //     billNo: selectedRows[0].billNo,
      //   },
      // })
    }
//  仓位选择弹框
OpeningNewdatavisond = () => {
   this.setState({
    OpeningNewvis: false,
  })
}
// 列表详情页
Raddress = (record) => {
  const payload = record
  this.props.dispatch({
    type: 'deialsmodal/fetch',
    payload,
  })
  this.setState({
    deialsModalvis: true,
    deialsModalList: record,
  })
}
Raddressone = () => {
  this.setState({
    deialsModalvis: false,
    deialsModalList: {},
  })
}
selects = (e) => {
  // console.log(e, '1111')
  this.props.dispatch({
    type: 'opening/paramNome',
    payload: {
      skuNo: e[0].skuNo,
    },
  })
  this.onFocusaddvis()
}
invalidation = (selectedRows) => {
  // const billNo = []
  // for (let i= 0; i < selectedRows.length; i++) {
  //   billNo.push(selectedRows[i].billNo)
  // }
  // // console.log(billNo.toString())
  // this.props.dispatch({
  //   type: 'opening/nullifyStatus',
  //   payload: {
  //     billNo: billNo.toString(),
  //   },
  // })
  this.props.dispatch({
    type: 'opening/nullifyStatus',
    payload: {
      billNo: selectedRows[0].billNo,
    },
  })
}

render() {
  const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.opening
  const searchBarItem = [
    {
      decorator: 'productName',
      components: <Input
        placeholder="请选择包含商品"
        size="small"
        onClick={this.onFocusadd.bind(this)}
        suffix={<Icon type="edit" />}
      />,
    },
    {
      decorator: 'skuNo',
      components: <Input placeholder="商品编码" style={{ marginLeft: '-32%' }} disabled={false} size="small" />,
    },
  ]
  // 操作栏
  const tabelToolbar = [
    <Button key={1} type="primary" premission="OPENING_SAVES" size="small" onClick={this.onOpeningNewdatavis.bind(this)} >添加新的期初库存</Button>,
    <Button
      key={2}
      type="primary"
      size="small"
      premission="OPENING_DELECTBYBILN"
      onClick={this.onDelectModalvis.bind(this, selectedRows)}
      // disabled={(selectedRows.length === 1) ? (selectedRows[0].billStatus === 0) ? !true : true : true}
      disabled={this.state.delete}
    >
      删除
    </Button>,
    <Button
      key={3}
      type="primary"
      size="small"
      premission="OPENING_NULLFYSTATUS"
      disabled={(selectedRows.length === 1) ? (selectedRows[0].billStatus === 1) ? !true : true : true}
      onClick={this.invalidation.bind(this, selectedRows)}
    >强制作废
    </Button>,
    ]
        // 搜索栏参数
    const searchBarProps = {
        colItems: searchBarItem,
        dispatch: this.props.dispatch,
        nameSpace: 'opening',
        searchParam,
      }
        const columns = [{
            title: '期初单号',
            dataIndex: 'billNo',
            key: 'billNo',
            width: '20%',
            render: (text) => {
                return (
                  text
                )
            },
          }, {
            title: '操作',
            dataIndex: 'address',
            key: 'address',
            width: '10%',
            render: (text, record) => {
                return (
                  <a onClick={this.Raddress.bind(this, record)}>详情</a>
                )
            },
          }, {
            title: '单据日期',
            dataIndex: 'billDate',
            key: 'billDate',
            width: '24%',
            render: text => (moment(text).format('YYYY-MM-DD')),
          }, {
            title: '仓库',
            dataIndex: 'warehouseName',
            key: 'warehouseName',
            width: '23%',
            render: (text) => {
                return (
                  text
                )
            },
          }, {
            title: '状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            width: '23%',
            render: (text) => {
                //  单据状态(0: 待确认; 1: 生效; 2: 作废)
                switch (text) {
                    case (0):
                    return '待确认'
                    case (1):
                    return '生效'
                    case (2):
                    return '作废'
                    default:
                }
              },
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
        nameSpace: 'opening',
        tableName: 'openingTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'billNo',
      }
      // 商品选择弹框
      const OpeningModaldata = {
        openingModalvis: this.state.openingModalvis,
        onFocusaddvis: this.onFocusaddvis,
        selects: this.selects,
      }
      // 仓位选择弹框
      const OpeningNewdata = {
          OpeningNewvis: this.state.OpeningNewvis,
          OpeningNewdatavisond: this.OpeningNewdatavisond,
          positionList: this.state.positionList,
      }
      const DelectModaldata = {
        DelectModalvis: this.state.DelectModalvis,
        onDelectModalvis: this.onDelectModalvis,
        text: this.state.text,
        onDelectModalvisone: this.onDelectModalvisone,
        delectnumer: this.state.delectnumer,
      }
      // 详情列表页的数据
      const deialsModaldata = {
        deialsModalvis: this.state.deialsModalvis,
        Raddressone: this.Raddressone,
        deialsModalList: this.state.deialsModalList,
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
              {this.state.openingModalvis ? <OpeningModal data={OpeningModaldata} /> : null}
              {this.state.OpeningNewvis ? <OpeningNew data={OpeningNewdata} /> : null}
              {this.state.DelectModalvis ? <DelectModal data={DelectModaldata} /> : null}
              {this.state.deialsModalvis ? <Deialsmodal data={deialsModaldata} /> : null }
            </div>
          )
      }
  }
