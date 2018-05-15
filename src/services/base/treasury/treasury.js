
/*
 * @Author: Wupeng
 * @Date: 2018-1-8 15:57:28
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-04 15:02:00
 * 销售出库
 */
import request from '../../../utils/request'
import config from '../../../utils/config'
import fileExport from '../../../utils/fileExport'

// /wm/wmDelivery/getInfo
// pc端 出库单查询


// /prodem/category/delectAllCategory 清空所有分类
export async function list(params) {
  return request(`${config.WMS}/wm/wmDelivery/getInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// exportSkus  导出excel
export async function exportDB(params) {
  return fileExport(`${config.WMS}/wm/wmDelivery/exportDB`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
