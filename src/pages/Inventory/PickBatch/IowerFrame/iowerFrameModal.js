/*
 * @Author: Wupeng
 * @Date: 2018-04-10 13:49:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-25 20:40:53
 * 生成移货下架
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import {
    Modal,
    Card,
    Input,
    Select,
    Button,
    // Tooltip,
    } from 'antd'
import Jtable from '../../../../components/JcTable'
import SearchBar from '../../../../components/SearchBar'
// import { setLocalStorageItem } from '../../../../utils/utils'
import LowerFrameExtext from './LowerFrameExtext'
import OpeningModal from '../../Opening/openingModal'
import styles from '../index.less'

const Option = Select.Option
@connect(state => ({
    lower: state.lower,
  }))
class LowerFrameModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            LowerFrameExtextvis: false,
            openingModalvis: false,
        }
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'lower/fetch',
        })
    }
    handelCancel = () => {
        this.props.hidden()
    }
    hiddena = () => {
        this.setState({
            LowerFrameExtextvis: true,
        })
    }
    export = () => {
        this.props.dispatch({
            type: 'lower/export',
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
          type: 'lower/paramNome',
          payload: {
            skuNo: e,
          },
        })
        this.onFocusaddvis()
      }
    render() {
        // 仓库类别 限定仓位从 限定仓位从  限定款号 限定商品编码
        // locationType startLocationNo  endLocationNo productNo skuNo
        const locationType = ['进货仓', '整存仓', '零售仓', '发货暂存仓', '退货暂存仓', '残次仓', '疑难件仓', '整存移库暂存', '零售移库暂存']
        const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.lower
        const searchBarItem = [
            {
                decorator: 'locationType',
                components:  <Select disabled style={{ width: 120 }} size="small">
                                {
                                  locationType.map((e, index) => {
                                    return (<Option value={index + 1}>{e}</Option>)})
                                }
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
              components: <Input size="small" onDoubleClick={this.onFocus.bind(this)} title={(searchParam.skuNo === undefined) ? '双击选择商品编码' : searchParam.skuNo} placeholder="限定商品编码"/>,
            },
        ]
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
              title: '仓位',
              dataIndex: 'locationNo',
              key: 'locationNo',
              width: 100,  
            },
            {
              title: '商品编码',
              dataIndex: 'skuNo',
              key: 'skuNo',
              width: 100,
            },
            {
              title: '商品名称',
              dataIndex: 'productName',
              key: 'productName',
              width: 100,
            },
            {
              title: '颜色/规格',
              dataIndex: 'productSpec',
              key: 'productSpec',
              width: 100,
            },
            {
              title: '库存数量',
              dataIndex: 'inventoryNum',
              key: 'inventoryNum',
              width: 100,
            //   render: (text, record) => {
            //     return(
            //         <div>inventoryNum</div>
            //     )
            //   },
            },
            {
              title: '可下架数量',
              dataIndex: 'inventoryNum',
              key: 'lockedNum',
              width: 100,
            },
        ]
        const tabelToolbar = [
            <Button
              key={0}
              type="primary"
              premission="PICKBATCH_YHUPLOAD"
              size="small"
              onClick={this.hiddena.bind(this)}
            >导入并生成批次</Button>,
            <Button
              key={1}
              type="primary"
              premission="PICKBATCH_YHEXPORTDB"
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
            nameSpace: 'lower',
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
            nameSpace: 'lower',
            tableName: 'lowerTable',
            dispatch: this.props.dispatch,
            selectedRows,
            selectedRowKeys,
            rowKey: 'autoNo',
            scroll: { y: 300 },
            custormTableClass: 'tablecHeightFix500',
        }
        const LowerFrameExtextData = {
            visible: this.state.LowerFrameExtextvis,
            hidden: () => {
                this.setState({
                    LowerFrameExtextvis: false,
                })
            },
            locationType: searchParam.locationType,
            Refresh: () => {
                this.setState({
                    LowerFrameExtextvis: false,
                }, () => {
                    this.props.Refresh()
                }) 
            },
        }
        // 商品选择弹框
        const OpeningModaldata = {
            openingModalvis: this.state.openingModalvis,
            onFocusaddvis: this.onFocusaddvis,
            selects: this.selects,
            batchType: this.props.batchType,
          }
        return (
            <Modal
             title={this.props.title}
             visible={this.props.visible}
             footer={null}
             width={1000}
             maskClosable={false}
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
            {this.state.LowerFrameExtextvis ? <LowerFrameExtext {...LowerFrameExtextData} /> : null}
            {this.state.openingModalvis ? <OpeningModal data={OpeningModaldata} /> : null}
            </Modal>
        )
    }
}
export default LowerFrameModal