<template>
<div>
  <el-form :inline="true" :model="serviceData" style='margin-bottom: 12px;'>
    <el-form-item label='项目名称'>
      <el-input size="small" v-model="serviceData.ProjectName" disabled></el-input>
    </el-form-item>
    <el-form-item label='检修类别'>
      <el-input size="small" v-model="serviceData.OverClass" disabled></el-input>
    </el-form-item>
    <el-form-item label='施工单位'>
      <el-input size="small" v-model="serviceData.ConUnits" disabled></el-input>
    </el-form-item>
    <el-form-item label='委托单位'>
      <el-input size="small" v-model="serviceData.Client" disabled></el-input>
    </el-form-item>
  </el-form>
  <el-button @click='saveTable' type="success" style='margin-bottom: 10px' v-if='canEdit' size='small'>完成确认</el-button>
  <el-table :data="task_confirm_List" highlight-current-row v-loading="listLoading" style="width: 100%;" border>
    <el-table-column width="200" label="直接作业方" align='center'>
      <template slot-scope="scope">
        <el-input v-show="scope.row.edit" v-model="scope.row.ConUnits"></el-input>
        <span v-show="!scope.row.edit">{{ scope.row.ConUnits }}</span>
      </template>
    </el-table-column>
    <el-table-column width="200" label="业务或专业管理方" align='center'>
      <template slot-scope="scope">
        <el-input v-show="scope.row.edit" v-model="scope.row.CheckClient"></el-input>
        <span v-show="!scope.row.edit">{{ scope.row.CheckClient }}</span>
      </template>
    </el-table-column>
    <el-table-column width="2000" label="控制时间节点" align='center'>
      <el-table-column width="400" label="作业计划" align='center'>
        <el-table-column width="200" label="项目任务下达时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.PlanDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.PlanDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="业务/专业管理方审批时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.auditDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.auditDate }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column width="400" label="作业方案" align='center'>
        <el-table-column width="200" label="批准时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.RatifyDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.RatifyDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="交底时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.DetailsDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.DetailsDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="交底人" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.Broker }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="方案文本" align='center'>
          <template slot-scope="scope">
            <div v-for='item in scope.row.SchemeFile'>
              <a :href='item.url' v-if='item.name' target='_blank'><i class='el-icon-document'></i>&nbsp&nbsp{{ item.name }}</a>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column width="1000" label="现场监督" align='center'>
        <el-table-column width="200" label="现场交底时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.SceneDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.SceneDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="现场交底人" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.SceneBroker }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="交底记录" align='center'>
          <template slot-scope="scope">
            <div v-for='item in scope.row.BottomRecordFile'>
              <a :href='item.url' v-if='item.name' target='_blank'><i class='el-icon-document'></i>&nbsp&nbsp{{ item.name }}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="200" label="现场确认时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.AffirmDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.AffirmDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="现场确认人" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.FieldConfirmation }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="现场确认单" align='center'>
          <template slot-scope="scope">
            <div v-for='item in scope.row.ConSheetFile'>
              <a :href='item.url' v-if='item.name' target='_blank'><i class='el-icon-document'></i>&nbsp&nbsp{{ item.name }}</a>
            </div>  
          </template>
        </el-table-column>
        <el-table-column width="200" label="现场变更时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.ChangeDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.ChangeDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="现场检查时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.CheckDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.CheckDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="现场检查人" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.FieldInspector }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="现场检查表" align='center'>
          <template slot-scope="scope">
            <div v-for='item in scope.row.FieldChecklistFile'>
              <a :href='item.url' v-if='item.name' target='_blank'><i class='el-icon-document'></i>&nbsp&nbsp{{ item.name }}</a>
            </div>  
          </template>
        </el-table-column>
        <el-table-column width="200" label="作业完成确认" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.VerifyDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.VerifyDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="作业确认人" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.JobConPerson }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="作业确认单" align='center'>
          <template slot-scope="scope">
            <div v-for='item in scope.row.AssignmentConFile'>
              <a :href='item.url' v-if='item.name' target='_blank'><i class='el-icon-document'></i>&nbsp&nbsp{{ item.name }}</a>
            </div>  
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column width="200" label="作业报备时间" align='center'>
        <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.ReportDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.ReportDate }}</span>
          </template>
      </el-table-column>
      <el-table-column width="100" label="报备人" align='center'>
          <template slot-scope="scope">
            <el-input v-show="scope.row.edit" v-model="scope.row.YeReporter"></el-input>
            <span v-show="!scope.row.edit">{{ scope.row.YeReporter }}</span>
          </template>
      </el-table-column>
      <el-table-column width="200" label="报备表" align='center'>
          <template slot-scope="scope">
            <el-upload
              name='Repath'
              accept='file'
              :action='upLoadUrl'
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success='onSuccess'
              :limit="1"
              multiple
              :on-exceed="handleExceed"
              :file-list="fileList"
              v-if='showUpload'>
              <el-button size="small" type="primary" :disabled='fileList.length != 0'>点击上传</el-button>
            </el-upload>
            <div v-for='item in scope.row.YeReportFormFilePath'>
              <a :href='item.url' v-if='!showUpload' target='_blank'><i class='el-icon-document' v-if='item.name'></i>&nbsp&nbsp{{ item.name }}</a>
            </div>
          </template>
      </el-table-column>    
    </el-table-column>
  </el-table>
