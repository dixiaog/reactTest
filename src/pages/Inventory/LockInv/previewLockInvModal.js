/*
 * @Author: chenjie
 * @Date: 2017-12-08 18:04:11
 * @Last Modified by: chenjie
 * 预览库存锁定单
 * @Last Modified time: 2018-05-04 16:40:47
 */
import React, { Component } from 'react'
import { Modal, Form, Input, Row, Col, Radio, Checkbox, Table, DatePicker, Icon, Alert, Tooltip } from 'antd'
import monent from 'moment'
import update from 'immutability-helper'
import styles from '../Inventory.less'
import config from '../../../utils/config'
import ChooseItem from '../../../components/ChooseItem'
import { unLockSku } from '../../../services/inventory/lockInv'

const FormItem = Form.Item
const RadioGroup = Radio.Group
@Form.create()
export default class addLockInvModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          chooseItemVisiable: false,
          tableData: [],
          chooseRows: [],
          shopNo: 0,
          submitLoading: false,
          tableLoading: false,
          lockInventoryList: [],
          // skulist: [],
        }
    }
    componentWillMount() {
      
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.previewData.lockInventoryList === undefined)
      this.setState({
        lockInventoryList: nextProps.previewData.lockInventoryList,
      })
    }
    // nextProps.lists.bdSkuDTO.
    handleOk = () => {
      this.handleSubmit()
    }
    handleCancel = () => {
      this.props.form.resetFields()
      this.props.hidden()
    }
    inputPress = (e) => {
      const { tableData } = this.state
      if (e.keyCode === 13) {
        this.setState({
          tableData: tableData.filter(ele => ele.skuNo.indexOf(e.target.value) > -1),
        })
      }
    }
    unlockInv = (record) => {
      unLockSku({ autoNo:record.autoNo }).then((json) => {
        if (json) {
          const { lockInventoryList } = this.state
          const index = lockInventoryList.findIndex(e => e.autoNo === record.autoNo)
          this.setState(
            update(this.state, {
              lockInventoryList: {
                [index]: { $merge: {
                  isUnlock: 1,
                } },
              },
            }),
        )
        }

      })
    }
    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form
      const { lockName, shopName, forbidSync, lockMode, expireUnlock, expireTime } = this.props.previewData
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
        const columns = [{
          title: '状态',
          dataIndex: 'uploadStatus',
          key: 'uploadStatus',
          width: 120,
          render: (text, record, index) => {
            if (text) {
              return <Icon type="check" style={{ color: '#2db7f5' }} />
            } else {
              return <Tooltip placement="top" title={record.remark}><Icon type="exclamation" style={{ color: '#f50' }} />锁定失败</Tooltip>
            }
          },
        }, {
          title: '锁定状态',
          dataIndex: 'operation',
          key: 'operation',
          width: 120,
          render: (text, record, index) => {
            if (record.isUnlock * 1 === 0) {
              return <a onClick={this.unlockInv.bind(this, record)} >[解锁]</a>
            } else {
              return <span>已解锁</span>
            }
          },
        }, {
          title: '商品编码',
          dataIndex: 'skuNo',
          key: 'skuNo',
          width: 200,
        }, {
          title: '平台商品编码',
          dataIndex: 'shopSkuNo',
          key: 'shopSkuNo',
          width: 200,
        }, {
          title: '商品名称',
          dataIndex: 'productName',
          key: 'productName',
          width: 120,
        }, {
          title: '原始锁定数',
          dataIndex: 'lockNum',
          key: 'lockNum',
          width: 120,
        }, {
          title: '订单使用',
          dataIndex: 'usedLockNum',
          key: 'usedLockNum',
          width: 120,
        }, {
          title: '已发货数',
          dataIndex: 'deliveredNum',
          key: 'deliveredNum',
          width: 120,
        }]
      return (
        <div>
          <Modal
            maskClosable={false}
            title="库存锁定单"
            visible={this.props.visiable}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={1000}
            bodyStyle={{ height: 500, overflowX: 'hidden' }}
            footer={[
            ]}
          >
            <Form
              onSubmit={this.handleSubmit}
              style={{ marginTop: 8 }}
            >
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="锁定名称"
                  >
                    {getFieldDecorator('lockName', {
                      initialValue: lockName,
                  })(
                    <Input size={config.InputSize} readOnly />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="锁定店铺"
                  >
                    {getFieldDecorator('shopName', {
                      initialValue: shopName,
                  })(
                    <Input size={config.InputSize} readOnly />
                  )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                  >
                    {getFieldDecorator('forbidSync', {
                      initialValue: forbidSync === 1,
                      valuePropName: 'checked',
                  })(
                    <Checkbox readOnly>禁止同步</Checkbox>
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="锁定模式"
                  >
                    {getFieldDecorator('lockMode', {
                      initialValue: lockMode,
                  })(
                    <RadioGroup disabled>
                      <Radio value={0}>百分比</Radio>
                      <Radio value={1}>指定数量</Radio>
                    </RadioGroup>
                  )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <Col span={8}>
                    <FormItem
                      wrapperCol={{
                        xs: { span: 24 },
                        sm: { span: 24 },
                        md: { span: 24 },
                      }}
                    >
                      {getFieldDecorator('expireUnlock', {
                        initialValue: expireUnlock === 1,
                        valuePropName: 'checked',
                    })(
                      <Checkbox readOnly>过期解锁</Checkbox>
                    )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem >
                      {getFieldDecorator('expireTime', {
                        initialValue: expireTime ? monent(expireTime, 'YYYY-MM-DD') : undefined,
                        rules: [{
                          required: getFieldValue('expireUnlock'),
                          message: '过期时间不能为空',
                        }],
                    })(
                      <DatePicker readOnly format="YYYY-MM-DD" disabled={!getFieldValue('expireUnlock')} size={config.InputSize} placeholder="过期时间" />
                    )}
                    </FormItem>
                  </Col>
                </Col>
              </Row>
            </Form>
            <div className={styles.tableList}>
              <div style={{ marginBottom: 10, marginTop: 10 }}>
                <Alert
                  style={{ width: 300, display: 'inline', marginLeft: 10, paddingTop: 4, paddingBottom: 4 }}
                  message="√表示成功，！表示锁定出问题，点击可查看详细信息"
                  type="warning"
                  size="small"
                />
                <Input
                  style={{
                    width: 250,
                    float: 'right',
                    marginRight: 10,
                  }}
                  size={config.InputSize}
                  placeholder="回车搜索商品编号，只锁定显示数据的库存"
                  onKeyDown={this.inputPress.bind(this)}
                />
              </div>
              <Table
                size="middle"
                pagination={false}
                columns={columns}
                dataSource={this.state.lockInventoryList}
                rowKey={record => record.skuNo}
                loading={this.state.tableLoading}
              />
              <Alert
                message="注: 如果商品对应的店铺连接有多个请到按连接锁定中锁定"
                type="warning"
                size="small"
              />
            </div>
          </Modal>
          <ChooseItem
            needInv="Y"
            changeModalVisiable={this.state.chooseItemVisiable}
            itemModalHidden={() => this.setState({ chooseItemVisiable: false })}
            chooseData={this.chooseData}
            chooseDataKeys={this.state.chooseRows.map(e => e.skuNo)}
            shopNo={this.state.shopNo}
            fromName="combination"
          />
        </div>
      )
    }
}
