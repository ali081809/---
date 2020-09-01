const db = wx.cloud.database();
// const cloud = require('wx-server-sdk')
// 自增
const _ = db.command
// 导入封装的增删改查
import {
	update,
	get,
	getOneinfo,
	getAdd,
	del
} from "../../utils/db.js"
const app = getApp()
Page({
	data: {
		views:"",//浏览量
		follows:"",//关注数
		sub: "",//需要减的数量
		menuId: "", //菜谱id
		isLike: false, //是否关注
		menuOneInfo: {}, //一条数据信息
	},
	// 点击关注
	async islike() {

		var isLike = this.data.isLike;
		isLike = !isLike;
		this.setData({
			isLike
		})
		// 关注添加到数据库
		if (isLike == true) {
			var menuId = this.data.menuId;
			var time = new Date().getTime()
			var data = {
				menuId,
				time
			}

			let isadd = await db.collection('menu').doc(menuId).update({
				data: {
					follows: _.inc(1)
				}
			})
			
			// 页面收藏+1
			var follows=this.data.follows+1
			this.setData({
				follows
			})
		
			
			// 点击关注添加数据库
			var res = await getAdd("follow", data)

		}
		//取消关注删除数据库信息
		if (isLike == false) {
			var menuId = this.data.menuId;
			
			//批量删除
			wx.cloud.callFunction({
				name: "del",
				data: {
					_collection:'follow',
					_data: {menuId:menuId,_openid:app.globalData.openid}
				},
				success: res => {
					var sub = res.result.stats.removed;
					this.setData({
						sub
					})
				},
				fail: err => {
					console.log(err)
				}

			})
			let issub = await db.collection('menu').doc(menuId).update({
				data: {
					follows: _.inc(-(this.data.sub))
				}
			})
			// 页面收藏-1
			var follows=this.data.follows-1
			this.setData({
				follows
			})
		}
	},
	// 进入页面发起请求
	async onLoad(opction) {
		var openid = app.globalData.openid;
		var {
			id
		} = opction;

		this.setData({
			menuId: id
		})
		// 从查询数据库用户是否关注,也可以通过条件查询openID和menuID查到数据长度大于零时代表已经关注
		var res = await get("follow")
		res.data.forEach(item => {
			if (item.menuId == id && item._openid == openid) {
				this.setData({
					isLike: true
				})

			} 
		})
		// 查询数据
		this.getmenuList(id);
		
		// 进入页面让数据库的浏览量+1
		db.collection('menu').doc(id).update({
			data: {
				views: _.inc(1)
			}
		})
		// 页面浏览量+1
		var views=this.data.follows+1
		this.setData({
			views
		})

	},
	// 封装查询一条数据信息
	async getmenuList(id) {
		wx.showLoading()
		var result = await getOneinfo("menu", id)
		if (result) {
			wx.hideLoading()
		}
		var menuOneInfo = result.data;
		var follows=result.data.follows;
		var views=result.data.views;
		this.setData({
			menuOneInfo,
			follows,
			views
		})
	},
	// 封装全部查询数据信息
	async getmenuListall(where) {
		wx.showLoading()
		var result = await get("menu", where)
		if (result) {
			wx.hideLoading()
		}
		var menusArr = result.data[0];
		this.setData({
			menuOneInfo: menusArr
		})
	}

})
