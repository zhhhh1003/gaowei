<template>
		<section>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-form :inline="true">
						<el-form-item>
							<el-input size="small" v-model="para.queryStr" placeholder="作业名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button size="small" type="primary" plain v-on:click="getRoles"><i class='el-icon-search'></i>&nbsp查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button size="small" type="primary" @click="handleAdd"><i class='el-icon-plus'></i>&nbsp新增</el-button>
						</el-form-item>
					</el-form>
				</el-col>

				<!--列表-->
				<el-table :data="roleList" highlight-current-row v-loading="listLoading" style="width: 100%;" height="420" border>
		      		<el-table-column label="作业名称" min-width="130" align='center'>
						<template slot-scope="scope">
			          		<el-input v-show="scope.row.edit" v-model="scope.row.RecordName"></el-input>
			          		<span v-show="!scope.row.edit">{{ scope.row.RecordName }}</span>
		        		</template>
					</el-table-column>
					<el-table-column label="操作" width="300" align='center'>
						<template slot-scope="scope">
							<el-button :type="scope.row.edit?'success':'warning'" @click='editRow(scope.row)' size="small" icon="edit"><i class='el-icon-edit'></i>&nbsp{{scope.row.edit?'完成':'修改名称'}}</el-button>
							<el-button @click.native="editContent(scope.row)" type='primary' size="small">编辑内容</el-button>
							<el-button @click.native="handleDel(scope.row)" size="small" plain>删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar" style='padding: 5px;'>
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;margin-top: 5px;">
					</el-pagination>
				</el-col>

				<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
					<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
						<el-form-item label="作业名称" prop="RecordName">
							<el-input v-model="addForm.RecordName" auto-complete="off"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click.native="addFormVisible = false">取消</el-button>
						<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
					</div>
				</el-dialog>

				<el-dialog title="作业内容" :visible.sync="addConVisible" :close-on-click-modal="false" :fullscreen='true' v-loading="listLoading" element-loading-text="保存数据中...">
					<el-button @click.native="addFormVisible = false" type="primary" size='small' style='margin-bottom: 10px' @click='insertRow'>增行</el-button>
					<el-button @click.native="delRow" size='small' type='warning'>删除</el-button>
					<el-table :data="contentList" height="400" border style="width: 100%" @selection-change="selsChange">
						<el-table-column type="selection" width="55" align='center'>
    					</el-table-column>
					    <el-table-column label="作业内容" width="250" align='center'>
					    	<template slot-scope="scope">
						      <el-input v-model="scope.row.bContent"></el-input>
						    </template>
					    </el-table-column>
					    <el-table-column label="主要危害因素(通用)" width="250" align='center'>
					    	<template slot-scope="scope">
						      <el-input v-model="scope.row.CurrentHarm"></el-input>
						    </template>
					    </el-table-column>
					    <el-table-column label="主要危害因素(专项)" width="300" align='center'>
					    	<template slot-scope="scope">
						      <el-input v-model="scope.row.SpecialHarm"></el-input>
						    </template>
					    </el-table-column>
					    <el-table-column label="主要风险控制措施(通用)" width="300" align='center'>
					    	<template slot-scope="scope">
						      <el-input v-model="scope.row.CurrentRisk"></el-input>
						    </template>
					    </el-table-column>
					    <el-table-column label="主要风险控制措施(专项)" min-width="300" align='center'>
					    	<template slot-scope="scope">
						      <el-input v-model="scope.row.SpecialRisk"></el-input>
						    </template>
					    </el-table-column>
					</el-table>
					<div slot="footer" class="dialog-footer">
						<el-button @click.native="addConVisible = false" size='small'>取消</el-button>
						<el-button type="primary" @click.native="addContent" :loading="addLoading" size='small'>提交</el-button>
					</div>
				</el-dialog>
		</section>
</template>

