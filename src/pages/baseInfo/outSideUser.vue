<template>
		<section>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-form :inline="true">
						<el-form-item>
							<el-input v-model="para.queryStr.UserName" placeholder="用户名称" size="small"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button v-on:click="getUsers" plain type="primary" size="small">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleAdd" size="small">新增</el-button>
						</el-form-item>
					</el-form>
				</el-col>

				<!--列表-->
				<el-table :data="userList" highlight-current-row v-loading="listLoading" style="width:100%;border-radius:4px;" border>
					<el-table-column label="序号" width="65" align='center'>
						<template slot-scope='scope'>
							<span>{{scope.$index + 1}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="UserName" label="用户名" width="150" align='center'>
					</el-table-column>
					<el-table-column prop="CompanyName" label="公司名称" min-width="180" align='center'>
					</el-table-column>
		      		<el-table-column label="状态" width="60" align='center'>
		      			<template slot-scope='scope'>
		      				<span>{{ scope.row.IsDel == 1? '开通': '冻结' }}</span>
		      			</template>
					</el-table-column>
		      		<el-table-column prop="Phone" label="电话" width="200" align='center'>
					</el-table-column>
					<el-table-column label="操作" width="300" align='center'>
						<template slot-scope="scope">
							<el-switch
							  v-model="scope.row.IsDel"
							  style='margin-right: 10px;'
						 	  active-value="1"
            				  inactive-value="0"
							  @change = 'editRow(scope.row)'
							  active-color="#13ce66"
							  active-text="开通"
							  inactive-text="冻结">
							</el-switch>
							<el-button type="warning" size="mini" @click="handleEdit(scope.row)">修改</el-button>
							<el-button type="danger" size="mini" @click="handleDel(scope.row.ID)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar" style='padding: 5px;'>
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;margin-top: 5px;">
					</el-pagination>
				</el-col>

				<!--编辑界面-->
				<el-dialog title="修改用户" :visible.sync="editFormVisible" :close-on-click-modal="true">
					<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" status-icon>
						<el-col :span='12'>
							<el-form-item label="用户名" prop="UserName">
								<el-input v-model="editForm.UserName" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
						<el-form-item label="单位" prop="CompanyId" class='inline_dom' :rules="{
						required: true, message: '不能为空', trigger: 'blur'}">
							<el-select v-model="editForm.CompanyId" placeholder="请选择单位">
								<el-option
									v-for='opts in zjTpl'
									:key="opts.value"
									:label="opts.label"
									:value="opts.value">
								</el-option>
							</el-select>
						</el-form-item>
						</el-col>
						<el-col :span='12'>
						<el-form-item label="电话" prop='Phone' class='inline_dom'>
							<el-input v-model="editForm.Phone"></el-input>
						</el-form-item>
						</el-col>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click.native="editFormVisible = false">取消</el-button>
						<el-button type="primary" @click.native="editSubmit()" :loading="editLoading">提交</el-button>
					</div>
				</el-dialog>

				<!--新增界面-->
				<el-dialog title="新增用户" :visible.sync="addFormVisible" :close-on-click-modal="true">
					<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
						<el-col :span='12'>
							<el-form-item label="用户名" prop="UserName">
								<el-input v-model="addForm.UserName" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label="密码" prop="UsrePass">
								<el-input :type="pwdType" v-model="addForm.UsrePass" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
						<el-form-item label="单位" prop="CompanyId" :rules="{
						required: true, message: '不能为空', trigger: 'blur'}">
							<el-select v-model="addForm.CompanyId" placeholder="请选择单位">
								<el-option
									v-for='opts in zjTpl'
									:key="opts.value"
									:label="opts.label"
									:value="opts.value">
								</el-option>
							</el-select>
						</el-form-item>
						</el-col>
						<el-col :span='12'>
						<el-form-item label="电话" prop="Phone">
							<el-input v-model='addForm.Phone'></el-input>
						</el-form-item>
						</el-col>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click.native="addFormVisible = false">取消</el-button>
						<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
					</div>
				</el-dialog>

				<el-dialog :visible.sync="comVisible" :close-on-click-modal="true">
					<tree-tpl @formCom="formEvent" is-strictly = true check-single = true></tree-tpl>
				</el-dialog>
				<div style='clear: both'></div>
			</section>
</template>

