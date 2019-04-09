<template>
	<section class='mainContent'>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="para.strQuery">
					<el-form-item>
						<el-input size="small" v-model="para.strQuery.ProjectName" placeholder="项目名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input size="small" v-model="para.strQuery.Client" placeholder="委托单位"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input size="small" v-model="para.strQuery.ConUnits" placeholder="施工单位"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input size="small" v-model="para.strQuery.OverClass" placeholder="检修类别"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size="small" type="primary" v-on:click="getList"><i class='el-icon-search'></i>&nbsp查询</el-button>
					</el-form-item>
				</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="planList" highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column prop="ProjectName" label="项目名称" width="120" align='center'>
				</el-table-column>
				<el-table-column prop="Client" label="委托单位" width="150" align='center'>
				</el-table-column>
				<el-table-column prop="OverClass" label="检修类别" width="100" align='center'>
				</el-table-column>
				<el-table-column prop="ConUnits" label="施工单位" width="120" align='center'>
				</el-table-column>
				<el-table-column prop="Site" label="设备位置" min-width="180" align='center'>
				</el-table-column>
				<el-table-column prop="Size" label="规格数量" min-width="80" align='center'>
				</el-table-column>
				<el-table-column prop="CreatTime" label="提报日期" min-width="180" align='center'>
				</el-table-column>
				<el-table-column prop="AddUser" label="提交方" width="100" align='center'>
				</el-table-column>
				<el-table-column label="操作" width="150" align='center'>
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="handleEdit(scope.row)">查看详情</el-button>
					</template>
				</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import { zj_getPlanList, IsTabExpire } from '../../api/api';
	export default {
		data() {
			return {
				planList: [],
				total: 0,
				page: 1,
				para: {
					strPager: { rows: 10, page: 1, sort: '', order: 'DESC', totalRows: 0, totalPages: 0 },
					strQuery: { Client: '', OverClass: '', ConUnits: '', ProjectName: '', ConUnitsId: '', CheckState
: 1 },
				},
				listLoading: false
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.para.strPager.page = val;
				this.getList();
			},
			getList() {
				this.listLoading = true;
				zj_getPlanList(this.para).then((res) => {
					this.planList = res.data.rows.map(e => {
						e.CreatTime = e.CreatTime.split('.')[0]
						e.CreatTime = e.CreatTime.replace('T', ' ')
						return e
					});
					this.total = res.data.total
					this.listLoading = false;
				});
			},
			handleEdit: function (row) {
				IsTabExpire({ProjectId: row.ID}).then(res => {
					if (res.data.type == 1) {
						this.$router.push({ path: 'zj_service_list', query: { sign: row.ID } })
					}
				})
			}
		},
		watch: {
			'para.strQuery.ProjectName': function (val) {
				if (val === '') {
					this.getList();
				}
			},
			'para.strQuery.Client': function (val) {
				if (val === '') {
					this.getList();
				}
			},
			'para.strQuery.ConUnits': function (val) {
				if (val === '') {
					this.getList();
				}
			},
			'para.strQuery.OverClass': function (val) {
				if (val === '') {
					this.getList();
				}
			}
		},
		mounted() {
			this.para.strQuery.ConUnitsId = sessionStorage.getItem('only_sign').split(',')[2];
			this.getList();
		}
	}

</script>