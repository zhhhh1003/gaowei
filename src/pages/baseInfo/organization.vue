<template>
<el-row style='height: 89vh;background: white;margin-top: 10px;padding-top: 10px;padding-left: 10px;'>
  <el-col :span='8' style='padding-right: 5px;'>	

	<el-tree
	  class="filter-tree"
	  lazy
	  :props="defaultProps"
	  :load="loadNode"
	  :filter-node-method="filterNode"
	  @node-expand="handleNodeClick"
	  :render-content="renderContent"
	  ref="tree">
	</el-tree>	
  </el-col>
  <el-col :span='16'>
  	<el-table :data="tableList" highlight-current-row v-loading="listLoading" style='width: 100%;border-left: 1px solid #ddd;'>
		<el-table-column prop="cfulldepname" label="组织全称" min-width="300" align='center'>
		</el-table-column>
		<el-table-column prop="cdepname" label="组织名称" min-width="200" align='center'>
		</el-table-column>
		<el-table-column label="操作" width="150" align='center' >
			<template slot-scope="scope">
				<el-button size="mini" type="warning" @click="editRow(scope.row)">修改</el-button>
			</template>
		</el-table-column>
	</el-table>
  </el-col>
  
  <!--新增界面-->
  <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
		<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
			<el-form-item label="组织名称" prop="cdepname">
				<el-input v-model="addForm.cdepname" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="组织全称" prop="cfulldepname">
				<el-input v-model="addForm.cfulldepname" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="组织编码" prop="cdepcode">
				<el-input v-model="addForm.cdepcode" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item prop="role">
				<el-select v-model="addForm.DepType" clearable placeholder="请选择角色">
					<el-option
						v-for='opts in typeList'
						:key="opts.value"
						:label="opts.label"
						:value="opts.value">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
		</div>
  </el-dialog>	

  <el-dialog title="修改" :visible.sync="editFormVisible" :close-on-click-modal="false">
		<el-form :model="addForm" label-width="80px" :rules="editFormRules" ref="addForm">
			<el-form-item label="组织名称" prop="cdepname">
				<el-input v-model="editForm.cdepname" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="组织全称" prop="cfulldepname">
				<el-input v-model="editForm.cfulldepname" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item prop="role">
				<el-select v-model="editForm.DepType" clearable placeholder="请选择角色">
					<el-option
						v-for='opts in typeList'
						:key="opts.value"
						:label="opts.label"
						:value="opts.value">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
		</div>
  </el-dialog>
</el-row>
</template>

