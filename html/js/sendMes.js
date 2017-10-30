// 		乐股互动解答
//var renderContent = function (content) {
//	if (content == '') {
//		return '';
//	}
//	return "<p>"+content+"</p>"
//}
//var renderImg = function (imgUrl) {
//	if (imgUrl == '') {
//		return '';
//	}
//	return "<img src="+imgUrl+" class='ansImg' >"; 
//}
function errorHandle(obj) {
				obj.src = 'img/loading.gif';
}
/**
 * 渲染内容组件方法
 * @param {Object} optClass 操作的类，直播/问答
 * @param {Object} reqUserId
 * @param {Object} reqNickname
 * @param {Object} reqAvatar
 * @param {Object} reqContent
 * @param {Object} reqImgUrl
 * @param {Object} reqCreate
 */


var renderContent = function (optClass, reqUserId, reqNickname, reqAvatar, reqContent, reqImgUrl, reqCreate,reqRoomId,reqGroupId) {
	var userId = localStorage.getItem('legu_user_id');
	//默认右边
	var renderPosition = 'left';
	if (reqUserId != userId) {
		renderPosition = 'left';
	}
	var str = '';
	str += "<li roomId='"+reqRoomId+"' groupId='"+reqGroupId+"' userId='"+reqUserId+" avatar='"+reqAvatar+"' nickname='"+reqNickname+"' content='"+reqContent+"' imgUrl='"+reqImgUrl+" create='"+reqCreate+"'><div class='"+ renderPosition +"'>";
	str += "<div style='height:40px'><p class='info'>"+reqNickname+"</p>";
	str += "<p class='create'>"+reqCreate+"</p></div><div class='anscont'>";
	
	if (reqContent === '' || reqContent === null) {
		str += '';
	} else {
		str += "<p>"+reqContent+"</p>"
	}
	if (reqImgUrl === '' || reqImgUrl === null) {
		str += '';
	} else {
		str += "<img src="+reqImgUrl+" class='amplify' style='max-height:200px' onerror=errorHandle(this)>"
	}
	str += "</div></div></li>";
	$("#"+optClass).append(str);
	$("."+optClass).scrollTop($("#"+optClass).height());
	
	
}
var renderHistory = function (data, optClass) {
	if (data.length == 0) {
		return;
	}
	var str = '';
	var userId = localStorage.getItem('legu_user_id');
	var orginalHeight = $("#"+optClass).height();
	for (var i = data.length; i > 0 ; i--) {
		var obj = JSON.parse(data[i-1]); 
		var renderPosition = 'left';
		if (obj.user_id != userId) {
			renderPosition = 'left';
		}
		str += "<li roomId='"+obj.room_id+"' groupId='"+obj.group_id+"' userId='"+obj.user_id+" avatar='"+obj.avatar+"' nickname='"+obj.nickname+"' content='"+obj.content+"' imgUrl='"+obj.img_url+"' create='"+obj.created_at+"'><div class='"+ renderPosition +"'>";
		str += "<div style='height:40px'><p class='info'>"+obj.nickname+"</p>";
		str += "<p class='create'>"+obj.created_at+"</p></div><div class='anscont'>";
		
		if (obj.content === '' || obj.content === null) {
			str += '';
		} else {
			str += "<p>"+obj.content+"</p>"
		}
		if (obj.img_url === '' || obj.img_url === null) {
			str += '';
		} else {
			str += "<img src="+obj.img_url+" class='amplify' onerror=errorHandle(this)>"
		}
		str += "</div></div></li>";
//		console.log(obj.created_at)
	}

//	console.log(str);
	$("#"+optClass).prepend(str);
	
	var calcHeight = $("#"+optClass).height() - orginalHeight;

	$("."+optClass).scrollTop(calcHeight);
}

