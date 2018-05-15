/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-01-30 15:59:18
 * 新建锁定库存
 {
    type：1,     // 1: 导入商品编码，一行一个  2: 手动指定商品编码和库存  3: 手动指定商品编码,商品链接和库存
    shopNo
    autoCheck: 0 //导入商品带库存数量时自动和可用数量判断,以数量少的为准
    list:[
        {
            skuNo         // 必填
            invNum        // type 为: 2 || 3 必填
            skuShopUrl    // type 为: 3 必填
        },
        {...},
        {...},
        {...},
        {...},
        {...},
        {...},
    ]
 }
 * @return （此处data中返回）
{
    "data": skuList: [
           {
                skuNo //商品SKU编码
                productName // 商品名称
                invAvailableNum    // 可用数 = 主仓实际库存-(库存锁定数-库存锁定占用) -订单占有+虚拟库存）
           }
           {...},
           {...},
           {...},
       ]
       shopSkuList: [{              // type: 3 返回
            skuNo //商品SKU编码
            shopName // 店铺名称
            productName // 商品名称
            shopSkuNo // 平台商品编码
            skuShopUrl  //商品线上链接
       },
}

 */
export function importLocks(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":true}'))
}

export default {
    importLocks,
}
