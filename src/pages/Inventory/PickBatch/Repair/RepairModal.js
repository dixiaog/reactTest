/*
 * @Author: Wupeng
 * @Date: 2018-04-10 15:54:43
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-25 19:51:36
 * 生成整补任务
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import {
    Modal,
    Card,
    Input,
    Select,
    Button,
    InputNumber,
    // Tooltip,
    } from 'antd'
import Jtable from '../../../../components/JcTable'
import SearchBar from '../../../../components/SearchBar'
// import { setLocalStorageItem } from '../../../../utils/utils'
import RepairModalExce from './RepairModalExce'
import OpeningModal from '../../Opening/openingModal'
import styles from '../index.less'

const Option = Select.Option
@connect(state => ({
  reparir: state.reparir,
  }))
class RepairModal extends Component{
    constructor(props) {
        super(props)
        this.state = {
          RepairModalExcevis: false,
          openingModalvis: false,
        }
    }
    componentDidMount() {
      this.props.dispatch({
        type: 'reparir/fetch',
      })
    }
    handelCancel = () => {
        this.props.hidden()
    }
    hiddena = () => {
      this.setState({
        RepairModalExcevis: true,
      })
    }
    // 导出
    export = () => {
      this.props.dispatch({
        type: 'reparir/export',
      })
    }
    onFocus = () => {
      this.setState({
          openingModalvis: true,
      })
  }
  // 商品选择modal初始化
  onFocusaddvis = () => {
      this.setState({
          openingModalvis: false,
      })
  }
  selects = (e) => {
      this.props.dispatch({
        type: 'reparir/paramNome',
        payload: {
          skuNo: e,
        },
      })
      this.onFocusaddvis()
    }
    render() {
        const locationType = ['进货仓', '整存仓', '零售仓', '发货暂存仓', '退货暂存仓', '残次仓', '疑难件仓', '整存移库暂存', '零售移库暂存']
        const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.reparir
        const searchBarItem = [
            {
              decorator: 'locationType',
              components:  <Select disabled style={{ width: 120 }} size="small">
                              {locationType.map((e, index) => {
                                  return (<Option value={index + 1}>{e}</Option>)
                              }
                              )}
                          </Select>,
            },
            {
              decorator: 'startLocationNo',
              components: <Input size="small" placeholder="起始仓位" />,
            },
            {
              decorator: 'endLocationNo',
              components: <Input size="small" placeholder="结束仓位" />,
            },
            {
                decorator: 'productNo',
                components: <Input size="small" placeholder="限定款号"/>,
            },
            {
              decorator: 'skuNo',
              components: <Input
                            size="small"
                            placeholder="限定商品编码"
                            onClick={this.onFocus.bind(this)}
                            title={(searchParam.skuNo === undefined) ? '点击选择商品编码' : searchParam.skuNo}/>,
            },
            {
              decorator: 'maxNumber',
              components: <InputNumber placeholder="当前库存小于" size="small" />,
            },
        ]
        // {/*<Tooltip title="当前库存小于">*/}
        // {/*</Tooltip>*/}
        // 款号 仓位 商品编码 商品名称 颜色/规格 库存数量 可下架数量
        // productNo locationNo skuNo productName productSpec inventoryNum lockedNum

        const columns = [
            {
              title: '款号',
              dataIndex: 'productNo',
              key: 'productNo',
              width: 100,
            },
            {
              title: '商品编码',
              dataIndex: 'skuNo',
              key: 'skuNo',
              width: 100,
            },
            {
              title: '颜色/规格',
              dataIndex: 'productSpec',
              key: 'productSpec',
              width: 100,
            },
            {
              title: '订单数',
              dataIndex: 'inventoryNum',
              key: 'inventoryNum',
              width: 100,
              },
            {
              title: '目标库存',
              dataIndex: 'targetNum',
              key: 'targetNum',
              width: 100,
            },
            {
              title: '高价库存',
              dataIndex: 'elevatedNum',
              key: 'elevatedNum',
              width: 100,
            },
            // {
            //   title: '待补货数',
            //   dataIndex: 'lockedNum',
            //   key: 'lockedNum',
            //   width: 100,
            // },
        ]
        const tabelToolbar = [
            <Button
              key={0}
              type="primary"
              premission="PICKBATCH_ZBUPLOAD"
              size="small"
              onClick={this.hiddena.bind(this)}
            >导入生成批次</Button>,
            <Button
              key={1}
              type="primary"
              premission="PICKBATCH_ZBEXPORTDB"
              size="small"
              onClick={this.export.bind(this)}
            >
            导出
            </Button>,
        ]
             // 搜索栏参数
             const searchBarProps = {
                colItems: searchBarItem,
                dispatch: this.props.dispatch,
                nameSpace: 'reparir',
                searchParam,
            }
                   // 表格参数
        const tableProps = {
            toolbar: tabelToolbar,
            noSelected: false,
            dataSource: list,
            total,
            ...page,
            loading,
            columns,
            nameSpace: 'reparir',
            tableName: 'reparirTable',
            dispatch: this.props.dispatch,
            selectedRows,
            selectedRowKeys,
            rowKey: 'autoNo',
            scroll: { y: 300 },
            custormTableClass: 'tablecHeightFix500',
        }
        const RepairModalExceData = {
          visible: this.state.RepairModalExcevis,
          hidden: () => {
              this.setState({
                RepairModalExcevis: false,
              })
          },
          RefreshExce: () => {
            this.setState({
              RepairModalExcevis: false,
            }, () => {
              this.props.Refresh()
            })
            
          },
        locationType: searchParam.locationType,
      }
      // 商品选择弹框
      const OpeningModaldata = {
        openingModalvis: this.state.openingModalvis,
        onFocusaddvis: this.onFocusaddvis,
        selects: this.selects,
        batchType: this.props.batchType,
      }
        return(
            <Modal
                title={this.props.title}
                visible={this.props.visible}
                footer={null}
                width={1000}
                MaskClosable={false}
                onCancel={this.handelCancel}
            >
            <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <SearchBar {...searchBarProps} />
              </div>
                <Jtable {...tableProps} />
            </div>
          </Card>
          {this.state.RepairModalExcevis ? <RepairModalExce {...RepairModalExceData}/> : null}
          {this.state.openingModalvis ? <OpeningModal data={OpeningModaldata} /> : null}
            </Modal>
        )
    }
}
export default RepairModal
