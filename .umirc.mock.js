import mockjs from 'mockjs'
import { getRule, postRule } from './mock/rule'
import { getActivities, getNotice, getFakeList,
  getMenus, getItemList, getSpec, getCnames,
  getPowerList, getDicLists, getRoles, getRolePowers,
  getExpresslists, getPrints, getShops , getSkuList , getCompanyList, getBrandList, getShopList } from './mock/api'
import { getFakeChartData } from './mock/chart'
import { imgMap } from './mock/utils'
import { getProfileBasicData } from './mock/profile'
import { getProfileAdvancedData } from './mock/profile'
import { getNotices } from './mock/notices'
import { getUsers, getRolePowersJ, getRolesList, getMenusJ, getResource, getDictionary, getAuthorize } from './mock/system' // 江腾测试数据
import { getSpecialPrice } from './mock/supplySell/priceStrategy/getSpecialPrice'
import { getShopName } from './mock/item/shopProduct/getAllShop'
import { getTmjItemList } from './mock/item/shopProduct/getShopSkuData'
import { getRefundOrder } from './mock/afterSale/refundOrder/getRefundOrder'

/* 江腾测试数据  */
import { getPurData } from './mock/inventory/purchaseManager/getPurDataList'
import { getGoodList } from './mock/inventory/purchaseManager/getGoodList'
import { getGoodModal } from './mock/inventory/purchaseManager/getGoodModal'
import { getProductPop } from './mock/inventory/purchaseManager/getProductPop'
import { getStoDataList } from './mock/inventory/purchaseStorage/getStoDataList'
import { getStorageDetail } from './mock/inventory/purchaseStorage/getStorageDetail'
import { getBillList } from './mock/inventory/purchaseStorage/getBillList'
import { getNoBillList } from './mock/inventory/purchaseStorage/getNoBillData'
import { getRelData } from './mock/supplySell/relationship/getRelData'
import { getSupData } from './mock/supplySell/supplierlist/getSupData'
import { getSupPriceData } from './mock/supplySell/supplierPrice/getSupPriceData'
import { getAuthorizedData } from './mock/supplySell/authorizedCredit/getAuthorizedData'
/* 江腾测试数据  */
import { getStrategyChild } from './mock/supplySell/priceStrategy/getStrategyChild'
import { getCommisionStrategy } from './mock/supplySell/commisionStrategy/getCommisionStrategy'
import { getDistributor } from './mock/supplySell/commisionStrategy/getDistributor'
import { getProductLimit } from './mock/supplySell/productLimit/getProductLimit'
import { getVipWarehouse } from './mock/vip/vipWarehouse/getVipWarehouse'
// 锁定库存
import { getLockInventory } from './mock/inventory/lockInventory/getLockInventory'
import { getSkuInfoInShopNo } from './mock/inventory/lockInventory/getSkuInfoInShopNo'
import { addLockInventory } from './mock/inventory/lockInventory/addLockInventory'
import { getSkuInfoByShopUrl } from './mock/inventory/lockInventory/getSkuInfoByShopUrl'
import { editLockInventoryShow } from './mock/inventory/lockInventory/editLockInventoryShow'
import { editLocks } from './mock/inventory/lockInventory/editLocks'
import { getLocks } from './mock/inventory/lockInventory/getLocks'
import { unLockBill } from './mock/inventory/lockInventory/unLockBill'
import { unLockSku } from './mock/inventory/lockInventory/unLockSku'
import { importLocks } from './mock/inventory/lockInventory/importLocks'
import { getItemInv } from './mock/inventory/itemInv/getItemInv'
import { getWmInOut } from './mock/inventory/itemInv/getWmInOut'
import { getOmBuyer } from './mock/order/omBuyer/getOmBuyer'
import { getSpecialStrategy } from './mock/order/SpecialStrategy/getSpecialStrategy'
import { getSplitStrategy } from './mock/order/splitStrategy/getSplitStrategy'
import { getGiftStrategy } from './mock/order/giftStrategy/getGiftStrategy'
import { getAfterSkus } from './mock/afterSale/scanning/getSkus'
import { getDetail } from './mock/afterSale/scanning/getDetail'

//订单查询
import { getSearchInit } from './mock/order/search/getSearchInit'
import { getMegerList } from './mock/order/mergeOrder/getlist'
import { getSplitList } from './mock/order/splitOrder/getlist'
import { getOrderSearchData } from './mock/order/search/getOrderSearchData'
import { getOrderDetail } from './mock/order/search/getOrderDetail'
import { getAutCalculate } from './mock/order/search/getAutCalculate'
import { splitOr } from './mock/order/splitOrder/splitOr'

