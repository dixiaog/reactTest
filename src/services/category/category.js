/*
 * @Author: Wupeng
 * @Date: 2018-1-8 15:57:28
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-01 16:40:53
 * 商品类目接口
 */
import request from '../../utils/request'
import config from '../../utils/config'

// /prodem/category/delectAllCategory 清空所有分类
export async function delectAllCategory(params) {
  return request(`${config.APIV1}/prodem/category/delectAllCategory`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// checkUpdateSpec
export async function checkUpdateSpec(params) {
  return request(`${config.APIV1}/prodem/category/checkUpdateSpec`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 删除接口 deleteCategoryByNo
export async function deleteCategoryByNo(params) {
  return request(`${config.APIV1}/prodem/category/deleteCategoryByNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 启用/禁用 updateEnableStatus
export async function updateEnableStatus(params) {
  return request(`${config.APIV1}/prodem/category/updateEnableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 编辑类目规格 selSpecByCategoryNo
export async function selSpecByCategoryNo(params) {
  // getSpecByCategoryNo
  return request(`${config.APIV1}/prodem/category/getSpecByCategoryNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 添加类目规格 addCategorySpec
export async function addCategorySpec(params) {
  return request(`${config.APIV1}/prodem/category/addCategorySpec`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 修改类目 updateSaveSpec
export async function updateSaveSpec(params) {
  return request(`${config.APIV1}/prodem/category/updateSaveSpec`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 添加自定义分类保存 addCustomCategory
export async function addCustomCategory(params) {
  return request(`${config.APIV1}/prodem/category/addCustomCategory`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 添加标准类目 addStandardCategory
export async function addStandardCategory(params) {
  return request(`${config.APIV1}/prodem/category/addStandardCategory`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 复制属性保存接口 addToOtherAttribute
export async function addToOtherAttribute(params) {
  return request(`${config.APIV1}/prodem/category/addToOtherAttribute`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 复制属性查询接口 getAllRoot
export async function getAllRoot(params) {
  return request(`${config.APIV1}/prodem/category/getAllRoot`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 查询接口 selAttributeByAutoNo
export async function selAttributeByAutoNo(params) {
  return request(`${config.APIV1}/prodem/category/selAttributeByAutoNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 子列表编辑保存 updateAttributeInfo
export async function updateAttributeInfo(params) {
  return request(`${config.APIV1}/prodem/category/updateAttributeInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// addAttributeInfo 新增属性
export async function addAttributeInfo(params) {
  return request(`${config.APIV1}/prodem/category/addAttributeInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// selectAttributeByEnableStatus  启用 禁用 全部 查询功能
export async function selectAttributeByEnableStatus(params) {
  return request(`${config.APIV1}/prodem/category/selectAttributeByEnableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 标准分类查询
export async function getAllStandardCategory(params) {
  return request(`${config.APIV1}/prodem/category/getAllStandardCategory`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// getChildrenParallelCategory
export async function getChildrenParallelCategory(params) {
  return request(`${config.APIV1}/prodem/category/getChildrenParallelCategory`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// selectCategoryByNameOrNo 搜索

export async function selectCategoryByNameOrNo(params) {
  return request(`${config.APIV1}/prodem/category/selectCategoryByNameOrNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// updateSaveCategory 编辑类目修改保存

export async function updateSaveCategory(params) {
  return request(`${config.APIV1}/prodem/category/updateSaveCategory`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
/**
 * /prodem/category/getRootDirectoryByUser
基础-商品类目管理-查询
 */
export async function getRootDirectoryByUser(params) {
  return request(`${config.APIV1}/prodem/category/getRootDirectoryByUser`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 编辑属性判断是否可编辑 editSelectCategory editSelectCategory
export async function editSelectCategory(params) {
  return request(`${config.APIV1}/prodem/category/editSelectCategory`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
