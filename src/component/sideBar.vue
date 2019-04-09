<template>
		<el-menu :default-active="activeRoute" text-color="#aeb9c2" router :collapse="isCollapse" @open="handleopen" :default-openeds=this.openSub unique-opened>
			<menu-tree :nodes='navs'></menu-tree>
		</el-menu>
</template>

<script>
	import menuTree from '@/component/MenuTree'
	export default {
		data() {
			return {
				navs: [],
				openSub: ''
			}
		},
		components: {
			menuTree
		},
		methods: {
			handleopen (index) {
				switch (index) {
					case '直接方':
						this.$router.push({ name: '直接方作业计划' })
						break
					case '属地管理方':
						this.$router.push({ name: '属地管理方计划' })
						break
					case '业务管理方':
						this.$router.push({ name: '业务管理方计划' })
						break
					case 'HSE管理方':
						this.$router.push({ name: 'HSE管理方计划' })
						break
					case '直接作业方确认':
						this.$router.push({ name: '直接作业方确认' })
						break
					case '属地作业方确认':
						this.$router.push({ name: '属地作业方确认' })
						break
					case '业务作业方确认':
						this.$router.push({ name: '业务作业方确认' })
						break
				}
			}
		},
		computed: {
			isCollapse () {
				return this.$store.state.sideBarOpen
			},
			activeRoute () {
				return this.$route.name
			}
		},
		mounted() {
			this.navs = this.$parent.menuData
			this.openSub = this.$route.matched.map ( v => v.name)		
		}
	}
</script>
<style>
  .app-wrapper .sidebar-container {
    background: #333744;
    border: none;
  }
  .el-submenu ul {
  	background: #42485b;
  }
  .el-menu--vertical ul {
  	background: #42485b;
  }
</style>

