import Login from '../pages/Login.vue'
import printPage from '../pages/printPage.vue'
import userInfo from '../pages/baseInfo/userInfo.vue'
import roleInfo from '../pages/baseInfo/roleInfo.vue'
import infoHome from '../pages/baseInfo/infoHome.vue'
import roleSetting from '../pages/baseInfo/roleSetting.vue'
import companyArchives from '../pages/baseInfo/companyArchives.vue'
import organization from '../pages/baseInfo/organization.vue'
import userDep from '../pages/baseInfo/userDep.vue'
import welcome from '../pages/baseInfo/welcome.vue'
import outSideUser from '../pages/baseInfo/outSideUser.vue'
import readyDone from '../pages/baseInfo/readyDone.vue'
import createWbs from '../pages/baseInfo/createWbs.vue'

import task from '../pages/serviceManage/task.vue'
import serviceHome from '../pages/serviceManage/serviceHome.vue'
import zj_service from '../pages/serviceManage/zj_service.vue'
import zj_service_info from '../pages/serviceManage/zj_service_info.vue'
import zj_service_base from '../pages/serviceManage/zj_service_base.vue'
import zj_service_list from '../pages/serviceManage/zj_service_list.vue'

import sd_service from '../pages/serviceManage/sd_service.vue'
import sd_service_info from '../pages/serviceManage/sd_service_info.vue'
import sd_service_base from '../pages/serviceManage/sd_service_base.vue'
import sd_service_list from '../pages/serviceManage/sd_service_list.vue'

import yw_service from '../pages/serviceManage/yw_service.vue'
import yw_service_info from '../pages/serviceManage/yw_service_info.vue'
import yw_service_base from '../pages/serviceManage/yw_service_base.vue'
import yw_service_list from '../pages/serviceManage/yw_service_list.vue'

import HSE_service from '../pages/serviceManage/HSE_service.vue'
import HSE_service_info from '../pages/serviceManage/HSE_service_info.vue'
import HSE_service_base from '../pages/serviceManage/HSE_service_base.vue'
import HSE_service_list from '../pages/serviceManage/HSE_service_list.vue'

import servicePlan from '../pages/serviceManage/servicePlan.vue'
import serviceConfirm from '../pages/serviceManage/serviceConfirm.vue'
import zj_confirm_base from '../pages/serviceManage/zj_confirm_base.vue'
import zj_confirm from '../pages/serviceManage/zj_confirm.vue'
import zj_confirm_info from '../pages/serviceManage/zj_confirm_info.vue'

import sd_confirm_base from '../pages/serviceManage/sd_confirm_base.vue'
import sd_confirm from '../pages/serviceManage/sd_confirm.vue'
import sd_confirm_info from '../pages/serviceManage/sd_confirm_info.vue'

import yw_confirm_base from '../pages/serviceManage/yw_confirm_base.vue'
import yw_confirm from '../pages/serviceManage/yw_confirm.vue'
import yw_confirm_info from '../pages/serviceManage/yw_confirm_info.vue'

