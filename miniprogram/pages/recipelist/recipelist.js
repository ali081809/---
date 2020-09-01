const db = wx.cloud.database()
// 导入封装的增删改查
import {
	get
} from "../../utils/db.js"
Page({
	data: {
		xin: 5,
		list: [],
		isshow: false //是否显示底部提示
	},
	async onLoad(opction) {
		wx.showLoading()
		var {
			id,
			keyWord
		} = opction;
		// console.log(keyWord)
		if (id) {
			var res = await get("menu", {
				typeId: id
			});
			if (res) {
				wx.hideLoading()
				this.setData({
					list: res.data,
					isshow: true
				})
			}
		}

		if (keyWord) {
			// 查询数据库
			var result = await db.collection("menu").where({
				menuName: db.RegExp({
					regexp: keyWord,
					options: "i"
				})
			}).get()
			if (result) {
				wx.hideLoading()
				this.setData({
					list: result.data,
					isshow: true
				})
			}

		}

	},

	// 跳到详情页/
	todetail(e) {
		// console.log(e)
		// currentTarget
		var id = e.currentTarget.id;
		wx.navigateTo({
			url: "/pages/recipeDetail/recipeDetail?id=" + id
		})
	}
})
