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
  <el-button @click='addFormVisible = true' type="primary" size='small' style='margin: 10px;'>添加任务</el-button>

  <el-table :data="taskList" highlight-current-row v-loading="listLoading" style="width: 100%;" height='430' border>
    <el-table-column min-width="150" label="任务名称" align='center'>
      <template slot-scope="scope">
        <el-popover
          ref="popover"
          placement="right"
          width="900"
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
        {{tableText(scope.row)}}
      </template>
    </el-table-column>
    <el-table-column width="150" prop='CreatUser' label="编制人" align='center'>
    </el-table-column>
    <el-table-column min-width="150" prop='CreatTime' label="编制日期" align='center'>
    </el-table-column>
    <el-table-column label="操作" width="300" align='center'>
      <template slot-scope="scope">
        <el-button :type="scope.row.State <= -1?'warning':'primary'" @click='editRow(scope.row)' size="small"v-if='scope.row.State != -2'>{{scope.row.State <= -1?'修改':'查看'}}</el-button>
        <el-button :type="scope.row.State <= -1?'warning':'primary'" @click='editRow(scope.row)' size="small" v-if='scope.row.State == -2'>添加作业</el-button>
        <el-button type="warning" size="small" @click="handleRecall(scope.row)" v-if='scope.row.State == 0'>撤回</el-button>
        <el-button size="small" v-if='scope.row.ReturnTak == 1' @click="rejectRcd(scope.row)">驳回记录</el-button>
        <el-button type="danger" size="small" @click="handleDel(scope.row)" icon="el-icon-delete"></el-button>
      </template>
    </el-table-column>
  </el-table>

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

  <el-dialog title="添加任务" :visible.sync="addFormVisible" :close-on-click-modal="true" width='800px'>
          <el-form :model="addTaskForm" label-width="120px" ref="addTaskForm" :rules="addFormRules" status-icon>
            <el-col :span='12'>
              <el-form-item label="任务名称" prop="TaskName">
                <el-input v-model="addTaskForm.TaskName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="任务区域" prop="Area">
                <el-input v-model="addTaskForm.Area"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="水平范围(米)" prop="Rlevel">       
                <el-input v-model.number="addTaskForm.Rlevel">m</el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="起始高度(米)" prop="Vertical">
                <el-input v-model.number="addTaskForm.Vertical" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="结束高度(米)" prop="VerticalTwo">
                <el-input v-model.number="addTaskForm.VerticalTwo" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>  
              <el-form-item label="开始时间" prop='BeginDate'>
                <el-date-picker
                   v-model="addTaskForm.BeginDate"
                   type="datetime"
                   placeholder="选择开始时间"
                   value-format="yyyy-MM-dd HH:00:00">
                 </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='12'>  
              <el-form-item label="结束时间" prop='EndDate'>
                <el-date-picker
                   v-model="addTaskForm.EndDate"
                   type="datetime"
                   placeholder="选择结束时间"
                   align="center"
                   value-format="yyyy-MM-dd HH:00:00">
                 </el-date-picker>
              </el-form-item>
            </el-col>  
            <div style='clear: both'></div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="taskSubmit" :loading="editLoading">提交</el-button>
          </div>
  </el-dialog>
</div>
</template>
<script>
  import { zj_getTaskTabList, zj_deletePlan, zj_recall, RejectRecord, zj_createPlan } from '../../api/api'
  export default {
    data () {
     return {
      serviceData: {},
      listLoading: false,
      taskList: [],
      recalList: [],
      recalListVisible: false,
      addFormVisible: false,
      editLoading: false,
      addTaskForm: {
        ProjectName: '',
        OverClass: '',
        ConUnits: '',
        Client: '',
        CreatUser: '',
        taskID: '',
        TaskName: '',
        Area: '',
        Rlevel: 0,
        Vertical: 0,
        VerticalTwo: 0,
        BeginDate: '',
        BeginDate: '',
        State: '-2'
      },
      addFormRules: {
          TaskName: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          Area: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          Rlevel: [
            { type: 'number', required: true, message: '请输入数字' }
          ],
          Vertical: [
            { type: 'number', required: true, message: '请输入数字' }
          ],
          VerticalTwo: [
            { type: 'number', required: true, message: '请输入数字' }
          ],
          BeginDate: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          EndDate: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]
      },
     }
    },
    methods: {
      AcrossInfo (val) {
        
      },
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
            this.addTaskForm.ProjectName = JSON.parse(res.data)[0].title.ProjectName
            this.addTaskForm.OverClass = JSON.parse(res.data)[0].title.OverClass
            this.addTaskForm.ConUnits = JSON.parse(res.data)[0].title.ConUnits
            this.addTaskForm.Client = JSON.parse(res.data)[0].title.Client
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
      tableText (val) {
        switch (parseInt(val.State)) {
          case -2:
            return '待填写';
            break;
          case -1:
            if (val.ReturnTak == 0) {
              return '已撤回';
            }else {
              return '被驳回';
            }
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
      editRow (val) {
        this.$router.push({ path: 'zj_service_info', query: { ID: val.ID,  sign: this.$route.query.sign} })
      },
      handleRecall (val) {
        zj_recall({TaskTabId: val.ID}).then(res => {
          if (res.data.type == 1) {
            this.fillTable()
          }
        })
      },
      handleDel (val) {
        zj_deletePlan({ids: val.ID}).then(res => {
          if (res.data.type == 1) { 
            this.fillTable()
          }
        })
      },
      taskSubmit () {
        this.editLoading = true
        this.$refs.addTaskForm.validate((valid) => {
          if (valid) {
              zj_createPlan({strMain: this.addTaskForm}).then(res => {
                if (res.data.type == 1) {
                  this.addFormVisible = false
                  this.editLoading = false
                  this.$refs['addTaskForm'].resetFields();
                  this.fillTable()
                }else {

                }
            })
          }
        })
      }
    },
    mounted () {
      if (this.$route.query.sign) {
          this.listLoading = true
          this.addTaskForm.taskID = this.$route.query.sign
          this.addTaskForm.CreatUser = sessionStorage.getItem('user')
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
    width: 30%;
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
