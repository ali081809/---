// 导入封装的增删改查
import {
	get,
	getOneinfo,
	del,
	delAll
} from "../../utils/db.js"
// 实例化app
const app = getApp()
Page({
	data: {
		followArr:[],
		result: [],
		id: "",
		index: "",
		isshow: false, //是否登录
		userInfo: {}, //用户信息
		tabtitle: ["菜谱", "分类", "关注"],
		menusArr: [] //所以分类菜谱
	},
	// 点击选项卡
	async toptab(e) {
		var id = e.currentTarget.id;

		this.setData({
			id: id
		})
		// 菜单
		if (id == 0) {
			this.getmenuList("menu")
		}
		// 点击分类
		if (id == 1) {
			this.getmenuList("menuType")
		}
		// 点击关注
		if (id == 2) {
			// 查询关注表，获取menuid
			var res=await get("follow");
			wx.showLoading()
			var result=res.data.map(item=>{
				if(item._openid==app.globalData.openid){
					return getOneinfo("menu",item.menuId)
				}
			
			})
			var arr=await Promise.all(result)
			wx.hideLoading()
			console.log(arr)
			this.setData({
				followArr:arr
			})
		}
	},
	// 点击分类查看
	look(e){
		var id=e.currentTarget.id
		console.log(e)
		// 跳转到菜谱列表页
		wx.navigateTo({
			url:"/pages/recipelist/recipelist?id="+id
		})
	},
	// 点击菜单删除
	async delCdlb(e,index){
		// 删除存储里面的图片
		var menusArr=this.data.menusArr;
		// 本地所有图片地址
		var fileimgs=menusArr.map(item=>{
			return item.imgpath;
		})
		// 所有的图片路径
		var fileId=fileimgs[0].map(item=>{
			return item.fileID;
		})
		// 删除存储里面的图片地址
		wx.cloud.deleteFile({
		  fileList: fileId
		})
		
		var {id,index}=e.currentTarget.dataset;
		wx.showModal({
			title:"你确定要删除吗？",
			success:res=>{
				this.data.menusArr.splice(index,1);
				this.setData({
					menusArr:this.data.menusArr
				})
				// 菜单里面的数据
				del("menu",id)
				// 删除关注表的数据
				delAll('follow',{menuId:id})
				
			}
		})

	},
	// 跳到详情
	todetail(e) {
		// console.log(e)
		var id = e.currentTarget.id
		wx.navigateTo({
			url: "/pages/recipeDetail/recipeDetail?id=" + id
		})
	},
	// 点击菜单添加
	pbmenu() {
		wx.navigateTo({
			url: "/pages/pbmenu/pbmenu"
		})
	},

	// 点击登录
	login(e) {
		console.log(e)
		var userInfo = e.detail.userInfo;
		this.setData({
			userInfo: userInfo,
			isshow: true
		})
	},
	// <!-- 点击头像，进行  {发布菜谱分类} （必须是管理员的情况） -->
	addmenu() {
		wx.reLaunch({
			url: "/pages/pbmenutype/pbmenutype"
		})
	},
	// 进入页面判断用户是否登录
	onLoad() {
		this.getmenuList("menu")
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				isshow: true
			})
		} else {
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					isshow: true
				})
			}
		}
	},
	// 封装查询数据信息
	async getmenuList(_collction) {
		wx.showLoading()
		var result = await get(_collction)
		if (result) {
			wx.hideLoading()
		}
		var menusArr = result.data;
		this.setData({
			menusArr
		})
	},

})