import staHome from '../pages/staData/staHome.vue'
import ctrlTable from '../pages/staData/ctrlTable.vue'
import proStateList from '../pages/staData/proStateList.vue'
import map from '../pages/staData/map.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
    },
    {
        path: '/printPage',
        component: printPage,
        name: '',
    },
    {
        path: '/welcome',
        component: welcome,
        name: '',
    },
    {
        path: '/baseInfo',
        childrenPath: '/baseInfo',
        component: infoHome,
        redirect: '/baseInfo/userInfo',
        name: '基本信息',
        leaf: true,
        iconCls: 'userInfo',//图标样式class
        children: [
          { path: 'userInfo',component: userInfo,name: '内部用户信息',leaf: false},
          { path: 'organization',component: organization,name: '内部组织机构',leaf: false},
          { path: 'outSideUser',component: outSideUser,name: '外部用户信息',leaf: false},
          { path: 'companyArchives',component: companyArchives,name: '施工单位档案',leaf: false},
          { path: 'roleInfo',component: roleInfo,name: '角色信息',leaf: false},
          { path: 'userDep',component: userDep,name: '用户部门参照',leaf: false},
          { path: 'roleSetting',component: roleSetting,name: '角色权限设置',leaf: false},   
          { path: 'createWbs',component: createWbs,name: 'JSA分析模板',leaf: false}
        ]
    },
    {
        path: '/service',
        childrenPath: '/service',
        component: serviceHome,
        name: '业务管理',
        leaf: true,
        iconCls: 'servm',
        redirect: '/service/servicePlan',
        children: [
          { path: 'task',component: task, name: '检修施工任务', leaf: false},
          { path: 'servicePlan',childrenPath: '/service/servicePlan',component: servicePlan, name: '现场高危作业计划',  leaf: true,children: [
            { path: 'zj_service',childrenPath: '/service/servicePlan/zj_service',redirect: '/service/servicePlan/zj_service/zj_service_base',component: zj_service, name: '直接方', leaf: true, 
            children: [
              { path: 'zj_service_base', component: zj_service_base, name: '直接方作业计划', leaf: false },
              { path: 'zj_service_list', component: zj_service_list, name: '直接方任务计划列表', leaf: false },
              { path: 'zj_service_info', component: zj_service_info, name: '直接作业方详情', leaf: false,meta: {keepAlive: true} }
            ]
            },
            { path: 'sd_service',childrenPath: '/service/servicePlan/sd_service',redirect: '/service/servicePlan/sd_service/sd_service_base',component: sd_service, name: '属地管理方', leaf: true, children: [
              { path: 'sd_service_base', component: sd_service_base, name: '属地管理方计划', leaf: false },
              { path: 'sd_service_list', component: sd_service_list, name: '属地管理方任务计划列表', leaf: false },
              { path: 'sd_service_info', component: sd_service_info, name: '属地管理方详情', leaf: false }
            ]},
            { path: 'yw_service',childrenPath: '/service/servicePlan/yw_service',redirect: '/service/servicePlan/yw_service/yw_service_base',component: yw_service, name: '业务管理方', leaf: true, children: [
              { path: 'yw_service_base', component: yw_service_base, name: '业务管理方计划', leaf: false },
              { path: 'yw_service_list', component: yw_service_list, name: '业务管理方任务计划列表', leaf: false },
              { path: 'yw_service_info', component: yw_service_info, name: '业务管理方详情', leaf: false }
            ]},
            { path: 'HSE_service',childrenPath: '/service/servicePlan/HSE_service',redirect: '/service/servicePlan/HSE_service/HSE_service_base',component: HSE_service, name: 'HSE管理方', leaf: true, children: [
              { path: 'HSE_service_base', component: HSE_service_base, name: 'HSE管理方计划', leaf: false },
              { path: 'HSE_service_list', component: HSE_service_list, name: 'HSE管理方任务计划列表', leaf: false},
              { path: 'HSE_service_info', component: HSE_service_info, name: 'HSE管理方详情', leaf: false }
            ]}
          ]},
          { path: 'serviceConfirm',childrenPath: '/service/serviceConfirm',component: serviceConfirm, name: '现场高危作业管控确认', leaf: true,children: [
            { path: 'zj_confirm',childrenPath: '/service/serviceConfirm/zj_confirm',redirect: '/service/serviceConfirm/zj_confirm/zj_confirm_base',component: zj_confirm, name: '直接作业方确认', leaf: true, children: [
              { path: 'zj_confirm_base', component: zj_confirm_base, name: '直接作业方确认', leaf: false },
              { path: 'zj_confirm_info', component: zj_confirm_info, name: '直接作业方确认详情', leaf: false }
            ]},
            { path: 'sd_confirm',childrenPath: '/service/serviceConfirm/sd_confirm',redirect: '/service/serviceConfirm/sd_confirm/sd_confirm_base',component: sd_confirm, name: '属地作业方确认', leaf: true, children: [
              { path: 'sd_confirm_base', component: sd_confirm_base, name: '属地作业方确认', leaf: false },
              { path: 'sd_confirm_info', component: sd_confirm_info, name: '属地作业方确认详情', leaf: false }
            ]},
            { path: 'yw_confirm',childrenPath: '/service/serviceConfirm/yw_confirm',redirect: '/service/serviceConfirm/yw_confirm/yw_confirm_base',component: yw_confirm, name: '业务作业方确认', leaf: true, children: [
              { path: 'yw_confirm_base', component: yw_confirm_base, name: '业务作业方确认', leaf: false },
              { path: 'yw_confirm_info', component: yw_confirm_info, name: '业务作业方确认详情', leaf: false }
            ]}
          ]},

        ]
    },
    {
        path: '/sta',
        childrenPath: '/sta',
        component: staHome,
        redirect: '/sta/proStateList',
        name: '统计分析',
        leaf: true,
        iconCls: 'sys',//图标样式class
        children: [
          { path: 'proStateList',component: proStateList,name: '现场高危作业计划一览表',leaf: false},
          { path: 'ctrlTable',component: ctrlTable,name: '现场高危作业管控确认一览表',leaf: false},
          { path: 'map',component: map,name: '现场高危作业区域',leaf: false},
        ]
    }
];

export default routes;
