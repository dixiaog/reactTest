// Priority 仓位拣货优先级
import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Modal, Button, Input, Row, Col, message } from 'antd'
import { updStoragelocationPickingPriority } from '../../services/position/position'
import Lockmodel from './Lockmodel'
import style from './Priority.less'

const { TextArea } = Input
const FormItem = Form.Item

@Form.create()
@connect(state => ({
  lockmodel: state.lockmodel,
  }))
export default class Priority extends Component {
constructor(props) {
  super(props)
  this.state = {
    Ylan: true,
    loading: false,
    Lockmodelvis: false,
    Pickingtext: null,
  }
}
onChanl = () => {
  this.setState({
    Ylan: true,
})
  this.props.hanldPrioritydelect()
}
handleSubmit = () => {
  this.props.form.validateFields((err, values) => {
   if (!err) {
     this.setState({
       loading: true,
     })
    if (/.*[\u4e00-\u9fa5]+.*$/.test(values.priorityText)) {
      message.error('不能输入中文')
      this.setState({
        loading: false,
      })
    } else {
     if (String(values.priorityText).length > 0) {
      const payload = Object.assign({
        priorityText: values.priorityText.trim().replace(/\n+/g, '回车').replace(/\r+/g, '回车'),
        // .replace(/\s+/g, '\\r'),
        // .replace(/\r\n+/g, ',').replace(/\s+/g, ','),
        // .replace(/[;.，。]+/g, ','),
        warehouseNo: this.props.warehouseNo,
        locationType: this.props.locationType,
      })
      updStoragelocationPickingPriority({
        ...payload,
        }).then((json) => {
          if (json) {
            message.success('保存成功')
            this.setState({
              Ylan: !json,
              loading: false,
             })
          } else {
            console.log('保存失败')
            this.setState({
              loading: json,
            })
          }
        })
     } else {
       this.setState({
         loading: false,
       })
     }
    }
      // const payload = Object.assign({
      //   priorityText: values.priorityText.trim().replace(/\r\n+/g, ',').replace(/\s+/g, ',').replace(/[;.，。]+/g, ','),
      //   warehouseNo: this.props.warehouseNo,
      //   locationType: this.props.locationType,
      // })
      // updStoragelocationPickingPriority({
      //   ...payload,
      //   }).then((json) => {
      //     if (json) {
      //       message.success('保存成功')
      //       this.setState({
      //         Ylan: !json,
      //         loading: false,
      //        })
      //     } else {
      //       console.log('保存失败')
      //       this.setState({
      //         loading: !json,
      //       })
      //     }
      //   })
     }
  })
}
ClickChanl = () => {
  // this.props.Pickert()
}

ClickOk = () => {
  this.handleSubmit()
}
Lockmodelone = () => {
  const payload = Object.assign({
    warehouseNo: this.props.warehouseNo, // 仓库编号
    locationType: this.props.locationType, // 仓位类型
})
this.props.dispatch({
  type: 'lockmodel/fetch',
  payload,
})
this.setState({
              // Pickingtext: json.priorityText,
              Lockmodelvis: true,
          })
// previewStoragelocationPickingPriority({
//     ...payload,
// }).then((json) => {
//     if (json === null) {
//         console.log('操作失败')
//     } else {
//         this.setState({
//             Pickingtext: json.priorityText,
//             Lockmodelvis: true,
//         })
//     }
// })
}
Lockmodeltwo = () => {
  this.setState({
    Pickingtext: null,
    Lockmodelvis: false,
})
}
render() {
  const { getFieldDecorator } = this.props.form
  const Lockmodeldata = {
    Lockmodelvis: this.state.Lockmodelvis,
    Lockmodeltwo: this.Lockmodeltwo,
    Pickingtext: this.state.Pickingtext,
  }
  return (
    <Modal
      title="仓位找货优先级(生成新的仓位之后务必重新设定一下优先级)"
      visible={this.props.visible}
      footer={null}
      onCancel={this.onChanl}
      style={{ marginTop: 130 }}
      maskClosable={false}
    >
      <div>
        <Form>
          <FormItem>
            {getFieldDecorator('priorityText', {
               initialValue: (this.props.Pickingtext.priorityText === null) ? '' : this.props.Pickingtext.priorityText,
          })(<TextArea rows={12} size="small" />)}
          </FormItem>
          <p>&nbsp;</p>
          <Row>
            <Col span={4} offset={14}>
              <Button type="primary" disabled={this.state.Ylan} onClick={this.Lockmodelone} size="small">预览(请先保存)</Button>
            </Col>
            <Col span={4} offset={1}>
              <Button type="primary" htmlType="submit" loading={this.state.loading} onClick={this.ClickOk} className={style.onok} size="small">确认保存</Button>
            </Col>
          </Row>
        </Form>
        {this.state.Lockmodelvis ? <Lockmodel data={Lockmodeldata} /> : null }
      </div>
    </Modal>
        )
    }
}
