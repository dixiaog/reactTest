import React, { Component } from 'react'
import { connect } from 'dva'
import pinyin from 'tiny-pinyin'
import { Modal, Button, Form, Input, Select, Checkbox, message } from 'antd'
import { selectAllClassify, editsave, save } from '../../../services/supplier/supplier'
import MaintenanceClassification from './MaintenanceClassification' // 维护分类

const FormItem = Form.Item
const Option = Select.Option


@connect(state => ({
  supplier: state.supplier,
}))
@Form.create()
export default class SupplierInformation extends Component {
    state = {
        loading: false,
        Editrecord: {},
        data: {},
        typeName: [],
        typeNameclass: [],
        enableStatus: true,
        classifyName: null,
        classifyNo: null,
        acronyms: null,
        MaintenanceClassificationvisble: false,
        distributorName: '请输入供应商名',
        }
componentWillMount() {
  if (this.props.supperlierInformation.supperlierIn) {
    this.setState({
      loading: false,
  })
  } else {
    this.setState({
      loading: false,
      data: this.props.supperlierInformation.Editrecord,
      Editrecord: this.props.supperlierInformation.Editrecord,
      enableStatus: (this.props.supperlierInformation.Editrecord.enableStatus === 1) ? true : false,
      classifyName: this.props.supperlierInformation.Editrecord.classifyName,
      classifyNo: this.props.supperlierInformation.Editrecord.classifyNo,
  })
  }
}
checkDistributorName = (rule, value, callback) => {
  const data = value ? value.split('') : []
  const newData = []
  const ArrayT = []
  if (data.length) {
    data.forEach((ele) => {
      if (pinyin.isSupported()) {
        newData.push(pinyin.convertToPinyin(ele))
      }
    })
    newData.forEach((ele, index) => {
      if (index < 20) {
        ArrayT.push(ele.charAt(0))
      }
    })
    const datas = this.state.data
    datas.acronyms = ArrayT.join('')
    this.setState({
      data: datas,
    })
  } else {
    const datas = this.state.data
    datas.acronyms = ArrayT.join('')
    this.setState({
      data: datas,
    })
  }
  if (!value) {
    this.setState({
      acronyms: '请输入名称',
    })
    callback()
  } else if (value.indexOf(' ') !== -1) {
    this.setState({
      acronyms: '名称不允许输入空格',
    })
    callback()
  } else {
    this.setState({
      acronyms: '',
    })
    callback()
  }
}

