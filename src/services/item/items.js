/*
 * @Author: chenjie
 * @Date: 2018-01-06 14:49:57
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-03 09:49:39
 * 商品维护接口
 */
import request from '../../utils/request'
import fileExport from '../../utils/fileExport'
import config from '../../utils/config'

export async function getItems(params) {
    return request(`${config.APIV1}/prodm/sku/getSkuData`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}

// 获取品牌
export async function getAllBrand(params) {
    return request(`${config.APIV1}/prodm/sku/getAllBrand`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}

export async function save(params) {
    return request(`${config.APIV1}/prodm/sku/save`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}

export async function enableStatus(params) {
    return request(`${config.APIV1}/prodm/sku/enableStatus`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}

export async function deleteRows(params) {
    return request(`${config.APIV1}/prodm/sku/delete`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}

export async function inventorySync(params) {
    return request(`${config.APIV1}/prodm/sku/inventorySync`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}

export async function exportSkuItem(params) {
    return fileExport(`${config.APIV1}/prodm/sku/exportSku`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}

export async function getSkuDataByPNo(params) {
    return request(`${config.APIV1}/prodm/sku/getSkuDataByPNo`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}

export async function getAllSupplier(params) {
    return request(`${config.APIV1}/prodm/sku/getAllSupplier`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }

