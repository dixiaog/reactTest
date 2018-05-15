import request from '../../utils/request'
import config from '../../utils/config'

export async function getMenus(params) {
  return request(`${config.APIV1}/sym/menu/list`, {
    method: 'POST',
    body: params,
  })
}

export async function saveMenus(params) {
  return request(`${config.APIV1}/sym/menu/save`, {
    method: 'POST',
    body: params,
  })
}

export async function editMenus(params) {
  return request(`${config.APIV1}/sym/menu/edit`, {
    method: 'POST',
    body: params,
  })
}

export async function editEnableFlag(params) {
  return request(`${config.APIV1}/sym/menu/modifyEnableFlag`, {
    method: 'POST',
    body: params,
  })
}
