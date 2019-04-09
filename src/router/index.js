import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

let baseRoute = [{
  path: '/login',
  name: '登录',
  component: (resolve) => require(['../pages/Login.vue'], resolve)
}, {
  path: '/printPage',
  name: '打印',
  component: (resolve) => require(['../pages/printPage.vue'], resolve)
}, {
  path: '/welcome',
  name: 'welcome',
  component: (resolve) => require(['../pages/baseInfo/welcome.vue'], resolve)
}, 
{
        path: '/baseInfo',
        childrenPath: '/baseInfo',
        component: (resolve) => require(['../pages/baseInfo/infoHome.vue'], resolve),
        redirect: '/baseInfo/userInfo',
        name: '基本信息',
        leaf: true,
        iconCls: 'userInfo',//图标样式class
        children: [
          { path: 'readyDone',component: (resolve) => require(['../pages/baseInfo/readyDone.vue'], resolve),name: '待办事项列表',leaf: false,iconCls: 'el-icon-message'},
        ]
    }];

let router = new Router({
  routes: baseRoute
});

router.beforeEach((to, from, next) => {
  let routeName = to.meta.name || to.name;
  next();
});

export default router;
