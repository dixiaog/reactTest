/*
 * @Author: Wupeng
 * @Date: 2017-1-23 10:04:11
 * @Last Modified by;
 * 外部设备连接配置
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Input, Button, Form, message } from 'antd'
import Jtable from '../../../components/JcTable' // 导入表格组件
import SearchBar from '../../../components/SearchBar'
import styles from './Peripheral.less'
import Newprinter from './Newprinter.js'
import Newprinteraddress from './Newprinteradress.js'
import Delect from './delectprinter.js'
import { deleteList, viewData } from '../../../services/base/peripheral/peripheral.js'
import { effectFetch } from '../../../utils/utils'
@connect(state => ({
    peripheral: state.peripheral,
  }))
  @Form.create()
  export default class Peripheral extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Newprintervis: false,
            Newprinteraddressvis: false,
            delectvis: false,
            Newprinteraddressreacord: {},
            selectedRowssss: [],
            autoNo: '',
        }
    }
    componentDidMount() {
      // this.props.dispatch({
      //   type: 'peripheral/fetch',
      // })
      effectFetch('peripheral', this.props.dispatch)
    }
    Newprinterone = () => {
        this.setState({
            Newprintervis: true,
        })
    }
    Newprintertwo = () => {
        this.setState({
            Newprintervis: false,
        })
    }
    // 编辑
    Newprinteraddressone = (record) => {
      const payload = Object.assign({
        autoNo: record.autoNo,
      })
      viewData({
        ...payload,
      }).then((json) => {
        if (json === null) {
          message.error('获取失败，请重新获取')
        } else {
        // viewData
        this.setState({
          Newprinteraddressvis: true,
          Newprinteraddressreacord: json,
          autoNo: record.autoNo,
        })
        }
      })
    }
    Newprinteraddresstwo = () => {
        this.setState({
            Newprinteraddressvis: false,
            Newprinteraddressreacord: {},
        })
    }
    // 批量删除
    delect = (selectedRows) => {
      let autoNos = ''
      for (let i = 0; i < selectedRows.length; i++) {
        if (i === 0) {
          autoNos = `${selectedRows[0].autoNo}`
        } else {
          autoNos = `${autoNos},${selectedRows[i].autoNo}`
        }
      }
      const payload = Object.assign({
        autoNo: autoNos,
      })
      deleteList({
        ...payload,
      }).then((json) => {
        if (json) {
          message.success('删除成功')
          this.props.dispatch({
            type: 'peripheral/fetch',
            payload: {},
          })
          this.setState({
            delectvis: false,
          })
        } else {
          console.log('删除失败')
        }
      })
    }
    delectone = (selectedRows) => {
      this.setState({
        delectvis: true,
        selectedRowssss: selectedRows,
      })
    }
    deletemadeltwo = () => {
      this.setState({
        delectvis: false,
      })
    }
    render() {
      // 表格组件参数
      const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.peripheral
      // 操作栏
      const tabelToolbar = [
        <Button key={1} type="primary" premission="PERIPHER_ADDSAVE" onClick={this.Newprinterone} size="small">增加打印机</Button>,
        <Button
          key={2}
          type="primary"
          premission="PERIPHER_DELECTLIST"
          disabled={(selectedRows.length > 0) ? !true : true}
          onClick={this.delectone.bind(this, selectedRows)}
          size="small"
          style={{ marginLeft: 4 }}
        >
        批量删除
        </Button>,
      ]
        const columns = [{
          title: '序号',
          // 供应商编码
          dataIndex: 'autoNo',
          key: 'autoNo',
          width: 100,
          render: (text, record, index) => {
              return (
                <span>{index + 1}</span>
              )
          },
          }, {
          title: 'IP地址',
          dataIndex: 'printerAddess',
          key: 'printerAddess',
          width: 100,
        }, {
          title: '端口',
          dataIndex: 'printerPort',
          key: 'printerPort',
          width: 100,
        }, {
          title: '操作',
          dataIndex: 'updata',
          key: 'updata',
          width: 100,
          render: (text, record) => {
            return (
                // onConfirm={this.Delect.bind(this, record)} onCancel={this.Scancel.bind(this)}
              <a><span onClick={this.Newprinteraddressone.bind(this, record)}>编辑</span></a>
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
          bordered: true,
          nameSpace: 'peripheral',
          tableName: 'peripheralTable',
          dispatch: this.props.dispatch,
          selectedRows,
          selectedRowKeys,
          rowKey: 'autoNo',
        }
        // 搜索栏
        const searchBarItem = [
          {
            decorator: 'printerAddess',
            components: <Input placeholder="请输入IP地址" size="small" />,
          },
          {
              decorator: 'printerPort',
              components: <Input placeholder="请输入端口" size="small" />,
            },
        ]
        // 搜索栏参数
        const searchBarProps = {
          colItems: searchBarItem,
          dispatch: this.props.dispatch,
          nameSpace: 'peripheral',
          searchParam,
        }
        const Newprinterdata = {
            Newprintervis: this.state.Newprintervis,
            Newprintertwo: this.Newprintertwo,
        }
        const Newprinteraddressdata = {
            Newprinteraddressvis: this.state.Newprinteraddressvis,
            Newprinteraddresstwo: this.Newprinteraddresstwo,
            Newprinteraddressreacord: this.state.Newprinteraddressreacord,
            autoNo: this.state.autoNo,
        }
        const Delectdata = {
          delectvis: this.state.delectvis,
          delect: this.delect,
          selectedRowssss: this.state.selectedRowssss,
          deletemadeltwo: this.deletemadeltwo,
        }
        return (
          <div className={styles.contentBoard}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <SearchBar {...searchBarProps} />
              </div>
              <Jtable {...tableProps} />
            </div>
            {this.state.Newprintervis ? <Newprinter data={Newprinterdata} /> : null}
            {this.state.Newprinteraddressvis ? <Newprinteraddress data={Newprinteraddressdata} /> : null}
            {this.state.delectvis ? <Delect data={Delectdata} /> : null}
          </div>
        )
    }
}

