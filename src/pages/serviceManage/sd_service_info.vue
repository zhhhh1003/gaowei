<template>
<div v-loading="listLoading" element-loading-text="处理数据中...">
  <el-form :inline="true" :model="serviceData">
    <el-form-item label='项目名称：' align='right'>
      <el-input v-model="serviceData.ProjectName" disabled size='small'></el-input>
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
         :disabled = 'this.isDisable'
         value-format="yyyy-MM-dd HH:00:00">
       </el-date-picker>
    </el-form-item>
    <el-form-item align='right'>
      <el-date-picker
         size="small"
         v-model="serviceData.EndDate"
         type="datetime"
         placeholder="选择结束时间"
         align="center"
         :disabled = 'this.isDisable'
         value-format="yyyy-MM-dd HH:00:00">
       </el-date-picker>
    </el-form-item>
  </el-form>
  <el-button @click='saveTable' type="primary" size='small' v-if='!canSub' style='margin: 10px 0;'>提交</el-button>
  <el-button @click='printTable' type="primary" size='small' v-if='canSub' style='margin: 10px 10px;'>打印</el-button>
  <el-button @click='delRow' type="warning" size='small' :disabled='canDel' v-if='!canSub'>删除</el-button>
  <el-button @click='GetAcross' size='small' type="primary">解决交叉作业</el-button>
  <el-table :data="taskList" highlight-current-row height='390' @selection-change="selsChange" border>
    <el-table-column type="selection" width="55" align='center'>
    </el-table-column>
    <el-table-column label="步骤" width="65" align='center'>
      <template slot-scope='scope'>
        <span>{{scope.row.Sort}}</span>
      </template>
    </el-table-column>
    <el-table-column width="150" label="作业项目/任务" align='center'>
     <template slot-scope="scope">
         <el-select v-show="scope.row.edit" v-model="scope.row.ProjectName" filterable placeholder="请选择作业"  @change='change' clearable :disabled='isDisable'>
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
    <el-table-column width="400" label="属地管理方" align='center'>
      <el-table-column width="150" label="单位" align='center' v-if='false'>
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" v-model="scope.row.BelongsUnit"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.BelongsUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" label="作业负责人" align='center'>
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" v-model="scope.row.BelongsChargePerson"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.BelongsChargePerson }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="监护人" align='center'>
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" v-model="scope.row.BelongsGuardian"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.BelongsGuardian }}</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column width="150" label="项目管理方" align='center' v-if='false'>
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" v-model="scope.row.ProjectManager"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.ProjectManager }}</span>
        </template>
    </el-table-column>
    <el-table-column width="500" label="主要危害因素" align='center'>
      <el-table-column width="250" label="通用" align='center'>
        <template slot-scope='scope'>
          <el-input type="textarea" :rows="4" :disabled="!scope.row.edit" v-model="scope.row.CurrentHarm"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="250" label="专项" align='center'>
        <template slot-scope='scope'>
          <el-input type="textarea" :rows="4" :disabled="!scope.row.edit" v-model="scope.row.SpecialHarm"></el-input>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column width="500" label="主要风险控制措施" align='center'>
      <el-table-column width="250" label="通用" align='center'>
        <template slot-scope="scope">
          <el-input type="textarea" :rows="4" :disabled="!scope.row.edit" v-model="scope.row.CurrentRisk"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="250" label="专项" align='center'>
        <template slot-scope="scope">
          <el-input type="textarea" :rows="4" :disabled="!scope.row.edit" v-model="scope.row.SpecialRisk"></el-input>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column width="450" label="高危作业种类" align='center'>
      <template slot-scope="scope">
          <el-cascader
            clearable
            placeholder="选择种类和级别"
            :options="DangerOptions"
            change-on-select
            v-if="scope.row.edit"
            @change='optChange_G(scope.row)'
            v-model='scope.row.operationType'
          ></el-cascader>
          <el-input v-if="scope.row.other_G  && scope.row.edit" v-model="scope.row.OtherGaoW" style='width: 40%;'></el-input>
          <span v-if="!scope.row.other_G && !scope.row.edit">{{ scope.row.operationType }}</span>
          <span v-if="scope.row.other_G && !scope.row.edit">{{ scope.row.OtherGaoW }}</span>
        </template>
    </el-table-column>
    <el-table-column width="700" label="许可作业" align='center'>
      <el-table-column width="450" label="种类 / 级别" align='center'>
        <template slot-scope="scope">
          <el-cascader
            placeholder="选择种类和级别"
            :options="PermitOptions"
            change-on-select
            v-if="scope.row.edit"
            @change='optChange_X(scope.row)'
            v-model='scope.row.WorkType'
          ></el-cascader>
          <el-input v-if="scope.row.other_X && scope.row.edit" v-model="scope.row.OtherXuK" style='width: 40%;'></el-input>
          <span v-if="!scope.row.other_X && !scope.row.edit">{{ scope.row.WorkType }}</span>
          <span v-if="scope.row.other_X && !scope.row.edit">{{ scope.row.OtherXuK }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" label="有效期（天）" align='center'>
        <template slot-scope="scope">
             <el-input-number v-model="scope.row.WorkValidity" controls-position="right" :min="1" size='small' v-show="scope.row.edit"></el-input-number>
            <span v-show="!scope.row.edit">{{ scope.row.WorkValidity }}</span>
          </template>
      </el-table-column>
    </el-table-column>
    <el-table-column width="255" label="作业影响区域" align='center' v-if='false'>
      <el-table-column width="55" label="水平" align='center'>
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" v-model="scope.row.Horizontal"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.Horizontal }}</span>
        </template>
      </el-table-column>
      <el-table-column width="55" label="垂直" align='center'>
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" v-model="scope.row.Vertical"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.Vertical }}</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column width="255" label="主要作业机具" align='center'>
      <template slot-scope="scope">
          <el-input v-show="scope.row.edit" v-model="scope.row.Implement"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.Implement }}</span>
        </template>
    </el-table-column>
  </el-table>

  <el-dialog title="交叉作业解决方案" :visible.sync="AcrossHow" :close-on-click-modal="false">
      <el-form label-width="80px">
        <el-row>
          <el-col :span='24'>
          <el-form-item label="方案文本">
              <el-input type="textarea" v-model='across_E_para.text'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
            <el-button @click.native="AcrossHow = false">取消</el-button>
            <el-button type="primary" @click.native="SubAcross">提交</el-button>
      </div>
  </el-dialog>
