<template>
	<div id="app">
	<div class="app-wrapper" :class="{hideSidebar:sidebar}">
		<side-bar class="sidebar-container" v-if='isLogin'></side-bar>
		<router-view @login="loginDirect"></router-view>
	</div>
	</div>
</template>

<script>
import sideBar from "@/component/sideBar.vue";
import * as util from "./assets/util.js";
import userFullPath from "./router/routes.js";

export default {
  name: "app",
  components: {
    sideBar
  },
  data() {
    return {
      menuData: null
    };
  },
  computed: {
    sidebar() {
      return this.$store.state.sideBarOpen;
    },
    isLogin() {
      if (this.$route.path === "/login" || this.$route.path === "/printPage") {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    loginDirect() {
      this.signIn();
    },
    signIn() {
      let saveRoute = JSON.parse(sessionStorage.getItem("treeString"));
      let localRoute = saveRoute.halfSelect.concat(saveRoute.selcect);
      //获得实际路由
      let allowedRouter = this.getRoutes(localRoute);
      if (!allowedRouter || !allowedRouter.length) {
        return (document.body.innerHTML = "<h1>账号访问受限，请联系系统管理员！</h1>");
      }
      //动态注入路由
      this.extendRoutes(allowedRouter);
      //保存数据用作他处，非必需
      this.menuData = allowedRouter;
    },
    getRoutes: function(userInfo) {
      if (!userInfo) {
        return console.warn(userInfo);
      }
      let vm = this;
      let allowedRouter = [];
      //将菜单数据转成多维数组格式
      let arrayMenus = util.buildMenu(userInfo);
      console.log(arrayMenus)
      //将多维数组转成对象格式
      let hashMenus = {};
      let setMenu2Hash = function(array, base) {
        array.map(key => {
          if (key.route) {
            let hashKey = ((base ? base + "/" : "") + key.route).replace(
              /^\//,
              ""
            );
            hashMenus["/" + hashKey] = true;
            if (Array.isArray(key.fakeChildren)) {
              setMenu2Hash(key.fakeChildren, key.childrenRoute);
            } else if (Array.isArray(key.children)) {
              setMenu2Hash(key.children, key.childrenRoute);
            }
          }
        });
      };
      setMenu2Hash(arrayMenus);
      console.log(hashMenus)
      //全局挂载hashMenus，用于实现路由守卫
      this.$root.hashMenus = hashMenus;
      //筛选本地路由方法
      let findLocalRoute = function(array, base) {
        let replyResult = [];
        array.forEach(function(route) {
          let pathKey = (base ? base + "/" : "") + route.path;
          if (hashMenus[pathKey]) {
            if (Array.isArray(route.children)) {
              route.children = findLocalRoute(
                route.children,
                route.childrenPath
              );
            }
            replyResult.push(route);
          }
        });
        if (base) {
          return replyResult;
        } else {
          allowedRouter = allowedRouter.concat(replyResult);
        }
      };
      let originPath = util.deepcopy(userFullPath);
      findLocalRoute(originPath);
      return allowedRouter;
    },
    extendRoutes: function(allowedRouter) {
      let _this = this;
      let actualRouter = util.deepcopy(allowedRouter);
      actualRouter.map(e => {
        //复制子菜单信息到meta用于实现导航相关效果，非必需
        if (e.children) {
          if (!e.meta) e.meta = {};
          e.meta.children = e.children;
        }
        //为动态路由添加独享守卫
        return (e.beforeEnter = function(to, from, next) {
          if (_this.$root.hashMenus[to.path]) {
            next();
          } else {
            next("/401");
          }
        });
      });
      let originPath = util.deepcopy(userFullPath);
      originPath = actualRouter;
      //注入路由
      _this.$router.addRoutes(originPath);
    }
  },
  created() {
    this.signIn();
  }
};
</script>
<style lang="scss">
@import "element-variables.scss";
</style>
<style lang="scss">
@import "src/styles/sideBar.scss";
body {
  margin: 0px;
  padding: 0px;
  background: #eef1f6;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  a {
    text-decoration: none;
    out-line: none;
  }
}
.toolbar {
  background: #fff;
  padding-bottom: 0;
  border-radius: 4px;
  margin: 5px 0;
  padding-top: 5px;
  padding-left: 5px;
  .el-form-item {
    margin-bottom: 5px;
  }
}
</style>