</div>
</template>
<script>
  import { yewuConfirm, ConfirmHeadInfo } from '../../api/api';
  export default {
    data () {
     return {
      upLoadUrl: 'http://10.206.1.147:8017/api/OperationCheck/UploadFile',
      fileList: [],
      params: {
        strMain: ''
      },
      serviceData: {
        ProjectName: '',
        OverClass: '',
        ConUnits: '',
        Client: ''
      },
      listLoading: false,
      canEdit: true,
      showUpload: true
     }
    },
    methods: {
      onSuccess(response, file, fileList) {
        this.fileList.push({
          name: response.value ,
          url: 'http://10.206.1.147:8017' + response.message
        })
      },
      handleRemove(file, fileList) { 
        this.fileList = fileList
      },
      handlePreview(file) {
        window.open(file.url);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件`);
      },
      saveTable () {
        this.task_confirm_List.map((item) => {
          if (item.edit === true) {
            item.edit = false
          }
        })
        eval('this.task_confirm_List[0].ID = this.task_confirm_List[0].CheckID')
        eval('this.task_confirm_List[0].Client = this.task_confirm_List[0].CheckClient')
        this.task_confirm_List[0].cState = 2
        if (this.fileList.length !== 0) {
          this.task_confirm_List[0].YeReportFormName = this.fileList[0].name
          this.task_confirm_List[0].YeReportFormFilePath = this.fileList[0].url
        }else {
          this.task_confirm_List[0].YeReportFormName = ''
          this.task_confirm_List[0].YeReportFormFilePath = ''
        }
        delete this.task_confirm_List[0].CheckID
        delete this.task_confirm_List[0].edit
        this.params.strMain = this.task_confirm_List[0]
        yewuConfirm(this.params).then(res => {
          if (res.data.type == 1) {
            this.$notify({
               title: '确认成功',
               type: 'success'
            });
            this.$router.push({ path: 'yw_confirm_base' })
          }else {
            this.$notify({
               title: '确认失败，请重新确认',
               type: 'error'
            });
          }
        })
      }
    },
    computed: {
      task_confirm_List () {
        let newArr = this.$store.getters.getComfirmBody
        if (newArr.length != 0) {
          if (newArr[0].cState == 2) {
            newArr[0].edit = false
          }
        }
        return newArr
      } 
    },
    mounted () {
      if (!this.$route.query.sign) {
        this.$alert('请前往确认列表选择想要确认的任务', '提示', {
          confirmButtonText: '前往',
          type: 'info'
        }).then( () => {
          this.$router.push({ path: 'yw_confirm_base' })
        })  
      }else {
        this.listLoading = true
          ConfirmHeadInfo({ID: this.$route.query.sign}).then(res => {
            this.serviceData.ProjectName = res.data.rows.ProjectName
            this.serviceData.OverClass = res.data.rows.OverClass
            this.serviceData.ConUnits = res.data.rows.ConUnits
            this.serviceData.Client = res.data.rows.Client
            if (res.data.rows.YeReportFormFilePath) {
              this.fileList.push({
                name: res.data.rows.YeReportFormName,
                url: res.data.rows.YeReportFormFilePath
              })
            }
            if (res.data.rows.cState == 2) {
              this.canEdit = false
              this.showUpload = false
            }
            this.$store.dispatch('createBody', { bodyList: res.data.rows })
            this.listLoading = false
          })
      }
    }
  }
</script>
<style scoped>
  .el-form--inline .el-form-item {
    width: 45%;
    margin-bottom: 0;
    text-align: center;
  }
  .el-form--inline {
    background: white;
    border-radius: 6px;
    margin-top: 5px;
    padding: 10px 0;
  }
  a {
    color: #409EFF;
  }
</style>