// 售后查询
import { getAfterList } from './mock/afterSale/search/getAfterList'
import { newAfterList } from './mock/afterSale/search/newAfterList'
import { getChildList } from './mock/afterSale/search/getChildList'

// ------- //
import { getSku } from './mock/order/splitStrategy/getSku'
import { getApproveStrategy } from './mock/order/ApproveStrategy/list'


// ==============手持
import { packingDeliveryScanbarCode } from './mock/mobile/BoxIn/scanBarCode'
import { packingDeliveryScanCasCode } from './mock/mobile/BoxIn/scanCasCode'
import { packingDeliveryGetSkusByCasCode } from './mock/mobile/BoxIn/getSkusByCasCode'
import { packingDeliveryGetPickedInfo } from './mock/mobile/BoxIn/getPickedInfo'
import { packingDeliveryGetUnPickedInfo } from './mock/mobile/BoxIn/getUnPickInfo'
import { packingDeliverySecondScanbarCode } from './mock/mobile/BoxIn/secondPickedScanBarCode'
import { inspcationGetExpressList } from './mock/mobile/Inspection/getExpressList'
import { inspcationScanBarCode } from './mock/mobile/Inspection/scanBarCode'
import { inspcationMultipleScanBarCode } from './mock/mobile/Inspection/multipleScanBarCode'


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
  // GET 可省略
  //---------陈杰 mock-----------
  'POST /wm/lockInventory/getLockInventory': { $body: getLockInventory },
  'POST /wm/lockInventory/getSkuInfoInShopNo': { $body: getSkuInfoInShopNo },
  'POST /wm/lockInventory/addLockInventory': { $body: addLockInventory },
  'POST /wm/lockInventory/getSkuInfoByShopUrl': { $body: getSkuInfoByShopUrl },
  'POST /wm/lockInventory/editLockInventoryShow': { $body: editLockInventoryShow },
  'POST /wm/lockInventory/editLocks': { $body: editLocks },
  'POST /wm/lockInventory/getLocks': { $body: getLocks },
  'POST /wm/lockInventory/unLockBill': { $body: unLockBill },
  'POST /wm/lockInventory/unLockSku': { $body: unLockSku },
  'POST /wm/lockInventory/importLocks': { $body: importLocks },

  // ---- 订单查询
  'POST /om/order/getSearchInit': { $body: getSearchInit },
  'POST /om/mergeOrder/getlist': { $body: getMegerList },
  'POST /om/splitOrder/getlist': { $body: getSplitList},
  'POST /om/splitOrder/splitOr': { $body: splitOr},
  'POST /om/order/getOrderSearchData': { $body: getOrderSearchData },
  'POST /om/order/getOrderDetail': { $body: getOrderDetail },
  'POST /om/order/getAutCalculate': { $body: getAutCalculate },

  // ---- 订单售后
  'POST /afterOrder/getAfterList': { $body: getAfterList},
  'POST /afterOrder/newAfterList': { $body: newAfterList},
  'POST /afterOrder/getChildList': { $body: getChildList},
  //---------陈杰 mock-----------

  //---------谭梦佳 mock-----------
  'POST /shopProduct/getShopProduct': { $body: getTmjItemList } ,
  'POST /shopProduct/getShopName': { $body: getShopName } ,
  'POST /priceStrategy/getSpecialPrice': { $body: getSpecialPrice } ,
  'POST /priceStrategy/getStrategyChild': { $body: getStrategyChild } ,
  'POST /commisionStrategy/getCommisionStrategy': { $body: getCommisionStrategy } ,
  'POST /commisionStrategy/getDistributor': { $body: getDistributor } ,
  'POST /productLimit/getProductLimit': { $body: getProductLimit } ,
  'POST /itemInv/getItemInv': { $body: getItemInv } ,
  'POST /itemInv/getWmInOut': { $body: getWmInOut } ,
  'POST /omBuyer/getOmBuyer': { $body: getOmBuyer } ,
  'POST /omBuyer/getData': { $body: getSpecialStrategy } ,
  'POST /splitStrategy/getSplitStrategy': { $body: getSplitStrategy } ,
  'POST /presellSplit/getSku': { $body: getSku } ,
  'POST /approveStrategy/getApproveStrategy': { $body: getApproveStrategy } ,
  'POST /giftStrategy/getGiftStrategy': { $body: getGiftStrategy } ,
  'POST /refundOrder/getRefundOrder': { $body: getRefundOrder } ,
  'POST /scanning/getAfterSkus': { $body: getAfterSkus } ,
  'POST /scanning/getDetail': { $body: getDetail } ,
  'POST /vipWarehouse/getVipWarehouse': { $body: getVipWarehouse } ,
  //---------谭梦佳 mock-----------
  'POST /wm/packingDelivery/scanBarCode': { $body: packingDeliveryScanbarCode },
  'POST /wm/packingDelivery/scanCasCode': { $body: packingDeliveryScanCasCode },
  'POST /wm/packingDelivery/getPickedInfo': { $body: packingDeliveryGetPickedInfo },
  'POST /wm/packingDelivery/getSkusByCasCode': { $body: packingDeliveryGetSkusByCasCode },
  'POST /wm/packingDelivery/getUnPickInfo': { $body: packingDeliveryGetUnPickedInfo },
  'POST /wm/secondPicked/scanBarCode': { $body: packingDeliverySecondScanbarCode},
  'POST /wm/inspection/getExpressList': { $body: inspcationGetExpressList},
  'POST /wm/inspection/scanBarCode': { $body: inspcationScanBarCode},
  'POST /wm/inspection/multipleScanBarCode': { $body: inspcationMultipleScanBarCode },

  // export async function getRolePowers() {
  //   return request('/base/rolePowers')
  // }

  // export async function getData() {
  //   return request('/itemCapacity/getData')
  // }


  // 系统--用户管理
  'POST /system/userManager': {
    $body: getUsers,
  },

  // 系统--角色权限维护
  'GET /system/userRoles': getRolesList,
  'GET /system/getRolePowers': getRolePowersJ,

  // 系统--菜单资源维护
  'GET /system/getMenus': getMenusJ,

 // 系统--权限资源维护
 'POST /system/getResource': {
   $body: getResource,
 },

  // 系统--数据字典资料维护
  'POST /system/getDictionary': {
    $body: getDictionary,
  },

  /*
  *  江腾测试数据
  *  江腾测试数据
  *  江腾测试数据
  */
  // 库存--采购管理
  'POST /inventory/pur/getPurData': {
    $body: getPurData,
  },

  // 库存--请选择需要新增的商品
  'POST /inventory/pur/getGoodList': {
    $body: getGoodList,
  },

  // 库存--获取新增后的商品信息
  'POST /inventory/pur/getGoodModal': {
    $body: getGoodModal,
  },

  // 库存--获取气泡框数据
  'POST /inventory/pur/getProductPop': {
    $body: getProductPop,
  },

  // 采购入库--列表信息
  'POST /inventory/sto/getStoDataList': {
    $body: getStoDataList,
  },

  // 采购入库--获取单笔采购单的入库明细
  'POST /inventory/sto/getStorageDetails': {
    $body: getStorageDetail,
  },

  // 采购入库--获取采购单信息列表
  'POST /inventory/sto/getBillList': {
    $body: getBillList,
  },

  // 采购入库--无采购单待选择的商品列表
  'POST /inventory/sto/getNoBillList': {
    $body: getNoBillList,
  },

  // 供销-分销|经销商列表
  'POST /inventory/rel/getRelData': {
    $body: getRelData,
  },

  // 供销-分销|经销商列表
  'POST /inventory/sup/getSupData': {
    $body: getSupData,
  },

  // 供销-设定商品供销价格
  'POST /inventory/sup/getSupPriceData': {
    $body: getSupPriceData,
  },

  // 供销-财务-授信管理
  'POST /inventory/aut/getAuthorizedData': {
    $body: getAuthorizedData,
  },
  // '/system/userManager': getUsers,
  '/base/getShops': getShops,
  'GET /base/rolePowers': getRolePowers,
  'GET /base/roles': getRoles,
  'GET /api/menus': getMenus,
  'POST /api/diclist': {
    $body:getDicLists,
  },
  'POST /api/expresslist': {
    $body:getExpresslists,
  },
  'POST /base/powers': {
    $body: getPowerList,
  },

  // 商品维护
  'POST /api/items': {
    $body: getItemList,
  },
  // '/api/items': getItemList,
  '/base/printList': getPrints,
  '/api/getCnames': getCnames,
  'POST /api/getSpec': (req, res) => {
    const { cname } = req.body
    if (cname === '羽绒服') {
      res.send(getSpec)
    } else {
      res.send([])
    }

  },
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /base/shops': {
    $body: getShopList,
  },
  'POST /api/forms': (req, res) => {
    res.send('Ok')
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  // 'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName } = req.body
    res.send({ status: password === 'guest' && userName === 'guest' ? 'ok' : 'error', type: 'account', token: 'thisIsToken' })
  },
  'POST /api/login/mobile': (req, res) => {
    res.send({ status: 'ok', type: 'mobile' })
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok' })
  },
  'GET /api/notices': getNotices,
  'POST /item/skus': {
    $body: getSkuList,
  },
  'POST /base/companys': {
    $body: getCompanyList,
  },
  'POST /base/brands': {
    $body: getBrandList,
  },
  'POST /system/getAuthorize': {
    $body: getAuthorize,
  },
}

export default proxy
