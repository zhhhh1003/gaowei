<template>
<div>
  <el-form :inline="true" :model="serviceData">
    <el-form-item label='项目名称：' align='right'>
      <el-input v-model="serviceData.ProjectName" v-if='this.$route.query.proName' disabled size='small'></el-input>
    </el-form-item>
    <el-form-item label='任务名称：' align='right'>
      <el-input size="small" v-model="serviceData.TaskName" :disabled = 'this.isDisable'></el-input>
    </el-form-item>
    <el-form-item label='装置/生产区域：' align='right'>
      <el-input size="small" v-model="serviceData.Area" :disabled = 'this.isDisable'></el-input>
    </el-form-item>
    <!-- <el-form-item label='水平范围：' align='right' prop='Rlevel'>
      <el-input size="small" v-model="serviceData.Rlevel" :disabled = 'this.isDisable'></el-input>
    </el-form-item> -->
    <el-form-item label='起始高度：' align='right' prop='Vertical'>
      <el-input size="small" v-model="serviceData.Vertical" :disabled = 'this.isDisable'></el-input>
    </el-form-item>
    <el-form-item label='结束高度:' align='right' prop='VerticalTwo'>
      <el-input size="small" v-model="serviceData.VerticalTwo" :disabled = 'this.isDisable'></el-input>
    </el-form-item>
    <el-form-item label='作业区域：' align='right' prop='Vertical'>
      <el-button size='small' type='primary' plain @click='editMap'><i class='el-icon-location-outline'></i>&nbsp&nbsp进入地图</el-button>
    </el-form-item>
    <el-form-item align='right'>
      <el-date-picker
         size="small"
         v-model="serviceData.BeginDate"
         type="datetime"
         placeholder="选择开始时间"
         align="center"
         value-format="yyyy-MM-dd HH:00:00"
         disabled>
       </el-date-picker>
    </el-form-item>
    <el-form-item align='right'>
      <el-date-picker
         size="small"
         v-model="serviceData.EndDate"
         type="datetime"
         placeholder="选择结束时间"
         align="center"
         value-format="yyyy-MM-dd HH:00:00"
         disabled>
       </el-date-picker>
    </el-form-item>
  </el-form>
  <el-button @click='saveTable' type="primary" size='small' v-if='!canSub' style='margin: 10px 0'>提交</el-button>
  <el-button @click='printTable' type="primary" size='small' v-if='canSub' style='margin: 10px 10px'>打印</el-button>
  <el-button @click='delRow' type="warning" size='small' :disabled='canDel' v-if='false'>删除</el-button>
  <el-table :data="taskList" highlight-current-row v-loading="listLoading" style="width: 100%" @selection-change="selsChange" height="400" border>
    <el-table-column type="selection" width="55" align='center'>
    </el-table-column>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="table-expand">
          <el-form-item label="主要危害因素(通用)">
            <el-input type='textarea' v-show="props.row.HSEedit" :rows="4" v-model="props.row.CurrentHarm"></el-input>
            <span v-show="!props.row.HSEedit">{{ props.row.CurrentHarm }}</span>
          </el-form-item>
          <el-form-item label="主要危害因素(专项)">
            <el-input type='textarea' v-show="props.row.HSEedit" :rows="4" v-model="props.row.SpecialHarm"></el-input>
            <span v-show="!props.row.HSEedit">{{ props.row.SpecialHarm }}</span>
          </el-form-item>
          <el-form-item label="主要风险控制措施(通用)">
            <el-input type='textarea' v-show="props.row.HSEedit" :rows="4" v-model="props.row.CurrentRisk"></el-input>
            <span v-show="!props.row.HSEedit">{{ props.row.CurrentRisk }}</span>
          </el-form-item>
          <el-form-item label="主要风险控制措施(专项)">
            <el-input type='textarea' v-show="props.row.HSEedit" :rows="4" v-model="props.row.SpecialRisk"></el-input>
            <span v-show="!props.row.HSEedit">{{ props.row.SpecialRisk }}</span>
          </el-form-item>
        </el-form> 
      </template>   
    </el-table-column>
    <el-table-column label="步骤" width="65" align='center'>
      <template slot-scope='scope'>
        <span>{{scope.row.Sort}}</span>
      </template>
    </el-table-column>
    <el-table-column width="150" label="作业项目/任务" align='center'>
      <template slot-scope="scope">
         <el-select v-show="scope.row.edit" v-model="scope.row.ProjectName" filterable placeholder="请选择作业"  @change='change'>
            <el-option
                v-for='opts in tplOpations'
                :key="opts.value"
                :label="opts.label"
                :value="opts.value">
            </el-option>
          </el-select>
        <span v-show="!scope.row.edit">{{ scope.row.ProjectName }}</span>
      </template>
    </el-table-column>
    <el-table-column width="200" label="作业内容" align='center'>
      <template slot-scope="scope">
        <el-input v-show="scope.row.edit" v-model="scope.row.bContent"></el-input>
         <span v-show="!scope.row.edit">{{ scope.row.bContent }}</span>
      </template>
    </el-table-column>
    <el-table-column width="70" label="作业类型" align='center' v-if='false'>
      <template slot-scope="scope">
        <el-input v-show="scope.row.edit" v-model="scope.row.Type"></el-input>
         <span v-show="!scope.row.edit">{{ scope.row.Type }}</span>
      </template> 
    </el-table-column>
    <el-table-column width="100" label="作业部位" align='center'>
      <template slot-scope="scope">
        <el-input v-show="scope.row.edit" v-model="scope.row.Site"></el-input>
        <span v-show="!scope.row.edit">{{ scope.row.Site }}</span>
      </template>
    </el-table-column>
    <el-table-column width="400" label="作业时间" align='center'>
      <el-table-column width="200" label="请求时间" align='center'>
        <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.Requesttime" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.Requesttime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" label="计划时间" align='center'>
        <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.Planningtime" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.Planningtime }}</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column width="80" label="HSE管理方" align='center'>
      <template slot-scope="scope">
          <el-input v-show="scope.row.HSEedit" v-model="scope.row.HSEParty"></el-input>
          <span v-show="!scope.row.HSEedit">{{ scope.row.HSEParty }}</span>
      </template>
    </el-table-column>
    <el-table-column width="150" label="高危作业种类" align='center'>
        <template slot-scope="scope">
          <span v-show="!scope.row.other_G && !scope.row.edit">{{ scope.row.operationType }}</span>
          <span v-if="scope.row.other_G && !scope.row.edit">{{ scope.row.OtherGaoW }}</span>
      </template>
    </el-table-column>
    <el-table-column width="500" label="许可作业" align='center'>
      <el-table-column width="200" label="种类" align='center'>
        <template slot-scope="scope">
          <span v-show="!scope.row.other_X && !scope.row.edit">{{ scope.row.WorkType }}</span>
          <span v-if="scope.row.other_X && !scope.row.edit">{{ scope.row.OtherXuK }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" label="有效期（天）" align='center'>
        <template slot-scope="scope">
          <span>{{ scope.row.WorkValidity }}</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column width="255" label="作业影响区域" align='center' v-if='false'>
      <el-table-column width="55" label="水平" align='center'></el-table-column>
      <el-table-column width="55" label="垂直" align='center'></el-table-column>
    </el-table-column>
    <el-table-column width="255" label="主要作业机具" align='center'></el-table-column>
  </el-table>
</div>
</template>
<script>
  import { getListPage, getTemplateList, getDetail, getTplInfo, zj_getDetail, zj_editPlan, zj_delDetail } from '../../api/api';
  export default {
    data () {
     return {
      para: {
        strPager: { rows: 9999, page: 1, sort: '', order: 'DESC', totalRows: 0, totalPages: 0 },
        strQuery: { Client: '', OverClass: '', ConUnits: '', ProjectName: '' }
      },
      existDel: false,
      canSub: false,
      createPara: {
        strMain: '',
        strSub: ''
      },
      isDisable: true,
      sels: [],
      serviceData: {
        tabID: '',
        taskID: '',
        OverClass: '',
        ConUnits: '',
        Client: '',
        Area: '',
        TaskName: '',
        CreatUser: '',
        BeginDate: '',
        EndDate: '',
        State: '3',
        // Rlevel: 0,
        Vertical: 0
      },
      listLoading: true,
      taskList: [
        {ProjectName: '', edit: false}
      ],
      tplOpations: [],
      //canChange: false
     }
    },
    methods: {
      editMap (val) {
        if (!this.serviceData.Vertical) {
          this.$alert('请填写作业范围', '提示', {
          confirmButtonText: '确定',
          type: 'info'
          }) 
          return 
        }
        this.$router.push({ path: '/sta/map', query: {proID: this.serviceData.taskID, ID: this.serviceData.tabID}})
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      delRow () { 
        this.listLoading = true
        let ids = []
        this.sels.map(e => {
          ids.push(e.ID)
        })
        if (this.existDel) {
          zj_delDetail({ids: ids.join()}).then(res => {
            this.fillTable()
          })
        }else {
          let existList = this.taskList.filter(e => {
            let flag = ids.some(v => {
              return v == e.ID
            })
            return !flag
          })
          this.taskList = this.formateSort(existList)
          this.listLoading = false
        } 
      },
      change (scope) {
          this.listLoading = true
          let obj = {}
          obj = this.tplOpations.find(item => {
            return item.value === val
          })
          getTplInfo({ id: obj.value }).then(res => {  
            res.data.rows.map( (e) => {
              let cloneNode = e
              cloneNode.edit = true
              cloneNode.ProjectName = obj.label
              this.taskList.push(cloneNode)
            })
            this.listLoading = false
          })
          this.taskList.shift()
      },
      formateSort (data) {
        let existName
        let nowIndex = 0
        data.map((e, index) => {
          if (existName != e.ProjectName) {
            nowIndex = -index
          }
          existName = e.ProjectName
          e.Sort = nowIndex + index + 1
        })
        return data
      },
      submitRow (cb) {
        this.listLoading = true
        this.taskList = this.taskList.filter((item, index) => {
          item.edit = false
          item.HSEedit = false
          eval('item.content = item.bContent')
          delete item.edit
          delete item.HSEedit
          return item.ProjectName && item.bContent
        })
        this.taskList = this.formateSort(this.taskList)
        cb()
      },
      saveTable () {
        let that = this
        this.submitRow(() => {
          that.createPara.strMain = that.serviceData
          that.createPara.strSub = that.taskList
          eval('that.createPara.strMain.ID = that.createPara.strMain.tabID')
          eval('that.createPara.strMain.State = 3')
          delete that.createPara.strMain.cState
          delete that.createPara.strMain.tabID
          delete that.createPara.strMain.CreatTime
          zj_editPlan(that.createPara).then(res => {
            if (res.data.type == 1) {
              this.listLoading = false
              this.canSub = true
              this.$router.push({ path: 'HSE_service_list',query: {sign:this.serviceData.taskID} })
            }else {
            }
          })
        })
      },
      printTable () {
        this.$store.dispatch('setPrintData', {data: {
          strMain: this.serviceData,
          strSub: this.taskList.map(e => {
            return {
              ProjectName: e.ProjectName,
              bContent: e.bContent,
              CurrentHarm: e.CurrentHarm,
              SpecialHarm: e.SpecialHarm,
              CurrentRisk: e.CurrentRisk,
              SpecialRisk: e.SpecialRisk
            }
          })
        }})
        this.$router.push({ path: '/printPage' })
      },
      fillTable () {
        zj_getDetail({id: this.$route.query.ID}).then(res => {
          let preName
          let preIndex = 0
          let resObj = JSON.parse(res.data)[0]
          if (resObj.title.cState == 3) {
            //this.canChange = true
            this.canSub = true
          }
          let proCreateBy = sessionStorage.getItem('proCreateBy')
          this.serviceData = resObj.title
          this.serviceData.ProjectName = this.$route.query.proName
          let newData = resObj.items.map((j, index) => {
            if (resObj.title.cState != 3) {
              eval(j.HSEedit = true)
            }else {
              eval(j.HSEedit = false)
            }
            eval(j.edit = false)
            if (j.operationType.split(' / ')[0] == '其他') {
                eval(j.other_G = true)
            }
            if (j.WorkType.split(' / ')[0] == '其他') {
                eval(j.other_X = true)
            }
            if (preName != j.ProjectName) {
              preIndex = -index
            }
            preName = j.ProjectName
            j.Sort = preIndex + index + 1
            return j
          })
          this.taskList = newData
          this.listLoading = false
        })
      }
    },
    computed: {
      canDel () {
        return this.sels.length == 0
      }
    },
    mounted () {
      getTemplateList({ strQuery: '' }).then((res) => {
         res.data.rows.map(e => {
           this.tplOpations.push({
              value: e.ID,
              label: e.RecordName
            })  
          });
      });
      if (this.$route.query.ID) {
        this.existDel = true
        this.fillTable()
      }else {
        this.$alert('前往列表页选择要审核的任务', '提示', {
          confirmButtonText: '前往',
          type: 'info'
          }).then( () => {
            this.$router.push({ path: 'HSE_service_base' })
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
  </style>
  <style>
  .table-expand label {
    width: 100%;
    color: #99a9bf;
  }
  .table-expand {
    font-size: 0;
    padding: 0;
    margin: 0;
    background: none!important;
    width: 1000px;
  }  
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 48%!important;
  }
  .table-expand .el-form-item__content {
    line-height: 20px;
    width: 90%;
  }
</style>
