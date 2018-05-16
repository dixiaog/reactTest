import { getUrlParams } from '../../utils'

export function getList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
        id: `00-${i}`,
        procurementCenter: '10',
        uItemNo: '0135009',
        sItemNo: '20355407',
        shopItemCode: '20135003',
        posItemName: '鲜肉粽',
        itemSpec: '140g',
        inBox: '100',
        warnTime: '48',
        ivalidDate: '2015-09-09',
        itemProperty: Math.random() * 10 > 5 ? '01' : '02',
        operType: Math.random() * 10 > 5 ? '01' : '02',
        itemType: Math.random() * 10 > 5 ? '01' : '02',
        subType: Math.random() * 10 > 5 ? '01' : '02',
        itemEN: 'English',
        itemVal: '10',
        // enable: Math.random() * 10 > 5 ? 0 : 1,
        // mobile: '13913721983',
        // email: 'xxxQQ.com',
        })
    }
    if (searchParam) {
      if (searchParam.username) { // 款式码
        list = list.filter(ele => ele.username.indexOf(searchParam.username) > -1)
      }
    }
    return { list, total: list.length }
}

export function getCategorytList(req, res, u, b) {
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
  getCategorytList,
}
