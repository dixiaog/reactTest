
import request from '../../utils/request'
import config from '../../utils/config'

/*
 * 供销-分销商
 */

// 供销-分销列表页
export async function getRelData(params) {
  return request(`${config.APIV1}/dm/relationship/getRelationshipList`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 新增
export async function saveRelationship(params) {
  return request(`${config.APIV1}/dm/relationship/saveRelationship`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 编辑
export async function editRelationship(params) {
  return request(`${config.APIV1}/dm/relationship/editRelationship`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 修改状态
export async function isFreeze(params) {
  return request(`${config.APIV1}/dm/relationship/isFreeze`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取单条明细
export async function getDetail(params) {
  return request(`${config.APIV1}/dm/relationship/selectFund`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


// 审核生效
export async function Shengxiao(params) {
  return request(`${config.APIV1}/dm/relationship/agreeDistribution`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取子节点数据
export async function getChildData(params) {
  return request(`${config.APIV1}/dm/relationship/getRelationshipList`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 删除分销-经销商
export async function deleteDis(params) {
  return request(`${config.APIV1}/dm/relationship/delRelationship`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 按钮删除分销-经销商
export async function delRelationship(params) {
  return request(`${config.APIV1}/dm/relationship/delRelationship`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


// 按钮删除分销-经销商
export async function isValid(params) {
  return request(`${config.APIV1}/dm/relationship/isValid`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 同步
export async function isSync(params) {
  return request(`${config.APIV1}/dm/relationship/isSync`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 检查客户编号
export async function checkcustomerNo(params) {
  return request(`${config.APIV1}/dm/relationship/checkcustomerNo`, {
    method: 'POST',
    body: params,
  })
}
