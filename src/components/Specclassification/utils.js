

export function cnamesReview(response) {
    response.forEach((ele) => {
      Object.assign(ele, { value: ele.categoryNo })
      Object.assign(ele, { label: ele.categoryName })
    })
    const cnames = response.filter(ele => ele.parentCategoryNo * 1 === 0) // 取出父集
    let res = response.filter(ele => ele.parentCategoryNo * 1 !== 0) // 取出非父集
    for (const cname of cnames) {
      if (res.filter(ele => ele.parentCategoryNo * 1 === cname.categoryNo * 1).length !== 0) {
        cname.children = res.filter(ele => ele.parentCategoryNo * 1 === cname.categoryNo * 1) // 父集第一层子集
        res = res.filter(ele => ele.parentCategoryNo * 1 !== cname.categoryNo * 1) // 剩余的元素
        if (res.length !== 0) {
          cname.children = childrenReview(cname.children, res)
        }
        // child.push(cname.children)
      }
    }
    // console.log('child', child)
    return cnames
  }
  export function childrenReview(child, res) {
    let re = []
    for (const ch of child) {
      if (res.filter(ele => ele.parentCategoryNo * 1 === ch.categoryNo * 1).length !== 0) {
        ch.children = res.filter(ele => ele.parentCategoryNo * 1 === ch.categoryNo * 1)
        re = res.filter(ele => ele.parentCategoryNo * 1 !== ch.categoryNo * 1)
        if (re.length !== 0) {
          ch.children = childrenReview(ch.children, re)
        }
      }
    }
    return child
  }

