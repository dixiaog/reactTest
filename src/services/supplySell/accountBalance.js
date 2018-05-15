import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'

export async function getCreditList(params) {
    return request(`${config.APIV1}/dm/dmfundsummary/getCreditList`, {
        method: 'POST',
        body: params,
    })
}

export async function getFundAuditList(params) {
    Object.assign(params, {
        startTime: params.startTime ? params.startTime.format('YYYY-MM-DD') : undefined,
        endTime: params.endTime ? params.endTime.format('YYYY-MM-DD') : undefined,
        })
    return request(`${config.APIV1}/dm/dmfundsummary/getFundAuditList`, {
        method: 'POST',
        body: params,
    })
}

export async function getContactDetails(params) {
    Object.assign(params, {
        startTime: params.startTime ? params.startTime.format('YYYY-MM-DD') : undefined,
        endTime: params.endTime ? params.endTime.format('YYYY-MM-DD') : undefined,
        })
    return request(`${config.APIV1}/dm/dmfundsummary/getContactDetails`, {
        method: 'POST',
        body: params,
    })
}

export async function addDeposit(params) {
    return request(`${config.APIV1}/dm/dmfundsummary/addDeposit`, {
        method: 'POST',
        body: params,
    })
}

export async function exportDisInfo(params) {
    return fileExport(`${config.APIV1}/dm/dmfundsummary/exportDisInfo`, {
        method: 'POST',
        body: params,
    })
}

export async function exportContactDetails(params) {
    return fileExport(`${config.APIV1}/dm/dmfundsummary/exportContactDetails`, {
        method: 'POST',
        body: params,
    })
}
// 通过供销商编号查分销商编号
export async function getDistributorList(params) {
    return request(`${config.APIV1}/dm/dmfundsummary/getDistributorList`, {
        method: 'POST',
        body: params,
    })
}

// 审核
export async function fundAuditSelect(params) {
    return request(`${config.APIV1}/dm/dmfundsummary/fundAuditSelect`, {
        method: 'POST',
        body: params,
    })
}
