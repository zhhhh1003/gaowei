<template>
<div>
  <el-form :inline="true" :model="serviceData">
    <el-form-item label="项目名称：" align='right'>
      <el-input size="small" v-model="serviceData.ProjectName" disabled></el-input>
    </el-form-item>
    <el-form-item label="检修类别：" align='right'>
      <el-input size="small" v-model="serviceData.OverClass" disabled></el-input>
    </el-form-item>
    <el-form-item  label="施工单位：" align='right'>
      <el-input size="small" v-model="serviceData.ConUnits" disabled></el-input>
    </el-form-item>
    <el-form-item label="委托单位：" align='right'>
      <el-input size="small" v-model="serviceData.Client" disabled></el-input>
    </el-form-item>
    <el-form-item label="装置/生产区域：" align='right'>
      <el-input size="small" v-model="serviceData.Site" disabled></el-input>
    </el-form-item>
    <el-form-item label="规格、数量：" align='right'>
      <el-input size="small" v-model="serviceData.Size" disabled></el-input>
    </el-form-item>
  </el-form>
  <el-button @click='addRow' type="primary" style='margin: 10px;' v-if='false'>添加任务</el-button>

  <el-table :data="taskList" highlight-current-row v-loading="listLoading" style="width: 100%;" height='430'border>
    <el-table-column width="150" label="任务名称" align='center'>
      <template slot-scope="scope">
        <el-popover
          ref="popover"
          placement="right"
          width="800"
          trigger="hover">
          <el-table :data="scope.row.VerTabIds" align='center'>
            <el-table-column width="180" property="ProjectName" label="项目名称" align='center'></el-table-column>
            <el-table-column width="180" property="TaskName" label="任务名称" align='center'></el-table-column>
            <el-table-column width="180" property="ConUnits" label="施工单位" align='center'></el-table-column>
            <el-table-column width="150" property="BeginDate" label="开始时间" align='center'></el-table-column>
            <el-table-column width="150" property="EndDate" label="结束时间" align='center'></el-table-column>
          </el-table>
        </el-popover>
        <el-badge :value="acrossType(scope.row)" class="item" v-popover:popover>
        </el-badge>
        <span>{{ scope.row.TaskName }}</span>
      </template>
    </el-table-column>
    <el-table-column width="200" label="装置/生产区域" align='center'>
      <template slot-scope="scope">
        <span>{{ scope.row.Area }}</span>
      </template>
    </el-table-column>
    <el-table-column width="150" prop='BeginDate' label="作业开始日期" align='center'>
    </el-table-column>
    <el-table-column width="150" prop='EndDate' label="作业结束日期" align='center'>
    </el-table-column>
    <el-table-column width="100" prop='State' label="状态" align='center'>
      <template slot-scope="scope">
        {{tableText(scope.row.State)}}
      </template>
    </el-table-column>
    <el-table-column width="150" prop='CreatUser' label="编制人" align='center'>
    </el-table-column>
    <el-table-column min-width="150" prop='CreatTime' label="编制日期" align='center'>
    </el-table-column>
    <el-table-column label="操作" width="300" align='center'>
      <template slot-scope="scope">
        <el-button :type="btnColor(scope.row.State)" @click='editRow(scope.row)' size="small" :disabled='scope.row.State == 0'><i class='el-icon-edit'></i>&nbsp{{btnText(scope.row)}}</el-button>
        <el-button type="danger" size="small" @click="handleBack(scope.row)" v-if='canReject && scope.row.State == 1'>驳回</el-button>
        <el-button size="small" v-if='scope.row.ReturnTak == 1' @click="rejectRcd(scope.row)">驳回记录</el-button>
        <el-button v-if='false' :disabled='scope.row.State == 0' size="small" @click="handleDel(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog title="驳回理由" :visible.sync="addRowVisible" :close-on-click-modal="true">
    <el-form :model="editForm" label-width="120px" :rules="editRowRules" ref="editForm">
      <el-form-item label="驳回理由" prop='ReturnMemo'>
        <el-input type="textarea" v-model='editForm.ReturnMemo'></el-input>
      </el-form-item>
      <el-button type="primary" @click.native="subReject" style='float: right'>驳回</el-button>
      <div style='clear: both'></div>
    </el-form>
  </el-dialog>

  <el-dialog title="驳回记录" :visible.sync="recalListVisible" :close-on-click-modal="true">
      <el-row v-for='item in recalList'>
        <div style='background: #eee; padding-left: 10px;border: 1px solid #eee'>
          <span style='color: #409EFF;display: inline-block;width: 20%;'>驳回人:</span>
          <span style='display: inline-block;width: 25%;'>{{item.UserName}}</span>
          <span style='color: #409EFF;display: inline-block;width: 20%;'>驳回时间:</span>
          <span style='display: inline-block;width: 25%;'>{{item.ReturnDate}}</span>
        </div>
        <div style='padding-left: 10px;border: 1px solid #eee;margin-bottom: 5px'>
          <span style='color: #409EFF;display: inline-block;width: 20%;'>驳回原因:</span>
          <span>{{item.ReturnMemo}}</span>
        </div>
      </el-row>
  </el-dialog>
