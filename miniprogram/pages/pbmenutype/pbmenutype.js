// 导入封装的增删改查
import {
	get,
	getAdd,
	getOneinfo,
	update,
	del
} from "../../utils/db.js"
Page({
	data: {
		_id: "", //修改数据用到的id
		addshow: false, //添加是否显示
		upshow: false, //修改按钮是否显示
		menus: "", //菜谱名称,
		upvaule: "", //更改菜谱名称
		menusArr: [] //所有菜谱名称
	},
	// 引入页面查询数据库信息渲染页面
	onLoad() {
		this.getmenuList() //发起查询请求
	},

	// 重置
	empty() {
		this.setData({
			menus: "",
			upvaule: "",
			upshow: false, //修改按钮是否显示
			addshow: false //添加是否显示
		})
	},
	// 点击显示添加按钮
	showadd() {
		// 判断修改按钮是否显示
		if(this.data.upshow==true){
			this.setData({
				upshow:false
			})
		}
		var addshow = this.data.addshow;
		addshow = !addshow;
		this.setData({
			addshow
		})
	},
	// 实时获取表单里的数据内容
	inputTyping(e) {
		// console.log(e.detail.value)
		var menus = e.detail.value;
		this.setData({
			menus
		})
	},
	// 点击添加按钮
	async menuadd() {
		var menus = this.data.menus;
		var data = {
			menus
		}
		console.log(menus)
		// 将菜单名称添加到数据库
		var result = await getAdd("menuType", data)
		if (result) {
			// 添加成功重新发起请求
			this.getmenuList(),
				this.empty(),
				wx.showToast({
					title: "添加成功",
					icon: "none"
				})
		}

	},
	// 点击显示修改按钮
	async update(e) {
		// 判断添加按钮是否显示
		if(this.data.addshow==true){
			this.setData({
				addshow:false
			})
		}
		var _id = e.currentTarget.id;
		var result = await getOneinfo("menuType", _id);
		var upvaule = result.data.menus;
		this.setData({
			upvaule,
			_id
		})
		// console.log(result)
		var upshow = this.data.upshow;
		// upshow = !upshow;
		this.setData({
			upshow:true
		})
	},
	// 获取修改框的实时数据
	updata(e) {
		var upvaule = e.detail.value;
		// console.log(upvaule)
		this.setData({
			upvaule
		})
	},
	// 点击修改
	async menuupdate() {
		var menus = this.data.upvaule;
		var _id = this.data._id;
		var data = {
			menus
		}
		// 调用修改方法
		var res = await update("menuType", _id, data);
		// 请求数据成功操作
		if (res) {
			this.getmenuList(),
			wx.showToast({
				title: "修改成功！",
				icon: "none"
			}),
			// 重置
			this.empty()
			// this.data.upshow = true
		}
	},
	// 点击删除
	async del(e){
		console.log(e)
		var _id = e.currentTarget.id;
		var res=await del("menuType",_id)
		if(res){
			this.getmenuList(),
			wx.showToast({
				title:"删除成功！",
				icon:"none"
			})
		}
	},
	// 封装查询数据信息
	async getmenuList() {
		wx.showLoading()
		var result = await get("menuType")
		if(result){
			wx.hideLoading()
		}
		var menusArr = result.data;
		this.setData({
			menusArr
		})
	}
})
