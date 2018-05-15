/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-01-27 12:56:49
 * 通过sku 和 shopNo 获取该商品库存信息
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
    }
}

 */

export function getSkuInfoInShopNo(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":[{"skuNo":123,"shopName":"BOSIDENG","productName":"mockTestS数据","siteSkuNo":"11111","skuShopUrl":"","invAvailableNum":10},{"skuNo":567,"shopName":"BOSIDENG","productName":"mockTestS数据","siteSkuNo":"11111","skuShopUrl":"","invAvailableNum":10}]}'))
}

export default {
    getSkuInfoInShopNo,
}
