/*
 * @Author: tanmengjia
 * @Date: 2017-12-23 16:17:03
 * @Last Modified by: tanmengjia
 * 普通商品资料
 * @Last Modified time: 2018-05-14 15:29:32
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Menu, Icon, Button, Dropdown, Avatar, Select, Input, message, notification, Cascader, Tag } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from '../Item.less'
import ItemLocation from './ItemLocation'
import CommonItemImport from './CommonItemImport'
import ViewLog from './ViewLog'
import { getItemClass, getCommonEnable, deleteBDBySku } from '../../../services/capacity'
import { cnamesReview, checkPremission, effectFetch } from '../../../utils/utils'
import { getAllSupplier } from '../../../services/item/items'
import ItemModal from '../ItemModal'

const { Option } = Select
@connect(state => ({
    commonItem: state.commonItem,
    items: state.items,
}))
export default class CommonItem extends Component {
    constructor(props) {
      super(props)
      this.state = {
        itemModalVisiable: false,
        // item: {},
        relationshipVisiable: false,
        importItemVisiable: false,
        logVisiable: false,
        cnames: [],
        supplierList: [],
        recordData: {},
      }
    }
    componentDidMount() {
      // const { commonItem } = getOtherStore()
      // if (!commonItem || commonItem.list.length === 0) {
      //   this.props.dispatch({ type: 'commonItem/fetch' })
        
      // }
      effectFetch('commonItem', this.props.dispatch)
      getAllSupplier().then(json => this.setState({ supplierList: json }))
      getItemClass().then((json) => {
        if (json && json.length) {
          const data = cnamesReview(json)
          if (data && data.length) {
            data.forEach((ele) => {
              Object.assign(ele, { value: ele.categoryNo })
              Object.assign(ele, { label: ele.categoryName })
              // if (ele.children === [] && ele.children.length === 0) {
              //   console.log('ele.children', ele.children)
              //   delete ele.children
              // }
            })
             this.setState({
               cnames: data,
              })
          }
        }
      })
     }
    editModal = (record) => {
      this.props.dispatch({
        type: 'commonItem/getSkuDataByPNo',
        payload: record,
      })
      this.setState({
        itemModalVisiable: true,
        recordData: record,
      })
    }
    allDel = () => {
      if (this.props.commonItem.selectedRows.length === 0) {
        message.warning('至少选择一条数据')
      } else {
        const delAll = []
        this.props.commonItem.selectedRows.forEach((ele) => {
          delAll.push(ele.skuNo)
        })
        const aDel = {
          skuNo: delAll,
        }
        deleteBDBySku(aDel).then((json) => {
          if (json) {
            notification.success({
            message: '操作成功',
            })
            this.props.dispatch({ type: 'commonItem/fetch' })
          }
      })
      }
    }
    tbClick = (e) => {
      switch (e.key * 1) {
        case 1:
          this.props.dispatch({
            type: 'commonItem/exportSku',
            payload: { searchParam: this.props.commonItem.searchParam, IDLst: [], fileName: '普通商品资料.xls' },
          })
        break
        case 2:
          this.props.dispatch({
            type: 'commonItem/exportSku1',
            payload: { selectedRows: this.props.commonItem.selectedRows, IDLst: [], fileName: '普通商品资料.xls' },
          })
        break
        case 8:
        break
        case 14:
        this.setState({ logVisiable: true })
        break
        default:
        break
      }
    }
    use = (e) => {
      const { selectedRows } = this.props.commonItem
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
            this.props.dispatch({ type: 'commonItem/clean' })
            this.props.dispatch({ type: 'commonItem/fetch' })
          } else {
            notification.error({
              message: json.errorMessage,
            })
          }
        })
    }
  }
  render() {
    const { list, loading, total, page, selectedRowKeys, selectedRows, searchParam, brands } = this.props.commonItem
    const exportItem = (
      <Menu onClick={this.tbClick.bind(this)} >
        <Menu.Item key="1" premission="COMMONITEM_EXPORT">导出所有符合条件的商品资料</Menu.Item>
        <Menu.Item key="2" disabled={!(selectedRows && selectedRows.length)} premission="COMMONITEM_EXPORT">导出所选择的商品资料</Menu.Item>
      </Menu>
    )
    const codeItem = (
      <Menu onClick={this.tbClick.bind(this)} >
        <Menu.Item key="7">设定条码模板</Menu.Item>
        <Menu.Item key="8">打印商品条码</Menu.Item>
      </Menu>
    )
    const open = (
      <Menu onClick={this.use} >
        <Menu.Item key="1">启用</Menu.Item>
        <Menu.Item key="2">备用</Menu.Item>
        <Menu.Item key="0">禁用</Menu.Item>
      </Menu>
    )
    const log = (
      <Menu onClick={this.tbClick.bind(this)} >
        <Menu.Item key="14">查看日志</Menu.Item>
        <Menu.Item key="15">查看商品删除日志</Menu.Item>
      </Menu>
    )
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
    // }, {
    //   title: '操作',
    //   dataIndex: 'opreation',
    //   key: 'opreation',
    //   width: 100,
    //   // className: styles.columnCenter,
    //   render: (text, record) => {
    //     // return (
    //     //   <span>
    //     if (checkPremission('COMMONITEM_ADD')) {
    //       return <a onClick={this.editModal.bind(this, record)} >编辑</a>
    //     }
    //       // </span>
    //     // )
    //   },
    }, {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 60,
      render: (text) => {
        return (<Avatar shape="square" src={text} />)
        },
    }, {
      title: '状态',
      dataIndex: 'enableStatus',
      key: 'enableStatus',
      width: 130,
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
    }, {
      title: '款式编码',
      dataIndex: 'productNo',
      key: 'productNo',
      width: 180,
      render: (text, record) => {
        if (checkPremission('ITEMS_SAVE')) {
        return (
          <span>
            <a onClick={this.editModal.bind(this, record)}>{text}</a>
          </span>
        )
      } else {
        <div>{text}</div>
      }
      },
    }, {
      title: '商品编码',
      dataIndex: 'skuNo',
      key: 'skuNo',
      width: 180,
    }, {
      title: '商品名',
      dataIndex: 'productName',
      key: 'productName',
      width: 160,
    }, {
      title: '颜色及规格',
      dataIndex: 'productSpec',
      key: 'productSpec',
      width: 120,
    }, {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
      width: 100,
    }, {
      title: '基本售价',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      width: 80,
      className: styles.columnRight,
    }, {
      title: '成本价',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 70,
      className: styles.columnRight,
    }, {
      title: '吊牌价',
      dataIndex: 'tagPrice',
      key: 'tagPrice',
      width: 70,
      className: styles.columnRight,
    }, {
      title: '重量',
      dataIndex: 'referWeight',
      key: 'referWeight',
      width: 70,
      className: styles.columnRight,
    }, {
      title: '零售库容',
      dataIndex: 'retailCapacityLimit',
      key: 'retailCapacityLimit',
      width: 80,
      className: styles.columnRight,
    }, {
      title: '整存库容',
      dataIndex: 'entireCapacityLimit',
      key: 'entireCapacityLimit',
      width: 80,
      className: styles.columnRight,
    }, {
      title: '标准装箱数',
      dataIndex: 'standardBoxing',
      key: 'standardBoxing',
      width: 90,
      className: styles.columnRight,
    }, {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 120,
    }, {
      title: '供应商商品款号',
      dataIndex: 'supplierProductNo',
      key: 'supplierProductNo',
      width: 120,
    }]
    const tabelToolbar = [
      // <Button key={0} type="primary" size="small" onClick={() => { this.setState({ itemModalVisiable: true }) }} premission="COMMONITEM_ADD">新增商品</Button>,
      <Button key={1} type="primary" size="small" onClick={() => { this.setState({ relationshipVisiable: true }) }} premission="COMMONITEM_LOCATION">仓位与商品关系</Button>,
      <Dropdown key={2} overlay={exportItem} premission="COMMONITEM_EXPORT">
        <Button type="primary" size="small" className={styles.btn_jiange}>
            导出 <Icon type="down" />
        </Button>
      </Dropdown>,
      // <Button key={2} type="primary" size="small" onClick={this.export} premission="COMMONITEM_EXPORT">导出商品资料</Button>,
      <Dropdown key={3} overlay={codeItem}>
        <Button type="primary" size="small" className={styles.btn_jiange}>
            条码 <Icon type="down" />
        </Button>
      </Dropdown>,
      <Dropdown key={4} overlay={open} disabled={selectedRows.length === 0} premission="COMBINATION_ENABLE">
        <Button type="primary" size="small" className={styles.btn_jiange} premission="COMBINATION_ENABLE">
            启用/禁用 <Icon type="down" />
        </Button>
      </Dropdown>,
      // <Button key={5} type="primary" size="small" className={styles.btn_jiange} disabled={selectedRows.length === 0} onClick={this.allDel.bind(this)} premission="COMMONITEM_DELETE">批量删除</Button>,
      <Dropdown overlay={log}>
        <Button key={6} type="primary" size="small" className={styles.btn_jiange}>
            查看日志 <Icon type="down" />
        </Button>
      </Dropdown>,
    ]
    const tableProps = {
      toolbar: tabelToolbar,
      noSelected: false,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'commonItem',
      tableName: 'commonItemTable',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      scroll: { x: 1800 },
      rowKey: 'skuNo',
    }
    const searchBarItem = [{
      decorator: 'skuNo',
      components: <Input placeholder="商品编码|款式编码|条形码" size="small" />,
    }, {
      decorator: 'productName',
      components: <Input placeholder="商品名称" size="small" />,
    }, {
      decorator: 'brandNo',
      components: (
        <Select placeholder="品牌" size="small" style={{ marginTop: 4 }}>
          {brands.map(brand => <Option key={brand.brandNo} value={brand.brandNo}>{brand.brandName}</Option>)}
        </Select>
      ),
    }, {
      decorator: 'supplierNo',
      components: (
        <Select placeholder="供应商" size="small" style={{ marginTop: 4 }}>
          {this.state.supplierList.map(e => <Option key={e.supplierNo} value={e.supplierNo}>{e.supplierName}</Option>)}
        </Select>
      ),
    }, {
    //   decorator: 'supplierSkuNo',
    //   components: <Input placeholder="供应商商品编码" size="small" />,
    // }, {
      decorator: 'supplierProductNo',
      components: <Input placeholder="供应商款式编码" size="small" />,
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
          <Option value="1">启用</Option>
          <Option value="2">备用</Option>
          <Option value="0">禁用</Option>
        </Select>
      ),
    }, {
      decorator: 'listPrivate',
      components: <Cascader showSearch style={{ marginTop: 4 }} placeholder="分类" options={this.state.cnames} />,
    },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'commonItem',
      searchParam,
    }
    const itemModalProps = {
      itemModalVisiable: this.state.itemModalVisiable,
      item: this.state.recordData,
      brands,
      dispatch: this.props.dispatch,
      lists: this.props.commonItem.lists,
      itemModalHidden: () => {
        this.setState({
          itemModalVisiable: false,
          recordData: {},
        })
        this.props.dispatch({
          type: 'commonItem/clear',
        })
      },
      // item: this.state.item,
      // save: (value) => {
      //   this.props.dispatch({
      //     type: 'commonItem/save',
      //     payload: value,
      //   })
      // },
    }
    const locationModalProps = {
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          relationshipVisiable: false,
        })
      },
      relationshipVisiable: this.state.relationshipVisiable,
    }
    const importModalProps = {
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          importItemVisiable: false,
        })
      },
      importItemVisiable: this.state.importItemVisiable,
    }
    const logModalProps = {
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          logVisiable: false,
        })
      },
      logVisiable: this.state.logVisiable,
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
        {this.state.itemModalVisiable ? <ItemModal {...itemModalProps} /> : ''}
        <ItemLocation {...locationModalProps} />
        <CommonItemImport {...importModalProps} />
        <ViewLog {...logModalProps} />
      </div>
    )
  }
}
