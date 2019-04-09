<template>
	<section class='mainContent'>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="para.strQuery">
					<el-form-item>
						<el-input size="small" v-model="para.strQuery.Client" placeholder="委托单位"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input size="small" v-model="para.strQuery.OverClass" placeholder="检修类别"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input size="small" v-model="para.strQuery.ConUnits" placeholder="施工单位"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input size="small" v-model="para.strQuery.ProjectName" placeholder="检修项目"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size="small" type="primary" plain v-on:click="fillTable"><i class='el-icon-search'></i>&nbsp查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button size="small" type="primary" @click="handleAdd"><i class='el-icon-plus'></i>&nbsp新增</el-button>
					</el-form-item>
				</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="projectList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="ID" label="id" width="120" align='center' v-if='false'>
				</el-table-column>
				<el-table-column prop="ProjectName" label="检修项目名称" width="120" align='center'>
				</el-table-column>
				<el-table-column prop="OverClass" label="检修类别" width="100" align='center'>
				</el-table-column>
				<el-table-column prop="ConUnits" label="施工单位" width="150" align='center'>
				</el-table-column>
				<el-table-column prop="Site" label="设备位置" min-width="180" align='center'>
				</el-table-column>
				<el-table-column prop="Size" label="规格数量" min-width="180" align='center'>
				</el-table-column>
				<el-table-column prop="Client" label="委托单位" min-width="180" align='center'>
				</el-table-column>
        		<el-table-column prop="CreatTime" label="登记时间" min-width="180" align='center'>
				</el-table-column>
        		<el-table-column prop="AddUser" label="登记人" min-width="180" align='center'>
				</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
				<el-button type="danger" @click="batchRemove" :disabled="this.sels.length === 0">批量删除</el-button>
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
				</el-pagination>
		</el-col>

		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="true" width='60%'>
			<el-form :model="addForm" label-width="120px" ref="addForm" >
				<el-form-item label="施工单位" prop="strMain.ConUnitsId" class='inline_dom' :rules="{
					required: true, message: '不能为空', trigger: 'blur'
				}">
					<el-select v-model="addForm.strMain.ConUnitsId" placeholder="请选择施工单位"  @change='putName' filterable>
						<el-option
							v-for='opts in zjTpl'
							:key="opts.value"
							:label="opts.label"
							:value="opts.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="委托单位" prop="strMain.Client" class='inline_dom' :rules="{
					required: true, message: '不能为空', trigger: 'blur'
				}">
					<el-input v-model="addForm.strMain.Client" disabled style='width: 80%'></el-input>
					<el-button type="primary" plain size='mini' @click='comVisible = true' style='width: 18%;padding: 7px;'>···</el-button>
				</el-form-item>
				
				<el-form-item label="检修类别" prop="strMain.OverClass" class='inline_dom' :rules="{
					required: true, message: '不能为空', trigger: 'blur'
				}">
					<el-input v-model="addForm.strMain.OverClass" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备位置" prop="strMain.Site" class='inline_dom' :rules="{
					required: true, message: '不能为空', trigger: 'blur'
				}">
					<el-input v-model="addForm.strMain.Site" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="检修项目名称" prop="strMain.ProjectName" class='inline_dom' :rules="{
					required: true, message: '不能为空', trigger: 'blur'
				}">
					<el-input v-model="addForm.strMain.ProjectName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="规格数量" class='inline_dom'>
					<el-input-number v-model="addForm.strMain.Size" :min="1" size='samll'></el-input-number>
				</el-form-item>
				<div style='clear:both'></div>
				
				<el-form-item label="技术要求">
					<el-form label-position="left" inline style="border-top: 1px solid #eee;">
						<el-form-item label="主要危害因素(通用)" class="JSA_item">
							<el-input type='textarea' :rows="4" v-model="addForm.strMain.CurrentHarm"></el-input>
						</el-form-item>
						<el-form-item label="主要危害因素(专项)" class="JSA_item">
							<el-input type='textarea' :rows="4" v-model="addForm.strMain.SpecialHarm"></el-input>
						</el-form-item>
						<el-form-item label="主要风险控制措施(通用)" class="JSA_item">
							<el-input type='textarea' :rows="4" v-model="addForm.strMain.CurrentRisk"></el-input>
						</el-form-item>
						<el-form-item label="主要风险控制措施(专项)" class="JSA_item">
							<el-input type='textarea' :rows="4" v-model="addForm.strMain.SpecialRisk"></el-input>
						</el-form-item>
					</el-form> 
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="comVisible" :close-on-click-modal="true">
			<tree-tpl @formCom="formEvent" is-strictly = true></tree-tpl>
		</el-dialog>
	</section>
</template>

