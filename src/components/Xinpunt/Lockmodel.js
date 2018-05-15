import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Checkbox } from 'antd'
import Jtable from '../../components/JcTable'


@connect(state => ({
  lockmodel: state.lockmodel,
  }))
class Lockmodel extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    handleOk = () => {
        this.props.data.Lockmodeltwo()
    }
    handleCancel = () => {
        this.props.data.Lockmodeltwo()
    }
    render() {
      const { list, loading, total, page, selectedRowKeys, selectedRows } = this.props.lockmodel
      const columns = [
        {
          title: '序号',
          dataIndex: 'categoryNo',
          key: 'categoryNo',
          render: (text, record, index) => {
            return (
              <span>{index + 1}</span>
            )
          },
        },
        {
          title: '仓位编号',
          dataIndex: 'locationNo',
          key: 'locationNo',
          // width: 80,
          },
        {
          title: '启用状态',
          dataIndex: 'enableStatus',
          key: 'enableStatus',
          // width: 80,
          render: (text) => {
            switch (text) {
              case (0):
              return (<Checkbox checked={false} />)
              case (1):
              return (<Checkbox checked />)
              default:
            }
          },
        },
      ]
      const tableProps = {
        // toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'lockmodel',
        tableName: 'lockmodelTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { y: 400 },
        custormTableClass: 'tablecHeightFix400',
    }
      return (
        <div>
          <Modal
            title="仓位拣货优先级(预览)"
            visible={this.props.data.Lockmodelvis}
            width={900}
            cancelText="取消"
            okText="确定"
            onOk={this.handleOk}
            maskClosable={false}
            onCancel={this.handleCancel}
          >
            <div style={{ height: 500 }}>
              <Jtable {...tableProps} />
            </div>
          </Modal>
        </div>
      )
    }
}
export default Lockmodel
