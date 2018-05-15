import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'
import requestExtension from '../../utils/requestExtension'

// 商品库存列表
export async function getItemInv(params) {
    return request(`${config.APIV1}/prodm/sku/inventory/getSkuInventoryData`, {
        method: 'POST',
        body: { ...params },
    })
  }

// 商品库存编辑保存
export async function editSave(params) {
    return request(`${config.APIV1}/prodm/sku/inventory/editSave`, {
        method: 'POST',
        body: params,
    })
}

// 商品库存重算在途
export async function recalculation() {
    return requestExtension(`${config.APIV1}/prodm/sku/inventory/backOnWayNum`, {
        method: 'POST',
    })
}

// 商品库存清除0库存资料
export async function cleanInv(params) {
    return request(`${config.APIV1}/prodm/sku/inventory/deleteNullInventory`, {
        method: 'POST',
        body: params,
    })
}

// 商品库存导出所有符合条件的单据
export async function exportItem(params) {
    return fileExport(`${config.APIV1}/prodm/sku/inventory/exportSku`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}

// 商品库存清空所有商品的安全库存
export async function clearAll(params) {
    return request(`${config.APIV1}/prodm/sku/inventory/deleteSafetyNum`, {
        method: 'POST',
        body: params,
    })
}

// 商品库存清空所选商品的安全库存
export async function clearChoose(params) {
    return request(`${config.APIV1}/prodm/sku/inventory/deleteSafetyNum`, {
        method: 'POST',
        body: params,
    })
}

// 商品库存刷新商品名
export async function resetItem1() {
    return request(`${config.APIV1}/prodm/sku/inventory/refreshProductName`, {
        method: 'POST',
    })
}

// 商品库存超卖
export async function beyond() {
    return request(`${config.APIV1}/prodm/sku/inventory/getOverSellSkuData`, {
        method: 'POST',
    })
}

// 商品库存等于低于安全库存
export async function low(params) {
    return request(`${config.APIV1}/prodm/sku/inventory/getIsLessThanSafeStock`, {
        method: 'POST',
        body: { ...params },
    })
}

// 商品库存明细列表
export async function getWmInOut(params) {
    return request(`${config.APIV1}/prodm/sku/inventory/getWmInOutData`, {
        method: 'POST',
        body: { ...params },
    })
  }

  // 商品库存-分仓库存明细账查询:/prodm/sku/inventory/getWarehouseWmInOutData:入参:对象:wmInOutSearchDTO  出参:PageVO<WmInOut>
export async function getWarehouseWmInOutData(params) {
    return request(`${config.APIV1}/prodm/warehouse/sku/inventory/getWarehouseWmInOutData`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }

  // 商品库存-分仓库存明细账导出:/prodm/sku/inventory/exportWarehouseWmInOutData:入参:对象:wmInOutSearchDTO
  export async function exportWarehouseWmInOutData(params) {
    return fileExport(`${config.APIV1}/prodm/warehouse/sku/inventory/exportWarehouseWmInOutData`, {
      method: 'POST',
      body: { ...params },
    })
  }

  // 商品库存导出主仓库存进出明细流水
export async function exportDetail(params) {
    return fileExport(`${config.APIV1}/prodm/sku/inventory/exportWmInOutData`, {
        method: 'POST',
        body: { ...params },
    })
}

// 商品库存订单占有数
export async function getOrderNum(params) {
    return request(`${config.APIV1}/prodm/sku/inventory/orderOccupyNumHyperlinks`, {
        method: 'POST',
        body: params,
    })
  }