/*
 * @Author: chenjie
 * @Date: 2018-01-08 17:28:29
 * 页面自定义
 */
import request from '../../utils/request'
import config from '../../utils/config'

export async function pageCusSearch(params) {
    return request(`${config.APIV1}/sym/pageCustom/getPageCustom`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}

export async function pageCusEditSave(params) {
    return request(`${config.APIV1}/sym/pageCustom/editSave`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}

export async function pageCusSave(params) {
    return request(`${config.APIV1}/sym/pageCustom/save`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}
