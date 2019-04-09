import axios from 'axios';

// let base = 'http://192.168.0.127:8030/api'
// let base = 'http://10.206.1.147:8017/api'
// let base = 'http://192.168.137.250:8030/api'
let base = 'http://218.58.78.125:1730/api'
// let base = window.location.host + '/api'
var qs=require('qs')
var instance = axios.create({
    headers: {'content-type': 'application/x-www-form-urlencoded'}
});

var instance2 = axios.create({
    headers: {'content-type': 'application/json'}
});

export const innerLogin = params => { return instance.get(`${base}/Account/Login`, {params: params}) };

export const outLogin = params => { return instance.get(`${base}/Account/LoginTwo`, {params: params}) };
//承包商信息
export const getCompany = params => { return instance.get(`${base}/Company/GetList`, {params: params}) };

export const createCompany = params => { return instance.get(`${base}/Company/Create`, {params: params}) };

export const editCompany = params => { return instance.get(`${base}/Company/Edit`, {params: params}) };

export const delCompany = params => { return instance.get(`${base}/Company/Delete`, {params: params}) };

// 用户信息
export const getUserListPage = params => { return instance.get(`${base}/SysUser/GetList`, {params: params}) };

export const createUser = params => { return instance.get(`${base}/SysUser/Create`, {params: params}) };

export const editUser = params => { return instance.get(`${base}/SysUser/Edit`, {params: params}) };

export const editUserPwd = params => { return instance.get(`${base}/SysUser/EditPassWord`, {params: params}) };

export const delUser = params => { return instance.get(`${base}/SysUser/Delete`, {params: params}) };
// 外部用户
export const editSide = params => { return instance.get(`${base}/SysUserTwo/Edit`, {params: params}) };

export const editSidePwd = params => { return instance.get(`${base}/SysUserTwo/EditPassWord`, {params: params}) };

export const delSide = params => { return instance.get(`${base}/SysUserTwo/Delete`, {params: params}) };

export const createSide = params => { return instance.get(`${base}/SysUserTwo/Create`, {params: params}) };

export const getSide = params => { return instance.get(`${base}/SysUserTwo/GetList`, {params: params}) };
// 角色信息
export const getRoleListPage = params => { return instance.get(`${base}/SysRole/GetList`, {params: params}) };

export const createRole = params => { return instance.get(`${base}/SysRole/Create`, {params: params}) };

export const editRole = params => { return instance.get(`${base}/SysRole/Edit`, {params: params}) };

export const delRole = params => { return instance.get(`${base}/SysRole/Delete`, {params: params}) };

//组织机构
export const getDepList = params => { return instance.get(`${base}/Department/GetDepList`, {params: params}) };

export const getDepType = params => { return instance.get(`${base}/DepartmentType/GetList`, {params: params}) };

export const createDep = params => { return instance.get(`${base}/Department/Create`, {params: params}) };

export const delDep = params => { return instance.get(`${base}/Department/Delete`, {params: params}) };

export const editDep = params => { return instance.get(`${base}/Department/Edit`, {params: params}) };

// 获取项目
export const getListPage = params => { return instance.get(`${base}/OperationTask/GetList`, {params: params}) };

export const getDetail = params => { return instance.get(`${base}/OperationTask/Details`, {params: params}) };

export const addRow = params => { return instance.get(`${base}/OperationTask/Create`, {params: params}) };

export const deleteRow = params => { return instance.get(`${base}/OperationTask/Delete`, {params: params}) };

// 作业计划
// 直接作业方
export const zj_getPlanList = params => { return instance.get(`${base}/DirectOperationPlan/GetList`, {params: params}) };

export const IsTabExpire = params => { return instance.get(`${base}/DirectOperationPlan/IsTabExpire`, {params: params}) };

export const zj_getTaskTabList = params => { return instance.get(`${base}/DirectOperationPlan/PlansList`, {params: params}) };

export const zj_deletePlan = params => { return instance.get(`${base}/DirectOperationPlan/TaskDelete`, {params: params}) };

export const zj_getDetail = params => { return instance.get(`${base}/DirectOperationPlan/Details`, {params: params}) };

export const zj_delDetail = params => { return instance.get(`${base}/DirectOperationPlan/Delete`, {params: params}) };

export const zj_createPlan = params => { return instance2.post(`${base}/DirectOperationPlan/Create`, params) };

export const zj_editPlan = params => { return instance2.post(`${base}/DirectOperationPlan/Edit`, params) };

export const subPermit = params => { return instance2.post(`${base}/TaskPermit/Create`, params) };

export const DetailsCreate = params => { return instance2.post(`${base}/DirectOperationPlan/DetailsCreate`, params) };

export const IsVertical = params => { return instance.get(`${base}/DirectOperationPlan/IsVertical`, {params: params}) };
// 驳回
export const TaskReject = params => { return instance2.get(`${base}/DirectOperationPlan/TaskReject`, {params: params}) };
export const RejectRecord = params => { return instance2.get(`${base}/DirectOperationPlan/GetReturnTakList`, {params: params}) };
export const zj_TaskReject = params => { return instance2.get(`${base}/DirectOperationPlan/ZhiGetRejectList`, {params: params}) };
export const zj_recall = params => { return instance2.get(`${base}/DirectOperationPlan/WithdrawReject`, {params: params}) };
export const readyConfirm = params => { return instance.get(`${base}/OperationCheck/GetAgencyConfirmed`, {params: params}) };
//属地管理方
export const sd_getPlanList = params => { return instance.get(`${base}/BelongsManage/GetList`, {params: params}) };

