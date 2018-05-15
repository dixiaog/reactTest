/*
 * @Author: Wupeng
 * @Date: 2017-1-2 10:04:11
 * @Last Modified by;
 * 商品类目
 * @Last Modified time:
 */
import React from 'react'
import { connect } from 'dva'
import { Row, Col, Input, Form, Checkbox, Popconfirm, message, Button, Menu, Dropdown, Icon } from 'antd'
import Classification from '../../components/Classification' // 商品类目左侧列表详情
import Jtable from '../../components/JcTable'
import SearchBar from '../../components/SearchBar'
import Specclassification from '../../components/Specclassification' // 商品类目添加标准类目列表详情
import CategoryMenu from '../../components/CategoryMenu'// 商品类目添加自定义分类
import Newindex from '../../components/AddSpecifications/Newindex'
import Emptying from '../../components/Emptying' // 清空所有分类警告框
import ImportTaobo from '../../components/ImportTaobo' // 导入我再淘宝商品中的类目
import Edit from '../../components/Edit/Edit' // 导入编辑模板
import Editattributes from '../../components/Edit/Edit/Editattributes' // 导入添加新属性
import CopyProperties from '../../components/Edit/Edit/CopyProperties' // 导入复制属性到其他类目
import Color from '../../components/AddSpecifications/Color1'
import styles from './Item.less'
import { cnamesReview } from '.././../components/Specclassification/uuite'
import Remaxe from '../../components/Buttonreamk/Remaxe'
import DelectModel from '../../components/Buttonreamk/DelectModel'
import {
  addAttributeInfo,
  updateAttributeInfo,
  selAttributeByAutoNo,
  deleteCategoryByNo,
  selSpecByCategoryNo,
  editSelectCategory,
  getAllStandardCategory,
  updateEnableStatus,
} from '../../services/category/category'
import { effectFetch } from '../../utils/utils'


