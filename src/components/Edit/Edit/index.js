import React, { Component } from 'react'
import { Modal, Form, Input, Cascader, Button, Switch, Radio, Checkbox, message } from 'antd'
import { connect } from 'dva'
import styles from './index.less'
import Jtable from '../../JcTable/index'
import { getAllRoot, updateSaveCategory } from '../../../services/category/category'

const FormItem = Form.Item
const RadioGroup = Radio.Group

@Form.create()
@connect(state => ({
  edit: state.edit,
}))
class Edit extends Component {
  state = {
    value: 2,
    data: {},
    setite: [],
    sitedata: {},
  }
  componentWillMount() {
    this.setState({
      data: this.props.bjectEditvisvis,
      setite: this.props.setite,
      sitedata: this.props.data,
    })
    const payload = Object.assign({
      categoryNo: this.props.bjectEditvisvis.categoryNo,
    })
    this.props.dispatch({
            type: 'edit/fetch',
            payload,
          })
  }
  onChange = (e) => {
    console.log('选择之后的回掉函数', e)
  }
  // 全部启用禁用回调函数
  onChangeRadio = (e) => {
    // enableStatus 资料状态(0: 禁用; 1: 启用)
    console.log(e.target.value)
    // console.log(e.target.value)
    this.setState({
      value: e.target.value,
    })
    const payload = {
      categoryNo: this.state.data.categoryNo,
      enableStatus: (e.target.value === 2) ? null : e.target.value,
    }
    console.log('payload', payload)
    this.props.dispatch({
      type: 'edit/entdsh',
      payload,
    })
    // if (e.target.value === 3) {
    //   const payload = {
    //     categoryNo: this.state.data.categoryNo,
    //   }
    //   this.props.dispatch({
    //     type: 'edit/entdsh',
    //     payload,
    //   })
    // } else {
    //   const payload = {
    //     categoryNo: this.state.data.categoryNo,
    //     enableStatus: e.target.value,
    //   }
    //   console.log('payload', payload)
    //   this.props.dispatch({
    //     type: 'edit/entdsh',
    //     payload,
    //   })
    // }

      // console.log('payload', e.target.value)
      // const payload = {
      //   categoryNo: this.state.data.categoryNo,
      //   enableStatus: e.target.value,
      // }
      // this.props.dispatch({
      //   type: 'edit/entdsh',
      //   payload,
      // })
  }
  selectedRowsdata = () => {
    getAllRoot({}).then((json) => {
      const selectedRows = this.props.edit.selectedRows
      const payload = {
        data: json,
        selectedRows,
      }
      this.props.handelTabelfunction[4](payload)
    })
  }
   // 表单上报函数
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payloads = this.state.data
        const payload = {}
        payload.autoNo = this.state.data.autoNo
        payload.categoryStatus = values.categoryStatus ? 0 : 1
        payload.enableSpec = values.enableSpec ? 1 : 0
        payload.parentCategoryNo = values.parentCategoryNo[values.parentCategoryNo.length - 1]
        payload.parentCategoryNos = values.parentCategoryNo[values.parentCategoryNo.length - 1]
        payload.categoryName = values.categoryname
        payload.categoryNo = payloads.categoryNo
        payload.sortOrder = Number(values.sortorder)
        updateSaveCategory({
            ...payload,
        }).then((data) => {
          if (data) {
            this.props.handelTabelfunction[6]()
            message.success('数据保存成功')
          } else {
            console.log('保存失败')
            message.error('数据保存失败，请重试')
          }
        })
      }
    })
  }
  // 编辑回调
  address = (record) => {
    this.props.handelEditattributesdata(record)
    this.props.handelEditattributes(record)
  }
  handleOk = () => {
    this.props.form.resetFields()
    this.props.handelTabelfunction[1]()
  }
  enableSpeconChange = (value) => {
    this.setState({
      enableSpec: value,
    })
  }
  categoryStatusonChange = (value) => {
    this.setState({
      categoryStatus: value,
    })
  }
    render() {
      const { getFieldDecorator } = this.props.form
      // 表格传过来的参数
      const { list, loading, total, page, selectedRowKeys, selectedRows } = this.props.edit
      const formItemLayout = {
        labelCol: {
          xs: { span: 10 },
          sm: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 10 },
          sm: { span: 6 },
        },
      }
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 3,
            offset: 0,
          },
          sm: {
            span: 3,
            offset: 3,
          },
        },
      }
      // 表格数据源
      const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 80,
        render: (text, record, index) => {
          return (
            <span>{index + 1}</span>
          )
        },
      }, {
        title: '属性号',
        dataIndex: 'attributeNo',
        key: 'attributeNo',
        width: 120,
      }, {
        title: '名称',
        dataIndex: 'attributeName',
        key: 'attributeName',
        width: 100,
      }, {
        title: '排序',
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        render: (text) => {
          if (text === null) {
            return (
              <a>{1}</a>
            )
          } else {
            return (
              <a>{text}</a>
            )
          }
        },
        width: 80,
      }, {
        title: '启用',
        dataIndex: 'enableStatus',
        key: 'enableStatus',
        render: (text) => {
          // 是否启用规格(0:不启用; 1:启用)
          return (<span>{(text === 0) ? <Checkbox checked={false} /> : <Checkbox checked />}</span>)
      },
        width: 80,
      }, {
        title: '可输入',
        dataIndex: 'inputFlag',
        key: 'inputFlag',
        render: (text) => {
          return (<span>{(text === 0) ? <Checkbox checked={false} /> : <Checkbox checked />}</span>)
        },
        width: 80,
      }, {
        title: '可选属性值',
        dataIndex: 'optionalValue',
        key: 'optionalValue',
        render: (text) => {
          return (<span>{text}</span>)
        },
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'address',
        key: 'address',
        render: (text, record) => <a onClick={this.address.bind(this, record)}>编辑</a>,
        width: 80,
      }]
      // 表格的参数
      const tableProps = {
        // toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        isPart: true,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'edit',
        tableName: 'editTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { y: 100 },
        custormTableClass: 'tablecHeightFix200',
    }
    const handelEditvishide = this.props.handelTabelfunction[1]
    const handelEditattributes = this.props.handelTabelfunction[3]
    const options = this.state.setite
    return (
      <Modal
        maskClosable={false}
        visible={this.props.Editvis}
        onOk={this.handleOk}
        width={800}
        cancelText="取消"
        okText="确定"
        onCancel={handelEditvishide}
        zIndex={50}
        style={{ height: 400 }}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={(<span>名称&nbsp;</span>)}
          >
            {getFieldDecorator('categoryname', {
                initialValue: this.props.bjectEditvisvis.categoryName,
                rules: [{ required: true, message: '请输入名称', whitespace: true }],
            })(
              <Input
                size="small"
                disabled={this.state.data.isEdit}
              />
              )}
          </FormItem>
          <br />
          <FormItem
            {...formItemLayout}
            label={(<span>排序&nbsp;</span>)}
          >
            {getFieldDecorator('sortorder', {
              initialValue: this.props.bjectEditvisvis.sortOrder,
              rules: [{ required: true, message: '请输入排序' }],
            })(<Input size="small" />)}
          </FormItem>
          <br />
          <FormItem
            {...formItemLayout}
            label={(<span>启用&nbsp;</span>)}
          >
            {getFieldDecorator('categoryStatus', {
              initialValue: (this.state.data.categoryStatus === 1) ? false : true,
            })(<Switch
              defaultChecked={(this.state.data.categoryStatus === 1) ? false : true}
              disabled={this.state.data.isEdit}
            />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>启用规格&nbsp;</span>)}
          >
            {getFieldDecorator('enableSpec', {
              initialValue: (this.state.data.enableSpec === 1) ? true : false,
            })(<Switch
              defaultChecked={(this.state.data.enableSpec === 1) ? true : false}
              disabled={this.state.data.isEdit}
            />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>父目录&nbsp;</span>)}
          >
            {getFieldDecorator('parentCategoryNo', {
                  initialValue: this.state.sitedata.parentCategoryNos,
                  rules: [{ required: true, message: '请选择父目录' }],
                })(
                  <Cascader
                    size="small"
                    options={options}
                    placeholder="请选择父目录"
                    disabled={this.state.sitedata.isEdit}
                    changeOnSelect
                  />
                )}
          </FormItem>
          <br />
          <FormItem {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              size="small"
            >保存
            </Button>
          </FormItem>
        </Form>
        <hr />
        <RadioGroup onChange={this.onChangeRadio} value={this.state.value}>
          <Radio value={2}>全部</Radio>
          <Radio value={1}>启用</Radio>
          <Radio value={0}>禁用</Radio>
        </RadioGroup>
        <br />
        <br />
        <Button type="primary" style={{ marginLeft: 15 }} onClick={handelEditattributes} size="small">添加新属性</Button>
        <Button type="primary" style={{ marginLeft: 15 }} onClick={this.selectedRowsdata} size="small" disabled={(selectedRows.length === 0) ? true : false} >复制属性到其他类目</Button>
        {/* <Button type="primary" style={{ marginLeft: 15 }} size="small">导出款及属性信息</Button> */}
        <br />
        <br />
        <div className={styles.tableList}>
          <Jtable {...tableProps} />
        </div>
      </Modal>
        )
    }
}

export default Edit
