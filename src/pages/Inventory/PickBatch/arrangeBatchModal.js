import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Input, Button, Tag, Select, Tooltip, Icon} from 'antd'
import { distributionPickTask } from '../../../services/inventory/pickBatch'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from './index.less'

const Option = Select.Option
@connect(state => ({
  arrangeBatch: state.arrangeBatch,
  pickBatch: state.pickBatch,
}))
export default class ArrangeBatchModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          userList: [],
        }
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.visible !== nextProps.visible && nextProps.visible) {
        this.props.dispatch({
          type: 'arrangeBatch/fetch',
          payload: {
            billNo: nextProps.billNo,
          },
        })
      }
    }
    handleCancel = () => {
      this.props.hidden()
      this.props.dispatch({
        type: 'arrangeBatch/clean'
      })
      this.setState({
        userList: [],
      })
    }
    selectOperater = (value) => {
      this.setState({
        userList: value,
      })
    }
    deleteUser = (e) => {
      this.setState({
        userList: this.state.userList.filter(row => row !== e),
      })
    }
    arrangePickTask = () => {
      if (this.props.arrangeBatch.selectedRows && this.props.arrangeBatch.selectedRows.length) {
        distributionPickTask({
          userList: this.state.userList,
          wmBatchDetailList: this.props.arrangeBatch.selectedRows,
        }).then((json) => {
          this.handleCancel()
          this.props.dispatch({
            type: 'pickBatch/search',
          })
        })
      } else {
        const payload = {
          userList: this.state.userList,
          webBatchSummaryDTO: this.props.arrangeBatch.searchParam,
        }
        distributionPickTask(payload).then((json) => {
          this.handleCancel()
          this.props.dispatch({
            type: 'pickBatch/search',
          })
        })
      }
      
    }
 render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.arrangeBatch
    const searchBarItem = [
      {
        decorator: 'startLocationNo',
        components: <Input size="small" placeholder="起始仓位" />,
      },
      {
        decorator: 'endLocationNo',
        components: <Input size="small" placeholder="结束仓位" />,
      },
      {
        decorator: 'arrangeStatus',
        components: <Select className={styles.operateUser} placeholder="安排状态" size="small">
                    <Option key={0} >未安排</Option>
                    <Option key={1} >部分安排</Option>
                    <Option key={2} >全部安排</Option>
                  </Select>,
      }]
        
        // 操作栏
    const tabelToolbar = [
      <Select
        className={styles.operateUser}
        value={this.state.userList}
        onChange={this.selectOperater.bind(this)}
        style={{ width: 200, marginRight: 20 }}
        key={0}
        mode="multiple"
        placeholder="请选择分配人员"
        premission="PICKBATCH_ARRANGE"
        size="small"
      >
        {this.props.operateUsers.length ? this.props.operateUsers.map((e, i) =><Option key={i} value={e}><Tooltip key={i} title={e}>{e}</Tooltip></Option>) : null}
      </Select>,
      <Button
        key={1}
        type="primary"
        premission="PICKBATCH_ARRANGE"
        disabled={this.state.userList.length === 0}
        onClick={this.arrangePickTask}
        size="small"
      >
        分配
      </Button>,
      <span key={2} premission="PICKBATCH_ARRANGE">{this.state.userList && this.state.userList.length
        ? this.state.userList.map((ele, i) => {
            return (
              <Input
                size="small"
                style={{ marginRight: '20px', width: (ele.length * 5 + 85) }}
                key={i}
                value={ele}
                readOnly="true"
                addonAfter={
                  <a onClick={this.deleteUser.bind(this, ele)}>
                    <Icon type="delete" />
                  </a>
                }
              />
            )
          })
        :
        null}</span>,
          ]
    // 搜索栏参数
    const searchBarProps = {
        colItems: searchBarItem,
        dispatch: this.props.dispatch,
        nameSpace: 'arrangeBatch',
        clear: true,
        clearState: () => {
          this.setState({
            userList: [],
          })
        },
        searchParam,
        requestParam: { billNo: this.props.billNo },
      }
    const columns = [{
      title: '批次号',
      dataIndex: 'billNo',
      key: 'billNo',
      width: 100,
      render: (text, record) => <a >{text}</a>,
    },
    {
      title: '类型',
      dataIndex: 'billType',
      key: 'billType',
      width: 100,
      render: text => {
          switch(text*1) {
              case 0:
               return <Tag color="green">单件批次</Tag>
              case 1:
               return <Tag color="volcano">多件批次</Tag>
              case 2:
               return <Tag color="orange">现场大单</Tag>
              case 3:
               return <Tag color="magenta">补货批次</Tag>
              case 4:
               return <Tag color="gold">唯品会批次</Tag>
              case 5:
               return <Tag color="cyan">移库下架</Tag>
              case 6:
               return <Tag color="blue">门店补货</Tag>
              default:
               return <Tag color="red">未知</Tag>
          }
      },
    },
    {
      title: '货号',
      dataIndex: 'productNo',
      key: 'productNo',
      width: 200,
      render: (text, record) => <a >{text}</a>,
    },
    {
      title: '规格',
      dataIndex: 'productSpec',
      key: 'productSpec',
      width: 200,
      render: (text, record) => <a >{text}</a>,
    },
    {
      title: '任务数',
      dataIndex: 'billNum',
      key: 'billNum',
      width: 100,
    },
    {
      title: '已拣数',
      dataIndex: 'pickedNum',
      key: 'pickedNum',
      width: 100,
      render: (text, record) => <a >{text}</a>,
    },
    {
      title: '未拣数',
      dataIndex: 'unPickedNum',
      key: 'unPickedNum',
      width: 100,
    },
    {
      title: '缺货数',
      dataIndex: 'stockoutNum',
      key: 'stockoutNum',
      width: 100,
    },
    {
      title: '仓位',
      dataIndex: 'locationNo',
      key: 'locationNo',
      width: 200,
    },
    {
      title: '拣货人员',
      dataIndex: 'operateUser',
      key: 'operateUser',
      width: 200,
    },
  ]
    // 表格参数
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'arrangeBatch',
        tableName: 'arrangeBatchTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { y: 300 },
        custormTableClass: 'tablecHeightFix500',
    }
    return (
      <Modal
        title="安排|重新安排拣货任务"
        visible={this.props.visible}
        footer={null}
        width={1000}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <SearchBar {...searchBarProps} />
          </div>
          <Jtable {...tableProps} />
        </div>
      </Modal>
    )
}
}
