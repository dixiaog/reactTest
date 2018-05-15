/*
 * @Author: tanmengjia
 * @Date: 2018-02-10 15:08:19
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-02-10 15:11:49
 * 拆分策略确认拆分
 * {
    isShow 0:1 // 拆分完成后显示拆分后的订单
    orderType 0:1 // 选择的拆分的订单的方法，1：按搜索条件，0：按选择的
    strategyNo // 策略ID
    searchParam // 搜索条件
    selectedRows:(2) [{…}, {…}] //选择的订单
 }
 * @return （此处data中返回）
{
    "data": true
}
 */