@connect(state => ({
  category: state.category,
  edit: state.edit,
}))
@Form.create()
class Category extends React.Component {
  state = {
    Specclassificationvis: false,
    CategoryMenuvis: false,
    Emptyingvis: false,
    ImportTaobovis: false,
    Editvis: false,
    Editattributesvis: false,
    CopyPropertiesvis: false,
    CopyPropertiesvisData: {},
    bjectEditvisvis: {},
    categoryname: {},
    address: {},
    addressEditdate: {},
    cnames: [],
    Editattributesdatas: {},
    setite: [],
    NewAddrecord: [],
    Remaxevis: false,
    value: {},
    handle: null,
    text: null,
    DelectModelvis: false,
    colorarray: {},
    colorvis: false,
    Newindexvis: false,
    colorrecord: [],
    data: {},
    expandedKeys: ['0'],
    autoExpandParent: true,
  }
  // 构建组件
  componentWillMount() {
    // const { category } = getOtherStore()
    // if (!category || category.list.length === 0) {
    //   this.props.dispatch({ type: 'category/fetch' })
    // }
    effectFetch('category', this.props.dispatch)
    this.props.dispatch({ type: 'category/treead' })
}
  ondblclick = (text) => {
    const payload = {
      categoryNo: text.categoryNo,
    }
    if (text.isLeaf) {
      this.props.dispatch({
        type: 'category/catesomger',
        payload,
    })
    } else {
      this.props.dispatch({
        type: 'category/catesomger',
        payload,
    })
    }
  }
  // 定义添加Edit新属性
  onCancelhandelEditattributeshide = () => {
    this.setState({
      address: {},
      Editattributesvis: false,
   })
  }
  onchange = () => {
    this.props.dispatch({
      type: 'category/fetch',
    })
  }
  handlea = (record, e) => {
    e.preventDefault()
    const payload = Object.assign({
      categoryNo: record.categoryNo,
    })
    editSelectCategory({
      ...payload,
     }).then((json) => {
      if (json) {
        json.parentCategoryNos = json.parentCategoryNos.split(',')
        const parentArrr = []
        for (let i = 0; i < json.parentCategoryNos.length; i++) {
          parentArrr[i] = Number(json.parentCategoryNos[i])
        }
         json.parentCategoryNos = parentArrr
         if (json.cateList.length !== 0) {
            const data = cnamesReview(json.cateList)
            data.forEach((ele) => {
              Object.assign(ele, { value: ele.categoryNo })
              Object.assign(ele, { label: ele.categoryName })
            })
            data.unshift({
              label: '根分类',
              value: 0,
            })
            this.setState({
              setite: data,
              data: json,
              bjectEditvisvis: record,
              Editvis: true,
             })
        } else {
          const data = cnamesReview(json.cateList)
            data.forEach((ele) => {
              Object.assign(ele, { value: ele.categoryNo })
              Object.assign(ele, { label: ele.categoryName })
            })
            data.unshift({
              label: '根分类',
              value: 0,
            })
          this.setState({
              setite: data,
              data: json,
              bjectEditvisvis: record,
              Editvis: true,
             })
        }
      }
     })
  }
  // 启用禁用
  handleMenuClick = (e, x) => {
    let text = []
    for (let i = 0; i < e.length; i++) {
      text.push(e[i].categoryName)
    }
    // 1 启用 2 禁用
    if (x.key === '1') {
      this.setState({
        Remaxevis: true,
        value: x,
        handle: 1,
        text: text.toString(),
        CategoryTabelpush: e,
      })
    } else if (x.key === '2') {
      this.setState({
        Remaxevis: true,
        value: x,
        handle: 0,
        text: text.toString(),
        CategoryTabelpush: e,
      })
    }
  }
  handleas = (record, e) => {
  e.preventDefault()
  deleteCategoryByNo({
    ...record,
  }).then(() => {
    this.props.dispatch({
      type: 'category/search',
      payload: {
        delect: 1,
      },
    })
    this.props.dispatch({
      type: 'category/treead',
    })
    this.setState({
      expandedKeys: ['0'],
    })
  })
  }
  // 定义添加标准类目显示回调
  handleSpecclassificationvis = (e) => {
    getAllStandardCategory().then((json) => {
      const data = cnamesReview(json)
        data.forEach((ele) => {
          Object.assign(ele, { value: ele.categoryNo })
          Object.assign(ele, { label: ele.categoryName })
        })
      this.setState({
       cnames: data,
       Specclassificationvis: true,
       categoryname: e,
      })
    })
  }
    // 定义左侧树形列表点击之后的回调函数
    handleoldtree = (e, n) => {
        if (n.title === '根目录') {
          this.props.dispatch({ type: 'category/fetchss' })
        } else if (n.isLeaf) {
          const payload = {
            categoryNo: n.categoryNo,
          }
          this.props.dispatch({
            type: 'category/catesomger',
            payload,
         })
        } else {
          const payload = {
            categoryNo: n.categoryNo,
          }
          this.props.dispatch({
            type: 'category/catesomger',
            payload,
         })
        }
    }
    // 定义添加标准类目成功回调函数
    handleCancel = () => {
      this.setState({
        Specclassificationvis: false,
        expandedKeys: ['0'],
        cnames: [],
      })
      this.props.dispatch({
        type: 'category/search',
      })
      this.props.dispatch({
        type: 'category/treead',
      })
    }
    // 定义添加标准类目取消
    handleCanceltwo = () => {
      this.setState({
        Specclassificationvis: false,
        cnames: [],
      })
    }
    handelonExpand1 = (expandedKeys) => {
      this.setState({
        expandedKeys: expandedKeys,
        autoExpandParent: false,
      }) 
    }
    // handleempty 定义搜索功能
      // 搜索
  handleInput = () => {
      const categoryNameOrNossss = this.props.form.getFieldValue('categoryNameOrNo')
      const payload = {
        categoryNameOrNo: categoryNameOrNossss,
      }
      this.props.dispatch({
        type: 'category/entdsh',
        payload,
      })
    }
  handleempty = () => {
    // ant desigen Fomr 表单清空方法
    this.props.form.resetFields()
  }
  // 添加自定义分类
  handelCategoryMenu = () => {
    // console.log('添加自定义分类显示')
    this.setState({ CategoryMenuvis: true })
  }
  // 添加自定义分类
  handelCategoryMenus = () => {
    // console.log('添加自定义分类隐藏')
    this.setState({
      CategoryMenuvis: false,
      expandedKeys: ['0'],
    })
    this.props.dispatch({ type: 'category/fetch' })
    this.props.dispatch({ type: 'category/treead' })
  }
  // 添加自定义分类隐藏
  handelCategoryMenustwo = () => {
    // console.log('添加自定义分类隐藏')
    this.setState({
      CategoryMenuvis: false,
    })
  }
    // 接受从表格子组件穿过来的值
    hendelTabel = (e) => {
      // console.log('这是表格传过来的值', e)
      this.setState({
        data: e,
      })
    }
    // 定义显示清空所有分类警告框
    handelEmptyingvis = () => {
      // if (this.state.data.length === 0) {
      //   this.setState({ Emptyingvis: false })
      // } else {
      //   console.log('显示清空所有分类警告框')
      //   this.setState({ Emptyingvis: true })
      // }
    }
    // 定义显示清空所有分类隐藏
    handelEmptyinghide = () => {
      // console.log('隐藏清空所有分类警告框')
      this.setState({ Emptyingvis: false })
    }
    // 定义导入我在淘宝商品的类目警告框
    handelimportTaobovis = () => {
      // console.log('导入我在淘宝商品的类目')
      this.setState({ ImportTaobovis: true })
    }

