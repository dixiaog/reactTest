/*
 * @Author: chenjie
 * @Date: 2017-12-26 09:09:21
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-01-20 13:03:44
 * 物流模版修改日志
 */
import React, { Component } from 'react'
import { Modal, DatePicker } from 'antd'
import Jtable from '../../../components/JcTable'
import styles from '../Base.less'

const { RangePicker } = DatePicker
const columns = [{
  title: '序号',
  dataIndex: 'key',
  key: 'key',
  width: 50,
  render: (text, record, index) => {
    return (
      <span>
        {index + 1}
      </span>)
    },
}, {
  title: '操作名称',
  dataIndex: 'title',
  key: 'title',
}, {
  title: '备注',
  dataIndex: 'remark',
  key: 'remark',
}, {
  title: '操作时间',
  dataIndex: 'creatDate',
  key: 'creatDate',
}, {
  title: '操作人',
  dataIndex: 'creater',
  key: 'creater',
}]
export default class ExpressLogModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }
  onOk = () => {
    
  }
  handleOk = () => {
    this.props.hidden()
  }
  handleCancel = () => {
    this.props.hidden()
  }
  render() {
    const tableProps = {
      columns,
      noListChoose: true,
    }
    return (
      <div>
        <Modal
          title="物流模版修改日志"
          maskClosable={false}
          visible={this.props.visiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          <div className={styles.tableList}>
            <div className={styles.tableListForm} style={{ marginBottom: 10 }}>
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['开始时间', '结束时间']}
                onOk={this.onOk.bind(this)}
              />
            </div>
            <Jtable {...tableProps} />
          </div>
        </Modal>
      </div>)
  }
}
