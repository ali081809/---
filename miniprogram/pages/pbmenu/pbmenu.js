import {
	get,
	getAdd
} from "../../utils/db.js"
import {
	multiUpload
} from "../../utils/tools.js"

const app=getApp();
Page({
	data: {
		name:"",
		ischeched:false,
		dsc:"",
		files: [], //上传的图片数组
		menusArr: [], //菜谱分类
		images: "" //本地展示的图片

	},
	// 进入页面就请求菜谱分类的名称
	onLoad() {
		this.getmenuList()
	},
	// 置空
	emtepy(){
		this.setData({
			files: [], //上传的图片数组
			name:"",
			ischeched:false,
			dsc:""
		})
	},
	// 点击获取图片
	changeImage(e) {
		// console.log(e)
		var imgArr = e.detail.tempFilePaths;
		var files = imgArr.map(item => {
			return {
				url: item
			}
		})
		this.setData({
			files
		})
	},

	// 点击发布菜谱
	async fbcd(e) {
		let {avatarUrl,nickName}=app.globalData.userInfo
		let {menuName,desc,typeId}=e.detail.value
		var addtime = new Date().getTime(); //添加的时间
		var follows = 0; //关注数
		var views = 0; //访问数
		var tempFilePaths = this.data.files; // 临时文件地址组成的数组  
		// 上传图片到存储
		let imgpath=await multiUpload(tempFilePaths);
		var data = {
			menuName,
			nickName,
			avatarUrl,
			desc,
			addtime,
			follows,
			views,
			typeId,
			imgpath

		}
		// 添加到数据库
		var res = await getAdd("menu", data)
		if (res) {
			wx.reLaunch({
				url:"/pages/index/index"
			})
			this.emtepy()
			wx.showToast({
				title: "添加成功！"
			})
		}
	},
	// 封装查询数据信息
	async getmenuList() {
		var result = await get("menuType")
		var menusArr = result.data;
		this.setData({
			menusArr
		})
	}
})
