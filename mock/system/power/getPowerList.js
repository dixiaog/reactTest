import { getUrlParams } from '../../utils'

export function getList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
          id: i,
          groupname: `群组-${i}`,
          powerName: `名称-${i}`,
          title: `简称-${i}`,
          routeUrl: `路由-${i}`,
          remark: `备注-${i}`,
          menuId: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 2 : 1) : 0,
        })
    }
    if (searchParam) {
      if (searchParam.groupname) {
        list = list.filter(ele => ele.groupname.indexOf(searchParam.groupname) > -1)
      }
      if (searchParam.powerName) {
        list = list.filter(ele => ele.powerName.indexOf(searchParam.powerName) > -1)
      }
      if (searchParam.title) {
        list = list.filter(ele => ele.title.indexOf(searchParam.title) > -1)
      }
    }
    return { list, total: list.length }
}

export function getPowerList(req, res, u, b) {
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
      res.json(result)
    } else {
      return result
    }
}

export default {
  getPowerList,
}