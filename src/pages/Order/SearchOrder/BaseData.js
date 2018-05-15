module.exports = {
  treeData: [{
    title: '待付款-待确认',
    key: '0',
    }, {
      title: '已付款待审核',
      key: '1',
    }, {
      title: '已审核待配快递',
      key: '2',
    }, {
      title: '发货中(打单拣货)',
      key: '3',
    }, {
      title: '已发货',
      key: '4',
    }, {
      title: '已变更',
      key: '5',
    }, {
      title: '已取消',
      key: '6',
    }, {
      title: '被合并',
      key: '7',
    }, {
      title: '被拆分',
      key: '8',
    }, {
      title: '预售待尾款',
      key: '9',
    }, {
      title: '客审待财审',
      key: '10',
  }],
  treeDataChild: [{
    title: '等待订单合并',
    key: '12',
  }, {
    title: '等待售后收货',
    key: '13',
  }, {
    title: '缺货',
    key: '14',
  }, {
    title: '未设定快递',
    key: '15',
  }, {
    title: '商品编码异常',
    key: '16',
  }, {
    title: '合并订单取消',
    key: '17',
  }, {
    title: '黑名单',
    key: '18',
  }, {
    title: '特殊单',
    key: '19',
  }, {
    title: '获取电子面单错误',
    key: '20',
  }, {
    title: '收货信息异常',
    key: '21',
  }, {
    title: '合并订单线上修改地址',
    key: '22',
  }, {
    title: '暂停发货',
    key: '23',
  }, {
    title: '组合商品编码异常',
    key: '24',
  }, {
    title: '其他',
    key: '25',
  }, {
    title: '资金不足',
    key: '26',
  }, {
    title: '价格过低',
    key: '27',
  }, {
    title: '不明确分销',
    key: '28',
  }, {
    title: '部分付款',
    key: '29',
  }],
  buyer: [
    {
      key: 'siteBuyerNo',
      title: '买家账号',
    },
    {
      key: 'expressNo',
      title: '快递单号',
    },
    {
      key: 'receiver',
      title: '收货人',
    },
    {
      key: 'mobileNo',
      title: '手机',
    },
    {
      key: 'telNo',
      title: '固定电话',
    },
    {
      key: 'province',
      title: '收货人省',
    },
    {
      key: 'city',
      title: '收货人城市',
    },
    {
      key: 'county',
      title: '收货县区',
    },
    {
      key: 'address',
      title: '详细地址',
    }],
  orderType: [{
    title: '普通订单',
    key: '0',
  }, {
    title: '补发订单',
    key: '1',
  }, {
    title: '换货订单',
    key: '2',
  }, {
    title: '天猫分销',
    key: '3',
  }, {
    title: '天猫供销',
    key: '4',
  }, {
    title: '协同订单',
    key: '5',
  }],
  shopList: [{
    title: '店铺1',
    key: '0',
  }, {
    title: '店铺2',
    key: '1',
  }, {
    title: '店铺3',
    key: '2',
  }, {
    title: '店铺4',
    key: '3',
  }, {
    title: '店铺5',
    key: '4',
  }, {
    title: '店铺6',
    key: '5',
  }, {
    title: '店铺7',
    key: '6',
  }, {
    title: '店铺8',
    key: '7',
  }],
  billList: [{
    key: 0,
    title: '普通订单',
  }, {
    key: 1,
    title: '补发订单',
  }, {
    key: 2,
    title: '换货订单',
  }, {
    key: 3,
    title: '天猫分销',
  }, {
    key: 4,
    title: '天猫供销',
  }, {
    key: 5,
    title: '协同订单',
  }],
  abnormal: [{
    key: 0,
    title: '等待售后收货',
  }, {
    key: 1,
    title: '等待售后收货',
  }, {
    key: 2,
    title: '等待售后收货',
  }, {
    key: 3,
    title: '等待售后收货',
  }, {
    key: 4,
    title: '等待售后收货',
    companyNo: 1,
  }, {
    key: 5,
    title: '等待售后收货',
    companyNo: 1,
  }],
  billCancel: [{
    key: 0,
    title: '商品缺货',
  }, {
    key: 1,
    title: '商品缺货',
  }, {
    key: 2,
    title: '商品缺货',
  }, {
    key: 3,
    title: '商品缺货',
  }, {
    key: 4,
    title: '商品缺货',
  }, {
    key: 5,
    title: '商品缺货',
  }],
  payment: [{
    key: 0,
    title: '支付宝',
  }, {
    key: 1,
    title: '银行转账',
  }, {
    key: 2,
    title: '现金支付',
  }, {
    key: 3,
    title: '京东-货到付款',
  }, {
    key: 4,
    title: '京东-在线支付',
  }, {
    key: 5,
    title: '京东-分期付款',
  }, {
    key: 6,
    title: '京东-公司转账',
  }, {
    key: 7,
    title: '唯品会',
  }, {
    key: 8,
    title: '内部流转',
  }, {
    key: 9,
    title: '供销支付',
  }, {
    key: 10,
    title: '快速支付',
  }, {
    key: 11,
    title: '其他',
  }],
}
