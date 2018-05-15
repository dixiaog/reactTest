/*
 * @Author: Xuxiaobo
 * @Date: 2017-12-19 14:04:11
 * @Last Modified by:
 * 物流快递
 * @Last Modified time:
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Card, Menu, Row, Col, Icon, Button, Divider, Popconfirm, Checkbox } from 'antd'
import Jtable from '../../../components/JcTable'
import styles from '../Base.less'
import exStyles from './Expresslist.less'
import ExpressModal from './ExpressModal'
import ExpressEditModal from './ExpressEditModal'
import ExpressSetElectronicSurfaceModal from './ExpressSetElectronicSurfaceModal'
import ExpressFreightTempModal from './ExpressFreightTempModal'
import ExpressLogModal from './ExpressLogModal'
import { insertExpressconfig } from '../../../services/base/express'
import { checkPremission, effectFetch } from '../../../utils/utils'

const { ItemGroup } = Menu
@connect(state => ({
  expresslist: state.expresslist,
}))
export default class Expresslist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addModalVisiable: false,
      eidtModalVisiable: false,
      setElectronModalVisiable: false,
      freightTempModalVisiable: false,
      logModalVisiable: false,
      electricList: [],
      selectedExpress: {},
      exConfig: {},
    }
  }
  componentDidMount() {
    // const { expresslist } = getOtherStore()
    // if (!expresslist || expresslist.list.length === 0) {
    //   this.props.dispatch({
    //     type: 'expresslist/fetch',
    //   })
    // }
    effectFetch('expresslist', this.props.dispatch)
  }
  setElectronSureface = (record) => {
    if (record.autoNo) { // 单选
      this.setState({
        electricList: [record],
        setElectronModalVisiable: true,
      })
    } else {
      this.setState({
        electricList: this.props.expresslist.list,
        setElectronModalVisiable: true,
      })
    }
  }
  handleOnWhSelect = (value) => {
    const { warehouses } = this.props.expresslist
    const selectWh = warehouses.filter(ele => ele.warehouseNo === value.key * 1)[0]
    this.props.dispatch({
      type: 'expresslist/search',
      payload: {
        selectWh,
      },
    })
    // this.props.dispatch({
    //   type: 'expresslist/search',
    // })
  }
  addModalHidden = () => {
    this.setState({
      addModalVisiable: false,
      eidtModalVisiable: false,
      setElectronModalVisiable: false,
      freightTempModalVisiable: false,
      logModalVisiable: false,
      electricList: [],
    })
  }
  addNewExpress = (exes) => {
    const { selectedWhNo } = this.props.expresslist
    insertExpressconfig({
      warehouseNo: selectedWhNo * 1,
      expresscorpDTO: exes,
    }).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'expresslist/search',
        })
      }
    })
  }
  popConfirm = (e) => {
    this.props.dispatch({
      type: 'expresslist/delete',
      payload: {
        autoNo: e.autoNo,
      },
    })
  }
  editFreightTemp = (record) => {
    this.setState({
      selectedExpress: record,
      freightTempModalVisiable: true,
    })
  }
  eidtModel = (record) => {
    this.setState({
      eidtModalVisiable: true,
      exConfig: record,
    })
  }
    render() {
        const { list, total, loading, selectedRows, selectedRowKeys, page, warehouses,
          selectedWhNo, selectedWhName } = this.props.expresslist
        const columns = [{
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width: 50,
            render: (text, record, index) => {
              return (
                <span>
                  {index + 1}
                </span>)
              },
          }, {
            title: '物流公司编号',
            dataIndex: 'expressCorpNo',
            key: 'expressCorpNo',
            width: 100,
          }, {
            title: '公司名称',
            dataIndex: 'expressCorpName',
            key: 'expressCorpName',
            width: 150,
          }, {
            title: '操作',
            dataIndex: 'operations',
            key: 'operations',
            width: 320,
            className: styles.columnCenter,
            render: (text, record) => {
              return (
                <span>
                  {checkPremission('EXPRESS_EDIT') ? <span><a onClick={this.eidtModel.bind(this, record)}>编辑</a><Divider type="vertical" /></span> : null }
                  {checkPremission('EXPRESS_DEL_CORP') ? (
                    <span>
                      <Popconfirm title="确定要删除这行数据？" onConfirm={this.popConfirm.bind(this, record)} okText="确定" cancelText="取消">
                        <a >删除</a>
                      </Popconfirm>
                      <Divider type="vertical" />
                    </span>) : null }
                  {/* <a >打印模版</a> */}
                  <Divider type="vertical" />
                  {checkPremission('EXPRESS_FREIGHT_RULE') ? (
                    <span>
                      <a onClick={this.editFreightTemp.bind(this, record)} >运费模版</a>
                      <Divider type="vertical" />
                    </span>) : null }
                  {checkPremission('EXPRESS_SET_TYPE') ? (
                    <span>
                      <a onClick={this.setElectronSureface.bind(this, record)}>设置电子面单</a>
                      <Divider type="vertical" />
                    </span>) : null }
                </span>
              )
            },
          }, {
            title: '优先级',
            dataIndex: 'priorityLevel',
            key: 'priorityLevel',
            width: 80,
          }, {
            title: '优先省份',
            dataIndex: 'priorityProvince',
            key: 'priorityProvince',
            width: 80,
          }, {
            title: '运费计算',
            dataIndex: 'carriagePriority',
            key: 'carriagePriority',
            width: 100,
            render: (text) => {
              console.log(text)
              if (text * 1 === 0) {
                return '不计算运费'
              } else {
                return '计算运费'
              }
            },
          }, {
            title: '订单金额大于等于',
            dataIndex: 'lowerLimit',
            key: 'lowerLimit',
            width: 150,
          }, {
            title: '订单金额小于等于',
            dataIndex: 'upperLimit',
            key: 'upperLimit',
            width: 150,
          }, {
            title: '启用',
            dataIndex: 'enableStatus',
            key: 'enableStatus',
            width: 60,
            render: (text) => {
              return <Checkbox checked={text} />
            },
          }, {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 150,
            render: text => moment(text).format('YYYY-MM-DD'),
          }]
          const tabelToolbar = [
            <Button
              key={0}
              disabled={warehouses.length === 0}
              premission="EXPRESS_INSERT_CORP" icon="plus" type="primary" size="small" onClick={() => { this.setState({ addModalVisiable: true }) }}>绑定新的物流（快递）公司</Button>,
            <Button
              key={1}
              disabled={selectedRowKeys.length === 0}
              premission="EXPRESS_SET_TYPE" icon="code-o" type="primary" size="small" onClick={this.setElectronSureface.bind(this)}>设置电子面单</Button>,
            <Button
              key={3} premission="TRUE" icon="file-text" type="primary" size="small" onClick={() => { this.setState({ logModalVisiable: true }) }}>操作日志</Button>,
          ]
          const tableProps = {
            toolbar: tabelToolbar,
            dataSource: list,
            columns,
            total,
            ...page,
            loading,
            nameSpace: 'expresslist',
            tableName: 'expressTable',
            dispatch: this.props.dispatch,
            selectedRows,
            selectedRowKeys,
            rowKey: 'autoNo',
          }
        return (
          <div>
            <Row>
              <Col span={4} >
                <Menu mode="inline" onSelect={this.handleOnWhSelect.bind(this)} className={exStyles.exRightCard} selectedKeys={[selectedWhNo.toString()]}>
                  {warehouses.length ?
                    <ItemGroup title="当前仓库">
                      { warehouses.map(ele => (
                        <Menu.Item key={ele.warehouseNo}>
                          <Icon type="home" />
                          <span>{ele.warehouseName}</span>
                        </Menu.Item>))}
                    </ItemGroup> : <ItemGroup title="暂无仓库" />}
                </Menu>
              </Col>
              <Col span={20} >
                <Card className={[exStyles.exLeftCard, styles.contentBoard]}>
                  <div className={styles.tableList}>
                    <div className={styles.tableListForm} />
                    <Jtable {...tableProps} />
                  </div>
                </Card>
              </Col>
            </Row>
            <ExpressModal
              maskClosable={false}
              visiable={this.state.addModalVisiable}
              addModalHidden={this.addModalHidden}
              addNewExpress={this.addNewExpress}
              list={list}
            />
            <ExpressEditModal
              maskClosable={false}
              visiable={this.state.eidtModalVisiable}
              eidtModalHidden={this.addModalHidden}
              exConfig={this.state.exConfig}
              warehouseName={selectedWhName}
            />
            <ExpressSetElectronicSurfaceModal
              maskClosable={false}
              warehouseNo={selectedWhNo}
              visiable={this.state.setElectronModalVisiable}
              electronicModalHidden={this.addModalHidden}
              electricList={this.state.electricList}
              warehouseName={selectedWhName}
              dispatch={this.props.dispatch}
            />
            { this.state.freightTempModalVisiable ? <ExpressFreightTempModal
              maskClosable={false}
              visiable={this.state.freightTempModalVisiable}
              hidden={this.addModalHidden}
              express={this.state.selectedExpress}
              warehouseName={selectedWhName}
              warehouseNo={selectedWhNo}
            /> : null }
            <ExpressLogModal
              maskClosable={false}
              visiable={this.state.logModalVisiable}
              hidden={this.addModalHidden}
            />
          </div>
        )
    }
}
