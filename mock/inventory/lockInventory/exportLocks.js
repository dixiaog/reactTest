/*
 * @Author: chenjie
 * @Date: 2018-01-20 10:16:45
 * 导出查询数据
 * @param (无特别注释均表示可选)
{
    billNo
    shopNo
    skuNo
    shopSkuNo
    isUnlock // true or false, true = 1, false = 0
    "fileName": "商品维护.xls"
}

{
    "data": {
        "list": [               // 注：文档中有 原始上传数据 , 数据库中没有，不需要！！
            {
                autoNo
                skuNo //商品SKU编码
                productName // 商品名称
                shopSkuNo // 平台sku编码
                lockNum // 锁定数
                usedLockNum // 已用锁定数
                deliveredNum // 已发货数
                isUnlock // 是否解锁
                uploadStatus   // 上传状态
                unlockTime     // 解锁时间
                createTime     // 创建时间
                remark         // 备注
            },
            {...},
            {...},
            {...},
        ],
    }
}

 */
