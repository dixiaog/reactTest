import React, { Component } from 'react'
import { Button, List, Modal, Steps, Card } from 'antd'
import { connect } from 'dva'
import { getAuthorize } from '../../../services/system'
import config from '../../../utils/config'
import { getLocalStorageItem } from '../../../utils/utils'

const Step = Steps.Step
// const sites = [{
//   icon: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
//   siteNo: 0,
//   siteName: '淘宝',
// }, {
//   icon: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
//   siteNo: 1,
//   siteName: '京东',
// }, {
//   icon: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
//   siteNo: 2,
//   siteName: '天猫',
// }]
@connect(state => ({
  shops: state.shops,
}))
export default class ExpressModal extends Component {
    constructor(props) {
      super(props)
      this.state = {
        selectedItem: -1,
        item: {},
        sites: [],
        authorizeAddress: '',
      }
    }
    componentWillMount() {
      this.setState({
        companyNo: getLocalStorageItem('companyNo'),
        distributorNo: getLocalStorageItem('distributorNo'),
      })
      getAuthorize({ pageSize: 1000, current: 1, enableStatus: 1 }).then((json) => {
        if (json.list.length) {
          this.setState({
            sites: json.list,
          })
        }
      })
    }
    handleOk = () => {
      this.props.addNewExpress(this.state.selected)
      this.props.hidden()
    }
    handleCancel = () => {
      this.props.hidden()
    }
    chooseCard = (item, i) => {
      this.setState({
        selectedItem: i,
        authorizeAddress: item.authorizeAddress,
        item,
      })
    }
    nextStep = () => {
      if (this.state.item.siteName === '唯品会') {
        this.props.nextStep(this.state.item, '')
      } else {
        const urls = this.state.authorizeAddress + '&companyNo=' + this.state.companyNo + '&distributorNo=' + this.state.distributorNo
        const win = window.open(urls)
        const loop = setInterval(() => {
          console.log('winwinwin', win)
          console.log('looplooploop', loop)
          if (win.closed) {
            // const { item } = this.state
            clearInterval(loop)
            // if (win.document !== undefined) {
            //   const url = win.document.URL
            //   if (url !== 'about:blank') {
            //     // const c = url.split('code')[1].split('=')[1].split('&')[0]
            //     // this.props.nextStep(item, c)
            //     this.props.dispatch({ type: 'shops/fetch' })
            //     this.props.hidden()
            //   }
            // }
            this.props.dispatch({ type: 'shops/fetch' })
            this.props.hidden()
            // } else {
            //   this.props.nextStep(item, '')
            // }
            // this.props.nextStep(item, '')
          }
        }, 1000)
      }
    }
    render() {
      const { selectedItem } = this.state
      return (
        <div>
          <Modal
            title="选择站点"
            maskClosable={false}
            visible={this.props.visiable}
            onCancel={this.handleCancel}
            bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
            footer={[
              <Button key="back" onClick={this.handleCancel}>取消</Button>,
            ]}
          >
            <Steps current={0}>
              <Step title="选择站点" />
              <Step title="填写店铺信息" />
            </Steps>
            <List
              style={{ marginTop: 10, marginBottom: 10 }}
              grid={{ gutter: 16, column: 4 }}
              dataSource={this.state.sites}
              renderItem={(item, i) => (
                <List.Item>
                  <Card
                    onClick={this.chooseCard.bind(this, item, i)}
                    bordered={selectedItem === i}
                    style={{ borderColor: selectedItem === i ? '#000' : '#fff' }}
                    hoverable
                    cover={<img alt={item.siteName} src={`${config.picTureAddress}/${item.siteIcon}/400x400.jpg`} />}
                  />
                </List.Item>
                )}
            />
            <Button type="primary" disabled={selectedItem === -1} onClick={this.nextStep} size={config.InputSize} style={{ float: 'right' }}>
                下一步
            </Button>
          </Modal>
        </div>)
    }
  }
