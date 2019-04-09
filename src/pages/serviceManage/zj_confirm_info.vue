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
    <el-table-column width="100" label="直接作业方" align='center'>
      <template slot-scope="scope">
        <span>{{ scope.row.ConUnits }}</span>
      </template>
    </el-table-column>
    <el-table-column width="2000" label="控制时间节点" align='center'>
      <el-table-column width="400" label="作业计划" align='center'>
        <el-table-column width="200" label="项目任务下达时间" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.PlanDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="作业方上报时间" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.PlanReportDate }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column width="400" label="作业方案" align='center'>
        <el-table-column width="200" label="提交时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.SubmitDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.SubmitDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="交底时间" align='center'>
          <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.DetailsDate" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.DetailsDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="交底人" align='center'>
          <template slot-scope="scope">
            <el-input v-show="scope.row.edit" v-model="scope.row.Broker"></el-input>
            <span v-show="!scope.row.edit">{{ scope.row.Broker }}</span>
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
    </el-table-column>
  </el-table>
</div>
</template>
<script>
  import { subConfirm, unConfirmHeadInfo, ConfirmHeadInfo, subEdit } from '../../api/api';
  export default {
    data () {
     return {
      upLoadUrl: 'http://10.206.1.147:8017/api/OperationCheck/UploadFile',
      fileList: [],
      showUpload: true,
      params: {
        strMain: ''
      },
      isCreate: true,
      serviceData: {
        ProjectName: '',
        OverClass: '',
        ConUnits: '',
        Client: ''
      },
      listLoading: false,
      canEdit: true
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
      saveTable () {
        this.task_confirm_List.map((item) => {
          if (item.edit === true) {
            item.edit = false
          }
        })
        this.task_confirm_List[0].SchemeName = ''
        this.task_confirm_List[0].SchemeFilePath = ''
        if (this.fileList.length !== 0) {
          this.fileList.map(e => {
            this.task_confirm_List[0].SchemeName += (e.name + ';')
            this.task_confirm_List[0].SchemeFilePath += (e.url + ';')
          })
        }
        delete this.task_confirm_List[0].edit
        this.params.strMain = this.task_confirm_List[0]
        if (this.isCreate) {
          subConfirm(this.params).then(res => {
            if (res.data.type == 1) {
              this.$notify({
                 title: '确认成功',
                 type: 'success'
              });
              this.$router.push({ path: 'zj_confirm_base' })
            }else {
              this.$notify({
                 title: '确认失败，请重新确认',
                 type: 'error'
              });
            }
          })
        }else {
          eval('this.params.strMain.ID = this.params.strMain.CheckID')
          subEdit(this.params).then(res => {
            if (res.data.type == 1) {
              this.$notify({
                 title: '确认成功',
                 type: 'success'
              });
              this.$router.push({ path: 'zj_confirm_base' })
            }else {
              this.$notify({
                 title: '确认失败，请重新确认',
                 type: 'error'
              });
            }
          })
        }        
      }
    },
    computed: {
      task_confirm_List () {
        let newArr = this.$store.getters.getComfirmBody
        if (newArr.length != 0) {
          if (newArr[0].cState > 0) {
            newArr[0].edit = false
          }
        }
        return newArr
      }
    },
    mounted () {
      if (!this.$store.getters.getComfirmHead.TaskID) {
        this.$alert('请前往确认列表选择想要确认的任务', '提示', {
          confirmButtonText: '前往',
          type: 'info'
        }).then( () => {
          this.$router.push({ path: 'zj_confirm_base' })
        })  
      }else {
         this.$store.dispatch('createBody', { bodyList: { TaskID: '', ConUnits: this.$store.getters.getComfirmHead.ConUnits, ConUnitsId: this.$store.getters.getComfirmHead.ConUnitsId, PlanDate: '', PlanReportDate: '', SubmitDate: '', DetailsDate: '', ApplyDate: '', SceneDate: '', AffirmDate:'', ChangeDate:'', CheckDate:'', VerifyDate: '', CreateBy:'', edit: true}})

        this.task_confirm_List[0].TaskID = this.$store.getters.getComfirmHead.TaskID
        this.serviceData = Object.assign({}, this.$store.getters.getComfirmHead)
        if (this.$store.getters.getComfirmHead.state == -1) {
          unConfirmHeadInfo({ id: this.$store.getters.getComfirmHead.TaskID }).then(res => {
            let re = JSON.parse(res.data)[0]
            this.task_confirm_List[0].PlanDate = re.items.PlanDate.split('.')[0].replace('T', ' ')
            this.task_confirm_List[0].PlanReportDate = re.items.PlanReportDate.split('.')[0].replace('T', ' ')
          })
        }else {
          this.listLoading = true
          this.isCreate = false
          ConfirmHeadInfo({id: this.$store.getters.getComfirmHead.TaskID}).then(res => {
            if (res.data.rows.cState > 0) {
              this.canEdit = false
              this.showUpload = false
            }
            if (res.data.rows.SchemeFile) {
              this.fileList = res.data.rows.SchemeFile
            }
            this.$store.dispatch('createBody', { bodyList: res.data.rows })
            this.listLoading = false
          })
        } 
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
</style>
