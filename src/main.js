import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './store/index'
import Vuex from 'vuex'

import router from './router'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
// Vue.use(VueRouter)
// Vue.use(Vuex)

// const router = new VueRouter({
//   routes
// })

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('treeString');
  } 
  let user = sessionStorage.getItem('user');

  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

// router.afterEach(transition => {
// NProgress.done();
// });

var vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// function reload(){
//     vm.$forceUpdate()
// };
