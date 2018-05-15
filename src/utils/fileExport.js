/*
 * @Author: chenjie
 * @Date: 2018-01-10 13:32:58
 * 文件导出
 */
import fetch from 'dva/fetch'
import { routerRedux } from 'dva/router'
import { notification } from 'antd'
import { getLocalStorageItem } from './utils'

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  if (response.status === 401) {
    window.localStorage.clear()
    notification.error({
      message: '请求失败',
      description: '登录授权已失效',
    })
    routerRedux.push('/user/login')
    setTimeout(window.location.reload(), 10000)
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

export default function fileExport(url, options) {
  const defaultOptions = {
    mode: 'cors',
  }
  const newOptions = { ...defaultOptions, ...options }
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    const nickName = getLocalStorageItem('nickName') ? getLocalStorageItem('nickName') : ''
    const userName = getLocalStorageItem('userName') ? getLocalStorageItem('userName') : ''
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Basic ${getLocalStorageItem('token')}`,
      'NickName': `${encodeURI(nickName)}`,
      'UserName': `${encodeURI(userName)}`,
      'CompanyNo': `${getLocalStorageItem('companyNo')}`,
      'UserNo': `${getLocalStorageItem('userNo')}`,
      ...newOptions.headers,
    }
    newOptions.body = JSON.stringify(newOptions.body)
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
       response.blob().then((blob) => {
        const a = document.createElement('a')
        const downUrl = window.URL.createObjectURL(blob)
        const filename = JSON.parse(newOptions.body).fileName
        a.href = downUrl
        a.download = filename
         // 触发点击
        document.body.appendChild(a)
        a.click()
        // 然后移除
        document.body.removeChild(a)
        
        window.URL.revokeObjectURL(downUrl)
      })
    })
    .catch((error) => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        })
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.message,
        })
      }
      return error
    })
}
