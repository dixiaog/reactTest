/*
 * @Author: chenjie
 * @Date: 2018-01-20 10:16:45
 * @param (无特别注释均表示可选)
{
    "bdSkuDTO": {
        "productNo": "BSD-001",         // 必填
        "brandNo": "",
        "productName": "HelloKitty",    // 必填
        "categoryNo": 100103,           // 必填
        "productAttribute": 1,          // 必填
        "supplierName": "",
        "supplierProductNo": "",
        "tagPrice": 0,
        "imageUrl": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3340026732,2627727964&fm=27&gp=0.jpg",
        "attributeNo": [
            "70%",
            "针织"
        ],
        "colorSizeList": [              // 必填
            {
                "col0": "少女粉",
                "col1": "L",
                "ii": 11,
                "specMapping": "1:0",
                "productSpec": "少女粉,L",
                "retailPrice": "",
                "costPrice": "",
                "referWeight": "",
                "skuNo": "",
                "barcode": "",
                "autoNo": ""
            }
        ],
        "productType": 0,
        "categoryName": "绿毛衣",
        "autoNo": 162,
        "oldProductNo": "BSD-001"
    },
    "skuAttributeList": [
        {
            "attributeName": "填充率",
            "attributeNo": 10010301,
            "optionalValue": "70%",
            "productNo": "BSD-001"
        },
        {
            "attributeName": "材质",
            "attributeNo": 10010302,
            "optionalValue": "针织",
            "productNo": "BSD-001"
        }
    ]
}
 * @return （此处data中返回）
{
    "success": true,
    "resultCode": "0000",
    "errorMessage": "保存成功!",
    "data": true
}

 */

export function save(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    console.log(body)
    return res.json('{"success":true,"resultCode":"0000","errorMessage":"保存成功!","data":true}')
}

export default {
  save,
}
