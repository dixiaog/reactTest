import { getUrlParams } from './utils'

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
]
const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
]
const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/HrxcVbrKnCJOZvtzSqjN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/alaPpKWajEbIYEUvvVNf.png',
  'https://gw.alipayobjects.com/zos/rmsportal/RLwlKSYGSXGHuWSojyvp.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
]
const desc = [
  '那是一种内在的东西， 他们到达不了，也无法触及的',
  '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  '生命就像一盒巧克力，结果往往出人意料',
  '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  '那时候我只会想自己想要什么，从不想自己拥有什么',
]

const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
]

const itemType = ['成品', '半成品', '废品']

// 数据字典
const diclistname = ['波司登', '雪中飞', '冰洁', '衬衫', '裤子']
const dictype = ['品牌', '类型']
const modifyDate = ['2017-12-16 11:11:10', '2017-12-15 08:11:10', '2017-12-17 18:11:10']

// 物流快递
const expressname = ['顺丰', '圆通', '中通', '申通', 'EMS']

export function fakeList(count) {
  const list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      owner: user[i % 10],
      title: titles[i % 8],
      avatar: avatars[i % 8],
      cover: parseInt(i / 4, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
      status: ['active', 'exception', 'normal'][i % 3],
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: avatars[i % 8],
      href: 'https://ant.design',
      updatedAt: new Date(new Date().getTime() - (1000 * 60 * 60 * 2 * i)),
      createdAt: new Date(new Date().getTime() - (1000 * 60 * 60 * 2 * i)),
      subDescription: desc[i % 5],
      description: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      star: Math.ceil(Math.random() * 100) + 100,
      like: Math.ceil(Math.random() * 100) + 100,
      message: Math.ceil(Math.random() * 10) + 10,
      content: '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
        },
      ],
    })
  }

  return list
}

export function getFakeList(req, res, u) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }

  const params = getUrlParams(url)

  const count = (params.count * 1) || 20

  const result = fakeList(count)

  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}

export const getNotice = [
  {
    id: 'xxx1',
    title: titles[0],
    logo: avatars[0],
    description: '那是一种内在的东西， 他们到达不了，也无法触及的',
    updatedAt: new Date(),
    member: '科学搬砖组',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx2',
    title: titles[1],
    logo: avatars[1],
    description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
    updatedAt: new Date('2017-07-24'),
    member: '全组都是吴彦祖',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx3',
    title: titles[2],
    logo: avatars[2],
    description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
    updatedAt: new Date(),
    member: '中二少女团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx4',
    title: titles[3],
    logo: avatars[3],
    description: '那时候我只会想自己想要什么，从不想自己拥有什么',
    updatedAt: new Date('2017-07-23'),
    member: '程序员日常',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx5',
    title: titles[4],
    logo: avatars[4],
    description: '凛冬将至',
    updatedAt: new Date('2017-07-23'),
    member: '高逼格设计天团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx6',
    title: titles[5],
    logo: avatars[5],
    description: '生命就像一盒巧克力，结果往往出人意料',
    updatedAt: new Date('2017-07-23'),
    member: '骗你来学计算机',
    href: '',
    memberLink: '',
  },
]

export const getActivities = [
  {
    id: 'trend-1',
    updatedAt: new Date(),
    user: {
      name: '林东东',
      avatar: avatars[0],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-2',
    updatedAt: new Date(),
    user: {
      name: '付小小',
      avatar: avatars[1],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-3',
    updatedAt: new Date(),
    user: {
      name: '曲丽丽',
      avatar: avatars[2],
    },
    group: {
      name: '中二少女团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-4',
    updatedAt: new Date(),
    user: {
      name: '周星星',
      avatar: avatars[3],
    },
    project: {
      name: '5 月日常迭代',
      link: 'http://github.com/',
    },
    template: '将 @{project} 更新至已发布状态',
  },
  {
    id: 'trend-5',
    updatedAt: new Date(),
    user: {
      name: '朱偏右',
      avatar: avatars[4],
    },
    project: {
      name: '工程效能',
      link: 'http://github.com/',
    },
    comment: {
      name: '留言',
      link: 'http://github.com/',
    },
    template: '在 @{project} 发布了 @{comment}',
  },
  {
    id: 'trend-6',
    updatedAt: new Date(),
    user: {
      name: '乐哥',
      avatar: avatars[5],
    },
    group: {
      name: '程序员日常',
      link: 'http://github.com/',
    },
    project: {
      name: '品牌迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
]

export const getShops = [{
  title: '雪中飞天猫旗舰店', key: '1',
}, {
  title: '冰洁天猫旗舰店', key: '2',
}]

// 商品类目
export const getCnames = [{
  value: '卫衣',
  label: '卫衣',
  children: [{
    value: '韩版',
    label: '韩版',
    children: [{
      value: '修身',
      label: '修身',
    }],
  }],
}, {
  value: '羽绒服',
  label: '羽绒服',
}]

// 商品类目属性值
export const getSpec = [{
  specName: '颜色',
  specVal: [{
    type: 0,
    name: '红色',
    wEnable: false,
    checked: false,
  }, {
    type: 0,
    name: '蓝色',
    wEnable: false,
    checked: false,
  }, {
    type: 0,
    name: '黄色',
    wEnable: false,
    checked: false,
  }, {
    type: 0,
    name: '白色',
    wEnable: false,
    checked: false,
  }, {
    type: 0,
    name: '黑色',
    wEnable: false,
    checked: false,
  },
  //  {
  //   type: 1,
  //   name: '橘黄色',
  //   wEnable: false,
  //   checked: false,
  // }, {
  //   type: 1,
  //   name: '粉色',
  //   wEnable: true,
  //   checked: false,
  // }
],
}, {
  specName: '尺寸',
  specVal: [{
    type: 0,
    name: '170/S',
    wEnable: false,
    checked: false,
  }, {
    type: 0,
    name: '170/M',
    wEnable: false,
    checked: false,
  },
  //  {
  //   type: 1,
  //   name: '175/L',
  //   wEnable: false,
  //   checked: false,
  // }, {
  //   type: 1,
  //   name: '180/XL',
  //   wEnable: true,
  //   checked: false,
  // }
],
}]

export function itemList(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      iId: `bsd-item-${i}`,
      img: avatars[i % 8],
      itemType: itemType[i % 3],
      cname: '羽绒服',
      brand: '波司登',
      vcname: '',
      marketPrice: 2043,
      sPrice: 1024,
      supplierName: '',
      supplierIid: '',
      Enable: true,
    })
  }
  if (searchParam && searchParam.iId) {
    list = list.filter(ele => ele.iId.indexOf(searchParam.iId) > -1)
  }
  if (searchParam && searchParam.skuNo) {
    list = list.filter(ele => ele.skuNo.indexOf(searchParam.skuNo) > -1)
  }
  if (searchParam && searchParam.onsale) {
    list = list.filter(ele => ele.onsale.indexOf(searchParam.onsale) > -1)
  }
  if (searchParam && searchParam.name) {
    list = list.filter(ele => ele.name.indexOf(searchParam.name) > -1)
  }
  if (searchParam && searchParam.brand) {
    list = list.filter(ele => ele.brand.indexOf(searchParam.brand) > -1)
  }

  if (searchParam && searchParam.supplierId) {
    list = list.filter(ele => ele.supplierId.indexOf(searchParam.supplierId) > -1)
  }
  if (searchParam && searchParam.supplieriId) {
    list = list.filter(ele => ele.supplieriId.indexOf(searchParam.supplieriId) > -1)
  }
  if (searchParam && searchParam.cName) {
    list = list.filter(ele => ele.cName.indexOf(searchParam.cName) > -1)
  }
  return { list, total: count }
}

export function getItemList(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }

  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)
  const count = (params.count * 1) || 20
  const result = itemList(count, searchParam)

  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}

export function dicList(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      dicInfo: `${i}`,
      dicType: dictype[i % 2],
      dicName: diclistname[i % 5],
      modifyDate: modifyDate[i % 3],
      remark: `test${i}`,
      enable: true,
    })
  }
  if (searchParam && searchParam.dicType) {
    list = list.filter(ele => ele.dicType.indexOf(searchParam.dicType) > -1)
  }
  if (searchParam && searchParam.dicName) {
    list = list.filter(ele => ele.dicName.indexOf(searchParam.dicName) > -1)
  }
  return { list, total: count }
}

// 数据字典
export function getDicLists(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }
  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)
  const count = (params.count * 1) || 20
  const result = dicList(count, searchParam)
  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}


export function expresslist(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      warehouseName: `仓库${i}`,
      warehouseNo: `No-${i}`,
      expressCorpNo: `${i}`,
      expressType: i % 3,
      expressCorpName: expressname[i % 5],
      modifyDate: modifyDate[i % 3],
      remark: `test${i}`,
      enableStatus: true,
      priorityLevel: i % 5,
      carriagePriority: 0,
      upperLimit: (i + 1) * 2,
      lowerLimit: (i + 1),
    })
  }
  if (searchParam && searchParam.dicType) {
    list = list.filter(ele => ele.dicType.indexOf(searchParam.dicType) > -1)
  }
  if (searchParam && searchParam.dicName) {
    list = list.filter(ele => ele.dicName.indexOf(searchParam.dicName) > -1)
  }
  return { list, total: count }
}

// 物流快递
export function getExpresslists(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }
  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)
  const count = (params.count * 1) || 5
  const result = expresslist(count, searchParam)
  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}

export function powerList(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `power-list-${i}`,
      powerName: `pName-${i}`,
      powerGroup: Math.random() * 10 > 5 ? 'USERGROUP' : 'ORDERGROUP',
      powerTitle: `权限-${i}`,
      powerUrl: `pUrl-${i}`,
      powerType: Math.random() * 10 > 5 ? 0 : 1,
      remark: `remark-${i}`,
    })
  }
  if (searchParam && searchParam.powerName) {
    list = list.filter(ele => ele.powerName.indexOf(searchParam.powerName) > -1)
  }
  if (searchParam && searchParam.powerGroup) {
    list = list.filter(ele => ele.powerGroup.indexOf(searchParam.powerGroup) > -1)
  }
  return { list, total: count }
}

export function getPowerList(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }
  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)

  const count = (params.count * 1) || 20

  const result = powerList(count, searchParam)

  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}

export function printList(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `print-list-${i}`,
      pName: `打印-${i}`,
      pTypeName: Math.random() * 10 > 5 ? '条码' : '吊牌',
      isDefault: false,
      coid: Math.random() * 10 > 5 ? 0 : 1,
    })
  }
  if (searchParam && searchParam.powerName) {
    list = list.filter(ele => ele.powerName.indexOf(searchParam.powerName) > -1)
  }
  if (searchParam && searchParam.powerGroup) {
    list = list.filter(ele => ele.powerGroup.indexOf(searchParam.powerGroup) > -1)
  }
  return { list, total: count }
}
export function userList(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `power-list-${i}`,
      powerName: `pName-${i}`,
      powerGroup: Math.random() * 10 > 5 ? 'USERGROUP' : 'ORDERGROUP',
      powerTitle: `权限-${i}`,
      powerUrl: `pUrl-${i}`,
      powerType: Math.random() * 10 > 5 ? 0 : 1,
      remark: `remark-${i}`,
    })
  }
  if (searchParam && searchParam.powerName) {
    list = list.filter(ele => ele.powerName.indexOf(searchParam.powerName) > -1)
  }
  if (searchParam && searchParam.powerGroup) {
    list = list.filter(ele => ele.powerGroup.indexOf(searchParam.powerGroup) > -1)
  }
  return { list, total: count }
}

export function getPrints(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }
  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)

  const count = (params.count * 1) || 20

  const result = printList(count, searchParam)
  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}

export function getUsers(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }
  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)

  const count = (params.count * 1) || 20

  const result = userList(count, searchParam)

  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}
export const getRoles = [{
  title: '标准',
  key: '1',
  children: [{
    title: '宾客', key: '6',
  }],
}, {
  title: '分销',
  key: '2',
  children: [{
    title: '雪中飞一级', key: '7',
  }],
}, {
  title: '仓储',
  key: '3',
  children: [{
    title: '仓库管理', key: '8',
  }],
}, {
  title: '全渠道',
  key: '4',
  children: [{
    title: '门卫大叔', key: '9',
  }],
}]


export const getRolePowers = [
  {
    name: '基础',
    key: 'base',
    children: [
      {
        name: '菜单列表',
        key: 'menus',
        children: [{
          name: '列表显示',
          key: 'menusShow',
        }, {
          name: '菜单编辑',
          key: 'menusEdit',
        }],
      },
      {
        name: '权限维护',
        key: 'powers',
      }, {
        name: '数据字典',
        key: 'diclist',
      }, {
        name: '角色维护',
        key: 'roles',
      },
      {
        name: '仓库资料',
        key: 'hdd',
      },
    ],
  },
  {
    name: '商品',
    key: 'item',
    children: [
      {
        name: '商品维护',
        key: 'items',
      },
      {
        name: '商品库容资料',
        key: 'itemsCapacity',
      },
      {
        name: '普通商品资料',
        key: 'commonItem',
      },
      {
        name: '组合商品资料',
        key: 'combinationItem',
      },
    ],
  },
]

export const getMenus = [
  {
    name: '仪表盘',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '首页',
        path: 'analysis',
      },
      {
        name: '监控页',
        path: 'monitor',
      },
      {
        name: '工作台',
        path: 'workplace',
        children: [
          {
            name: '多级目录',
            path: 'mutil',
          }],
      },
    ],
  },
  {
    name: '表单',
    path: 'form',
    icon: 'form',
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
      },
      {
        name: '分步表单',
        path: 'step-form',
        children: [
          {
            path: 'confirm',
          },
          {
            path: 'result',
          },
        ],
      },
      {
        name: '高级表单',
        path: 'advanced-form',
      },
    ],
  },
  {
    name: '列表',
    path: 'list',
    icon: 'table',
    children: [
      {
        name: '查询表格',
        path: 'table-list',
      },
      {
        name: '标准列表',
        path: 'basic-list',
      },
      {
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表（项目）',
        path: 'cover-card-list',
      },
      {
        name: '搜索列表（应用）',
        path: 'filter-card-list',
      },
      {
        name: '搜索列表（文章）',
        path: 'search',
      },
    ],
  },
  {
    name: '详情',
    path: 'profile',
    icon: 'profile',
    children: [
      {
        name: '基础详情页',
        path: 'basic',
      },
      {
        name: '高级详情页',
        path: 'advanced',
      },
    ],
  },
  {
    name: '打印',
    path: 'print',
    icon: 'printer',
    children: [
      {
        name: '模版编辑',
        path: 'printModifyView',
      },
    ],
  },
  {
    name: '基础',
    path: 'base',
    icon: 'setting',
    children: [
      {
        name: '店铺管理',
        path: 'shops',
        icon: 'shop',
      },
      {
        name: '打印模版',
        path: 'prints',
        icon: 'printer',
      }, {
        name: '物流快递',
        path: 'expresslist',
        icon: 'global',
      },
      {
        name: '仓库资料',
        path: 'warehouse',
        icon: 'hdd',
      },
      {
        name: '公司信息',
        path: 'companys',
        icon: 'book',
      },
      {
        name: '品牌资料',
        path: 'brands',
        icon: 'book',
      },
      {
        name: '平台站点',
        path: 'authorize',
        icon: 'global',
      },
    ],
  },
  {
    name: '商品',
    path: 'item',
    icon: 'appstore-o',
    children: [
      {
        name: '商品维护',
        path: 'items',
        icon: 'flag',
      },
      {
        name: '商品类目',
        path: 'category',
        icon: 'bars',
      },
      {
        name: '商品库容资料',
        path: 'skus',
        icon: 'flag',
      },
      {
        name: '普通商品资料',
        path: 'commonItem',
        icon: 'book',
      },
      {
        name: '组合商品资料',
        path: 'combinationItem',
        icon: 'book',
      },
      {
        name: '资料删除日志',
        path: 'itemDeleteLog',
        icon: 'file',
      },
    ],
  },
  {
    name: '系统',
    path: 'system',
    icon: 'desktop',
    children: [
      {
        name: '用户管理',
        path: 'userManager',
        icon: 'user',
      },
      {
        name: '角色权限',
        path: 'roles',
        icon: 'smile-o',
      },
      {
        name: '菜单资源',
        path: 'menus',
        icon: 'appstore-o',
      },
      {
        name: '权限资源',
        path: 'power',
        icon: 'lock',
      },
      {
        name: '数据字典',
        path: 'dictionary',
        icon: 'book',
      },
    ],
  },
]

export function skuList(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      autoNo: `${i}`, // 自动编码
      imageUrl: avatars[i % 8], // 图片
      productNo: `bsd-item-${i}`, // 款式编码
      skuNo: `bsd-item-${i}`, // 商品编码
      productName: `冬款羽绒-${i}`, // 商品名
      retailCapacityLimit: 100, // 零售库容上限
      entireCapacityLimit: 100, // 整存库容上限
      standardBoxing: 10, // 标准装箱数量
      shortName: `冬款羽绒-${i}`, // 商品简称
      productSpec: Math.random() * 10 > 5 ? 'OTHER' : 'RED', // 颜色及规格
      brandNo: 'BSD', // 品牌
      brandName: '波司登', // 品牌
      enableStatus: Math.random() * 10 > 5 ? 'true' : 'false', // 启用
    })
  }
  if (searchParam) {
    if (searchParam.iId) { // 款式码
      list = list.filter(ele => ele.iId.indexOf(searchParam.iId) > -1)
    }
    if (searchParam.itemName) { // 商品名
      list = list.filter(ele => ele.itemName.indexOf(searchParam.itemName) > -1)
    }
    if (searchParam.itemAbb) { // 商品简称
      list = list.filter(ele => ele.itemAbb.indexOf(searchParam.itemAbb) > -1)
    }
    if (searchParam.color) { // 颜色及规格
      list = list.filter(ele => ele.color.indexOf(searchParam.color) > -1)
    }
    if (searchParam.enable) { // 启用
      list = list.filter(ele => ele.enable === searchParam.enable)
    }
  }
  return { list, total: list.length }
}

export function getSkuList(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }
  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)
  const count = (params.count * 1) || 20

  const result = skuList(count, searchParam)
  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}

export function companyList(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      companyId: `fake-list-${i}`, // 公司编号
      companyName: `公司名称-${i}`, // 公司名称
      enable: Math.random() * 10 > 5 ? 'true' : 'false', // 启用
      companyAbb: `公司简称-${i}`, // 公司简称
      companyType: Math.random() * 10 > 5 ? '0' : '1', // 公司类型
      createTime: '2017-12-28 10:10:10', // 创建时间
    })
  }
  if (searchParam) {
    if (searchParam.companyName) { // 公司名称
      list = list.filter(ele => ele.companyName.indexOf(searchParam.companyName) > -1)
    }
    if (searchParam.enable) { // 启用
      list = list.filter(ele => ele.enable === searchParam.enable)
    }
  }
  return { list, total: list.length }
}

export function getCompanyList(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }
  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)
  const count = (params.count * 1) || 20

  const result = companyList(count, searchParam)
  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}

export function brandList(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      brandId: `fake-list-${i}`, // 品牌编号
      brandName: `品牌名称-${i}`, // 品牌名称
      brandAbb: `品牌简称-${i}`, // 品牌简称
      brandImg: avatars[i % 8], // 品牌图标
      enable: Math.random() * 10 > 5 ? 'true' : 'false', // 启用
      isDistributorAuth: Math.random() * 10 > 5 ? 'true' : 'false', // 是否允许分销商授权
    })
  }
  if (searchParam) {
    if (searchParam.brandName) { // 公司名称
      list = list.filter(ele => ele.brandName.indexOf(searchParam.brandName) > -1)
    }
    if (searchParam.enable) { // 启用
      list = list.filter(ele => ele.enable === searchParam.enable)
    }
  }
  return { list, total: list.length }
}

export function getBrandList(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }
  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)
  const count = (params.count * 1) || 20

  const result = brandList(count, searchParam)
  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}


export function shopList(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      shopNo: `fake-list-${i}`,
      siteName: `站点名称-${i}`,
      siteShortName: `简称-${i}`, // 品牌图标
      shopName: `d-${i}`,
      shopShortName: `D简称-${i}`,
      shopAddress: '1',
      mainAccount: `主账户-${i}`,
      principal: `负责人-${i}`,
      telNo: '',
      authorizeStatus: Math.random() * 10 > 5 ? '已授权' : '已过期',
      authorizeCode: '',
      expireTime: '',
      authorizeConfig: '',
      isOrderDownload: false,
      isDeliveryUpload: false,
      isInventoryUpload: false,
      isSupportDownload: false,
      isTaobaoSupply: false,
      storeNo: false,
      enableStatus: Math.random() * 10 > 5 ? 'true' : 'false',
      createTime: '',
      updateTime: '',
    })
  }
  if (searchParam) {
    if (searchParam.brandName) { // 公司名称
      list = list.filter(ele => ele.brandName.indexOf(searchParam.brandName) > -1)
    }
    if (searchParam.enable) { // 启用
      list = list.filter(ele => ele.enable === searchParam.enable)
    }
  }
  return { list, total: list.length }
}

export function getShopList(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }
  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)
  const count = (params.count * 1) || 20

  const result = shopList(count, searchParam)
  if (res && res.json) {
    res.json(result)
  } else {
    return { list: result, total: count }
  }
}

export default {
  getNotice,
  getActivities,
  getFakeList,
  getMenus,
  getSpec,
  getCnames,
  getItemList,
  getPowerList,
  getDicLists,
  getRoles,
  getRolePowers,
  getExpresslists,
  getPrints,
  getUsers,
  getShops,
  getSkuList,
  getCompanyList,
  getBrandList,
  getShopList,
}
