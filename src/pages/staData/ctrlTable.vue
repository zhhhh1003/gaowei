<template>
<div>
  <el-form :inline="true">
    <el-form-item>
      <el-input size="small" v-model="para.queryStr.TaskName" placeholder="检查项目名称"></el-input>
    </el-form-item>
    <el-form-item>
       <el-date-picker
          v-model="para.queryStr.MinDate"
          type="date"
          value-format='yyyy-MM-dd'
          size='small'
          placeholder="选择日期">
        </el-date-picker>
    </el-form-item>
    <el-form-item>
       <el-date-picker
          v-model="para.queryStr.MaxDate"
          type="date"
          size='small'
          value-format='yyyy-MM-dd'
          placeholder="选择日期">
        </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button size="small" type="primary" plain v-on:click="fillTable"><i class='el-icon-search'></i>&nbsp查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="taskList" highlight-current-row v-loading="listLoading" style="width: 100%;" height="480" border>
    <el-table-column width="150" prop='Area' label="装置/生产区域" align='center'>
    </el-table-column>
    <el-table-column width="100" prop='TaskName' label="项目" align='center'>
    </el-table-column>
    <el-table-column width="100" prop='ConUnits' label="作业方" align='center'>
    </el-table-column>
    <el-table-column width="100" prop='Client' label="属地管理方" align='center'>
    </el-table-column>
    <el-table-column width="150" prop='YeWuManage' label="业务或专业管理方" align='center'>
    </el-table-column>
    <el-table-column width="85" label="控制时间节点" align='center'>
      <el-table-column width="600" label="作业计划" align='center'>
        <el-table-column width="150" prop='PlanDate' label="项目任务下达时间" align='center'></el-table-column>
        <el-table-column width="150" prop='PlanReportDate' label="作业方上报时间" align='center'></el-table-column>
        <el-table-column width="150" prop='ShuDiAuditDate' label="属地管理方审批时间" align='center'></el-table-column>
        <el-table-column width="150" prop='auditDate' label="业务/专业管理方审批时间" align='center'></el-table-column>
      </el-table-column>
      <el-table-column width="450" label="作业方案" align='center'>
        <el-table-column width="150" prop='SubmitDate' label="提交时间" align='center'></el-table-column>
        <el-table-column width="150" prop='RatifyDate' label="批准时间" align='center'></el-table-column>
        <el-table-column width="150" prop='DetailsDate' label="交底时间" align='center'></el-table-column>
      </el-table-column>
      <el-table-column width="450" label="许可作业" align='center'>
        <el-table-column width="150" prop='ApplyDate' label="作业票申请时间" align='center'></el-table-column>
        <el-table-column width="150" prop='ApplyApproveDate' label="作业票批准时间" align='center'></el-table-column>
        <el-table-column width="150" prop='ApplyCloseDate' label="作业票封闭时间" align='center'></el-table-column>
      </el-table-column>
      <el-table-column width="600" label="现场监督" align='center'>
        <el-table-column width="150" prop='SceneDate' label="现场交底时间" align='center'></el-table-column>
        <el-table-column width="150" prop='AffirmDate' label="现场确认时间" align='center'></el-table-column>
        <el-table-column width="150" prop='ChangeDate' label="现场变更时间" align='center'></el-table-column>
        <el-table-column width="150" prop='CheckDate' label="现场检查时间" align='center'></el-table-column>
        <el-table-column width="150" prop='VerifyDate' label="作业完成确认" align='center'></el-table-column>
      </el-table-column>
      <el-table-column width="150" prop='ReportDate' label="作业报备时间" align='center'></el-table-column>
    </el-table-column>
  </el-table>
  <el-col :span="24" class="toolbar" style='padding: 5px;'>
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;margin-top: 5px;">
          </el-pagination>
  </el-col>
</div>
</template>
<script>
  import { ctrlSta } from '../../api/api'
  export default {
    data () {
     return {
      listLoading: false,
      taskList: [],
      total: 0,
      page: 1,
      para: {
        pager: { rows: 10, page: 1, sort: 'CreateDate', order: 'DESC', totalRows: 0, totalPages: 0 },
        queryStr: { TaskName: '',  MinDate: '', MaxDate: '', ConUnitsId: ''}
      },
     }
    },
    methods: {
      handleCurrentChange(val) {
        this.para.pager.page = val;
        this.fillTable();
      },
      fillTable () {
        if (this.para.queryStr.MinDate > this.para.queryStr.MaxDate) {
          this.$alert('起始日期大于结束日期', '提示', {
          confirmButtonText: '确定',
          type: 'info'
          }) 
        }else {
          ctrlSta(this.para).then(res => {
          this.listLoading = false
          this.total = res.data.total
          this.taskList = res.data.rows.map(e => {
            for (let k in e) {
              if (e[k]) {
                if (e[k].indexOf('-') != -1) {
                  if (e[k].split('-')[0] == 1900) {
                    e[k] = ''
                  }else {
                    e[k] = e[k].split('.')[0]
                    e[k] = e[k].replace('T', ' ')
                  }
                }
              }  
            }
            return e
          })
        })
        }
      }
    },
    watch: {
      'para.queryStr.MinDate': function (val) {
        if (!val && !this.para.queryStr.MaxDate) {
          this.fillTable();
        }
      },
      'para.queryStr.MaxDate': function (val) {
        if (!val && !this.para.queryStr.MinDate) {
          this.fillTable();
        }
      },
      'para.queryStr.TaskName': function (val) {
        if (val === '') {
          this.fillTable();
        }
      }
    },
    mounted () {
      this.listLoading = true
      let infoArr = sessionStorage.getItem('only_sign').split(',')
      if (sessionStorage.getItem('userType') != 'inner') {
        this.para.queryStr.ConUnitsId = infoArr[2]
      }
      this.fillTable()
    }
  }
</script>

