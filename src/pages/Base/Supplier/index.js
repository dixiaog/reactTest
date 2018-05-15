/*
 * @Author: Wupeng
 * @Date: 2017-1-23 10:04:11
 * @Last Modified by;
 * 供应商状态
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Dropdown, Menu, Icon, Input, Button, Form, Checkbox, Select, Popconfirm } from 'antd'
import moment from 'moment'
import Jtable from '../../../components/JcTable' // 导入表格组件
import SearchBar from '../../../components/SearchBar'
import styles from '../Position.less'
// import styles from './Supplier.less'
import { selectAllClassify, updateEnableStatus } from '../../../services/supplier/supplier'
import SupplierInformation from './supplierInformation'
import Supplierexce from './Supplierexce'
import { effectFetch } from '../../../utils/utils'
// import { getOtherStore } from '../../../utils/otherStore'


const Option = Select.Option
@connect(state => ({
    supplier: state.supplier,
  }))
  @Form.create()
  export default class Supplier extends Component {
    state = {
      supperlierInformationvisble: false,
      supperlierIn: false,
      Editrecord: {},
      typeName: [],
      Maindata: {},
      supplierImportvisble: false,
      Maintext: '',
    }
    componentDidMount() {
      // const { supplier } = getOtherStore()
      // if (!supplier || supplier.list.length === 0) {
      //   this.props.dispatch({ type: 'supplier/fetch' })
      // }
      effectFetch('supplier', this.props.dispatch)
    }
TypeNoms = () => {
  const payload = Object.assign({
    dictType: 2,
  })
  selectAllClassify({
    ...payload,
  }).then((json) => {
   this.setState({
    typeName: json,
   })
  })
}
// 编辑的弹框参数
    Edit = (record) => {
      this.setState({
        supperlierInformationvisble: true,
        Editrecord: record,
        supperlierIn: false,
      })
    }
// 编辑的弹框参数初始值回复
editImport = () => {
  this.setState({
    supperlierInformationvisble: false,
    supperlierIn: false,
  })
  this.props.dispatch({
    type: 'supplier/search',
  })
}
editImporttwo = () => {
  this.setState({
    supperlierInformationvisble: false,
    supperlierIn: false,
  })
}
    Delect = (record) => {
      const payload = Object.assign({
        supplierNo: record.supplierNo,
      })
      this.props.dispatch({
        type: 'supplier/postdelete',
        payload,
      })
    }
    Information = () => {
      this.setState({
        supperlierInformationvisble: true,
        supperlierIn: true,
        Editrecord: {},
      })
    }

// 导入新的供应商
supplierImport = () => {
  this.setState({
    supplierImportvisble: true,
  })
}
//  导入新的供应商初始值回复
supplierIndex = () => {
  this.setState({
    supplierImportvisble: false,
  })
}

// 导出所有的复核条件的单据 exportSkus
exportSkus = () => {
  const { searchParam } = this.props.supplier
  this.props.dispatch({
    type: 'supplier/exportSku',
    payload: { searchParam, fileName: '供应商信息.xls' },
  })
}
// 启用禁用
change = (selectedRows, key) => {
  const select = []
  for (let i = 0; i < selectedRows.length; i++) {
    select[i] = selectedRows[i].supplierNo
  }
  const payload = Object.assign({
    supplierNos: select,
    enableStatus: key.key,
  })
  updateEnableStatus({
    ...payload,
  }).then((json) => {
    if (json) {
      const { searchParam } = this.props.supplier
      this.props.dispatch({
        type: 'supplier/search',
        payload: { searchParam },
      })
    } else {
      console.log('启用/禁用失败===', json)
    }
  })
}
Scancel = () => {
  console.log('用户什么都没有做')
}
    render() {
      // 表格组件参数
      const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.supplier
      const menu = (
        <Menu type="primary" onClick={this.change.bind(this, selectedRows)}>
          <Menu.Item key="1"><Icon type="check-circle-o" />启用</Menu.Item>
          <Menu.Item key="0"><Icon type="close-circle-o" />禁用</Menu.Item>
        </Menu>
    )
      // 操作栏
      const tabelToolbar = [
        <Button key={1} type="primary" premission="SUPPLIER_SAVE" onClick={this.Information} size="small">添加新的供应商</Button>,
        <Dropdown key={2} overlay={menu} premission="SUPPLIER_UEBSTATE" disabled={(selectedRows.length > 0) ? !true : true} type="primary" size="small">
          <Button className={styles.Button} type="primary" size="small" style={{ marginLeft: 4 }}>
            启用/禁用 <Icon type="down" />
          </Button>
        </Dropdown>,
        <Button key={3} type="primary" premission="SUPPLIER_UPLOAD" size="small" onClick={this.supplierImport.bind(this)} style={{ marginLeft: 4 }}>导入新的供应商</Button>,
        <Button key={4} type="primary" premission="SUPPLIER_EXPORTSKUS" size="small" style={{ marginLeft: 4 }} onClick={this.exportSkus.bind(this)}>导出所有符合条件的单据</Button>,
      ]
        const columns = [{
          title: '供应商编码',
          // 供应商编码
          dataIndex: 'supplierNo',
          key: 'supplierNo',
          width: 80,
          render: (text) => {
            return (
              <span>{text}</span>
            )
          },
        }, {
          title: '供应商名',
          dataIndex: 'supplierName',
          key: 'supplierName',
          width: 100,
        }, {
          title: '操作',
          dataIndex: 'updata',
          key: 'updata',
          width: 100,
          render: (text, record) => {
            // className={styles.pppp}
            return (
              <a><span onClick={this.Edit.bind(this, record)}>编辑</span>&nbsp;&nbsp;
                <Popconfirm title="是否删除该条数据?" onConfirm={this.Delect.bind(this, record)} onCancel={this.Scancel} okText="确定" cancelText="取消">
                  <span>删除</span>
                </Popconfirm>
              </a>
            )
          },
        }, {
          title: '启用',
          dataIndex: 'enableStatus',
          key: 'enableStatus',
          width: 60,
          render: (text) => {
            switch (text) {
              // 启用状态(0:不启用; 1:启用)
              case (0):
              return <Checkbox checked={false} />
              case (1):
              return <Checkbox checked />
              default:
          }
          },
        }, {
          title: '联系地址',
          dataIndex: 'address',
          key: 'address',
          width: 80,
        }, {
          title: '供应商分类',
          dataIndex: 'classifyName',
          key: 'classifyName',
          width: 80,
        }, {
          title: '负责人',
          dataIndex: 'contacts',
          key: 'contacts',
          width: 80,
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
          title: '传真',
          dataIndex: 'faxNo',
          key: 'faxNo',
          width: 80,
        }, {
          title: '旺旺号',
          dataIndex: 'alitmNo',
          key: 'alitmNo',
          width: 80,
        }, {
          title: '开户银行',
          dataIndex: 'bankName',
          key: 'bankName',
          width: 80,
        }, {
          title: '银行账号',
          dataIndex: 'bankAccount',
          key: 'bankAccount',
          width: 80,
        }, {
          title: '助记符',
          dataIndex: 'acronyms',
          key: 'acronyms',
          width: 80,
        }, {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: 100,
        }, {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: 80,
          render: (text) => {
            return text ? moment(text).format('YYYY-MM-DD') : null
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
          bordered: true,
          nameSpace: 'supplier',
          tableName: 'supplierTable',
          dispatch: this.props.dispatch,
          selectedRows,
          selectedRowKeys,
          scroll: { x: 1900 },          
          rowKey: 'supplierNo',
        }
        const autoNotypeName = this.state.typeName.map((k) => {
          return (
            <Option value={k.itemName}>{k.itemName}</Option>
          )
        })
        // 搜索栏
        const searchBarItem = [
          {
            decorator: 'supplierNo',
            components: <Input placeholder="供应商编号" size="small" />,
          },
          {
              decorator: 'supplierName',
              components: <Input placeholder="供应商名称" size="small" />,
            },
          {
            decorator: 'classifyName',
            components: (
              <Select placeholder="供应商分类名称" onFocus={this.TypeNoms.bind(this)} size="small" style={{ marginTop: 4 }}>
                {autoNotypeName}
              </Select>),
          },
          {
              decorator: 'enableStatus',
              components: (
                <Select placeholder="启用状态" size="small" style={{ marginTop: 4, width: 90 }}>
                  <Option value="0">不启用</Option>
                  <Option value="1">启用</Option>
                  <Option value="2">全部</Option>
                </Select>),
            },
        ]
        // 搜索栏参数
        const searchBarProps = {
          colItems: searchBarItem,
          dispatch: this.props.dispatch,
          nameSpace: 'supplier',
          searchParam,
        }
        // 添加编辑modal参数
        const supperlierInformation = {
          supperlierInformationvisble: this.state.supperlierInformationvisble,
          supperlierIn: this.state.supperlierIn,
          MaintenanceClass: this.MaintenanceClass,
          Maindata: this.state.Maindata,
          Editrecord: this.state.Editrecord,
          editImport: this.editImport,
          editImporttwo: this.editImporttwo,
        }

        // 导入新的供应商参数
        const supplierIm = {
          supplierImportvisble: this.state.supplierImportvisble,
          supplierIndex: this.supplierIndex,
        }
        return (
          <div className={styles.contentBoard}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <SearchBar {...searchBarProps} />
              </div>
              <Jtable {...tableProps} />
            </div>
            {this.state.supperlierInformationvisble ? <SupplierInformation
              supperlierInformation={supperlierInformation}
            /> : null}
            <Supplierexce supplierIm={supplierIm} />
          </div>
        )
    }
}

