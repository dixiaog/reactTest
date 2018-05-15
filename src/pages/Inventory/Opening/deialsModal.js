import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Input, Avatar, Card, Button, Popconfirm, Divider, message } from 'antd'
import numeral from 'numeral'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import { saveById, positiondelete, listExport, updateStatus } from '../../../services/opening/opening'
import DeialsPostiong from './deialsPostiong'
import DelectList from './delectList'
import OpeningExcel from './OpeningExcel'
import styles from './index.less'
import DeialsInput from './deialsInput'

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  })
}
  @connect(state => ({
    deialsmodal: state.deialsmodal, // saveById
  }))

export default class Deialsmodal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            deialsModalList: {},
            deialsPositionvis: false,
            DelectListvis: false,
            delectselectedRows: [],
            OpeningExcelvis: false,
          }
          this.state = { data }
          this.cacheData = this.state.data.map(item => ({ ...item }))
    }
    componentWillMount() {
      this.setState({
        deialsModalList: this.props.data.deialsModalList,
      })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: [],
            // deialsModalList: nextProps.data.deialsModalList,
          })
        if (nextProps.deialsmodal.list.length) {
            this.setState({
                data: nextProps.deialsmodal.list,
            })
        }
    }
    handleCancel = () => {
        this.props.data.Raddressone()
    }

handleChange1(value, key, column) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    if (target) {
      target[column] = value
      this.setState({ data: newData })
    }
  }

  handleChange2(value, key, column) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    if (target) {
      target[column] = value
      this.setState({ data: newData })
    }
  }
  handleChange3(value, key, column) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    if (target) {
      target[column] = value
      this.setState({ data: newData })
    }
  }

  edit(key) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    if (target) {
      target.editable = true
      this.setState({ data: newData })
    }
  }
  save(key) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    target.billNum = numeral(`${target.billNum}`).value()
    target.costPrice = numeral(`${target.costPrice}`).value()
    target.retailPrice = numeral(`${target.retailPrice}`).value()
      saveById({
    ...target,
  }).then((json) => {
    if (json) {
     if (target) {
      delete target.editable
      this.setState({ data: newData })
      this.cacheData = newData.map(item => ({ ...item }))
    }
    } else {
    console.log('数据保存失败')
    }
  })
  }
  cancel(key) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
      delete target.editable
      this.setState({ data: newData })
    }
    this.props.dispatch({
      type: 'deialsmodal/search',
      // payload,
    })
  }
  // listExport
listExportone = () => {
  listExport({ fileName: '商品编码供盘库存.xls' }).then((json) => {
    console.log('listExportone', json)
  })
}
OpeningExcelone = () => {
  this.setState({
    OpeningExcelvis: true,
  })
}
OpeningExceltwo = () => {
  this.setState({
    OpeningExcelvis: false,
  })
  const payload = this.state.deialsModalList
  this.props.dispatch({
      type: 'deialsmodal/fetch',
      payload,
  })
}

Confirm = () => {
  const payload = Object.assign({
    billNo: this.state.deialsModalList.billNo,
  })
  updateStatus({
    ...payload,
  }).then((json) => {
    if (json) {
      this.props.dispatch({
        type: 'opening/fetch',
      })
      this.props.data.Raddressone()
    } else {
      console.log('确认生效失败')
    }
  })
}
// 添加新的期初商品库存
deialsPositionvis = () => {
  this.setState({
    deialsPositionvis: true,
  })
}
deialsPositionone = () => {
  this.setState({
    deialsPositionvis: false,
  })
}
saveOpening = () => {
  const payload = {
    list: this.state.data,
  }
  saveById({
    ...payload,
  }).then((json) => {
    if (json) {
      const payload = this.state.deialsModalList
      this.props.dispatch({
          type: 'deialsmodal/fetch',
          payload,
      })
    }
  })
}
delectone = (x) => {
  this.setState({
    DelectListvis: true,
    delectselectedRows: x,
  })
}
delecttwo = () => {
  this.setState({
    DelectListvis: false,
    delectselectedRows: [],
  })
}
delect = (x) => {
  const autoNos = []
  for (let i = 0; i < x.length; i++) {
    if (i === 0) {
      autoNos[0] = x[0].autoNo
    } else {
      autoNos[i] = x[i].autoNo
    }
  }
  const payload = {
    autoNo: autoNos,
  }
  positiondelete({
    ...payload,
  }).then((json) => {
    if (json) {
      const payload = this.state.deialsModalList
      this.props.dispatch({
        type: 'deialsmodal/fetch',
        payload,
    })
      this.setState({
        DelectListvis: false,
        delectselectedRows: [],
      })
    }
  })
}
OnBlur1 = (value, key) => {
  const newData = [...this.state.data]
  const target = newData.filter(item => key === item.skuNo)[0]
  // const number = Number(target.billNum.trim().replace(/\s/g, ''))
  target.billNum = numeral(`${target.billNum}`).value()
  if (/^\d+$/.test(target.billNum)) {
    saveById({
      ...target,
    }).then((json) => {
      if (json) {
       console.log('单据数量保存成功')
      } else {
       console.log('单据数量保存失败')
      }
    })
  } else {
    message.warning('您输入的不是数字，请输入数字？')
  }
  }
