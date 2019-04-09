<template>
	<section class='mainContent'>
		<el-tabs v-model="activeName" @tab-click="handleClick" type="border-card" style='margin-top: 5px'>
		    <el-tab-pane label="待审核列表" name="first" v-if='isInner'>
		    	<el-table :data="planList" highlight-current-row v-loading="listLoading" style="width: 100%;" height='470'>
						<el-table-column prop="ProjectName" label="项目名称" width="120" align='center'>
						</el-table-column>
						<el-table-column prop="Client" label="委托单位" width="150" align='center'>
						</el-table-column>
						<el-table-column prop="OverClass" label="检修类别" width="100" align='center'>
						</el-table-column>
						<el-table-column prop="ConUnits" label="施工单位" width="150" align='center'>
						</el-table-column>
						<el-table-column prop="Site" label="设备位置" min-width="180" align='center'>
						</el-table-column>
						<el-table-column prop="Size" label="规格数量" min-width="70" align='center'>
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
		    </el-tab-pane>
		    <el-tab-pane label="审核驳回列表" name="second">
		    	<el-table :data="planList" highlight-current-row v-loading="listLoading" style="width: 100%;" height='470'>
						<el-table-column prop="ProjectName" label="项目名称" width="120" align='center'>
						</el-table-column>
						<el-table-column prop="Client" label="委托单位" width="150" align='center'>
						</el-table-column>
						<el-table-column prop="OverClass" label="检修类别" width="100" align='center'>
						</el-table-column>
						<el-table-column prop="ConUnits" label="施工单位" width="150" align='center'>
						</el-table-column>
						<el-table-column prop="Site" label="设备位置" min-width="180" align='center'>
						</el-table-column>
						<el-table-column prop="Size" label="规格数量" min-width="70" align='center'>
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
		    </el-tab-pane>
		    <el-tab-pane label="待确认列表" name="third" v-if='!isHSE'>
		    	<el-table :data="comfirmList" highlight-current-row v-loading="listLoading" style="width: 100%;" height='470'>
						<el-table-column prop="ProjectName" label="项目名称" width="120" align='center'>
						</el-table-column>
						<el-table-column prop="Client" label="委托单位" width="150" align='center'>
						</el-table-column>
						<el-table-column prop="OverClass" label="检修类别" width="100" align='center'>
						</el-table-column>
						<el-table-column prop="ConUnits" label="施工单位" width="150" align='center'>
						</el-table-column>
						<el-table-column prop="Site" label="设备位置" min-width="180" align='center'>
						</el-table-column>
						<el-table-column prop="Size" label="规格数量" min-width="70" align='center'>
						</el-table-column>
						<el-table-column prop="CreatTime" label="提报日期" min-width="180" align='center'>
						</el-table-column>
						<el-table-column label="操作" width="150" align='center'>
							<template slot-scope="scope">
								<el-button size="small" type="primary" @click="handleComfirm(scope.row)">前往确认</el-button>
							</template>
						</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
						<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
						</el-pagination>
				</el-col>
		    </el-tab-pane>
		</el-tabs>
	</section>
</template>

<script>
	import { zj_getPlanList, zj_TaskReject, readyConfirm } from '../../api/api';
	export default {
		data() {
			return {
				activeName: 'second',
				planList: [],
				comfirmList: [],
				total: 0,
				page: 1,
				userType: '',
				isInner: true,
				isHSE: false,
				para: {
					strPager: { rows: 10, page: 1, sort: '', order: 'DESC', totalRows: 0, totalPages: 0 },
					strQuery: { Client: '', OverClass: '', ConUnits: '', ProjectName: '', Status: '', LoginCode: '', ThisRoleId: '', ReturnTak: '1' },
				},
				para_zj: {
		          strPager: { rows: 10, page: 1, sort: 'CreatTime', order: 'DESC', totalRows: 0, totalPages: 0 },
		          ConUnitsId: ''
		        },
		        para_comf: {
		          pager: { rows: 10, page: 1, sort: 'CreatTime', order: 'DESC', totalRows: 0, totalPages: 0 },
		          RoleId: '',
		          ConUnitsId: ''
		        },
				listLoading: false
			}
		},
		methods: {
			handleClick(tab, event) {
				if (tab.name == 'second') {
					this.para.strQuery.ReturnTak = 1
				}else if (tab.name == 'first') {
					this.para.strQuery.ReturnTak = 0
				}else if (tab.name == 'third'){
					readyConfirm(this.para_comf).then(res => {
						this.comfirmList = res.data.rows.map(e => {
							e.CreatTime = e.CreatTime.split('.')[0]
							e.CreatTime = e.CreatTime.replace('T', ' ')
							return e
						});
					})
					return
				}
				this.getList()
		    },
			handleCurrentChange(val) {
				this.para.strPager.page = val;
				this.getList();
			},
			handleComfirm (row) {
				this.$store.dispatch('createHead', {headList: {
					state: row.cState,
					TaskID: row.TaskID,
					ProjectName: row.ProjectName,
					Client: row.Client,
					ConUnits: row.ConUnits,
					OverClass: row.OverClass,
					ConUnitsId: row.ConUnitsId
				}})
				this.$router.push({ path: '/service/serviceConfirm/' + this.userType + '_confirm/' + this.userType + '_confirm_info', query: { sign: row.TaskID } })
			},
			getList() {
				this.listLoading = true;
				if (this.isInner) {
					zj_getPlanList(this.para).then((res) => {
						this.planList = res.data.rows.map(e => {
							e.CreatTime = e.CreatTime.split('.')[0]
							e.CreatTime = e.CreatTime.replace('T', ' ')
							return e
						});
						this.total = res.data.total
						this.listLoading = false;
					});
				}else {
					zj_TaskReject(this.para_zj).then(res => {
						this.planList = res.data.rows.map(e => {
							e.CreatTime = e.CreatTime.split('.')[0]
							e.CreatTime = e.CreatTime.replace('T', ' ')
							return e
						});
						this.total = res.data.total
						this.listLoading = false;
					})
				}
				
			},	
			handleEdit: function (row) {
				sessionStorage.setItem('proCreateBy', row.AddRoleId)
				this.$router.push({ path: '/service/servicePlan/' + this.userType + '_service/' + this.userType + '_service_list', query: { sign: row.ID, ret: this.para.strQuery.ReturnTak } })
			}
		},
		watch: {
			'para.strQuery.ProjectName': function (val) {
				if (val === '') {
					this.getList();
				}
			}
		},
		created() {
			let infoArr = sessionStorage.getItem('only_sign').split(',')
			this.para.strQuery.ThisRoleId = infoArr[1]
			this.para_comf.RoleId = infoArr[1]
			this.para.strQuery.LoginCode = infoArr[2]
			if (sessionStorage.getItem("userType") != "inner") {
				let ConUnitsId = sessionStorage.getItem('only_sign').split(',')[2]
				this.isInner = false
				this.para_zj.ConUnitsId = ConUnitsId
				this.para_comf.ConUnitsId = ConUnitsId
			}
			switch (infoArr[1]) {
		      case '2018012314291847410306e57fe58cf':
		        this.para.strQuery.Status = 1;
		        this.userType = 'yw'
		        break;
	     	  case '20180123142756983168484001a045f':
		        this.para.strQuery.Status = 0;
		        this.userType = 'sd'
		        break;
		      case '20180123142744369986107507bb4e5':
		        this.para.strQuery.Status = 2;
		        this.userType = 'HSE'
		        this.isHSE = true
		        break;
		      default:
		      	this.userType = 'zj'
		      	this.para.strQuery.Status = 6;
		    }
			this.getList();
		}
	}

</script>