<script>
import { getListPage, addRow, deleteRow, getCompany } from "../../api/api";
import treeTpl from "@/component/treeTpl";
export default {
  data() {
    return {
      para: {
        strPager: {
          rows: 10,
          page: 1,
          sort: "CreatTime",
          order: "DESC",
          totalRows: 0,
          totalPages: 0
        },
        strQuery: {
          Client: "",
          OverClass: "",
          ConUnits: "",
          ProjectName: "",
          LoginCode: "",
          CheckState: 1
        }
      },
      zjpara: {
        pager: {
          rows: 9999,
          page: 1,
          sort: "Pubdate",
          order: "DESC",
          totalRows: 0,
          totalPages: 0
        },
        queryStr: ""
      },
      projectList: [],
      total: 0,
      comVisible: false,
      listLoading: false,
      sels: [], //列表选中列
      addForm: {
        strMain: {
          Client: "",
          AddRoleId: "",
          AddUserId: "",
          OverClass: "",
          ConUnits: "",
          Site: "",
          ProjectName: "",
          Size: "",
          ClientId: "",
          AddUser: "",
          CurrentHarm: '',
          SpecialHarm: '',
          CurrentRisk: '',
          SpecialRisk: '',
          ConUnitsId: ""
        },
        strSub: [{ target: "", amount: 0 }, { target: "", amount: 0 }],
        isMangeDep: false
      },
      addFormVisible: false,
      addLoading: false,
      zjTpl: []
    };
  },
  components: {
    treeTpl
  },
  methods: {
    handleCurrentChange(val) {
      this.para.strPager.page = val;
      this.fillTable();
    },
    formEvent(val) {
      if (val.length == 1) {
        if (val[0].name === "管理机关") {
          this.addForm.strMain.IsMangeDep = true;
        }
        this.addForm.strMain.Client = val[0].name;
        this.addForm.strMain.ClientId = val[0].ID;
      }
      this.comVisible = false;
    },
    fillTable() {
      this.listLoading = true;
      getListPage(this.para).then(res => {
        this.projectList = res.data.rows.map(e => {
          e.CreatTime = e.CreatTime.split(".")[0];
          e.CreatTime = e.CreatTime.replace("T", " ");
          return e;
        });
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    putName(val) {
      let obj = {};
      obj = this.zjTpl.find(item => {
        return item.value === val;
      });
      this.addForm.strMain.ConUnits = obj.label;
    },

    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
			this.addLoading = true;
			let para = Object.assign({}, this.addForm);
			para.strSub = JSON.stringify(para.strSub);
			//在require中新加了一些字段导致后台参数接收不正常报500错误，修改后台接口，或者将require中的对象转成字符传递（但是要拷贝到新的内存地址在做更改）
            addRow(para).then(res => {
              this.addLoading = false;
              if (res.data.type == 1) {
                this.$notify({
                  title: "成功",
                  message: "新建成功",
                  type: "success"
                });
              } else {
                this.$notify({
                  title: "失败",
                  message: "提交失败",
                  type: "success"
                });
              }
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.fillTable();
            });
          });
        }
      });
    },

    selsChange: function(sels) {
      this.sels = sels;
    },
    //删除
    batchRemove: function() {
      let user = sessionStorage.getItem("user");
      let hasOrther = this.sels.some(e => {
        return e.AddUser !== user;
      });
      if (hasOrther) {
        this.$alert("仅可删除该用户创建的数据", "选择本用户数据", {
          confirmButtonText: "确定"
        });
      } else {
        var ids = this.sels.map(item => item.ID).toString();
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.listLoading = true;
          let para = { ids: ids };
          deleteRow(para).then(res => {
            this.listLoading = false;
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.fillTable();
          });
        });
      }
    }
  },
  watch: {
    "para.strQuery.Client": function(val) {
      if (val === "") {
        this.fillTable();
      }
    }
  },
  mounted() {
    let infoArr = sessionStorage.getItem("only_sign").split(",");
    this.para.strQuery.LoginCode = infoArr[2];
    this.addForm.strMain.AddUser = sessionStorage.getItem("user");
    this.addForm.strMain.Client = infoArr[3];
    this.addForm.strMain.ClientId = infoArr[2];
    this.addForm.strMain.AddRoleId = infoArr[1];
    this.addForm.strMain.AddUserId = infoArr[0];
    this.fillTable();
    getCompany(this.zjpara).then(res => {
      res.data.rows.map(e => {
        this.zjTpl.push({
          value: e.Id,
          label: e.ContractorName
        });
      });
      this.listLoading = false;
    });
  }
};
</script>

<style scoped>
.inline_dom {
	width: 50%;
	float: left;
}
.JSA_item {
	width: 48%;
}
</style>
<style>
.JSA_item .el-form-item__content {
	width: 100% !important;
}
.JSA_item .el-form-item__label {
	color: #999;
}
</style>
