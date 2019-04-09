<template>
<div v-loading="listLoading" element-loading-text="处理数据中...">
  <el-form :inline="true" :model="serviceData" :rules="FormRules" ref="Form">
    <el-form-item label='项目名称：' align='right'>
      <el-input v-model="serviceData.ProjectName" disabled size='small'></el-input>
    </el-form-item>
    <el-form-item label='检修类别：' align='right'>
      <el-input size="small" v-model="serviceData.OverClass" disabled></el-input>
    </el-form-item>
    <el-form-item label='任务名称：' align='right' prop='TaskName'>
      <el-input size="small" v-model="serviceData.TaskName" :disabled = 'this.isDisable'></el-input>
    </el-form-item>
    <el-form-item label='装置/生产区域：' align='right' prop='Area'>
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
    <el-form-item align='right' prop='BeginDate'>
      <el-date-picker
         size="small"
         v-model="serviceData.BeginDate"
         type="datetime"
         placeholder="选择开始时间"
         :disabled = 'this.isDisable'
         value-format="yyyy-MM-dd HH:00:00">
       </el-date-picker>
    </el-form-item>
    <el-form-item align='right' prop='EndDate'>
      <el-date-picker
         size="small"
         v-model="serviceData.EndDate"
         type="datetime"
         placeholder="选择结束时间"
         :disabled = 'this.isDisable'
         align="center"
         value-format="yyyy-MM-dd HH:00:00">
       </el-date-picker>
    </el-form-item>
  </el-form>
  <el-button @click='addRow' type="primary" size='small' style='margin: 10px 0;' v-if='!canSub'>添加作业</el-button>
  <el-button @click='addRowVisible = true' type="primary" size='small' v-if='hasCon && !canSub'>添加内容</el-button>
  <el-button @click='commitTable' type="primary" size='small' v-if='!canSub'>提交</el-button>
  <el-button @click='printTable' type="primary" size='small' v-if='canSub' style='margin: 10px 0;'>打印</el-button>
  <el-button @click='delRow' type="warning" size='small' :disabled='canDel' v-if='!isDisable'>删除</el-button>
  <el-button size='small' type='primary' plain @click='editMap'><i class='el-icon-location-outline'></i>&nbsp&nbsp进入地图</el-button>
  <el-table :data="taskList" highlight-current-row style="width: 100%" height='390' @selection-change="selsChange" border>
    <el-table-column type="selection" width="55" align='center'>
    </el-table-column>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="table-expand">
          <el-form-item label="主要危害因素(通用)">
            <el-input type='textarea' v-show="props.row.edit" :rows="4" v-model="props.row.CurrentHarm"></el-input>
            <span v-show="!props.row.edit">{{ props.row.CurrentHarm }}</span>
          </el-form-item>
          <el-form-item label="主要危害因素(专项)">
            <el-input type='textarea' v-show="props.row.edit" :rows="4" v-model="props.row.SpecialHarm"></el-input>
            <span v-show="!props.row.edit">{{ props.row.SpecialHarm }}</span>
          </el-form-item>
          <el-form-item label="主要风险控制措施(通用)">
            <el-input type='textarea' v-show="props.row.edit" :rows="4" v-model="props.row.CurrentRisk"></el-input>
            <span v-show="!props.row.edit">{{ props.row.CurrentRisk }}</span>
          </el-form-item>
          <el-form-item label="主要风险控制措施(专项)">
            <el-input type='textarea' v-show="props.row.edit" :rows="4" v-model="props.row.SpecialRisk"></el-input>
            <span v-show="!props.row.edit">{{ props.row.SpecialRisk }}</span>
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
         <el-select v-show="scope.row.edit" v-model="scope.row.ProjectName" filterable placeholder="请选择作业" @change='change' clearable :disabled='isDisable'>
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
    <el-table-column width="200" label="作业时间" align='center'>
      <el-table-column width="200" label="请求时间" align='center'>
        <template slot-scope="scope">
            <el-date-picker type="datetime" placeholder="选择时间" v-show="scope.row.edit" v-model="scope.row.Requesttime" style="width: 100%;" value-format="yyyy-MM-dd HH:00:00"></el-date-picker>
            <span v-show="!scope.row.edit">{{ scope.row.Requesttime }}</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column width="310" label="直接作业方" align='center'>
      <el-table-column width="70" label="单位" align='center' v-if='false'>
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" v-model="scope.row.WorkUnit"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.WorkUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="作业负责人" align='center'>
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" v-model="scope.row.WorkChargePerson"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.WorkChargePerson }}</span>
        </template>
      </el-table-column>
      <el-table-column width="70" label="监护人" align='center'>
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" v-model="scope.row.WorkGuardian"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.WorkGuardian }}</span>
        </template>
      </el-table-column>
      <el-table-column width="70" label="作业人" align='center'>
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" v-model="scope.row.WorkOperator"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.WorkOperator }}</span>
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
    <el-table-column width="450" label="许可作业" align='center'>
        <template slot-scope="scope">
          <el-cascader
            clearable
            placeholder="选择种类和级别"
            :options="PermitOptions"
            change-on-select
            @change='optChange_X(scope.row)'
            v-if="scope.row.edit"
            v-model='scope.row.WorkType'
          ></el-cascader>
          <el-input v-if="scope.row.other_X && scope.row.edit" v-model="scope.row.OtherXuK" style='width: 40%;'></el-input>
          <span v-if="!scope.row.other_X && !scope.row.edit">{{ scope.row.WorkType }}</span>
          <span v-if="scope.row.other_X && !scope.row.edit">{{ scope.row.OtherXuK }}</span>
        </template>
    </el-table-column>
    <el-table-column width="180" label="有效期（天）" align='center'>
        <template slot-scope="scope">
            <el-input-number v-model="scope.row.WorkValidity" controls-position="right" :min="1" size='small'  v-show="scope.row.edit"></el-input-number>
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

  <el-dialog title="新增内容" :visible.sync="addRowVisible" :close-on-click-modal="true">
    <el-form :model="addRowForm" label-width="120px" :rules="editRowRules" ref="addRowForm">
      <el-form-item label="作业名称" prop='name'>
        <el-select style='width: 93%;' v-model="addRowForm.name" placeholder="作业名称" @change='findName'>
            <el-option
                v-for='opts in taskOpations'
                :key="opts.value"
                :label="opts.label"
                :value="opts.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-col :span='12'>
      <el-form-item label="内容添加位置" prop='index'>
        <el-input-number v-model="addRowForm.index" controls-position="right" :min="1"></el-input-number>
      </el-form-item>
      </el-col>
      <el-col :span='12'>
      <el-form-item label="添加数量" prop='number'>
        <el-input-number v-model="addRowForm.number" controls-position="right" :min="1"></el-input-number>
      </el-form-item>
      </el-col>
      <el-button type="primary" @click.native="subRowMsg" size='small' style='float: right'>完成</el-button>
      <div style='clear: both'></div>
    </el-form>
  </el-dialog>

  <el-popover
    placement="right"
    width="500"
    trigger="click"
    class='JSApop'
    v-if='JSAshow'>
    <el-form label-position="left" inline style="border-top: 1px solid #eee;">
						<el-form-item label="主要危害因素(通用)" class="JSA_item" style="width: 48%">
							<el-input type='textarea' :rows="4" v-model="JSAtmp.CurrentHarm"></el-input>
						</el-form-item>
						<el-form-item label="主要危害因素(专项)" class="JSA_item" style="width: 48%">
							<el-input type='textarea' :rows="4" v-model="JSAtmp.SpecialHarm"></el-input>
						</el-form-item>
						<el-form-item label="主要风险控制措施(通用)" class="JSA_item" style="width: 48%">
							<el-input type='textarea' :rows="4" v-model="JSAtmp.CurrentRisk"></el-input>
						</el-form-item>
						<el-form-item label="主要风险控制措施(专项)" class="JSA_item" style="width: 48%">
							<el-input type='textarea' :rows="4" v-model="JSAtmp.SpecialRisk"></el-input>
						</el-form-item>
		</el-form> 
    <el-button slot="reference" size='small'  type='primary'>JSA样板</el-button>
  </el-popover>
