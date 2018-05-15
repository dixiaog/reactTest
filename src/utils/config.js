const APIV1 = 'http://10.101.4.102:8080/bsdyun-ecom-oms' // 测试地址，勿删
const WMS = 'http://10.101.4.104:8080/bsdyun-ecom-wms'
// const APIV1 = 'http://172.16.17.59:8100'
// const WMS = 'http://172.16.17.59:8101'
// const APIV1 = 'http://172.16.17.111:8080' // 昵称
// const APIV1 = 'http://172.16.17.161:8080' // 订单查询
// const APIV1 = 'http://172.16.16.48:8080'
// const APIV1 = 'http://172.16.17.142:8080'
// const APIV1 = 'http://172.16.16.137:8080'
// const WMS = 'http://172.16.17.79:9001'
// const APIV1 = 'http://172.16.17.79:9000' // 耿赛飞
// const APIV1 = 'http://172.16.17.123:8087'
// const APIV1 = 'http://172.16.17.39:8085'
// const APIV1 = 'http://172.16.17.37:8085'
// const APIV1 = 'http://172.16.17.142:8080'
// const APIV1 = 'http://172.16.17.36:8094' // 沈亮
// const APIV1 = 'http://172.16.17.113:8080' // 钱立
// const APIV1 = 'http://172.16.17.86:8080'
// const WMS = 'http://172.16.17.52:9001'
// const APIV1 = 'http://172.16.16.153:8080'
// const WMS = 'http://172.16.16.119:8082'
// const WMS = 'http://172.16.17.79:9001'
// const WMS = 'http://172.16.17.72:9001'
// const APIV1 = 'http://172.16.17.95:8022' // 李文

module.exports = {
  name: '雪冰电商',
  version: 'bete0.2.2',
  prefix: 'ecommerce',
  footerText: '江苏标新力亿信息技术有限公司 版权所有',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/api',
  APIV1,
  WMS,
  InputSize: 'small',
  picTureAddress: 'http://10.101.4.20:18880/bsdyun-file-server/picture',
  api: {
  },
}

