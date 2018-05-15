import React, { Component } from 'react'
import { Modal, Alert, Form, Row, Col, Select } from 'antd'
// search
const FormItem = Form.Item
@Form.create()
class Print extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            Print: [],
        }
    }
    componentWillMount() {
        this.setState({
            visible: this.props.data.visible,
        })
    }
    handelIP = () => {
        console.log('111111111')
    }
    render() {
        const { getFieldDecorator } = this.props.form
        // const PrintOption = this.state.Print.map((e, index) => {
        //     return (
        //         <Option value={`${e.printerAddess}:${e.printerPort}`}>{`${e.printerAddess}:${e.printerPort}`}</Option>
        //     )
        // })
        const formItemLayout = {
            labelCol: {
              xs: { span: 23 },
              sm: { span: 4 },
            },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        }
        return(
            <Modal
                title="选择打印机"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.props.data.PrintTwo}
                >
          <div>
            <div>
              <Alert
                description="未开启云打印接口，请开启并刷新页面。"
                type="warning"
                showIcon
             />
            </div>
            <Row>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="打印机"
                >
                  {getFieldDecorator('areaNo')(
                     <Select
                        style={{ width: 200 }}
                        mode="combobox"
                        type="text"
                        placeholder="请选择打印机"
                        size="small"
                        onClick={this.handelIP.bind(this)}
                    >
                    </Select>
                  )}
               </FormItem>
              </Col>
           </Row>
          </div>
        </Modal>
        )
    }
}

export default Print