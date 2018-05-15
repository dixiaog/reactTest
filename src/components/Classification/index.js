/*
 * @Author: Wupeng
 * @Date: 2017-1-2 10:04:11
 * @Last Modified by;
 * 商品类目左侧列表详情
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { Tree } from 'antd'
import styes from './index.less'
import { getRootDirectoryByUser, getChildrenParallelCategory } from '../../services/category/category'

const TreeNode = Tree.TreeNode

class Classification extends Component {
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
      treeData: [],
      expandedKeys: [],
      autoExpandParent: true,
    }, () => {
      this.setState({
        treeData: nextProps.treeData,
        expandedKeys: nextProps.expandedKeys,
        autoExpandParent: nextProps.autoExpandParent,
      })
    })

  }
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve()
        return
      }
      if (treeNode.props.dataRef.title === '根目录') {
        getRootDirectoryByUser({}).then((data) => {
        if (data === null) {
          this.setState({
            treeData: [
              { title: '根目录', key: '0', isLeaf: true },
            ],
          })
          resolve()
         } else {
          const json = data
          for (let i = 0; i < json.list.length; i++) {
            json.list[i].title = json.list[i].categoryName
            json.list[i].key = json.list[i].categoryNo
          }
          treeNode.props.dataRef.children = json.list
          this.setState({
            treeData: [...this.state.treeData],
          })
          resolve()
        }
      })
      } else {
          getChildrenParallelCategory({
            categoryNo: treeNode.props.dataRef.categoryNo,
        }).then((data) => {
          const json = data
          for (let i = 0; i < json.list.length; i++) {
            json.list[i].title = json.list[i].categoryName
            json.list[i].key = json.list[i].categoryNo
          }
          treeNode.props.dataRef.children = json.list
          this.setState({
            treeData: [...this.state.treeData],
          })
          resolve()
        })
      }
    })
  }
  onSelect = (selectedKeys, e) => {
    this.props.handleoldtree(selectedKeys, e.node.props.dataRef)
  }
  handelonExpand = (expandedKeys) => {
    this.props.handelonExpand1(expandedKeys)
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
      const chiget = document.body.clientHeight
        return (
          <div style={{ height: chiget - 200, width: '90%', overflow: 'auto' }} className={styes.tableaToolbar}>
            <Tree
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              onExpand={this.handelonExpand}
              loadData={this.onLoadData}
              onSelect={this.onSelect}
            >
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
          </div>
        )
    }
}

export default Classification
