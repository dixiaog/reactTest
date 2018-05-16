import { getUrlParams } from '../../utils'

export function getList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
          autoNo: `${i}`,
          title: `角色名称-${i}`,
          roleName: `角色简称-${i}`,
          powerlist: `资源-${i}`,
        })
    }
    if (searchParam) {
      if (searchParam.title) { // 款式码
        list = list.filter(ele => ele.title.indexOf(searchParam.title) > -1)
      }
      if (searchParam.roleName) { // 款式码
        list = list.filter(ele => ele.roleName.indexOf(searchParam.roleName) > -1)
      }
    }
    return { list, total: list.length }
}

export function getRoleList(req, res, u, b) {
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
        data: result,
        errorMessage: '',
      })
    } else {
      return {
        success: true,
        data: result,
        errorMessage: '',
      }
    }
}

export default {
  getRoleList,
}