OnBlur2 = (value, key) => {
  const newData = [...this.state.data]
  const target = newData.filter(item => key === item.skuNo)[0]
  target.costPrice = numeral(`${target.costPrice}`).value()
  if (/^\d+$/.test(target.costPrice)) {
    saveById({
      ...target,
    }).then((json) => {
      if (json) {
       console.log('期初成本单价保存成功')
      } else {
      console.log('期初成本单价保存失败')
      }
    })
  } else {
    message.warning('你输入的不是数字，请输入数字？')
  }
    // costPrice 期初成本单价
}

OnBlur3 = (value, key) => {
  const newData = [...this.state.data]
  const target = newData.filter(item => key === item.skuNo)[0]
  if (target.locationNo.length === 0) {
    console.log('用户没有输入，不触发保存')
  } else {
  //  locationNo 仓位
  const locationNos = String(target.locationNo).replace(/\s/g, '')
  const payload = target
  payload.locationNo = locationNos
  saveById({
    ...target,
  }).then((json) => {
    if (json) {
      console.log('仓位编号保存成功')
    } else {
      console.log('仓位编号保存失败')
    }
  })
  }
}
renderColumns1(text, record, column) {
  return (
    <DeialsInput
      editable={record.editable}
      value={(record.editable) ? numeral(`${text}`).value() : numeral(text).format('0,0')}
      onChange={value => this.handleChange1(numeral(`${value}`).value(), record.skuNo, column)}
      onBlur={value => this.OnBlur1(value, record.skuNo)}
    />
  )
}
renderColumns2(text, record, column) {
  return (
    <DeialsInput
      editable={record.editable}
      value={(record.editable) ? numeral(`${text}`).value() : numeral(text).format('0,0')}
      onChange={value => this.handleChange2(numeral(`${value}`).value(), record.skuNo, column)}
      onBlur={value => this.OnBlur2(value, record.skuNo)}
    />
  )
}
renderColumns3(text, record, column) {
  return (
    <DeialsInput
      editable={record.editable}
      value={text}
      onChange={value => this.handleChange3(value, record.skuNo, column)}
      onBlur={value => this.OnBlur3(value, record.skuNo, column)}
    />
  )
}
 render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.deialsmodal
    const billStatus = this.state.deialsModalList.billStatus
    const searchBarItem = [
        {
          decorator: 'skuNo',
          components: <Input placeholder="商品编码" size="small" />,
          }, {
          decorator: 'productName',
          components: <Input placeholder="商品名称" size="small" />,
        },
      ]
        // 操作栏
    const tabelToolbar = [
      <Button type="primary" disabled={(billStatus === 0) ? !true : true} premission="OPENING_SAVEBYBILLNO" size="small" onClick={this.deialsPositionvis.bind(this)}>添加新的期初商品</Button>,
      <Button
        type="primary"
        premission="OPENING_DELETE"
        size="small"
        disabled={(selectedRows.length === 0) ? true : (billStatus === 0) ? !true : true}
        onClick={this.delectone.bind(this, selectedRows)}
      >
          删除
      </Button>,
      <Button type="primary" premission="OPENING_UPLOAD" size="small" disabled={(billStatus === 0) ? !true : true} onClick={this.OpeningExcelone.bind(this)}>导入期初库存</Button>,
      <Button type="primary" premission="OPENING_UPDATESTATUS" size="small" disabled={(billStatus === 0) ? !true : true} onClick={this.Confirm.bind(this)}>确认生效</Button>,
      <Button type="primary" premission="OPENING_LISTEXPORT" size="small" disabled={(billStatus === 0) ? !true : true} onClick={this.listExportone.bind(this)}>导出商品编码供盘库存</Button>,
          ]
