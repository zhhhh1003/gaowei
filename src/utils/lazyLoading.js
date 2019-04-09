export default (name, type) => () => {
  switch (type) {
    case 1:
      import(`@/pages/serviceManage/${name}.vue`)
      break
    case 2:
      import(`@/pages/baseInfo/${name}.vue`)
      break  
  }
}
