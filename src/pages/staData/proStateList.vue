<template>
	<div style='height: 85vh;background: white;margin-top: 5px;'>
	<el-row>
	<el-col :span='4' style='margin-top: 10px;margin-right: 10px;margin-left: 10px'>
		<el-cascader
	        clearable
	        placeholder="许可作业种类和级别"
	        :options="PermitOptions"
	        change-on-select
	        v-model='WorkType'
	        size='small'
	    ></el-cascader>
    </el-col>
    <el-col :span='4'>
    	<el-select v-model="para.strQuery.Status" placeholder="审批状态" size='small' clearable style='margin-top: 10px;margin-right: 10px'>
		    <el-option
		      v-for="item in stateOptions"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		</el-select>
    </el-col>
    <el-col :span='4' style='margin-top: 10px;'>
    	<el-input v-model="para.strQuery.ProjectName" clearable placeholder="项目名称" size="small"></el-input>
    </el-col>
    <el-button @click='search' size='small' type="primary" plain style='margin: 10px'><i class='el-icon-search'></i>&nbsp查找</el-button>
    </el-row>
	<el-collapse accordion @change="handleChange" v-loading="listLoading">
	  <el-collapse-item v-for='(item, index) in projectList' :name="item.ID" style='text-indent: 5px;'>
	  	<template slot="title">
		      <span>项目名称：{{item.ProjectName}}</span>
		      <span>检修类别：{{item.OverClass}}</span> 
		      <span>委托单位：{{item.Client}}</span>
		      <span>施工单位：{{item.ConUnits}}</span> 
		</template>
	    <div v-for='task in taskList' style='padding-left: 15px;border-top: 1px solid #ddd;padding-top: 5px;text-indent: 0;'>
	    	<span>任务名称：{{task.TaskName}}</span>
	    	<span>开始时间：{{task.BeginDate}}</span>
	    	<span>结束时间：{{task.EndDate}}</span>
	    	<span>区域：{{task.Area}}</span>
	    	<span>提交人：{{task.CreatUser}}</span>
	    	<span style='color: #409EFF'>审核状态：{{text(task.State)}}</span>
	    </div>
	  </el-collapse-item>
	</el-collapse>
	</div>
</template>
<script>
	import { getListPage, zj_getTaskTabList, getPermitList } from '../../api/api'
	export default {
		data() {
			return {
				projectList: [],
				taskList: [],
				PermitOptions: [],
				listLoading: false,
				stateOptions: [
					{value: '3', label: '审批已经完成'},
					{value: '2', label: '业务审批完成'},
					{value: '1', label: '属地审批完成'},
					{value: '0', label: '直接方已提交'}
				],
				PermitPara: {
			        type: ''
			    },
			    WorkType: [],
				para: {
					strPager: { rows: 10, page: 1, sort: 'CreatTime', order: 'DESC', totalRows: 0, totalPages: 0 },
					strQuery: { Client: '', OverClass: '', ConUnits: '', ProjectName: '', LoginCode: '', ConUnitsId: '', NameOne: '', NameTwo: '', Status: '' },
				},
			}
		},
		methods: {
			search () {
	            this.para.strQuery.NameOne = this.WorkType[0]
				this.para.strQuery.NameTwo = this.WorkType[1]
				this.fillTable()
			},
			fillTable() {
				this.listLoading = true;
				getListPage(this.para).then((res) => {
					this.projectList = res.data.rows.map(e => {
						e.CreatTime = e.CreatTime.split('.')[0]
						e.CreatTime = e.CreatTime.replace('T', ' ')
						return e
					});
					this.listLoading = false;
				});
			},
			handleChange (val) {
				if (val) {
					this.listLoading = true
					zj_getTaskTabList({ id: val}).then(res => {
		            this.listLoading = false
		            let obj = Object.assign({}, JSON.parse(res.data)[0])
		            this.taskList = obj.items.map(e => {
		              e.BeginDate = e.BeginDate.split('.')[0]
		              e.BeginDate = e.BeginDate.replace('T', ' ')
		              e.EndDate = e.EndDate.split('.')[0]
		              e.EndDate = e.EndDate.replace('T', ' ')
		              return e
		            })
	          		})
				}	
			},
			text (val) {
				switch (parseInt(val)) {
				  case -1:
		            return '直接待提交';
		            break;
		          case 0:
		            return '直接方提交';
		            break;
		          case 1:
		            return '属地方审核完成';
		            break;
		          case 2:
		            return '业务方审核完成';
		            break; 
		          case 3:
		            return 'HSE审核完成';
		            break;          
		        }
			}
		},
		watch: {
			'para.strQuery.ProjectName' (val) {
				if (val === '') {
					this.fillTable();
				}
			},
			'WorkType' (val) {
				if (val.length == 0) {
					this.para.strQuery.NameOne = ''
					this.para.strQuery.NameTwo = ''
					this.fillTable();
				}
			},
			'para.strQuery.Status' (val) {
				if (val === '') {
					this.fillTable();
				}
			}
		},
		mounted () {
			let infoArr = sessionStorage.getItem('only_sign').split(',')
			if (sessionStorage.getItem('userType') == 'inner') {
				this.para.strQuery.LoginCode = infoArr[2]
			}else {
				this.para.strQuery.ConUnitsId = infoArr[2]
			}
			getPermitList(this.PermitPara).then(res => {
		        res.data.rows.map(e => {
		           let newObj = {
		            children: []
		           }
		           newObj.value = e.Name
		           newObj.label = e.Name
		           if (e.Children.length != 0) {
		            e.Children.map(j => {
		              newObj.children.push({
		                label: j.Name,
		                value: j.Name
		              })
		            })
		           }else {
		              delete newObj.children
		           }
		           if (e.ExeOne == 0) {
		            this.PermitOptions.push(newObj)
		           } 
		        });
		        this.fillTable()
		    })
		}
	}		
</script>
<style scoped>
	.el-collapse-item__content span {
		display: inline-block;
    	width: 30%;
	}
	.el-collapse-item__header span {
		display: inline-block;
    	width: 23%;
    	font-weight: bold;
	}
	.el-collapse-item__header {
		padding-left: 15px;
	}
</style>