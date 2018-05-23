import mockjs from 'mockjs'

// 测试数据
import { getUserList } from './mock/base/user/getUserList'
import { getShopList } from './mock/base/shop/getShopList'
import { getRoleList } from './mock/system/roleList/getRoleList'

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true'

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dRFVcIqZOYPcSNrlJsqQ.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },

  // 登陆信息
  'POST /umi/login': { userName: '测试用户', token: '111', companyName: '测试公司名字长度需要设置很长', success: true },

  // 基础-获取用户
  'POST /base/user/getUserList': getUserList,

  // 基础-店铺信息
  'POST /base/shop/getShopList': getShopList,
  
  // 系统-角色列表
  'POST /system/roleList/getRoleList': getRoleList,
  
}

export default proxy
