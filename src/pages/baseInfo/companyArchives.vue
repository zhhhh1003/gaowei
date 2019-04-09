<template>
		<section>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-form :inline="true">
						<el-form-item>
							<el-input size="small" v-model="para.queryStr" placeholder="承包商名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button size="small" type="primary" plain v-on:click="getList"><i class='el-icon-search'></i>&nbsp查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button size="small" type="primary" @click="handleAdd"><i class='el-icon-plus'></i>&nbsp新增</el-button>
						</el-form-item>
					</el-form>
				</el-col>

				<!--列表-->
				<el-table :data="companyList" highlight-current-row v-loading="listLoading" style="width: 100%;"
				@selection-change="selsChange" border>
					<el-table-column label="序号" width="100" align='center'>
						<template slot-scope='scope'>
							<span>{{scope.$index + 1}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="ContractorName" label="承包商名称" min-width="110" align='center'>
					</el-table-column>	
					<el-table-column label="操作" width="300" align='center'>
						<template slot-scope="scope">
							<el-button type="warning" size="mini" @click="handleEdit(scope.row)">修改</el-button>
						</template>
					</el-table-column>
				</el-table>

				<el-col :span="24" class="toolbar" style='padding: 5px;'>
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;margin-top: 5px;">
					</el-pagination>
				</el-col>

				<el-dialog title="修改信息" :visible.sync="editFormVisible" :close-on-click-modal="true">
					<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm" status-icon>
						<el-col :span='12'>
							<el-form-item label="承包商名称" prop="ContractorName">
								<el-input v-model="editForm.ContractorName" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click.native="editFormVisible = false">取消</el-button>
						<el-button type="primary" @click.native="editSubmit(editForm.ID)" :loading="editLoading">提交</el-button>
					</div>
				</el-dialog>

				<el-dialog title="新增承包商" :visible.sync="addFormVisible" :close-on-click-modal="false">
					<el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
						<el-row>
							<el-col :span='12'>
								<el-form-item label="承包商名称" prop="ContractorName">
									<el-input v-model="addForm.ContractorName" auto-complete="off"></el-input>
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
	import { getCompany, createCompany, editCompany, delCompany } from '../../api/api';

	export default {
		data() {
			return {
				para: {
					pager: { rows: 10, page: 1, sort: 'Pubdate', order: 'DESC', totalRows: 0, totalPages: 0 },
					queryStr: '',
				},
				companyList: [],
				total: 0,
				page: 1,
				id: 1,
				sels: [],
				listLoading: false,
				editFormVisible: false,
				editLoading: false,
				editForm: { 
					Id: '',
					ContractorName: '',
					ContractorType: '',
					LicenseNumber: '',
					TaxCode: '',
					ContractorPerson: '',
					Pubdate: '',
					IsDel: 1
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					ContractorName: [
						{ required: true, message: '请输入内容', trigger: 'blur' }
					]
				},
				editFormRules: {
					ContractorName: [
						{ required: true, message: '请输入内容', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
						ContractorName: '',
						ContractorType: '',
						LicenseNumber: '',
						TaxCode: '',
						ContractorPerson: '',
						Pubdate: '',
						IsDel: 1
					},
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.para.pager.page = val;
				this.getList();
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			getList() {
				this.listLoading = true;
				getCompany(this.para).then((res) => {
					this.total = res.data.total
					this.companyList = res.data.rows
					this.listLoading = false;
				});
			},
			//删除
			handleDel(row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: row.Id };
					delCompany(para).then((res) => {
						this.listLoading = false;
						this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success'
						});
						this.getList();
					});
				}).catch(() => {

				});
			},
			//显示新增界面
			handleAdd () {
				this.addFormVisible = true;
			},
			handleEdit (val) {
				this.editForm.Id = val.Id
				this.editForm.ContractorName = val.ContractorName
				this.editFormVisible = true;
			},
			editSubmit () {
				this.editForm.Pubdate = new Date();
				let para = Object.assign({}, this.editForm);
				this.editLoading = true;
				console.log(para)
				editCompany({strMain: para}).then( (res) => {
						this.editLoading = false;
						if (res.data.type == 1) {
							this.$notify({
								title: '成功',
								message: '修改成功',
								type: 'success'
							});
							this.getList();
						}else {
							this.$notify({
								title: '失败',
								message: '修改失败，刷新界面试一下吧',
								type: 'error'
							});
						}
						this.$refs['editForm'].resetFields();
						this.editFormVisible = false;	
					})
			},
			//新增
			addSubmit () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addForm.Pubdate = new Date();
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							createCompany({strMain: para}).then((res) => {
								this.addLoading = false;
								if (res.data.type == 1) {
									this.$notify({
										title: '成功',
										message: '新增成功',
										type: 'success'
									});
									this.getList();
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
			}
		},
		watch: {
			'para.queryStr': function (val) {
				if (val === '') {
					this.getList();
				}
			}
		},
		mounted() {
			this.getList();
		}
	}
</script>
