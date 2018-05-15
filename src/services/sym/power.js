import request from '../../utils/request'
import config from '../../utils/config'

export async function getPowerlist(params) {
  return request(`${config.APIV1}/sym/permission/list`, {
    method: 'POST',
    body: params,
  })
}
