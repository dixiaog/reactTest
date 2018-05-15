/*
 * @Author: chengxiang
 * @Date: 2017-12-29 13:52:26
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-19 09:39:27
 */

import React, { Component } from 'react'
import { Modal, Select, Form, Input, Col, Checkbox, Row, notification, Button } from 'antd'
import config from '../../utils/config'
import { Save, GetViewData } from '../../services/base/warehouse'
import AddressCas from '../../components/AddressCas'
import { checkEmpty } from '../../utils/utils'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class WarehouseModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      useCainiao: false,
      warehouse: {},
      isDisabled: true,
      selects: [],
      select: [],
      isCainiaoOpen: 0,
      help: '',
      btnLoading: false,
      caniaoAddrClean: false,
      addrClean: false,
      loading: false,
    }
  }
  componentWillMount() {
    const { warehouse } = this.props
    if (warehouse.warehouseName) {
      this.setState({
        loading: true,
      })
      GetViewData(warehouse).then((wh) => {
        const { setFieldsValue } = this.props.form
        setFieldsValue({
          province: [wh.province, wh.city, wh.county],
        })
        if (wh.enableCainiao && wh.cainiaoProvince) {
          setFieldsValue({
            cainiaoProvince: [wh.cainiaoProvince, wh.cainiaoCity, wh.cainiaoCounty],
          })
        }
        this.setState({
          warehouse: wh,
          inWarehouseName: wh.enableIn === 1,
          returnWarehouseName: wh.enableReturn === 1,
          isCainiaoOpen: wh.enableCainiao ? 1 : 0,
          useCainiao: wh.enableCainiao === 1,
          loading: false,
        })
      })
    }
  }
  onChangeWarehouseInput = (e) => {
    const { setFieldsValue } = this.props.form
    if (this.state.inWarehouseName) {
      if (checkEmpty(e.target.value)) {
        setFieldsValue({ inWarehouseName: '' })
      } else {
        setFieldsValue({ inWarehouseName: `${e.target.value}-进货仓` })
      }
    }
    if (this.state.returnWarehouseName) {
      if (checkEmpty(e.target.value)) {
        setFieldsValue({ returnWarehouseName: '' })
      } else {
        setFieldsValue({ returnWarehouseName: `${e.target.value}-退货仓` })
      }
    }
  }
  setLocationType = () => {
    this.props.setLocationType()
  }
  setLocationType1 = () => {
    this.props.setLocationType1()
  }
  
  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
    this.setState({
      warehouse: {},
      btnLoading: false,
      addrClean: true,
      caniaoAddrClean: true,
      select: [],
      selects: [],
    })
  }
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          btnLoading: true,
        })
        Object.assign(values, {
          warehouseNo: this.props.warehouse.warehouseNo,
          cainiaoProvince: this.state.selects,
          enableCainiao: this.state.isCainiaoOpen,
          enableIn: this.state.inWarehouseName ? 1 : 0,
          enableReturn: this.state.returnWarehouseName ? 1 : 0,
          province: this.state.select })
        Save(values)
          .then((json) => {
            if (json !== null) {
              if (typeof json === 'number' && json !== -1) {
                notification.success({
                  message: '仓库保存成功',
                })
                const { dispatch } = this.props
                this.props.setWarehouseInfo(json)
                dispatch({
                  type: 'warehouse/search',
                })
                this.setState({
                  isDisabled: false,
                })
              }
            }
          })
          .then(() => {
            this.setState({
              btnLoading: false,
            })
          })
      }
    })
  }
  checkMobile = (rulr, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入联系人电话',
      })
      callback('error')
    } else if (value.substring(0, 1) === '1') {
      const isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/
      if (!isMobile.exec(value) && value.length !== 11) {
        this.setState({
          help: '请输入正确的手机号',
        })
        callback('error')
      } else {
        this.setState({
          help: '',
        })
        callback()
      }
    } else if (value.substring(0, 1) === '0') {
      const isPhone = /^(?:(?:0\d{2,4})-)?(?:\d{7,8})(-(?:\d{3,}))?$/
      if (!isPhone.test(value)) {
        this.setState({
          help: '请输入正确的电话号码',
        })
        callback('error')
      } else {
        this.setState({
          help: '',
        })
        callback()
      }
    } else {
      this.setState({
        help: '请输入正确的联系方式',
      })
      callback('error')
    }
  }
  addrSelect = (selectedOptions) => {
    const { setFieldsValue } = this.props.form
    // if (selectedOptions[0]) {
      setFieldsValue({
        province: selectedOptions,
      })
      this.setState({
        select: selectedOptions,
      })
    // }
  }
  addrSelectCainiao = (selectedOptions) => {
    const { setFieldsValue } = this.props.form
    if (selectedOptions[0]) {
      setFieldsValue({
        cainiaoProvince: selectedOptions,
      })
      this.setState({
        selects: selectedOptions,
      })
    }
  }
  checkHave = (rulr, value, callback) => {
    if (value && value.length) {
      callback()
    } else {
      callback('请选择地址')
    }
  }
  // var mobile = $.trim($("#ContactNumber").val())
  render() {
    const { getFieldDecorator, getFieldValue, resetFields, setFieldsValue } = this.props.form
    const {
      warehouseName,
      contacts,
      mobileNo,
      town,
      address,
      warehouseType,
      retailWarehouseName,
      entiretyWarehouseName,
      inWarehouseName,
      returnWarehouseName,
      deliveryWarehouseName,
      defectiveWarehouseName,
      problemWarehouseName,
      cainiaoAddress,
      cainiaoProvince,
      cainiaoCity,
      cainiaoCounty,
    } = this.state.warehouse
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 9 },
      },
    }
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 18 },
      },
    }
    const onChange = (e) => {
      if (!e.target.checked) {
        resetFields('cainiaoAddress')
        resetFields('cainiaoProvince')
      }
      this.setState({
        useCainiao: e.target.checked,
      })
      if (e.target.checked) {
        this.setState({
          isCainiaoOpen: 1,
        })
      } else {
        const cainiaoAddr = getFieldValue('cainiaoAddress')
        resetFields(['cainiaoAddress'])
        setFieldsValue({ cainiaoAddress: cainiaoAddr })
        this.setState({
          isCainiaoOpen: 0,
        })
      }
    }
    const onChangeCainiaoAddress = () => {
      const cainiaoAddressVal = getFieldValue('cainiaoAddress')
        resetFields(['cainiaoAddress'])
        setFieldsValue({ cainiaoAddress: cainiaoAddressVal })
    }

    const onChangeInWarehouse = (e) => {
      this.setState({
        inWarehouseName: e.target.checked,
      })
      const inWarehouseNames = getFieldValue('inWarehouseName')
      resetFields(['inWarehouseName'])
      if (!e.target.checked) {
        setFieldsValue({ inWarehouseName: '' })
      } else {
        if (checkEmpty(inWarehouseNames) && !checkEmpty(getFieldValue('warehouseName'))) {
          setFieldsValue({ inWarehouseName: `${getFieldValue('warehouseName')}-进货仓` })
        }
      }
    }
    const onChangeReturnWarehouse = (e) => {
      this.setState({
        returnWarehouseName: e.target.checked,
      })
      const returnWarehouseNames = getFieldValue('returnWarehouseName')
      resetFields(['returnWarehouseName'])
      if (!e.target.checked) {
        setFieldsValue({ returnWarehouseName: '' })
      } else {
        if (checkEmpty(returnWarehouseNames) && !checkEmpty(getFieldValue('warehouseName'))) {
          setFieldsValue({ returnWarehouseName: `${getFieldValue('warehouseName')}-退货仓` })
        }
      }
    }
    return (
      <div>
        <Modal
          maskClosable={false}
          loading={this.state.loading}
          title={warehouseName ? '编辑仓库' : '新增仓库'}
          visible={this.props.itemModalVisiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          width="800px"
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={this.state.btnLoading} onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="仓库负责人">
              {getFieldDecorator('contacts', {
                initialValue: contacts,
                rules: [
                  {
                    required: true,
                    message: '请输入仓库负责人',
                  },
                ],
              })(<Input size={config.InputSize} />)}
            </FormItem>
            <FormItem help={this.state.help} {...formItemLayout} label="联系人电话">
              {getFieldDecorator('mobileNo', {
                initialValue: mobileNo,
                rules: [
                  {
                    required: true,
                    message: '请输入联系人电话',
                    validator: this.checkMobile,
                  },
                ],
              })(<Input size={config.InputSize} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="仓库地址">
              {getFieldDecorator('province', {
                  rules: [
                    {
                      required: true,
                      validator: this.checkHave,
                      message: '请选择仓库地址',
                    },
                  ],
                })(<AddressCas doClean={this.state.addrClean} addrSelect={this.addrSelect} wh={this.state.warehouse} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="街道地址">
              {getFieldDecorator('town', {
                initialValue: town,
                rules: [
                  {
                    required: true,
                    message: '请输入街道地址',
                  },
                ],
              })(<Input size={config.InputSize} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址">
              {getFieldDecorator('address', {
                initialValue: address,
                rules: [
                  {
                    required: true,
                    message: '请输入详细地址',
                  },
                ],
              })(<Input size={config.InputSize} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="仓库名称">
              {getFieldDecorator('warehouseName', {
                initialValue: warehouseName,
                rules: [
                  {
                    required: true,
                    message: '请输入仓库名称',
                  },
                ],
              })(<Input size={config.InputSize} onChange={this.onChangeWarehouseInput.bind(this)} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="仓库类型">
              {getFieldDecorator('warehouseType', {
                initialValue: warehouseType,
                rules: [
                  {
                    required: true,
                    message: '请选择仓库类型',
                  },
                ],
              })(
                <Select placeholder="仓库类型" size="small" style={{ marginTop: 4 }}>
                  <Option value={0}>主仓库</Option>
                  <Option value={1}>分仓</Option>
                  <Option value={2}>第三方仓</Option>
                </Select>
              )}
            </FormItem>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout1} label="零售仓库名称">
                  {getFieldDecorator('retailWarehouseName', {
                    initialValue: getFieldValue('warehouseName') === warehouseName ? retailWarehouseName : (getFieldValue('warehouseName') ? `${getFieldValue('warehouseName')}-零售仓` : ''),
                    rules: [
                      {
                        required: true,
                        message: '请输入零售仓库名称',
                      },
                    ],
                  })(<Input size={config.InputSize} />)}
                </FormItem>
              </Col>
              <Col span={1}>
                <div />
              </Col>
              <Col span={6}>
                <Button style={{ marginTop: '3.5px' }} type="primary" size="small" disabled={this.state.isDisabled && warehouseName === undefined} onClick={this.setLocationType.bind(this)}>
                  设定零售仓位
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout1} label="整存仓库名称">
                  {getFieldDecorator('entiretyWarehouseName', {
                    initialValue: getFieldValue('warehouseName') === warehouseName ? entiretyWarehouseName : (getFieldValue('warehouseName') ? `${getFieldValue('warehouseName')}-整存仓` : ''),
                    rules: [
                      {
                        required: true,
                        message: '请输入整存仓库名称',
                      },
                    ],
                  })(<Input size={config.InputSize} />)}
                </FormItem>
              </Col>
              <Col span={1}>
                <div />
              </Col>
              <Col span={6}>
                <Button style={{ marginTop: '3.5px' }} type="primary" size="small" disabled={this.state.isDisabled && warehouseName === undefined} onClick={this.setLocationType1.bind(this)}>
                  设定整存仓位
                </Button>
                {/* <Button style={{ marginTop: '7px', color: '#2F9BE9' }}>设定整存仓位</Button> */}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout1} label="进货仓库名称">
                  {getFieldDecorator('inWarehouseName', {
                    initialValue: inWarehouseName,
                      // (getFieldValue('warehouseName') === warehouseName ?
                      //   inWarehouseName : (getFieldValue('warehouseName') ? `${getFieldValue('warehouseName')}-进货仓` : '')
                      // ),
                    rules: this.state.inWarehouseName
                      ? [
                          {
                            required: true,
                            message: '请输入进货仓库名称',
                          },
                        ]
                      : [],
                  })(<Input size={config.InputSize} />)}
                </FormItem>
              </Col>
              <Col span={1}>
                <div />
              </Col>
              <Col span={6}>
                <Checkbox style={{ marginTop: '7px' }} checked={this.state.inWarehouseName} onChange={onChangeInWarehouse}>
                  启用进货仓库
                </Checkbox>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout1} label="退货仓库名称">
                  {getFieldDecorator('returnWarehouseName', {
                    initialValue: returnWarehouseName,
                    // this.state.returnWarehouseName ?
                    // (getFieldValue('warehouseName') === warehouseName ? returnWarehouseName : (getFieldValue('warehouseName') ? `${getFieldValue('warehouseName')}-退货仓` : '')) : '',
                    rules: this.state.returnWarehouseName
                      ? [
                          {
                            required: true,
                            message: '请输入退货仓库名称',
                          },
                        ]
                      : [],
                  })(<Input size={config.InputSize} />)}
                </FormItem>
              </Col>
              <Col span={1}>
                <div />
              </Col>
              <Col span={6}>
                <Checkbox style={{ marginTop: '7px' }} checked={this.state.returnWarehouseName} onChange={onChangeReturnWarehouse}>
                  启用退货仓库
                </Checkbox>
              </Col>
            </Row>

            <FormItem {...formItemLayout} label="发货仓库名称">
              {getFieldDecorator('deliveryWarehouseName', {
                initialValue: getFieldValue('warehouseName') === warehouseName ? deliveryWarehouseName : (getFieldValue('warehouseName') ? `${getFieldValue('warehouseName')}-发货仓` : ''),
                rules: [
                  {
                    required: true,
                    message: '请输入发货仓库名称',
                  },
                ],
              })(<Input size={config.InputSize} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="残次仓库名称">
              {getFieldDecorator('defectiveWarehouseName', {
                initialValue: getFieldValue('warehouseName') === warehouseName ? defectiveWarehouseName : (getFieldValue('warehouseName') ? `${getFieldValue('warehouseName')}-残次仓` : ''),
                rules: [
                  {
                    required: true,
                    message: '请输入残次仓库名称',
                  },
                ],
              })(<Input size={config.InputSize} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="疑难件仓名称">
              {getFieldDecorator('problemWarehouseName', {
                initialValue: getFieldValue('warehouseName') === warehouseName ? problemWarehouseName : (getFieldValue('warehouseName') ? `${getFieldValue('warehouseName')}-疑难件仓` : ''),
                rules: [
                  {
                    required: true,
                    message: '请输入疑难件仓名称',
                  },
                ],
              })(<Input size={config.InputSize} />)}
            </FormItem>
            <Checkbox checked={this.state.isCainiaoOpen === 1} style={{ marginLeft: '30px', marginTop: '15px' }} onChange={onChange}>
              启用菜鸟
            </Checkbox>
            <FormItem {...formItemLayout} label="仓库地址">
              {getFieldDecorator('cainiaoProvince', {
                  rules: this.state.useCainiao
                    ? [
                        {
                          required: true, message: '请输入菜鸟仓库地址',
                        },
                      ]
                    : [],
                })(<AddressCas
                  doClean={this.state.caniaoAddrClean}
                  addrSelect={this.addrSelectCainiao.bind(this)}
                  wh={{
                    province: cainiaoProvince,
                    city: cainiaoCity,
                    county: cainiaoCounty,
                  }}
                />)}
            </FormItem>
            <FormItem {...formItemLayout} label="菜鸟地址">
              {getFieldDecorator('cainiaoAddress', {
                initialValue: cainiaoAddress,
                rules: this.state.useCainiao
                  ? [
                      {
                        required: true, message: '请输入菜鸟地址',
                      },
                    ]
                  : [],
              })(<Input size={config.InputSize} onChange={onChangeCainiaoAddress} />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