export const sd_getTaskTabList = params => { return instance.get(`${base}/BelongsManage/PlansList`, {params: params}) };

export const sd_deletePlan = params => { return instance.get(`${base}/BelongsManage/Delete`, {params: params}) };

export const sd_getDetail = params => { return instance.get(`${base}/BelongsManage/Details`, {params: params}) };

export const sd_createPlan = params => { return instance.get(`${base}/BelongsManage/Create`, {params: params}) };

export const across_E = params => { return instance.get(`${base}/OperationTaskFile/Edit`, {params: params})};
export const across_D = params => { return instance.get(`${base}/OperationTaskFile/Details`, {params: params})};
//业务管理方
export const yw_getPlanList = params => { return instance.get(`${base}/BusinessManage/GetList`, {params: params}) };

export const yw_getTaskTabList = params => { return instance.get(`${base}/BusinessManage/PlansList`, {params: params}) };

export const yw_deletePlan = params => { return instance.get(`${base}/BusinessManage/Delete`, {params: params}) };

export const yw_getDetail = params => { return instance.get(`${base}/BusinessManage/Details`, {params: params}) };

export const yw_createPlan = params => { return instance.get(`${base}/BusinessManage/Create`, {params: params}) };

//模板
export const getTemplateList = params => { return instance.get(`${base}/OperationRecord/GetListAll`, {params: params}) };

export const getTemplate = params => { return instance.get(`${base}/OperationRecord/GetList`, {params: params}) };
export const createTemplate = params => { return instance.get(`${base}/OperationRecord/Create`, {params: params}) };
export const editTemplate = params => { return instance.get(`${base}/OperationRecord/Edit`, {params: params}) };
export const delTemplate = params => { return instance.get(`${base}/OperationRecord/Delete`, {params: params}) };
export const getTplInfo = params => { return instance.get(`${base}/OperationPlan/GetListByRedordID`, {params: params}) };
export const getTplCon = params => { return instance.get(`${base}/OperationPlan/GetList`, {params: params}) };
export const createTplCon = params => { return instance2.post(`${base}/OperationPlan/Create`, params) };
// 确认
export const getConfirmList = params => { return instance.get(`${base}/OperationCheck/GetOperationCheckSelectTaskList`, {params: params}) };

export const subConfirm = params => { return instance.get(`${base}/OperationCheck/Create`, {params: params}) };

export const subEdit = params => { return instance.get(`${base}/OperationCheck/Edit`, {params: params}) };

export const shudiConfirm = params => { return instance.get(`${base}/OperationCheck/ShuDiEdit`, {params: params}) };

export const yewuConfirm = params => { return instance.get(`${base}/OperationCheck/YeWuEdit`, {params: params}) };

export const ConfirmHeadInfo = params => { return instance.get(`${base}/OperationCheck/GetOperationCheckById`, {params: params}) };

export const unConfirmHeadInfo = params => { return instance.get(`${base}/OperationTask/Details`, {params: params}) };

// 角色权限
export const getRootList = params => { return instance.get(`${base}/SysRolePower/GetList`, {params: params}) };

export const editRoot = params => { return instance2.post(`${base}/SysRolePower/Edit`, params) };

export const addRoot = params => { return instance2.post(`${base}/SysRolePower/Create`, params) };

// 报表
export const planSta = params => { return instance.get(`${base}/OperationDetailsReport/GetList`, {params: params}) };

export const ctrlSta = params => { return instance.get(`${base}/OperationCheckReport/GetList`, {params: params}) };

//用户组织结构
export const getUserDep = params => {return instance.get(`${base}/UserDepRange/GetList`, {params: params}) }

export const createUser2Dep = params => { return instance.get(`${base}/UserDepRange/Create`, {params: params}) };

export const delUserDep = params => { return instance.get(`${base}/V_UserDepRange/DeleteByUserCode`, {params: params}) };

//作业许可
export const getPermitList = params => { return instance.get(`${base}/Permit/GetList`, {params: params})}

export const getPermitLevel = params => { return instance.get(`${base}/PLevel/GetList`, {params: params})}

// 地图
export const addArea = params => { return instance.get(`${base}/DirectOperationPlan/MapEditTaskTab`, {params: params})}

export const getArea = params => { return instance.get(`${base}/DirectOperationPlan/GetMapTabInfo`, {params: params})}
export const getAreaAll = params => { return instance.get(`${base}/DirectOperationPlan/RoleGetMapTabInfo`, {params: params})}
// const baseUrl = 'http://192.168.0.111:8017/api'

// export default {
//   requestLogin (param, successCB, errorCB) {
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', baseUrl + '/Account?UserName=' + param.UserName + '&Password=' + param.Password, true);
//     xhr.onreadystatechange = () => {
//       if (xhr.readyState == 4) {
//         if (xhr.status == 200) {
//           successCB(xhr.responseText)
//         }else {
//           errorCB(xhr.responseText)
//         }
//       }
//     }
//     xhr.send(null);
//   },

//
//   getListPage (param, successCB, errorCB) {
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', baseUrl + '/Account?UserName=' + param.UserName + '&Password=' + param.Password, true);
//     xhr.onreadystatechange = () => {
//       if (xhr.readyState == 4) {
//         if (xhr.status == 200) {
//           successCB(xhr.responseText)
//         }else {
//           errorCB(xhr.responseText)
//         }
//       }
//     }
//     xhr.send(null);
//   },
// }
