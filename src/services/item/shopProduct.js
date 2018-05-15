import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'


// 店铺商品资料
export async function getShopProduct(params) {
    return request(`${config.APIV1}/prodm/shop/sku/getShopSkuData`, {
        method: 'POST',
        body: {
            ...params,
            },
    })
}

// 获取店铺名
export async function getShopName() {
    return request(`${config.APIV1}/prodm/shop/sku/getAllShop`, {
        method: 'POST',
    })
}

// 同步店铺商品资料
export async function syncShopSku(params) {
    return request(`${config.APIV1}/prodm/shop/sku/syncShopSku`, {
        method: 'POST',
        body: params,
    })
}

// 清除店铺已删除链接
export async function deleteLink(params) {
    return request(`${config.APIV1}/prodm/shop/sku/deleteLink`, {
        method: 'POST',
        body: params,
    })
}

// 编辑商品编码,款式编码
export async function editSave(params) {
    return request(`${config.APIV1}/prodm/shop/sku/editSave`, {
        method: 'POST',
        body: params,
    })
}

// 导出重复铺货商品
export async function exportRepeatShopSku(params) {
    return fileExport(`${config.APIV1}/prodm/shop/sku/exportRepeatShopSku`, {
        method: 'POST',
        body: params,
    })
}

// 导入店铺商品资料
export async function uploadShopSku(params) {
    return request(`${config.APIV1}/prodm/shop/sku/uploadShopSku`, {
        method: 'POST',
        body: params,
    })
}

// 导出有库存未铺货商品
export async function exportNoDistributionShopSku(params) {
    return fileExport(`${config.APIV1}/prodm/shop/sku/exportNoDistributionShopSku`, {
        method: 'POST',
        body: params,
    })
}

// 导出店铺商品资料
export async function exportShopSku(params) {
    return fileExport(`${config.APIV1}/prodm/shop/sku/exportShopSku`, {
        method: 'POST',
        body: params,
    })
}
