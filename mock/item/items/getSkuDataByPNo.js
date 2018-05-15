/*
 * @Author: chenjie
 * @Date: 2018-01-20 10:16:45
 * @param (无特别注释均表示可选)
 {
    autoNo: 158
}
 * @return （此处data中返回）
{
    "data": {
        "list": [
            {
                "autoNo": 163,
                "skuNo": "000001A",
                "barcode": "",
                "productNo": "000001",
                "productType": 1,
                "productAttribute": 0,
                "specMapping": "0",
                "productSpec": "黄色",
                "referWeight": 0,
                "productName": "000001",
                "shortName": "测试",
                "brandNo": 0,
                "brandName": "",
                "imageUrl": "",
                "categoryNo": 100103,
                "categoryName": "",
                "standardNo": "",
                "costPrice": 0,
                "retailPrice": 0,
                "tagPrice": 0,
                "supplyPrice1": 0,
                "supplyPrice2": 0,
                "supplyPrice3": 0,
                "supplyPrice4": 0,
                "supplyPrice5": 0,
                "distributionPrice1": 0,
                "distributionPrice2": 0,
                "distributionPrice3": 0,
                "distributionPrice4": 0,
                "distributionPrice5": 0,
                "supplierNo": "",
                "supplierName": "",
                "supplierProductNo": "",
                "supplierSkuNo": "",
                "retailCapacityLimit": 0,
                "entireCapacityLimit": 0,
                "standardBoxing": 0,
                "inventorySync": 1,
                "enableStatus": 1,
                "companyNo": 0,
                "ts": 1516414529000
            }
        ],
        "pagination": {
            "rows": 20,
            "total": 1,
            "totalPage": 1,
            "page": 1,
            "currentResult": 0,
            "orderBy": null
        }
    }
}

 */

export function getSkuDataByPNo(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { autoNo } = body
    if (autoNo === 158) {  // 此处即为上部分json的压缩版
      return res.json('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":{"bdSkuDTO":{"autoNo":162,"skuNo":null,"barcode":null,"productNo":"BSD-001","productType":0,"productAttribute":0,"specMapping":null,"productSpec":null,"referWeight":null,"productName":"HelloKitty","shortName":null,"brandNo":0,"brandName":"","imageUrl":"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3340026732,2627727964&fm=27&gp=0.jpg","categoryNo":100103,"categoryName":"","standardNo":null,"costPrice":null,"retailPrice":null,"tagPrice":0.000,"supplyPrice1":null,"supplyPrice2":null,"supplyPrice3":null,"supplyPrice4":null,"supplyPrice5":null,"distributionPrice1":null,"distributionPrice2":null,"distributionPrice3":null,"distributionPrice4":null,"distributionPrice5":null,"supplierNo":"","supplierName":"","supplierProductNo":"","supplierSkuNo":null,"retailCapacityLimit":null,"entireCapacityLimit":null,"standardBoxing":null,"inventorySync":null,"enableStatus":null,"companyNo":null,"ts":null,"comboNo":null,"skuNum":null,"salePrice":null,"current":null,"pageSize":null,"skus":null,"oldProductNo":null,"colorSizeList":[{"col0":null,"col1":null,"ii":null,"specMapping":"0:0","productSpec":"红色,L","referWeight":666.00,"costPrice":3.000,"retailPrice":1044.000,"skuNo":"BSD-001-红色-SM","barcode":"","autoNo":150},{"col0":null,"col1":null,"ii":null,"specMapping":"0:0","productSpec":"红色,SM","referWeight":93.00,"costPrice":3.000,"retailPrice":1.000,"skuNo":"BSD-001-8","barcode":"","autoNo":151},{"col0":null,"col1":null,"ii":null,"specMapping":"0:1","productSpec":"红色,SK","referWeight":8.00,"costPrice":9.000,"retailPrice":0.000,"skuNo":"BSD-001-6","barcode":"","autoNo":152},{"col0":null,"col1":null,"ii":null,"specMapping":"0:0","productSpec":"粉色,L","referWeight":8.00,"costPrice":2.000,"retailPrice":1.000,"skuNo":"BSD-001-7","barcode":"","autoNo":153},{"col0":null,"col1":null,"ii":null,"specMapping":"0:0","productSpec":"粉色,SM","referWeight":3.00,"costPrice":3.000,"retailPrice":3.000,"skuNo":"BSD-001-0","barcode":"","autoNo":154},{"col0":null,"col1":null,"ii":null,"specMapping":"0:1","productSpec":"粉色,SK","referWeight":8.00,"costPrice":8.000,"retailPrice":8.000,"skuNo":"BSD-001-4","barcode":"","autoNo":155},{"col0":null,"col1":null,"ii":null,"specMapping":"1:0","productSpec":"少女粉,L","referWeight":9.00,"costPrice":6.000,"retailPrice":7.000,"skuNo":"BSD-001-5","barcode":"","autoNo":156},{"col0":null,"col1":null,"ii":null,"specMapping":"1:0","productSpec":"少女粉,SM","referWeight":6.00,"costPrice":6.000,"retailPrice":6.000,"skuNo":"BSD-001-2","barcode":"","autoNo":157},{"col0":null,"col1":null,"ii":null,"specMapping":"1:1","productSpec":"少女粉,SK","referWeight":7.00,"costPrice":7.000,"retailPrice":7.000,"skuNo":"BSD-001-3","barcode":"","autoNo":158},{"col0":null,"col1":null,"ii":null,"specMapping":"0","productSpec":"红色,L","referWeight":666.00,"costPrice":0.000,"retailPrice":0.000,"skuNo":"BSD-001-红色-SM1","barcode":"","autoNo":162}],"listPrivate":null,"storageLocationNo":null},"skuAttributeList":[{"autoNo":61,"productNo":"BSD-001","attributeNo":10010301,"attributeName":"填充率","optionalValue":"70%","companyNo":0,"ts":1516348169000},{"autoNo":62,"productNo":"BSD-001","attributeNo":10010302,"attributeName":"材质","optionalValue":"针织","companyNo":0,"ts":1516348169000}],"supplierList":null}}')
    } else {
      return null
    }
}

export default {
    getSkuDataByPNo,
}
