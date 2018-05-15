/*
 * @Author: wupeng
 * @Date: 2017-12-25 10:04:11
 * @Last Modified by
 * 仓位资料维护 新增仓位
 * @Last Modified time:
 */
import React from 'react'
import { connect } from 'dva'
// import config from '../../utils/config'
// import { getLocalStorageItem } from '../../utils/utils'
import { Form, Select, InputNumber, Button, Modal, Row, Col } from 'antd'
import { insertStoragelocation } from '../../services/position/position'

const FormItem = Form.Item

@Form.create()
@connect(state => ({
  position: state.position,
  }))

class Xinput extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({
      children: [],
      loading: false,
    })
}
onOK = () => {
  this.handleSubmit()
}
handleSubmit = () => {
  this.props.form.validateFields((err, values) => {
  if (!err) {
    this.setState({
      loading: true,
    })
    values.layerNoStart = (values.layerNoStart === undefined) ? 1 : values.layerNoStart
    values.layerNoEnd = (values.layerNoEnd === undefined) ? 1 : values.layerNoEnd
    values.gridNoStart = (values.gridNoStart === undefined) ? 1 : values.gridNoStart
    values.gridNoEnd = (values.gridNoEnd === undefined) ? 1 : values.gridNoEnd
    values.warehouseNo = this.props.warehouseNo
    values.locationType = this.props.locationType
    insertStoragelocation({
      ...values,
    }).then((json) => {
      if (json) {
        this.setState({
          loading: false,
        })
        this.props.dispatch({
          type: 'position/treead',
          payload: {
            warehouseNo: this.props.warehouseNo,
            locationType: this.props.locationType,
          },
        })
        this.props.dispatch({
          type: 'position/search',
          payload: {
            warehouseNo: this.props.warehouseNo,
            locationType: this.props.locationType,
          },
        })
        this.props.Positiontwo()
    } else {
    this.setState({
      loading: false,
      })
    }
    })
  }
 })
}
areaNos = (rule, value, callback) => {
  if (/^[0-9]{1}$/.test(value)) {
    callback()
  } else if (/^[A-Z]{1}$/.test(value)) {
    callback()
  } else {
    callback('请输入单字母(大写)或两位以内的正整数')
  }
}
rowNoEnds = (rule, value, callback) => {
  if (this.props.form.getFieldValue('rowNoStart') === undefined) {
    callback('请先输入行开始')
  } else {
    if (this.props.form.getFieldValue('rowNoStart') <= value) {
      callback()
    } else {
      callback('行到不能小于行从')
    }
  }
}
columnNoEnds = (rule, value, callback) => {
  if (this.props.form.getFieldValue('columnNoStart') === undefined) {
    callback('请先输入列开始')
  } else {
    if (this.props.form.getFieldValue('columnNoStart') <= value) {
      callback()
    } else {
      callback('列到不能小于列从')
    }
  }
}
layerNoEnds = (rule, value, callback) => {
  if (this.props.form.getFieldValue('layerNoStart') === undefined) {
    callback()
  } else if (this.props.form.getFieldValue('layerNoStart') <= value) {
    callback()
  } else {
    callback('层到不能小于层从')
  }
}
gridNoEnds = (rule, value, callback) => {
  if (this.props.form.getFieldValue('gridNoStart') === undefined) {
    callback()
  } else if (this.props.form.getFieldValue('gridNoStart') <= value) {
    callback()
  } else {
    callback('格到不能小于格从')
  }
}

render() {
  const { getFieldDecorator } = this.props.form
  const { show, handelNowPositionshow } = this.props
  const formItemLayout = {
    labelCol: {
      xs: { span: 23 },
      sm: { span: 4 },
    },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
  const formLayout = {
    labelCol: {
      xs: { span: 16 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 10 },
      sm: { span: 16 },
      },
    }
    const formLayoust = {
      labelCol: {
        xs: { span: 17 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 16 },
      },
    }
    /**     <Row>
          <Col span={6} offset={20}>
            <Button type="primary" htmlType="submit" size="small" loading={this.state.loading}>提交</Button>
          </Col>
        </Row> */
return (
  <div>
    <Modal
      title="新增仓位"
      visible={show}
      width={700}
      footer={[
        <Button onClick={handelNowPositionshow}>取消</Button>,
        <Button type="primary" onClick={this.onOK} loading={this.state.loading}>提交</Button>,
      ]}
      maskClosable={false}
      onCancel={handelNowPositionshow}
    >
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col span={24}>
            <FormItem
              {...formItemLayout}
              label={(<span>区域代码&nbsp;</span>)}
            >
              {getFieldDecorator('areaNo',
                      {
                        rules: [{ required: true, validator: this.areaNos }],
                      }
                      )(
                        <Select
                          mode="combobox"
                          type="text"
                          placeholder="请输入区域代码"
                          size="small"
                        >
                          {this.state.children}
                        </Select>
                        )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={11} offset={1}>
            <FormItem
              {...formLayout}
              label={(<span>行从</span>)}
            >
              {getFieldDecorator('rowNoStart',
                {
                rules: [{ required: true, message: '请输入行开始!' }],
                }
              )(<InputNumber min={1} max={99} style={{ width: 120 }} placeholder="请输入行开始" size="small" />)}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem
              {...formLayout}
              label={(<span>到</span>)}
            >
              {getFieldDecorator('rowNoEnd',
                {
                  rules: [{
                    required: true,
                    message: '请输入行结束',
                    validator: this.rowNoEnds,
                  }],
                }
              )(<InputNumber min={1} max={99} style={{ width: 120 }} placeholder="请输入行结束" size="small" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={11} offset={1}>
            <FormItem
              {...formLayout}
              label={(<span>列从</span>)}
            >
              {getFieldDecorator('columnNoStart',
                {
                  rules: [{ required: true, message: '请输入列开始!' }],
                }
              )(<InputNumber min={1} max={99} style={{ width: 120 }} placeholder="请输入列开始" size="small" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formLayout}
              label={(<span>到</span>)}
            >
              {getFieldDecorator('columnNoEnd',
                {
                  rules: [{ required: true, validator: this.columnNoEnds }],
                }
              )(<InputNumber min={1} max={99} style={{ width: 120 }} placeholder="请输入列结束" size="small" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={11} offset={1}>
            <FormItem
              {...formLayoust}
              label={(<span>层从</span>)}
            >
              {getFieldDecorator('layerNoStart')(<InputNumber min={1} max={99} style={{ width: 120 }} placeholder="请输入层开始" size="small" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formLayoust}
              label={(<span>到</span>)}
            >
              {getFieldDecorator('layerNoEnd',
              {
                rules: [{
                  validator: this.layerNoEnds,
                  }],
              })(<InputNumber min={1} max={99} style={{ width: 120 }} placeholder="请输入层结束" size="small" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={11} offset={1}>
            <FormItem
              {...formLayoust}
              label={(<span>格从</span>)}
            >
              {getFieldDecorator('gridNoStart')(<InputNumber min={1} max={99} style={{ width: 120 }} placeholder="请输入格开始" size="small" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formLayoust}
              label={(<span>到</span>)}
            >
              {getFieldDecorator('gridNoEnd',
              {
                rules: [{
                validator: this.gridNoEnds,
                }],
              })(<InputNumber min={1} max={99} style={{ width: 120 }} placeholder="请输入格结束" size="small" />)}
            </FormItem>
          </Col>
        </Row>
   
      </Form>
    </Modal>
  </div>
  )
  }
}
export default Xinput
