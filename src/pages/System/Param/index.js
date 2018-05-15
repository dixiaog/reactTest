import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, List, Row, Col, Input, Select, Upload, Icon, Button } from 'antd'
import { getLocalStorageItem } from '../../../utils/utils'
import { deployParam } from '../../../services/sym/param'
import config from '../../../utils/config'

const Option = Select.Option
@connect(state => ({
  param: state.param,
}))
export default class Param extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'param/fetch',
    })
  }
  selectChange = (item, e) => {
    deployParam(Object.assign(item, { paramValue: e })).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'param/fetch',
        })
      }
    })
  }
  mutilSelectChange = (item, e) => {
    deployParam(Object.assign(item, { paramValue: e.join(',') })).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'param/fetch',
        })
      }
    })
  }
  inputChange = (item, e) => {
    if (e.target.value !== '') {
      deployParam(Object.assign(item, { paramValue: e.target.value })).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'param/fetch',
          })
        }
      })
    }
  }
  renderEdit = (item) => {
    switch (item.paramType) {
      case 0:
      return (<Input style={{ width: 100 }} onPressEnter={this.inputChange.bind(this, item)} />)
      case 1:
      return null
      case 2:
      break
      case 3:
      break
      case 4: {
      const _this = this
      return (
        <Upload
          {...{
            name: 'file',
            action: `${config.APIV1}/demo/ossupload`,
            headers: {
              'Authorization': `Basic ${getLocalStorageItem('token')}`,
            },
            onChange(info) {
              console.info("response",info.file.response)
              if (info.file.status === 'done') {
                deployParam(Object.assign(item, { paramValue: info.file.response.data })).then((json) => {
                  if (json) {
                    _this.props.dispatch({
                      type: 'param/fetch',
                    })
                  }
                })
              }
            },
          }}
        >
          <Button>
            <Icon type="upload" /> 选择文件
          </Button>
        </Upload>)
      }
      default:
      return null
    }
  }
  renderContent = (item) => {
    switch (item.paramType) {
      case 0:
      return (<div>{item.paramValue}</div>)
      case 1: {
      const chooses = []
      item.paramSpareValue.split(',').forEach((ele) => {
        const keyValue = ele.split('=')
        chooses.push({
          key: keyValue[0],
          value: keyValue[1],
        })
      })
      return (
        <Select defaultValue={item.paramValue} onChange={this.selectChange.bind(this, item)}>
          {chooses.map(e => <Option key={e.key}>{e.value}</Option>)}
        </Select>)
      }
      case 2: {
      const chooses = []
      item.paramSpareValue.split('\n').forEach((ele) => {
        const keyValue = ele.split('=')
        chooses.push({
          key: keyValue[0],
          value: keyValue[1],
        })
      })
      return (
        <Select defaultValue={item.paramValue} style={{ width: '550px' }} onChange={this.selectChange.bind(this, item)}>
          {chooses.map(e => <Option key={e.key}>{e.value}</Option>)}
        </Select>)
      }
      case 3:
      {
        const chooses = []
        item.paramSpareValue.split('\n').forEach((ele) => {
          const keyValue = ele.split('=')
          chooses.push({
            key: keyValue[0],
            value: keyValue[1],
          })
        })
        return (
          <Select mode="multiple" style={{ width: '550px' }} defaultValue={item.paramValue.split(',')} onBlur={this.mutilSelectChange.bind(this, item)} >
            {chooses.map(e => <Option key={e.key}>{e.value}</Option>)}
          </Select>)
        }
      case 4:
      {
        return <img style={{ width: '100px',height: '100px' }} src={item.paramValue}/>
      }
      default:
        return null
    }
  }

  render() {
    const { data, loading } = this.props.param
    return (
      <div>
        <Card bordered={false} >
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={data}
            header={<Row><Col span={21}>项目</Col><Col span={1}>当前状态</Col><Col span={1} offset={1} >操作</Col></Row>}
            renderItem={item => (
              <List.Item actions={[this.renderEdit(item)]}>
                <List.Item.Meta
                  title={item.paramName}
                  description={item.remark}
                />
                <div>{this.renderContent(item)}</div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    )
  }
}
