export default {
  namespace: 'shops',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    loading: false,
    selectedRows: [],
    list: [],
    page: {},
    total: 0,
  },

  effects: {
    *fetch ({ payload = {} }, { put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      // const data = yield call(query, payload)
      yield put({
        type: 'changeState',
        payload: { loading: false },
      })
      yield put({
        type: 'changeState',
        payload: {
          list: [
            {
              shopNo: 1,
              shopName: '店铺1',
              shortName: '店1',
              address: '常熟市虞山镇',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },{
              shopNo: 2,
              shopName: '店铺2',
              shortName: '店2',
              address: '山东',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },{
              shopNo: 3,
              shopName: '店铺3',
              shortName: '店3',
              address: '南京',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },{
              shopNo: 4,
              shopName: '店铺4',
              shortName: '店4',
              address: '无锡',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },{
              shopNo: 5,
              shopName: '店铺5',
              shortName: '店5',
              address: '常熟市虞山镇',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },{
              shopNo: 6,
              shopName: '店铺6',
              shortName: '店6',
              address: '山东',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },{
              shopNo: 7,
              shopName: '店铺7',
              shortName: '店7',
              address: '南京',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },{
              shopNo: 8,
              shopName: '店铺8',
              shortName: '店8',
              address: '无锡',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },{
              shopNo: 9,
              shopName: '店铺9',
              shortName: '店9',
              address: '常熟市虞山镇',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },{
              shopNo: 10,
              shopName: '店铺10',
              shortName: '店10',
              address: '山东',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },{
              shopNo: 11,
              shopName: '店铺11',
              shortName: '店11',
              address: '南京',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },{
              shopNo: 12,
              shopName: '店铺12',
              shortName: '店12',
              address: '无锡',
              enable: Math.random() * 10 > 5 ? 1 : 0,
              shopLevel: Math.random() * 10 > 3 ? (Math.random() * 10 > 6 ? 3 : 2) : 1,
            },
          ],
          page: {current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 20},
          total: 12,
        },
      })
    },
  },

  reducers: {
    changeState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
