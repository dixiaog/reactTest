/*
 * @Author: tanmengjia
 * @Date: 2017-12-27 17:10:18
 * @Last Modified by: tanmengjia
 * 查看日志页面
 * @Last Modified time: 2018-04-19 09:55:19
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Table } from 'antd'
// import config from '../../../utils/config'
// import Jtable from '../../components/JcTable'
// import styles from '../Item.less'
// import Jtable from '../../../components/JcTable'
// import SearchBar from '../../../components/SearchBar'

// const FormItem = Form.Item
// const Option = Select.Option

const columns = [{
    title: '操作人',
    dataIndex: 'modifier',
    key: 'modifier',
    width: 100,
  }, {
    title: '操作明细',
    dataIndex: 'work',
    key: 'work',
    width: 100,
  }, {
    title: '操作时间',
    dataIndex: 'modifyDate',
    key: 'modifyDate',
    width: 100,
  }]

@connect(state => ({
    viewLog: state.viewLog,
  }))
  @Form.create()
export default class ViewLog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{
                modifier: '小明',
                work: '修改',
                modifyDate: '2017-01-01',
            }],
        }
      }
    componentWillReceiveProps(nexProps) {
        if (nexProps.relationship && nexProps.viewLog.list.length === 0) {
          this.props.dispatch({ type: 'viewLog/fetch' })
        }
    }
    handleCancel = () => {
      this.props.form.resetFields()
      this.props.itemModalHidden()
    }
    handleOk = () => {
      this.props.form.resetFields()
      this.props.itemModalHidden()
    }
    render() {
        return (
          <div>
            <Modal
              maskClosable={false}
              title="日志"
              visible={this.props.logVisiable}
              onCancel={this.handleCancel}
              onOk={this.handleOk}
            //   width="1500px"
            >
              <Table bordered dataSource={this.state.data} columns={columns} size="middle" />
            </Modal>
          </div>
        )
    }
}