<script>
	import { getTemplate, createTemplate, editTemplate, delTemplate, getTplCon, createTplCon } from '../../api/api';
	export default {
		data() {
			return {
				para: {
					pager: { rows: 10, page: 1, sort: 'CreatTime', order: 'DESC', totalRows: 0, totalPages: 0 },
					queryStr: '',
				},
				para_con: {
					pager: { rows: 999, page: 1, sort: 'Sort', order: 'ASC', totalRows: 0, totalPages: 0 },
					strQuery: '',
				},
				roleList: [],
				contentList: [],
				total: 0,
				page: 1,
				listLoading: false,
				editForm: {
					Id: '',
					RecordName: ''
				},
				addFormVisible: false,
				addConVisible: false,
				addLoading: false,
				addFormRules: {
					RecordName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					RecordName: ''
				},
				sels: [],
				createTplCon_para: {
					Plan: null,
					RecordID: ''
				}
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.para.pager.page = val;
				this.getRoles();
			},
			selsChange: function (sels) {
	          this.sels = sels;
	        },
			getRoles() {
				this.listLoading = true;
				getTemplate(this.para).then((res) => {
					this.total = res.data.total
					let _list = res.data.rows;
					this.roleList = _list.map(v => {
			          	this.$set(v, 'edit', false)
			          	return v
        			});
					this.listLoading = false;
				});
			},
			handleDel(row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { Id: row.ID };
					delTemplate(para).then((res) => {
						this.listLoading = false;
						this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success'
						});
						this.getRoles();
					});
				}).catch(() => {

				});
			},
			handleAdd () {
				this.addFormVisible = true;
			},
			editRow (val) {
				this.editForm.Id = val.ID
				this.editForm.RecordName = val.RecordName
				this.editLoading = true;
				val.edit=!val.edit
				if (!val.edit) {
					editTemplate(this.editForm).then( (res) => {
						this.editLoading = false;
						if (res.data.type == 1) {
							this.$notify({
								title: '成功',
								message: '修改成功',
								type: 'success'
							});
							this.getRoles();
						}else {
							this.$notify({
								title: '失败',
								message: '修改失败，刷新界面试一下吧',
								type: 'error'
							});
						}
					})
				}
			},
			addSubmit () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							createTemplate({RecordName: para.RecordName}).then((res) => {
								this.addLoading = false;
								if (res.data.type == 1) {
									this.$notify({
										title: '成功',
										message: '新增成功',
										type: 'success'
									});
									this.getRoles();
								}else {
									this.$notify({
										title: '失败',
										message: '新增失败，刷新界面试一下吧',
										type: 'error'
									});
								}
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								});
						});
					}
				});
			},
			editContent (val) {
				this.listLoading = true 
				this.para_con.strQuery = val.ID
				this.contentList = []
				getTplCon(this.para_con).then(res => { 
				  if (res.data.rows.length !== 0) {
				  	this.contentList = res.data.rows 
				  }else {
				  	this.contentList.push({bContent: '', RecordID: this.para_con.strQuery, CurrentHarm: '',SpecialHarm: '',CurrentRisk: '', SpecialRisk: ''})
				  }
	              this.addConVisible = true
	              this.listLoading = false 
	            })
			},
			addContent () {
				this.listLoading = true 
				this.contentList = this.contentList.filter(e => {
					return e.CurrentHarm || e.bContent || e.SpecialHarm || e.CurrentRisk || e.SpecialRisk
				})
				this.createTplCon_para.Plan = this.contentList
				if (this.contentList.length === 0) {
					this.createTplCon_para.RecordID = this.para_con.strQuery
				}else {
					this.createTplCon_para.RecordID = ''
				}
				createTplCon(this.createTplCon_para).then(res => {
					this.addConVisible = false
					this.listLoading = false
				})
			},
			insertRow () {
				this.contentList.push({
					bContent: '',
					RecordID: this.para_con.strQuery, 
					CurrentHarm: '',
					SpecialHarm: '',
					CurrentRisk: '', 
					SpecialRisk: ''
				})
			},
			delRow () {
				this.contentList = this.contentList.filter(e => {
					let isDel = this.sels.some(i => {
						return i.bContent === e.bContent
					})
					return !isDel
				})
			}
		},
		watch: {
			'para.queryStr': function (val) {
				if (val === '') {
					this.getRoles();
				}
			}
		},
		mounted() {
			this.getRoles();
		}
	}
</script>
