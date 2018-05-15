/*
 * @Author: tanmengjia
 * @Date: 2018-02-08 16:41:31
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-19 10:01:02
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Radio, notification, message, Col, Checkbox, Button, Divider } from 'antd'
import config from '../../../../utils/config'
import { moneyCheck } from '../../../../utils/utils'
import styles from '../../Order.less'
import { saveSplitStrategy } from '../../../../services/order/orderList'

const RadioGroup = Radio.Group
const FormItem = Form.Item

@connect(state => ({
  splitStrategy: state.splitStrategy,
}))
@Form.create()
export default class SplitStrategy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      splitHistoryFlag: true,
      isFirst: true,
      mergeHistoryFlag: true,
      splitType: 1,
      oldMinAmount: '',
      newMinAmount: '',
      inventoryRate: '',
      includeProduct: '',
      includeSku: '',
      maxNum: '',
    }
  }
  componentWillMount() {
    if (this.state.isFirst && this.props.data) {
      this.setState({
        isFirst: false,
        splitHistoryFlag: this.props.data.splitHistoryFlag === 1,
        mergeHistoryFlag: this.props.data.mergeHistoryFlag === 1,
        splitType: this.props.data.splitType,
        oldMinAmount: this.props.data.oldMinAmount,
        newMinAmount: this.props.data.newMinAmount,
        inventoryRate: this.props.data.inventoryRate,
        includeProduct: this.props.data.includeProduct,
        includeSku: this.props.data.includeSku,
        maxNum: this.props.data.maxNum,
      })
    }
  }
  setOldMinAmount = (e) => {
    this.setState({
      oldMinAmount: e.target.value,
    })
  }
  setNewMinAmount = (e) => {
    this.setState({
      newMinAmount: e.target.value,
    })
  }
  setInventoryRate = (e) => {
    this.setState({
      inventoryRate: e.target.value,
    })
  }
  setSplitType = (e) => {
    this.setState({
      splitType: e.target.value,
    })
  }
  setSplitHistoryFlag = (e) => {
    this.setState({
      splitHistoryFlag: e.target.checked,
    })
  }
  setMergeHistoryFlag = (e) => {
    this.setState({
      mergeHistoryFlag: e.target.checked,
    })
  }
  setIncludeProduct = (e) => {
    this.setState({
      includeProduct: e.target.value,
    })
  }
  setIncludeSku = (e) => {
    this.setState({
      includeSku: e.target.value,
    })
  }
  setMaxNum = (e) => {
    this.setState({
      maxNum: e.target.value,
    })
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let yes = true
        Object.assign(values, { splitHistoryFlag: this.state.splitHistoryFlag ? 1 : 0 })
        Object.assign(values, { mergeHistoryFlag: this.state.mergeHistoryFlag ? 1 : 0 })
        if (this.state.splitType > 0) {
          Object.assign(values, { splitType: this.state.splitType })
          if (this.state.splitType === 1) {
            if (this.state.oldMinAmount > 0) {
              if (!moneyCheck(this.state.oldMinAmount)) {
                message.error('请输入正确的原订单最小金额')
                yes = false
              }
              Object.assign(values, { oldMinAmount: this.state.oldMinAmount })
            }
            if (this.state.newMinAmount > 0) {
              if (!moneyCheck(this.state.newMinAmount)) {
                message.error('请输入正确的新订单最小金额')
                yes = false
              }
              Object.assign(values, { newMinAmount: this.state.newMinAmount })
            }
          } else if (this.state.splitType === 4) {
            if (this.state.inventoryRate > 0) {
              if (!/^(([1-9])|([0])|([1-9][0-9]))$/.test(this.state.inventoryRate)) {
                message.error('请输入正确的比例')
                yes = false
              }
              Object.assign(values, { inventoryRate: this.state.inventoryRate })
            }
          } else if (this.state.splitType === 5) {
            if (this.state.maxNum > 0) {
              if (!/^(|([0])|([1-9][0-9]*))$/.test(this.state.maxNum)) {
                message.error('请输入正确的数量')
                yes = false
              }
              Object.assign(values, { maxNum: this.state.maxNum })
            }
            Object.assign(values, { includeProduct: this.state.includeProduct, includeSku: this.state.includeSku })
          }
        }
        if (this.props.data && this.props.data.strategyNo > -1) {
          Object.assign(values, { strategyNo: this.props.data.strategyNo })
        }
        if (yes) {
          saveSplitStrategy(values).then((json) => {
            if (json) {
              this.props.dispatch({ type: 'splitStrategy/fetch' })
              notification.success({
                message: '操作成功',
              })
              this.props.form.resetFields()
              this.props.itemModalHidden()
            }
          })
        }
      }
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
  }
  checkBlank = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
      callback('策略名称不能输入空格')
    } else {
      callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 16 },
      },
    }
    return (
      <Modal
        key="811"
        maskClosable={false}
        title="订单批量拆分"
        visible={this.props.splitModalVisiable}
        onCancel={this.handleCancel}
        // onOk={this.handleOk}
        bodyStyle={{ padding: 0 }}
        width="1000px"
        footer={[
          <Button key="789" type="primary" onClick={this.handleOk}>
            保存策略
          </Button>,
        ]}
      >
        <div className={styles.modalStyle} style={{ backgroundColor: '#E5E5E5' }}>
          <br />
          <div style={{ color: 'green', marginLeft: '15px' }}>货到付款订单禁止拆分</div>
          <div style={{ color: 'green', marginLeft: '15px', marginTop: '5px' }}>拆分订单后请勿线上发货或其它ERP发货，拆分订单线上发货，线下同步发货判断可能有误</div>
          <br />
        </div>
        <Form style={{ marginTop: 8 }}>
          <Col span={1}>
            <div />
          </Col>
          <Col span={23}>
            <div>
              <b>新增拆分策略</b>
            </div>
          </Col>
          <FormItem {...formItemLayout1} label="策略名称">
            {getFieldDecorator('strategyName', {
              initialValue: this.props.data ? this.props.data.strategyName : '',
              rules: [
                {
                  required: true,
                  message: '请输入策略名称',
                },
                {
                  validator: this.checkBlank,
                },
              ],
            })(<Input size={config.InputSize} placeholder="策略名称" maxLength="50" />)}
          </FormItem>
          <Divider style={{ marginTop: 5, marginBottom: 5 }} />
          <div>
            <Col span={1}>
              <div />
            </Col>
            <Col span={23}>
              <Checkbox onChange={this.setSplitHistoryFlag} checked={this.state.splitHistoryFlag} disabled>
                有拆分历史的订单不允许继续拆分(默认):<span style={{ color: '#A59EA9' }}>系统将自动过滤有拆分历史的订单</span>
              </Checkbox>
            </Col>
          </div>
          <div>
            <Col span={1}>
              <div />
            </Col>
            <Col span={23}>
              <Checkbox onChange={this.setMergeHistoryFlag} checked={this.state.mergeHistoryFlag} style={{ marginTop: 10, marginBottom: 5 }} disabled>
                有合并历史的订单不允许继续拆分(默认):<span style={{ color: '#A59EA9' }}>系统将自动过滤有合并历史的订单</span>
              </Checkbox>
            </Col>
          </div>
          <Divider style={{ marginTop: 57, marginBottom: 5 }} />
          <RadioGroup onChange={this.setSplitType} value={this.state.splitType}>
            <Col span={1} style={{ marginBottom: '10px' }}>
              <div />
            </Col>
            <Col span={23} style={{ marginBottom: '10px' }}>
              <Radio value={1}>
                预售+现货的订单:<span style={{ color: '#A59EA9' }}>拆分成一个预售单(新订单)与一个现货订单(将作为主订单保留原订单号)</span>
              </Radio>
            </Col>
            {this.state.splitType === 1 ? (
              <div>
                <Col span={2}>
                  <div />
                </Col>
                <Col span={22}>
                  <div style={{ color: '#A59EA9' }}>
                    留在原订单商品的合计金额：小于指定金额<Input
                      size={config.InputSize}
                      onChange={this.setOldMinAmount}
                      value={this.state.oldMinAmount}
                      style={{ width: 60, marginRight: 5, marginLeft: 5 }}
                    />时，不拆分(仅预售拆分与库存拆分有效)
                  </div>
                </Col>
                <Col span={2}>
                  <div />
                </Col>
                <Col span={22}>
                  <div style={{ color: '#A59EA9' }}>
                    当主动拆分商品的合计金额：小于指定金额<Input
                      size={config.InputSize}
                      onChange={this.setNewMinAmount}
                      value={this.state.newMinAmount}
                      style={{ width: 60, marginRight: 5, marginLeft: 5, marginTop: '5px', marginBottom: '10px' }}
                    />时，不拆分(仅预售拆分与库存拆分有效)
                  </div>
                </Col>
              </div>
            ) : null}
            <Col span={1} style={{ marginBottom: '10px' }}>
              <div />
            </Col>
            <Col span={23} style={{ marginBottom: '10px' }}>
              <Radio value={4}>
                根据库存拆分订单:<span style={{ color: '#A59EA9' }}>拆分成有库存的订单与缺货的订单。请注意订单的勾选范围，如果与审单不一致，拆分结果可能与实际要求有差异。</span>
              </Radio>
            </Col>
            {this.state.splitType === 4 ? (
              <div>
                <Col span={2}>
                  <div />
                </Col>
                <Col span={22}>
                  <div style={{ color: '#A59EA9' }}>
                    有库存商品占比<Input
                      size={config.InputSize}
                      onChange={this.setInventoryRate}
                      value={this.state.inventoryRate}
                      style={{ width: 60, marginLeft: 5, marginRight: 5, marginBottom: '10px' }}
                    />%以上才能拆分
                  </div>
                </Col>
              </div>
            ) : null}
            <Col span={1} style={{ marginBottom: '10px' }}>
              <div />
            </Col>
            <Col span={23} style={{ marginBottom: '10px' }}>
              <Radio value={5}>
                指定商品进行拆单:<span style={{ color: '#A59EA9' }}>订单包含指定商品并包含非指定商品》拆分成指定商品订单(新订单)与非指定商品订单(将作为主订单保留原订单号)</span>
              </Radio>
            </Col>
            {this.state.splitType === 5 ? (
              <div>
                <Col span={2}>
                  <div />
                </Col>
                <Col span={22}>
                  <div style={{ color: '#A59EA9' }}>
                    指定款号(货号)<Input size={config.InputSize} onChange={this.setIncludeProduct} value={this.state.includeProduct} style={{ width: 420, marginLeft: 5 }} />
                  </div>
                </Col>
                <Col span={2}>
                  <div />
                </Col>
                <Col span={22}>
                  <div style={{ color: '#A59EA9' }}>
                    指定商品编码<Input size={config.InputSize} onChange={this.setIncludeSku} value={this.state.includeSku} style={{ width: 420, marginLeft: 13, marginTop: '5px' }} />
                  </div>
                </Col>
                <Col span={2}>
                  <div />
                </Col>
                <Col span={22}>
                  <div style={{ color: '#A59EA9' }}>
                    拆分出来的新订单每单最大商品数量<Input
                      size={config.InputSize}
                      onChange={this.setMaxNum}
                      value={this.state.maxNum}
                      style={{ width: 60, marginLeft: 13, marginRight: 5, marginTop: '5px' }}
                    />(超过最大数量将拆分成多个订单，数量为0则全部拆分到一个订单，单拆指定商品必须设定)
                  </div>
                </Col>
              </div>
            ) : null}
          </RadioGroup>
        </Form>
      </Modal>
    )
  }
}
