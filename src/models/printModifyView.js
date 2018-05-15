
/* global window */
/* global document */
/* global location */
import update from 'immutability-helper'
import { getTemp } from '../services/api'

export default {
  namespace: 'printModifyView',

  state: {
    snapToGridAfterDrop: false,
    snapToGridWhileDragging: false,
    boxes: {},
    needReload: false,
    item: {},
    activeKey: '',
    tables: [],
    tableStyle: {
      left: 20,
      top: 20,
    },
    presetFields: [],
    tempName: '',
    pageConfig: {},
  },

  effects: {
    * getPrintTemp({ payload }, { put, call }) {
      const json = yield call(getTemp, payload)
      const jsonParam = JSON.parse(json.templateFields.replace(/\s+/g, ''))
      const printFields = json.printFields === '' ? {} : JSON.parse(json.printFields)
      const printConfig = json.printConfig === '' ? {} : JSON.parse(json.printConfig)
      console.log('getPrintTemp', json)
      const presetFields = [{
        type: 5,
        name: '字段信息',
        rows: jsonParam.common,
      }, {
        type: 3,
        name: '表格',
        rows: jsonParam.table,
      }]
      yield put({
        type: 'updateState',
        payload: { presetFields, needReload: true, tempName: json.templateName, ...printFields, printConfig },
      })
    },
    * update({ payload },{ put, call }) {
     yield put({
        type: 'updateState',
        payload: { ...payload },
      })
    },
    // * activeFilter({ payload }, { put, select }) {
    //   const { id } = payload
    //   const boxes = yield select(state => state.printModifyView.boxes)
    //   Object.keys(boxes).forEach((key) => { boxes[key].actived = false })
    //   const newBoxes = update(boxes, {
    //     [id]: { $merge: {
    //       actived: true,
    //     } },
    //   })
    //   yield put({
    //     type: 'updateState',
    //     payload: { boxes: newBoxes, needReload: true, item: newBoxes[id], activeKey: id },
    //   })
    // },
    * activeTableFilter({ payload }, { put, select }) {
      const { thOrTd, i, column } = payload
      const tables = yield select(state => state.printModifyView.tables)
      Object.keys(tables).forEach((key) => { tables[key].actived = 0 })
      const newTables = update(tables, {
        [i]: { $merge: {
          actived: thOrTd,
        } },
      })
      yield put({
        type: 'updateState',
        payload: { tables: newTables, needReload: true, item: Object.assign(column, { actived: thOrTd }), activeKey: 'table' },
      })
    },
    // * moveBox({ payload }, { put, select }) {
    //   const { id, left, top } = payload
    //   if (id === 'table') {
    //     yield put({
    //       type: 'updateState',
    //       payload: { tableStyle: { left, top }, needReload: false },
    //     })
    //   } else {
    //     const boxes = yield select(state => state.printModifyView.boxes)
    //     // Object.keys(boxes).forEach((key) => { boxes[key].actived = false })
    //     const newBoxes = update(boxes, {
    //       [id]: {
    //         $merge: { left, top },
    //       },
    //     })
    //     yield put({
    //       type: 'updateState',
    //       payload: { boxes: newBoxes, needReload: false },
    //     })
    //   }
    // },
    // * resizeTrigger({ payload }, { put, select }) {
    //   const { id, width, height } = payload
    //   const boxes = yield select(state => state.printModifyView.boxes)
    //   const newBoxes = update(boxes, {
    //     [id]: {
    //       $merge: { width, height },
    //     },
    //   })
    //   yield put({
    //     type: 'updateState',
    //     payload: { boxes: newBoxes, needReload: false },
    //   })
    // },
    // * addBox({ payload }, { put, select }) {
    //   const itemKind = {
    //     top: 20, left: 20, actived: false, width: 100, height: 30,
    //   }
    //   const { item } = payload
    //   const boxes = yield select(state => state.printModifyView.boxes)
    //   // Object.keys(boxes).forEach((key) => { boxes[key].actived = false })
    //   let box = {}
    //   switch (item.type) {
    //     case 1:// 虚实线
    //       box = { title: '', type: 1, ...itemKind, cssDefault: { ...item.border, borderWidth: '1px' } }
    //       break
    //     case 5:// 内置参数
    //       box = { title: `{${item.id}}`, value: item.id, type: 5, ...itemKind, cssDefault: {} }
    //       break
    //     case 4:// 自定义框
    //       box = { title: item.title, value: item.title, type: 4, ...itemKind, cssDefault: {} }
    //       break
    //     default:
    //       box = { title: '缺省', ...itemKind, cssDefault: {} }
    //       break
    //   }
    //   Object.assign(boxes, {
    //     [Object.keys(boxes).length]: box,
    //   })
    //   yield put({
    //     type: 'updateState',
    //     payload: { boxes, needReload: true },
    //   })
    // },
    // * changeDomCss({ payload }, { put, select }) {
    //   const { id, field, item } = payload
    //   if (id === 'table') {
    //     const tables = yield select(state => state.printModifyView.tables)
    //     const tIndex = tables.findIndex(e => e.actived !== 0)
    //     let newItem = {}
    //     if (item.actived === 1) {
    //       newItem = update(item, {
    //         thCss: {
    //             $merge: { ...field },
    //         },
    //       })
    //       // Object.assign(item.thCss, { ...field })
    //     } else {
    //       newItem = update(item, {
    //         tdCss: {
    //             $merge: { ...field },
    //         },
    //       })
    //     }
    //     // Object.assign(item, item.actived === 1 ? { thCss: { ...field } } : { tdCss: { ...field } })
    //     tables[tIndex] = newItem
    //     yield put({
    //       type: 'updateState',
    //       payload: { tables, item: newItem },
    //     })
    //   } else {
    //     const boxes = yield select(state => state.printModifyView.boxes)
    //     const newBoxes = update(boxes, {
    //       [id]: {
    //         cssDefault: {
    //           $merge: { ...field },
    //         },
    //       },
    //     })
    //     yield put({
    //       type: 'updateState',
    //       payload: { boxes: newBoxes },
    //     })
    //   }
    // },
    // * removeDom({ payload }, { put, select }) {
    //   const { activeKey } = payload
    //   if (activeKey === 'table') {
    //     const tables = yield select(state => state.printModifyView.tables)
    //     const tIndex = tables.findIndex(e => e.actived !== 0)
    //     tables.splice(tIndex, 1)
    //     yield put({
    //       type: 'updateState',
    //       payload: { tables, needReload: true },
    //     })
    //   } else {
    //     const boxes = yield select(state => state.printModifyView.boxes)
    //     const newBoxes = {}
    //     Object.keys(boxes).forEach((key) => {
    //       if (key !== activeKey) {
    //         Object.assign(newBoxes, {
    //           [key]: boxes[key],
    //         })
    //       }
    //     })
    //     yield put({
    //       type: 'updateState',
    //       payload: { boxes: newBoxes, needReload: true },
    //     })
    //   }
    // },
    // * removeColumn({ payload }, { put, select }) {
    //   const { splice } = payload
    //   const tables = yield select(state => state.printModifyView.tables)
    //   tables.splice(splice[0])
    //   tables.splice(splice[1])
    //   yield put({
    //     type: 'updateState',
    //     payload: { tables, needReload: true },
    //   })
    // },
    // * modifyTitle({ payload }, { put, select }) {
    //   const { id, title } = payload
    //   const boxes = yield select(state => state.printModifyView.boxes)
    //   const newBoxes = update(boxes, {
    //     [id]: {
    //       $merge: { title },
    //     },
    //   })
    //   yield put({
    //     type: 'updateState',
    //     payload: { boxes: newBoxes, needReload: false },
    //   })
    // },
    // * changeAct({ payload }, { put, select }) {
    //   const { id, type } = payload
    //   if (id === 'table') {
    //     const tables = yield select(state => state.printModifyView.tables)
    //     const tIndex = tables.findIndex(e => e.actived !== 0)
    //     const newTables = update(tables, {
    //       [tIndex]: {
    //           $merge: { act: type },
    //       },
    //     })
    //     yield put({
    //       type: 'updateState',
    //       payload: { tables: newTables, needReload: true, item: newTables[tIndex] },
    //     })
    //   } else {
    //     const boxes = yield select(state => state.printModifyView.boxes)
    //     const newBoxes = update(boxes, {
    //       [id]: {
    //         $merge: { type },
    //       },
    //     })
    //     yield put({
    //       type: 'updateState',
    //       payload: { boxes: newBoxes, needReload: true, item: newBoxes[id] },
    //     })
    //   }
    // },
    * addTableCols({ payload }, { put, select }) {
      const { col } = payload
      const tables = yield select(state => state.printModifyView.tables)
      tables.push(Object.assign(col, {
        thCss: {
          width: 50,
          height: 30,
        },
        tdCss: {
          width: 50,
          height: 30,
        },
        actived: 0,
        act: 0,
      }))
      // Object.assign(tables, {
      //   [Object.keys(tables).length]: col,
      // })
      yield put({
        type: 'updateState',
        payload: { tables, needReload: true },
      })
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname }) => {
    //     if (pathname === '/' || pathname === '/app') {
    //       dispatch({ type: 'query', payload: [] })
    //     }
    //   })
    // },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
