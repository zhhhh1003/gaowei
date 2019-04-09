<template>
	<section class='mainContent'>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="para.queryStr">
					<el-form-item>
						<el-input size="small" v-model="para.queryStr.ProjectName" placeholder="项目名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input size="small" v-model="para.queryStr.Client" placeholder="委托单位"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input size="small" v-model="para.queryStr.ConUnits" placeholder="施工单位"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input size="small" v-model="para.queryStr.OverClass" placeholder="检修类别"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size="small" type="primary" v-on:click="fillTable"><i class='el-icon-search'></i>&nbsp查询</el-button>
					</el-form-item>
				</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="confirmList" highlight-current-row v-loading="listLoading" style="width: 100%;">
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
				<el-table-column prop="Size" label="规格数量" min-width="180" align='center'>
				</el-table-column>
				<el-table-column prop="CreatTime" label="提报日期" min-width="180" align='center'>
				</el-table-column>
				<el-table-column prop="cStateName" label='确认状态' min-width="180" align='center'>
				</el-table-column>
				<el-table-column label="操作" width="150" align='center'>
					<template slot-scope="scope">
						<el-button size="small" :type="btnColor(scope.row.cState)" @click="handleEdit(scope.$index, scope.row)" :disabled='scope.row.cState ==-1'>{{btnText(scope.row.cState)}}</el-button>
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
	import { getConfirmList } from '../../api/api';
	export default {
		data() {
			return {
				para: {
					pager: { rows: 10, page: 1, sort: '', order: 'DESC', totalRows: 0, totalPages: 0, cState: 0 },
					queryStr: { Client: '', OverClass: '', ConUnits: '', ProjectName: '',ConUnitsId: '', LoginCode: '' },
				},
				confirmList: [],
				total: 0,
				page: 1,
				id: 1,
				listLoading: false,
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.para.pager.page  = val;
				this.fillTable();
			},
			btnColor (val) {
		        switch (parseInt(val)) {
		          case -1:
		            return 'primary';
		            break;
		          case 0:
		            return 'primary';
		            break;
		          case 1:
		            return 'warning';
		            break;
		          case 2:
		            return 'primary';
		            break;        
		        }
		    },
			btnText (val) {
				switch (parseInt(val)) {
					case -1:
						return '待直接方确认';
						break;
					case 0:
						return '前往确认';
						break;
					case 1:
						return '修改';
						break;
					case 2:
						return '查看';
						break;				
				}
			},
			fillTable() {
				this.listLoading = true;
				getConfirmList(this.para).then((res) => {
					this.confirmList = res.data.rows.map(e => {
						e.CreatTime = e.CreatTime.split('.')[0]
						e.CreatTime = e.CreatTime.replace('T', ' ')
						if (e.cState == 0) {
							e.cStateName = '未确认'
						}else if (e.cState == 1) {
							e.cStateName = '已确认'
						}
						return e
					});
					this.total = res.data.total
					this.listLoading = false;
				});
			},
			handleEdit: function (index, row) {
				this.$router.push({ path: 'sd_confirm_info', query: { sign: row.TaskID } })
			},
		},
		watch: {
			'filters.name': function (val) {
				if (val === '') {
					this.fillTable();
				}
			}
		},
		mounted() {
			let infoArr = sessionStorage.getItem('only_sign').split(',')
			this.para.queryStr.LoginCode = infoArr[2]
			this.fillTable();
		}
	}

</script>

<style scoped>

</style>
