/*
 * @Author: tanmengjia
 * @Date: 2017-12-25 16:36:48
 * @Last Modified by: tanmengjia
 * 组合商品资料
 * @Last Modified time: 2018-05-14 15:28:14
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Avatar, Select, Input, Popconfirm, Tag, Menu, Dropdown, Icon, message, notification } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from '../Item.less'
import CombinationItemModal from './CombinationItemModal'
import ImportCombination from './ImportCombination'
import ChangeItem from '../../../components/ChooseItem/index'
import { checkPremission, effectFetch } from '../../../utils/utils'
import { turnToOrdinary, getCommonEnable } from '../../../services/capacity'
// import { getOtherStore } from '../../../utils/otherStore'

const { Option } = Select
@connect(state => ({
  combinationItem: state.combinationItem,
}))
export default class CombinatianItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemModalVisiable: false,
      item: {},
      importModalVisiable: false,
      changeModalVisiable: false,
      combination: {},
      isRadio: false,
      importFile: false,
      read: false,
      openChoose: false,
    }
  }
  componentDidMount() {
    // const { combinationItem } = getOtherStore()
    // if (!combinationItem || combinationItem.list.length === 0) {
    //   this.props.dispatch({ type: 'combinationItem/fetch' })
    // }
    effectFetch('combinationItem', this.props.dispatch)
  }
  // 按条件导出
  exportItem = () => {
    const { searchParam } = this.props.combinationItem
    this.props.dispatch({
      type: 'combinationItem/exportSku',
      payload: { searchParam, IDLst: [], fileName: '组合商品资料.xls' },
    })
  }
  // 编辑
  editModal = (combination) => {
    this.setState({
      itemModalVisiable: true,
      combination,
      read: true,
    })
  }
  // 启用/备用/禁用
  use = (e) => {
    const { selectedRows } = this.props.combinationItem
    const values = {}
    if (e.key === '0') {
      Object.assign(values, {
        enableStatus: 0,
      })
    } else if (e.key === '1') {
      Object.assign(values, {
        enableStatus: 1,
      })
    } else if (e.key === '2') {
      Object.assign(values, {
        enableStatus: 2,
      })
    }
    const ids = []
    selectedRows.forEach((ele) => {
      if ((e.key > ele.enableStatus) || (e.key < ele.enableStatus)) {
        if (ele.ID === undefined) {
          ids.push(ele.skuNo)
        } else {
          ids.push(ele.ID)
        }
      }
    })
    if (ids.length === 0) {
      message.warn('未选择菜单或状态无需变更')
    } else {
      Object.assign(values, {
        IDLst: ids,
      })
      getCommonEnable(values).then((json) => {
        if (json) {
          this.props.dispatch({ type: 'combinationItem/clean1' })
          this.props.dispatch({ type: 'combinationItem/fetch' })
        } else {
          notification.error({
            message: json.errorMessage,
          })
        }
      })
    }
  }
  // 转为普通商品
  change = (selectedRows) => {
    const data = []
    selectedRows.forEach((ele) => {
      data.push(ele.autoNo)
    })
    const payload = {
      autoNo: data,
    }
    turnToOrdinary(payload).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'combinationItem/search',
          })
      }
    })
  }
  print = () => {
    console.log(this.props.combinationItem.selectedRows)
  }
  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows } = this.props.combinationItem
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
        title: '图片',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 110,
        render: (text) => {
          return (<Avatar shape="square" src={text} />)
          },
      },
      {
          title: '操作',
          dataIndex: 'opreation',
          key: 'opreation',
          width: 140,
          render: (text, record) => {
            if (checkPremission('COMBINATION_ADD')) {
              return (
                <span>
                  <a onClick={this.editModal.bind(this, record)} >编辑</a>
                </span>
            )
            }
          },
        }, {
        title: '款式编码',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 180,
      }, {
        title: '商品编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 200,
      }, {
        title: '商品名',
        dataIndex: 'productName',
        key: 'productName',
        width: 170,
      }, {
        title: '商品名简称',
        dataIndex: 'shortName',
        key: 'shortName',
        width: 150,
      }, {
        title: '颜色及规格',
        dataIndex: 'productSpec',
        key: 'productSpec',
        width: 160,
      }, {
        title: '基本售价',
        dataIndex: 'retailPrice',
        key: 'retailPrice',
        width: 100,
        className: styles.columnRight,
      }, {
        title: '子商品数量',
        dataIndex: 'skuNum',
        key: 'skuNum',
        width: 110,
        className: styles.columnRight,
        render: (text, record) => {
          return (
            <div>{text ? text : 0}</div>
          )
        },
      }, {
        title: '重量(KG)',
        dataIndex: 'referWeight',
        key: 'referWeight',
        width: 110,
        className: styles.columnRight,
      }, {
        title: '启用',
        dataIndex: 'enableStatus',
        key: 'enableStatus',
        width: 100,
        className: styles.columnCenter,
        render: (text) => {
          if (text * 1 === 1) {
            return <Tag color="#2db7f5" >启用</Tag>
          } else if (text * 1 === 0) {
            return <Tag color="#ccc" >禁用</Tag>
          } else {
            return <Tag color="#87d068">备用</Tag>
          }
        },
      // }, {
      //   title: '创建时间',
      //   dataIndex: 'createDate',
      //   key: 'createDate',
      //   width: 70,
    }]
      const itemModalProps = {
        itemModalVisiable: this.state.itemModalVisiable,
        combination: this.state.combination,
        openChoose: this.state.openChoose,
        read: this.state.read,
        dispatch: this.props.dispatch,
        itemModalHidden: () => {
          this.setState({
            itemModalVisiable: false,
            read: false,
          })
        },
        closeChoose: () => {
          this.setState({
            openChoose: false,
          })
        },
        clear: () => {
          this.setState({
            combination: {},
          })
        },
        item: this.state.item,
        save: (value) => {
          this.props.dispatch({
            type: 'combinationItem/save',
            payload: value,
          })
        },
      }
      const changeModalProps = {
        fromName: 'combination1',
        dispatch: this.props.dispatch,
        changeItem: (value, callback) => {
          callback()
          this.setState({
            itemModalVisiable: true,
            openChoose: true,
            combination: value,
          })
        },
        radioOpen: () => {
          this.setState({
            isRadio: true,
          })
        },
        productType: 0,
        isRadio: this.state.isRadio,
        itemModalHidden: () => {
          this.setState({
            changeModalVisiable: false,
          })
        },
        changeModalVisiable: this.state.changeModalVisiable,
      }
      const importModalProps = {
        dispatch: this.props.dispatch,
        itemModalHidden: () => {
          this.setState({
            importModalVisiable: false,
          })
        },
        importModalVisiable: this.state.importModalVisiable,
        show: this.state.importFile,
      }
      const open = (
        <Menu onClick={this.use} >
          <Menu.Item key="1">启用</Menu.Item>
          <Menu.Item key="2">备用</Menu.Item>
          <Menu.Item key="0">禁用</Menu.Item>
        </Menu>
      )
    const tabelToolbar = [
      <Popconfirm key={0} title="如果该商品已有订单，这些订单处理以及库存可能会存在异常" okText="确定" onConfirm={this.change.bind(this, selectedRows)} cancelText="取消" premission="COMBINATION_CHANGE">
        <Button type="primary" size="small" disabled={selectedRows.length === 0} premission="COMBINATION_CHANGE">转为普通商品</Button>
      </Popconfirm>,
      <Dropdown key={1} overlay={open} disabled={selectedRows.length === 0} premission="COMBINATION_ENABLE">
        <Button type="primary" size="small" className={styles.btn_jiange} premission="COMBINATION_ENABLE">
            启用/禁用 <Icon type="down" />
        </Button>
      </Dropdown>,
      <Button key={2} type="primary" size="small" premission="COMBINATION_ADD" onClick={() => { this.setState({ itemModalVisiable: true }) }}>创建组合商品</Button>,
      <Button key={3} type="primary" size="small" premission="COMBINATION_TOCOMMON" onClick={() => { this.setState({ changeModalVisiable: true, isRadio: true }) }}>将现有商品转化为组合商品</Button>,
      // <Button key={4} type="primary" size="small" premission="COMBINATION_CHANGE" disabled={selectedRows.length === 0} onClick={this.print}>打印条码</Button>,
      <Button key={5} type="primary" size="small" premission="COMBINATION_IMPORT" onClick={() => { this.setState({ importModalVisiable: true }) }}>导入</Button>,
      <Button key={6} type="primary" size="small" premission="COMBINATION_EXPORT" onClick={this.exportItem.bind(this)}>导出所有符合条件的商品</Button>,
    ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'combinationItem',
        tableName: 'combinationItemTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'skuNo',
        scroll: { x: 1600 },
    }
    const searchBarItem = [{
    decorator: 'comboNo',
    components: <Input placeholder="商品编码" size="small" />,
    }, {
    decorator: 'skuNo',
    components: <Input placeholder="参与组合商品编码" size="small" />,
    }, {
      decorator: 'productName',
      components: <Input placeholder="商品名称" size="small" />,
    }, {
      decorator: 'shortName',
      components: <Input placeholder="商品简称" size="small" />,
    }, {
      decorator: 'enableStatus',
      components: (
        <Select placeholder="商品是否启用" size="small" style={{ marginTop: 4 }}>
          <Option value="1">启用</Option>
          <Option value="2">备用</Option>
          <Option value="0">禁用</Option>
        </Select>
      ),
    },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'combinationItem',
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
        { this.state.itemModalVisiable ? <CombinationItemModal {...itemModalProps} /> : null }
        { this.state.changeModalVisiable ? <ChangeItem {...changeModalProps} /> : null }
        <ImportCombination {...importModalProps} />
      </div>
    )
  }
}
