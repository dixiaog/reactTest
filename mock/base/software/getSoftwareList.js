import { getUrlParams } from '../../utils'

export function getList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
        id: `00-${i}`,
        appname: '全家APP',
        appversion: `00-${i}`,
        productname: `最新版本-${i}`,
        })
    }
    if (searchParam) {
      if (searchParam.username) { // 款式码
        list = list.filter(ele => ele.username.indexOf(searchParam.username) > -1)
      }
    }
    return { list, total: list.length }
}

export function getSoftwareList(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 20
    const result = getList(count, searchParam)
    if (res && res.json) {
      res.json({
        success: true,
        data:result,
        errorMessage: '',
      })
    } else {
      return {
        success: true,
        data:result,
        errorMessage: '',
      }
    }
}

export default {
  getSoftwareList,
}
