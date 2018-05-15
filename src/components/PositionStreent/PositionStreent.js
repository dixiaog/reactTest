import React, { Component } from 'react'
import { connect } from 'dva'
import { Tree } from 'antd'
import styes from './PositionString.less'
import { selStoragelocationGroupByhlcg } from '../../services/position/position'

const TreeNode = Tree.TreeNode

@connect(state => ({
  position: state.position,
}))
class PositionStreent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        treeData: [],
        expandedKeys: [],
        autoExpandParent: true,
      }
    }
    componentWillReceiveProps(nextProps) {
      this.setState({
        autoExpandParent: nextProps.autoExpandParent,
        expandedKeys: nextProps.expandedKeys,
        treeData: [],
      }, () => {
        this.setState({
          treeData: nextProps.treeData,
        })
      })

    }
    onSelect = (selectedKeys, info) => {
      if (selectedKeys[0].indexOf('-') === -1) {
        this.props.hanselect(info.node.props.dataRef.locationNo.split('-')[0])
      } else {
        this.props.hanselect(selectedKeys[0])
      }
    }
    onLoadData = (treeNode) => {
      const payload = treeNode.props.dataRef
      return new Promise((resolve) => {
        if (treeNode.props.children) {
          resolve()
          return
        }
        selStoragelocationGroupByhlcg({
          ...payload,
        }).then((json) => {
          const data = json
          for (let i = 0; i < data.length; i++) {
            if (data[i].rowNo !== null && data[i].columnNo === null && data[i].layerNo === null && data[i].gridNo === null) {
              data[i].title = `第${data[i].rowNo}行`
              data[i].key = `${data[i].areaNo}-${data[i].rowNo}`
            } else if (data[i].rowNo !== null && data[i].columnNo !== null && data[i].layerNo === null && data[i].gridNo === null) {
              data[i].title = `第${data[i].columnNo}列`
              data[i].key = `${data[i].areaNo}-${data[i].rowNo}-${data[i].columnNo}`
            } else if (data[i].rowNo !== null && data[i].columnNo !== null && data[i].layerNo !== null && data[i].gridNo === null) {
              data[i].title = `第${data[i].layerNo}层`
              data[i].key = `${data[i].areaNo}-${data[i].rowNo}-${data[i].columnNo}-${data[i].layerNo}`
            } else if (data[i].rowNo !== null && data[i].columnNo !== null && data[i].layerNo !== null && data[i].gridNo !== null) {
              data[i].title = `第${data[i].gridNo}格`
              data[i].key = `${data[i].areaNo}-${data[i].rowNo}-${data[i].columnNo}-${data[i].layerNo}-${data[i].gridNo}`
            }
          }
          treeNode.props.dataRef.children = data
          this.setState({
            treeData: [...this.state.treeData],
          })
          resolve()
        })
        
      })
      }
      onExpand = (expandedKeys) => {
       this.props.onExpand1(expandedKeys)
      }
      renderTreeNodes = (data) => {
        return data.map((item) => {
          if (item.children) {
            return (
              <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
              </TreeNode>
            )
          }
          return <TreeNode {...item} dataRef={item} />
        })
      }

      render() {
          return (
            <div style={{ overflow: 'auto', height: 600 }} className={styes.scrollbar}>
              <Tree
                loadData={this.onLoadData}
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onSelect={this.onSelect}
              >
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>
            </div>
          )
      }
}
export default PositionStreent
