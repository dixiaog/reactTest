/*
 * @Author: chenjie
 * @Date: 2017-12-27 09:42:44
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-04-28 13:45:39
 * 运费模版编辑
 */
import React, { Component } from 'react'
import { Form, Button, Table, Row, Col, Popconfirm } from 'antd'
import { checkEmpty } from '../../../utils/utils'
import ExpressEditFreightRuleForm from './ExpressEditFreightRuleForm'
import ChinaArea from '../../../components/ChinaArea'

@Form.create()
export default class ExpressEditFreightRule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chinaAreaVisiable: false,
      dataSource: [{
        destination: '',
        weightRange: [
         {
            minWeight: 0,
            maxWeight: 0,
            firstWeight: 0,
            firstExpense: 0,
            additionalWeight: 0,
            additionalExpense: 0,
          },
        ],
        key: '0',
      }],
      eidtIndex: 0,
      editDestination: '',
      otherDestination: '', // 已选地区不能再次被选中
      count: 2,
    }
  }
  componentWillMount() {
    // console.log('this.props.areafreightrule', this.props.areafreightrule)
  }
  componentWillReceiveProps(nextProps) {
    const dataSource = []
    if (this.props.areafreightrule.length !== nextProps.areafreightrule.length) {
      nextProps.areafreightrule.forEach((element, i) => {
        dataSource.push({
          destination: element.destination,
          weightRange: element.weightRange,
          key: i.toString(),
        })
      })
      this.setState({ dataSource }, () => { })
    }
  }
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource]
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) }, () => { this.props.areaChange(this.state.dataSource) })
  }
  handleAdd = () => {
    const { count, dataSource } = this.state
    const newData = {
      destination: '',
      // weightRange: {
      //   0: {
      //     minWeight: 0,
      //     maxWeight: 0,
      //     firstWeight: 0,
      //     firstExpense: 0,
      //     additionalWeight: 0,
      //     additionalExpense: 0,
      //   },
      // },
      weightRange: [
        {
          minWeight: 0,
          maxWeight: 0,
          firstWeight: 0,
          firstExpense: 0,
          additionalWeight: 0,
          additionalExpense: 0,
        },
      ],
      key: count,
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    }, () => { this.props.areaChange(this.state.dataSource) })
  }
  weightRangeChange = (index, data) => {
    const { dataSource } = this.state
    const { weightRange } = data
    dataSource[index].weightRange = weightRange
    this.setState({
      dataSource,
    }, () => { this.props.areaChange(this.state.dataSource) })
  }
  editArea = (destination) => {
    const { dataSource, eidtIndex } = this.state
    // const des = dataSource.length && dataSource.filter(e => e.destination === destination)
    // if (des.length > 0) {
    //   message.warn('已存在相同指定区域')
    // } else {
      dataSource[eidtIndex].destination = destination
      this.setState({
        dataSource,
      }, () => { this.props.areaChange(this.state.dataSource) })
    //}
  }
  selectedDesitination = (destination, index) => {
    const otherDestination = []
    this.state.dataSource.forEach((e) => {
      if (e.destination !== destination) {
        otherDestination.push(e.destination)
      }
    })
    this.setState({ 
      chinaAreaVisiable: true,
      eidtIndex: index,
      editDestination: destination,
      otherDestination: otherDestination.join(','),
    })
  }

  render() {
    const weightRangeTitle = (
      <Row>
        <Col span={8}>使用重量范围</Col>
        <Col span={4} style={{ textAlign: 'right' }}>首重(kg)</Col>
        <Col span={4} style={{ textAlign: 'right' }}>首费(元)</Col>
        <Col span={4} style={{ textAlign: 'right' }}>续重(kg)</Col>
        <Col span={4} style={{ textAlign: 'right' }}>续费(元)</Col>
      </Row>
    )
    const columns = [{
      title: '运送到',
      dataIndex: 'destination',
      render: (text, record, index) => {
        return (
          <div>
            {checkEmpty(text) ? '未添加地区' : text}
            <a onClick={this.selectedDesitination.bind(this, text, index)} >编辑</a>
          </div>)
      },
    }, {
      title: weightRangeTitle,
      dataIndex: 'weightRange',
      width: 500,
      render: (text, record, index) => {
        return (<ExpressEditFreightRuleForm
          weightRangeChange={this.weightRangeChange}
          line={index}
          key={index}
          weightRange={text}
        />)
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          <Popconfirm title="确定要该删除数据？" onConfirm={() => this.onDelete(record.key)}>
            <a>删除</a>
          </Popconfirm>
        )
      },
    }]
    const { dataSource } = this.state
    return (
      <div>
        <Button size="small" style={{ marginBottom: 5 }} onClick={this.handleAdd}>为指定地区设置运费</Button>
        <Table bordered dataSource={dataSource} columns={columns} rowKey={record => record.key} />
        <ChinaArea
          key="ChinaArea"
          hidden={() => { this.setState({ chinaAreaVisiable: false }) }}
          visiable={this.state.chinaAreaVisiable}
          editArea={this.editArea}
          otherDestination={this.state.otherDestination}
          editDestination={this.state.editDestination}
        />
      </div>
    )
  }
}
