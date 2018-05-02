import React from 'react'
import { Route } from 'dva/router'
// import { getRouteData } from '../utils/utils'

class PrintLayout extends React.PureComponent {
  render() {
    return (
      <div>
        {
          this.props.getRouteData('PrintLayout').map(item =>
            (
              <Route
                exact={item.exact}
                key={item.path}
                path={item.path}
                component={item.component}
              />
            )
          )
        }
      </div>
    )
  }
}

export default PrintLayout
