import request from '../../utils/request'
import config from '../../utils/config'

export async function getParamList(params) {
  return request(`${config.APIV1}/sym/param/list`, {
    method: 'POST',
    body: params,
  })
}

export async function deployParam(params) {
  return request(`${config.APIV1}/sym/param/deploy`, {
    method: 'POST',
    body: params,
  })
}
