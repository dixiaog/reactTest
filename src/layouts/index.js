import { LocaleProvider } from 'antd'
// import enUS from 'antd/lib/locale-provider/en_US'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import withRouter from 'umi/withRouter'
import App from './app'

export default withRouter((props) => {
  console.log('props', props)
  return (
    <LocaleProvider locale={zhCN}>
      <App>
        { props.children }
      </App>
    </LocaleProvider>
  )
})
