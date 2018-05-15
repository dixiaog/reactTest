/*
 * @Author: Chen Xinjie
 * @Date: 2017-12-28 13:33:07
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-02-26 10:59:03
 * 公司资料维护
 */
import request from '../../utils/request'
import config from '../../utils/config'


export async function Save(params) {
  return request(`${config.APIV1}/basem/company/addSave`, {
    method: 'POST',
    body: params,
  })
}

export async function Update(params) {
  return request(`${config.APIV1}/basem/company/viewSave`, {
    method: 'POST',
    body: params,
  })
}

export async function GetViewData(params) {
  return request(`${config.APIV1}/basem/company/viewData`, {
    method: 'POST',
    body: params,
  })
}

export async function GetCompanys(params) {
  return request(`${config.APIV1}/basem/company/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function Enable(params) {
  return request(`${config.APIV1}/basem/company/enableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
