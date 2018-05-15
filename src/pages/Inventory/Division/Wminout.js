/*
 * @Author: Wupeng
 * @Date: 2017-1-23 10:04:11
 * @Last Modified by;
 * 库存分仓
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Form, Button, DatePicker, Select, Modal } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from './index.less'

const RangePicker = DatePicker.RangePicker
const Option = Select.Option
@connect(state => ({
    division: state.division,
    wminout: state.wminout,
  }))
  @Form.create()
  export default class Wminout extends Component {
      constructor(props) {
          super(props)
          this.state = ({

          })
      }
    onOk = () => {
        this.props.data.adressone()
    }
    handleCancel = () => {
        this.props.data.adressone()
    }
      render() {
        const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.wminout
          // 操作栏
    const tabelToolbar = [
      <Button type="primary" size="small" style={{ bckgroundColor: '#379b27' }}>导出</Button>,
     ]
           const columns = [{
            title: '业务类型',
            dataIndex: 'billType',
            key: 'billType',
            width: 100,
            render: (text) => {
               switch (text) {
                case (0):
                return '采购进仓'
                case (1):
                return '采购退货'
                case (2):
                return '销售出仓'
                case (3):
                return '销售退货'
                case (4):
                return '调拨出'
                case (5):
                return '调拨入'
                case (6):
                return '盘点'
                case (7):
                return '差异'
                case (8):
                return '期初'
                case (9):
                return '领用出仓'
                case (10):
                return '领用退仓'
                case (11):
                return '其他出库'
                case (12):
                return '其他进仓'
                case (13):
                return '其他进仓'
                case (14):
                return '发票'
                case (15):
                return '加个进仓'
                case (16):
                return '其他退货'
                case (17):
                return '库存锁定'
                case (18):
                return '组合预包装'
                case (19):
                return '快递进仓'
                default:
            }
            },
          }, {
            title: '日期',
            dataIndex: 'billDate',
            key: 'billDate',
            width: 100,
          }, {
            title: '仓库增减数',
            dataIndex: 'one',
            key: 'one',
            width: 100,
          }, {
            title: '进出单仓号',
            dataIndex: 'billNo',
            key: 'billNo',
            width: 100,
          }, {
            title: '内部订单号',
            dataIndex: 'exBillNo',
            key: 'exBillNo',
            width: 100,
          }, {
            title: '仓储方',
            dataIndex: 'warehouseName',
            key: 'warehouseNo',
            width: 100,
          }, {
            title: '店铺',
            dataIndex: 'shopName',
            key: 'shopName',
            width: 100,
          }, {
            title: '备注',
            dataIndex: 'remake',
            key: 'remake',
            width: 100,
          }, {
            title: '操作人',
            dataIndex: 'createUser',
            key: 'createUser',
            width: 100,
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
        nameSpace: 'wminout',
        tableName: 'wminoutTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { y: 400 },
        custormTableClass: 'tablecHeightFix400',
      }
     // 搜索栏
        const searchBarItem = [
          {
           decorator: 'billType',
           components: (
             <Select placeholder="业务类型" size="small" style={{ marginTop: 4, width: 90 }}>
               <Option value="0">采购进仓</Option>
               <Option value="1">采购退货</Option>
               <Option value="2">销售出仓</Option>
               <Option value="3">销售退货</Option>
               <Option value="4">不启用</Option>
               <Option value="5">调拨出</Option>
               <Option value="6">调拨入</Option>
               <Option value="7">盘点</Option>
               <Option value="8">差异</Option>
               <Option value="9">期初</Option>
               <Option value="10">领用出仓</Option>
               <Option value="11">领用退仓</Option>
               <Option value="12">其他出库</Option>
               <Option value="13">其他进仓</Option>
               <Option value="14">发票</Option>
               <Option value="15">加个进仓</Option>
               <Option value="16">其他退货</Option>
               <Option value="17">库存锁定</Option>
               <Option value="18">组合预包装</Option>
               <Option value="19">快递进仓</Option>
             </Select>
              ),
         },
         {
           decorator: 'classifyName',
           components: <RangePicker span={10} />,
         },
         {
            decorator: 'enableStatus',
           components: (
             <Select placeholder="启用状态" size="small" style={{ marginTop: 4, width: 90 }}>
               <Option value="0">本仓</Option>
               <Option value="1">启用</Option>
             </Select>),
           },
              ]
              // 搜索栏参数
              const searchBarProps = {
                colItems: searchBarItem,
                dispatch: this.props.dispatch,
                nameSpace: 'wminout',
                searchParam,
              }
          return (
            <Modal
              title="主仓库存进出流水明细"
              visible={this.props.data.Wminoutvis}
              onCancel={this.handleCancel}
              mask={false}
              width={1000}
              maskClosable={false}
              onOk={this.onOk}
            >
              <div>
                <Card bordered={false}>
                  <div className={styles.tableList}>
                    <div className={styles.tableListForm}>
                      <SearchBar {...searchBarProps} />
                    </div>
                    <Jtable {...tableProps} />
                  </div>
                </Card>
              </div>
            </Modal>
          )
      }
  }
