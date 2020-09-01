// 导入封装的增删改查
import {
	get
} from "../../utils/db.js"
Page({
	data:{
		menusArr:[],
		keyWord:""
	},
	onLoad(){
		this.getmenuList()
	},
	// 跳转到菜谱列表页
	todetail(e){
		var id=e.currentTarget.id;
		wx.navigateTo({
			url:"/pages/recipelist/recipelist?id="+id
		})
	},
	getvalue(e){
		// console.log(e)
		this.data.keyWord=e.detail.value;
	},
	// 点击搜索
	search(){
		// 将搜索数据存到本地
		var keyWord=this.data.keyWord;
		var arr=wx.getStorageSync("keyWord")||[];
		var index=arr.findIndex(item=>{
			return item==keyWord
		})
		if(index!=-1){
			// 删除
			arr.splice(index,1)
		}
		// 没有就加入数组
		arr.unshift(keyWord)
		// 存
		wx.setStorageSync("keyWord",arr)
		// 跳转到菜谱列表页
		wx.navigateTo({
			url:"/pages/recipelist/recipelist?keyWord="+this.data.keyWord
		})
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