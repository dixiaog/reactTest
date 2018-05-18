import mockjs from 'mockjs'

// 测试数据
import { getUserList } from './mock/base/user/getUserList'
import { getDictionaryList } from './mock/base/dictionary/getDictionaryList'
import { getWechatList } from './mock/base/wechat/getWechatList'
import { getShopList } from './mock/base/shop/getShopList'
import { getCategorytList } from './mock/base/category/getCategorytList'
import { getSoftwareList } from './mock/base/software/getSoftwareList'
import { getTaskList } from './mock/system/task/getTaskList'
import { getRoleList } from './mock/system/roleList/getRoleList'
import { getPowerList } from './mock/system/power/getPowerList'

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

  // 库存--采购管理
  'POST /umi/login': { userName: '测试111', token: '111' },

  // 基础-获取用户
  'POST /base/user/getUserList': getUserList,

  // 基础-数据字典
  'POST /base/dictionary/getDictionaryList': getDictionaryList,
  
  // 基础-微信用户
  'POST /base/wechat/getWechatList': getWechatList,

  // 基础-微信用户
  'POST /base/shop/getShopList': getShopList,

  // 基础-商品类目
  'POST /base/category/getCategorytList': getCategorytList,
  
  // 基础-团软件列表
  'POST /base/software/getSoftwareList': getSoftwareList,
  
  // 系统-角色列表
  'POST /system/roleList/getRoleList': getRoleList,

  // 系统-权限管理
  'POST /system/power/getPowerList': getPowerList,
  
}

export default proxy
