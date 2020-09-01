// 导入封装的增删改查
import {
	get
} from "../../utils/db.js"
Page({
	data:{
		menusArr:[],
		keyWord:""//搜索的数据
	},
  // 进入页面请求数据
  onShow(){
	  this.getmenuList()
  },
  // 获取输入框的内容
  	getvalue(e){
  		// console.log(e)
  		this.data.keyWord=e.detail.value;
  	},
  	// 点击搜索
  	search(){
  		// 将记录存到本地
		var keyWord=this.data.keyWord;
		var arr=wx.getStorageSync("keyWord")||[];
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
  		// 跳转到菜谱列表页
  		wx.navigateTo({
  			url:"/pages/recipelist/recipelist?keyWord="+this.data.keyWord
  		})
  	},
  
  // 跳到菜谱分类
  menufenlei(){
	  wx.navigateTo({
		  url:"/pages/typelist/typelist"
	  })
	  },
	  // 跳到儿童菜谱
	  chidenmenu(e){
		 
		  var id=e.currentTarget.id;
		  // 跳转到菜谱列表页
		  wx.navigateTo({
		  	url:"/pages/recipelist/recipelist?id="+id
		  })
	  },
	  
  // 跳转到详情
  todetail(e){
	  console.log(e)
	  var id=e.currentTarget.id
	  wx.navigateTo({
		  url:"/pages/recipeDetail/recipeDetail?id="+id
	  })
  },
  // 封装查询数据信息
  async getmenuList() {
	  wx.showLoading()
  	var result = await get("menu")
	if(result){
		wx.hideLoading()
	}
  	var menusArr = result.data;
  	this.setData({
  		menusArr
  	})
  }
})