const db=wx.cloud.database();

// 封装查询全部信息的条件
async function get(_collection="",_where={}){
	var result=await db.collection(_collection).where(_where).get()
	return result;
}

// 封装查询一条信息
async function getOneinfo(_collection="",_id){
	var result=await db.collection(_collection).doc(_id).get()
	return result;
}
// 封装添加
async function getAdd(_collection="",_data={}){
	var result=await db.collection(_collection).add({
		data:_data
	})
	return result;
}

// 封装修改
async function update(_collection="",_id="",_data={}){
	return await db.collection(_collection).doc(_id).update({
		data:_data
	})
}

// 封装删除
async function del(_collection="",_id=""){
	return await db.collection(_collection).doc(_id).remove()
}
// // 批量删除
async function delAll(_collection,_data){
	return await wx.cloud.callFunction({
				name: "del",
				data: {
					_collection: _collection,
					_data: _data
				}
	
			})
}
	


export {get,getOneinfo,getAdd,update,del,delAll}