<template>
<el-row class='navBar'>
  <el-col :span='14'>
    <div class='hamburger-container'>
      <svg t="1492500959545" @click="toggleClick" class="wscn-icon hamburger" :class="{'is-active':isActive}" style="" viewBox="0 0 1024 1024"
        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1691" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64">
        <path d="M966.8023 568.849776 57.196677 568.849776c-31.397081 0-56.850799-25.452695-56.850799-56.850799l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 543.397081 998.200404 568.849776 966.8023 568.849776z"
          p-id="1692"></path>
        <path d="M966.8023 881.527125 57.196677 881.527125c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 856.07443 998.200404 881.527125 966.8023 881.527125z"
          p-id="1693"></path>
        <path d="M966.8023 256.17345 57.196677 256.17345c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.850799 56.850799-56.850799l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.850799l0 0C1023.653099 230.720755 998.200404 256.17345 966.8023 256.17345z"
          p-id="1694"></path>
      </svg>
    </div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style='line-height: 60px;'>
      <el-breadcrumb-item :to="homePage">首页</el-breadcrumb-item>
      <template v-for='nav in navs'>
      <el-breadcrumb-item :to="nav.path">{{nav.name}}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </el-col>
  <el-col :span='10'>
    <header-bar></header-bar>
  </el-col>
</el-row>
</template>
<script>
	import headerBar from './headerBar.vue'
  export default {
    props: {
      isActive: {
        type: Boolean,
        default: false
      },
      toggleClick: {
        type: Function,
        default: null
      }
    },
    data () {
      return {
        
      }
    },
    components: {
      headerBar
    },
    computed: {
			navs () {
        return this.$route.matched
			},
      homePage () {
        let userType = sessionStorage.getItem('userType')
        if (userType === 'inner') {
          return { path: "/sta/map" }
        }else {
          return { path: "/welcome" }
        }
      }
		}
  }
</script>
<style scope>
.navBar {
  height: 60px;
  background: #d1d1d2;
  border-radius: 4px;
  margin-top: 2px;
}
.hamburger-container {
  float: left;
  padding: 0 20px;
  padding-top: 20px;
}
.hamburger {
	display: inline-block;
	cursor: pointer;
	width: 20px;
	height: 20px;
	transform: rotate(0deg);
	transition: .38s;
	transform-origin: 50% 50%;
}
.hamburger.is-active {
	transform: rotate(90deg);
}
</style>
