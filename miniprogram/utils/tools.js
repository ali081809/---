/*
 * 上传文件到云存储
 * @params   _filePath   文件临时路径
 * 			_cloudPath   文件上传服务器后的云端路径
 */
async function upload(_filePath) {
	var ext = _filePath.split(".").pop()
	var nowtime = new Date().getTime();


	// return  Promise((resolve,reject)>{
	// 	wx.cloud.uploadFile({
	// 		cloudPath: nowtime+"."+ext ,
	// 		filePath:_filePath,
	// 		success:res=>{
	// 			resolve(res)
	// 		},
	// 		fail:err=>{
	// 			reject(err)
	// 		}
	// 	})
	// })
	return await wx.cloud.uploadFile({
		cloudPath: nowtime + "." + ext,
		filePath: _filePath
	})
}


/*
 *  批量上传
 *  @params   tempFilePaths   数组   临时文件地址组成的数组  
 * 									例子：["http://tem/XXX.jpg","http://tem/XXX.jpg"]
 * 
 */
async function multiUpload(tempFilePaths) {
	var arr = [] //定义一个数组
	tempFilePaths.forEach(async item => {
		var nowtime = new Date().getTime() //定义文件名称
		var ext = item.url.split(".").pop() //获取文件扩展名

		//把promise对象push到数组里面去
		var promise = wx.cloud.uploadFile({
			cloudPath: nowtime + "." + ext,
			filePath: item.url,

		})
		arr.push(promise)
	})

	//所有上传都完成，返回一个结果
	return await Promise.all(arr);
}

export {
	upload,
	multiUpload
}