    handleSubmit = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            loading: true,
          })
          const payload = Object.assign({
            supplierNo: null,
            // acronyms: (values.acronyms === undefined) ? null : (values.acronyms === '') ? null : values.acronyms,
            // address: (values.address === undefined) ? null : (values.address === '') ? null : values.address,
            // alitmNo: (values.alitmNo === undefined) ? null : (values.alitmNo === '') ? null : values.alitmNo,
            // bankName: (values.bankName === undefined) ? null : (values.bankName === '') ? null : values.bankName,
            // bankAccount: (values.bankAccount === undefined) ? null : (values.bankAccount === '') ? null : values.bankAccount,
            // classifyName: this.state.classifyName,
            // classifyNo: this.state.classifyNo,
            // contacts: (values.contacts === undefined) ? null : (values.contacts === '') ? null : values.contacts,
            // enableStatus: (this.state.enableStatus) ? 1 : 0,
            // faxNo: (values.faxNo === undefined) ? null : (values.faxNo === '') ? null : values.faxNo,
            // mobileNo: (values.mobileNo === undefined) ? null : (values.mobileNo === '') ? null : values.mobileNo,
            // remark: (values.remark === undefined) ? null : (values.remark === '') ? null : values.remark,
            // supplierName: (values.supplierName === undefined) ? null : (values.supplierName === '') ? null : values.supplierName,
            // telNo: (values.telNo === undefined) ? null : (values.telNo === '') ? null : values.telNo,
            acronyms: values.acronyms,
            address: values.address,
            alitmNo: values.alitmNo,
            bankName: values.bankName,
            bankAccount: values.bankAccount,
            classifyName: this.state.classifyName,
            classifyNo: this.state.classifyNo,
            contacts: values.contacts,
            enableStatus: (this.state.enableStatus) ? 1 : 0,
            faxNo: values.faxNo,
            mobileNo: values.mobileNo,
            remark: values.remark,
            supplierName: values.supplierName,
            telNo: values.telNo,
          })
          //  supperlierIn true 添加 false 更新
          if (this.props.supperlierInformation.supperlierIn) {
            save({
              ...payload,
            }).then((json) => {
              this.props.dispatch({
                type: 'supplier/fetch',
              })
              if (json) {
                this.setState({
                  loading: false,
                  Editrecord: {},
              })
                this.props.supperlierInformation.editImport()
                message.success('供应商信息添加成功')
              } else {
                this.setState({
                  loading: false,
                })
                console.log('供应商信息添加失败')
              }
            })
          } else {
            payload.supplierNo = this.state.Editrecord.supplierNo
            editsave({
              ...payload,
            }).then((json) => {
             if (json) {
              this.setState({
                loading: false,
                Editrecord: {},
            })
              this.props.supperlierInformation.editImport()
              message.success('供应商信息更新成功')
              } else {
                this.setState({
                  loading: false,
                })
                // console.log('供应商信息更新失败')
              }
            })
          }
        }
      })
      }
    // 确定的回调函数
    handleOk = () => {
      this.handleSubmit()
    }
    // 取消的回调函数
    handleCancel = () => {
      this.props.form.resetFields()
    // 在这里设置state的出事状态
    this.setState({
      visible: false,
      Maindata: {},
      Editrecord: {},
    })
    this.props.supperlierInformation.editImporttwo()
    }
    // 校验开户银行
    validatorBankName = (rule, value, callback) => {
      if (value === undefined) {
          callback()
      } else {
          if (value.length === 0) {
              callback()
          } else {
              const patt = new RegExp('银行')
              if (patt.test(value)) {
                  if (String(value).length < 100) {
                    callback()
                  } else {
                    callback('请输入合法的银行')
                  }
              } else {
                callback('请输入开户银行!')
              }
          }
      }
    }
    // 校验传真 validatorfaxNo
    validatorfaxNo = (rule, value, callback) => {
      if (value === undefined) {
          callback()
      } else {
          if (value.length === 0) {
              callback()
          } else {
              if (/^(\d{3,4}-)?\d{7,8}$/.test(value)) {
                  callback()
              } else {
                callback('请输入正确的格式!')
              }
          }
      }
    }
    //  校验手机
    validatorMobileNo = (rule, value, callback) => {
      if (value === undefined) {
          callback()
      } else {
          if (value.length === 0) {
              callback()
          } else {
              if (/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
                  callback()
              } else {
                callback('请输入正确的11为手机号码！')
              }
          }
      }
    }
    // 校验电话
    validatorTelNo = (rule, value, callback) => {
      if (value === undefined) {
          callback()
      } else {
          if (value.length === 0) {
              callback()
          } else {
              if (/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(value)) {
                  callback()
              } else {
                callback('请输入正确的格式0XXX-XXXXXXXX！')
              }
          }
      }
    }
    validatorbankAccount = (rule, value, callback) => {
      if (value === undefined) {
       callback()
      } else {
        if (value.length === 0) {
          callback()
        } else {
          if (/^([1-9]{1})(\d{14}|\d{18}|\d{16})$/.test(value)) {
            callback()
          } else {
            callback('请输入正确的银行卡号！')
          }
        }
      }
    }
    TypeNoms = () => {
      const payload = Object.assign({
        dictType: 2,
      })
      selectAllClassify({
        ...payload,
      }).then((json) => {
       this.setState({
        typeName: json,
       })
      })
    }
    handleonChange = (value, option) => {
      // 获取text的值
      this.setState({
        classifyName: option.props.children,
        classifyNo: value,
      })
    }
    // {/* 启用状态(0:不启用; 1:启用) */}
    handelenableStatus = (e) => {
      this.setState({
        enableStatus: e.target.checked,
      })
    }
    //  定义函数接受维护分类传过来的值
    Maintenancedata = (data) => {
      this.setState({
        Maindata: data,
        typeNameclass: {},
      })
    }
    //  定义维护分类初始值
