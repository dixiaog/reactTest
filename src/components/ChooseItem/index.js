/*
 * @Author: tanmengjia
 * @Date: 2017-12-27 14:38:25
 * @Last Modified by: jiangteng
 * 商品选择页面
 * @Last Modified time: 2018-05-12 17:02:29
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Avatar, Select, message, notification, Card } from 'antd'
// import Jtable from '../../components/JcTable'
import styles from './index.less'
import Jtable from '../../components/JcTable'
import SearchBar from '../../components/SearchBar'
import { getAllSupplier, getAllBrand } from '../../services/item/items'
import { turnToMerge } from '../../services/capacity'

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
  }, {
    title: '吊牌价',
    dataIndex: 'tagPrice',
    key: 'tagPrice',
    width: 100,
  }]

@connect(state => ({
    chooseItem: state.chooseItem,
    combinationItem: state.combinationItem,
    productLimit: state.productLimit,
  }))
  @Form.create()
export default class ChooseItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
          radio: 'checkbox',
          isOpen: false,
          supplierList: [],
          brands: [],
          disableData: [],
        }
      }
      // this.props.productType
      componentWillMount() {
        this.props.dispatch({ type: 'chooseItem/fetch', payload: this.props })
        getAllSupplier().then(json => this.setState({ supplierList: json }))
        getAllBrand().then(json => this.setState({ brands: json }))
      }
    // componentDidMount() {
    //   this.props.dispatch({ type: 'chooseItem/fetch', payload: this.props })
    // }
    componentWillReceiveProps(nextProps) {
      if (nextProps.productNos && nextProps.productNos.length && nextProps.chooseItem.list && nextProps.chooseItem.list.length) {
        const disableList = []
        nextProps.productNos.forEach((row) => {
          disableList.push(...nextProps.chooseItem.list.filter(e => e.productNo === row))
        })
        const needProduct = []
        if (disableList.length) {
          disableList.forEach((p) => {
            needProduct.push(p.skuNo)
          })
        }
        this.setState({
          disableData: needProduct,
        })
      }
      if (nextProps.haveData && nextProps.haveData.length && ((nextProps.specifyType * 1) > -1) && nextProps.chooseItem.list && nextProps.chooseItem.list.length) {
        if (nextProps.specifyType * 1 === 0) {
          const datas = []
          nextProps.haveData.forEach((ele) => {
            datas.push(ele.skuNo)
          })
          this.setState({
            disableData: datas,
          })
        } else if (nextProps.specifyType * 1 === 1) {
          const datas = []
          nextProps.haveData.forEach((ele) => {
            datas.push(ele.productNo)
          })
          const disableList = []
          if (datas.length) {
            datas.forEach((row) => {
              disableList.push(...nextProps.chooseItem.list.filter(e => e.productNo === row))
            })
          }
          const needProduct = []
          if (disableList.length) {
            disableList.forEach((p) => {
              needProduct.push(p.skuNo)
            })
          }
          this.setState({
            disableData: needProduct,
          })
        }
      }
      if (nextProps.productType === 0) {
        this.setState({
          isOpen: true,
        })
      }
      if (nextProps.isRadio) {
        this.setState({
          radio: 'radio',
        })
      }
    }
    handleOk = (selectedRows) => {
      if (selectedRows.length === 0) {
        message.warn('请选择商品')
      } else {
        if (this.props.isRadio && this.props.fromName === 'combination1') {
          turnToMerge(selectedRows[0].autoNo).then((json) => {
            if (json) {
              notification.success({
                message: '成功转为组合商品',
              })
              Object.assign(json, { referWeight: 0, retailPrice: 0 })
              this.props.changeItem(json, () => {
                this.props.form.resetFields()
                this.props.itemModalHidden()
              })
            }
          })
        } else if (this.props.fromName === 'combination') {
          const skuNoA = []
          selectedRows.forEach((ele) => {
            skuNoA.push(ele.skuNo)
          })
          this.props.dispatch({ type: 'combinationItem/skuNo', payload: skuNoA })
          this.props.chooseData(this.props.chooseItem.selectedRows, this.props.chooseItem.selectedRowKeys, () => {
            this.props.form.resetFields()
            this.props.itemModalHidden()
          })
          this.props.closeChoose()
        } else if (this.props.fromName === 'jt') {
          const skuNoA = []
          selectedRows.forEach((ele) => {
            skuNoA.push(ele.skuNo)
          })
          this.props.dispatch({ type: 'combinationItem/skuNo', payload: skuNoA })
          this.props.chooseData(this.props.chooseItem.selectedRows, this.props.chooseItem.selectedRowKeys, () => {
            this.props.form.resetFields()
            this.props.itemModalHidden()
          })
        } else if (this.props.fromName === 'productLimit') {
          const skuNoA = []
          selectedRows.forEach((ele) => {
            skuNoA.push(ele.productNo)
          })
          this.props.choose(skuNoA, () => {
            this.props.form.resetFields()
            this.props.itemModalHidden()
          })
        } else if (this.props.fromName === 'strategyModal') {
          // const skuNoA = []
          // selectedRows.forEach((ele) => {
          //   skuNoA.push(ele.skuNo)
          // })
          this.props.choose(this.props.chooseItem.selectedRows, this.props.chooseItem.selectedRowKeys, () => {
            this.props.form.resetFields()
            this.props.itemModalHidden()
          })
        } else if (this.props.fromName === 'giftStrategy') {
          // const skuNoA = []
          // selectedRows.forEach((ele) => {
          //   skuNoA.push(ele.skuNo)
          // })
          this.props.choose(this.props.chooseItem.selectedRows, () => {
            this.props.form.resetFields()
            this.props.itemModalHidden()
          })
        } else if (this.props.fromName === 'giftStrategy1') {
          // const skuNoA = []
          // selectedRows.forEach((ele) => {
          //   skuNoA.push(ele.skuNo)
          // })
          this.props.choose(this.props.chooseItem.selectedRows, () => {
            this.props.form.resetFields()
            this.props.itemModalHidden()
          })
        }
        this.props.dispatch({ type: 'chooseItem/clean' })
        this.props.dispatch({ type: 'chooseItem/cleanSearch' })
        // this.props.dispatch({ type: 'chooseItem/choose', payload: selectedRows })
        // this.props.dispatch({
        //     type: 'chooseItem/saveKeys',
        //     payload: [],
        //   })
      }
    }
      handleCancel = () => {
        this.props.form.resetFields()
        this.props.itemModalHidden()
        this.props.dispatch({ type: 'chooseItem/clean' })
        this.props.dispatch({ type: 'chooseItem/cleanSearch' })
        if (this.props.fromName === 'combination') {
          this.props.closeChoose()
        }
      }
  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows } = this.props.chooseItem
    const { brands } = this.state
    const tableProps = {
        // toolbar: tabelToolbar,
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
        custormTableClass: 'tablecHeightFix340',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys: this.props.chooseDataKeys && this.props.chooseDataKeys.length ?
                          selectedRowKeys.concat(this.props.chooseDataKeys).concat(this.state.disableData)
                        :
                          selectedRowKeys.concat(this.state.disableData),
        rowKey: 'skuNo',
        rowSelection: {
          type: this.state.radio,
          getCheckboxProps: record => ({
            disabled: this.props.chooseDataKeys && this.props.chooseDataKeys.length ?
                        this.props.chooseDataKeys.concat(this.state.disableData).indexOf(record.skuNo) > -1
                      :
                        this.state.disableData && this.state.disableData.length ? this.state.disableData.indexOf(record.skuNo) > -1 : false,
          }) },
        scroll: { y: 300 },
    }
      const searchBarItem = [{
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
              <Select disabled={this.props.unable || this.props.enableStatus > -1} placeholder="状态" size="small" style={{ marginTop: 4 }}>
                <Option value="1">启用</Option>
                <Option value="2">备用</Option>
                <Option value="0">禁用</Option>
              </Select>
            ),
        }, {
            decorator: 'productType',
            components: (
              <Select placeholder="-类型-" size="small" style={{ marginTop: 4 }} disabled={this.state.isOpen || this.props.productTypeT} >
                <Option value="0">普通商品</Option>
                <Option value="1">组合商品</Option>
              </Select>
            ),
        }, {
            decorator: 'brandNo',
            components: (
              <Select placeholder="品牌" size="small" style={{ marginTop: 4 }}>
                {brands && brands.length ? brands.map(brand => <Option key={brand.brandNo} value={brand.brandNo}>{brand.brandName}</Option>) : null}
              </Select>
            ),
        },
        ]
        const rp = this.props.productType > -1
                  ?
                    (this.props.enableStatus > -1 ? { productType: this.props.productType, enableStatus: this.props.enableStatus } : { productType: this.props.productType })
                    :
                    (this.props.enableStatus > -1 ? { enableStatus: this.props.enableStatus } : undefined)
        const sp = this.props.productType > -1 ? 
                    (this.props.enableStatus > -1 ? Object.assign(searchParam, { productType: this.props.productType, enableStatus: this.props.enableStatus })
                      :
                      Object.assign(searchParam, { productType: this.props.productType }))
                    :
                    (this.props.enableStatus > -1 ? Object.assign(searchParam, { enableStatus: this.props.enableStatus }) : searchParam)
        const searchBarProps = {
          colItems: searchBarItem,
          dispatch: this.props.dispatch,
          nameSpace: 'chooseItem',
          searchParam: sp,
          requestParam: rp,
          // productType: this.props.productType,
        }
    return (
      <div>
        <Modal
          className="chooseItem"
          maskClosable={false}
          title="请选择商品"
          visible={this.props.changeModalVisiable}
          onCancel={this.handleCancel}
          onOk={this.handleOk.bind(this, selectedRows)}
          width="1000px"
          bodyStyle={{
            minHeight: 500,
          }}
        >
          <Card bordered={false} className={styles.contentBoard111}>
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
