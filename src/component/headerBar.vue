<template>
<div>
	<el-row>
		<el-col :span="24" class="userinfo">
			<span class="el-dropdown-link userinfo-inner">{{sysUserName}}</span>
			<el-button type='primary' @click.native="editPwd" size='mini'>修改密码</el-button>
			<el-button type='primary' @click.native="logout" size='mini' style='margin-left: 0'>注销</el-button>
			<el-badge :value="undoneNum" :max="99" class="item" :hidden = 'undone'>
			  <el-button size="mini" type='primary' @click='enterPage'>待办事项</el-button>
			</el-badge>
		</el-col>
	</el-row>
	<el-dialog title="修改密码" :visible.sync="editFormVisible" :close-on-click-modal="true">
		<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" status-icon>
			<el-form-item label="用户名" prop="UserName">
				<el-input v-model="editForm.UserName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="Password">
				<el-input type="password" v-model="editForm.Password" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="repwd">
				<el-input type="password" v-model="editForm.repwd" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="editFormVisible = false">取消</el-button>
			<el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">确定</el-button>
		</div>
	</el-dialog>
</div>		
</template>

<script>
	import { editUserPwd, editSidePwd, zj_getPlanList, zj_TaskReject, readyConfirm } from '../api/api';
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入密码'));
		        } else {
		          if (this.editForm.repwd !== '') {
		            this.$refs.editForm.validateField('repwd');
		          }
		          callback();
		        }
		      };
			var validatePass2 = (rule, value, callback) => {
			       if (value === '') {
			         callback(new Error('请再次输入密码'));
			       } else if (value !== this.editForm.Password) {
			         callback(new Error('两次输入密码不一致!'));
			       } else {
			         callback();
			       }
			};
			return {
				sysUserName: '',
				editForm: {
					ID: '',
					UserName: '',
					Password: '',
					repwd: ''
				},
				editFormVisible: false,
				editLoading: false,
				editFormRules: {
		          Password: [
		            { validator: validatePass, trigger: 'blur' }
		          ],
		          repwd: [
		            { validator: validatePass2, trigger: 'blur' }
		          ],
		          UserName: [
		            { required: true, message: '请输入姓名', trigger: 'blur' }
		          ]
		        },
		        isInner: true,
		        undoneNum: 0,
		        para: {
		          strPager: { rows: 10, page: 1, sort: 'CreatTime', order: 'DESC', totalRows: 0, totalPages: 0 },
		          strQuery: { Client: '', OverClass: '', ConUnits: '', ProjectName: '', Status: '', LoginCode: '', ThisRoleId: '' },
		        },
		        para_zj: {
		          strPager: { rows: 10, page: 1, sort: 'CreatTime', order: 'DESC', totalRows: 0, totalPages: 0 },
		          ConUnitsId: ''
		        },
		        para_comf: {
		          pager: { rows: 10, page: 1, sort: 'CreatTime', order: 'DESC', totalRows: 0, totalPages: 0 },
		          RoleId: '',
		          ConUnitsId: ''
		        },
			}
		},
		methods: {
			logout: function () {
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
				    //清除菜单权限
				    this.$root.hashMenus = {};
				    this.$router.replace({path: '/login'});
				}).catch(() => {

				});
			},
			editPwd () {
				this.editFormVisible = true
			},
			editSubmit (formName) {
				let flag = sessionStorage.getItem('userType')
				this.$refs[formName].validate((valid) => {
						if (valid) {
							this.editLoading = true;
							delete this.editForm.repwd
							let para = Object.assign({}, this.editForm);
							if (flag == 'inner') {
								editUserPwd(para).then((res) => {
									this.editLoading = false;
									if (res.data.type == 1) {
										this.$router.push('/login');
									}else {
										this.$notify({
											title: '失败',
											message: res.data.message,
											type: 'error'
										});
										this.editFormVisible = false;
										this.$refs['editForm'].resetFields();
									}	
								});
							}else {
								editSidePwd(para).then((res) => {
									this.editLoading = false;
									if (res.data.type == 1) {
										this.$router.push('/login');
									}else {
										this.$notify({
											title: '失败',
											message: res.data.message,
											type: 'error'
										});
										this.editFormVisible = false;
										this.$refs['editForm'].resetFields();
									}	
								});
							}
							
						}
				});
			},
			enterPage () {
				this.$router.push('/baseInfo/readyDone')
			},
			fetchDate () {
				readyConfirm(this.para_comf).then(res => {
					if (this.isInner) {
						zj_getPlanList(this.para).then((data) => {
			        		this.undoneNum = res.data.total + data.data.total
			    		});
					}else {
						zj_TaskReject(this.para_zj).then(data => {
							this.undoneNum = res.data.total + data.data.total
						})
					}
				})
			}
		},
		watch: {
	     "$route": "fetchDate"
	    },
	    computed: {
	    	undone () {
	    		if (this.undoneNum == 0) {
	    			return true
	    		}else {
	    			return false
	    		}
	    	}
	    },
		mounted() {
			var user = sessionStorage.getItem('user');
			var userType = sessionStorage.getItem('userType');
			let infoArr = sessionStorage.getItem('only_sign').split(',')
			this.para.strQuery.ThisRoleId = infoArr[1]
			this.para_comf.RoleId = infoArr[1]
			this.para.strQuery.LoginCode = infoArr[2]
			if (user) {
				this.sysUserName = user || '';
				this.editForm.UserName = user || ''
			}
			if (userType != 'inner') {
				this.isInner = false
				this.para_zj.ConUnitsId = sessionStorage.getItem('only_sign').split(',')[2]
			}else {
				switch (infoArr[1]) {
			      case '2018012314291847410306e57fe58cf':
			        this.para.strQuery.Status = 1;
			        break;
		     	  case '20180123142756983168484001a045f':
			        this.para.strQuery.Status = 0;
			        break;
			      case '20180123142744369986107507bb4e5':
			        this.para.strQuery.Status = 2;
			        break;
			      default:
			      	this.para.strQuery.Status = 6;
			    }
			}
		    this.fetchDate();
			this.editForm.ID = sessionStorage.getItem('only_sign').split(',')[4]
		}
	}

</script>

<style scoped lang="scss">
			.userinfo {
				text-align: right;
				padding-right: 35px;
        float: right;
				.userinfo-inner {
					color: black;
					cursor: pointer;
					height: 60px;
    			line-height: 60px;
    			    margin-right: 10px;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
</style>
