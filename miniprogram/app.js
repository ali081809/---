//app.js
App({
  onLaunch: function () {
    // 查看用户是否授权
    wx.getSetting({
     
      success:res=>{
        // console.log(res)
                // res.authSetting['scope.userInfo']为true时，证明用户已经授权
                if(res.authSetting['scope.userInfo']){
                  wx.getUserInfo({
                    success:res=>{
                      this.globalData.userInfo=res.userInfo
                      // 如果有人来拿用户信息就给他
                      if(this.userInfoReadyCallback){
                        this.userInfoReadyCallback(res)
                      }
                    }
                  })
                }
      }
    })
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'test-fqcev',
        traceUser: true,
      })
    }
	
	wx.cloud.callFunction({
		name:"login",
		success:res=>{
			this.globalData.openid=res.result.openid;
		}
	})

    this.globalData = {
    
    }
  },
  globalData:{
	    userInfo:null,
		openid:null
  }
})
