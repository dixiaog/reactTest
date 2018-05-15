/*
 * @Author: wupeng
 * @Date: 2017-12-27 14:37:21
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-25 15:34:17
 * 商品选择
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, message, Input, Avatar, Select, Card, Button } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import { selectSupplier, selectBrand } from '../../../services/opening/opening'
import styles from './index.less'

const Option = Select.Option
@connect(state => ({
    openingdomal: state.openingdomal,
  }))
export default class OpeningModal extends Component {
    state = {
        supplierList: [],
        brands: [],
    }
componentDidMount() {
  this.props.dispatch({
    type: 'openingdomal/fetch',
  })
  selectSupplier({}).then((json) => {
    this.setState({
      supplierList: json,
    })
})
  selectBrand({}).then((json) => {
    this.setState({
      brands: json,
   })
})
}
handleCancel = () => {
  this.props.data.onFocusaddvis()
}
selectedRowssss = (selectList) => {
  const batchType = this.props.data.batchType
  if (batchType === "8" || batchType === "9") {
    const list = []
    for (let i = 0; i < selectList.length; i++) {
      list.push(selectList[i].skuNo)
    }
    this.props.data.selects(list.toString())
  } else {
    if (selectList.length === 1) {
      this.props.data.selects(selectList)
    } else if (selectList.length > 0) {
      message.warning('请选择一件商品')
    } else {
      message.warning('请至少选择一件商品')
    }
  }
}
render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.openingdomal
// comboBo 组合商品
// supplierNo	供应商编号
// supplierName	供应商名称
// productType	商品类型(0:普通商品; 1:组合商品)
// brandNo	品牌编号
// brandName 品牌名称
    const searchBarItem = [
        {
            decorator: 'productNo',
            components: <Input placeholder="款式编码" size="small" />,
            }, {
            decorator: 'skuNo',
            components: <Input placeholder="商品编码|条码" size="small" />,
            }, {
            decorator: 'skus',
            components: <Input placeholder="参与组合商品编码" size="small" disabled={this.state.isOpen} />,
            }, {
              decorator: 'productName',
              components: <Input placeholder="商品名称|简称|颜色及规格" size="small" />,
            }, {
              decorator: 'supplierNo',
              components: (
                <Select placeholder="供应商" size="small" style={{ marginTop: 4 }}>
                  {this.state.supplierList && this.state.supplierList.length ? this.state.supplierList.map(e => <Option key={e.supplierNo}>{e.supplierName}</Option>) : null}
                </Select>
              ),
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
                decorator: 'productType',
                components: (
                  <Select placeholder="-类型-" size="small" style={{ marginTop: 4 }} disabled={this.state.isOpen} >
                    <Option value="0">普通商品</Option>
                    <Option value="1">组合商品</Option>
                  </Select>
                ),
            }, {
                decorator: 'brandNo',
                components: (
                  <Select placeholder="品牌" size="small" style={{ marginTop: 4 }}>
                    {this.state.brands.map(brand => <Option key={brand.brandNo} value={brand.brandNo}>{brand.brandName}</Option>)}
                  </Select>
                ),
            },
      ]
// 搜索栏参数
const searchBarProps = {
    colItems: searchBarItem,
    dispatch: this.props.dispatch,
    nameSpace: 'openingdomal',
    searchParam,
  }
const columns = [{
    title: '图片',
    dataIndex: 'imageUrl',
    key: 'imageUrl',
    width: 80,
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
    title: '国际条形码',
    dataIndex: 'barcode',
    key: 'barcode',
    width: 100,
  }, {
    title: '商品名',
    dataIndex: 'productName',
    key: 'productName',
    width: 100,
  }, {
    title: '商品简称',
    dataIndex: 'shortName',
    key: 'shortName',
    width: 100,
  }, {
    title: '商品品牌',
    dataIndex: 'brandName',
    key: 'brandName',
    width: 100,
  }, {
    title: '颜色及规格',
    dataIndex: 'productSpec',
    key: 'productSpec',
    width: 100,
  }, {
    title: '基本售价',
    dataIndex: 'retailPrice',
    key: 'retailPrice',
    width: 100,
  }]
    // 表格参数
    const tableProps = {
        // toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'openingdomal',
        tableName: 'openingdomalTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { y: 300 },
        custormTableClass: 'tablecHeightFix500',
    }
    return (
      <Modal
        title="请挑选你需要选择的商品"
        visible={this.props.data.openingModalvis}
        footer={[
          <Button key="submit" type="primary" onClick={this.selectedRowssss.bind(this, selectedRows)}>
                返回选中的商品
          </Button>,
            ]}
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
      </Modal>
    )
}
}
