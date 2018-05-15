/*
 * @Author: tanmengjia
 * @Date: 2017-12-27 09:26:43
 * @Last Modified by: tanmengjia
 * 创建组合商品
 * @Last Modified time: 2018-05-10 16:29:06
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import update from 'immutability-helper'
import numeral from 'numeral'
import { Modal, Form, Input, Col, Button, Avatar, Table, Alert, Popconfirm, Row, notification, message } from 'antd'
import config from '../../../utils/config'
import styles from '../Item.less'
import ChooseItem from '../../../components/ChooseItem/index'
// import EditableCell from './EditableCell'
import { Save, getCombinationDelete, saveSkus } from '../../../services/capacity'

const FormItem = Form.Item
const EditableCell = ({ editable, value, onChange }) => {
  return (
    <div>
      {editable
        ? <Input maxLength="8" defaultValue={value} style={{ margin: '-5px 0' }} onChange={e => onChange(e.target.value)} />
        : value
      }
    </div>
  )
}

@connect(state => ({
    combinationItemModal: state.combinationItemModal,
    combinationItem: state.combinationItem,
    chooseItem: state.chooseItem,
  }))
@Form.create()
export default class CombinationItemModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          help: '',
          help1: '',
          two: false,
          chooseData: [],
          chooseDataKeys: [],
          selectedRow: [],
          combinationSkuNo: null,
          text: false,
          selectedRowKeys: [],
          oldData: [],
          money: 0,
          isFirst: true,
          autoNo1: 0,
        }
      }
      componentWillMount() {
        if (this.props.combination.skuNo) {
          this.setState({
            weight: this.props.combination.referWeight,
          })
        }
        this.props.dispatch({
          type: 'combinationItemModal/getdata',
          payload: this.props.combination,
         })
         if (this.props.openChoose) {
           this.setState({
            two: true,
           })
         }
      }
      componentWillReceiveProps(nextProps) {
        if (nextProps.combination.skuNo) {
          this.setState({
            combinationSkuNo: nextProps.combination.skuNo,
          })
        }
        if (nextProps.combination.skuNo && (nextProps.combination.productType === 1) && this.state.isFirst) {
          this.setState({
            text: true,
            chooseData: nextProps.combinationItemModal.lists,
            oldData: nextProps.combinationItemModal.lists,
            chooseDataKeys: nextProps.combinationItemModal.lists.map(row => row.skuNo),
            isFirst: false,
          })
        }
      }
      // 批量删除
      onClick = () => {
        const chooseDelete = []
        const chooseDelete1 = []
        this.state.selectedRow.forEach((ele) => {
          if (this.props.combinationItemModal.lists.filter(ele1 => ele1.autoNo * 1 === ele.autoNo).length) {
            chooseDelete1.push(ele)
          }
          chooseDelete.push(ele.skuNo)
        })
        let chose = this.state.chooseData
        chooseDelete.forEach((ele) => {
          chose = chose.filter(row => row.skuNo !== ele)
        })
        const TT = this.state.chooseData.filter(row => chooseDelete.indexOf(row.skuNo) === -1)
        this.setState({
          chooseData: chose,
          selectedRow: [],
          selectedRowKeys: [],
          chooseDataKeys: TT.map(row => row.skuNo),
          oldData: chose,
        }, () => {
          let allMoney = 0
          let allWeight = 0
          this.state.chooseData.forEach((ele) => {
            const allMoney1 = (allMoney * 1) + ((ele.skuNum * 1 ? ele.skuNum : 1) * (ele.salePrice * 1 ? ele.salePrice * 1 : 1))
            allMoney = allMoney1
            const allWeight1 = (allWeight * 1) + ((ele.skuNum * 1 ? ele.skuNum : 1) * (ele.referWeight * 1))
            allWeight = allWeight1
          })
          this.setState({
            money: allMoney,
            weight: allWeight,
          }, () => {
            const { setFieldsValue } = this.props.form
            setFieldsValue({ retailPrice: this.state.money })
            setFieldsValue({ referWeight: this.state.weight })
          })
        })
        const t = []
        TT.forEach((ele) => {
          t.push(ele.skuNo)
        })
        this.props.dispatch({ type: 'combinationItem/skuNo', payload: t })
        if (chooseDelete1.length) {
          if (this.props.combination.autoNo) {
              const payload = { skuNo: chooseDelete1, comboNo: this.props.combination.skuNo }
              getCombinationDelete(payload).then((json) => {
                if (json) {
                  notification.success({
                    message: '操作成功',
                  })
                  this.props.dispatch({
                    type: 'combinationItemModal/getdata',
                    payload: this.props.combination,
                  })
                }
              })
          } else if (this.state.combinationSkuNo) {
            const payload = { skuNo: chooseDelete1, comboNo: this.state.combinationSkuNo }
            getCombinationDelete(payload).then((json) => {
              if (json) {
                notification.success({
                  message: '操作成功',
                })
                this.props.dispatch({
                  type: 'combinationItemModal/getdata',
                  payload: this.props.combination,
                 })
              }
            })
          } else {
            message.error('请先保存组合商品基本信息')
          }
        }
      }
      closeChoose = () => {
        this.props.closeChoose()
      }
      saveChoose = () => {
        if (this.state.chooseData && this.state.chooseData.length ? this.state.chooseData !== this.state.oldData : false) {
          let useData = []
          const oldDataAutoNo = this.state.oldData.map(e => e.autoNo)
          const saleData = this.state.chooseData
          saleData.forEach((ele) => {
            Object.assign(ele, { salePrice: ele.retailPrice })
          })
          useData = saleData.filter(ele1 => oldDataAutoNo.indexOf(ele1.autoNo) === -1)
          useData = useData.concat(this.state.oldData)
          let allMoney = 0
          let allWeight = 0
          useData.forEach((ele) => {
            const allMoney1 = (allMoney * 1) + ((ele.skuNum * 1 ? ele.skuNum : 1) * (ele.salePrice * 1 ? ele.salePrice : 1))
            allMoney = allMoney1
            const allWeight1 = (allWeight * 1) + ((ele.skuNum * 1 ? ele.skuNum : 1) * (ele.referWeight * 1))
            allWeight = allWeight1
          })
          this.setState({
            chooseData: useData,
            oldData: useData,
            money: allMoney,
            weight: allWeight,
          }, () => {
            const { setFieldsValue } = this.props.form
            setFieldsValue({ retailPrice: this.state.money })
            setFieldsValue({ referWeight: this.state.weight })
          })
        }
      }

      // 保存子商品信息
      handleOk = () => {
        if (this.props.combination.autoNo) {
          if (this.state.combinationSkuNo) {
            const data = this.state.chooseData
            data.forEach((ele) => {
              if (ele.skuNum === null | ele.skuNum * 1 === 0) {
                Object.assign(ele, { skuNum: 1 })
              }
              if (ele.salePrice === null | ele.salePrice * 1 === 0) {
                Object.assign(ele, { salePrice: 1 })
              }
            })
            // const { getFieldValue } = this.props.form
            // getFieldValue('referWeight')
            const payload = { choose: data, combinationSkuNo: this.props.combination.skuNo, referWeight: this.state.weight }
            saveSkus(payload).then((json) => {
              if (json) {
                notification.success({
                  message: '操作成功',
                })
                this.props.form.resetFields()
                this.props.itemModalHidden()
                const { dispatch, clear } = this.props
                this.setState({
                  text: false,
                  chooseData: [],
                  oldData: [],
                  chooseDataKeys: [],
                  combinationSkuNo: null,
                })
                clear()
                dispatch({
                  type: 'combinationItem/search',
                })
                dispatch({
                  type: 'combinationItem/cleanIds',
                })
                dispatch({ type: 'chooseItem/clean' })
              }
            })
          } else {
            message.error('请先保存组合商品基本信息')
          }
        } else if (this.state.combinationSkuNo) {
          const data = this.state.chooseData
            data.forEach((ele) => {
              if (ele.skuNum === null | ele.skuNum * 1 === 0) {
                Object.assign(ele, { skuNum: 1 })
              }
              if (ele.salePrice === null | ele.salePrice * 1 === 0) {
                Object.assign(ele, { salePrice: 1 })
              }
            })
          const payload = { choose: data, combinationSkuNo: this.state.combinationSkuNo, referWeight: this.state.weight }
          saveSkus(payload).then((json) => {
            if (json) {
              notification.success({
                message: '操作成功',
              })
              this.props.form.resetFields()
              this.props.itemModalHidden()
              const { dispatch, clear } = this.props
              this.setState({
                text: false,
                chooseData: [],
                oldData: [],
                chooseDataKeys: [],
                combinationSkuNo: null,
              })
              clear()
              dispatch({
                type: 'combinationItem/search',
              })
              dispatch({
                type: 'combinationItem/cleanIds',
              })
              dispatch({ type: 'chooseItem/clean' })
            }
          })
        } else {
          message.error('请先保存组合商品基本信息')
        }
      }
      handleCancel = () => {
        const { dispatch, clear } = this.props
        this.setState({
          text: false,
          chooseData: [],
          chooseDataKeys: [],
          combinationSkuNo: null,
        })
        clear()
        dispatch({
          type: 'combinationItem/search',
        })
        dispatch({
          type: 'combinationItem/cleanIds',
        })
        dispatch({ type: 'chooseItem/clean' })
        this.props.form.resetFields()
        this.props.itemModalHidden()
      }
      handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            if (this.props.combination.autoNo) {
              Object.assign(values, { autoNo: this.props.combination.autoNo })
            } else if (this.state.autoNo1) {
              Object.assign(values, { autoNo: this.state.autoNo1 })
            }
            if (this.props.combination.productType !== null && this.props.combination.productType !== undefined) {
              Object.assign(values, { productType: this.props.combination.productType })
            }
            Save(values).then((json) => {
              if (json) {
                notification.success({
                message: '操作成功',
                })
                this.setState({
                  autoNo1: json.autoNo,
                  combinationSkuNo: values.skuNo,
                  text: true,
                })
              }
            })
          }
        })
      }
      addItem = () => {
        if (this.state.combinationSkuNo) {
          this.setState({
            two: true,
          })
        } else {
          message.error('请先保存组合商品基本信息')
        }
      }
      chooseModalHidden = () => {
        this.setState({
          two: false,
        })
      }
      chooseData = (value, keys, callback) => {
        const NewData = this.state.chooseData
        value.forEach((ele) => {
          if (this.state.chooseDataKeys.indexOf(ele.skuNo) === -1) {
            Object.assign(ele, { skuNum: 1, salePrice: ele.retailPrice })
            NewData.push(ele)
          }
        })
        callback()
        let money = 0
        let weight = 0
        NewData.forEach((ele) => {
          money = money + Number(ele.skuNum) * Number(ele.salePrice)
          weight = weight + Number(ele.skuNum) * Number(ele.referWeight)
        })
        const { setFieldsValue } = this.props.form
        setFieldsValue({ retailPrice: money })
        setFieldsValue({ referWeight: weight })
        this.setState({
          oldData: NewData,
          chooseData: NewData,
          chooseDataKeys: keys,
          weight,
          money,
        }, () => {
          this.saveChoose()
        })
      }
      checkBlank = (rule, value, callback) => {
        if (!value) {
          callback()
        } else if (value.indexOf(' ') !== -1) {
            callback('组合商品编码不能输入空格')
          } else {
            callback()
        }
      }
      checkBlank1 = (rule, value, callback) => {
        if (!value) {
          callback()
        } else if (value.indexOf(' ') !== -1) {
            callback('组合款式编码不能输入空格')
          } else {
            callback()
        }
      }
      checkBlank2 = (rule, value, callback) => {
        if (!value) {
          callback()
        } else if (value.indexOf(' ') !== -1) {
            callback('组合商品名称不能输入空格')
          } else {
            callback()
        }
      }
      checkBlank3 = (rule, value, callback) => {
        if (!value) {
          callback()
        } else if (value.indexOf(' ') !== -1) {
            callback('组合商品简称不能输入空格')
          } else {
            callback()
        }
      }
      checkBlank4 = (rule, value, callback) => {
        if (!value) {
          callback()
        } else if (value.indexOf(' ') !== -1) {
            callback('颜色及规格不能输入空格')
          } else {
            callback()
        }
      }
      edit(key) {
        const newData = [...this.state.chooseData]
        const target = newData.filter(item => key === item.autoNo)[0]
        if (target) {
          target.editable = true
          this.setState({ chooseData: newData })
        }
      }
      cancel(key) {
        const newData = [...this.state.oldData]
        const target = newData.filter(item => key === item.autoNo)[0]
        if (target) {
          Object.assign(target, newData.filter(item => key === item.autoNo)[0])
          delete target.editable
          this.setState({ oldData: newData })
        }
      }
      handleChange(value, key, column) {
        const newData = [...this.state.chooseData]
        const target = newData.filter(item => key === item.autoNo)[0]
        const index = newData.findIndex(item => key === item.autoNo)
        let NewData = []
        if (column === 'salePrice') {
          NewData = update(newData, { [index]: { $merge: { [column]: value } } })
        } else {
          NewData = update(newData, { [index]: { $merge: { [column]: value } } })
        }
        if (column === 'salePrice') {
          if (isNaN(value)) {
            message.warning('单价请输入数字')
          } else if (value < 0) {
            message.warning('单价不能小于0')
          } else if (!value) {
            message.warning('单价不能为空')
          } else if (value.toString().indexOf('.') !== -1 && value.toString().split('.')[1].length > 2) {
            message.warning('单价小数位不超2位')
          } else {
            if (target) {
              this.setState({
                chooseData: NewData,
                oldData: NewData,
              }, () => {
                let money = 0
                let weight = 0
                NewData.forEach((ele) => {
                  money = money + Number(ele.skuNum) * Number(ele.salePrice)
                  weight = weight + Number(ele.skuNum) * Number(ele.referWeight)
                })
                const { setFieldsValue } = this.props.form
                this.setState({
                  weight,
                  money,
                })
                setFieldsValue({ retailPrice: money })
                setFieldsValue({ referWeight: weight })
              })
            }
          }
        } else {
          if (isNaN(value) || Number.isInteger(value)) {
            message.warning('数量请输入整数')
          } else if (value < 0) {
            message.warning('数量不能小于0')
          } else if (!value) {
            message.warning('数量不能为空')
          } else if (value.toString().indexOf('.') !== -1) {
            message.warning('数量请不要输入小数点')
          } else {
            if (target) {
              this.setState({
                chooseData: NewData,
                oldData: NewData,
              }, () => {
                let money = 0
                let weight = 0
                NewData.forEach((ele) => {
                  money = money + Number(ele.skuNum) * Number(ele.salePrice)
                  weight = weight + Number(ele.skuNum) * Number(ele.referWeight)
                })
                this.setState({
                  weight,
                  money,
                })
                const { setFieldsValue } = this.props.form
                setFieldsValue({ retailPrice: money })
                setFieldsValue({ referWeight: weight })
              })
            }
          }
        }
      }
      renderColumns(text, record, column) {
        return (
          <EditableCell
            editable={record.editable}
            value={text}
            onChange={value => this.handleChange(value, record.autoNo, column)}
            save={() => this.save(record.autoNo)}
          />
        )
      }
  render() {
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>)
        },
    }, {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (text) => {
        return (<Avatar shape="square" src={text} />)
        },
    }, {
      title: '商品编码',
      dataIndex: 'skuNo',
      key: 'skuNo',
      width: 100,
    }, {
      title: '商品名',
      dataIndex: 'productName',
      key: 'productName',
      width: 100,
    }, {
      title: '颜色及规格',
      dataIndex: 'productSpec',
      key: 'productSpec',
      width: 100,
    }, {
      title: '数量',
      dataIndex: 'skuNum',
      key: 'skuNum',
      width: 100,
      render: (text, record) => this.renderColumns(text, record, 'skuNum'),
    }, {
      title: '应占售价',
      dataIndex: 'salePrice',
      key: 'salePrice',
      width: 100,
      render: (text, record) => this.renderColumns(numeral(text).format('0.00'), record, 'salePrice'),
    }, {
      title: '当前可用库存',
      dataIndex: 'inventoryNum',
      key: 'inventoryNum',
      width: 100,
    }]
    const { combination } = this.props
    const { productNo, skuNo, retailPrice, productSpec, imageUrl, productName, shortName, referWeight } = combination
    const { getFieldDecorator } = this.props.form
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
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 12 },
      },
    }
    // 保存组合商品基本信息
      const save = () => {
        this.handleSubmit()
      }
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: (Keys, selectedRows) => {
        this.setState({
          selectedRow: selectedRows,
          selectedRowKeys: Keys,
        })
      },
      onSelect: (record, selected, selectedRows) => {
        this.setState({
          selectedRow: selectedRows,
        })
      },
      onSelectAll: (selected, selectedRows) => {
        this.setState({
          selectedRow: selectedRows,
        })
      },
    }
    return (
      <div>
        <Modal
          maskClosable={false}
          title="组合商品"
          visible={this.props.itemModalVisiable}
          onCancel={this.handleCancel}
          width="1000px"
          footer={[
            <Button key="998" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button key="999" type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="组合款式编码"
            >
              {getFieldDecorator('productNo', {
                initialValue: productNo,
                  rules: [{
                    required: true, message: '请输入款式编码',
                  },
                  {
                    validator: this.checkBlank1,
                  }],
            })(
              <Input size={config.InputSize} readOnly={this.state.text} maxLength="50" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="组合商品编码"
            >
              {getFieldDecorator('skuNo', {
                initialValue: skuNo,
                rules: [{
                  required: true, message: '请输入商品编码',
                  },
                  {
                    validator: this.checkBlank,
                  }],
            })(
              <Input size={config.InputSize} readOnly={this.state.text} maxLength="50" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="组合商品名称"
            >
              {getFieldDecorator('productName', {
                initialValue: productName,
                rules: [{
                required: true, message: '请输入商品名称',
                },
                {
                  validator: this.checkBlank2,
                }],
            })(
              <Input size={config.InputSize} readOnly={this.state.text} maxLength="200" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="组合商品简称"
            >
              {getFieldDecorator('shortName', {
                initialValue: shortName,
                rules: [{
                    validator: this.checkBlank3,
                  }],
            })(
              <Input size={config.InputSize} maxLength="50" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="图片地址"
            >
              {getFieldDecorator('imageUrl', {
                initialValue: imageUrl,
            })(
              <Input size={config.InputSize} maxLength="250" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="组合颜色及规格"
            >
              {getFieldDecorator('productSpec', {
                initialValue: productSpec,
                rules: [{
                  validator: this.checkBlank4,
                }],
            })(
              <Input size={config.InputSize} maxLength="100" />
            )}
            </FormItem>
            <Row>
              <Col span={6}>
                <FormItem
                  help={this.state.help}
                  {...formItemLayout2}
                  label="组合售价"
                >
                  {getFieldDecorator('retailPrice', {
                    initialValue: retailPrice,
                    // rules: [
                    //   {
                    //     validator: this.checkPrice,
                    // }],
                })(
                  <Input size={config.InputSize} readOnly="true" />
                )}
                </FormItem>
              </Col>
              <Col span={11}><Alert style={{ marginLeft: '10px' }} message="售价=组合商品的各子商品数量乘以单价的合计" type="info" showIcon /></Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem
                  help={this.state.help1}
                  {...formItemLayout2}
                  label="组合重量"
                >
                  {getFieldDecorator('referWeight', {
                    initialValue: referWeight,
                    // rules: [{
                    //     validator: this.checkWeight,
                    //   }],
                })(
                  <Input size={config.InputSize} readOnly="true" />
                )}
                </FormItem>
              </Col>
              <Col span={15}><div style={{ marginLeft: '5px', marginTop: '10px' }}>Kg</div></Col>
            </Row>
            {/* <FormItem
              {...formItemLayout1}
              label="虚拟库存"
            >
              {getFieldDecorator('suppositional', {
                initialValue: suppositional,
            })(
              <Input size={config.InputSize} />
            )}
            </FormItem> */}
            <Col span={3}>
              <div />
            </Col>
            <Button onClick={save} type="primary" size="small" >保存组合商品基本信息</Button>
          </Form>
          <br />
          <div className={styles.tabelToolbarItem} >
            <Button type="primary" size="small" onClick={this.addItem} >增加参与组合商品</Button>
            {/* <Button type="primary" size="small" onClick={this.saveAll}>保存参与的组合商品</Button> */}
            <Popconfirm title="请确认是否删除，一旦删除将不可恢复" okText="确定" onConfirm={this.onClick} cancelText="取消">
              <Button size="small" >删除选中的组合商品</Button>
            </Popconfirm>
          </div>
          <Table
            rowSelection={rowSelection}
            dataSource={this.state.chooseData}
            columns={columns}
            size="middle"
            rowKey={record => record.skuNo}
            onRow={(record) => {
              return {
                onMouseEnter: () => {
                  this.edit(record.autoNo)
                },
                onMouseLeave: () => {
                  this.cancel(record.autoNo)
                },
              }
            }}
          />
        </Modal>
        { this.state.two ?
          <ChooseItem
            changeModalVisiable={this.state.two}
            productType={0}
            itemModalHidden={this.chooseModalHidden}
            saveChoose={this.saveChoose}
            chooseData={(row, key, callback) => this.chooseData(row, key, callback)}
            chooseDataKeys={this.state.chooseDataKeys}
            fromName="combination"
            closeChoose={this.closeChoose}
          /> : null }
      </div>
    )
  }
}

