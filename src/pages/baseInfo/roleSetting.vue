<template>
<el-row style='background: white;padding: 10px'>
  <el-col :span='4'>		
	<el-select filterable placeholder="请选择角色" v-model="addItem.RoleID" @change='getRolePage'>
	    <el-option
	      v-for='opts in tplOpations'
	      :key="opts.value"
	      :label="opts.label"
	      :value="opts.value">
	     </el-option>
	</el-select>
  </el-col>	
  <el-col :span='20'>
	<el-tree
	  :data="data2"
	  show-checkbox
	  node-key="id"
	  :default-expanded-keys="['0', '1', '2']"
	  :props="defaultProps"
	  ref="tree">
	</el-tree>
  </el-col>	
  <el-button type="primary" @click="submit">提交</el-button>
</el-row>	
</template>

<script>
	import { getRootList, editRoot, getRoleListPage, addRoot } from '../../api/api';

	export default {
		 data() {
	      return {
	      	rolePara: {
				pager: { rows: 9999, page: 1, sort: 'ddate', order: 'DESC', totalRows: 0, totalPages: 0 },
				queryStr: '',
			},
			roleId: '',
	        data2: [{
	          id: 0,
	          label: '基本信息',
	          parent_id: '',
	          route: 'baseInfo',
	          childrenRoute: 'baseInfo',
	          children: [
	          	{ id: '0-0',label: '内部用户信息', parent_id: '0', route: 'userInfo' },
	          	{ id: '0-4',label: '内部组织机构', parent_id: '0', route: 'organization' },
	          	{ id: '0-2',label: '外部用户信息', parent_id: '0', route: 'outSideUser'},
	          	{ id: '0-5',label: '施工单位档案', parent_id: '0', route: 'companyArchives' },
	          	{ id: '0-1',label: '角色信息', parent_id: '0', route: 'roleInfo' },
	          	{ id: '0-3',label: '角色权限设置', parent_id: '0', route: 'roleSetting' },
	          	{ id: '0-6',label: 'JSA分析模板', parent_id: '0', route: 'createWbs' }
	          ]
	        }, {
	          id: 1,
	          label: '业务管理',
	          parent_id: '',
	          route: 'service',
	          childrenRoute: 'service',
	          children: [
	          	{ id: '1-0', label: '检修施工任务', parent_id: '1', route: 'task' }, 
	          	{ id: '1-1', label: '现场高危作业计划', parent_id: '1', route: 'servicePlan', childrenRoute: 'service/servicePlan', children: [
			          	{ id: '1-1-0', label: '直接方', parent_id: '1-1', route: 'zj_service', childrenRoute: 'service/servicePlan/zj_service', fakeChildren: [
			          		{ id: '1-1-0-1', label: '直接方作业计划', parent_id: '1-1-0', route: 'zj_service_base' },
			          		{ id: '1-1-0-2', label: '直接方任务计划列表', parent_id: '1-1-0', route: 'zj_service_list' },
			          		{ id: '1-1-0-3', label: '直接作业方详情', parent_id: '1-1-0', route: 'zj_service_info' },
			          	]}, 
			            { id: '1-1-1', label: '属地管理方', parent_id: '1-1', route: 'sd_service', childrenRoute: 'service/servicePlan/sd_service', fakeChildren: [
			          		{ id: '1-1-1-1', label: '属地管理方计划', parent_id: '1-1-1', route: 'sd_service_base' },
			          		{ id: '1-1-1-2', label: '属地管理方任务计划列表', parent_id: '1-1-1', route: 'sd_service_list' },
			          		{ id: '1-1-1-3', label: '属地管理方详情', parent_id: '1-1-1', route: 'sd_service_info' },
			          	] },
			            { id: '1-1-2', label: '业务管理方', parent_id: '1-1', route: 'yw_service', childrenRoute: 'service/servicePlan/yw_service', fakeChildren: [
			          		{ id: '1-1-2-1', label: '业务管理方计划', parent_id: '1-1-2', route: 'yw_service_base' },
			          		{ id: '1-1-2-2', label: '业务管理方任务计划列表', parent_id: '1-1-2', route: 'yw_service_list' },
			          		{ id: '1-1-2-3', label: '业务管理方详情', parent_id: '1-1-2', route: 'yw_service_info' },
			          	]  },
			            { id: '1-1-3', label: 'HSE管理方', parent_id: '1-1', route: 'HSE_service', childrenRoute: 'service/servicePlan/HSE_service', fakeChildren: [
			          		{ id: '1-1-3-1', label: 'HSE管理方计划', parent_id: '1-1-3', route: 'HSE_service_base' },
			          		{ id: '1-1-3-2', label: 'HSE管理方任务计划列表', parent_id: '1-1-3', route: 'HSE_service_list' },
			          		{ id: '1-1-3-3', label: 'HSE管理方详情', parent_id: '1-1-3', route: 'HSE_service_info' },
			          	]  }
	          		] 
	          	},
	          	{ id: '1-2', label: '现场高危作业管控确认', parent_id: '1', route: 'serviceConfirm', childrenRoute: 'service/serviceConfirm',children: [
			          	{ id: '1-2-0', label: '直接作业方确认', parent_id: '1-2', route: 'zj_confirm', childrenRoute: 'service/serviceConfirm/zj_confirm', fakeChildren: [
			          		{ id: '1-2-0-1', label: '直接作业方确认', parent_id: '1-2-0', route: 'zj_confirm_base' },
			          		{ id: '1-2-0-2', label: '直接作业方确认详情', parent_id: '1-2-0', route: 'zj_confirm_info' },
			          	] }, 
			            { id: '1-2-1', label: '属地作业方确认', parent_id: '1-2', route: 'sd_confirm', childrenRoute: 'service/serviceConfirm/sd_confirm', fakeChildren: [
			          		{ id: '1-2-1-1', label: '属地作业方确认', parent_id: '1-2-1', route: 'sd_confirm_base' },
			          		{ id: '1-2-1-2', label: '属地作业方确认详情', parent_id: '1-2-1', route: 'sd_confirm_info' },
			          	]  },
			            { id: '1-2-2', label: '业务作业方确认', parent_id: '1-2', route: 'yw_confirm', childrenRoute: 'service/serviceConfirm/yw_confirm', fakeChildren: [
			          		{ id: '1-2-2-1', label: '业务作业方确认', parent_id: '1-2-2', route: 'yw_confirm_base' },
			          		{ id: '1-2-2-2', label: '业务作业方确认详情', parent_id: '1-2-2', route: 'yw_confirm_info' },
			          	]  }
	          		] 
	          	}
	          ]
	        }, {
	          id: 2,
	          label: '系统分析',
	          parent_id: '',
	          route: 'sta',
	          childrenRoute: 'sta',
	          children: [{
	            id: '2-0',
	            label: '现场高危作业计划一览表',
	            parent_id: '2',
	            route: 'proStateList'
	          }, {
	            id: '2-1',
	            label: '现场高危作业管控确认一览表',
	            parent_id: '2',
	            route: 'ctrlTable' 
	          }, {
	            id: '2-2',
	            label: '现场高危作业区域',
	            parent_id: '2',
	            route: 'map'
	          }]
	        }],
	        defaultProps: {
	          children: 'children',
	          label: 'label'
	        },
	        tplOpations: [],
	        ModuleStr: {
	        	selcect: [],
	        	halfSelect: []
	        },
	        addItem: {
	        	ID: '',
	        	RoleID: '',
	        	ModuleID: '',
	        	TypeID: 0,
	        	State: 0
	        },
	        para: {
	          pager: { rows: 9999, page: 1, sort: '', order: 'DESC', totalRows: 0, totalPages: 0 },
	          queryStr: ''
	        },
	      };
	    },
	    methods: {
	    	submit() {
	    		this.para.queryStr = this.addItem.RoleID
	    		this.getCheckedNodes(() => {
	    			getRootList(this.para).then(res => {
		    		  this.addItem.ModuleID = JSON.stringify(this.ModuleStr)	
	                  if (res.data.rows.length == 0) {
	                  	let newPara = this.addItem
	                  	delete newPara.ID
			    		addRoot(newPara).then(res => {
			    			if (res.data.type == 1) {
			    				this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success'
								});
			    			}else {
			    				this.$notify({
									title: '失败',
									message: '操作失败，请刷新页面',
									type: 'error'
								});
			    			}
			    		})
	                  }else {
	                  	this.addItem.ID = res.data.rows[0].ID
	                  	editRoot(this.addItem).then(res => {
			    			if (res.data.type == 1) {
			    				this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success'
								});
			    			}else {
			    				this.$notify({
									title: '失败',
									message: '删除失败，请刷新页面',
									type: 'error'
								});
			    			}
			    		})
	                  }
                	})
	    		})	
	    	},
	    	getCheckedNodes(cb) {
		        let allCheckedLabel = this.$refs.tree.getCheckedNodes().map(e => {
		        	if (e.fakeChildren) {
		        		return {
			        		id: e.id,
			        		name: e.label,
			        		parent_id: e.parent_id,
			        		route: e.route,
			        		childrenRoute: e.childrenRoute,
			        		fakeChildren: e.fakeChildren
			        	}
		        	}else {
		        		return {
			        		id: e.id,
			        		name: e.label,
			        		parent_id: e.parent_id,
			        		route: e.route,
			        		childrenRoute: e.childrenRoute
			        	}
		        	}
		        });
		        let allHalfCheckedLabel = this.$refs.tree.getHalfCheckedNodes().map(e => {
		        	return {
		        		id: e.id,
		        		name: e.label,
		        		parent_id: e.parent_id,
		        		route: e.route,
		        		childrenRoute: e.childrenRoute
		        	}
		        })
		        this.ModuleStr.selcect = allCheckedLabel
		        this.ModuleStr.halfSelect = allHalfCheckedLabel
		        cb()
		    },

		    getRolePage (val) {
		    	this.para.queryStr = val
		    	getRootList(this.para).then(res => {
		    		let nodeArr = JSON.parse(res.data.rows[0].ModuleID)
		    		let treeNodeArr = nodeArr.selcect.map(e => {
		    			return e.id
		    		})
		    		this.$refs.tree.setCheckedKeys(treeNodeArr);
		    	})
		    }
	    },
	    mounted () {
	    	getRoleListPage(this.rolePara).then(res => {
				res.data.rows.map( e => {
					if (e.state == 1) {
						this.tplOpations.push({
							value: e.ID,
							label: e.RoleName
						})					
					}
					
				})
			})
	    }
	}
</script>
