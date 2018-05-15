/*
 * @Author: tanmengjia
 * @Date: 2017-12-25 19:50:49
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-03-29 14:04:13
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Col, Button, Card, Avatar, Popconfirm, message, notification } from 'antd'
import config from '../../../utils/config'
import Jtable from '../../../components/JcTable'
import styles from '../Item.less'
import { binding, deleteBdStorageLocation, relievebinding } from '../../../services/capacity'

const FormItem = Form.Item

@connect(state => ({
  itemLocation: state.itemLocation,
}))
@Form.create()
export default class CommonItemModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentDidMount() {
    this.props.dispatch({ type: 'itemLocation/fetch' })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
  }
  handleOk = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
  }
  locationBind = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        binding(values).then((json) => {
          if (json) {
            notification.success({
              message: '操作成功',
            })
            this.props.dispatch({
              type: 'itemLocation/fetch',
            })
          }
        })
      }
    })
  }
  popConfirm = (e) => {
    deleteBdStorageLocation(e).then((json) => {
      if (json) {
        notification.success({
          message: '操作成功',
        })
        this.props.dispatch({
          type: 'itemLocation/fetch',
        })
      }
    })
  }
  poConfirm = (e) => {
    if (e.length === 0) {
      message.warn('请选择至少一条数据')
    } else {
      const locationList = []
      e.forEach((ele) => {
        locationList.push(ele.locationNo)
      })
      const payload = {
        locationNo: locationList,
      }
      relievebinding(payload).then((json) => {
        if (json) {
          notification.success({
            message: '操作成功',
          })
          this.props.dispatch({
            type: 'itemLocation/fetch',
          })
        }
      })
    }
  }
    render() {
      const { getFieldDecorator } = this.props.form
      const { list, total, page, selectedRowKeys, selectedRows, loading } = this.props.itemLocation
      const tabelToolbar = [
        <Popconfirm key={998} title="是否确认批量删除商品资料，一旦删除不能恢复！" premission="TRUE" onConfirm={this.poConfirm.bind(this, selectedRows)} okText="确定" cancelText="取消">
          <Button type="primary" size="small" premission="TRUE">批量删除绑定仓位</Button>
        </Popconfirm>,
       ]
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
        title: '款式编码',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 120,
      }, {
        title: '商品编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 130,
      }, {
        title: '商品名',
        dataIndex: 'productName',
        key: 'productName',
        width: 160,
      }, {
        title: '主仓位',
        dataIndex: 'locationNo',
        key: 'locationNo',
        width: 160,
      }, {
        title: '操作',
        dataIndex: 'opreation',
        key: 'opreation',
        width: 80,
        className: styles.columnCenter,
        render: (text, record) => {
          return (
            <span>
              <Popconfirm title="请确认移除仓位" onConfirm={this.popConfirm.bind(this, record)} okText="确定" cancelText="取消">
                <a >解除绑定</a>
              </Popconfirm>
            </span>
          )
        },
      }]
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
          md: { span: 16 },
        },
      }
      const tableProps = {
        toolbar: tabelToolbar,
        noListChoose: true,
        noSelected: false,
        isPart: true,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'itemLocation',
        tableName: 'itemLocationTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { y: 300 },
        custormTableClass: 'tablecHeightFix340',
      }
      return (
        <div>
          <Modal
            maskClosable={false}
            title="仓位与商品关系"
            visible={this.props.relationshipVisiable}
            onCancel={this.handleCancel}
            onOk={this.handleOk}
            width="1000px"
            bodyStyle={{
              minHeight: 500,
            }}
          >
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm} style={{ height: 37 }}>
                  <Form
                    style={{ marginTop: 8 }}
                  >
                    <Col span={9}>
                      <FormItem
                        {...formItemLayout}
                        label="仓位"
                      >
                        {getFieldDecorator('locationNo', {
                          rules: [{
                            required: true, message: '请输入仓位',
                            }],
                      })(
                        <Input size={config.InputSize} />
                      )}
                      </FormItem>
                    </Col>
                    <Col span={1}>
                      <div />
                    </Col>
                    <Col span={10}>
                      <FormItem
                        {...formItemLayout}
                        label="商品编码"
                      >
                        {getFieldDecorator('skuNo', {
                          rules: [{
                            required: true, message: '请输入商品编码',
                            }],
                      })(
                        <Input size={config.InputSize} />
                      )}
                      </FormItem>
                    </Col>
                    <Col span={1}>
                      <div />
                    </Col>
                    <Col span={2}>
                      <Button size="small" type="primary" onClick={this.locationBind.bind(this)} style={{ marginTop: '7px' }}>绑定</Button>
                    </Col>
                    <Col span={1}>
                      <div />
                    </Col>
                  </Form>
                </div>
                <Col span={24}><div /></Col>
                <Jtable {...tableProps} />
              </div>
            </Card>
          </Modal>
        </div>
      )
    }
}
