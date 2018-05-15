/*
 * @Author: tanmengjia
 * @Date: 2018-01-22 09:02:22
 * @Last Modified by: tanmengjia
 * 店铺商品资料
 * @Last Modified time: 2018-05-14 15:33:42
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Select, Input, Popconfirm, Divider, Dropdown, Icon, Menu, DatePicker, Modal, Radio, Col, message, Checkbox, InputNumber, Table, Upload } from 'antd'
import reqwest from 'reqwest'
import update from 'immutability-helper'
import Jtable from '../../../components/JcTable'
import { getLocalStorageItem, checkPremission } from '../../../utils/utils'
import SearchBar from '../../../components/SearchBar'
import EditInputCell from '../../../components/EditInputCell'
import styles from '../Item.less'
import config from '../../../utils/config'
import { syncShopSku, deleteLink, editSave } from '../../../services/item/shopProduct'
import { getOtherStore } from '../../../utils/otherStore'

const RadioGroup = Radio.Group
const { Option } = Select
const isOn = (record) => {
  if (record.onShelves === 0) {
    return '否'
  } else if (record.onShelves === 1) {
    return '是'
  }
}

@connect(state => ({
  shopProduct: state.shopProduct,
}))
export default class ShopProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      synchroVisiable: false,
      chooseRows: [],
      shops: [],
      value: '',
      use: '',
      importVisiable: false,
      chooseName: '',
      importModalVisiable: false,
      fileList: [],
      loading: false,
      ephemeralData: {},
      dataWhenCancel: [],
      data: [],
      startValue: null,
      endValue: null,
      data1: [{
        productNo: 'B12353S2',
        skuNo: 'A12353S2',
        eanCode: 'H0000950101',
        shopProductNo: 'ASDSX036',
        shopSkuNo: 'ASDSX036001',
        oldSkuNo: 'ABC1025001',
        productName: '羽绒服',
        shopProductSpec: '黑色/180',
      }, {
        productNo: 'B12353S2',
        skuNo: 'A12353S3',
        eanCode: 'H0000950102',
        shopProductNo: 'ASDSX037',
        shopSkuNo: 'ASDSX037001',
        oldSkuNo: 'ABC1025002',
        productName: '羽绒服',
        shopProductSpec: '黑色/175',
      }],
      columns: [{
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
        title: '款式编码',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 150,
        render: (text, record) => this.renderColumns(text, record, 'productNo'),
      }, {
        title: '商品编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 170,
        render: (text, record) => this.renderColumns(text, record, 'skuNo'),
      }, {
        title: '操作',
        dataIndex: 'opreation',
        key: 'opreation',
        width: 100,
        className: styles.columnCenter,
        render: (text, record) => {
          if (checkPremission('SHOPPRODUCT_EDIT')) {
            const { editable } = record
            return (
              <div className="editable-row-operations">
                {
                  editable ?
                    <span>
                      <Popconfirm title="确定保存？?" onConfirm={() => this.save(record.autoNo)}>
                        <a>保存</a>
                      </Popconfirm>
                      <Divider type="vertical" />
                      <a onClick={this.cancel.bind(this, record.autoNo)} >取消</a>
                    </span>
                    : <a onClick={this.edit.bind(this, record.autoNo)} >编辑</a>
                }
              </div>
            )
          }
          },
      }, {
        title: '国际码',
        dataIndex: 'eanCode',
        key: 'eanCode',
        width: 120,
      }, {
        title: '店铺编号',
        dataIndex: 'shopNo',
        key: 'shopNo',
        width: 120,
      }, {
        title: '店铺名称',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 120,
      }, {
        title: '平台站点名称',
        dataIndex: 'siteName',
        key: 'siteName',
        width: 120,
      }, {
        title: '店铺款式编码',
        dataIndex: 'shopProductNo',
        key: 'shopProductNo',
        width: 140,
      }, {
        title: '店铺商品编码',
        dataIndex: 'shopSkuNo',
        key: 'shopSkuNo',
        width: 140,
      }, {
        title: '是否上架',
        dataIndex: 'onShelves',
        key: 'onShelves',
        width: 80,
        render: (text, record) => (
          isOn(record)
        ),
      // }, {
      //   title: '锁定库存',
      //   dataIndex: 'lockInventory',
      //   key: 'lockInventory',
      //   width: 80,
    }, {
        title: '最新同步时间',
        dataIndex: 'lastSyncTime',
        key: 'lastSyncTime',
        width: 130,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      }, {
        title: '店铺颜色规格',
        dataIndex: 'shopProductSpec',
        key: 'shopProductSpec',
        width: 130,
    }, {
        title: '颜色及规格',
        dataIndex: 'productSpec',
        key: 'productSpec',
        width: 130,
      }, {
        title: '原始商品编码',
        dataIndex: 'oldSkuNo',
        key: 'oldSkuNo',
        width: 150,
    }],
    }
  }
  componentDidMount() {
    const { shopProduct } = getOtherStore()
    const tabKeys = getLocalStorageItem('shopProduct')
    const isInTab = tabKeys ? tabKeys.split(',').indexOf('shopProduct') > -1 : false
    if (!shopProduct || (shopProduct.list.length === 0 && !isInTab)) {
      this.props.dispatch({ type: 'shopProduct/fetch' })
    } else {
      this.setState({
        data: shopProduct.list,
      })
    }
    this.props.dispatch({ type: 'shopProduct/getShopName' })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      shops: nextProps.shopProduct.lists,
      data: nextProps.shopProduct.list,
      dataWhenCancel: nextProps.shopProduct.list,
    })
  }
  onChange1 = (field, value) => {
    this.setState({
      [field]: value,
    })
  }
  onStartChange = (value) => {
    this.onChange1('startValue', value)
  }
  onEndChange = (value) => {
    this.onChange1('endValue', value)
  }
  onFileChange = () => {
    this.setState({
      importModalVisiable: false,
    })
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
      chooseName: this.state.shops.filter(ele => ele.shopNo === e.target.value)[0].shopName,
    })
  }
  handleChange = (value, record, column) => {
    const index = this.state.data.findIndex(e => e.autoNo === record.autoNo)
    this.setState(update(
      this.state, {
        ephemeralData: {
          [record.autoNo]: { $merge: { [column]: value } },
        },
        data: { [index]: { $merge: { [column]: value } } },
      }
    ))
  }
  edit = (autoNo) => {
    const { data } = this.state
    const target = data.filter(item => autoNo === item.autoNo)[0]
    if (target) {
      target.editable = true
      this.setState({ data, ephemeralData: Object.assign(this.state.ephemeralData, { [autoNo]: target }) })
    }
  }
  save(autoNo) {
    const { ephemeralData, data, dataWhenCancel } = this.state
    const target = ephemeralData[autoNo]// newData.filter(item => autoNo === item.autoNo)[0]
    const index = data.findIndex(e => e.autoNo === autoNo)
    delete ephemeralData[autoNo]
    if (target) {
      const payload = {
        autoNo: target.autoNo,
        productNo: target.productNo,
        skuNo: target.skuNo,
      }
      editSave(payload).then((json) => {
        if (json) {
          target.editable = false
          data[index] = target
          dataWhenCancel[index] = target
          this.setState({ data, ephemeralData, dataWhenCancel })
        }
      })
    }
  }
  cancel(autoNo) {
    const { ephemeralData, dataWhenCancel, data } = this.state
    delete ephemeralData[autoNo]
    const target = dataWhenCancel.filter(item => autoNo === item.autoNo)[0]
    target.editable = false
    const index = data.findIndex(e => e.autoNo === autoNo)
    data[index] = target
    this.setState({ data, ephemeralData })
  }
  tbClick = (e) => {
    switch (e.key * 1) {
      case 1:
      this.props.dispatch({
        type: 'shopProduct/exportShopSku',
        payload: { searchParam: this.props.shopProduct.searchParam, IDLst: [], fileName: '店铺商品资料.xls' },
      })
      break
      case 2:
      this.props.dispatch({
        type: 'shopProduct/exportRepeatShopSku',
        payload: { IDLst: [], fileName: '重复铺货商品.xls' },
      })
      break
      case 3:
      this.props.dispatch({
        type: 'shopProduct/exportNoDistributionShopSku',
        payload: { IDLst: [], fileName: '有库存未铺货商品.xls' },
      })
      break
      default:
      break
    }
  }
  handleOk = () => {
    if (this.state.value > -1) {
      if (this.state.use * 1 === 0) {
        syncShopSku(this.state.value).then((json) => {
          if (json) {
            this.props.dispatch({
              type: 'shopProduct/search',
            })
            this.setState({
              value: '',
              synchroVisiable: false,
              use: '',
            })
          }
        })
      } else if (this.state.use * 1 === 1) {
        this.setState({
          synchroVisiable: false,
          importVisiable: true,
        })
      } else if (this.state.use * 1 === 2) {
        deleteLink(this.state.value).then((json) => {
          if (json) {
            this.props.dispatch({
              type: 'shopProduct/search',
            })
            this.setState({
              value: '',
              synchroVisiable: false,
              use: '',
            })
          }
        })
      }
    } else {
      message.error('请选择一个店铺')
    }
  }
  okImport = () => {
    if (this.state.fileList.length === 0) {
      this.setState({
        importModalVisiable: true,
      })
    } else {
      if (this.state.value > -1) {
        if (this.state.use === 1) {
          // 激活按钮加载状态
          this.setState({ loading: true })
          const { fileList } = this.state
          const formData = new FormData()
          fileList.forEach((file) => {
            formData.append('file', file)
          })
          formData.append('shopNo', this.state.value)
          formData.append('shopName', this.state.shops.filter(row => row.shopNo === this.state.value)[0].shopName)
          // You can use any AJAX library you like
          reqwest({
            url: `${config.APIV1}/prodm/shop/sku/uploadShopSku`,
            headers: {
              'Authorization': `Basic ${getLocalStorageItem('token')}`,
              'CompanyNo': `${getLocalStorageItem('companyNo')}`,
              'UserNo': `${getLocalStorageItem('userNo')}`,
            },
            method: 'post',
            processData: false,
            data: formData,
            success: (json) => {
              if (json.success) {
                this.setState({
                  fileList: [],
                })
                message.success('上传成功')
                message.success(json.errorMessage)
                this.setState({ loading: false })
                this.props.dispatch({
                  type: 'shopProduct/search',
                })
                this.setState({
                  importVisiable: false,
                  value: '',
                  use: '',
                  loading: false,
                })
              } else {
                message.error(json.errorMessage)
                this.setState({ loading: false })
              }
            },
          })
        }
      }
    }
  }
  cancelImport = () => {
    this.setState({
      synchroVisiable: true,
      importVisiable: false,
      fileList: [],
      loading: false,
    })
  }
  handleCancel = () => {
    const { dispatch } = this.props
    this.setState({
      synchroVisiable: false,
    })
    this.setState({
      value: '',
    })
    dispatch({
      type: 'shopProduct/search',
    })
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }
  renderColumns(text, record, column) {
    return (
      <EditInputCell
        editEnable={record.editable}
        value={text}
        autoNo={record.autoNo}
        key={record.autoNo}
        column={column}
        record={record}
        onInputChange={this.handleChange.bind(this)}
      />
    )
  }
  render() {
    const { loading, searchParam, total, page, selectedRowKeys, selectedRows } = this.props.shopProduct
    // const { startValue, endValue } = this.state
    const columns1 = [{
      title: '款式编码',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 100,
      }, {
        title: (<div style={{ color: 'red' }}>商品编码</div>),
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 100,
      }, {
        title: '国际条形码',
        dataIndex: 'eanCode',
        key: 'eanCode',
        width: 100,
      }, {
        title: (<div style={{ color: 'red' }}>店铺款式编码</div>),
        dataIndex: 'shopProductNo',
        key: 'shopProductNo',
        width: 100,
      }, {
        title: (<div style={{ color: 'red' }}>店铺商品编码</div>),
        dataIndex: 'shopSkuNo',
        key: 'shopSkuNo',
        width: 100,
      }, {
        title: '原始商品编码',
        dataIndex: 'oldSkuNo',
        key: 'oldSkuNo',
        width: 100,
      }, {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 100,
      }, {
        title: '颜色及规格',
        dataIndex: 'shopProductSpec',
        key: 'shopProductSpec',
        width: 100,
      }]
    const shop = (
      <Menu onClick={this.tbClick.bind(this)} key="shop">
        <Menu.Item key="1" premission="SHOPPRODUCT_EXPORTS">按查询条件导出</Menu.Item>
        <Menu.Item key="2" premission="SHOPPRODUCT_EXPORTR">导出重复铺货商品</Menu.Item>
        <Menu.Item key="3" premission="SHOPPRODUCT_EXPORTN">导出有库存未铺货商品</Menu.Item>
      </Menu>
    )
    const tabelToolbar = [
      <Button key={0} type="primary" size="small" onClick={() => { this.setState({ synchroVisiable: true, use: 1 }) }} premission="SHOPPRODUCT_IMPORT">导入店铺商品资料</Button>,
      <Dropdown key={1} overlay={shop} premission="SHOPPRODUCT_EXPORTS">
        <Button type="primary" size="small" className={styles.btn_jiange} key="shop111">
        导出店铺商品资料 <Icon type="down" />
        </Button>
      </Dropdown>,
      <Button key={2} type="primary" size="small" onClick={() => { this.setState({ synchroVisiable: true, use: 2 }) }} premission="SHOPPRODUCT_CLEAN">清除店铺已删除链接</Button>,
      <Button key={3} type="primary" size="small" onClick={() => { this.setState({ synchroVisiable: true, use: 0 }) }} premission="SHOPPRODUCT_SYNC">同步店铺商品资料</Button>,
    ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: this.state.data,
        total,
        ...page,
        loading,
        columns: this.state.columns,
        nameSpace: 'shopProduct',
        tableName: 'shopProductTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { x: 1860 },
    }
    const searchBarItem = [{
    decorator: 'skuNo',
    components: <Input placeholder="商品编码|款式编码|国际码" size="small" />,
    }, {
    decorator: 'lowestLockInventory',
    components: <InputNumber placeholder="最低库存" size="small" />,
    }, {
      decorator: 'highestLockInventory',
      components: <InputNumber placeholder="最高库存" size="small" />,
    }, {
      decorator: 'onShelves',
      components: (
        <Select placeholder="是否上架" size="small" style={{ marginTop: 4 }} key="yeah111">
          <Option key="yeah" value="1">是</Option>
          <Option key="yeah1" value="0">否</Option>
        </Select>
      ),
    }, {
      decorator: 'shopNo',
      components: (
        <Select placeholder="店铺" size="small" style={{ marginTop: 4 }} key="shopNo123">
          {this.state.shops ? this.state.shops.map(ele => <Option key={ele.shopNo} value={ele.shopNo}>{ele.shopName}</Option>) : ''}
        </Select>
      ),
    }, {
      decorator: 'shopSkuNo',
      components: <Input placeholder="线上商品编码|线上款式编码" size="small" />,
    }, {
      decorator: 'startLastSyncTime',
      components: (<DatePicker
        size={config.InputSize}
        placeholder="下载开始时间"
        format="YYYY-MM-DD"
        disabledDate={this.disabledStartDate}
        onChange={this.onStartChange}
      />),
    }, {
      decorator: 'endLastSyncTime',
      components: (<DatePicker
        size={config.InputSize}
        placeholder="下载结束时间"
        format="YYYY-MM-DD"
        disabledDate={this.disabledEndDate}
        onChange={this.onEndChange}
      />),
    }, {
      decorator: 'lockInventory',
      components: (
        <Select placeholder="锁定状态" size="small" style={{ marginTop: 4 }} key="yeah">
          <Option key="yeah2" value="2">全部</Option>
          <Option key="yeah3" value="1">已锁定</Option>
          <Option key="yeah4" value="0">未锁定</Option>
        </Select>
      ),
    }, {
      decorator: 'extensionSearch',
      components: <Checkbox size="small" >商品资料不存在</Checkbox>,
    },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'shopProduct',
      searchParam,
      clearState: () => {
        this.setState({
          startValue: null,
          endValue: null,
        })
      },
      clear: 1,
    }
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file)
          const newFileList = fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: (file) => {
        const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel'
        if (!isXLSX) {
            message.error('只能上传xlsx和xls文件')
        } else if (this.state.fileList.length === 1) {
          message.warning('一次只能上传一个文件')
        } else {
            this.setState(({ fileList }) => ({
                fileList: [...fileList, file],
            }))
        }
        return false
      },
      fileList: this.state.fileList,
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
        <Modal
          key="811"
          maskClosable={false}
          title={this.state.use === 0 ? '同步店铺商品资料' : this.state.use === 1 ? '导入店铺商品资料' : '清除店铺商品资料'}
          visible={this.state.synchroVisiable}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          width="800px"
          chooseRows={this.state.chooseRows}
          // footer={[
          //   <Button key="999" type="primary" onClick={this.handleOk}>
          //     确定
          //   </Button>,
          // ]}
        >
          <RadioGroup onChange={this.onChange} value={this.state.value} key="821" style={{ width: '100%' }}>
            { this.state.shops ?
              this.state.shops.map((ele) => {
                return <Col key={ele.shopNo} style={{ marginBottom: 5 }} span={8}><Radio key={ele.shopNo} value={ele.shopNo}>{ele.shopName}</Radio></Col>
                }) : <div>当前没有店铺可以选择!</div> }
          </RadioGroup>
        </Modal>
        <Modal
          key="mm"
          maskClosable={false}
          title="导入对应关系"
          visible={this.state.importVisiable}
          onCancel={this.cancelImport}
          // onOk={this.okImport}
          width="900px"
          chooseRows={this.state.chooseRows}
          footer={[
            <Button key="back" onClick={this.cancelImport}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.okImport}>
                上传文件
            </Button>,
          ]}
        >
          <div style={{ color: '#CE7147', marginLeft: '20px' }}>你将导入数据的店铺：{this.state.chooseName}</div>
          <br />
          <br />
          <br />
          <div>导入Excel文件格式</div>
          <Table columns={columns1} pagination={false} dataSource={this.state.data1} rowKey={record => record.skuNo} />
          <br />
          <div>
            <Col span={1}><div style={{ marginTop: '5px' }}>标题：</div></Col>
            <Upload {...props} onChange={this.onFileChange} key={752}>
              <Button size="small" key={753}>
                <Icon type="upload" /> 上传文件
              </Button>
            </Upload>
          </div>
          <Col span={1}><div /></Col>
          <div style={{ color: '#AAAAAA' }}>支持扩展名：.xls..</div>
          <Col span={1}><div /></Col>
          {this.state.importModalVisiable ? <div style={{ color: 'red' }}>请选择上传文件</div> : ''}
        </Modal>
      </div>
    )
  }
}