<script>
	import TreeRender from '@/component/tree_render'
	import { getDepList, createDep, delDep, getDepType, editDep } from '../../api/api';

	export default {
		watch: {
	      filterText(val) {
	        this.$refs.tree.filter(val);
	      }
	    },
	    methods: {
	      handleNodeClick (data, node) {
	      		console.log(node)
		      	window.localStorage.setItem('treeObj', JSON.stringify({upCode: node.data.upId, id: node.data.id, level: node.level - 1}))
	  			this.triggerCurrenNode = node
	  			this.triggerCurrenNodeData = data
		      	this.tableList = []
		      	node.childNodes.map(e => {
		      		this.tableList.push(e.data)
		      	})
	      },	
	      handleCurrentChange(val) {
			this.para.pager.page = val;
		  },
		  handleDel(ID) {
				this.listLoading = true;
				let para = { ids: ID };
				delDep(para).then((res) => {
				  if (res.data.type == 1) {	
					this.listLoading = false;
					this.$notify({
						title: '成功',
						message: '删除成功',
						type: 'success'
					});
					this.triggerCurrenNode.visible = false
					this.tableList = this.tableList.filter(item => {
						return item.ID != ID
					})
				  }else {
				  	this.$notify({
						title: '失败',
						message: '删除失败，刷新界面试一下吧',
						type: 'error'
					});
				  }	
				});
		  },
	      filterNode(value, data) {
		        if (!value) return true;
		        return data.name.indexOf(value) !== -1;
	      },
	      renderContent(h,{node,data,store}){//加载节点
		        let that = this;
		        return h(TreeRender,{
		          props: {
		            DATA: data,
		            NODE: node,
		            STORE: store
		          },
		          on: {
		            nodeAdd: ((s,d,n) => {
		            	that.addFormVisible = true
		            	that.handleAdd(s,d,n)
		            }),
		            nodeEdit: ((s,d,n) => {
		            	this.editFormVisible = true
		            	that.handleEdit(s,d,n)
		            }),
		            nodeDel: ((s,d,n) => that.handleDelete(s,d,n))
		          }
		        });
	      },
	      handleAdd(s,d,n){//增加节点
		      	window.localStorage.setItem('treeObj', JSON.stringify({upCode: d.upId, id: d.id,level: n.level -1}))
		        this.para.queryStr.cupdepcode = d.id
		        this.triggerCurrenNodeData = d
	  			this.triggerCurrenNode = n
		        this.fillTree((res) => {
		        	d.children = res
		        })
		        if(!n.expanded){
		          n.expanded = true;
		        }
	      },
	      handleDelete(s,d,n){//删除节点
		        let that = this;
		        window.localStorage.setItem('treeObj', JSON.stringify({upCode: d.upId, id: d.id,level: n.level -1}))
		        this.para.queryStr.cupdepcode = d.id
		        this.triggerCurrenNodeData = d
	  			this.triggerCurrenNode = n
		        this.fillTree((res) => {
		        	d.children = res
			        if(d.children && d.children.length !== 0){
			          this.$message.error("此节点有子级，不可删除！")
			          return false;
			        }else{
			            that.$confirm("是否删除此节点？","提示",{
			              confirmButtonText: "确认",
			              cancelButtonText: "取消",
			              type: "warning"
			            }).then(() => {
			              that.handleDel(d.ID)
			            }).catch(() => {
			              return false;
			            })
			        }
		        })
		        if(!n.expanded){
		          n.expanded = true;
		        }
	      },
	      loadNode (node, resolve) {
		      	if (node.level === 0) {
		          return resolve([{ name: '中国石化集团公司', id: 0,upId: 0 }]);
		        }else if (node.level === 1) {	
		        	this.listLoading = true
		        	this.para.queryStr.DepLevel = 0
		          	this.fillTree((val) => {
		          		 resolve(val);
		          	});
		        }else {
		        	this.listLoading = true
		        	this.para.queryStr.cupdepcode = node.data.id
		        	this.fillTree((val) => {
		          		 resolve(val);
		          	});
		        }
	      },
	      editRow (val) {
	      	let editNode = this.triggerCurrenNode.childNodes.filter(e => {
	      		return e.data.ID == val.ID
	      	})
	   			console.log(editNode)
	      	this.editForm.ID = editNode[0].data.ID
	      	this.editForm.cdepname = editNode[0].data.cdepname
	      	this.editForm.cfulldepname = editNode[0].data.cfulldepname
	      	this.editForm.DepType = val.DepType
	      	this.editForm.cupdepcode = editNode[0].data.upId
	      	this.editForm.cdepcode = editNode[0].data.id
					this.editFormVisible = true
	      },
	      editSubmit () {
	      	editDep({strMain: this.editForm}).then(res => {
	      		if (res.data.type == 1) {
					this.$notify({
						title: '成功',
						message: '修改成功',
						type: 'success'
					});
					this.triggerCurrenNode.childNodes.map(e => {
			      		if (e.data.ID == this.editForm.ID) {
			      			e.data.name = this.editForm.cdepname
			      			e.data.cdepname = this.editForm.cdepname
					      	e.data.cfulldepname = this.editForm.cfulldepname
					      	e.data.DepType = this.editForm.DepType
					      	e.data.id = this.editForm.cdepcode	
			      		}
	      			})
	      			this.tableList.map(e => {
			      		if (e.ID == this.editForm.ID) {
			      			e.cdepname = this.editForm.cdepname
					      	e.cfulldepname = this.editForm.cfulldepname
			      		}
	      			})
				}else {
					this.$notify({
						title: '失败',
						message: '修改失败，刷新界面试一下吧',
						type: 'error'
					});
				}		
	      	})
	      	this.editFormVisible = false
	      },
	      addSubmit () {
	      	this.addForm.DepLevel = JSON.parse(window.localStorage.getItem('treeObj')).level
	      	this.addForm.cupdepcode = JSON.parse(window.localStorage.getItem('treeObj')).id
	      	createDep({strMain: this.addForm}).then(res => {
					if (res.data.type == 1) {
						this.$notify({
							title: '成功',
							message: '提交成功',
							type: 'success'
						});
						this.triggerCurrenNodeData.children.push({
							name: this.addForm.cdepname,
							id: this.addForm.cdepcode,
							cdepname: this.addForm.cdepname,
							cfulldepname: this.addForm.cfulldepname,
							DepType: this.addForm.DepType,
							upId: this.triggerCurrenNodeData.cdepcode
						})
						this.tableList.push({
							cdepname: this.addForm.cdepname,
							cfulldepname: this.addForm.cfulldepname,
						})
						this.$refs['addForm'].resetFields();
						this.addFormVisible = false;
					}else {
						this.$notify({
							title: '失败',
							message: '提交失败，刷新界面试一下吧',
							type: 'error'
						});
						this.addFormVisible = false;
					}
	      	})
	      },
	      fillTree (cb) {
	      		getDepList(this.para).then(res => {
	          	this.para.queryStr.DepLevel = ''
		        const data = []
		        this.tableList = res.data.rows
		        this.listLoading = false
		        res.data.rows.map( e => {
		        	if (e.HaveLower == 1) {
		        		data.push({
			        		ID: e.ID,
			        		name: e.cdepname,
			        		id: e.cdepcode,
			        		upId: e.cupdepcode,
			        		cfulldepname: e.cfulldepname,
			        		cdepname: e.cdepname,
			        		cDepartmentTypeName: e.cDepartmentTypeName,
			        		children: []
			        	})
		        	}else {
		        		data.push({
			        		ID: e.ID,
			        		name: e.cdepname,
			        		id: e.cdepcode,
			        		upId: e.cupdepcode,
			        		cfulldepname: e.cfulldepname,
			        		cdepname: e.cdepname,
			        		cDepartmentTypeName: e.cDepartmentTypeName,
			        		children: [],
			        		leaf: true
			        	})
		        	}
		        })
		        cb(data)
	        })
	      },
	      fillTable () {
	      	this.tableList = this.list.slice(this.page, this.page + 10)
	      }
	    },
	    mounted () {
	       window.localStorage.setItem('treeObj', '{"upCode":0,"id":0,"level":1}')
	       getDepType(this.typePara).then(res => {
	       	  res.data.rows.map(e => {
	       	  	this.typeList.push({
	       	  		label: e.cDepartmentTypeName,
	       	  		value: e.cDepartmentTypeCode
	       	  	})
	       	  })
	       })
	    },
	    data() {
	      return {
	      	isLeaf: false,
	      	tableList: [],
	      	typeList: [],
	      	triggerCurrenNodeData: {},
	      	triggerCurrenNode: {},
	      	listLoading: false,
	      	para: {
				pager: { rows: 9999, page: 1, sort: '', order: 'DESC', totalRows: 0, totalPages: 0 },
				queryStr: { cdepname: '', cdepcode: '', cupdepcode: '', DepLevel: '' },
			},
			typePara: {
				pager: { rows: 9999, page: 1, sort: '', order: 'DESC', totalRows: 0, totalPages: 0 },
				queryStr: { cDepartmentTypeCode: '', cDepartmentTypeName: '' },
			},
	        filterText: '',
	        defaultProps: {
	          children: 'children',
	          label: 'name',
	          isLeaf: 'leaf'
	        },
			page: 1,
			addFormVisible: false,
			addLoading: false,
			addFormRules: {
				cdepname: [
					{ required: true, message: '请输入组织名称', trigger: 'blur' }
				],
				cdepcode: [
					{ required: true, message: '请输入组织编码', trigger: 'blur' }
				],
				DepType: [
					{ required: true, message: '选择角色', trigger: 'blur' }
				],
				cfulldepname: [
					{ required: true, message: '请输入组织全称', trigger: 'blur' }
				]
			},
			addForm: {
				cdepname: '',
				cfulldepname: '',
				cdepcode: '',
				DepType: '',
				cupdepcode: '',
				IsDelete: 0,
				DepLevel: ''
			},
			editFormVisible: false,
			editLoading: false,
			editFormRules: {
				cdepname: [
					{ required: true, message: '请输入组织名称', trigger: 'blur' }
				],
				cdepcode: [
					{ required: true, message: '请输入组织编码', trigger: 'blur' }
				],
				DepType: [
					{ required: true, message: '选择角色', trigger: 'blur' }
				],
				cfulldepname: [
					{ required: true, message: '请输入组织全称', trigger: 'blur' }
				]
			},
			editForm: {	
				cdepname: '',
				cfulldepname: '',
				cdepcode: '',
				DepType: '',
				cupdepcode: '',
				IsDelete: 0,
			},
	      };
	    }
	}
</script>
