<template>
	<div>
		<el-button @click.native="saveCom">确定</el-button>
		<el-input
			placeholder="输入关键字进行过滤" v-model="filterText">
		</el-input>
		<el-tree
			class="filter-tree"
			lazy
			:props="defaultProps"
			:load="loadNode"
			show-checkbox
			node-key="id"
			:filter-node-method="filterNode"
			:check-strictly = 'flag'
			@check-change="handleCheckChange"
			ref="tree">
		</el-tree>
	</div>
</template>
<script>
import { getDepList } from "../api/api";
export default {
  props: ["isStrictly", "checkSingle"],
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      isCheckCom: [],
      filterText: "",
      comPara: {
        pager: {
          rows: 9999,
          page: 1,
          sort: "",
          order: "DESC",
          totalRows: 0,
          totalPages: 0
        },
        queryStr: { cdepname: "", cdepcode: "", cupdepcode: "", DepLevel: "" }
      }
    };
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: "中国石化集团公司", id: 0, upId: 0 }]);
      } else if (node.level === 1) {
        this.comPara.queryStr.DepLevel = 0;
        this.fillTree(val => {
          resolve(val);
        });
      } else {
        this.comPara.queryStr.cupdepcode = node.data.id;
        this.fillTree(val => {
          resolve(val);
        });
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    fillTree(cb) {
      getDepList(this.comPara).then(res => {
        this.comPara.queryStr.DepLevel = "";
        const data = [];
        this.total = res.data.total;
        this.tableList = res.data.rows;
        this.listLoading = false;
        res.data.rows.map(e => {
          data.push({
            ID: e.ID,
            name: e.cdepname,
            id: e.cdepcode,
            upId: e.cupdepcode,
            cfulldepname: e.cfulldepname,
            cdepname: e.cdepname,
            cDepartmentTypeName: e.cDepartmentTypeName,
            children: []
          });
        });
        cb(data);
      });
    },
    handleCheckChange(data, checked, indeterminate) {
      if (this.flag) {
        if (checked) {
          this.isCheckCom[0] = data;
        }
        this.setCheckedNodes();
      }
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes(this.isCheckCom);
    },
    saveCom() {
      this.$emit("formCom", this.isCheckCom);
    }
  },
  computed: {
    flag() {
      let value = this.isStrictly;
      return value === "false" ? false : true;
    }
  }
};
</script>