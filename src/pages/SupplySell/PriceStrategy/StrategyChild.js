/*
 * @Author: tanmengjia
 * @Date: 2018-01-23 10:00:50
 * @Last Modified by: tanmengjia
 * 策略子表
 * @Last Modified time: 2018-03-12 17:22:20
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Table, Input, Button } from 'antd'

const data = []

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)
@connect(state => ({
    priceStrategy: state.priceStrategy,
  }))
export default class StrategyChild extends Component {
    constructor(props) {
        super(props)
        this.columns = [{
          title: '商品编码',
          dataIndex: 'skuNo',
          width: '25%',
          render: (text, record) => this.renderColumns(text, record, 'skuNo'),
        }, {
          title: '款式编码(货号)',
          dataIndex: 'productNo',
          width: '25%',
          render: (text, record) => this.renderColumns(text, record, 'productNo'),
        }, {
          title: '名称/颜色',
          dataIndex: 'product',
          width: '25%',
          render: (text, record) => this.renderColumns(text, record, 'productSpec'),
        }, {
            title: '指定价格',
            dataIndex: 'specifyPrice',
            width: '25%',
            render: (text, record) => this.renderColumns(text, record, 'specifyPrice'),
        }]
        this.columns1 = [{
          title: '款式编码(货号)',
          dataIndex: 'productNo',
          width: '25%',
          render: (text, record) => this.renderColumns(text, record, 'productNo'),
        }, {
          title: '名称',
          dataIndex: 'productName',
          width: '25%',
          render: (text, record) => this.renderColumns(text, record, 'productSpec'),
        }, {
            title: '指定价格',
            dataIndex: 'specifyPrice',
            width: '25%',
            render: (text, record) => this.renderColumns(text, record, 'specifyPrice'),
        }]
        this.state = { data }
        this.cacheData = data.map(item => ({ ...item }))
      }
      cancel() {
        this.props.dispatch({ type: 'priceStrategy/cleanChild' })
      }
      handleChange(value, key, column) {
        const newData = [...this.state.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target[column] = value
          this.setState({ data: newData })
        }
      }
      renderColumns(text, record, column) {
        return (
          <EditableCell
            editable={record.editable}
            value={text}
            onChange={value => this.handleChange(value, record.key, column)}
          />
        )
      }
      render() {
        return (
          <div>
            <Table bordered rowKey={record => record.autoNo} dataSource={this.props.priceStrategy.childs1} columns={this.props.record.specifyType ? this.columns1 : this.columns} />
            <Button
              style={{ marginLeft: 20 }}
              onClick={() => {
                this.props.hideModal()
              }}
            >
              关闭页面
            </Button>
          </div>
        )
      }
}
