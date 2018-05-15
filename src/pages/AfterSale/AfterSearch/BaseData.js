module.exports = {
  asStatus: [{
    title: '不限',
    key: -1,
  }, {
    title: '待确认',
    key: 0,
  }, {
    title: '已确认',
    key: 1,
  }, {
    title: '已取消',
    key: 2,
  }, {
    title: '强制确认',
    key: 3,
  }],
  goodStatus: [{
    title: '不限',
    key: -1,
  }, {
    title: '买家未收到货',
    key: 'BUYER_NOT_RECEIVED',
  }, {
    title: '买家已收到货',
    key: 'BUYER_RECEIVED',
  }, {
    title: '买家已退货',
    key: 'BUYER_RETURNED_GOODS',
  }, {
    title: '卖家已收到货',
    key: 'SELLER_RECEIVED',
  }, {
    title: '卖家未收到货',
    key: 'SELLER_NOT_RECEIVED',
  }],
  asType: [{
    title: '不限',
    key: -1,
  }, {
    title: '退货',
    key: 0,
  }, {
    title: '换货',
    key: 1,
  }, {
    title: '补发',
    key: 2,
  }, {
    title: '其他',
    key: 3,
  }],
  refundStatus: [{
    title: '买家已经申请退款, 等待卖家同意',
    key: 'WAIT_SELLER_AGREE',
  }, {
    title: '卖家已经同意退款, 等待买家退货',
    key: 'WAIT_BUYER_RETURN_GOODS',
  }, {
    title: '买家已经退货, 等待卖家确认收货',
    key: 'WAIT_SELLER_CONFIRM_GOODS',
  }, {
    title: '卖家拒绝退款',
    key: 'SELLER_REFUSE_BUYER',
  }, {
    title: '退款关闭',
    key: 'CLOSED',
  }, {
    title: '退款成功',
    key: 'SUCCESS',
  }],
}
