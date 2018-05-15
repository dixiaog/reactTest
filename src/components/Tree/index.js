import React from 'react' // eslint-disable-line no-unused-vars
import { Table } from 'antd'

class Sree extends React.Component {
  state = {
    selectedRowKeys: [],
    // range: 20,
    // currentResult: 8,
    // total: 20,
    // page: 20,
    rows: 1,
    // totalPage: 20,
  }
    componentWillReceiveProps() {
      console.log(this.props)
      this.setState({
        // currentResult: this.props.pagination.currentResult,
        // total: this.props.pagination.total,
        // page: this.props.pagination.page,
        rows: this.props.pagination.rows,
        // totalPage: this.props.pagination.totalPage,
        // data: this.props.Sreedata,
        columns: this.props.columns,
      })
    }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const selected = selectedRowKeys
    console.log('selectedRowKeys', selectedRowKeys, 'selectedRows', selectedRows)
    this.props.DeletePosition(selectedRows)
    this.setState({ selectedRowKeys: selected })
  }
  showTotal = (total, range) => {
    // console.log(showTotal)
    // this.setState({
    //   range: range,
    //   total: total,
    // })
    this.props.handelshow(range)
    this.props.onSelect(total, range)
  }
  pageonChange = (page, size) => {
    this.props.onSelect(page, size)
    this.props.handelshow(page, size)
    console.log('page:', page, 'size:', size)
  }
  handelshowTotal = (currentResult, total) => {
    console.log('currentResult', currentResult, 'total', total)
    return `显示${total[0]}到${total[1]}条记录，总共${currentResult}条记录`
  }
  render() {
    console.log('this.props.Sreedata', this.props.Sreedata)
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const pagePropsEx = Object.assign({
      showSizeChanger: true,
      defaultPageSize: 20,
      pageSizeOptions: ['20', '50', '100'],
      showQuickJumper: true,
      onShowSizeChange: this.showTotal,
      onChange: this.pageonChange,
      size: 'small',
      showTotal: this.handelshowTotal,
      // defaultCurrent={6} total={500}
      defaultCurrent: this.state.rows,
      total: this.props.pagination.total,
      })
    return (
      <div style={{ width: '100%', height: 700, minHeight: 500 }}>
        <Table scroll={{ x: '100%', y: 600 }} rowSelection={rowSelection} columns={this.state.columns} dataSource={this.props.Sreedata} pagination={pagePropsEx} rowKey={record => record.autoNo} />
      </div>
    )
  }
}
export default Sree
