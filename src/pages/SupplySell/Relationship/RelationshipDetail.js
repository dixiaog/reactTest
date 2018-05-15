/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 13:36:21
 * 分销商详情
 */

import React, { Component } from 'react'
import { Modal, Button, Card, Col } from 'antd'

export default class RelationshipDetail extends Component {
  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    hideModal()
  }
  render() {
    const { show } = this.props
    const { distributorNo, distributorName, distributorAcronyms, contacts, telNo, province, city, county,
      address, relationshipType, distributorLevel, status, inventorySync, authorizeShopNum } = this.props.record
    const Status = status === 0 ? '等待审核' : status === 1 ? '已生效' : status === 2 ? '已作废' : status === 3 ? '已冻结' : '被拒绝'
    const InventorySync = inventorySync === 0 ? '不同步' : '同步'
    const { reward, amerce, deposit, availableBalance } = this.props.detail
    return (
      <div>
        <Modal
          title="供销|分销详情"
          visible={show}
          width={740}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden', padding: 0 }}
          maskClosable={false}
          footer={[
            <Button key="cancel" onClick={this.hideModal}>关闭</Button>,
          ]}
        >
          <span>
            <Card title="基本信息" style={{ width: '96%', margin: 'auto', marginTop: 10, marginBottom: 10 }}>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>分销商编号:<span style={{ marginLeft: '10px' }}>{distributorNo}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>分销名称:<span style={{ marginLeft: '10px' }}>{distributorName}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>助记符:<span style={{ marginLeft: '10px' }}>{distributorAcronyms}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>联系人:<span style={{ marginLeft: '10px' }}>{contacts}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>电话:<span style={{ marginLeft: '10px' }}>{telNo}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>地址:<span style={{ marginLeft: '10px' }}>{province}{city}{county}{address}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>分销类型:<span style={{ marginLeft: '10px' }}>{relationshipType === 0 ? '内部创建' : '外部创建'}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>分销级别:<span style={{ marginLeft: '10px' }}>{distributorLevel}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>状态:<span style={{ marginLeft: '10px' }}>{Status}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>库存同步否:<span style={{ marginLeft: '10px' }}>{InventorySync}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>店铺授权数:<span style={{ marginLeft: '10px' }}>{authorizeShopNum}</span></Col>
            </Card>
            <Card title="奖金信息" style={{ width: '96%', margin: 'auto', marginTop: 10, marginBottom: 10 }}>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>奖金:<span style={{ marginLeft: '10px' }}>{reward}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>罚款:<span style={{ marginLeft: '10px' }}>{amerce}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>保证金:<span style={{ marginLeft: '10px' }}>{deposit}</span></Col>
              <Col span={8} style={{ marginTop: '5px', marginBottom: '5px' }}>资金余额:<span style={{ marginLeft: '10px' }}>{availableBalance}</span></Col>
            </Card>
          </span>
        </Modal>
      </div>)
  }
}
