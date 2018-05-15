/*
 * @Author: wangjun
 * @Date: 2018-01-20 10:16:45
 * 审核策略列表页
{
    {
        companyNo: //公司编号
        current: //第几页
        pageSize: //每页记录数
    }
}
 * @return （此处data中返回）
{
    data: 
        list: {[
            strategyNo; //策略编号(自增编号)
            strategyName; //策略名称
            beginTime; //开始时间
            endTime;//结束时间
            beginOrderTime; //开始下单时间
            endOrderTime; //截止下单时间
            specifyShop; //指定店铺编号
            limitOrderType; //限定订单类型(0:普通订单; 1:补发订单; 2:换货订单; 3:天猫分销; 4:天猫供销; 5:协同订单)
            specifyFlag; //指定小旗(逗号分隔多色旗)
            delayApprove; //支付后延时审核
            enableStatus; //启用标志(0:禁用; 1:启用)
            companyNo; //公司编号
            createTime; //创建时间
            createUser; //创建人员
            updateTime; //修改时间
            updateUser; //修改人员
            ts; //时间戳
        ],}
        pagination: {
            total: //总页数
        }
}

 */
import moment from 'moment'
import { getUrlParams } from '../../utils'

export function shopName(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        strategyNo: `${i}`,
        strategyName: `我是名称-${i}`,
        // specifyShop: `东店铺-${i},西店铺-${i}`,
        specifyShop: 20,
        limitOrderType: Math.random() * 10 > 5 ? 3 : 4,
        ignoreBuyerMessage: Math.random() * 10 > 5 ? 0 : 1,
        beginTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        beginOrderTime: moment().format('YYYY-MM-DD'),
        endOrderTime: moment().format('YYYY-MM-DD'),
        delayApprove: `${i}`,
        enableStatus: Math.random() * 10 > 5 ? 0 : 1,
        createTime: moment().format('YYYY-MM-DD'),
        updateTime: moment().format('YYYY-MM-DD'),
        specifyFlag: [3, 4],
      })
    }
    // if (searchParam && searchParam.enableStatus) {
    //   list = list.filter(ele => ele.enableStatus.indexOf(searchParam.enableStatus) > -1)
    // }
    return { list, total: count }
  }

  export function getApproveStrategy(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 20
    // const result = itemList(count)
    const result = shopName(count, searchParam)
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
  }

  export default {
    getApproveStrategy,
}
