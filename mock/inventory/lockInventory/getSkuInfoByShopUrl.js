/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-01-30 15:59:47
 * 通过sku 和 shopNo 获取该商品在线上店铺里的链接信息
 {
    skuNoList: ['xxxx', 'xxxxx']    // skuNo 数组
    shopNo                          // 店铺No
 }
 * @return （此处data中返回）
{
    "data": {
       skuList: [
           {
                skuNo //商品SKU编码
                productName // 商品名称
                invAvailableNum    // 可用数 = 主仓实际库存-(库存锁定数-库存锁定占用) -订单占有+虚拟库存）
           }
           {...},
           {...},
           {...},
       ]
       shopSkuList: [{
            skuNo //商品SKU编码
            shopName // 店铺名称
            productName // 商品名称
            shopSkuNo // 平台商品编码
            skuShopUrl  //商品线上链接
       },
      ]
    }
}

 */

export function getSkuInfoByShopUrl(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":{"skuList":[{"skuNo":123,"productName":"mockTestS数据", "invAvailableNum":10}],"shopSkuList": [{"skuNo":123,"shopName":"xxde","productName":"233x","shopSkuNo":"22p2","skuShopUrl":"http://www.baidu.com"},{"skuNo":123,"shopName":"xxde","productName":"233x","shopSkuNo":"33p2","skuShopUrl":"http://www.baidu.com"}]}}'))
}

export default {
    getSkuInfoByShopUrl,
}
