const db=wx.cloud.database()
import {
	get
} from "../../utils/db.js"
Page({
	data:{
		keyWord:"",
		pageSize:10,
		page:0,
		list:[]
	},
	// 页面加载，获取第一页的内容
	async onLoad(){
		let {page,pageSize}=this.data;
		this.getHotlist(pageSize)
	},
	// 跳到菜谱列表
	tomenulist(e){
		this.data.keyWord=e.currentTarget.id;
		wx.navigateTo({
			url:"/pages/recipelist/recipelist?keyWord="+this.data.keyWord
		})
	},
	// 获取input框的值
	getvalue(e){
		this.data.keyWord=e.detail.value;
	},
	// 进入页面渲染搜索的数组
	onShow(){
		var arr=wx.getStorageSync("keyWord")||[];
		this.setData({
			arr
		})
	},
	// 点击搜索按钮
	search(){
		// 存本地
		var keyWord=this.data.keyWord;
		var arr=wx.getStorageSync("keyWord")||[]
		var index=arr.findIndex(item=>{
			return item==keyWord
		})
		if(index!=-1){
			arr.splice(index,1)
		}
		// 添加都本地数组
		arr.unshift(keyWord)
		// 存
		wx.setStorageSync("keyWord",arr)
		wx.navigateTo({
			url:"/pages/recipelist/recipelist?keyWord="+this.data.keyWord
		})
	},
	// 获取热门搜索的十条数据
	async getHotlist(pageSize){
		var res=await db.collection("menu").orderBy("views","desc").limit(pageSize).get()
		// console.log(res)
		this.setData({
			list:res.data
		})
	}
})