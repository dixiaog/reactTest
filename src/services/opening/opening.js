/*
 * @Author: Wupeng
 * @Date: 2018-1-8 15:57:28
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-23 14:35:39
 * 期初库存
 */
import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'

// deleteByBillNo  删除
export async function deleteByBillNo(params) {
  return request(`${config.APIV1}/wm/WmInitInventory/deleteByBillNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// nullifyStatus  强制作废
export async function nullifyStatus(params) {
  return request(`${config.APIV1}/wm/WmInitInventory/nullifyStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// updateStatus 确认生效
export async function updateStatus(params) {
  return request(`${config.APIV1}/wm/WmInitInventory/updateStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// wm/WmInitInventory/delete 期初明细-删除
export async function positiondelete(params) {
    return request(`${config.APIV1}/wm/WmInitInventory/delete`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// /wm/WmInitInventory/list 期初库存维护-商品列表页
export async function list(params) {
    return request(`${config.APIV1}/wm/WmInitInventory/list`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// /wm/WmInitInventory/save 期初库存维护-添加
export async function save(params) {
    return request(`${config.APIV1}/wm/WmInitInventory/save`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// /wm/WmInitInventory/saveByBillNo 期初资料维护-明细添加|sku
export async function saveByBillNot(params) {
    return request(`${config.APIV1}/wm/WmInitInventory/saveByBillNot`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// /wm/WmInitInventory/saveById 期初资料维护-明细修改
export async function saveById(params) {
    return request(`${config.APIV1}/wm/WmInitInventory/saveById`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// /wm/WmInitInventory/selectBrand 期初库存维护-品牌
export async function selectBrand(params) {
    return request(`${config.APIV1}/wm/WmInitInventory/selectBrand`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// /wm/WmInitInventory/selectById期初库存维护-期初明细列表页
export async function selectById(params) {
    return request(`${config.APIV1}/wm/WmInitInventory/selectById`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// /wm/WmInitInventory/selectList期初库存维护-列表页
export async function selectList(params) {
    return request(`${config.APIV1}/wm/WmInitInventory/selectList`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// /wm/WmInitInventory/selectSupplier 期初库存维护-供应商
export async function selectSupplier(params) {
    return request(`${config.APIV1}/wm/WmInitInventory/selectSupplier`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
// /wm/WmInitInventory/selectWarehouse 期初库存维护-仓库
export async function selectWarehouse(params) {
    return request(`${config.APIV1}/wm/WmInitInventory/selectWarehouse`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
//  /wm/WmInitInventory/upload 商品编码——导入/待测试
export async function upload(params) {
  return request(`${config.APIV1}/wm/WmInitInventory/upload`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// /wm/WmInitInventory/listExport 期初明细——导出
export async function listExport(params) {
  return fileExport(`${config.APIV1}/wm/WmInitInventory/listExport`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// /wm/WmInitInventory/saveByBillNo   期初资料维护-明细添加|sku
export async function saveByBillNo(params) {
  return request(`${config.APIV1}/wm/WmInitInventory/saveByBillNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// /wm/WmInitInventory/selectSkuByBillNo 期初商品库存明细选中商品查询函数
export async function selectSkuByBillNo(params) {
  return request(`${config.APIV1}/wm/WmInitInventory/selectSkuByBillNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