</div>
</template>
<script>
  import { getTemplateList, getDetail, getTplInfo, zj_getDetail, zj_editPlan, zj_delDetail, getPermitList, subPermit, across_C, across_E, across_D} from '../../api/api';
  export default {
    data () {
     return {
      AcrossHow: false,
      existDel: false,
      PermitOptions: [],
      DangerOptions: [],
      canSub: false,
      PermitPara: {
        type: ''
      },
      createPara: {
        strMain: '',
        strSub: ''
      },
      isDisable: true,
      sels: [],
      serviceData: {
        tabID: '',
        TaskID: '',
        OverClass: '',
        ConUnits: '',
        Client: '',
        Area: '',
        TaskName: '',
        CreatUser: '',
        BeginDate: '',
        EndDate: '',
        State: '1',
        // Rlevel: 0,
        Vertical: 0
      },
      listLoading: true,
      taskList: [
        {ProjectName: '', edit: false}
      ],
      tplOpations: [],
      PermitList: [],
      across_E_para: {
        iD: '',
        taskID: this.$route.query.ID,
        text: ''
      }
     }
    },
    methods: {
      GetAcross () {
        this.AcrossHow = true;
        across_D({id: this.$route.query.ID}).then(res => {
          if (res.data.ID) {
            this.across_E_para.iD = res.data.ID
            this.across_E_para.text = res.data.Text
          }
        })
      },
      SubAcross() {
        across_E({strMain:this.across_E_para}).then(res => {
          if (res.data.type === 1) {
            this.AcrossHow = false;
          }
        })
      },
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
      optChange_G (val) {
        if (val.operationType[0] == '其他') {
          eval(val.other_G = true)
        }else {
          eval(val.other_G = false)
        }
      },
      optChange_X (val) {
        if (val.WorkType[0] == '其他') {
          eval(val.other_X = true)
        }else {
          eval(val.other_X = false)
        }
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
      change (val) {
        if (val) {
          this.listLoading = true
          let obj = {}
          obj = this.tplOpations.find(item => {
            return item.value === val
          })
          getTplInfo({ id: obj.value }).then(res => {   
            res.data.rows.map( (e) => {
              let cloneNode = e
              cloneNode.edit = true
              cloneNode.WorkType = []
              cloneNode.operationType = []
              cloneNode.ProjectName = obj.label
              this.taskList.push(cloneNode)
            })
            this.listLoading = false
          })
          this.taskList.shift()
        }  
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
          if (item.WorkType.length == 1) {
              this.PermitList.push({
                TaskId: this.serviceData.taskID,
                NameOne: item.WorkType[0],
                NameTwo: ''
              })
              item.WorkType = item.WorkType[0] + ' / 无'
          }else if (item.WorkType.length == 2) {
              this.PermitList.push({
                TaskId: this.serviceData.taskID,
                NameOne: item.WorkType[0],
                NameTwo: item.WorkType[1]
              })
              item.WorkType = item.WorkType[0] + ' / ' + item.WorkType[1]
          }else if (item.WorkType.length == 0) {
              this.PermitList.push({
                TaskId: this.serviceData.taskID,
                NameOne: '',
                NameTwo: ''
              })
              item.WorkType = ''
          }
          if (item.operationType.length == 1) {
              item.operationType = item.operationType[0] + ' / 无'
          }else if (item.operationType.length == 2) {
              item.operationType = item.operationType[0] + ' / ' + item.operationType[1]
          }else if (item.operationType.length == 0) {
              item.operationType = ''
          }
          item.edit = false
          eval('item.content = item.bContent')
          delete item.edit
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
          eval('that.createPara.strMain.State = 1')
          delete that.createPara.strMain.cState
          delete that.createPara.strMain.tabID
          delete that.createPara.strMain.CreatTime
          if (that.$route.query.ID) {
            zj_editPlan(that.createPara).then(res => {
              if (res.data.type == 1) {
                subPermit({data: that.PermitList}).then(res => {
                  if (res.data.type == 1) {
                    that.listLoading = false
                    that.canSub = true
                    this.$router.push({ path: 'sd_service_list',query: {sign:this.serviceData.taskID} })
                  }
                })
              }else {}
            })
          }else {
            alert('系统错误，请重新登录')
          }
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
          if (resObj.title.cState != 0) {
            this.canSub = true
          }
          this.serviceData = resObj.title
          this.serviceData.ProjectName = this.$route.query.proName
          let newData = resObj.items.map((j, index) => {
            if (resObj.title.cState != 0) {
              eval(j.edit = false)
              if (j.operationType.split(' / ')[0] == '其他') {
                eval(j.other_G = true)
              }
              if (j.WorkType.split(' / ')[0] == '其他') {
                eval(j.other_X = true)
              }
            }else{
              if (j.WorkType) {
                j.WorkType = j.WorkType.split(' / ')
                if (j.WorkType[0] == '其他') {
                  eval(j.other_X = true)
                }
              }else {
                j.WorkType = []
              }
              if (j.operationType) {
                j.operationType = j.operationType.split(' / ')
                if (j.operationType[0] == '其他') {
                  eval(j.other_G = true)
                }
              }else {
                j.operationType = []
              }
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
      getPermitList(this.PermitPara).then(res => {
        res.data.rows.map(e => {
           let newObj = {
            children: []
           }
           newObj.value = e.Name
           newObj.label = e.Name
           if (e.Children) {
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
           } 
           if (e.ExeOne == 0) {
            this.PermitOptions.push(newObj)
           }else {
            this.DangerOptions.push(newObj)
           }
        });
      })
      if (this.$route.query.ID) {
        this.existDel = true
        this.fillTable()
      }else {
        this.$alert('前往列表页选择要审核的任务', '提示', {
          confirmButtonText: '前往',
          type: 'info'
          }).then( () => {
            this.$router.push({ path: 'sd_service_base' })
          })
      }
    }  
  }
</script>
<style scoped>
  .el-form--inline .el-form-item {
    width: 32%;
    margin-right: 0;
    margin-bottom: 0;
  }
  .el-form--inline {
    background: white;
    border-radius: 6px;
    margin-top: 5px;
    padding: 10px 0;
  }
</style>
