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
  <el-table :data="task_confirm_List" highlight-current-row v-loading="listLoading" style="width: 100%;" height='400' border>
    <el-table-column width="100" label="直接作业方" align='center'>
      <template slot-scope="scope">
        <span>{{ scope.row.ConUnits }}</span>
      </template>
    </el-table-column>
    <el-table-column width="100" label="属地管理方" align='center'>
      <template slot-scope="scope">
        <span>{{ scope.row.Client }}</span>
      </template>
    </el-table-column>
    <el-table-column width="2400" label="控制时间节点" align='center'>
      <el-table-column width="400" label="作业计划" align='center'>
        <el-table-column width="200" label="项目任务下达时间" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.PlanDate }}</span>
          </template>  
        </el-table-column>
        <el-table-column width="200" label="属地管理方审批时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.ShuDiAuditDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.ShuDiAuditDate }}</span>
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
            <span>{{ scope.row.DetailsDate }}</span>
          </template> 
        </el-table-column>
        <el-table-column width="100" label="交底人" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.Broker }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="方案文本" align='center'>
          <template slot-scope="scope">
            <el-upload
              name='Repath'
              accept='file'
              :action='upLoadUrl'
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success='onSuccess'
              multiple
              :file-list="fileList"
              v-if='showUpload'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div v-for='item in scope.row.SchemeFile'>
              <a :href='item.url' v-if='!showUpload' target='_blank'><i class='el-icon-document' v-if='item.name'></i>&nbsp&nbsp{{ item.name }}</a>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column width="400" label="作业许可" align='center'>
        <el-table-column width="200" label="作业票批准时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.ApplyApproveDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.ApplyApproveDate }}</span>
          </template>  
        </el-table-column>
        <el-table-column width="200" label="作业票封闭时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.ApplyCloseDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.ApplyCloseDate }}</span>
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
            <el-input v-show="scope.row.edit" v-model="scope.row.SceneBroker"></el-input>
            <span v-show="!scope.row.edit">{{ scope.row.SceneBroker }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="交底记录" align='center'>
          <template slot-scope="scope">
            <el-upload
              name='Repath'
              accept='file'
              :action='upLoadUrl'
              :on-preview="handlePreview"
              :on-remove="handleRemove1"
              :on-success='onSuccess1'
              multiple
              :file-list="fileList1"
              v-if='showUpload'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div v-for='item in scope.row.BottomRecordFile'>
              <a :href='item.url' v-if='!showUpload' target='_blank'><i class='el-icon-document' v-if='item.name'></i>&nbsp&nbsp{{ item.name }}</a>
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
            <el-input v-show="scope.row.edit" v-model="scope.row.FieldConfirmation"></el-input>
            <span v-show="!scope.row.edit">{{ scope.row.FieldConfirmation }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="现场确认单" align='center'>
          <template slot-scope="scope">
            <el-upload
              name='Repath'
              accept='file'
              :action='upLoadUrl'
              :on-preview="handlePreview"
              :on-remove="handleRemove2"
              :on-success='onSuccess2'
              multiple
              :file-list="fileList2"
              v-if='showUpload'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div v-for='item in scope.row.ConSheetFile'>
             <a :href='item.url' v-if='!showUpload' target='_blank'><i class='el-icon-document' v-if='item.name'></i>&nbsp&nbsp{{ item.name }}</a>
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
            <el-input v-show="scope.row.edit" v-model="scope.row.FieldInspector"></el-input>
            <span v-show="!scope.row.edit">{{ scope.row.FieldInspector }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="现场检查表" align='center'>
          <template slot-scope="scope">
            <el-upload
              name='Repath'
              accept='file'
              :action='upLoadUrl'
              :on-preview="handlePreview"
              :on-remove="handleRemove3"
              :on-success='onSuccess3'
              multiple
              :file-list="fileList3"
              v-if='showUpload'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div v-for='item in scope.row.FieldChecklistFile'>
              <a :href='item.url' v-if='!showUpload' target='_blank'><i class='el-icon-document' v-if='item.name'></i>&nbsp&nbsp{{ item.name }}</a>
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
            <el-input v-show="scope.row.edit" v-model="scope.row.JobConPerson"></el-input>
            <span v-show="!scope.row.edit">{{ scope.row.JobConPerson }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="作业确认单" align='center'>
          <template slot-scope="scope">
            <el-upload
              name='Repath'
              accept='file'
              :action='upLoadUrl'
              :on-preview="handlePreview"
              :on-remove="handleRemove4"
              :on-success='onSuccess4'
              multiple
              :file-list="fileList4"
              v-if='showUpload'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div v-for='item in scope.row.AssignmentConFile'>
              <a :href='item.url' v-if='!showUpload' target='_blank'><i class='el-icon-document' v-if='item.name'></i>&nbsp&nbsp{{ item.name }}</a>
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
    </el-table-column>
    <el-table-column width="100" label="报备人" align='center'>
          <template slot-scope="scope">
            <el-input v-show="scope.row.edit" v-model="scope.row.ShuReporter"></el-input>
            <span v-show="!scope.row.edit">{{ scope.row.ShuReporter }}</span>
          </template>
    </el-table-column>
    <el-table-column width="200" label="报备表" align='center'>
          <template slot-scope="scope">
            <el-upload
              name='Repath'
              accept='file'
              :action='upLoadUrl'
              :on-preview="handlePreview"
              :on-remove="handleRemove5"
              :on-success='onSuccess5'
              multiple
              :file-list="fileList5"
              v-if='showUpload'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div v-for='item in scope.row.ShuReportFormFile'>
              <a :href='item.url' v-if='!showUpload' target='_blank'><i class='el-icon-document' v-if='item.name'></i>&nbsp&nbsp{{ item.name }}</a>
            </div>
          </template>
    </el-table-column>
  </el-table>
</div>
</template>
<script>
  import { shudiConfirm, ConfirmHeadInfo } from '../../api/api';
  export default {
    data () {
     return {
      upLoadUrl: 'http://10.206.1.147:8017/api/OperationCheck/UploadFile',
      fileList: [],
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileList5: [],
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
        console.log(this.fileList)
      },
      handleRemove(file, fileList) { 
        this.fileList = fileList
      },
      onSuccess1(response, file, fileList) {
        this.fileList1.push({
          name: response.value ,
          url: 'http://10.206.1.147:8017' + response.message
        })
      },
      handleRemove1(file, fileList) { 
        this.fileList1 = fileList
      },
      onSuccess2(response, file, fileList) {
        this.fileList2.push({
          name: response.value,
          url: 'http://10.206.1.147:8017' + response.message
        })
      },
      handleRemove2(file, fileList) { 
        this.fileList2 = fileList
      },
      onSuccess3(response, file, fileList) {
        this.fileList3.push({
          name: response.value ,
          url: 'http://10.206.1.147:8017' + response.message
        })
      },
      handleRemove3(file, fileList) { 
        this.fileList3 = fileList
      },
      onSuccess4(response, file, fileList) {
        this.fileList4.push({
          name: response.value ,
          url: 'http://10.206.1.147:8017' + response.message
        })
      },
      handleRemove4(file, fileList) { 
        this.fileList4 = fileList
      },
      onSuccess5(response, file, fileList) {
        this.fileList5.push({
          name: response.value ,
          url: 'http://10.206.1.147:8017' + response.message
        })
      },
      handleRemove5(file, fileList) { 
        this.fileList5 = fileList
      },
      handlePreview(file) {
        window.open(file.url);
      },
      saveTable () {
        this.task_confirm_List.map((item) => {
          if (item.edit === true) {
            item.edit = false
          }
        })
        eval('this.task_confirm_List[0].ID = this.task_confirm_List[0].CheckID')
        eval('this.task_confirm_List[0].Client = this.task_confirm_List[0].CheckClient')
        this.task_confirm_List[0].cState = 1
        this.task_confirm_List[0].SchemeName = ''
        this.task_confirm_List[0].SchemeFilePath = ''
        this.task_confirm_List[0].BottomRecordName = ''
        this.task_confirm_List[0].BottomRecordFilePath = ''
        this.task_confirm_List[0].ConSheetName = ''
        this.task_confirm_List[0].ConSheetFilePath = ''
        this.task_confirm_List[0].FieldChecklistName = ''
        this.task_confirm_List[0].FieldChecklistFilePath = ''
        this.task_confirm_List[0].AssignmentConName = ''
        this.task_confirm_List[0].AssignmentConFilePath = ''
        this.task_confirm_List[0].ShuReportFormName = ''
        this.task_confirm_List[0].ShuReportFormFilePath = ''  
        if (this.fileList.length !== 0) {
          this.fileList.map(e => {
            this.task_confirm_List[0].SchemeName += (e.name + ';')
            this.task_confirm_List[0].SchemeFilePath += (e.url + ';')
          })
        }
        if (this.fileList1.length !== 0) {
          this.fileList1.map(e => {
            this.task_confirm_List[0].BottomRecordName += (e.name + ';')
            this.task_confirm_List[0].BottomRecordFilePath += (e.url + ';')
          })
        }
        if (this.fileList2.length !== 0) {
          this.fileList2.map(e => {
            this.task_confirm_List[0].ConSheetName += (e.name + ';')
            this.task_confirm_List[0].ConSheetFilePath += (e.url + ';')
          })
        }
        if (this.fileList3.length !== 0) {
          this.fileList3.map(e => {
            this.task_confirm_List[0].FieldChecklistName += (e.name + ';')
            this.task_confirm_List[0].FieldChecklistFilePath += (e.url + ';')
          })
        }
        if (this.fileList4.length !== 0) {
          this.fileList4.map(e => {
            this.task_confirm_List[0].AssignmentConName += (e.name + ';')
            this.task_confirm_List[0].AssignmentConFilePath += (e.url + ';')
          })
        }
        if (this.fileList5.length !== 0) {
          this.fileList5.map(e => {
            this.task_confirm_List[0].ShuReportFormName += (e.name + ';')
            this.task_confirm_List[0].ShuReportFormFilePath += (e.url + ';')
          })
        }

        delete this.task_confirm_List[0].CheckID
        delete this.task_confirm_List[0].edit
        this.params.strMain = this.task_confirm_List[0]
        shudiConfirm(this.params).then(res => {
          if (res.data.type == 1) {
            this.$notify({
               title: '确认成功',
               type: 'success'
            });
            this.$router.push({ path: 'sd_confirm_base' })
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
            this.$router.push({ path: 'sd_confirm_base' })
          })  
        }else {
          this.listLoading = true
          ConfirmHeadInfo({ID: this.$route.query.sign}).then(res => {
            this.serviceData.ProjectName = res.data.rows.ProjectName
            this.serviceData.OverClass = res.data.rows.OverClass
            this.serviceData.ConUnits = res.data.rows.ConUnits
            this.serviceData.Client = res.data.rows.Client
            if (res.data.rows.cState == 2) {
              this.canEdit = false
              this.showUpload = false
            }
            if (res.data.rows.SchemeFile) {
              this.fileList = res.data.rows.SchemeFile
            }
            if (res.data.rows.BottomRecordFile) {
              this.fileList1 = res.data.rows.BottomRecordFile
            }
            if (res.data.rows.ConSheetFile) {
              this.fileList2 = res.data.rows.ConSheetFile
            }
            if (res.data.rows.FieldChecklistFile) {
              this.fileList3 = res.data.rows.FieldChecklistFile
            }
            if (res.data.rows.AssignmentConFile) {
              this.fileList4 = res.data.rows.AssignmentConFile
            }
            if (res.data.rows.ShuReportFormFile) {
              this.fileList5 = res.data.rows.ShuReportFormFile
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
