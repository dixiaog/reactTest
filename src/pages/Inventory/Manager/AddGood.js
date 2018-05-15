/*
 * @Author: jiangteng
 * @Date: 2018-01-24 10:33:28
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-27 19:30:28
 * 选择需要的商品
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Avatar, Select, Card, message } from 'antd'
import styles from '../Inventory.less'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'

const Option = Select.Option

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
    dataIndex: 'standardNo',
    key: 'standardNo',
    width: 100,
  }, {
    title: '商品名',
    dataIndex: 'productName',
    key: 'productName',
    width: 100,
    className: styles.columnCenter,
  }, {
    title: '商品简称',
    dataIndex: 'shortName',
    key: 'shortName',
    width: 100,
    className: styles.columnCenter,
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
    className: styles.columnCenter,
  }, {
    title: '基本售价',
    dataIndex: 'retailPrice',
    key: 'retailPrice',
    width: 100,
    className: styles.columnCenter,
  }]

@connect(state => ({
  chooseItem: state.chooseItem,
  combinationItem: state.combinationItem,
  goodModal: state.goodModal,
}))
@Form.create()
export default class AddGood extends Component {
    constructor(props) {
        super(props)
        this.state = {
          confirmLoading: false,
        }
      }
    componentDidMount() {
      this.props.dispatch({ type: 'chooseItem/fetch', payload: this.props })
    }
    handleOk = (selectedRows) => {
      if (selectedRows.length === 0) {
        message.warn('请选择商品')
      } else {
        this.setState({
          confirmLoading: true,
        })
        this.handleCancel()
        // 上级页面获取最新数据
        const { getGoods } = this.props
        getGoods()
      }
    }
      handleCancel = () => {
        this.setState({
          confirmLoading: false,
        })
        this.props.itemModalHidden()
        this.props.dispatch({ type: 'chooseItem/reset' })
        this.props.dispatch({ type: 'chooseItem/clean' })
      }
  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows } = this.props.chooseItem
    const tableProps = {
        noListChoose: true,
        noSelected: false,
        dataSource: list,
        total,
        isPart: true,
        ...page,
        loading,
        columns,
        nameSpace: 'chooseItem',
        tableName: 'chooseItemTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys: this.props.chooseDataKeys && this.props.chooseDataKeys.length ? selectedRowKeys.concat(this.props.chooseDataKeys) : selectedRowKeys,
        rowKey: 'skuNo',
        rowSelection: {
          type: this.state.radio,
          getCheckboxProps: record => ({
            disabled: this.props.goodModal.initKey.indexOf(record.skuNo) > -1,
          }) },
    }
      const searchBarItem = [{
        decorator: 'productNo',
        components: <Input placeholder="款式编码" size="small" />,
        }, {
        decorator: 'skuNo',
        components: <Input placeholder="商品编码|条码" size="small" />,
        }, {
        decorator: 'skus',
        components: <Input placeholder="参与组合商品编码" size="small" />,
        }, {
          decorator: 'productName',
          components: <Input placeholder="商品名称|简称|颜色及规格" size="small" />,
        }, {
          decorator: 'supplierNo',
          components: (
            <Select placeholder="供应商" size="small" style={{ marginTop: 4 }}>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
            </Select>
          ),
        }, {
            decorator: 'enableStatus',
            components: (
              <Select placeholder="全部" size="small" style={{ marginTop: 4 }}>
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
                <Option value="0">0</Option>
                <Option value="1">1</Option>
              </Select>
            ),
        },
        ]
        const searchBarProps = {
          colItems: searchBarItem,
          dispatch: this.props.dispatch,
          nameSpace: 'chooseItem',
          searchParam: Object.assign(searchParam, { productType: this.props.productType }),
          requestParam: { productType: this.props.productType },
        }
    return (
      <div>
        <Modal
          maskClosable={false}
          title="请选择需要新增的商品"
          visible={this.props.changeModalVisiable}
          onCancel={this.handleCancel}
          onOk={this.handleOk.bind(this, selectedRows)}
          width={1200}
          okText="返回选中的商品"
          confirmLoading={this.state.confirmLoading}
          bodyStyle={{ padding: 0 }}
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
      </div>
    )
  }
}

