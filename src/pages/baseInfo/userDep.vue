<template>
<el-row style='background: white;padding: 10px'>
  <el-col :span='4'>		
	<el-select filterable placeholder="请选择用户" v-model="userID">
	    <el-option
	      v-for='opts in tplOpations'
	      :key="opts.value"
	      :label="opts.label"
	      :value="opts.value">
	     </el-option>
	</el-select>
  </el-col>	
  <el-col :span='20'>
	<tree-tpl @formCom="formEvent" is-strictly = true check-single = false></tree-tpl>
  </el-col>	
  <el-button type="primary" @click="submit">提交</el-button>
</el-row>	
</template>

<script>
	import { getUserListPage, getUserDep, createUser2Dep, delUserDep } from '../../api/api';
	import treeTpl from '@/component/treeTpl'
	export default {
		 data() {
	      return {
	      	userPara: {
				pager: { rows: 9999, page: 1, sort: 'LastDate', order: 'DESC', totalRows: 0, totalPages: 0 },
				queryStr: '',
			},
			user2depPara: {
	          pager: { rows: 9999, page: 1, sort: '', order: 'DESC', totalRows: 0, totalPages: 0 },
	          queryStr: {UserCode: '', UserName: '', cdepname: '', cdepcode: ''}
	        },
	        tplOpations: [],
	        userID: '',
	        strMain: {}
	      };
	    },
	    components: {
			treeTpl
		},
	    methods: {
	      formEvent (id, name) {
	        	if (!this.isEditRow) {
	        		this.addForm.CompanyID = id
		       		this.addForm.CompanyName = name
	        	}else {
	        		this.editForm.CompanyID = id
		       		this.editForm.CompanyName = name
	        	}
	        	this.comVisible = false 	
	       },
	      submit () {
	      	createUser2Dep({strMain: JSON.stringify(this.checkBox)}).then(res => {

	      	})
	      }
	    },
	    mounted () {
	    	getUserListPage(this.userPara).then(res => {
				res.data.rows.map( e => {
					if (e.State == 0) {
						this.tplOpations.push({
							value: e.ID,
							label: e.UserName
						})					
					}
					
				})
			})
			getUserDep(this.user2depPara).then(res => {

			})
	    }
	}
</script>
