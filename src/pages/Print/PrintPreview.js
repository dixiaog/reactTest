import React from 'react'
import { connect } from 'dva'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Container from './Container'
import { getUrlParam, getLocalStorageItem } from '../../utils/utils'


@DragDropContext(HTML5Backend)
@connect(state => ({
  printModifyView: state.printModifyView,
}))
export default class PrintPreview extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        printData: {
          itemName: 'XX羽绒服',
          sku: 'yrf-1123',
          num: '12',
          weight: '9.08',
        },
      }
    }

    componentDidMount() {
      this.props.dispatch({
        type: 'printModifyView/getPrintTemp',
        payload: { autoNo: getUrlParam('autoNo') },
      })
    }

    render() {
        return (
          <div>
            {/* <PrintHeader {...JSON.parse(getLocalStorageItem('printPreview'))} isPreview item={{}} dispatch={this.props.dispatch} /> */}
            <Container {...this.props.printModifyView} isPreview printData={JSON.parse(getLocalStorageItem('printData'))} />
          </div>
        )
      }
}
