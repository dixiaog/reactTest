/*
 * @Author: Wupeng
 * @Date: 2018-1-8 15:57:28
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-03-22 09:30:25
 * 商品库存-分仓接口
 */
import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'

// 列表页查询接口:/prodm/warehouse/sku/inventory/getWarehouseSkuInventoryData :入参:对象:wmInventorySearchDTO 出参:PageVO<WmInventory>
export async function getWarehouseSkuInventoryData(params) {
  return request(`${config.APIV1}/prodm/warehouse/sku/inventory/getWarehouseSkuInventoryData`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// /basem/warehouse/getWarehouse
export async function getWarehouse(params) {
  return request(`${config.APIV1}/basem/warehouse/getWarehouse`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 等于低于安全库存查询方法接口:/prodm/warehouse/sku/inventory/getIsLessThanSafeStock:入参:对象:wmInventorySearchDTO 出参:PageVO<WmInventory>
export async function getIsLessThanSafeStock(params) {
    return request(`${config.APIV1}/prodm/warehouse/sku/inventory/getIsLessThanSafeStock`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// 商品库存-分仓导入安全库存接口:/prodm/warehouse/sku/inventory/uploadSafetyInventory:入参:JSON:uploadStatus(1,2),file(组件) 出参:Boolean
export async function uploadSafetyInventory(params) {
    return request(`${config.APIV1}/prodm/warehouse/sku/inventory/uploadSafetyInventory`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// 商品库存-分仓清除0库存资料:/prodm/warehouse/sku/inventory/deleteWarehouseNullInventory: 出参:Boolean
export async function deleteWarehouseNullInventory(params) {
    return request(`${config.APIV1}/prodm/warehouse/sku/inventory/deleteWarehouseNullInventory`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// 商品库存-分仓导出所有符合条件的商品库存-分仓:/prodm/warehouse/sku/inventory/exportSku :入参:对象:wmInventorySearchDTO
export async function exportSku(params) {
    return fileExport(`${config.APIV1}/prodm/warehouse/sku/inventory/exportSku`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// 商品库存-分仓刷新商品名:/prodm/warehouse/sku/inventory/warehouseRefreshProductName:出参:Boolean
export async function warehouseRefreshProductName(params) {
    return request(`${config.APIV1}/prodm/warehouse/sku/inventory/warehouseRefreshProductName`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// 商品库存-主仓库存明细账查询:/prodm/sku/inventory/getWmInOutData:入参:对象:wmInOutSearchDTO  出参:PageVO<WmInOut>
export async function getWmInOutData(params) {
    return request(`${config.APIV1}/prodm/sku/inventory/getWmInOutData`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }

// 商品库存-分仓主仓库存明细账导出:/prodm/sku/inventory/exportWmInOutData:入参:对象:wmInOutSearchDTO
export async function exportWmInOutData(params) {
    return request(`${config.APIV1}/prodm/sku/inventory/exportWmInOutData`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }

