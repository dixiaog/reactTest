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

export function powerList(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `${i}`,
      powerNum: `权限编号-${i}`,
      powerName: `权限名称-${i}`,
      path: `路由-${i}`,
      powerGroup: Math.random() * 10 > 5 ? 'USERGROUP' : 'ORDERGROUP',
      powerTitle: `权限标题-${i}`,
      // powerUrl: `pUrl-${i}`,
      // powerType: Math.random() * 10 > 5 ? 0 : 1,
      remark: `备注-${i}`,
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

export function getResource(req, res, u, b) {
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

export function dictionary(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `${i}`,
      Category: `类别-${i}`,
      number: `00-${i + 1}`,
      Name: Math.random() * 10 > 5 ? '雪中飞' : '冰洁',
      modifyDate: `2017-01-0${i + 1}`,
      remark: `备注-${i}`,
    })
  }
  if (searchParam && searchParam.Category) {
    list = list.filter(ele => ele.Category.indexOf(searchParam.Category) > -1)
  }
  if (searchParam && searchParam.Name) {
    list = list.filter(ele => ele.Name.indexOf(searchParam.Name) > -1)
  }
  return { list, total: count }
}

export function getDictionary(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }
  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)

  const count = (params.count * 1) || 20

  const result = dictionary(count, searchParam)

  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}

export function userList(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `power-list-${i}`,
      imgUrl: 'http://pic4.nipic.com/20091217/3885730_124701000519_2.jpg',
      userName: `user${i}`,
      nickName: `昵称-${i}`,
      Name: `姓名-${i}`,
      Role: `角色-${i}`,
      Sex: 0,
      Phone: `1391362194${i}`,
      Email: '872235113@qq.com',
      Enable: Math.random() * 10 > 5 ? true : false,
      Controller: 0,
      btnSwitch: false,
      roleList: ['无', '客户', '管理员'],
      shopList: ['无', '雪中飞天猫店', '冰洁京东店'],
      busMan: ['无', '客户A', '客户B'],
    })
  }
  if (searchParam && searchParam.userName) {
    list = list.filter(ele => ele.userName.indexOf(searchParam.userName) > -1)
  }
  if (searchParam && searchParam.Name) {
    list = list.filter(ele => ele.Name.indexOf(searchParam.Name) > -1)
  }
  if (searchParam && searchParam.Role) {
    list = list.filter(ele => searchParam.Role.indexOf(ele.Role) > -1)
  }
  return { list, total: count }
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

export const getRolesList = [{
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
  },
  {
    title: '门卫大妈', key: '10',
  }],
}]

export const getRolePowersJ = [
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
      }, {
        name: '仓库资料维护',
        key: 'warehouse',
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
    ],
  },
]

export const getMenusJ = [
  {
    name: '仪表盘',
    icon: 'dashboard',
    path: 'dashboard',
    Enable: true,
    children: [
      {
        name: '首页',
        path: 'analysis',
        Enable: true,
      },
      {
        name: '监控页',
        path: 'monitor',
        Enable: true,
      },
      {
        name: '工作台',
        path: 'workplace',
        Enable: true,
        // children: [
        //   {
        //     name: '多级目录',
        //     path: 'mutil',
        //   }],
      },
    ],
  },
  {
    name: '表单',
    path: 'form',
    icon: 'form',
    Enable: false,
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
        Enable: false,
      },
      {
        name: '分步表单',
        path: 'step-form',
        Enable: false,
        // children: [
        //   {
        //     path: 'confirm',
        //   },
        //   {
        //     path: 'result',
        //   },
        // ],
      },
      {
        name: '高级表单',
        path: 'advanced-form',
        Enable: false,
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
      // {
      //   name: '菜单列表',
      //   path: 'menus',
      //   icon: 'book',
      // },
      {
        name: '权限维护',
        path: 'powers',
        icon: 'api',
      }, {
        name: '数据字典',
        path: 'diclist',
        icon: 'book',
      }, {
        name: '打印模版',
        path: 'prints',
        icon: 'printer',
      }, {
        name: '物流快递',
        path: 'expresslist',
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
        name: '商品库容资料',
        path: 'skus',
        icon: 'flag',
      },
      {
        name: '普通商品资料',
        path: 'commonItem',
        icon: 'flag',
      },
      {
        name: '组合商品资料',
        path: 'combinationItem',
        icon: 'flag',
      },
    ],
  },
  {
    name: '系统',
    path: 'system',
    icon: 'user',
    children: [
      {
        name: '用户管理',
        path: 'userManager', // 无效的
        icon: 'flag',
      },
      {
        name: '角色权限维护',
        path: 'roles', // 无效的
        icon: 'flag',
      },
      {
        name: '菜单资源维护',
        path: 'menus', // 无效的
        icon: 'flag',
      },
    ],
  },
]

const itemType = ['成品', '半成品', '废品']
export function itemlist(count, searchParam) {
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
      Enable: Math.random() * 10 > 5 ? 'true' : 'false', // 启用
    })
  }
  if (searchParam && searchParam.Category) {
    list = list.filter(ele => ele.Category.indexOf(searchParam.Category) > -1)
  }
  if (searchParam && searchParam.Name) {
    list = list.filter(ele => ele.Name.indexOf(searchParam.Name) > -1)
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

  const result = itemlist(count, searchParam)

  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}

export function authorize(count, searchParam) {
  let list = []
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `${i}`,
      siteName: `站点名称-${i}`,
      shortName: `站点简称-${i + 1}`,
      siteIcon: 'http://pic4.nipic.com/20091217/3885730_124701000519_2.jpg',
      enableStatus: Math.random() * 10 > 5 ? 1 : 0,
      authorizeAddress: `授权地址-${i}`,
    })
  }
  if (searchParam && searchParam.Category) {
    list = list.filter(ele => ele.Category.indexOf(searchParam.Category) > -1)
  }
  if (searchParam && searchParam.Name) {
    list = list.filter(ele => ele.Name.indexOf(searchParam.Name) > -1)
  }
  return { list, total: count }
}

export function getAuthorize(req, res, u, b) {
  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }
  const body = (b && b.body) || req.body
  const { searchParam } = body
  const params = getUrlParams(url)

  const count = (params.count * 1) || 20

  const result = authorize(count, searchParam)

  if (res && res.json) {
    res.json(result)
  } else {
    return result
  }
}


export default {
  getUsers,
  getRolesList,
  getRolePowersJ,
  getMenusJ,
  getResource,
  getDictionary,
  getItemList,
  getAuthorize,
}
