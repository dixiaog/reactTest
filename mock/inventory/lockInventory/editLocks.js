/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-01-29 20:01:35
 * 
 {
    list: [
            {
                autoNo // 主键
                skuNo //商品SKU编码
                editNum // 本次修改数
            },
            {...},
            {...},
        ]
 }
 * @return （此处data中返回）
{
    "data": true
}

 */

export function editLocks(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":false'))
}

export default {
    editLocks,
}