$(function () {   
		var  ws= new WebSocket("ws://120.27.228.188:8282");
		var token = localStorage.getItem('legu_token');
		var userId = localStorage.getItem('legu_user_id');		
	  	ws.onmessage=function(e){
	  		var data=eval("("+e.data+")");
	  		var type=data.type || "";
	  		const room_id=1;
	  		switch(type){
	  			case 'init':
		  			$.ajax({
		  				url:'http://live.legu360.com/api/chat/connect',
		  				data:{client_id:data.client_id,room_id:room_id},
		  				dataType:'json',
		  				success: function(connect) {
//		  					if (data.err_code != 0) {
//								$("#errReport p").html(connect.err_msg);
//								$("#errReport").css("display","block");
//								return false;
//							}
		  				},
		  				error:function(connect){
		  					console.log("error")
		  				}
		  			});
		  			//默认执行
		  				//直播
		  			
	  			break;
	  			default:
//		  			console.log(data);
		  			
//					 $(".amplify").click(function(){
//					 	console.log(11)
//					 }) ;
					  			

	  				if (data.group_id == 1) {
	  					//图文直播
	  					console.log(111)
	  					renderContent("liveCont", data.user_id, data.nickname, data.avatar, data.content, data.img_url, data.created_at,data.room_id,data.group_id);
	  				}
	  				
	  				if (data.group_id == 2) {
	  					//答疑   
	  					
						renderContent("mesRight", data.user_id, data.nickname, data.avatar, data.content, data.img_url, data.created_at,data.room_id,data.group_id);

	  				}
	  				 
	  				

				
	  	}
	  		
	  }
	  	//直播初始化
	  	$.ajax({
  				url:'http://live.legu360.com/api/chat/livehistory',
  				success: function(data) {
  					if (data.err_code != 0) {
							$("#errReport p").html(data.err_msg);
							$("#errReport").css("display","block");
							return false;
					}
  					const optClass = 'liveCont';
//					console.log(data)
  					renderHistory(JSON.parse(data).data, optClass);
  					flag = true;
  				},
  				error:function(connect){
  					console.log("error")
  				}
		});
			//答疑初始化
		$.ajax({
  				url:'http://live.legu360.com/api/chat/answerhistory',
  				success: function(data) {
					if (data.err_code != 0) {
							$("#errReport p").html(data.err_msg);
							$("#errReport").css("display","block");
							return false;
					}
  					const optClass = 'mesRight';
  					renderHistory(JSON.parse(data).data, optClass);
  					flag = true;
  				},
  				error:function(connect){
  					console.log("error")
  				}
		}); 
		            //加载更多
		var answerloadMore=function(){
			var flag = true;
			$(".mesRight").mouseover(function(){
				
				$(".mesRight").scroll(function(){
					
//							return
					if($(".mesRight").scrollTop()==0 && flag == true){
						var livechildren=$('#mesRight').children().length;
						console.log(livechildren)
						var livefirst=$('#mesRight').children(':first');
						var answerInfo = {
							'avatar':livefirst.attr("avatar"),
							'content':livefirst.attr("content"),
							'created_at':livefirst.attr("create"),
							'group_id':livefirst.attr("groupId"),
							'img_url':livefirst.attr("imgUrl"),
							'nickname':livefirst.attr("nickname"),
							'room_id':livefirst.attr("roomId"),
							'user_id':livefirst.attr("userId")
						};
						
						var reqParams = {
							'total':livechildren,
							'count':10,
							'record':JSON.stringify(answerInfo)
						}
						flag = false;
						$.ajax({
			  				url:'http://live.legu360.com/api/chat/answerhistory',
			  				data:reqParams,
			  				dataType:'json',
			  				success: function(data) {
			  					const optClass = 'mesRight';
			  					renderHistory(data.data, optClass);
			  					flag = true;
			  					if (data.err_code != 0) {
									$("#errReport p").html(data.err_msg);
									$("#errReport").css("display","block");
									return false;
								}
			  				},
			  				error:function(connect){
			  					console.log("error")
			  				}
			  			});
					}
				})
			})
		}
		answerloadMore();
		
		var liveloadMore=function(){
			var flag = true;
			$(".liveCont").mouseover(function(){
				
				$(".liveCont").scroll(function(){;
					if($(".liveCont").scrollTop()==0 && flag == true){
					var livechildren=$('#liveCont').find("li").length;
				console.log(livechildren)
				var livefirst=$('#liveCont').children(':first');
				var answerInfo = {
					'avatar':livefirst.attr("avatar"),
					'content':livefirst.attr("content"),
					'created_at':livefirst.attr("create"),
					'group_id':livefirst.attr("groupId"),
					'img_url':livefirst.attr("imgUrl"),
					'nickname':livefirst.attr("nickname"),
					'room_id':livefirst.attr("roomId"),
					'user_id':livefirst.attr("userId")
				};
				
				var reqParams = {
					'total':livechildren,
					'count':10,
					'record':JSON.stringify(answerInfo)
				}
				flag = false;
				$.ajax({
	  				url:'http://live.legu360.com/api/chat/livehistory',
	  				data:reqParams,
	  				dataType:'json',
	  				success: function(data) {
	  					const optClass = 'liveCont';
	  					renderHistory(data.data, optClass);
	  					flag = true;
	  					if (data.err_code != 0) {
							$("#errReport p").html(data.err_msg);
							$("#errReport").css("display","block");
							return false;
						}
	  				},
	  				error:function(connect){
	  					console.log("error")
	  				}
	  			});
					}
				})
				})
		}
		liveloadMore();


		
	})
	