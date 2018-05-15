import React, { Component } from 'react'
import { Modal, Button, Form, Table, Popconfirm } from 'antd'
import EditableCell from './EditableCell'
import { updateAttributeInfo } from '../../services/category/category'
import styles from './index.less'

@Form.create()
class AddSpecifications extends Component {
constructor(props) {
  super(props)
  this.state = {
    count: 2,
    dataSource: [],
    columns: [{
      title: '排序',
      dataIndex: 'autoNo',
      render: (text, record, index) => {
        return (
          <div>
            {index + 1}
          </div>
        )
      },
    },
    {
      title: '规格名称',
      dataIndex: 'specName',
      width: '30%',
      render: (text, record) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(record.key, 'specName')}
        />
    ),
  }, {
    title: '规格值',
    dataIndex: 'productSpec',
    width: '30%',
    render: (text, record) => (
      <EditableCell
        value={text}
        onChange={this.onCellChange(record.key, 'productSpec')}
      />
    ),
  }, {
    title: '操作',
    dataIndex: 'operation',
    render: (text, record) => {
      return (
        this.state.dataSource.length > 1 ?
        (
          <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record.key)}>
            <a>删除</a>
          </Popconfirm>
        ) : null
      )
    },
  }],
}
}
componentWillReceiveProps(nextProps) {
  if (nextProps.Addrecord.length > 0) {
    const dataSource = nextProps.Addrecord
    for (let i = 0; i < nextProps.Addrecord.length; i++) {
      dataSource[i].key = i
    }
    this.setState({
      dataSource: dataSource,
    })
  }
}
      // 遮罩层关闭的回调函数
  onCancel = () => {
    this.props.handelRemoveSpecifications()
    this.setState({
      dataSource: [],
    })
  }
  //   表格分隔
  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.setState({ dataSource })
      }
    }
  }
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource]
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) })
  }
  handeOk = () => {
    const payload = Object.assign({
      specList: this.state.dataSource,
    })
    console.log(payload)
    updateAttributeInfo({
      ...payload,
    }).then(() => {
        this.props.handelRemoveSpecifications()
        this.setState({
          dataSource: [],
        })
    })
  }
  handleAdd = () => {
    const { count, dataSource } = this.state
    const newData = {
      key: count,
      productSpec: '请输入规格值',
      specName: '请输入规格名',
      companyNo: this.props.companyNo,
      categoryNo: this.props.categoryNo,
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    })
  }
    render() {
        return (
          <Modal
            title="添加(编辑)类目规格"
            visible={this.props.Specificationsvis}
            width={1000}
            onOk={this.handeOk}
            bodyStyle={{ height: 500, overflowX: 'hidden' }}
            onCancel={this.onCancel}
          >
            <div>
              <Button className={styles.editableaddbtn} onClick={this.handleAdd} size="small" >增加规格</Button>
              <Table bordered dataSource={this.state.dataSource} columns={this.state.columns} />
            </div>
          </Modal>
        )
    }
}
export default AddSpecifications
