/*
拆分订单-拆分
 {
   orderNo  订单编号
   splitList: [    // 将订单拆分成若干份数
       [{
           autoNo
           orderNum
           productImage
       }, {
           autoNo
           orderNum
           productImage
       }, {
           autoNo
           orderNum
           productImage
       }],
       [],
       [],
   ]

 * @return （此处data中返回）
{
    "data": true
 */

export function splitOr(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    console.log(body)
    return res.json('{"success":true,"resultCode":"0000","errorMessage":"保存成功!","data":true}')
}

export default {
    splitOr,
}
