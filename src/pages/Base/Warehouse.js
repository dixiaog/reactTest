/*
 * @Author: chenxiang
 * @Date: 2017-12-16 17:15:04
 * 仓库维护
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Button, Input, Dropdown, Icon, Menu, Checkbox, Tag } from 'antd'
import styles from './Base.less'
import Jtable from '../../components/JcTable'
import SearchBar from '../../components/SearchBar'
import WarehouseModal from './WarehouseModal'
import Position from './Position'
import { effectFetch } from '../../utils/utils'
import { selStoragelocationGroupByAreaNo } from '../../services/position/position'

const Option = Select.Option
@connect(state => ({
    warehouse: state.warehouse,
    position: state.position,
}))
export default class Warehouse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemModalVisiable: false,
      warehouse: {},
      warehouseNo: '',
      locationType: '',
      itemModalVisiableS: false,
      treeData: [],
    }
  }

  componentDidMount() {
    // 此处获取外部store判断是否需要重新加载页面
    // const { powers } = getOtherStore()
    // if (!powers || powers.list.length === 0) {
    //   this.props.dispatch({
    //     type: 'warehouse/fetch',
    //   })
    // }
    effectFetch('warehouse', this.props.dispatch)
  }

  enableChage = (e) => {
    const { selectedRows } = this.props.warehouse
    const values = {}
    if (e.key === '1') {
      Object.assign(values, {
        enableStatus: 1,
      })
    } else {
      Object.assign(values, {
        enableStatus: 0,
      })
    }
    const ids = selectedRows[0].warehouseNo
    Object.assign(values, {
      warehouseNo: ids,
    })

    this.props.dispatch({
          type: 'warehouse/enable',
          payload: values,
        })

    // if (ids.length === 0) {
    //   message.warn('未选择菜单或状态无需变更')
    // } else {
    //   Object.assign(values, {
    //     IDLst: ids,
    //   })
    //   this.props.dispatch({
    //     type: 'warehouse/enable',
    //     payload: values,
    //   })
    // }
  }
  editModal = (warehouse) => {
    this.setState({
      itemModalVisiable: true,
      warehouse,
      warehouseNo: warehouse.warehouseNo,
    })
  }
  popConfirm = (e) => {
    this.props.dispatch({
      type: 'warehouse/delete',
        payload: {
          id: e.id,
        },
    })
  }
  render() {
    const menu = (
      <Menu onClick={this.enableChage} >
        <Menu.Item key="1"><Icon type="check-circle-o" /> 启用</Menu.Item>
        <Menu.Item key="2"><Icon type="close-circle-o" /> 禁用</Menu.Item>
      </Menu>
    )
   const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.warehouse
        const searchBarItem = [
            {
              decorator: 'warehouseNo',
              components: <Input placeholder="仓库编号" size="small" />,
            },
            {
                decorator: 'warehouseName',
                components: <Input placeholder="仓库名称" size="small" />,
              },
            {
              decorator: 'warehouseType',
              components: (
                <Select placeholder="仓库类型" size="small" style={{ marginTop: 4 }}>
                  <Option value="0">主仓库</Option>
                  <Option value="1">分仓</Option>
                  <Option value="2">第三方仓</Option>
                </Select>),
            },
            {
                decorator: 'enableStatus',
                components: (
                  <Select placeholder="启用状态" size="small" style={{ marginTop: 4 }}>
                    <Option value="0">不启用</Option>
                    <Option value="1">启用</Option>
                  </Select>),
              },
              {
                decorator: 'contacts',
                components: <Input placeholder="联系人" size="small" />,
              },
              {
                decorator: 'mobileNo',
                components: <Input placeholder="联系手机" size="small" />,
              },
              {
                decorator: 'address',
                components: <Input placeholder="地址" size="small" />,
              },
          ]
    // 操作栏
    const tabelToolbar = [
      <Button key={1} icon="plus" premission="POOSITION_INSERSTORA" type="primary" size="small" onClick={() => { this.setState({ itemModalVisiable: true }) }} >新增仓库</Button>,
      <Dropdown key={2} premission="POSITION_UPLOADENABL" overlay={menu}>
        <Button type="primary" size="small" className={styles.btn_jiange}>
            启用/禁用 <Icon type="down" />
        </Button>
      </Dropdown>,
      ]
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 80,
        render: (text, record, index) => {
          return (<span>{index + 1}</span>)
          },
      }, {
        title: '仓库名称',
        dataIndex: 'warehouseName',
        width: 150,
        key: 'warehouseName',
      }, {
        title: '启用状态',
        dataIndex: 'enableStatus',
        width: 80,
        key: 'enableStatus',
        className: styles.columnCenter,
        render: text => <Checkbox checked={text} />,
      }, {
        title: '操作',
        dataIndex: 'opreation',
        key: 'opreation',
        width: 120,
        className: styles.columnCenter,
        render: (text, record) => {
          return (
            <span>
              <a onClick={this.editModal.bind(this, record)} >编辑</a>
            </span>
          )
        },
      }, {
        title: '仓库类型',
        dataIndex: 'warehouseType',
        width: 80,
        key: 'warehouseType',
        className: styles.columnCenter,
        render: (text) => {
          if (text * 1 === 0) {
            return <Tag color="#2db7f5" >主仓</Tag>
          } else if (text * 1 === 1) {
            return <Tag color="#108ee9" >分仓</Tag>
          } else {
            return <Tag color="#87d068">第三方仓</Tag>
          }
        },
      }, {
        title: '联系人',
        dataIndex: 'contacts',
        width: 120,
        key: 'contacts',
      }, {
        title: '联系手机',
        dataIndex: 'mobileNo',
        width: 120,
        key: 'mobileNo',
      }, {
        title: '地址',
        dataIndex: 'address',
        width: 200,
        key: 'address',
      }, {
        title: '进货仓名称',
        dataIndex: 'inWarehouseName',
        width: 120,
        key: 'inWarehouseName',
      }, {
        title: '整存仓名称',
        dataIndex: 'entiretyWarehouseName',
        width: 120,
        key: 'entiretyWarehouseName',
      }, {
        title: '零售仓名称',
        dataIndex: 'retailWarehouseName',
        width: 120,
        key: 'retailWarehouseName',
      }, {
        title: '发售仓名称',
        dataIndex: 'deliveryWarehouseName',
        width: 120,
        key: 'deliveryWarehouseName',
      }, {
        title: '退货仓名称',
        dataIndex: 'returnWarehouseName',
        width: 120,
        key: 'returnWarehouseName',
      }, {
        title: '残次仓名称',
        dataIndex: 'defectiveWarehouseName',
        width: 120,
        key: 'defectiveWarehouseName',
      }, {
        title: '疑难件仓名称',
        dataIndex: 'problemWarehouseName',
        width: 120,
        key: 'problemWarehouseName',
      }, {
        title: '菜鸟启用',
        dataIndex: 'enableCainiao',
        width: 80,
        key: 'enableCainiao',
        className: styles.columnCenter,
        render: text => <Checkbox checked={text} />,
      }, {
        title: '菜鸟地址',
        dataIndex: 'cainiaoAddress',
        width: 120,
        key: 'cainiaoAddress',
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
      nameSpace: 'warehouse',
      tableName: 'warehouseTable',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowSelection: { type: 'radio' },
      rowKey: 'warehouseNo',
    }
    // 搜索栏参数
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'warehouse',
      searchParam,
    }
    // 添加|编辑Modal参数
    const warehouseModalProps = {
      itemModalVisiable: this.state.itemModalVisiable,
      itemModalVisiableS: this.state.itemModalVisiableS,
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          itemModalVisiable: false,
          warehouse: {},
          warehouseNo: '',
        })
      },
      setWarehouseInfo: (warehouseNo, locationType) => {
        this.setState({
          warehouseNo,
          locationType,
        })
      },
      // setRetailWarehouse: () => {
      //   this.setState({
      //     itemModalVisiableS: true,
      //   })
      // },
      setLocationType: () => {
        const payload = {
          warehouseNo: this.state.warehouseNo, // 仓位编号
          locationType: 3, //  仓位类型
      }
      this.props.dispatch({
          type: 'position/fetch',
          payload,
       })
    //    this.props.dispatch({
    //     type: 'position/treead',
    //     payload,
    //  })
        this.setState({
          itemModalVisiableS: true,
          locationType: 3,
        })
        selStoragelocationGroupByAreaNo({
          ...payload,
        }).then((json) => {
          const data = json
          if (data === null) {
            this.setState({
              treeData: [],
            })
          } else {
            for (let i = 0; i < data.length; i++) {
              data[i].title = `区域${data[i].areaNo}`
              data[i].key = data[i].autoNo
            }
            this.setState({
              treeData: data,
            })
          }
        })
      },
      setLocationType1: () => {
        const payload = {
          warehouseNo: this.state.warehouseNo, // 仓位编号
          locationType: 2, //  仓位类型
      }
      this.props.dispatch({
          type: 'position/fetch',
          payload,
       })
    //    this.props.dispatch({
    //     type: 'position/treead',
    //     payload,
    //  })
       selStoragelocationGroupByAreaNo({
        ...payload,
      }).then((json) => {
        const data = json
        if (data === null) {
          this.setState({
            treeData: [],
            itemModalVisiableS: true,
            locationType: 2,
          })
        } else {
          for (let i = 0; i < data.length; i++) {
            data[i].title = `区域${data[i].areaNo}`
            data[i].key = data[i].autoNo
          }
          this.setState({
            treeData: data,
            itemModalVisiableS: true,
            locationType: 2,
          })
        }
      })
      },
      warehouse: this.state.warehouse,
      upload: (value) => {
        this.props.dispatch({
          type: 'warehouse/save',
            payload: {
              bdWarehouse: value,
            },
        })
      },
    }

    const positions = {
      itemModalVisiableS: this.state.itemModalVisiableS,
      dispatch: this.props.dispatch,
      warehouseNo: this.state.warehouseNo,
      locationType: this.state.locationType,
      treeData: this.state.treeData,
      itemModalHidden: () => {
        this.setState({
          itemModalVisiableS: false,
          treeData: [],
          locationType: null,
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
        { this.state.itemModalVisiable ? <WarehouseModal {...warehouseModalProps} /> : null}
        { this.state.itemModalVisiableS ? <Position {...positions} /> : null}
      </div>)
  }
}
