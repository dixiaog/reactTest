import React, { Component } from 'react'
import { Table, Checkbox } from 'antd'
import { connect } from 'dva'

/*
auto_no	自增编号
category_no	类目编号
category_name	类目名称
category_type	类目类型(0:标准类目; 1:自定义类目)
parent_category_no	父级类目编号
root_flag	是否根目录(0:否; 1:是)
enable_spec	是否启用规格(0:不启用; 1:启用)
spec_classification	规格分类(逗号分隔)
sort_order	排序号
category_status	资料状态(0:正常; 1:删除)
company_no	公司编号
ts	时间戳
 */

@connect(state => ({
  categoryTabel: state.categoryTabel,
}))
class CategoryTabel extends Component {
 constructor(props) {
   super(props)
   this.state = {
    // editRecord: {},
   }
 }
 componentDidMount() {
  this.props.dispatch({
    type: 'categoryTabel/fetch',
  })
  // getCategoryAndDeepChildrenCategoryNo({

  // }).then((json) => {
  //   console.log(json)
  // })
  // console.log(this.props)
}
    ondblclick = (text) => {
      // 解构复制等于this.props.handelTabelfunction[5]
      const [, , , , , handleSpecclassificationvis] = this.props.handelTabelfunction
      handleSpecclassificationvis(text)
    }
   handlea = (record, e) => {
    e.preventDefault()
    console.log('这是编辑的功能')
    this.props.handelTabelfunction[0](record)
  }
  handleas = (record, e) => {
    e.preventDefault()
    console.log('这是删除的功能', record)
    alert('shangchu')
  }
 handleass = (record, e) => {
  e.preventDefault()
  console.log('e', e)
  console.log(record)
}
  showTotal = (e, page) => {
    console.log('e', e, 'page', page)
  }
  pageonChange = (e) => {
  console.log(e)
  }

 render() {
const columns = [{
  title: '序号',
  dataIndex: 'key',
  render: text => <a>{text}</a>,
  width: '15%',
}, {
  title: '名称(双击进入子分类列表)',
  dataIndex: 'categoryName',
  width: '20%',
  render: (text, record) => {
    return (
      <span onDoubleClick={this.ondblclick.bind(this, record)}>{text}</span>
    )
  },
}, {
  title: '排序',
  dataIndex: 'sortOrder',
  width: '20%',
},
{
  title: '状态',
  dataIndex: 'categoryStatus',
  width: '20%',
  render: (text) => {
    switch (text) {
      case (0):
        return <Checkbox checked={true} />
      case (1):
        return <Checkbox />
      default: 
        return ''
      }
  },
},
{
  title: '操作',
  dataIndex: 'address',
  width: '20%',
  render: (text, record) => {
      return (
        <a style={{ marginRight: 5 }}>
          <span onClick={this.handlea.bind(this, record)}>编辑&nbsp;</span>
          <span onClick={this.handleass.bind(this, record)}>&nbsp;编辑类目规格&nbsp;</span>
          <span onClick={this.handleas.bind(this, record)}>&nbsp;删除</span>
        </a>
        )
    },
}]
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    this.props.hendelTabel(selectedRows)
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User',
  }),
}
const pagePropsEx = Object.assign({
  showTotal: () => `显示${1}到${20}条记录，总共${24}条记录`,
  showSizeChanger: true,
  defaultPageSize: 20,
  pageSizeOptions: ['20', '50'],
  showQuickJumper: true,
  onShowSizeChange: this.showTotal,
  onChange: this.pageonChange,
  size: 'small',
  // defaultCurrent: this.state.rows,
  // total: this.props.pagination.total,
})
        return (
          // <div style={{ width: '100%', height: 1000, minHeight: 500 }}>
          <Table
            // scroll={{ x: true, y: 300 }}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.props.Treedata}
            pagination={pagePropsEx}
            style={{ height: 800 }}
          />
          // </div>
        )
    }
}
//  x: xscoll + 100, y: document.body.clientHeight - 300
export default CategoryTabel