</div>
</template>
<script>
  import { zj_getTaskTabList, zj_deletePlan, TaskReject, RejectRecord } from '../../api/api'
  export default {
    data () {
     return {
      serviceData: {},
      listLoading: false,
      taskList: [],
      addRowVisible: false,
      editForm: {
        ReturnMemo: ''
      },
      editRowRules: {
          ReturnMemo: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
      },
      rejectPara: {
        RoleId: '',
        UserId: '',
        UserName: '',
        ReturnMemo: '',
        TaskTabId: ''
      },
      recalList: [],
      recalListVisible: false
     }
    },
    computed: {
      canReject () {
        return sessionStorage.getItem("proCreateBy") != "20180123142756983168484001a045f"
      }
    },
    methods: {
      acrossType (val) {
        if (val.IsOverlapping == 1 && val.IsVertical == 0) {
          return '水平交叉'
        }else if (val.IsOverlapping == 0 && val.IsVertical == 1) {
          return '垂直交叉'
        }else if (val.IsOverlapping == 1 && val.IsVertical == 1) {
          return '水平、垂直交叉'
        }else {
          return ''
        }
      },
      fillTable () {  
        let ReturnT = this.$route.query.ret
        zj_getTaskTabList({ id: this.$route.query.sign}).then(res => {
            this.listLoading = false
            let obj = Object.assign({}, JSON.parse(res.data)[0])
            this.taskList = obj.items.filter(e => {
              e.CreatTime = e.CreatTime.split('.')[0]
              e.CreatTime = e.CreatTime.replace('T', ' ')
              e.BeginDate = e.BeginDate.split('.')[0]
              e.BeginDate = e.BeginDate.replace('T', ' ')
              e.EndDate = e.EndDate.split('.')[0]
              e.EndDate = e.EndDate.replace('T', ' ')
              if (ReturnT == 1) {
                return e.ReturnTak == 1
              }else {
                return e
              }
            })
            this.serviceData = obj.title
          })
      },
      rejectRcd (val) {
          RejectRecord({TaskId: val.ID}).then(res => {
            this.recalListVisible = true
            this.recalList = res.data.rows.map(e => {
              e.ReturnDate = e.ReturnDate.split('.')[0].replace('T', ' ')
              return e
            })
          })
      },
      handleBack (val) {
        this.addRowVisible = true
        this.rejectPara.TaskTabId = val.ID
      },
      subReject () {
        this.rejectPara.ReturnMemo = this.editForm.ReturnMemo
        TaskReject(this.rejectPara).then(res => {
          if (res.data.type == 1) {
            this.addRowVisible = false
            this.fillTable()
          }
        })
      },
      addRow () {
        this.$router.push({ path: 'yw_service_info', query: {proID: this.serviceData.ID}})
      },
      editRow (val) {
        this.$router.push({ path: 'yw_service_info', query: { ID: val.ID, proName: this.serviceData.ProjectName } })
      },
      handleDel (val) {
        zj_deletePlan({ids: val.ID}).then(res => {
          if (res.data.type == 1) { 
            this.fillTable()
          }
        })
      },
      btnColor (val) {
        switch (parseInt(val)) {
          case -2:
            return 'primary';
            break;
          case -1:
            return 'primary';
            break;
          case 0:
            return 'primary';
            break;
          case 1:
            if (sessionStorage.getItem('proCreateBy') == '20180123142756983168484001a045f') {
              return 'primary';
            }else {
              return 'warning';
            }
            break;
          case 2:
            return 'primary';
            break;
          case 3:
            return 'primary';
            break;          
        }
      },
      tableText (val) {
        switch (parseInt(val)) {
          case -2:
            return '待填写';
            break;
          case -1:
            return '属地方已驳回';
            break;
          case 0:
            return '直接方已提交';
            break;
          case 1:
            return '属地方已审核';
            break;
          case 2:
            return '业务方已审核';
            break;
          case 3:
            return 'HSE已审核';
            break;          
        }
      },
      btnText (val) {
        let proCreateBy = sessionStorage.getItem('proCreateBy')
        if (proCreateBy == '20180123142756983168484001a045f' && val.State != 0) {
          return '查看属地方创建项目'
        }
        if (val.State == 2 || val.State == 3) {
          return '查看'
        }else if(val.State == 0) {
          return '待属地方审核'
        }else if (val.State == 1){
          return '审核'
        }else {
          return '查看'
        }
      }
    },
    mounted () {
      let infoArr = sessionStorage.getItem('only_sign').split(',')
      this.rejectPara.RoleId = infoArr[1]
      this.rejectPara.UserId = infoArr[4]
      this.rejectPara.UserName = infoArr[0]
      if (this.$route.query.sign) {
          this.listLoading = true
          this.fillTable()
      }else {
          this.$alert('请前往作业计划选择查看详情', '提示', {
          confirmButtonText: '前往',
          type: 'info'
          }).then( () => {
            this.$router.push({ path: 'zj_service_base' })
          }) 
      }
    }
  }
</script>
<style scoped>
  .el-form--inline .el-form-item {
    width: 29%;
    margin-bottom: 0;
  }
  .el-form--inline {
    background: white;
    border-radius: 6px;
    margin-top: 5px;
    padding: 10px 0;
  }
  .el-badge {
    display: block
  }
</style>
