<template>
	<div>
	<el-button v-if='isShow' @click='doPrint' type='primary' style='margin: 10px;'><i class="el-icon-printer"></i>&nbsp&nbsp打印</el-button>
	<h2>{{titleData.TaskName}}</h2>
	<table border="1" cellpadding='0' cellspacing='0'>
		<template v-for='item in items'>
		  <tr style='background: #eee'>
		    <td style='width: 25%'>作业名称</th>
		    <td>{{item.ProjectName}}</th>
		    <td>作业内容</td>
		    <td>{{item.bContent}}</td>
		  </tr>
		  <tr>
		    <td>主要危害因素(通用)</td>
		    <td colspan='3'>{{item.CurrentHarm}}</td>
		  </tr>
		  <tr>  
		    <td>主要危害因素(专项)</td>
		    <td colspan='3'>{{item.SpecialHarm}}</td>
		  </tr>
		  <tr>  
		    <td>主要风险控制措施(通用)</td>
		    <td colspan='3'>{{item.CurrentRisk}}</td>
		  </tr>
		  <tr>  
		    <td>主要风险控制措施(专项)</td>
		    <td colspan='3'>{{item.SpecialRisk}}</td>
		  </tr>
		</template>
	</table>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				items: [],
				titleData: {},
				isShow: true
			}
		},
		methods: {
			doPrint () { 
			    this.isShow = false
		        setTimeout(() => {
		          window.print()
		          this.isShow = true
		        }, 1000)       	
			}			
		},
		mounted () {
			this.doPrint()
			if (this.$store.getters.getPrintData.strMain) {
				this.items = this.$store.getters.getPrintData.strSub
				this.titleData = this.$store.getters.getPrintData.strMain
			}else {
				this.$alert('因刷新页面请重新点击打印', '提示', {
		          confirmButtonText: '前往',
		          type: 'info'
		        }).then( () => {
		          history.back(-1)
		        })
			}
			this.items = this.$store.getters.getPrintData.strSub
			this.titleData = this.$store.getters.getPrintData.strMain
		}
	}
</script>
<style scoped>
	table {
		width: 90%;
		margin: 0 auto;
		margin-top: 15px;
		font-size: 17px;
    	text-indent: 10px;
    	background: white;
	}
	table td {
		padding: 5px;
	}
	h2 {
		text-align: center;
	}
</style>