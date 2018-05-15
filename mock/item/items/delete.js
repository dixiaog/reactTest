/*
 * @Author: chenjie
 * @Date: 2018-01-20 10:16:45
 * @param (无特别注释均表示可选)
{
    "IDLst":["BSD-001-6"]
}
 * @return （此处data中返回）
{
    "success": true,
    "resultCode": "0000",
    "errorMessage": "保存成功!",
    "data": true
}

 */

export function deleteItem(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    console.log(body)
    return res.json('{"success":true,"resultCode":"0000","errorMessage":"保存成功!","data":true}')
}

export default {
    deleteItem,
}