<script>
	import { getSide, createSide, getCompany, editSide, delSide } from '../../api/api'
	import treeTpl from '@/component/treeTpl'

	export default {
		data() {
			return {
				pwdType: 'password',
				para: {
					pager: { rows: 10, page: 1, sort: 'PubDate', order: 'DESC', totalRows: 0, totalPages: 0 },
					queryStr:'',
				},
				comPara: {
					pager: { rows: 9999, page: 1, sort: '', order: 'DESC', totalRows: 0, totalPages: 0 },
					queryStr: { cdepname: '', cdepcode: '', cupdepcode: '', DepLevel: '' },
				},
				zjpara: {
					pager: { rows: 9999, page: 1, sort: 'Pubdate', order: 'DESC', totalRows: 0, totalPages: 0 },
					queryStr: '',
				},
				userList: [],
				total: 0,
				page: 1,
				isEditRow: false,
				listLoading: false,
				editFormVisible: false,
				editLoading: false,
				comVisible: false,
				editFormRules: {
					UserName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					Phone: [
						{ pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
					],
					UserPass: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: { },
				addFormVisible: false,
				addLoading: false,
				addForm: {
					UserName: '',
					CompanyId: '',
					Phone: '',
					isDel: 1,
					UsrePass: ''
				},
				addFormRules: {
					UserName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					Phone: [
						{ pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
					],
					UsrePass: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				addOpations: [],
				zjTpl: [],
				oldName: '',
				IsNameChange: false
			}
		},
		components: {
			treeTpl
		},
		methods: {
			handleCurrentChange(val) {
				this.para.pager.page = val;
				this.getUsers();
			},
	       showCom () {
		       	this.isEditRow = true
		       	this.comVisible = true
	       },
	       formEvent (val) {
	       		if (val.length == 1) {
	       			if (!this.isEditRow) {
		        		this.addForm.CompanyID = val[0].ID
			       		this.addForm.CompanyName = val[0].name
		        	}else {
		        		this.editForm.CompanyID = val[0].ID
			       		this.editForm.CompanyName = val[0].name
		        	}
	       		}
	        	this.comVisible = false 	
	       },
			getUsers() {
				this.listLoading = true;
				getSide(this.para).then((res) => {
					this.userList = res.data.rows;
					this.total = res.data.total;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (id) {
				this.$confirm('确认删除该条信息吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: id };
					delSide(para).then((res) => {
						this.listLoading = false;
						if (res.data.type == 1) {
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							this.getUsers();
						}else {
							this.$notify({
								title: '失败',
								message: '删除失败，请刷新页面',
								type: 'error'
							});
						}	
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				this.oldName = row.UserName
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认修改吗？', '提示', {}).then(() => {
							if (this.oldName !== this.editForm.UserName) {
								this.IsNameChange = true
							}else {
								this.IsNameChange = false
							}
							this.isEditRow = false
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							delete para.RankID
							editSide({strMain: para, IsUserNameChange: this.IsNameChange}).then((res) => {
								this.editLoading = false;
								if (res.data.type == 1) {
									this.$notify({
										title: '成功',
										message: '修改成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getUsers();
								}else {
									this.$notify({
										title: '失败',
										message: res.data.message,
										type: 'error'
									});
									this.editLoading = false;
									this.editFormVisible = false;
									this.$refs['editForm'].resetFields();
								}	
							});
						});
					}
				});
			},
			editRow (val, type) {
				this.editForm = Object.assign({}, val);
				let para = Object.assign({}, this.editForm);
				editSide({strMain: para, IsUserNameChange: this.IsNameChange}).then( (res) => {
					this.editLoading = false;
					if (res.data.type == 1) {
						this.$notify({
							title: '成功',
							message: '修改成功',
							type: 'success'
						});
					}else {
						this.$notify({
							title: '失败',
							message: '修改失败，刷新界面试一下吧',
							type: 'error'
						});
					}
				})
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							createSide({strMain: para}).then((res) => {
								this.addLoading = false;
								if (res.data.type == 1) {
									this.$notify({
										title: '成功',
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getUsers();
								}else {
									this.$notify({
										title: '失败',
										message: '提交失败，刷新界面试一下吧',
										type: 'error'
									});
									this.addFormVisible = false;
								}
							});
						});
					}
				});
			}
		},
		watch: {
			'para.queryStr.UserName': function (val) {
				if (val === '') {
					this.getUsers();
				}
			},
			filterText(val) {
		        this.$refs.tree.filter(val);
		    }
		},
		mounted() {
			this.getUsers();
			getCompany(this.zjpara).then((res) => {
				res.data.rows.map( e => {
					this.zjTpl.push({
						value: e.Id,
						label: e.ContractorName
					})						
				})
				this.listLoading = false;
			});
		}
	}

</script>
<style scoped>
	.is-disabled {
		width: 90%;
	}
</style>s