<template>
	<span class="tree-expand">
		<span>
			<span>{{DATA.name}}</span>
		</span>
		<span class="tree-btn" style='margin-left: 10px'>
			
		</span>
	</span>
</template>

<script>
	export default{
		name: 'treeExpand',
		props: ['NODE', 'DATA', 'STORE'],
		methods: {
			//<i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)"></i>
			//<i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"></i>
			//<i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)"></i>
			nodeAdd(s,d,n){//新增
				this.$emit('nodeAdd',s,d,n)
			},
			nodeEdit(s,d,n){//编辑
				this.$emit('nodeEdit',s,d,n)
			},
			nodeDel(s,d,n){//删除
				this.$emit('nodeDel',s,d,n)
			},
			nodeEditFocus(){
				//阻止点击节点的事件冒泡
			},
		},
		//mounted () {
			//console.log(this.STORE)
			//console.log(this.DATA)
		//}
	}
</script>

<style>
	.tree-expand{
		overflow:hidden;
	}
	.tree-expand .tree-label.tree-new{
		font-weight:600;
	}
	.tree-expand .tree-label{
		font-size:0.9em;
	}
	.tree-expand .tree-label .edit{
		width:80%;
	}
	.tree-expand .tree-btn{
		float:right;
		margin-right:20px;
	}
	.tree-expand .tree-btn i{
		color:#8492a6;
		font-size:0.9em;
		margin-right:3px;
	}
</style>