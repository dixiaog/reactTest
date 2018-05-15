/*
 * @Author: tanmengjia
 * @Date: 2018-02-05 16:05:10
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-02-28 15:27:54
 * 查询数据初始化
 * @return （此处data中返回）
{
  orderNo: ''
  orderTypes: []
  abnormalNos: []
  orderStatuses: []
  shopNos: [];//店铺列表
  distributorNos: [];//分销商列表
  expressCropNos: [];//物流公司列表
  provinces: [];//收货省列表
  warehouseNos: [];//仓库列表
  buyerMsg: {
      type: 0        // 1: 不过滤  2: 无留言  3: 未处理的留言  4: 留言
      value: ''      // type 为 4 时, 根据传来值过滤 
  }
  sellerMsg: {
      type: 0        // 1: 不过滤  2: 无留言  3: 未处理的留言  4: 留言
      value: ''      // type 为 4 时, 根据传来值过滤 
  }
  siteOrderNo: ''; //varchar(200)  平台订单编号
  siteBuyerNo: ''; //varchar(50)  平台买家账号
  receiver: ''; //varchar(20)  收货人
  telNo: ''; //varchar(25)  电话号码
  mobileNo: ''; //varchar(25)  手机号码
  expressNo: ''; //varchar(20)  物流单号
  province: ''; //varchar(20)  省&#47;直辖市
  city: ''; //varchar(20)  地级市&#47;市辖区&#47;市辖县
  county: ''; //varchar(50)  县级市&#47;区&#47;县
  address: ''; //varchar(250)  详细地址
  timeField          // 时间字段 1:订单时间 2:发货时间 3:付款时间 4:计划发货时间
  startTime
  endTime
  minNum
  maxNum
  minMoney
  maxMoney
  minWeight
  maxWeight
  productName   // 商品名称
  productSpec   // 商品规格
}
 */