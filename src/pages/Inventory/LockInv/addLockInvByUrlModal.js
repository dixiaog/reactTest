/*
 * @Author: chenjie
 * @Date: 2017-12-08 18:04:11
 * @Last Modified by: chenjie
 * 新增库存锁定单（按链接）
 * @Last Modified time: 2018-05-14 15:39:29
 */
import React, { Component } from 'react'
import { Modal, Form, Input, Select, Row, Col, Radio, Checkbox, Table, DatePicker, Button, message, Alert } from 'antd'
import moment from 'moment'
import styles from '../Inventory.less'
import config from '../../../utils/config'
import ChooseItem from '../../../components/ChooseItem'
import ImportLocks from './importLocks'
import { floatCheck, checkNumber } from '../../../utils/utils'
import { getSkuInfoByShopUrl, addLockInventoryByUrl } from '../../../services/inventory/lockInv'

const FormItem = Form.Item
const { Option } = Select
const RadioGroup = Radio.Group

@Form.create()
export default class addLockInvByUrlModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          chooseItemVisiable: false,
          ImportLocksModalVisiable: false,
          skuTableData: [],
          shopTableData: [],
          chooseRows: [],
          shopNo: 0,
          submitLoading: false,
          tableLoading: false,
          shopChoosed: false,
          needLock: [],
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
      if (this.state.shopTableData.length === 0) {
        message.error('请先添加要锁定库存的商品')
        return false
      }
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.setState({
            submitLoading: true,
          })
          const shop = this.props.shops.filter(e => e.shopNo * 1 === values.shopNo * 1)
          addLockInventoryByUrl(Object.assign(values, {
            lockName: values.lockName.trim(),
            shopName: shop.length ? shop[0].shopName : '',
            shopNo: values.shopNo ? values.shopNo : 0,
            expireUnlock: values.expireUnlock ? 1 : 0,
            forbidSync: 0,
          }, expireUnlock ? { expireTime: moment(values.expireTime).format('YYYY-MM-DD HH:mm:ss') } :{},{ lockInventoryList: this.state.needLock }))
          .then((json) => {
            if (json !== null) {
              this.setState({
                submitLoading: false,
                shopTableData: [],
                skuTableData: [],
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
      getSkuInfoByShopUrl({
        skuNoList: rows.map(e => e.skuNo),
        shopNo: this.state.shopNo,
      }).then((json) => {
        const skuTableData = []
        const shopTableData = []
        if (json.shopSkuList && json.shopSkuList.length === 0) {
          message.info('该店铺不存在所选商品的库存')
        }
        json.skuList && json.skuList.length && json.skuList.forEach((e) => {
          skuTableData.push({
            skuNo: e.skuNo,
            productName: e.productName,
            invAvailableNum: e.invAvailableNum,
          })
        })
        json.shopSkuList && json.shopSkuList.length && json.shopSkuList.forEach((e) => {
          const num = skuTableData.filter(k => k.skuNo === e.skuNo)[0].invAvailableNum
          shopTableData.push({
            skuNo: e.skuNo,
            shopName: e.shopName,
            shopSkuNo: e.shopSkuNo,
            skuShopUrl: e.skuShopUrl,
            productName: e.productName,
            invAvailableNum: num,
            percent: 100,
            specifiedNum: num,
            lockNum: num,
          })
        })
        this.setState({
          skuTableData,
          shopTableData,
          chooseRows: skuTableData,
          tableLoading: false,
        })
      })
    }
    numChange = (index, val) => {
      const { getFieldValue } = this.props.form
      const { shopTableData } = this.state
      if (getFieldValue('lockMode') === 0) {
        if (!floatCheck(val.target.value) || val.target.value <= 0) {
          message.error('错误的百分比格式')
          Object.assign(shopTableData[index], {
            percent: 100,
            lockNum: shopTableData[index].invAvailableNum,
          })
        } else {
          Object.assign(shopTableData[index], {
            percent: val.target.value,
            lockNum: Math.ceil((shopTableData[index].invAvailableNum * val.target.value) / 100),
          })
        }
      } else {
        if (!checkNumber(val.target.value) || val.target.value * 1 <= 0) {
          message.error('数量值运行正整数')
          Object.assign(shopTableData[index], {
            specifiedNum: shopTableData[index].invAvailableNum,
            lockNum: shopTableData[index].invAvailableNum,
          })
        } else {
          Object.assign(shopTableData[index], {
            specifiedNum: val.target.value,
            lockNum: val.target.value,
          })
        }
      }
    }
    importlocksShow = () => {
      const { getFieldValue } = this.props.form
      if (getFieldValue('shopNo')) {
        this.setState({
          ImportLocksModalVisiable: true,
          // shopNo: getFieldValue('shopNo'),
        })
      } else {
        message.error('请先选择店铺')
      }
    }
    importSuc = (json) => {
      const skuTableData = []
      const shopTableData = []
      json.skuList && json.skuList.length && json.skuList.forEach((e) => {
        skuTableData.push({
          skuNo: e.skuNo,
          productName: e.productName,
          invAvailableNum: e.invAvailableNum,
        })
      })
      json.shopSkuList && json.shopSkuList.length && json.shopSkuList.forEach((e) => {
        const num = skuTableData.filter(k => k.skuNo === e.skuNo)[0].invAvailableNum
        shopTableData.push({
          skuNo: e.skuNo,
          shopName: e.shopName,
          shopSkuNo: e.shopSkuNo,
          skuShopUrl: e.skuShopUrl,
          productName: e.productName,
          nowLock: e.lockNum ? e.lockNum : num,
          percent: e.lockNum ? Math.ceil(e.lockNum/num * 100) : 100,
          specifiedNum: e.lockNum ? e.lockNum : num,
          lockNum: e.lockNum ? e.lockNum : num,
        })
      })
      this.setState({
        skuTableData,
        shopTableData,
        chooseRows: skuTableData,
        tableLoading: false,
      })
    }
    addLockInvBill = () => {
      const { getFieldValue } = this.props.form
      if (getFieldValue('shopNo')) {
        this.setState({
          chooseItemVisiable: true,
          shopNo: getFieldValue('shopNo'),
        })
      } else {
        message.error('请先选择店铺')
      }
    }
    deleteData = (index) => {
      const { skuTableData, shopTableData } = this.state
      const shopTableDataNew = shopTableData.filter(e => e.skuNo !== skuTableData[index].skuNo)
      skuTableData.splice(index, 1)
      this.setState({
        skuTableData,
        chooseRows: skuTableData,
        shopTableData: shopTableDataNew,
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
        const skuColumns = [{
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
        }]
        const columns = [{
          title: '商品编码',
          dataIndex: 'skuNo',
          key: 'skuNo',
          width: 120,
        }, {
          title: '店铺名称',
          dataIndex: 'shopName',
          key: 'shopName',
          width: 120,
        },{
          title: '平台商品编码',
          dataIndex: 'shopSkuNo',
          key: 'shopSkuNo',
          width: 120,
        },{
          title: '线上链接',
          dataIndex: 'skuShopUrl',
          key: 'skuShopUrl',
          width: 120,
          render: text => <a href={text}>{text}</a>,
        }, {
          title: '可用数',
          dataIndex: 'invAvailableNum',
          key: 'invAvailableNum',
          width: 120,
        },
        // ,{
        //   title: '本次锁定数',
        //   dataIndex: 'nowLock',
        //   key: 'nowLock',
        //   width: 120,
        // }
      ]
      if (getFieldValue('lockMode') === 0) {
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
            title="新增库存锁定单(按链接)"
            visible={this.props.visiable}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={1200}
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
              <Row>
                <Col span={8}>
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
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="锁定店铺"
                  >
                    {getFieldDecorator('shopNo', {
                      rules: [{
                      required: true, message: '请选店铺',
                      }],
                  })(
                    <Select
                      disabled={this.state.shopChoosed}
                      onChange={(e) => { this.setState({ shopChoosed: true, shopNo: e }) }}
                      size={config.InputSize}
                      placeholder="请选择店铺"
                      style={{ marginTop: 4 }}>
                      {this.props.shops.map(e => <Option key={e.shopNo}>{e.shopName}</Option>)}
                    </Select>
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
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
                <Col span={6}>
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
            <Row>
              <Col span={11}>
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
                  </div>
                  <Table
                    size="middle"
                    pagination={false}
                    columns={skuColumns}
                    dataSource={this.state.skuTableData}
                    rowKey={record => record.skuNo}
                    loading={this.state.tableLoading}
                  />
                </div>
              </Col>
              <Col span={12} offset={1}>
                <div className={styles.tableList}>
                  <div style={{ marginBottom: 10, height: 25 }}>
                    <Alert
                      style={{ width: 300, display: 'inline', marginLeft: 10, paddingTop: 4, paddingBottom: 4 }}
                      message="注: 选中栏位按额度锁定库存，未选中则不锁定库存"
                      type="warning"
                      size="small"
                    />
                  </div>
                  <Table
                    rowSelection={{
                      type: 'checkbox',
                      onSelect: (record, selected, selectedRows) => {
                        this.setState({
                          needLock: selectedRows,
                        })
                      },
                    }}
                    size="middle"
                    pagination={false}
                    columns={columns}
                    dataSource={this.state.shopTableData}
                    rowKey={record => record.skuNo}
                    loading={this.state.tableLoading}
                  />
                </div>
              </Col>
            </Row>
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
            byUrl
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
