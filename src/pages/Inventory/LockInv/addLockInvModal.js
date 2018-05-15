/*
 * @Author: chenjie
 * @Date: 2017-12-08 18:04:11
 * @Last Modified by: chenjie
 * 新增库存锁定单
 * @Last Modified time: 2018-05-14 15:39:33
 */
import React, { Component } from 'react'
import { Modal, Form, Input, Select, Row, Col, Radio, Checkbox, Table, DatePicker, Button, message, Alert } from 'antd'
import moment from 'moment'
import styles from '../Inventory.less'
import config from '../../../utils/config'
import ChooseItem from '../../../components/ChooseItem'
import ImportLocks from './importLocks'
import { floatCheck, checkNumber, checkEmpty } from '../../../utils/utils'
import { getSkuInfoInShopNo, addLockInventory } from '../../../services/inventory/lockInv'

const FormItem = Form.Item
const { Option } = Select
const RadioGroup = Radio.Group
@Form.create()
export default class addLockInvModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          chooseItemVisiable: false,
          shopChoosed: false,
          tableData: [],
          tableDataCopy: [],
          chooseRows: [],
          shopNo: 0,
          submitLoading: false,
          tableLoading: false,
          ImportLocksModalVisiable: false,
          editable: true,
          // skulist: [],
        }
    }
    // nextProps.lists.bdSkuDTO.
    handleOk = () => {
      this.handleSubmit()
    }
    handleCancel = () => {
      this.setState({
        shopChoosed: false,
      })
      this.props.form.resetFields()
      this.props.hidden()
    }
    handleSubmit = () => {
      if (this.state.tableData.length === 0) {
        message.error('请先添加要锁定库存的商品')
        return false
      }
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.setState({
            submitLoading: true,
          })
          const shop = this.props.shops.filter(e => e.shopNo * 1 === values.shopNo * 1)
          addLockInventory({
            ...Object.assign(values, {
              lockName: values.lockName.trim(),
              shopName: shop.length ? shop[0].shopName :'',
              shopNo: values.shopNo ? values.shopNo : 0,
              expireUnlock: values.expireUnlock ? 1 : 0,
              forbidSync: values.forbidSync ? 1 : 0,
            },expireUnlock ? { expireTime: moment(values.expireTime).format('YYYY-MM-DD HH:mm:ss') } :{}, { lockInventoryList: this.state.tableData }),
          }).then((json) => {
            if (json !== null) {
              this.setState({
                submitLoading: false,
                tableData: [],
                tableDataCopy: [],
              })
              this.handleCancel()
              this.props.previewLockInv(json)
            } else {
              this.setState({
                submitLoading: false,
              })
            }
          })
        }
      })
    }
    chooseData = (rows, keys, cb) => {
      cb()
      this.setState({
        tableLoading: true,
      })
      getSkuInfoInShopNo({
        skuNoList: rows.map(e => e.skuNo),
        shopNo: this.state.shopNo,
      }).then((json) => {
        const tableData = []
        if (json.skuList.length === 0) {
          message.info('该店铺不存在所选商品的库存')
        }
        json.skuList.length && json.skuList.forEach((e) => {
          tableData.push({
            skuNo: e.skuNo,
            productName: e.productName,
            invAvailableNum: e.invAvailableNum,
            nowLock: e.invAvailableNum,
            percent: 100,
            specifiedNum: e.invAvailableNum,
            lockNum: e.invAvailableNum,
          })
        })
        this.setState({
          tableData,
          tableDataCopy: tableData,
          chooseRows: tableData,
          tableLoading: false,
          editable: json.skuList && json.skuList.length === 0,
        })
      })
    }
    importSuc = (json) => {
      const tableData = []
        json.skuList.length && json.skuList.forEach((e) => {
          tableData.push({
            skuNo: e.skuNo,
            productName: e.productName,
            invAvailableNum: e.invAvailableNum,
            nowLock: e.lockNum ? e.lockNum : e.invAvailableNum,
            percent: e.lockNum ? Math.ceil(e.lockNum/e.invAvailableNum * 100) : 100,
            specifiedNum: e.lockNum ? e.lockNum : e.invAvailableNum,
            lockNum: e.lockNum ? e.lockNum : e.invAvailableNum,
          })
        })
        this.setState({
          tableData,
          tableDataCopy: tableData,
          tableLoading: false,
        })
    }
    numChange = (index, val) => {
      const { getFieldValue } = this.props.form
      const { tableData, tableDataCopy } = this.state
      const cIndex = tableDataCopy.findIndex(e => e.skuNo === tableData[index].skuNo)
      if (getFieldValue('lockMode') === 0) {
        if (!floatCheck(val.target.value) || val.target.value <= 0) {
          message.error('错误的百分比格式')
          Object.assign(tableData[index], {
            percent: 100,
            lockNum: tableData[index].invAvailableNum,
          })
        } else {
          Object.assign(tableData[index], {
            percent: val.target.value,
            lockNum: Math.ceil((Number(tableData[index].invAvailableNum) * Number(val.target.value)) / 100),
          })
        }
      } else {
        if (!checkNumber(val.target.value) || val.target.value * 1 <= 0) {
          message.error('数量值运行正整数')
          Object.assign(tableData[index], {
            specifiedNum: tableData[index].invAvailableNum,
            lockNum: tableData[index].invAvailableNum,
          })
        } else {
          Object.assign(tableData[index], {
            specifiedNum: val.target.value,
            lockNum: val.target.value,
          })
        }
      }
      tableDataCopy[cIndex] = tableData[index]
      this.setState({
        tableData: [],
      }, () => {
        this.setState({
          tableData,
          tableDataCopy,
        })
      })
      
    }
    showTableDate = (e) => {
      switch (e * 1) {
        case 0:
        this.setState({
          tableData: this.state.tableDataCopy,
        })
        break
        case 1:
        this.setState({
          tableData: this.state.tableDataCopy.filter(ele => ele.lockNum > ele.invAvailableNum),
        })
        break
        case 2:
        this.setState({
          tableData: this.state.tableDataCopy.filter(ele => ele.lockNum <= ele.invAvailableNum),
        })
        break
        default:
        break
      }
    }
    addLockInvBill = () => {
      const { getFieldValue } = this.props.form
      if (getFieldValue('shopNo')|| getFieldValue('forbidSync')) {
        this.setState({
          chooseItemVisiable: true,
          // shopNo: getFieldValue('shopNo'),
        })
      } else {
        message.error('请先选择店铺')
      }
    }
    importlocksShow = () => {
      const { getFieldValue } = this.props.form
      if (getFieldValue('shopNo') || getFieldValue('forbidSync')) {
        this.setState({
          ImportLocksModalVisiable: true,
          // shopNo: getFieldValue('shopNo'),
        })
      } else {
        message.error('请先选择店铺')
      }
    }
    inputPress = (e) => {
      const { tableDataCopy } = this.state
      if (e.keyCode === 13) {
        if (checkEmpty(e.target.value)) {
          this.setState({
            tableData: tableDataCopy,
          })
        } else {
          this.setState({
            tableData: tableDataCopy.filter(ele => ele.skuNo.indexOf(e.target.value) > -1),
          })
        }
        
      }
    }
    deleteData = (index) => {
      const { tableData } = this.state
      tableData.splice(index, 1)
      this.setState({
        tableData,
        chooseRows: tableData,
        tableDataCopy: tableData,
      })
    }
    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form
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
          title: '操作',
          dataIndex: 'opreation',
          key: 'opreation',
          width: 120,
          render: (text, record, index) => {
            return <a onClick={this.deleteData.bind(this, index)} >删除</a>
          },
        }, {
          title: '商品编码',
          dataIndex: 'skuNo',
          key: 'skuNo',
          width: 120,
        }, {
          title: '商品名称',
          dataIndex: 'productName',
          key: 'productName',
          width: 120,
        }, {
          title: '可用数',
          dataIndex: 'invAvailableNum',
          key: 'invAvailableNum',
          width: 120,
        }, {
          title: '本次锁定数',
          dataIndex: 'nowLock',
          key: 'nowLock',
          width: 120,
        }]
      if (getFieldValue('lockMode') === undefined || getFieldValue('lockMode') === 0) {
        columns.push({
          title: '百分比(%)',
          dataIndex: 'percent',
          key: 'percent',
          width: 120,
          render: (text, record, index) => <Input defaultValue={text ? text : 100} onBlur={this.numChange.bind(this, index)} />,
        })
      } else {
        columns.push({
          title: '指定数量',
          dataIndex: 'specifiedNum',
          key: 'specifiedNum',
          width: 120,
          render: (text, record, index) => <Input defaultValue={text ? text : record.invAvailableNum} onBlur={this.numChange.bind(this, index)} />,
        })
      }
      return (
        <div>
          <Modal
            maskClosable={false}
            title="新增库存锁定单"
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
            {/* <Alert
              message="只有存在库存的数据挑选之后才会返回数据列表"
              type="warning"
              size="small"
            /> */}
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
                      rules: [{
                      required: true, message: '请输入锁定名称',
                      }],
                  })(
                    <Input size={config.InputSize} />
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
                    {getFieldDecorator('shopNo', {
                      rules: [{
                      required: !getFieldValue('forbidSync'), message: '请选店铺',
                      }],
                  })(
                    <Select
                      disabled={!this.state.editable || this.state.shopChoosed && !getFieldValue('forbidSync')}
                      onChange={(e) => { this.setState({ shopChoosed: true, shopNo: e }) }}
                      size={config.InputSize}
                      placeholder="请选择店铺"
                      style={{ marginTop: 4 }}
                    >
                        {this.props.shops.map(e => <Option key={e.shopNo}>{e.shopName}</Option>)}
                    </Select>
                  )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                  >
                    {getFieldDecorator('forbidSync', {
                      initialValue: false,
                      valuePropName: 'checked',
                  })(
                    <Checkbox disabled={!this.state.editable}>禁止同步</Checkbox>
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
                      initialValue: 0,
                  })(
                    <RadioGroup>
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
                        initialValue: false,
                        valuePropName: 'checked',
                    })(
                      <Checkbox>过期解锁</Checkbox>
                    )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem >
                      {getFieldDecorator('expireTime', {
                        rules: [{
                          required: getFieldValue('expireUnlock'),
                          message: '过期时间不能为空',
                        }],
                    })(
                      <DatePicker disabledDate={(e)=>{
                        return moment(e) < moment().subtract(1, 'days')
                      }} format="YYYY-MM-DD" disabled={!getFieldValue('expireUnlock')} size={config.InputSize} placeholder="过期时间" />
                    )}
                    </FormItem>
                  </Col>
                </Col>
              </Row>
            </Form>
            <div className={styles.tableList}>
              <div style={{ marginBottom: 10 }}>
                <Button size={config.InputSize} type="primary" onClick={this.addLockInvBill} >添加商品</Button>
                <Button size={config.InputSize} type="primary" onClick={this.importlocksShow} style={{ marginLeft: 10 }} >导入列表</Button>
                <Alert
                  style={{ width: 300, display: 'inline', marginLeft: 10, paddingTop: 4, paddingBottom: 4 }}
                  message="注: 仅限有库存的商品，最多10000个商品"
                  type="warning"
                  size="small"
                />
                <Select
                  style={{
                    width: 150,
                    float: 'right',
                  }}
                  size={config.InputSize}
                  defaultValue="显示全部"
                  onChange={this.showTableDate.bind(this)}
                >
                  <Option key={0}>显示全部</Option>
                  <Option key={1}>显示锁定数超出</Option>
                  <Option key={2}>显示锁定数未超出</Option>
                </Select>
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
                dataSource={this.state.tableData}
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
            closeChoose={() => {}}
            fromName="combination"
          />
          <ImportLocks
            shopNo={this.state.shopNo}
            dispatch={this.props.dispatch}
            visiable={this.state.ImportLocksModalVisiable}
            hidden={() => { this.setState({ ImportLocksModalVisiable: false }) }}
            importSuc={this.importSuc}
          />
        </div>
      )
    }
}