</div>
</template>
<script>
import {
  getTemplateList,
  getDetail,
  getTplInfo,
  zj_createPlan,
  zj_getDetail,
  zj_editPlan,
  zj_delDetail,
  getPermitList,
  subPermit,
  addArea
} from "../../api/api";
export default {
  data() {
    return {
      JSAtmp: {
        CurrentHarm: '无',
        SpecialHarm: '无',
        CurrentRisk: '无',
        SpecialRisk: '无'
      },
      PermitOptions: [],
      DangerOptions: [],
      PermitPara: {
        type: ""
      },
      addMapPara: {
        TabId: "",
        Lng: "",
        Lat: "",
        IsOverlapping: "否",
        TabIds: ""
      },
      editRowRules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        index: [{ required: true, message: "请输入", trigger: "blur" }],
        number: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      existDel: false,
      canSub: false,
      hasCon: false,
      addRowVisible: false,
      addRowForm: {
        name: "",
        index: "",
        number: ""
      },
      createPara: {
        strMain: "",
        strSub: ""
      },
      isDisable: true,
      sels: [],
      serviceData: {
        tabID: "",
        taskID: "",
        ProjectName: "",
        OverClass: "",
        ConUnits: "",
        Client: "",
        Area: "",
        TaskName: "",
        CreatUser: "",
        BeginDate: "",
        EndDate: "",
        State: "0",
        cState: -1,
        //Rlevel: 0,
        Vertical: 0,
        VerticalTwo: 0
      },
      preBeginDate: "",
      preEndDate: "",
      listLoading: false,
      taskList: [{ ProjectName: "", edit: true }],
      tplOpations: [],
      taskOpations: [],
      isDisable: false,
      FormRules: {
        TaskName: [{ required: true, message: "请输入任务", trigger: "blur" }],
        Area: [{ required: true, message: "请输入区域", trigger: "blur" }],
        // Rlevel: [{ required: true, message: "请输入", trigger: "blur" }],
        Vertical: [{ required: true, message: "请输入", trigger: "blur" }],
        BeginDate: [{ required: true, message: "请选择", trigger: "blur" }],
        EndDate: [{ required: true, message: "请选择", trigger: "blur" }],
        VerticalTwo: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      PermitList: [],
      JSAshow: false
    };
  },
  methods: {
    compareDate(startDate, endDate) {
      if (startDate == endDate) {
        return "same";
      } else {
        return (
          new Date(startDate.replace(/-/g, "/")) >
          new Date(endDate.replace(/-/g, "/"))
        );
      }
    },
    editMap(val) {
      let nowDate = new Date(+new Date() + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      if (
        // !this.serviceData.Rlevel ||
        !this.serviceData.Vertical ||
        !this.serviceData.VerticalTwo
      ) {
        this.$alert("请填写作业范围", "提示", {
          confirmButtonText: "确定",
          type: "info"
        });
        return;
      }
      if (this.serviceData.cState < 0) {
        //点击地图状态保持不变
        this.serviceData.State = this.serviceData.cState;
        this.submitRow(() => {
          this.saveTable(() => {
            this.listLoading = false;
            // let comDate = this.compareDate(
            //   nowDate,
            //   this.serviceData.EndDate.replace("T", " ")
            // );
            // if (comDate) {
            //   this.$confirm("作业结束,只能查看地图", "提示", {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消",
            //     type: "info"
            //   }).then(() => {
            //     this.$router.push({
            //       path: "/sta/map",
            //       query: {
            //         proID: this.serviceData.taskID,
            //         ID: this.serviceData.tabID
            //       }
            //     });
            //   });
            // } else {
              //判断是否更新了时间
              //if (this.addMapPara.IsOverlapping == 1) {
              //let dateChange_B = this.compareDate(this.preBeginDate, this.serviceData.BeginDate.replace('T', ' ')).toString()
              //let dateChange_E = this.compareDate(this.preEndDate, this.serviceData.EndDate.replace('T', ' ')).toString()
              //if (dateChange_B !== 'same' || dateChange_E !== 'same') {
              //addArea(this.addMapPara)
              //}
              //}
              this.$router.push({
                path: "/sta/map",
                query: {
                  proID: this.serviceData.taskID,
                  ID: this.serviceData.tabID,
                  // Rlevel: this.serviceData.Rlevel,
                  Vertical: this.serviceData.Vertical,
                  VerticalTwo: this.serviceData.VerticalTwo
                }
              });
            // }
          });
        });
      } else {
        this.$router.push({
          path: "/sta/map",
          query: { proID: this.serviceData.taskID, ID: this.serviceData.tabID }
        });
      }
    },
    optChange_G(val) {
      if (val.operationType[0] == "其他") {
        eval((val.other_G = true));
      } else {
        eval((val.other_G = false));
      }
    },
    optChange_X(val) {
      if (val.WorkType[0] == "其他") {
        eval((val.other_X = true));
      } else {
        eval((val.other_X = false));
      }
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    delRow() {
      this.listLoading = true;
      let ids = [];
      this.sels.map(e => {
        ids.push(e.ID);
      });
      if (this.existDel) {
        zj_delDetail({ ids: ids.join() }).then(res => {
          this.fillTable();
        });
      } else {
        let existList = this.taskList.filter(e => {
          let flag = ids.some(v => {
            return v == e.ID;
          });
          return !flag;
        });
        this.taskList = this.formateSort(existList);
        this.listLoading = false;
      }
    },
    subRowMsg() {
      this.$refs.addRowForm.validate(valid => {
        if (valid) {
          this.addRowVisible = false;
          let index = this.taskList.findIndex(e => {
            return e.ProjectName == this.addRowForm.name;
          });
          this.taskList.map((e, i) => {
            if (e.ProjectName == this.addRowForm.name) {
              if (e.Sort >= this.addRowForm.index) {
                e.Sort = parseInt(e.Sort) + parseInt(this.addRowForm.number);
              }
            }
          });
          for (let j = 0; j < this.addRowForm.number; j++) {
            this.taskList.splice(index + this.addRowForm.index + j - 1, 0, {
              ProjectName: this.addRowForm.name,
              Sort: this.addRowForm.index + j,
              edit: true,
              RecordID: this.addRowForm.RecordID,
              WorkType: [],
              operationType: []
            });
          }
        }
      });
    },
    findName(val) {
      let obj = {};
      obj = this.taskOpations.find(item => {
        return item.value === val;
      });
      this.addRowForm.name = obj.label;
      this.addRowForm.RecordID = val;
    },
    change(val) {
      if (val) {
        this.listLoading = true;
        let obj = {};
        obj = this.tplOpations.find(item => {
          return item.value === val;
        });
        let canPush = this.taskOpations.some(c => {
          return c.value == obj.value;
        });
        if (!canPush) {
          this.taskOpations.push(obj);
        }
        getTplInfo({ id: obj.value }).then(res => {
          this.listLoading = false;
          this.hasCon = true;
          res.data.rows.map(e => {
            let cloneNode = e;
            cloneNode.edit = true;
            cloneNode.ProjectName = obj.label;
            cloneNode.WorkType = [];
            cloneNode.operationType = [];
            this.taskList.push(cloneNode);
          });
        });
        this.taskList.shift();
      }
    },
    addRow() {
      this.taskList.unshift({ ProjectName: "", edit: true });
    },
    formateSort(data) {
      let existName;
      let nowIndex = 0;
      data.map((e, index) => {
        if (existName != e.ProjectName) {
          nowIndex = -index;
        }
        existName = e.ProjectName;
        e.Sort = nowIndex + index + 1;
      });
      return data;
    },
    submitRow(cb) {
      this.listLoading = true;
      this.taskList = this.taskList.filter((item, index) => {
        if (!cb) {
          item.edit = false;
        }
        eval("item.content = item.bContent");
        return item.ProjectName && item.bContent;
      });
      this.taskList = this.formateSort(this.taskList);
      this.listLoading = false;
      this.canSub = true;
      if (cb) {
        cb();
      }
    },
    commitTable() {
      this.serviceData.State = 0;
      this.submitRow(() => {
        this.saveTable();
      });
    },
    saveTable(cb) {
      this.createPara.strMain = this.serviceData;
      this.createPara.strSub = this.taskList.map((item, index) => {
        if (item.WorkType.length == 1) {
          this.PermitList.push({
            TaskId: this.serviceData.taskID,
            NameOne: item.WorkType[0],
            NameTwo: ""
          });
          item.WorkType = item.WorkType[0] + " / 无";
        } else if (item.WorkType.length == 2) {
          this.PermitList.push({
            TaskId: this.serviceData.taskID,
            NameOne: item.WorkType[0],
            NameTwo: item.WorkType[1]
          });
          item.WorkType = item.WorkType[0] + " / " + item.WorkType[1];
        } else if (item.WorkType.length == 0) {
          this.PermitList.push({
            TaskId: this.serviceData.taskID,
            NameOne: "",
            NameTwo: ""
          });
          item.WorkType = "";
        }
        if (item.operationType.length == 1) {
          item.operationType = item.operationType[0] + " / 无";
        } else if (item.operationType.length == 2) {
          item.operationType =
            item.operationType[0] + " / " + item.operationType[1];
        } else if (item.operationType.length == 0) {
          item.operationType = "";
        }
        return item;
      });
      eval("this.createPara.strMain.ID = this.createPara.strMain.tabID");
      delete this.createPara.strMain.CreatTime;
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.listLoading = true;
          zj_editPlan(this.createPara).then(res => {
            if (res.data.type == 1) {
              subPermit({ data: this.PermitList }).then(res => {
                if (res.data.type == 1) {
                  if (cb) {
                    cb();
                  } else {
                    this.$router.push({
                      path: "zj_service_list",
                      query: { sign: this.serviceData.taskID }
                    });
                  }
                }
              });
            } else {
            }
          });
        }
      });
    },
    printTable() {
      this.$store.dispatch("setPrintData", {
        data: {
          strMain: this.serviceData,
          strSub: this.taskList.map(e => {
            return {
              ProjectName: e.ProjectName,
              bContent: e.bContent,
              CurrentHarm: e.CurrentHarm,
              SpecialHarm: e.SpecialHarm,
              CurrentRisk: e.CurrentRisk,
              SpecialRisk: e.SpecialRisk
            };
          })
        }
      });
      this.$router.push({ path: "/printPage" });
    },
    fillTable() {
      zj_getDetail({ id: this.$route.query.ID }).then(res => {
        let preName;
        let preIndex = 0;
        let resData = JSON.parse(res.data)[0];
        this.serviceData = resData.title;
        this.hasCon = resData.items.length !== 0;
        if (resData.title.cState > -2) {
          if (resData.title.cState > -1) {
            this.canSub = true;
            this.isDisable = true;
          }
          this.existDel = true;
        }
        if (resData.items.length !== 0) {
          let newData = resData.items.map((j, index) => {
            if (resData.title.cState > -1) {
              eval((j.edit = false));
              if (j.operationType.split(" / ")[0] == "其他") {
                eval((j.other_G = true));
              }
              if (j.WorkType.split(" / ")[0] == "其他") {
                eval((j.other_X = true));
              }
            } else {
              if (j.WorkType) {
                j.WorkType = j.WorkType.split(" / ");
                if (j.WorkType[0] == "其他") {
                  eval((j.other_X = true));
                }
              } else {
                j.WorkType = [];
              }
              if (j.operationType) {
                j.operationType = j.operationType.split(" / ");
                if (j.operationType[0] == "其他") {
                  eval((j.other_G = true));
                }
              } else {
                j.operationType = [];
              }
            }
            if (preName != j.ProjectName) {
              preIndex = -index;
            }
            preName = j.ProjectName;
            j.Sort = preIndex + index + 1;
            let newObj = this.tplOpations.filter(e => {
              return e.label == j.ProjectName;
            });
            const canPush = this.taskOpations.some(c => {
              return c.value == newObj[0].value;
            });
            if (!canPush) {
              this.taskOpations.push(newObj[0]);
            }
            return j;
          });
          this.taskList = newData;
        } else {
          if (resData.title.cState > -1) {
            this.taskList[0].edit = false;
          }
        }
        this.listLoading = false;
        this.$confirm('是否提示JSA分析', '提示', {
          confirmButtonText: '提示',
          cancelButtonText: '取消',
        }).then(() => {
          //在这里为JSAtmp赋就行，把data属性里面JSAtmp对象里的值清空
          getDetail({ id: this.$route.query.sign }).then(res => {
            let resData = JSON.parse(res.data)[0];
            this.serviceData = resData.title;
            this.JSAtmp.CurrentHarm = resData.title.CurrentHarm
            this.JSAtmp.SpecialHarm = resData.title.SpecialHarm
            this.JSAtmp.CurrentRisk = resData.title.CurrentRisk
            this.JSAtmp.SpecialRisk = resData.title.SpecialRisk
            this.JSAshow = true
          })  
        })
      });
    }
  },
  computed: {
    canDel() {
      return this.sels.length == 0;
    }
  },
  mounted() {
    this.listLoading = true;
    getTemplateList({ strQuery: "" }).then(res => {
      res.data.rows.map(e => {
        this.tplOpations.push({
          value: e.ID,
          label: e.RecordName
        });
      });
    });
    getPermitList(this.PermitPara).then(res => {
      res.data.rows.map(e => {
        let newObj = {
          children: []
        };
        newObj.value = e.Name;
        newObj.label = e.Name;
        if (e.Children.length != 0) {
          e.Children.map(j => {
            newObj.children.push({
              label: j.Name,
              value: j.Name
            });
          });
        } else {
          delete newObj.children;
        }
        if (e.ExeOne == 0) {
          this.PermitOptions.push(newObj);
        } else {
          this.DangerOptions.push(newObj);
        }
      });
    });
    this.fillTable();
    //if (this.$route.query.ID) {

    //}else {
    //this.serviceData.CreatUser = sessionStorage.getItem('user')
    //getDetail({ id: this.$route.query.proID }).then((res) => {
    //this.serviceData.taskID = JSON.parse(res.data)[0].title.ID
    //this.serviceData.ProjectName = JSON.parse(res.data)[0].title.ProjectName
    //this.serviceData.OverClass = JSON.parse(res.data)[0].title.OverClass
    //this.serviceData.ConUnits = JSON.parse(res.data)[0].title.ConUnits
    //this.serviceData.Client = JSON.parse(res.data)[0].title.Client
    //});
    //}
  }
};
</script>
<style scoped>
.el-form--inline .el-form-item {
  width: 30%;
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
<style>
.table-expand label {
  width: 100%;
  color: #99a9bf;
}
.table-expand {
  font-size: 0;
  padding: 0;
  margin: 0;
  background: none !important;
  width: 1000px;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 48% !important;
}
.table-expand .el-form-item__content {
  line-height: 20px;
  width: 90%;
}
.JSApop {
  position: fixed;
  top: 220px;
  right: 10px;
}

</style>