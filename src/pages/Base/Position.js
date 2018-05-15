/*
 * @Author: wupeng
 * @Date: 2017-12-25 10:04:11
 * @Last Modified by
 * 仓位资料维护
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Row, Form, Col, Button, Menu, Icon, Input, Card, Dropdown, Checkbox } from 'antd'
import Jtable from '../../components/JcTable'
import Xinput from '../../components/Xinpunt'
import styles from './Position.less'
import DeleteModel from '../../components/Xinpunt/deleteModel'
import Delect from '../../components/Xinpunt/delect'
import Priority from '../../components/Xinpunt/Priority'
import PositionStreent from '../../components/PositionStreent/PositionStreent' // 左侧树形控件
import Print from '../../components/PositionStreent/Print' // 调用打印机端口
import { getDefultTemplate } from '../../services/api'
import {
    unbindGoods,
    updateEnableStatus,
    deleteStorageLocationByNos,
    selStoragelocationPickingPriority,
    // selStoragelocationBylocationNos,
} from '../../services/position/position'
import { setLocalStorageItem } from '../../utils/utils'

const FormItem = Form.Item
@Form.create()
@connect(state => ({
    position: state.position,
    prints: state.prints,
}))
export default class Position extends Component {
    state = {
        visible: false,
        date: [],
        text: '确认删除选中仓位？',
        deletevisible: false,
        Delectvis: false,
        Priorityvisible: false,
        ecommerceuser: {},
        expandedKeys: [],
        autoExpandParent: true,
        confirmLoading: false,
        Pickingtext: {},
        warehouseNo: null,
        locationType: null,
        Printdata: {},
        Printvis: false,
        templateId: 0, // 打印模版默认ID
    }
// 构建组件
componentWillMount() {
    this.setState({
        warehouseNo: this.props.warehouseNo, // 仓位编号
        locationType: this.props.locationType, //  仓位类型
    })
    const payload = {
        warehouseNo: this.props.warehouseNo, // 仓位编号
        locationType: this.props.locationType, //  仓位类型
    }
    this.props.dispatch({
        type: 'position/treead',
        payload,
    })
    getDefultTemplate({
        templateType: 3,
    }).then((json) => {
        if (json) {
            this.setState({
                templateId: json.autoNo,
            })
        }
    })
}
onCancelDeleteModel = () => {
    this.setState({
        deletevisible: false,
    })
}
onCancel = () => {
    this.setState({
        visible: false,
        date: [],
        text: '确认删除选中仓位？',
        deletevisible: false,
        Priorityvisible: false,
        ecommerceuser: {},
        confirmLoading: false,
        Pickingtext: {},
    })
    this.props.itemModalHidden()
}
// 页面熏染函数
onselect = () => {
    const payload = {
        warehouseNo: this.state.warehouseNo, // 仓位编号
        locationType: this.state.locationType, //  仓位类型
    }
    this.props.dispatch({
        type: 'position/fetch',
        payload,
    })
}
ontreeadd = () => {
    const payload = {
        warehouseNo: this.state.warehouseNo, // 仓位编号
        locationType: this.state.locationType, //  仓位类型
    }
    this.props.dispatch({
        type: 'position/treead',
        payload,
    })
    this.setState({
        autoExpandParent: true,
    })
}
handleempty = () => {
    this.props.form.resetFields()
    const payload = {
        warehouseNo: this.state.warehouseNo, // 仓位编号
        locationType: this.state.locationType, //  仓位类型
    }
    this.props.dispatch({
        type: 'position/fetch',
        payload,
    })
}
// 获取仓位拣货优先级
hanldPriority = () => {
  const payload = Object.assign({
    warehouseNo: this.state.warehouseNo, // 仓库编号
    locationType: this.state.locationType,
  })
  selStoragelocationPickingPriority({
    ...payload,
  }).then((json) => {
    if (json === false) {
      return false
    } else {
      this.setState({
        Pickingtext: json,
        Priorityvisible: true,
       })
    }
  })
}

hanldPrioritydelect = () => {
  this.setState({
    Priorityvisible: false,
    Pickingtext: {},
  })
}
// 新增仓位弹框显示
showModal = () => {
  this.setState({
    visible: true,
  })
}
// 新增仓位onChange
handelNowPositionshow = () => {
    this.setState({
        visible: false,
    })
}
Positiontwo = () => {
    this.setState({
        visible: false,
        expandedKeys: [],
    })
}
hanseselect = () => {
  const payload = Object.assign({
    warehouseNo: this.state.warehouseNo,
    locationType: this.state.locationType,
  })
  this.props.dispatch({
    type: 'position/search',
    payload,
  })
}
// 搜索
handleInput = () => {
    this.props.form.validateFields((err, values) => {
        if (!err) {
            const locationNo = (String(values.search).length === 0) ? null : values.search
            const payload = Object.assign({
                warehouseNo: this.state.warehouseNo,
                locationType: this.state.locationType,
                locationNo,
            })
            this.props.dispatch({
                type: 'position/searchs',
                payload,
            })
        } else {
            return false
        }
    })
}
    hanselect = (e) => {
        const payload = Object.assign({
            warehouseNo: this.state.warehouseNo,
            locationType: this.state.locationType,
            locationNo: e,
        })
        this.props.dispatch({
            type: 'position/endtch',
            payload,
          })
    }
    deletemadelone = () => {
        this.setState({
            Delectvis: true,
        })
    }
    deletemadeltwo = () => {
        this.setState({
            Delectvis: false,
        })
    }
    // 删除仓位
    deletemadel=() => {
        this.setState({
            confirmLoading: true,
        })
        let locationNos = ''
        for (let i = 0; i < this.props.position.selectedRows.length; i++) {
           if (locationNos.length === 0) {
                locationNos = `${this.props.position.selectedRows[i].locationNo}`
            } else {
                locationNos = `${locationNos},${this.props.position.selectedRows[i].locationNo}`
            }
        }
        const payload = Object.assign({
            warehouseNo: this.state.warehouseNo,
            locationType: this.state.locationType,
            locationNos,
        })
        deleteStorageLocationByNos({
            ...payload,
        }).then((json) => {
            if (json) {
                this.hanseselect()
                this.ontreeadd()
                this.setState({
                    Delectvis: false,
                    confirmLoading: false,
                    date: [],
                    expandedKeys: [],
                })
            } else {
                this.setState({
                    confirmLoading: false,
                })
            }
        })
    }
    // 搜索函数
    select = () => {
        const payload = Object.assign({
            warehouseNo: this.state.warehouseNo,
            locationType: this.state.locationType,
        })
        this.props.dispatch({
            type: 'position/search',
            payload,
        })
    }
    // 启用禁用
    handleMenuClick = (e) => {
      // enable_status 0 禁用 1 启用
      const enableStatus = Number(e.key)
      let locationNos = ''
      for (let i = 0; i < this.props.position.selectedRows.length; i++) {
        if (locationNos.length === 0) {
          locationNos = `${this.props.position.selectedRows[i].locationNo}`
        } else {
          locationNos = `${locationNos},${this.props.position.selectedRows[i].locationNo}`
        }
      }
      const payload = Object.assign({
        warehouseNo: this.state.warehouseNo,
        locationType: this.state.locationType,
        enableStatus,
        locationNos,
      })
      if (enableStatus === 0) {
        updateEnableStatus({
          ...payload,
        }).then(() => {
          this.select()
        })
       }
     if (enableStatus === 1) {
       updateEnableStatus({
        ...payload,
       }).then(() => {
          this.select()
      })
     }
    }
    // handeldelmode
    handeldelmode = () => {
        this.setState({
            deletevisible: true,
            text: '确认解除绑定吗？',
        })
    }
    // 用户选择
    handelshow = () => {
        this.setState({
            deletevisible: false,
        })
    }
    // 解除绑定
    delshandeldelmode=() => {
      let locationNos = ''
      for (let i = 0; i < this.props.position.selectedRows.length; i++) {
         if (locationNos.length === 0) {
            locationNos = `${this.props.position.selectedRows[i].locationNo}`
          } else {
            locationNos = `${locationNos},${this.props.position.selectedRows[i].locationNo}`
          }
      }
      const payload = Object.assign({
          warehouseNo: this.state.warehouseNo,
          locationType: this.state.locationType,
          locationNos,
      })
      unbindGoods({
          ...payload,
      }).then(() => {
          this.select()
      })
      this.setState({ deletevisible: false })
    }
    DeletePosition = (e) => {
      this.setState({ date: e })
    }
    // 仓位条码打印
    Barcodeprinting = (selectedRows) => {
      setLocalStorageItem('printData', JSON.stringify(selectedRows))
      window.open(`${window.location.origin}/#/print/printPreview?autoNo=${this.state.templateId}`)
    }
    PrintTwo = () => {
        this.setState({
            Printdata: {},
            Printvis: false,
        })
    }
    onExpand1 = (expandedKeys) => {
      this.setState({
        expandedKeys: expandedKeys,
        autoExpandParent: false,
      })
    }
    setPrintTemp = () => {
        window.open(`${window.location.origin}/#/print/printModifyView?autoNo=${this.state.templateId}`)
    }
    render() {
    const { getFieldDecorator } = this.props.form
    const { list, loading, total, page, selectedRowKeys, selectedRows, treeData } = this.props.position
         // 列头
    const columns = [
        {
        title: '仓位编号',
        dataIndex: 'locationNo',
        key: 'locationNo',
        width: 80,
        }, {
        title: '商品编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 80,
        }, {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 80,
        }, {
        title: '仓位类别',
        dataIndex: 'locationType',
        key: 'locationType',
        width: 80,
        render: (text) => {
            switch (text) {
                // 1:进货仓;2:整存仓;3:零售仓;4:发货暂存仓;5:退货暂存仓;6:残次仓;7:疑难件仓;8:整存移库暂存;9:零售移库暂存
                case (1):
                return '进货仓'
                case (2):
                return '整存仓'
                case (3):
                return '零售仓'
                case (4):
                return '发货暂存仓'
                case (5):
                return '退货暂存仓'
                case (6):
                return '残次仓'
                case (7):
                return '疑难件仓'
                case (8):
                return '整存移库暂存'
                case (9):
                return '零售移库暂存'
                default:
            }
        },
        }, {
        title: '启用状态',
        dataIndex: 'enableStatus',
        key: 'enableStatus',
        width: 80,
        render: (text) => {
          switch (text) {
              case (0):
              return (<Checkbox checked={false} />)
              case (1):
              return (<Checkbox checked />)
              default:
          }
        },
        },
      ]
      const menu = (
        <Menu onClick={this.handleMenuClick}>
          <Menu.Item key="1"><Icon type="check-circle-o" />启用</Menu.Item>
          <Menu.Item key="0"><Icon type="close-circle-o" />禁用</Menu.Item>
        </Menu>
    )
       // 操作栏
       const tabelToolbar = [
         <Button type="primary" premission="POOSITION_INSERSTORA" onClick={this.showModal} size="small" >新增仓位</Button>,
         <Button
           type="primary"
           premission="POSITION_DELETESTORA"
           disabled={selectedRows.length === 0}
           className={styles.MarginIpur}
           onClick={this.deletemadelone.bind(this)} size="small"
          >删除仓位</Button>,
         <Dropdown overlay={menu} premission="POSITION_DELETESTORA" type="primary" size="small" disabled={selectedRows.length === 0}>
           <Button className={styles.Button} type="primary" size="small" style={{ marginLeft: 4 }}>
            启用/禁用 <Icon type="down" />
           </Button>
         </Dropdown>,
         <Button type="primary" premission="POSITION_UNBINDGOODS" size="small" onClick={this.setPrintTemp.bind(this)} disabled={selectedRows.length === 0}>设定仓位条码模板</Button>,
         <Button type="primary" premission="POSITION_SSLBY" onClick={this.Barcodeprinting.bind(this, selectedRows)} size="small" disabled={selectedRows.length === 0}>仓位条码打印</Button>,
         <Button type="primary" premission="POSITION_UNBINDGOODS" onClick={this.handeldelmode} size="small" disabled={selectedRows.length === 0}>解除邦定</Button>,
         <Button type="primary" premission="POSITION_SEL_PICK" onClick={this.hanldPriority} size="small">仓位拣货优先级</Button>,
      ]
        const tableProps = {
            toolbar: tabelToolbar,
            noSelected: false,
            dataSource: list,
            total,
            ...page,
            loading,
            columns,
            nameSpace: 'position',
            tableName: 'positionTable',
            dispatch: this.props.dispatch,
            selectedRows,
            selectedRowKeys,
            rowKey: 'autoNo',
            scroll: { y: 400 },
            custormTableClass: 'tablecHeightFix500',
        }
        const Delectdata = {
            visible: this.state.Delectvis,
            confirmLoading: this.state.confirmLoading,
            deletemadel: this.deletemadel,
            deletemadeltwo: this.deletemadeltwo,
        }
        const Printdata = {
            visible: this.state.Printvis,
            PrintTwo: this.PrintTwo,
        }
        return (
          <Modal
            visible={this.props.itemModalVisiableS}
            width={1300}
            onCancel={this.onCancel.bind(this)}
            onOk={this.onCancel.bind(this)}
            cancelText="取消"
            okText="确定"
            maskClosable={false}
            style={{ top: 10, height: 400 }}
            mask={false}
          >
            <Card bordered={false} >
              <Row>
                <Col span={3}>
                  <PositionStreent
                    data={this.state.ecommerceuser}
                    treeData={treeData}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onExpand1={this.onExpand1}
                    hanselect={this.hanselect}
                  />
                </Col>
                <Col span={20} offset={1}>
                  <Form>
                    <FormItem >
                      {getFieldDecorator('search')(<Input id="Input" placeholder="请输入仓位编号" className={styles.Inpurt} size="small" />)}
                      <Button
                        type="primary"
                        className={styles.Magring}
                        onClick={this.handleInput}
                        size="small"
                      >
                      搜索
                      </Button>
                      <Button className={styles.Defgry} onClick={this.handleempty.bind(this)} size="small">清空</Button>
                    </FormItem>
                  </Form>
                  <br />
                  <div className={styles.tableList}>
                    <Jtable {...tableProps} />
                  </div>
                </Col>
              </Row>
              {this.state.visible ? <Xinput
                show={this.state.visible}
                handelNowPositionshow={this.handelNowPositionshow}
                Positiontwo={this.Positiontwo}
                warehouseNo={this.state.warehouseNo}
                locationType={this.state.locationType}
              /> : null}
              <DeleteModel
                deletevisible={this.state.deletevisible}
                text={this.state.text}
                handelshow={this.handelshow}
                delementnumber={this.delementnumber}
                delshandeldelmode={this.delshandeldelmode}
                onCancelDeleteModel={this.onCancelDeleteModel}
              />
              {/* 仓位拣货优先级弹框 */}
              {this.state.Priorityvisible ? <Priority
                hanld={this.hanldPriority}
                data={this.state.date}
                hanldPrioritydelect={this.hanldPrioritydelect}
                visible={this.state.Priorityvisible}
                Pickert={this.Pickert}
                warehouseNo={this.state.warehouseNo}
                locationType={this.state.locationType}
                Pickingtext={this.state.Pickingtext}
              /> : null}
              {this.state.Delectvis ? <Delect data={Delectdata} /> : null }
              {this.state.Printvis ? <Print data={Printdata}/> : null}
            </Card>
          </Modal>
        )
    }
}
