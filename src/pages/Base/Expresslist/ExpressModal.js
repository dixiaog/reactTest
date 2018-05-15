/*
 * @Author: chenjie
 * @Date: 2017-12-26 09:09:21
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-05-02 19:24:20
 * 绑定新的物流（快递）公司
 */
import React, { Component } from 'react'
import { Modal, Input, Row, Checkbox } from 'antd'
import { getExpresscorp } from '../../../services/base/express'

const CheckboxGroup = Checkbox.Group
export default class ExpressModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      Alloptions: [],
      selected: [],
      baseOptions: [],
    }
  }
  componentDidMount() {
    getExpresscorp().then((json) => {
      if (json && json.list.length) {
        const options = []
        json.list.forEach((ele) => {
          options.push({ value: ele.expressCorpNo, label: ele.expressCorpName })
        })
        this.setState({
          options,
          Alloptions: options,
          baseOptions: options,
        })
      }
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.list && nextProps.visiable) {
      const hasSelect = nextProps.list.map(ele => ele.expressCorpNo)
      const { options, Alloptions } = this.state
      this.setState({
        options: options.filter(op => hasSelect.indexOf(op.value) === -1),
        Alloptions: Alloptions.filter(op => hasSelect.indexOf(op.value) === -1),
      })
    }
  }
  handleOk = () => {
    const corps = []
    this.state.options.forEach((ele) => {
      if (this.state.selected.indexOf(ele.value) > -1) {
        corps.push({ expressCorpNo: ele.value, expressCorpName: ele.label })
     }
    })
    this.props.addNewExpress(corps)
    this.props.addModalHidden()
  }
  handleCancel = () => {
    this.props.addModalHidden()
    const { baseOptions } = this.state
    this.setState({
      options: baseOptions,
      Alloptions: baseOptions,
    })
  }
  handleOnSearch = (value) => {
    const { Alloptions } = this.state
    const options = []
    Alloptions.forEach((op) => {
      if (op.label.indexOf(value) > -1) {
        options.push(op)
      }
    })
    this.setState({
      options,
    })
  }
  handleChange = (value) => {
    this.setState({ selected: value })
  }
  render() {
    return (
      <div>
        <Modal
          maskClosable={false}
          title="绑定新的物流(快递)公司"
          visible={this.props.visiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          <Row>
            <Input.Search
              placeholder="输入关键字,回车"
              onSearch={this.handleOnSearch.bind(this)}
              style={{ width: 200 }}
            />
          </Row>
          <Row style={{ marginTop: 10 }}>
            <CheckboxGroup options={this.state.options} onChange={this.handleChange.bind(this)} />
          </Row>
        </Modal>
      </div>)
  }
}
