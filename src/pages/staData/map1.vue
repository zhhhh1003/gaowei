<template>
	<div v-loading="listLoading">
		<div id="map" style="width: 100%; height: 90vh"></div>
		<div class='map-info' v-if='!this.$route.query.proID'>
		    <el-date-picker
		        type="datetime"
		        v-model='getAreaAll_para.BeginDate'
		        value-format='yyyy-MM-dd HH:00:00'
		        size='small'
		        placeholder="选择开始时间">
		    </el-date-picker>
		    <el-date-picker
		        type="datetime"
		        v-model='getAreaAll_para.EndDate'
		        value-format='yyyy-MM-dd HH:00:00'
		        size='small'
		        placeholder="选择结束时间">
		    </el-date-picker>
		    <el-button @click='search' size='small' type='primary'>查询</el-button>
		</div>
		<el-button @click='$router.back(-1)' size='small' type='primary' class='backBtn'><i class='el-icon-back'></i>&nbsp&nbsp返回</el-button>
	</div>
</template>
<script>
import { addArea, getArea, getAreaAll, IsVertical } from '../../api/api'
export default {
	data () {
		return {
			overlays: [],
			styleOptions: {
		        strokeColor: "#409EFF",    //边线颜色。
		        fillColor: "#409EFF",      //填充颜色。当参数为空时，圆形将没有填充效果。
		        strokeWeight: 1,       //边线的宽度，以像素为单位。
		        strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
		        fillOpacity: 0.4,      //填充的透明度，取值范围0 - 1。
		        strokeStyle: 'solid' //边线的样式，solid或dashed。
		    },
		    map: '',
		    addPara: {
		    	TabId: '',
		    	Lng: '',
		    	Lat: '',
		    	IsOverlapping: '否',
		    	TabIds: ''
		    },
		    windowOpts: {
		    	width: 300,
		    	height: 120,
		    },
		    getArea_para: {
		    	tabID: ''
		    },
		    getAreaAll_para: {
		    	LoginCode: '',
		    	BeginDate: '',
		    	EndDate: ''
		    },
		    //ProjectName: '',
		    listLoading: false,
		    overlapping: []
		}
	},
	methods: {
			centerPoint (e) {
				if (this.$route.query.Rlevel) {
				 	this.$confirm('确定在此点创建吗？', '提示', {}).then(() => {
				 		this.overlapping = []
				 		this.addPara.TabIds = ''
				 		this.addPara.IsOverlapping = '否'
						var cp = new BMap.Point(e.point.lng, e.point.lat);
						this.addPara.Lng = e.point.lng;
				    	this.addPara.Lat = e.point.lat;
				    	this.addPara.TabId = this.$route.query.ID;
				    	//比较距离
				    	if (this.overlays.length > 0) {
				            for (let j = 0; j < this.overlays.length; j++) {
				            	if (this.overlays[j].ID != this.$route.query.ID) {
				            		if (BMapLib.GeoUtils.getDistance(this.overlays[j].getCenter(), cp) < (this.overlays[j].getRadius() + parseInt(this.$route.query.Rlevel))) {
										this.overlapping.push(this.overlays[j].ID)
										this.addPara.IsOverlapping = '是'
										this.addPara.TabIds = this.overlapping.toString()
					                }
				            	}
				            }
				        }
			        	addArea(this.addPara).then(res => {
			        		IsVertical({TabId:this.addPara.TabId,TabIds: this.addPara.TabIds}).then(res => {
			        			if (res.data.type == 1) {
			        			
			        			}
			        		})
			        		this.listLoading = true
			        		this.map.clearOverlays();
						    getArea(this.getArea_para).then(res => {
						    	this.overlays = []
								JSON.parse(res.data).forEach(i => {
									if (i.Lat && i.Lng) {
										this.fillArea(i.Lng, i.Lat, i.Rlevel, {
											TaskName: i.TaskName,
											ConUnits: i.ConUnits,
											BeginDate: i.BeginDate.replace('T', ' '),
											EndDate: i.EndDate.replace('T', ' '),
											tabID: i.tabID,
											ProjectName: i.ProjectName,
											IsOverlapping: i.IsOverlapping,
											IsVertical: i.IsVertical
										})
									}
								})
								this.listLoading = false
							})
					    })
					})
				}else {
					return
				}
		    },
		    fillArea (lng, lat, radius, info) {
		    	var cp = new BMap.Point(lng, lat);
		    	this.drawArea(cp, radius, ()=> {
		    		
		    	}, info)
		    },
		    drawArea (cp, radius, cb, info) {
		    	if (info.tabID == this.$route.query.ID) {
			    	this.styleOptions.strokeColor = 'black'
				}else if (info.IsOverlapping == 1 || info.IsVertical == 1) {
					this.styleOptions.strokeColor = 'red'
				}
		    	var c1 = new BMap.Circle(cp, radius, this.styleOptions);
		   		c1.ID = info.tabID
		    	this.overlays.push(c1)
		    	this.styleOptions.strokeColor = '#409EFF'
		    	this.map.addOverlay(c1);
		    	//创建删除
		    	if (this.$route.query.ID == info.tabID) {
                    var removeMarker = function(e,ee,marker){
                        this.map.removeOverlay(marker);
                    }
                    //创建右键菜单
                    var markerMenu=new BMap.ContextMenu();
                    markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(c1)));
                    c1.addContextMenu(markerMenu);
                }
		    	var infoWindow = new BMap.InfoWindow('<div>项目名称: ' + info.ProjectName + '</div><div>任务名称: ' + info.TaskName + '</div><div>施工单位: ' + info.ConUnits + '</div><div>开始时间: '+ info.BeginDate +'</div><div>结束时间: '+ info.EndDate +'</div>', this.windowOpts)
				//c1.addEventListener('click', (e) => {
					
				//}) 
		    	c1.addEventListener('mouseover', () => {
		    		c1.setFillColor('yellow')
		    		this.map.openInfoWindow(infoWindow, cp);
		    	})
		    	c1.addEventListener('mouseout', () => {
		    		c1.setFillColor('#409EFF')
		    		this.map.closeInfoWindow(infoWindow, cp);
		    	})
		    	cb()
		    },
		    search () {
		    	this.map.clearOverlays();
		    	if (!this.getAreaAll_para.BeginDate) {
		    		this.getAreaAll_para.BeginDate = ''
		    	}
		    	if (!this.getAreaAll_para.EndDate) {
		    		this.getAreaAll_para.EndDate = ''
		    	}
		    	getAreaAll(this.getAreaAll_para).then(res => {
					JSON.parse(res.data).forEach(i => {
						if (i.Lat && i.Lng) {
							this.fillArea(i.Lng, i.Lat, i.Rlevel, {
								TaskName: i.TaskName,
								ConUnits: i.ConUnits,
								BeginDate: i.BeginDate.replace('T', ' '),
								EndDate: i.EndDate.replace('T', ' '),
								tabID: i.tabID,
								ProjectName: i.ProjectName
							})
						}
					})
				})
		    }
	},
	beforeRouteUpdate (to, from, next){
		window.location.reload() 
        next()
    },
	mounted () {
		var that = this
		that.getArea_para.tabID = this.$route.query.ID || ''
		let infoArr = sessionStorage.getItem('only_sign').split(',')
		that.getAreaAll_para.LoginCode = infoArr[2]
		//that.ProjectName = this.$route.query.proID || ''
		that.map = new BMap.Map('map', { minZoom: 13, maxZoom: 18, enableMapClick: false });
		that.map.addControl(new BMap.NavigationControl());
		that.map.enableScrollWheelZoom(true);
		that.map.disableDoubleClickZoom(false)
		var point1 = new BMap.Point(121.667261, 29.998284);
		//var point1 = new BMap.Point(118.247357,36.760189);
	    that.map.centerAndZoom(point1, 15);
	    var tileLayer = new BMap.TileLayer({ isTransparentPng: true });
	    tileLayer.getTilesUrl = function (tileCoord, zoom) {
	        var x = tileCoord.x;
	        var y = tileCoord.y;
	        return 'static/tiles/' + zoom + '/tile' + x + '_' + y + '.png';
	    }
	    that.map.addTileLayer(tileLayer);
	    that.map.addEventListener("click", function(e){
	        //if (e.overlay) {
	        //	return
	        //}else {
	        	that.centerPoint(e)
	        //}
		})
		if (this.$route.query.proID) {
			getArea(this.getArea_para).then(res => {
				JSON.parse(res.data).forEach(i => {
					if (i.Lat && i.Lng) {
						this.fillArea(i.Lng, i.Lat, i.Rlevel, {
							TaskName: i.TaskName,
							ConUnits: i.ConUnits,
							BeginDate: i.BeginDate.replace('T', ' '),
							EndDate: i.EndDate.replace('T', ' '),
							tabID: i.tabID,
							ProjectName: i.ProjectName,
							IsOverlapping: i.IsOverlapping,
							IsVertical: i.IsVertical
						})
					}
				})
			})
		}else {
			getAreaAll(that.getAreaAll_para).then(res => {
				JSON.parse(res.data).forEach(i => {
					if (i.Lat && i.Lng) {
						this.fillArea(i.Lng, i.Lat, i.Rlevel, {
							TaskName: i.TaskName,
							ConUnits: i.ConUnits,
							BeginDate: i.BeginDate.replace('T', ' '),
							EndDate: i.EndDate.replace('T', ' '),
							tabID: i.tabID,
							ProjectName: i.ProjectName
						})
					}
				})
			})
		}		
	}
}
</script>
<style scoped>
	.map-info {
		position: absolute;
	    top: 70px;
	    right: 85px;
	}
	.backBtn {
		position: absolute;
	    top: 70px;
	    right: 5px;
	}
	.anchorBL {
		display: none;
	}
</style>