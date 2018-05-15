import request from '../../utils/request'
import requestExtension from '../../utils/requestExtension'
import config from '../../utils/config'

export async function getExpressconfig(params) {
  return request(`${config.APIV1}/prodem/logistics_express/getExpressconfig`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function getExpresscorp() {
    return request(`${config.APIV1}/prodem/logistics_express/getExpresscorp`, {
        method: 'POST',
    })
}

export async function getCnWayBillSubscription(params) {
    return requestExtension(`${config.APIV1}/prodem/logistics_express/getCnWayBillSubscription`, {
        method: 'POST',
        body: params,
    })
}

export async function insertExpressconfig(params) {
    return request(`${config.APIV1}/prodem/logistics_express/insertExpressconfig`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

export async function expressType(params) {
    return request(`${config.APIV1}/prodem/logistics_express/expressType`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

export async function updateExpress(params) {
    return request(`${config.APIV1}/prodem/logistics_express/updateExpressconfig`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

export async function insertFreightOrAreafreight(params) {
    return request(`${config.APIV1}/prodem/logistics_express/insertFreightOrAreafreight`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

export async function getInfoByExpressConfigNo(params) {
    return request(`${config.APIV1}/prodem/logistics_express/getInfoByExpressConfigNo`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

export async function delExpressconfigOrPm(params) {
    return request(`${config.APIV1}/prodem/logistics_express/delExpressconfigOrPm`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}
