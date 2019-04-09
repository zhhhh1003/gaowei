<template>
		<section>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-form :inline="true">
						<el-form-item>
							<el-input size="small" v-model="para.queryStr" placeholder="角色名称"></el-input>
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
				<el-table :data="roleList" highlight-current-row v-loading="listLoading" style="width: 100%;" border>
					<el-table-column prop="id" label="序号" width="65" v-if='false'>
					</el-table-column>
					<el-table-column prop="RoleName" label="角色名称" width="110" align='center'>
					</el-table-column>
					<el-table-column label="状态" width="90" align='center'>
						<template slot-scope="scope">
							<span>{{scope.row.state == 1? '启用': '禁用'}}</span>
						</template>
					</el-table-column>
		      <el-table-column label="备注" min-width="130" align='center'>
						<template slot-scope="scope">
		          <el-input v-show="scope.row.edit" v-model="scope.row.Remark"></el-input>
		          <span v-show="!scope.row.edit">{{ scope.row.Remark }}</span>
		        </template>
					</el-table-column>
					<el-table-column label="操作" width="300" align='center'>
						<template slot-scope="scope">
							<el-switch
							  v-model="scope.row.state"
								style='margin-right: 10px;'
								active-value="1"
            					inactive-value="0"
								@change = 'editRow(scope.row, "switch")'
							  active-color="#13ce66"
							  active-text="启用"
							  inactive-text="禁用">
							</el-switch>
							<el-button :type="scope.row.edit?'success':'warning'" @click='editRow(scope.row, "btn")' size="small" icon="edit"><i class='el-icon-edit'></i>&nbsp{{scope.row.edit?'完成':'编辑'}}</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar" style='padding: 5px;'>
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;margin-top: 5px;">
					</el-pagination>
				</el-col>

				<!--新增界面-->
				<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
					<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
						<el-row>
							<el-col :span='12'>
								<el-form-item label="角色姓名" prop="RoleName">
									<el-input v-model="addForm.RoleName" auto-complete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item prop="role">
									<el-select v-model="addForm.state" clearable placeholder="请选择角色状态">
										<el-option
											v-for='opts in addOpations'
											:key="opts.value"
								      :label="opts.label"
								      :value="opts.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span='24'>
							<el-form-item label="备注">
								<el-input type="textarea" v-model='addForm.Remark'></el-input>
							</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click.native="addFormVisible = false">取消</el-button>
						<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
					</div>
				</el-dialog>
				<div style='clear: both'></div>
		</section>
</template>

<script>
	import { getRoleListPage, createRole, editRole, delRole } from '../../api/api';
	//<el-form-item>
		//<el-button size='small' type='primary' @click='handleDownload' :loading='downloadLoading'><i 
		//class='el-icon-download'></i>&nbsp导出excel</el-button>
	//</el-form-item>
	export default {
		data() {
			return {
				para: {
					pager: { rows: 10, page: 1, sort: 'ddate', order: 'DESC', totalRows: 0, totalPages: 0 },
					queryStr: '',
				},
				roleList: [],
				total: 0,
				page: 1,
				listLoading: false,
				downloadLoading: false,
				editLoading: false,
				//编辑界面数据
				editForm: { },
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					RoleName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
						RoleName: '',
						state: ''
					},
				addOpations: [{
					value: '1',
					label: '启用'
				}, {
					value: '0',
					label: '停用'
				}],
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.para.pager.page = val;
				this.getRoles();
			},
			//获取商品列表
			getRoles() {
				this.listLoading = true;
				getRoleListPage(this.para).then((res) => {
					this.total = res.data.total
					let _list = res.data.rows;
					this.roleList = _list.map(v => {
		          	this.$set(v, 'edit', false)
		          	return v
        			});
					this.listLoading = false;
				});
			},
			//删除
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: row.ID };
					delRole(para).then((res) => {
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
			//显示新增界面
			handleAdd () {
				this.addFormVisible = true;
			},
			editRow (val, type) {
				this.editForm = Object.assign({}, val);
				let para = Object.assign({}, this.editForm);
				this.editLoading = true;
				if (type === 'switch') {
					editRole({strMain: para}).then( (res) => {
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
				} else if (type === 'btn') {
					val.edit=!val.edit
					if (!val.edit) {
						editRole({strMain: para}).then( (res) => {
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
				}
			},
			//新增
			addSubmit () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							createRole({strMain: para}).then((res) => {
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
			handleDownload () {
				this.downloadLoading = true;
				require.ensure([], () => {
					const { export_json_to_excel } = require('../../vendor/Export2Excel')
					const tHeader = ['序号', '角色名称', '状态', '备注']
					const filterVal = ['id', 'sale', 'state', 'activity']
					const list = this.goods
					const data = this.formatJson(filterVal, list);
					export_json_to_excel(tHeader, data, '列表excel')
					this.downloadLoading = false
				})
			},
			formatJson(filterVal, jsonData) {
					jsonData.map(v => {
						if (v.state == 1) {
							v.state = '启用'
						}else {
							v.state = '禁用'
						}
					})
　　　　　　	return jsonData.map(v => filterVal.map(j => v[j]))
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
