<template>
<div>
  <template v-for="(item, index) in nodes">
    <a href='javascript:;'><el-submenu :index='item.name' v-if="item.leaf">
      <template slot="title">
        <i :class="item.iconCls"></i><span>{{item.name}}</span>
      </template>
      <menu-tree :nodes='item.children'></menu-tree>
    </el-submenu></a>
    <el-menu-item :index="item.name" v-if="!item.leaf" :route="{name:item.name}">
      <i :class="item.iconCls"></i><span>{{item.name}}</span>
    </el-menu-item>
  </template>
</div>
</template>
<script>
export default {
  name: "menuTree",
  props: ["nodes"]
};
</script>
<style scoped>
.userInfo {
  vertical-align: middle;
  margin-right: 15px;
  width: 18px;
  text-align: center;
  background: url("../../static/userInfo.png") no-repeat center center;
  display: inline-block;
  height: 18px;
  background-size: contain;
}
.servm {
  vertical-align: middle;
  margin-right: 15px;
  width: 18px;
  text-align: center;
  background: url("../../static/servm.png") no-repeat center center;
  display: inline-block;
  height: 18px;
  background-size: contain;
}
.sys {
  vertical-align: middle;
  margin-right: 15px;
  width: 18px;
  text-align: center;
  background: url("../../static/sys.png") no-repeat center center;
  display: inline-block;
  height: 18px;
  background-size: contain;
}
</style>
