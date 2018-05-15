/*
 * @Author: chenjie
 * @Date: 2017-12-06 18:04:11
 * @Last Modified by: tanmengjia
 * 商品维护
 * @Last Modified time: 2018-05-14 08:58:21
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Menu, Icon, Button, Dropdown, Avatar, Select, Input, Checkbox, message, Tag } from 'antd'
import Jtable from '../../components/JcTable'
import Enable from '../../components/Enable'
import FaIcon from '../../components/Jicon'
import SearchBar from '../../components/SearchBar'
import styles from './Item.less'
import ItemModal from './ItemModal'
import ItemImportTaobaoModal from './ItemImportTaobaoModal'
import ItemImportTaobaoSingleModal from './ItemImportTaobaoSingleModal'
import GoodImport from './GoodImport'
import ViewLogJ from './ViewLogJ'
import { effectFetch } from '../../utils/utils'

const { Option } = Select
@connect(state => ({
    items: state.items,
}))
export default class Items extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemModalVisiable: false,
      importTbVisiable: false,
      importTbSingleVisiable: false,
      modal: false,
      title: '',
      export: false,
      log: false,
      goodImport: false,
      item: {},
      // item1: {},
    }
  }
  componentWillMount() {
    effectFetch('items', this.props.dispatch)
    // const { items, global } = getOtherStore()
    // console.log('getOtherStore()', global.tabList.find(e=>e.key === "items"))
    // if (!items || items.list.length === 0) {
    //   this.props.dispatch({ type: 'items/fetch' })
    // }
  }
  editModal = (item) => {
    this.props.dispatch({
      type: 'items/getSkuDataByPNo',
      payload: item,
    })
    this.setState({
      itemModalVisiable: true,
      item,
    })
  }
  handleAddItem() {
    this.setState({
      itemModalVisiable: true,
    })
  }
  tbClick = (e) => {
    if (e.key * 1 === 1) {
      this.setState({
        importTbVisiable: true,
      })
    } else {
      this.setState({
        importTbSingleVisiable: true,
      })
    }
  }
  exportClick = (e) => {
    const { selectedRows, searchParam } = this.props.items
    if (e.key === '1') {
      this.props.dispatch({
        type: 'items/exportSku',
        payload: { searchParam, IDLst: [], fileName: '商品维护.xls' },
      })
      // titleE = '导出所有商品'
      // this.setState({
      //   export: true,
      //   title: titleE,
      // })
    } else {
      if (selectedRows.length === 0) {
        message.warning('至少选择一条数据')
        return false
      }
      this.props.dispatch({
        type: 'items/exportSku',
        payload: { searchParam, IDLst: selectedRows.map((rows => rows.productNo)), fileName: '商品维护.xls' },
      })
      // titleE = '导出已勾选商品'
      // this.setState({
      //   export: true,
      //   title: titleE,
      // })
    }
  }
  syncClick = (e) => {
    this.props.dispatch({
      type: 'items/sync',
      payload: {
        status: e.key,
        IDLst: this.props.items.selectedRows.map((rows => rows.productNo)),
      },
    })
  }

  // 导出取消按钮
  exportCancel = () => {
    if (this.state.title === '导出所有商品') {
      console.log('点击了导出所有的取消按钮')
    } else {
      console.log('点击了导出已勾选商品的取消按钮')
    }
  }

  // 导出确定按钮
  exportOk = () => {
    if (this.state.title === '导出所有商品') {
      console.log('点击了导出所有的确定按钮')
    } else {
      console.log('点击了导出已勾选商品的确定按钮')
    }
  }

  // 批量删除
  delete = (selectedRow) => {
    if (selectedRow.length === 0) {
      message.warning('至少选择一条数据')
    } else {
      this.setState({
        modal: true,
        title: '批量删除',
      })
    }
  }

   // 批量备用
  reserve = (selectedRow) => {
    if (selectedRow.length === 0) {
      message.warning('至少选择一条数据')
    } else {
      this.setState({
        modal: true,
        title: '批量备用',
      })
    }
  }

  hideModal = () => {
    this.setState({
      modal: false,
      export: false,
      log: false,
      goodImport: false,
    })
  }

  // 确认删除商品
  deleteGood = () => {
    this.setState({
      modal: false,
    })
    const IDLst = []
    this.props.items.selectedRows.forEach(rows => {
      if (rows.enableStatus * 1 === 0) {
        IDLst.push(rows.productNo)
      }
    })
    this.props.dispatch({
      type: 'items/deleteRows',
      payload: { IDLst },
    })
  }

   // 备用商品
   reserveGood = () => {
    this.setState({
      modal: false,
    })
    alert('备用商品')
  }

  // 查看日志
  viewLog = () => {
    this.setState({
      log: true,
    })
  }
  // 商品维护导入
  goodImport = () => {
   this.setState({
    goodImport: true,
   })
  }
  render() {
    const { list, total, loading, brands, selectedRows, selectedRowKeys, page, searchParam } = this.props.items
    // const tbDownload = (
    //   <Menu onClick={this.tbClick.bind(this)} >
    //     <Menu.Item key="1">批量导入淘宝|天猫商品信息</Menu.Item>
    //     <Menu.Item key="2">单个导入淘宝|天猫商品</Menu.Item>
    //   </Menu>
    // )
    const exportItem = (
      <Menu onClick={this.exportClick.bind(this)} >
        <Menu.Item key="1">导出所有符合条件的商品</Menu.Item>
        <Menu.Item key="2">导出已勾选的商品</Menu.Item>
      </Menu>
    )
    const sync = (
      <Menu onClick={this.syncClick.bind(this)} >
        <Menu.Item key={0}>关闭</Menu.Item>
        <Menu.Item key={1}>开启</Menu.Item>
      </Menu>
    )
    const tabelToolbar = [
      <Button key={1} premission="ITEMS_SAVE" icon="plus" type="primary" size="small" onClick={this.handleAddItem.bind(this)} >发布商品</Button>,
      <Enable key={2} premission="ITEMS_ENABLE" disabled={selectedRows.length === 0} query="items/enable" rowKey="productNo" selectedRow={selectedRows} dispatch={this.props.dispatch} />,
      <Button key={3} premission="ITEMS_DELETE" disabled={selectedRows.length === 0} icon="delete" type="primary" size="small" onClick={this.delete.bind(this)} >批量删除</Button>,
      // <Dropdown key={4} premission="ITEMS_TAOBAO" overlay={tbDownload}>
      //   <Button type="primary" size="small" className={styles.btn_jiange}>
      //   淘宝商品下载 <Icon type="down" />
      //   </Button>
      // </Dropdown>,
      <Dropdown key={5} premission="ITEMS_SYNC" disabled={selectedRows.length === 0} overlay={sync}>
        <Button type="primary" size="small" className={styles.btn_jiange}>
            同步库存 <Icon type="down" />
        </Button>
      </Dropdown>,
      <Dropdown key={6} premission="ITEMS_EXPORT" overlay={exportItem}>
        <Button type="primary" size="small" className={styles.btn_jiange}>
          <Icon type="export" /> 导出商品 <Icon type="down" />
        </Button>
      </Dropdown>,
      <Button key={7} premission="" type="primary" size="small" onClick={this.viewLog} ><FaIcon type="file-text-o" style={{ marginRight: 10 }} />查看日志</Button>,
      <Button key={8} premission="ITEMS_IMPORT" type="primary" size="small" onClick={this.goodImport} ><FaIcon type="file-text-o" style={{ marginRight: 10 }} />商品维护导入</Button>,
     ]
      const itemModalProps = {
        itemModalVisiable: this.state.itemModalVisiable,
        item: this.state.item,
        lists: this.props.items.lists,
        dispatch: this.props.dispatch,
        // item1: this.state.item1,
        brands,
        itemModalHidden: () => {
          this.setState({
            itemModalVisiable: false,
          })
          this.props.dispatch({
            type: 'items/clear',
          })
        },
        clear: () => {
          this.setState({
            item: {},
            // item1: {},
          })
        },
      }
      const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 80,
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
        width: 120,
        render: (text) => {
          return (<Avatar shape="square" src={text} />)
          },
      }, {
        title: '操作',
        dataIndex: 'operations',
        key: 'operations',
        width: 80,
        render: (text, record) => {
          return (
            <span>
              <a onClick={this.editModal.bind(this, record)}>编辑</a>
            </span>
          )
        },
      },
      // {
      //   title: '商品编码',
      //   dataIndex: 'skuNo',
      //   key: 'skuNo',
      //   width: 160,
      // },
      {
        title: '款式编码（货号）',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 160,
      }, {
        title: '商品属性',
        dataIndex: 'productAttribute',
        key: 'productAttribute',
        width: 120,
        render: (text) => {
          if (text * 1 === 0) {
            return '成品'
          } else if (text * 1 === 1) {
            return '半成品'
          } else {
            return '原物料'
          }
        },
      }, {
        title: '状态',
        dataIndex: 'enableStatus',
        key: 'enableStatus',
        width: 80,
        render: (text) => {
          if (text * 1 === 1) {
            return <Tag color="#2db7f5" >启用</Tag>
          } else if (text * 1 === 0) {
            return <Tag color="#ccc" >禁用</Tag>
          } else {
            return <Tag color="#87d068">备用</Tag>
          }
        },
      }, {
        title: '分类',
        dataIndex: 'categoryName',
        key: 'categoryName',
        width: 100,
      }, {
        title: '品牌',
        dataIndex: 'brandName',
        key: 'brandName',
        width: 100,
      }, {
        title: '市场|吊牌价',
        dataIndex: 'tagPrice',
        key: 'tagPrice',
        width: 80,
        // className: styles.columnRight,
      }, {
        title: '价格',
        dataIndex: 'retailPrice',
        key: 'retailPrice',
        width: 80,
        // className: styles.columnRight,
      }, {
        title: '供应商',
        dataIndex: 'supplierName',
        key: 'supplierName',
        width: 120,
      }, {
        title: '供应商商品款号',
        dataIndex: 'supplierProductNo',
        key: 'supplierProductNo',
        width: 200,
      }, {
        title: '是否同步库存',
        dataIndex: 'inventorySync',
        key: 'inventorySync',
        width: 200,
        render: text => (
          <Checkbox checked={text} />
        ),
      }]
      const searchBarItem = [{
        decorator: 'productNo',
        components: <Input placeholder="款式编码" size="small" />,
      }, {
        decorator: 'skuNo',
        components: <Input placeholder="商品编码" size="small" />,
      }, {
        decorator: 'productName',
        components: <Input placeholder="商品名称" size="small" />,
      }, {
        decorator: 'brandNo',
        components: (
          <Select placeholder="品牌" size="small" style={{ marginTop: 4 }}>
            { brands && brands.length && brands.map(brand => <Option key={brand.brandNo} value={brand.brandNo}>{brand.brandName}</Option>)}
            {/* <Option value="冰洁">冰洁</Option>
            <Option value="雪中飞">雪中飞</Option> */}
          </Select>
        ),
      }, {
        decorator: 'supplierName',
        components: <Input placeholder="供应商" size="small" />,
      }, {
        decorator: 'supplierProductNo',
        components: <Input placeholder="供应商款号" size="small" />,
      }, {
        decorator: 'categoryName',
        components: <Input placeholder="分类" size="small" />,
      },
      ]
      const searchBarProps = {
        colItems: searchBarItem,
        dispatch: this.props.dispatch,
        nameSpace: 'items',
        searchParam,
      }
      const tableProps = {
        toolbar: tabelToolbar,
        dataSource: list,
        loading,
        columns,
        noSelected: false,
        total,
        ...page,
        nameSpace: 'items',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        tableName: 'items',
        // scroll: { x: 1000 },
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
          { this.state.itemModalVisiable ? <ItemModal {...itemModalProps} /> : null }
          <ItemImportTaobaoModal
            importTbVisiable={this.state.importTbVisiable}
            itemModalHidden={() => { this.setState({ importTbVisiable: false }) }}
          />
          <ItemImportTaobaoSingleModal
            importTbSingleVisiable={this.state.importTbSingleVisiable}
            itemModalHidden={() => { this.setState({ importTbSingleVisiable: false }) }}
          />
          <ViewLogJ show={this.state.log} hideModal={this.hideModal} />
          <GoodImport show={this.state.goodImport} hideModal={this.hideModal} />

          <Modal
            title={this.state.title}
            visible={this.state.modal}
            onOk={this.state.title === '批量删除' ? this.deleteGood : this.reserveGood}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
            closable={false}
            maskClosable={false}
          >
            <p style={{ fontSize: 16 }}>
              {this.state.title === '批量删除' ? <Icon type="close-circle" style={{ color: 'red', fontWeight: 'bold', marginRight: 10 }} />
              :
              <Icon type="question-circle-o" style={{ color: '#08c', fontWeight: 'bold', marginRight: 10 }} />}
              {`是否${this.state.title}商品${this.state.title === '批量删除' ? '请确认需要删除选定的商品，一旦删除将不可恢复': ''}`}
            </p>
          </Modal>

          <Modal
            title={this.state.title}
            visible={this.state.export}
            onCancel={this.hideModal}
            dispatch={this.props.dispatch}
            footer={null}
            maskClosable={false}
          >
            <div style={{ height: 125 }}>
              <p style={{ fontSize: 16 }}>
                <Icon type="exclamation-circle" style={{ color: '#08c', fontWeight: 'bold', marginRight: 10 }} />
                有些浏览器插件可能会拦截导出文件,如果无法导出,请关闭拦截
              </p>
              <p style={{ fontSize: 14, paddingLeft: 27 }}>点击确认将导出可以查看图片的html文件</p>
              <p style={{ fontSize: 14, paddingLeft: 27 }}>点击取消将导出不带图片的标准excel文件</p>
              <div style={{ float: 'right' }}>
                <Button style={{ marginRight: 20 }} onClick={this.exportCancel}>取消</Button>
                <Button type="primary" onClick={this.exportOk}>确定</Button>
              </div>
            </div>
          </Modal>
        </div>
      )
  }
}
