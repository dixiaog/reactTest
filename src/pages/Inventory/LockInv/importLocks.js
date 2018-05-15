import React, { Component } from 'react'
import { Card, Button, Input, Form, Modal, Radio, Row, Col, Checkbox, notification } from 'antd'
import { importLocks } from '../../../services/inventory/lockInv'

const FormItem = Form.Item
const RadioGroup = Radio.Group
@Form.create()
export default class ImportLocks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            eidtLocks: [],
            eidtSkus: [],
        }
    }

    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
    }
    handleOk = () => {
      this.handleSubmit()
    }
    handleCancel = () => {
      this.props.form.resetFields()
      this.props.hidden()
    }
    handleSubmit = () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            const type = values.type
            const textAreas = values.textSku.split('\n')
            const list = []
            if (type === 1) {
                textAreas.forEach((e) => {
                  list.push({
                      skuNo: e,
                  })
              })
            } else if (type === 2) {
                textAreas.forEach((e) => {
                    const a = e.split(' ').filter(h => h !== "")
                    if(a[1] * 1 > 99999) {
                      notification.warning(`${a[0]}数量过大,后台无法修改`)
                      return false
                    }
                    list.push({
                        skuNo: a[0],
                        invNum: a[1] * 1,
                    })
                })
            } else {
                textAreas.forEach((e) => {
                    const a = e.split(' ').filter(h => h !== "")
                    if(a[1] * 1 > 99999) {
                      notification.warning(`${a[0]}数量过大,后台无法修改`)
                      return false
                    }
                    list.push({
                        skuNo: a[0],
                        invNum: a[1] * 1,
                        skuShopUrl: a[2],
                    })
                })
            }

            importLocks({
                type,
                shopNo: this.props.shopNo * 1,
                autoCheck: values.autoCheck,
                list,
            }).then((json) => {
                this.handleCancel()
                this.props.importSuc(json)
            })
        }
      })
    }
    cellChange = (index, val) => {
        const { eidtLocks, eidtSkus } = this.state
        const { list } = this.props.editLocks
        if (eidtSkus.indexOf(list[index].skuNo) > -1) {
            const editIndex = eidtLocks.findIndex(e => e.skuNo === list[index].skuNo)
            eidtLocks[editIndex].editNum = val
        } else {
            eidtLocks.push({
                skuNo: list[index].skuNo,
                editNum: val,
            })
            eidtSkus.push(list[index].skuNo)
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
              md: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 12 },
              md: { span: 12 },
            },
          }
        return (
          <div>
            <Modal
              maskClosable={false}
              title="请输入需要锁定库存的商品编码"
              visible={this.props.visiable}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width={1000}
              bodyStyle={{ height: 500, overflowX: 'hidden' }}
              footer={[
                <Button key="submit" type="primary" loading={this.state.submitLoading} onClick={this.handleOk}>
                    提交商品库存锁定
                </Button>,
            ]}
            >
              <Form
                onSubmit={this.handleSubmit}
                style={{ marginTop: 8 }}
              >
                <Card style={{ marginBottom: 10 }}>
                  <FormItem wrapperCol={{ md: 24 }}>
                    {getFieldDecorator('type', {
                        initialValue: 1,
                  })(
                    <RadioGroup style={{ width: '100%' }}>
                      <Row>
                        <Col span={8}><Radio value={1}>导入商品编码，一行一个</Radio></Col>
                        <Col span={8}><Radio value={2}>手动指定商品编码和库存</Radio></Col>
                        { this.props.byUrl ? <Col span={8}><Radio value={3}>手动指定商品编码,商品链接和库存</Radio></Col> : null }
                      </Row>
                    </RadioGroup>
                  )}
                  </FormItem>
                  <Row>
                    <Col span={8}>A0102018001</Col>
                    <Col span={8}>A0102018001 800</Col>
                    { this.props.byUrl ? <Col span={8}>A0102018001 800 http://www.baidu.com</Col> : null }
                  </Row>
                  <Row>
                    <Col span={8}>A0102018002</Col>
                    <Col span={8}>A0102018002 800</Col>
                    { this.props.byUrl ? <Col span={8}>A0102018002 800 http://www.taobao.com</Col> : null}
                  </Row>
                </Card>
                <FormItem>
                  {getFieldDecorator('textSku', {
                        rules: [{
                            required: true, message: '请输入信息',
                        }],
                  })(
                    <Input.TextArea rows={18} />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('autoCheck', {
                    initialValue: false,
                    valuePropName: 'checked',
                  })(
                    <Checkbox>导入商品带库存数量时自动和可用数量判断,以数量少的为准</Checkbox>
                  )}
                </FormItem>
              </Form>
            </Modal>
          </div>
        )
    }
}
