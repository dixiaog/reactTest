/*
 * @Author: Chen Xinjie
 * @Date: 2017-12-28 13:32:33
 * @Last Modified by: Chen Xinjie
 * @Last Modified time: 2018-01-20 15:27:55
 * 商品库容资料
 */

import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'

export async function GetSkus(params) {
  return request(`${config.APIV1}/prodem/skus/searchSkusInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function Enable(params) {
  return request(`${config.APIV1}/prodem/skus/enableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function ExportSku(params) {
  return fileExport(`${config.APIV1}/prodem/skus/exportSkus`, {
      method: 'POST',
      body: {
      ...params,
      },
  })
}

export async function Update(params) {
  return request(`${config.APIV1}/prodem/skus/updateSku`, {
      method: 'POST',
      body: {
      ...params,
      },
  })
}