MaintenanceClassend = () => {
  this.props.form.resetFields('classifyName')
  this.setState({
    MaintenanceClassificationvisble: false,
    Maintext: '',
    classifyName: null,
    classifyNo: null,
    typeName: [],
  })
}
MaintenanceClassends = () => {
  this.setState({
    MaintenanceClassificationvisble: false,
    Maintext: '',
  })
}
    // 维护分类函数
  MaintenanceClass =() => {
    const payload = Object.assign({
      dictType: 2,
    })
    selectAllClassify({
      ...payload,
    }).then((json) => {
      let data = ''
      for (let i = 0; i < json.length; i++) {
        if (i === 0) {
          data = `${json[i].itemName}`
        } else {
          data = `${data},${json[i].itemName}`
        }
      }
      this.setState({
      Maintext: data,
      MaintenanceClassificationvisble: true,
     })
    })
  }
  render() {
      const { getFieldDecorator } = this.props.form
      const Booler = this.props.supperlierInformation.supperlierIn
      const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
            md: { span: 9 },
          },
        }
        const autoNotypeName = this.state.typeName.map((k) => {
          return (
            <Option value={k.autoNo}>{k.itemName}</Option>
           )
        })
        const data = {
          MaintenanceClassificationvisble: this.state.MaintenanceClassificationvisble,
          Maintenancedata: this.Maintenancedata,
          typeName: this.state.typeNameclass,
          MaintenanceClassend: this.MaintenanceClassend,
          MaintenanceClassends: this.MaintenanceClassends,
          Maintext: this.state.Maintext,
        }
      return (
        <Modal
          title="添加(编辑)供应商信息"
          visible={this.props.supperlierInformation.supperlierInformationvisble}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
          confirmLoading={this.state.loading}
          zIndex={50}
        >
          <Form onSubmit={this.handleSubmit} >
            <FormItem
              label="供应商名"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {/* message: '请输入供应商名称!', */}
              {getFieldDecorator('supplierName', {
              initialValue: (Booler) ? '' : this.state.data.supplierName,
                rules: [{
                    required: true,
                    message: '请输入供应商名称',
                    max: 50,
                    whitespace: true,
                    }, {
                      validator: this.checkDistributorName,
                    }],
                })(
                  <Input placeholder={this.state.distributorName} size="small" />
                )}
            </FormItem>
            <FormItem
              label="助记符"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('acronyms', {
              initialValue: (Booler) ? '' : this.state.data.acronyms,
              rules: [{
                  max: 20,
                  message: '请输入1-20以内的的字符!',
                  }],
              })(
                <Input size="small" />
              )}
            </FormItem>
            <FormItem
              label="供应商分类"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('classifyName', {
              initialValue: (Booler) ? '' : this.state.classifyName,
              })(
                <Select
                  // labelInValue
                  size="small"
                  style={{ width: 163 }}
                  onFocus={this.TypeNoms.bind(this)}
                  onSelect={this.handleonChange}
                >
                  {autoNotypeName}
                </Select>
              )}
              <Button size="small" style={{ marginLeft: 5 }} onClick={this.MaintenanceClass}>
                  维护分类
              </Button>
            </FormItem>
            <FormItem
              label="负责人(联系人)"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('contacts', {
              initialValue: (Booler) ? '' : this.state.data.contacts,
              rules: [{
                  max: 50,
                  message: '请输入1-50以内的的字符!',
                  }],
              })(
                <Input size="small" />
              )}
            </FormItem>
            <FormItem
              label="联系地址"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {/* message: '请输入1-200以内的的字符!', */}
              {getFieldDecorator('address', {
              initialValue: (Booler) ? '' : this.state.data.address,
              rules: [{
                  max: 200,
                  message: '请输入1-200以内的的字符!',
                  }],
              })(
                <Input size="small" />
              )}
            </FormItem>
            <FormItem
              label="电话"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {/* message: '请输入1-25以内的的字符!', */}
              {getFieldDecorator('telNo', {
              initialValue: (Booler) ? '' : this.state.data.telNo,
              rules: [{
                  max: 25,
                  validator: this.validatorTelNo,
                  }],
              })(
                <Input size="small" />
              )}
            </FormItem>
            <FormItem
              label="手机"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {/* message: '请输入1-25以内的的字符!', */}
              {getFieldDecorator('mobileNo', {
              initialValue: (Booler) ? '' : this.state.data.mobileNo,
              rules: [{
                  max: 25,
                  validator: this.validatorMobileNo,
                  }],
              })(
                <Input size="small" />
              )}
            </FormItem>
            <FormItem
              label="旺旺号"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('alitmNo', {
              initialValue: (Booler) ? '' : this.state.data.alitmNo,
              rules: [{
                  message: '请输入1-25以内的的字符!',
                  max: 25,
                  }],
              })(
                <Input size="small" />
              )}
            </FormItem>
            <FormItem
              label="传真"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {/* message: '请输入1-25以内的的字符!', */}
              {getFieldDecorator('faxNo', {
              initialValue: (Booler) ? '' : this.state.data.faxNo,
              rules: [{
                  max: 25,
                  validator: this.validatorfaxNo,
                  }],
              })(
                <Input size="small" />
              )}
            </FormItem>
            <FormItem
              label="开户银行"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {/* message: '请输入1-25以内的的字符!', */}
              {getFieldDecorator('bankName', {
              initialValue: (Booler) ? '' : this.state.data.bankName,
              rules: [{
                  max: 25,
                  validator: this.validatorBankName,
                  }],
              })(
                <Input size="small" />
              )}
            </FormItem>
            <FormItem
              label="银行账号"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {/* message: '请输入1-25以内的的字符!', */}
              {getFieldDecorator('bankAccount', {
              initialValue: (Booler) ? '' : this.state.data.bankAccount,
              rules: [{
                  validator: this.validatorbankAccount,
                  }],
              })(
                <Input size="small" />
              )}
            </FormItem>
            <FormItem
              label="备注"
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('remark', {
              initialValue: (Booler) ? '' : this.state.data.remark,
              rules: [{
                  message: '请输入1-25以内的的字符!',
                  max: 25,
                  }],
              })(
                <Input size="small" />
              )}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              {...formItemLayout}
              wrapperCol={{ span: 12 }}
            >
              {/* 启用状态(0:不启用; 1:启用) */}
              {getFieldDecorator('enableStatus')(
                <Checkbox
                  style={{ marginLeft: 100 }}
                  // this.props.supperlierInformation.supperlierIn
                  checked={this.state.enableStatus}
                  // checked={(this.props.supperlierInformation.supperlierIn) ? !this.state.enableStatus : this.state.enableStatus}
                  onChange={this.handelenableStatus}
                >启用
                </Checkbox>
              )}
            </FormItem>
          </Form>
          {this.state.MaintenanceClassificationvisble ? <MaintenanceClassification data={data} /> : null}
        </Modal>
        )
    }
}
