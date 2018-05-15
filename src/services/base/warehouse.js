import request from '../../utils/request'
import config from '../../utils/config'

export async function getWarehouse(params) {
  return request(`${config.APIV1}/basem/warehouse/getWarehouseData`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function Enable(params) {
  return request(`${config.APIV1}/basem/warehouse/updateEnableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function Save(params) {
  return request(`${config.APIV1}/basem/warehouse/save`, {
    method: 'POST',
    body: params,
  })
}

export async function GetViewData(params) {
  return request(`${config.APIV1}/basem/warehouse/getViewData`, {
    method: 'POST',
    body: params,
  })
}

export async function getWarehouseEnum(params) {
  return request(`${config.APIV1}/basem/warehouse/getWarehouse`, {
    method: 'POST',
    body: params,
  })
}

export async function getAllProvinceEnum(params) {
  return request(`${config.APIV1}/basem/warehouse/getAllProvince`, {
    method: 'POST',
    body: params,
  })
}

export async function getAllRegionEnum(params) {
  return request(`${config.APIV1}/basem/warehouse/getAllRegion`, {
    method: 'POST',
    body: params,
  })
}
