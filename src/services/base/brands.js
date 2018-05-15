/*
 * @Author: Chen Xinjie
 * @Date: 2017-12-28 15:57:28
 * @Last Modified by: Chen Xinjie
 * @Last Modified time: 2018-01-18 21:05:07
 * 品牌资料维护
 */
import request from '../../utils/request'
import config from '../../utils/config'

export async function Save(params) {
  return request(`${config.APIV1}/basem/brand/save`, {
    method: 'POST',
    body: params,
  })
}

export async function Update(params) {
  return request(`${config.APIV1}/basem/brand/update`, {
    method: 'POST',
    body: params,
  })
}

export async function GetViewData(params) {
  return request(`${config.APIV1}/basem/brand/getBrandDataByNo`, {
    method: 'POST',
    body: params,
  })
}

export async function GetBrands(params) {
  return request(`${config.APIV1}/basem/brand/getBrandData`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function Enable(params) {
  return request(`${config.APIV1}/basem/brand/updateEnableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