    // 定义导入我在淘宝商品的类目隐藏
    handelimportTaobohide = () => {
      // console.log('导入我在淘宝商品的类目')
      this.setState({ ImportTaobovis: false })
    }

    // 定义导入编辑隐藏
    handelEditvishide = () => {
      this.props.form.resetFields()
      // console.log('定义导入编辑隐藏')
      this.setState({
        Editvis: false,
        setite: [],
        bjectEditvisvis: {},
        addressEditdate: {},
        data: {},
      })
    }
    // 定义导入编辑隐藏保存之后触发
    handelEditvishidesss = () => {
      this.setState({
        Editvis: false,
        setite: [],
        bjectEditvisvis: {},
        addressEditdate: {},
        expandedKeys: ['0'],
        data: {},
      })
      this.props.dispatch({ type: 'category/search' })
      this.props.dispatch({ type: 'category/treead' })
    }
    // 定义address 重新赋值
    addressdata = (e) => {
      this.setState({
        address: e,
      })
    }
    // 定义Edit添加新属性
    handelEditattributes = (e) => {
      if (e.dispatchConfig === undefined) {
        const payload = {
          autoNo: e.autoNo,
        }
        selAttributeByAutoNo({
          ...payload,
        }).then((data) => {
          this.setState({
            address: data,
            Editattributesvis: true,
          })
        })
    } else {
      this.setState({
        Editattributesvis: true,
      })
    }
    }
    handelEditattributesdata = (e) => {
      this.setState({
        Editattributesdatas: e,
      })
    }
     // 定义Edit添加新属性隐藏
    handelEditattributeshide = (e) => {
      const payload = e
      addAttributeInfo({
        ...payload,
      }).then(() => {
        const payload = {
          categoryNo: this.state.bjectEditvisvis.categoryNo,
        }
        this.props.dispatch({
          type: 'edit/fetch',
          payload,
        })
        this.setState({
          Editattributesvis: false,
        })
       })
    }
    Editattributesdata = (e) => {
     const payload = e
     payload.categoryNo = this.state.Editattributesdatas.categoryNo
     payload.autoNo = this.state.Editattributesdatas.autoNo
     payload.companyNo = this.state.Editattributesdatas.companyNo
     updateAttributeInfo({
       ...payload,
     }).then(() => {
       const payload = {
         categoryNo: this.state.Editattributesdatas.categoryNo,
       }
       this.props.dispatch({
         type: 'edit/fetch',
         payload,
       })
       this.setState({
         Editattributesvis: false,
       })
      })
    }
     // 导入复制属性到其他类目
     handelCopyProperties = (e) => {
      const data = JSON.stringify(e.data)
      const date = JSON.parse(data)
      const labeldata = []
      for (let i = 0; i < date.length; i++) {
       labeldata[i] = {
         label: date[i].categoryName,
         value: date[i].categoryName,
       }
      }
      const valuedata = e
      valuedata.labeldata = labeldata
      this.setState({
        CopyPropertiesvisData: valuedata,
        })
      this.setState({
        CopyPropertiesvis: true,
      })
    }
     // 导入复制属性到其他类目隐藏
     handelCopyPropertieshide = (e) => {
      console.log('定义Edit添加新属性隐藏', e)
      this.setState({ CopyPropertiesvis: false })
    }
    Remaxeone = (e) => {
      const data = this.state.CategoryTabelpush
      const payload = {}
      const categoryNos = []
      for (let i = 0; i < data.length; i++) {
        categoryNos.push(data[i].categoryNo)
      }
      payload.categoryNos = categoryNos.toString()
      if (e.key === '1') {
        payload.categoryStatus = 0
        updateEnableStatus({
          ...payload,
        }).then((json) => {
          if (json) {
            this.Remaxetwo()
            this.props.dispatch({ type: 'category/fetch' })
            message.success('启用成功')
          } else {
            message.error('启用失败')
          }
        })
      } else if (e.key === '2') {
        payload.categoryStatus = 1
        updateEnableStatus({
          ...payload,
        }).then((json) => {
          if (json) {
            this.Remaxetwo()
            this.props.dispatch({ type: 'category/fetch' })
            message.success('禁用成功')
          } else {
            message.error('禁用失败')
          }
        })
      }
    }
    Remaxetwo = () => {
      this.setState({
        Remaxevis: false,
      })
    }
    DelectModelone = () => {
      this.setState({
        DelectModelvis: true,
      })
    }
    DelectModeltwo = () => {
      this.setState({
        DelectModelvis: false,
      })
    }
    colorone = (e) => {
      const payload = e[0]
      selSpecByCategoryNo({
        ...payload,
      }).then((json) => {
        const speclistf = json.specList
        if (speclistf.length > 0) {
          for (let i = 0; i < speclistf.length; i++) {
            speclistf[i].list = i
            speclistf[i].key = i
          }
          this.setState({
            colorarray: e[0],
            colorrecord: speclistf,
            colorvis: true,
          })
        } else {
          this.setState({
            colorarray: e[0],
            colorrecord: [],
            colorvis: true,
          })
        }
      })
    }
    colortwo = () => {
      this.setState({
        colorarray: [],
        colorrecord: [],
        colorvis: false,
      })
    }
    Newindexone = (record, e) => {
        e.preventDefault()
        const payload = record
        selSpecByCategoryNo({
          ...payload,
        }).then((json) => {
          const speclists = json.specList
          if (speclists.length > 0) {
            for (let i = 0; i < speclists.length; i++) {
              speclists[i].list = i
              speclists[i].key = i
            }
            this.setState({
              NewAddrecord: speclists,
              NewRecore: record,
              Newindexvis: true,
            })
          } else {
            message.error('该类目下没有属性规格，请先添加类目属性规格。')
          }
        })
    }
  Newindextwo = () => {
    this.setState({
       NewAddrecord: [],
       NewRecore: {},
       Newindexvis: false,
    })
}
     render() {
      const { list, loading, total, page, selectedRowKeys, selectedRows, searchParam, treeData } = this.props.category
      const menu = (
        <Menu onClick={this.handleMenuClick.bind(this, selectedRows)}>
          <Menu.Item key="1"><Icon type="check-circle-o" />启用</Menu.Item>
          <Menu.Item key="2"><Icon type="close-circle-o" />禁用</Menu.Item>
        </Menu>
      )
        // 操作栏
        const tabelToolbar = [
          <Button key={1} type="primary" premission="CATEGORY_ADDSCA" onClick={this.handleSpecclassificationvis} size="small">添加标准分类</Button>,
          <Dropdown key={2} overlay={menu} premission="CATEGORY_UNSTATUS" disabled={(selectedRows.length === 0) ? true : false}>
            <Button type="primary" size="small" >
              启用/禁用 <Icon type="down" />
            </Button>
          </Dropdown>,
          <Button key={3} type="primary" premission="CATEGORY_ADDCUSCA" onClick={this.handelCategoryMenu} size="small">添加自定义分类</Button>,
          <Button key={4}
            type="primary"
            premission="CATEGORY_ADDSPEC"
            onClick={this.colorone.bind(this, selectedRows)}
            disabled={selectedRows.length === 1 ? false : true} size="small"
          >添加类目规格</Button>,
          // <Button type="primary" premission="CATEGORY_DELECTALL" className={styles.Button} onClick={this.DelectModelone} size="small">清空所有分类</Button>,
       ]
        // 搜索栏
      const searchBarItem = [
        {
          decorator: 'categoryNameOrNo',
          components: <Input placeholder="请输入查询信息" size="small" />,
        },
      ]
        // 搜索栏参数
        const searchBarProps = {
          colItems: searchBarItem,
          dispatch: this.props.dispatch,
          nameSpace: 'category',
          searchParam,
        }
      const columns = [{
        title: '序号',
        dataIndex: 'categoryNo',
        key: 'categoryNo',
        render: (text, record, index) => {
          return (
            <span>{index + 1}</span>
          )
        },
        width: '15%',
      }, {
        title: '名称(双击进入子分类列表)',
        dataIndex: 'categoryName',
        key: 'categoryName',
        width: '20%',
        render: (text, record) => {
          return (
            <span onDoubleClick={this.ondblclick.bind(this, record)}>{text}</span>
          )
        },
      }, {
        title: '排序',
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        width: '20%',
      },
      {
        title: '启用',
        dataIndex: 'categoryStatus',
        key: 'categoryStatus',
        width: '20%',
        render: (text) => {
          if (text === 0) {
            return <Checkbox checked />
          }
          if (text === 1) {
            return <Checkbox checked={false} />
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'address',
        key: 'address',
        width: '20%',
        render: (text, record) => {
            return (
              <div style={{ marginRight: 5 }}>
                <a onClick={this.handlea.bind(this, record)}>编辑&nbsp;</a>
                |<a onClick={this.Newindexone.bind(this, record)}>&nbsp;编辑类目规格&nbsp;</a>|
                <span>
                  <Popconfirm title="确定删除该分类吗?" okText="确定" onConfirm={this.handleas.bind(this, record)} cancelText="取消">
                    <a>删除</a>
                  </Popconfirm>
                </span>
              </div>
              )
          },
      }]
      const SpecclassificationForm = Form.create()(Specclassification)
    // 传到表格中的值
      const handelTabelfunction = [
        this.handelEditvisvis,
        this.handelEditvishide,
        this.state.Editattributesvis,
        this.handelEditattributes,
        this.handelCopyProperties,
        this.handleSpecclassificationvis,
        this.handelEditvishidesss,
      ]
      const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'category',
        tableName: 'categoryTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        
    }
    const Remaxedata = {
      Remaxevis: this.state.Remaxevis,
      Remaxeone: this.Remaxeone,
      Remaxetwo: this.Remaxetwo,
      value: this.state.value,
      handle: this.state.handle,
      text: this.state.text,
    }
    const DelectModeldata = {
      DelectModelvis: this.state.DelectModelvis,
      handelEmptyingvi: this.handelEmptyingvis,
      DelectModeltwo: this.DelectModeltwo,
    }
    const colordata = {
      colorvis: this.state.colorvis,
      colortwo: this.colortwo,
      colorarray: this.state.colorarray,
      colorrecord: this.state.colorrecord,
    }
    const Newindexdata = {
      Newindexvis: this.state.Newindexvis,
      Newindextwo: this.Newindextwo,
      NewAddrecord: this.state.NewAddrecord,
      NewRecore: this.state.NewRecore,
    }
        return (
          <div className={styles.contentBoard}>
            <Row>
              {/* 左侧树形列表 */}
              <Col span={4}>
                <Classification
                  handleoldtree={this.handleoldtree}
                  treeData={treeData}
                  autoExpandParent={this.state.autoExpandParent}
                  handelonExpand1={this.handelonExpand1}
                  expandedKeys={this.state.expandedKeys}
                />
              </Col>
              {/* 右侧详情列表 */}
              <Col span={20}>
              <div className={styles.contentBoard}>
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>
                    <SearchBar {...searchBarProps} />
                  </div>
                  <Jtable {...tableProps} />
                </div>
              </div>
              </Col>
            </Row>
            {/* 添加类目规格 */}
            {this.state.Specclassificationvis ? <SpecclassificationForm
              Specclassifications={this.state.Specclassificationvis}
              handleCancel={this.handleCancel}
              hendelonChangedate={this.state.hendelonChangedate}
              categoryname={this.state.categoryname}
              cnames={this.state.cnames}
              handleCanceltwo={this.handleCanceltwo}
            /> : null}
            {/* 添加自定义分类 */}
            {this.state.CategoryMenuvis ? <CategoryMenu
              CategoryMenuvis={this.state.CategoryMenuvis}
              handelCategoryMenu={this.handelCategoryMenu}
              handelCategoryMenus={this.handelCategoryMenus}
              handelCategoryMenustwo={this.handelCategoryMenustwo}
            /> : null}
            {this.state.Newindexvis ? <Newindex data={Newindexdata} /> : null}
            {/* 删除所有分类提示框 */}
            <Emptying
              Emptyingvis={this.state.Emptyingvis}
              handelEmptyinghide={this.handelEmptyinghide}
            />
            {/* 导入淘宝类目提示框 */}
            <ImportTaobo
              ImportTaobovis={this.state.ImportTaobovis}
              handelimportTaobohide={this.handelimportTaobohide}
            />
            {/* 编辑模板弹出框 */}
            {this.state.Editvis ? <Edit
              Editvis={this.state.Editvis}
              handelTabelfunction={handelTabelfunction}
              bjectEditvisvis={this.state.bjectEditvisvis}
              addressEditdate={this.state.addressEditdate}
              handelEditattributes={this.handelEditattributes}
              handelEditattributesdata={this.handelEditattributesdata}
              setite={this.state.setite}
              data={this.state.data}
            /> : null}
            {/* 添加新属性弹框 */}
            {this.state.Editattributesvis ? <Editattributes
              Editattributesvis={this.state.Editattributesvis}
              address={this.state.address}
              handelEditattributeshide={this.handelEditattributeshide}
              onCancelhandelEditattributeshide={this.onCancelhandelEditattributeshide}
              Editattributesdata={this.Editattributesdata}
              updatae={this.updatae}
              addressdata={this.addressdata}
              bjectEditvisvis={this.state.bjectEditvisvis}
            /> : null}
            {/* 复制属性到其他类目 */}
            <CopyProperties
              CopyPropertiesvis={this.state.CopyPropertiesvis}
              handelCopyPropertieshide={this.handelCopyPropertieshide}
              CopyPropertiesvisData={this.state.CopyPropertiesvisData}
            />
            {this.state.Remaxevis ? <Remaxe data={Remaxedata} /> : null}
            {this.state.DelectModelvis ? <DelectModel data={DelectModeldata} /> : null}
            {this.state.colorvis ? <Color data={colordata} /> : null}
          </div>
        )
    }
}

export default Category
