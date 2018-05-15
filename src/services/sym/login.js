import request from '../../utils/request'
import config from '../../utils/config'

export async function fakeAccountLogin(params) {
  return request(`${config.APIV1}/sym/login`, {
    method: 'POST',
    body: params,
  })
}
