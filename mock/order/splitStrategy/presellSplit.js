/*
 * @Author: tanmengjia
 * @Date: 2018-02-10 14:55:38
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-02-10 15:01:02
 * 预售按批次拆分
 *  {
    giftType 0:1 // 如果订单所有商品均被设定主动拆分出去，则实际不拆分
    isSplit 0:1 // 赠品设置的类型
    newMinAmount // 主动拆分商品最小金额
    oldMinAmount // 原订单商品最小金额
    selectedRows:(2) [{…}, {…}] //选择的商品
 }
 * @return （此处data中返回）
{
    "data": true
}
 */
