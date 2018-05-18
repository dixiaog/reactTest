import React, { Component } from 'react'
import { connect } from 'dva'
import PublicTable from '../../../components/PublicTable'
import { Tag, Input, Select } from 'antd'
import { isRefresh } from '../../../utils/utils'
import styles from '../base.less'

const Option = Select.Option
@connect(state => ({
  category: state.category,
}))
export default class Category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shop: false,
      record: {},
    }
  }
  componentDidMount() {
    if (isRefresh()) {
      this.props.dispatch({ type: 'category/fetch' })
    }
  }

  render() {
    const { list, total, page, loading, searchParam } = this.props.category
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 60,
        render: (text, record, index) => {
          return (
            <span>
              {index + 1}
            </span>
            )
          },
      },
      {
        title: '采购中心',
        dataIndex: 'procurementCenter',
        key: 'procurementCenter',
        width: 80,
      },
      {
        title: '用户货号',
        dataIndex: 'uItemNo',
        key: 'uItemNo',
        width: 100,
      },
      {
        title: '系统货号',
        dataIndex: 'sItemNo',
        key: 'sItemNo',
        width: 100,
      },
      {
        title: '店内码',
        dataIndex: 'shopItemCode',
        key: 'shopItemCode',
        width: 100,
      },
      {
        title: 'POS名称',
        dataIndex: 'posItemName',
        key: 'posItemName',
        width: 100,
      },
      {
        title: '规格',
        dataIndex: 'itemSpec',
        key: 'itemSpec',
        width: 100,
      },
      {
        title: '箱入数',
        dataIndex: 'inBox',
        key: 'inBox',
        width: 100,
      },
      {
        title: '过期时间(时)',
        dataIndex: 'warnTime',
        key: 'warnTime',
        width: 100,
      },
      {
        title: '生效日',
        dataIndex: 'ivalidDate',
        key: 'ivalidDate',
        width: 100,
      },
      {
        title: '属性',
        dataIndex: 'itemProperty',
        key: 'itemProperty',
        width: 100,
        render: (text) => {
          if (text === '01') {
            return <Tag color="#108ee9">解冻</Tag>
          } else if (text === '02') {
            return <Tag color="#f50">开封</Tag>
          } else {
            return <Tag color="#f50">外卖</Tag>
          }
        },
      },
      {
        title: '业务类型',
        dataIndex: 'operType',
        key: 'operType',
        width: 80,
        render: (text) => {
          if (text === '01') {
            return <Tag color="#108ee9">箱入</Tag>
          } else {
            return <Tag color="#f50">单件</Tag>
          }
        },
      },
      {
        title: '面板',
        dataIndex: 'itemType',
        key: 'itemType',
        width: 80,
        render: (text) => {
          switch(text) {
            case '01':
              return <Tag color="#108ee9">冰激凌</Tag>
            case '02':
              return <Tag color="#108ee9">豆浆</Tag>
            case '03':
              return <Tag color="#108ee9">关东煮</Tag>
            case '04':
              return <Tag color="#108ee9">哈烧机</Tag>
            case '05':
              return <Tag color="#108ee9">咖啡机</Tag>
            case '06':
              return <Tag color="#108ee9">蒸包</Tag>
            default:
              return <Tag color="#108ee9">热罐机</Tag>
          }
        },
      },
      {
        title: '装配',
        dataIndex: 'subType',
        key: 'subType',
        width: 80,
        render: (text) => {
          if (text === '01') {
            return <Tag color="#108ee9">散装</Tag>
          } else {
            return <Tag color="#f50">串装</Tag>
          }
        },
      },
      {
        title: '商品英文',
        dataIndex: 'itemEN',
        key: 'itemEN',
        width: 80,
      },
      {
        title: '价格',
        dataIndex: 'itemVal',
        key: 'itemVal',
        width: 100,
      },
    ]
    const actionBar = [
    ]
    const searchBar = [
      {
        decorator: 'uItemNo',
        components: (<Input placeholder="请输入用户货号" size="small" />),
      },
      {
        decorator: 'sItemNo',
        components: (<Input placeholder="请输入系统货号" size="small" />),
      },
      {
        decorator: 'shopItemCode',
        components: (<Input placeholder="请输入店内码" size="small" />),
      },
      {
        decorator: 'itemProperty',
        components: (
          <Select
            size="small"
            placeholder="请选择状态"
          >
            <Option value="01">解冻</Option>
            <Option value="02">开封</Option>
            <Option value="03">外卖</Option>
          </Select>
        ),
      },
    ]
    const tableProps = {
      total,
      ...page,
      columns,
      data: list,
      rowKey: 'id',
      actionBar,
      dispatch: this.props.dispatch,
      loading,
      namespace: 'category',
      searchParam,
      searchBar,
      scroll: { x: 1800 },
    }
    return (
      <div className={styles.tableList}>
        <PublicTable {...tableProps} />
      </div>
    )
  }
}
