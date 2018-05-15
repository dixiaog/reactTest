/*
 * @Author: Wupeng
 * @Date: 2017-1-23 10:04:11
 * @Last Modified by;
 * 库存分仓
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, message, Input, Button, Avatar, Select } from 'antd'
import Jtable from '../../../components/JcTable'
import Divisiondelect from './Divisiondelect'
import Filstemadol from './FilsteMadol'
import DivisionExecl from './DivisionExecl'
import Positiondelect from './Positiondelect'
// import Wminout from './Wminout'
import Numdel from './Numdel'
import MainStorehouse from '../../Inventory/ItemInv/MainStorehouse'
import Delect from './delectDivision'
import { warehouseRefreshProductName, getWarehouse, deleteWarehouseNullInventory } from '../../../services/division/division'
import styles from './index.less'
// import { getOtherStore } from '../../../utils/otherStore'
import { effectFetch } from '../../../utils/utils'

const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option

@connect(state => ({
    division: state.division,
    itemInv: state.itemInv,
  }))
  @Form.create()
  export default class Division extends Component {
      state = {
        Divisiondelectvis: false,
        FilsteMadolvis: false,
        DivisionExeclvis: false,
        Positiondelectvis: false,
        detailModalVisiable: false,
        warehouseNo: '',
        Delectvis: false,
        childer: [],
        Wminoutvis: false,
        Wminoutrecord: {},
        status: 1,
        beginNum: null,
        endNum: null,
        skuNo: null,
        Numdelvis: false,
        selectData: null,
      }
      componentDidMount() {
        // 此处获取外部store判断是否需要重新加载页面
          // const { division } = getOtherStore()
          // if (!division || division.list.length === 0) {
          //   this.props.dispatch({ type: 'division/fetch' })
          // }
          effectFetch('division', this.props.dispatch)
          getWarehouse({}).then((json) => {
            const data = json.length && json.map((k) => {
              return (
                <Option key={k.warehouseNo} value={k.warehouseNo}>{k.warehouseName}</Option>
              )
            })
            this.setState({
              childer: data,
            })
          })
      }
// 清除现有库存
Divisiondelect = () => {
  this.setState({
    Divisiondelectvis: true,
  })
}
Divisiondelecttwo = () => {
  this.setState({
    Divisiondelectvis: false,
  })
}
Filste = () => {
  warehouseRefreshProductName({}).then((json) => {
    if (json) {
      this.setState({
        FilsteMadolvis: true,
      })
        this.props.dispatch({
          type: 'division/fetch',
        })
    } else {
      message.error('请求失败')
    }
  })
}
Filstetwo = () => {
  this.setState({
    FilsteMadolvis: false,
  })
}
DivisionExeclone = () => {
  this.setState({
    DivisionExeclvis: true,
  })
}
DivisionExeclotwo = () => {
  this.setState({
    DivisionExeclvis: false,
  })
}
export = () => {
  this.props.form.validateFieldsAndScroll((err, values) => {
    if (!err) {
      const value = values
      value.status = this.state.status
      value.beginNum = this.state.beginNum
      value.endNum = this.state.endNum
      const payload = Object.assign({
        searchParam: value,
      })
      this.props.dispatch({
        type: 'division/export',
        payload,
      })
    }
  })
}
main = () => {
  this.props.dispatch({
    type: 'division/secet',
  })
}
handleSubmit = (e) => {
  e.preventDefault()
  this.props.form.validateFieldsAndScroll((err, values) => {
    if (!err) {
      const value = values
      value.status = this.state.status
      value.beginNum = this.state.beginNum
      value.endNum = this.state.endNum
      const payload = Object.assign({
        searchParam: value,
      })
      this.props.dispatch({
        type: 'division/search',
        payload,
      })
    }
  })
}
delectsumber = () => {
  this.props.form.resetFields()
  this.setState({
    status: 1,
    beginNum: null,
    endNum: null,
  })
  this.props.dispatch({
    type: 'division/search',
    payload: { searchParam: {} },
  })
}
Numdeltwo = () => {
  this.setState({
    Numdelvis: false,
  })
}

adressselect = (record) => {
    this.setState({
      detailModalVisiable: true,
      skuNo: record.skuNo,
      warehouseNo: record.warehouseNo,
      selectData: record,
      /** detailModalVisiable: true,
      autoNo: record.skuNo,
      selectData: record, */
    })
}
adressone = () => {
  this.setState({
    detailModalVisiable: true,
    skuNo: null,
  })
  this.props.dispatch({
    type: 'division/fetch',
  })
}
choose = (e) => {
  this.setState({
    status: e,
  })
}
input11 = (e) => {
  if (/^\d+$/.test(e.target.value)) {
    this.setState({
      beginNum: e.target.value,
    })
  }  else if (e.target.value === '') {
    this.setState({
      beginNum: e.target.value,
    })
  } else {
    this.setState({
      Numdelvis: true,
    })
  }
}
input12 = (e) => {
  if (/^\d+$/.test(e.target.value)) {
    this.setState({
      endNum: e.target.value,
    })
  } else if (e.target.value === '') {
    this.setState({
      endNum: e.target.value,
    })
  } else {
    this.setState({
      Numdelvis: true,
    })
  }
}
delectskunoone = () => {
  this.setState({
    Delectvis: true,
  })
}
delectskuno = () => {
  deleteWarehouseNullInventory({}).then((json) => {
    if (json) {
      this.setState({
        Delectvis: false,
      })
      this.props.dispatch({
        type: 'division/search',
      })
    } else {
      message.error('清除失败')
    }
  })
}
render() {
  const { getFieldDecorator } = this.props.form
  const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.division
  // 操作栏
  const tabelToolbar = [
    <Button key={1} premission="" type="primary" size="small" onClick={this.Divisiondelect}>清除现有库存</Button>,
    <Button key={2} premission="DIVISION_WAREREFPNAM" type="primary" size="small" onClick={this.Filste.bind(this)}>刷新商品名</Button>,
    <Button key={3} premission="DIVISION_EXPORTSKU" type="primary" size="small" onClick={this.export}>导出所有符合条件的单据</Button>,
    <Button key={4} premission="DIVISION_DELECTWARNU" type="primary" size="small" onClick={this.delectskunoone}>清除0库存资料</Button>,
    <Button key={5} premission="DIVISION_UPLOADSI" type="primary" size="small" onClick={this.DivisionExeclone}>导入安全库存</Button>,
  ]
  const columns = [{
    title: '仓储方',
    dataIndex: 'warehouseName',
    key: 'warehouseName',
    width: 100,
    }, {
    title: '图',
    dataIndex: 'productImage',
    key: 'productImage',
    width: 100,
    render: (text) => {
      return (<Avatar shape="square" src={text} />)
      },
    }, {
      title: '款式编码',
      dataIndex: 'productNo',
      key: 'productNo',
      width: 100,
    }, {
      title: '商品编码',
      dataIndex: 'skuNo',
      key: 'skuNo',
      width: 100,
    }, {
      title: '商品名',
      dataIndex: 'productName',
      key: 'productName',
      width: 100,
    }, {
      title: '颜色及规格',
      dataIndex: 'productSpec',
      key: 'productSpec',
      width: 100,
    }, {
      title: '主仓库实际库存',
      dataIndex: 'inventoryNum',
      key: 'inventoryNum',
      width: 130,
    }, {
      title: '安全库存',
      dataIndex: 'safetyLowerLimit',
      key: 'safetyLowerLimit',
      width: 100,
    }, {
      title: '仓库待发数',
      dataIndex: 'waitDeliveryNum',
      key: 'waitDeliveryNum',
      width: 100,
    }, {
      title: '销退仓库存',
      dataIndex: 'returnWarehouseNum',
      key: 'returnWarehouseNum',
      width: 100,
    }, {
      title: '进货仓库存',
      dataIndex: 'inWarehouseNum',
      key: 'inWarehouseNum',
      width: 80,
  }, {
      title: '次品库存',
      dataIndex: 'defectiveWarehouseNum',
      key: 'defectiveWarehouseNum',
      width: 100,
    }, {
      title: '主仓库存明细账',
      dataIndex: 'address',
      key: 'address',
      width: 120,
      render: (text, record) => {
        return (
          <a onClick={this.adressselect.bind(this, record)}>主仓库存明细账</a>
          )
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
        nameSpace: 'division',
        tableName: 'divisionTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { x: 1320 },
      }
      const Divisiondelectdata = {
        Divisiondelectvis: this.state.Divisiondelectvis,
        Divisiondelecttwo: this.Divisiondelecttwo,
      }
      const FilsteMadoldata = {
        FilsteMadolvis: this.state.FilsteMadolvis,
        Filstetwo: this.Filstetwo,
      }
      const DivisionExecldata = {
        DivisionExeclvis: this.state.DivisionExeclvis,
        DivisionExeclotwo: this.DivisionExeclotwo,
      }
      const Positiondelectdata = {
        Positiondelectvis: this.state.Positiondelectvis,
      }
      const detailModalProps = {
        skuNo: this.state.skuNo,
        warehouseNo: this.state.warehouseNo,
        selectData: this.state.selectData,
        type: 2,
        dispatch: this.props.dispatch,
        itemModalHidden: () => {
          this.setState({
            detailModalVisiable: false,
            skuNo: '',
          })
        },
        detailModalVisiable: this.state.detailModalVisiable,
      }
      const DelectData = {
        Delectvis: this.state.Delectvis,
        delectskuno: this.delectskuno,
        delectskunoone: () => {
          this.setState({
            Delectvis: false,
          })
        },
      }
      const Numdel1 = {
        Numdelvis: this.state.Numdelvis,
        Numdeltwo: this.Numdeltwo,
      }
          return (
            <div>
              <div className={styles.contentBoard}>
                <div className={styles.tableList}>
                  <div>
                    <Form span={24} layout="inline" onSubmit={this.handleSubmit}>
                      <FormItem>
                        {getFieldDecorator('productNo', {
                          initialValue: searchParam.productNo,
                        })(
                          <Input size="small" style={{ width: 100 }} placeholder="请输入款式编码" />
                          )}
                      </FormItem>
                      <FormItem>
                        {getFieldDecorator('skuNo', {
                          initialValue: searchParam.skuNo,
                        })(
                          <Input size="small" style={{ width: 100 }} placeholder="请输入商品编码" />
                          )}
                      </FormItem>
                      <FormItem>
                        {getFieldDecorator('productName', {
                          initialValue: searchParam.productName,
                        })(
                          <Input size="small" style={{ width: 100 }} placeholder="请输入商品名称" />
                          )}
                      </FormItem>
                      <FormItem>
                        {getFieldDecorator('product', {
                          initialValue: searchParam.product,
                        })(
                          <InputGroup compact style={{ marginTop: 7 }}>
                            <Select value={`${this.state.status}`} size="small" onChange={this.choose}>
                              <Option value="1">主仓实际范围</Option>
                              <Option value="2">主仓库存减安全库存</Option>
                              <Option value="3">销退仓库库存</Option>
                              <Option value="4">进货仓库存</Option>
                              <Option value="5">次品仓库存</Option>
                            </Select>
                            <Input size="small" value={this.state.beginNum} style={{ width: 80, textAlign: 'center' }} onChange={this.input11} />
                            <Input size="small" style={{ width: 20, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                            <Input size="small" value={this.state.endNum} style={{ width: 80, textAlign: 'center', borderLeft: 0 }} onChange={this.input12} />
                          </InputGroup>
                          )}
                      </FormItem>
                      <FormItem>
                        {getFieldDecorator('warehouseNo', {
                          initialValue: searchParam.warehouseNo,
                        })(
                          <Select style={{ width: 100 }} size="small" placeholder="请选择仓储方">
                            {this.state.childer}
                          </Select>
                        )}
                      </FormItem>
                      <Button type="primary" htmlType="submit" size="small" style={{ marginTop: 7 }}> 搜索</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button size="small" onClick={this.delectsumber}>清空</Button>&nbsp;&nbsp;&nbsp;&nbsp;<a onClick={this.main}>等于低于安全库存</a>
                    </Form>
                  </div>
                  <Jtable {...tableProps} />
                </div>
              </div>
              {(this.state.Divisiondelectvis) ? <Divisiondelect data={Divisiondelectdata} /> : null}
              {(this.state.FilsteMadolvis) ? <Filstemadol data={FilsteMadoldata} /> : null}
              {(this.state.DivisionExeclvis) ? <DivisionExecl data={DivisionExecldata} /> : null}
              {(this.state.Positiondelectvis) ? <Positiondelect data={Positiondelectdata} /> : null}
              {(this.state.detailModalVisiable) ? <MainStorehouse {...detailModalProps} /> : null }
              {(this.state.Delectvis) ? <Delect data={DelectData} /> : null}
              {(this.state.Numdelvis) ? <Numdel data={Numdel1}/> : null}
            </div>
          )
      }
  }