// 搜索栏参数
const searchBarProps = {
    colItems: searchBarItem,
    dispatch: this.props.dispatch,
    nameSpace: 'deialsmodal',
    searchParam,
  }
 const columns = [{
    title: '图片',
    dataIndex: 'productImage',
    key: 'productImage',
    width: 80,
    render: (text) => {
      return (<Avatar shape="square" src={text} />)
      },
  }, {
    title: '商品编码',
    dataIndex: 'skuNo',
    key: 'skuNo',
    width: 100,
  }, {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: 100,
  }, {
    title: '颜色及规格',
    dataIndex: 'productSpec',
    key: 'productSpec',
    width: 100,
  }, {
    title: '仓位编号',
    dataIndex: 'locationNo',
    key: 'locationNo',
    width: 100,
    render: (text, record) => this.renderColumns3(text, record, 'locationNo'),
  }, {
    title: '期初成本单价',
    dataIndex: 'costPrice',
    key: 'costPrice',
    width: 100,
    render: (text, record) => this.renderColumns2(numeral(`${text}`).value(), record, 'costPrice'),
  }, {
    title: '单据数量',
    dataIndex: 'billNum',
    key: 'billNum',
    width: 100,
    render: (text, record) => this.renderColumns1(numeral(`${text}`).value(), record, 'billNum'),
  }, {
    title: '成本金额',
    dataIndex: 'retailPrice',
    key: 'retailPrice',
    width: 100,
    render: (text, record) => {
      const retailPrice = record.costPrice * record.billNum
      return (
        numeral(retailPrice).format('0,0')
      )
    },
  }, {
    title: '操作',
    dataIndex: 'address',
    key: 'address',
    width: 100,
    render: (text, record) => {
        const { editable } = record
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.save(record.skuNo)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm title="确定取消编辑?" onConfirm={() => this.cancel(record.skuNo)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                : (billStatus === 0) ? <a onClick={() => this.edit(record.skuNo)}>编辑</a> : null
            }
          </div>
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
        nameSpace: 'deialsmodal',
        tableName: 'deialsmodalTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'skuNo',
        scroll: { y: 300 },
        custormTableClass: 'tablecHeightFix500',
    }
    const deialsPositiondata = {
      deialsModalList: this.state.deialsModalList,
      deialsPositionvis: this.state.deialsPositionvis,
      deialsPositionone: this.deialsPositionone,
      billNo: this.props.data.deialsModalList.billNo,
    }
    const DelectListdata = {
      DelectListvis: this.state.DelectListvis,
      delectselectedRows: this.state.delectselectedRows,
      delect: this.delect,
      delecttwo: this.delecttwo,
    }
    const OpeningExceldata = {
      OpeningExcelvis: this.state.OpeningExcelvis,
      OpeningExcelone: this.OpeningExcelone,
      OpeningExceltwo: this.OpeningExceltwo,
      deialsModalList: this.state.deialsModalList,
      billNo: this.props.data.deialsModalList.billNo,
    }
    return (
      <Modal
        title={[<h2>期初详细库存</h2>]}
        visible={this.props.data.deialsModalvis}
        footer={null}
        width={1000}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </Card>
        {(this.state.deialsPositionvis) ? <DeialsPostiong data={deialsPositiondata} /> : null }
        {(this.state.DelectListvis) ? <DelectList data={DelectListdata} /> : null}
        {(this.state.OpeningExcelvis) ? <OpeningExcel data={OpeningExceldata} /> : null}
      </Modal>
    )
}
}
