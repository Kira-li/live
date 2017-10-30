$("document").ready(function(){
	var windowHeight=$(window).height();
	var height1=$(".leguPro").height();
	var liveheight=windowHeight-240;
	var answerheight=windowHeight-260-height1;
	$(".mesLeft").css('height',liveheight+"px");
	$(".liveCont").css('height',liveheight+"px");
	$(".mesRight").css('height',answerheight+"px");
	$(".liveLeft").css('height',liveheight+100+"px");
	$(".mes-bottom").css('margin-top',liveheight+15+"px");
	var flag=true;
	var errorMsg=function(data){
		$("#errReport p").html(data.err_msg);
		$("#errReport").css("display","block");
	}
	$("#errReport img").click(function(){
		$("#errReport").css("display","none");
		$("#errReport p").html("");
	})
	var isLogin = function (userId, token) {
		flag=false;
		var loginInfo = {
			'user_id':userId,
			'token':token
		}
		$.ajax({
			type:"post",
			url:"http://live.legu360.com/api/auth/islogin",
			data:loginInfo,
			dataType:"json",
			success:function(data) {
				$("#noclick").css("display","none");
				if (data.err_code == 0) {
					//登录成功
					$("#navlogin button").css("display","none");
					return true;
					
				}
				if (data.err_code != 0) {
					$("#errReport p").html(data.err_msg);
					$("#errReport").css("display","block");
					return false;
				}
			}
		});
	}
	var login = function (userInfo, pwd){
		var loginInfo = {
			'user_info' : userInfo,
			'pwd': pwd
		}
		var self = this;
		$.ajax({  
	        type: "POST",  
	        url:"http://live.legu360.com/api/auth/login",  
	        data:loginInfo,
	        dataType:"json",
	        success: function(data) {
	            if (data.err_code == 0) {
	            	localStorage.setItem("legu_nickname", data.data.nickname);
	            	localStorage.setItem("legu_token", data.data.token);
	            	localStorage.setItem("legu_user_id", data.data.user_id);
	            	localStorage.setItem("legu_isadmin", data.data.admin);
	            	localStorage.setItem("legu_islive", data.data.live);
	            	localStorage.setItem('legu_avatar',data.data.avatar);
	            	renderLogin();
	            	$("#username").val(""); 
					$("#userpwd").val(""); 
//	            	$("#navlogin p").css("background","url("+data.data.avatar+") no-repeat right top");
					
					$("#navlogin button").css("display","none");
					$("#noclick").css("display","none");
	            	flag=false;
	            	
	            }
	            if (data.err_code != 0) {
						$("#errReport p").html(data.err_msg);
						$("#errReport").css("display","block");
						return false;
	            }
	        }  
	    }); 
	}
	var renderLogin = function () {
		var nickname = localStorage.getItem('legu_nickname');
		var token = localStorage.getItem('legu_token');
		var isAdmin = localStorage.getItem('legu_isadmin');
		var isLive = localStorage.getItem('legu_islive');
		var avatar = localStorage.getItem('legu_avatar');
		document.getElementById("no-sign").innerHTML=nickname+"<b class='caret'></b>"
		//下拉个人，1修改个人信息，2修改密码，3注销，4，后台
		
		//注销登录
		$("#dellogin").click(function(){
			var token = localStorage.getItem('legu_token');
			var userId = localStorage.getItem('legu_user_id');
	    	$.ajax({
				type:"post",
				url:"http://live.legu360.com/api/auth/logout",
				data:{user_id:userId,token:token},
				dataType:"json",
				success:function (data){
					localStorage.clear();
					if (data.err_code != 0) {
						$("#errReport p").html(data.err_msg);
						$("#errReport").css("display","block");
						return false;
	            	}
				}
			});
			document.getElementById("no-sign").innerHTML="未登录"
			$(".mes-bottom").css("background","#248ad2");
    		$("#mesLive").css("display","none");
    		$("#admin").css("display","none");
    		$(".dropdown-menu").css("display","none");
    		$("#noclick").css("display","block");
    		$("#navlogin button").css("display","block");
    		falg=true;
    		loginState();
			})
		
		$("#no-sign").click(function(){
			console.log(11)
			var token = localStorage.getItem('legu_token');
			$("#errReport").css("display","none");
			if(token !== null && token !== undefined && token !==''){
				$(".lightBox").css("display","none");
	//			$(".lightBox img").css("display","none");
				$(".dropdown-menu").css("display","block");
				console.log("block");
			}else {
				$(".lightBox").css("display","block");
	//			$(".lightBox img").css("display","none");
				$(".dropdown-menu").css("display","none");
				$(".sign").css("display","block");
				console.log("none");
			}
		})
		$("#chang-pwd").click(function(){
			$(".lightBox").css("display","block");
			$("#per-pwd").css("display","block");
			$(".dropdown-menu").css("display","none");
			$(".sign").css("display","none");
		})
	    $(".lightBox").css("display","none");
//	    $("#navlogin p").click(function(){
//				$(".lightBox").css("display","block");
//				$(".login").css("display","block");
//		})
	    if (isAdmin == 1) {
	    	//渲染后台入口
	    	$("#admin").css("display","block");
	    	$(".mes-bottom").css("background","#248ad2");
	    	$("#mesLive").css("display","block");
	    	
	    }else {
	    	console.log("hdhd")
	    	$("#admin").css("display","none");
	    	$(".mes-bottom").css("background","#e0e0e0");
	    	$("#mesLive").css("display","none");
	    }
	    if (isLive == 1) {
	    	//渲染直播的
	    	$(".mes-bottom").css("background","#e0e0e0");
	    	$("#mesLive").css("display","block");
	    }else{
	    	$(".mes-bottom").css("background","#248ad2");
	    	$("#mesLive").css("display","none");
	    }
	    
	    //登录与未登录
		
		
	}
	
	//上传直播图片
	$("#onPic").on('change', function () {
		var self = this;
		const renderClass = "live_img_url";
		uploadImg(self, renderClass);
	});
	//上传问答图片
	$("#inPic").on('change', function () {
		var self = this;
		const renderClass = "answer_img_url";
		uploadImg(self, renderClass);
	});
	var resetFileInput=function (file){
    	file.after(file.clone().val(""));   
    	file.remove();
	}  
	var renderImgUrl = function () {
		
	}
	//ajax压缩请求上传图片
	var uploadImg = function (imgInput, renderClass) {
		
		// this.files[0] 是用户选择的文件
		console.log(imgInput.files[0]);
//		return;
	    lrz(imgInput.files[0], {width: 1024})
			.then(function (rst) {
            // 把处理的好的图片给用户看看呗
            $(".img_hove img").remove();
            var img = new Image();          
            img.src = rst.base64;
//			console.log(img.src); 
			$('.show_img').append(img);			
			$('.show_img img').css("height","160px","max-width","120px");
            img.onload = function () {
            	$("." + renderClass).prev().mouseenter(function(){
            		var self=this;
            		$(self).children(".show_img").css('display','block');
            		
            	})
				$("." + renderClass).prev().mouseleave(function(){
					var self=this;
					$(self).closest('s').children(".show_img").css('display','none');
            	})
            };

            return rst;
        	})
			
	        .then(function (rst) {
	        	console.log(rst)
	        	var token = localStorage.getItem('legu_token');
				var userId = localStorage.getItem('legu_user_id');
	        	rst.formData.append("user_id", userId);
	        	rst.formData.append("token", token);
				$.ajax({
				    url: 'http://live.legu360.com/api/chat/uploadimg', 
				    data: rst.formData,
				    processData: false,
				    contentType: false,
				    dataType:"json",
				    type: 'POST',
				    success: function (data) {
				    	console.log(data)
				        if (data.err_code == 0 ) {
				        	$("." + renderClass).val(data.data);
				        	console.log($("." + renderClass).val());
				        	resetFileInput($(imgInput));
//				        	$(".img_hove img").remove();
				        }
				        if (data.err_code != 0) {
							$("#errReport p").html(data.err_msg);
							$("#errReport").css("display","block");
							return false;
						}
				    },
				    complete:function() {
				    	var eventId = $(imgInput).attr('id');
				    	$("#"+ eventId).on('change', function () {
							var self = this;
							uploadImg(self, renderClass);
//							$(".img_hove img").remove();
						});
				    }
				});
	
	
	        })
	}
	
	var clearLiveInput = function () {
		//清楚文本的input的value值
		//清除直播隐藏的图片的value值
		$("#onText").val("");
		$(".live_img_url").val("")
	}
	
	//发送图文直播消息
	var senLivemes=function(){
		var liveContent=$("#onText").val();
		var liveImgurl=$(".live_img_url").val();
		var token = localStorage.getItem('legu_token');
		var userId = localStorage.getItem('legu_user_id');
		var avatar = localStorage.getItem('legu_avatar');
		var roomId=1;
		$(".img_hove img").remove();
		//获取输入框里的东西
		var liveInfo = {
			'room_id':roomId,
			'content':liveContent,
			'img_url':liveImgurl,
			'user_id':userId,
			'avatar':avatar,
			'token':token
		};
		$.ajax({
			type:"post",
			url:"http://live.legu360.com/api/chat/push",
			data:liveInfo,
			dataType:"json",
			success:function (data){
				if (data.err_code == 0) {
					//发送成功
					
					
				}
				if (data.err_code != 0) {
					//提示发送失败
					if (data.err_code != 0) {
						$("#errReport p").html(data.err_msg);
						$("#errReport").css("display","block");
						return false;
					}
				}
				
			}
		});
		clearLiveInput();
	}
	$("#sendLive").click(function(){
		senLivemes()
	});
	$(".mes-bottom ").bind("keydown",function(e){
        // 兼容FF和IE和Opera    
    var theEvent = e || window.event;    
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
    if (code == 13) {    
        //回车执行查询
        if(window.event){
			window.event.returnValue = false;
			}else{
			e.preventDefault();//for firefox
		}
          senLivemes();
        }    
	});
	//发送答疑
	var sendAnswer=function(){
		var answerContent=$("#inText").val();
		var answerImgurl=$(".answer_img_url").val();
		var token = localStorage.getItem('legu_token');
		var userId = localStorage.getItem('legu_user_id');
		var avatar = localStorage.getItem('legu_avatar');
		var roomId=1;
		$(".img_hove img").remove();
		//获取输入框里的东西
		var answerInfo = {
			'room_id':roomId,
			'content':answerContent,
			'img_url':answerImgurl,
			'user_id':userId,
			'avatar':avatar,
			'token':token
		};
		$.ajax({
			type:"post",
			url:"http://live.legu360.com/api/chat/send",
			data:answerInfo,
//			dataType:"json",
			success:function (data){
//				console.log(data);
				if (data.err_code == 0) {
					//发送成功
//					$(".img_hove img").remove();
				}
				if (data.err_code != 0) {
					//提示发送失败
					if (data.err_code != 0) {
						$("#errReport p").html(data.err_msg);
						$("#errReport").css("display","block");
						return false;
					}
				}
				
			}
		});
		clearAnswerInput();
	}
	$("#sendmes").click(function(){
			sendAnswer();
		
	});
	$("#sendMes").keydown(function(event){
		if(event.keyCode==13){
		   sendAnswer();
		}
	});
	$("#sendMes").bind("keydown",function(e){
        // 兼容FF和IE和Opera    
    var theEvent = e || window.event;    
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
    if (code == 13 ) {  
    	if(window.event){
			window.event.returnValue = false;
			}else{
			e.preventDefault();//for firefox
		}
           sendAnswer();
        }    
	});
	var clearAnswerInput = function () {
		//清楚文本的input的value值
		//清除直播隐藏的图片的value值
		$("#inText").val("");
		$(".answer_img_url").val("");
	}
//修改用户信息
	var loginState=function(){
		if(document.getElementById("no-sign").innerHTML=="未登录"){
			$(".dropdown-menu").css("display","none");
		}
	}
	
	loginState();
	//重置登录信息
	var resetLogin=function(){
			document.getElementById("no-sign").innerHTML="未登录"
			$(".mes-bottom").css("background","#248ad2");
	    	$("#mesLive").css("display","none");
	    	$(".dropdown-menu").css("display","none");
	    	$(".lightBox").css("display","block");
	    	$("#per-pwd").css("display","none");
	    	localStorage.clear();
			$(".sign").css("display","block");
	}
	$("#chang_pwd").click(function(){
		var token = localStorage.getItem('legu_token');
		var userId = localStorage.getItem('legu_user_id');
		var pwd=$("#chang_formal_pwd").val();
		var newpwd=$("#chang_new_pwd").val();
		var repwd=$("#chang_new_repwd").val();
		var changPwd = {
			'user_id':userId,
			'token':token,
			'pwd':pwd,
			'newpwd':newpwd,
			'repwd':repwd
		};
		$.ajax({
			type:"post",
			url:"http://live.legu360.com/api/user/updatepwd",
			data:changPwd,
			success:function(data){
				console.log(data);
				$("#chang_messucces").html("密码修改成功");
				resetLogin();	
				loginState();
				if (data.err_code != 0) {
					$("#errReport p").html(data.err_msg);
					$("#errReport").css("display","block");
					return false;
				}
			}
		});
	});
	
//乐股资讯渲染
	var mesTransfer=function(data){
		var str="";
		for(var i=0;i<data.data.info.length;i++){
//			var data= JSON.parse(data.data.info[i-1]); 
			str+="<li info_id='"+data.data.info[i].id+"'><h5>"+data.data.info[i].title+"</h5>"
			str+="<div class='legudesc"+i+"'>"+data.data.info[i].desc+"</div></li>";
			
		}

		$("#mesLeft").html(str);
		var totalSize=data.data.info.length;
		var totalPage=Math.ceil(data.data.info.length/10);
		$("#page").paging({
			pageNo:data.data.current_page,
			totalPage: data.data.all_page,
			totalSize: totalSize,
			callback: function(num) {
//				alert(num)
			}
		})
//		var innerText=$(".legudesc").html().length;
//		console.log(innerText);
		for(var i=0;i<data.data.info.length;i++){
			var innerText=$(".legudesc"+i).html().length;
			if(innerText>80){
				var text=$(".legudesc"+i).html().substring(0,80)+"...";
				$(".legudesc"+i).html(text);
			}else {
				
			}
		}
//		var text=$(".legudesc").html().substring(0,80)+"...";
		
		
	};
//	var innerText=$(".leguInfo").html().length;	
	//点击进详情
	$("#mesLeft").on("click","div",function(){
		var self=this;

		var optId = $(self).parents('li').attr('info_id');
//		var optCli = $(self).parents('li').attr('info_cli')-1;
		$.ajax({
			type:"get",
			url:"http://live.legu360.com/api/hotinfo/getinfo",
			data:{info_id:optId},
			dataType:"json",
			success:function(data){	
				$(".lightBox").css("display","block");
				$("#zixunload").css("display","block");
				var str="<div style='margin:0 auto;display:table'><h3>"+data.data.title+"</h3></div><p>"+data.data.content+"</p>"
				$("#zixunload").html(str);
				if (data.err_code != 0) {
					$("#errReport p").html(data.err_msg);
					$("#errReport").css("display","block");
					return false;
				}
				$("#zixunload").click(function(){
					$(".lightBox").css("display","none");
					$("#zixunload").css("display","none");
				})
			}
		});
	})
	//分页处理
	//首页
		
//图文直播乐股资讯跳转
	$(".picLive").click(function(){
		$(".liveCont").css("display","block");
		$(".mesLeft").css("display","none");
		$(".picLive").addClass("addboder");
		$(".leguMes").removeClass("addboder");
		console.log(flag);
		var isAdmin = localStorage.getItem('legu_isadmin');
	    if(isAdmin == 1){
			$(".mes-bottom").css("background","#e0e0e0");
	    	$("#mesLive").css("display","block");
	    }else{
	    	$(".mes-bottom").css("background","#248ad2");
		    $("#mesLive").css("display","none");
	    	
	    }
	})
	$(".leguMes").click(function(){
		$(".mesLeft").css("display","block");
		$(".liveCont").css("display","none");
		$(".leguMes").addClass("addboder");
		$(".picLive").removeClass("addboder");
		$(".mes-bottom").css("background","#248ad2");
	    $("#mesLive").css("display","none");
	    var page=1;
	    var count=5;
	    $.ajax({
			type:"get",
			url:"http://live.legu360.com/api/hotinfo/getinfolist",
			data:{page:page,count:count},
			dataType:"json",
			success:function(data){	
				console.log(data)
				mesTransfer(data);
				if (data.err_code != 0) {
					$("#errReport p").html(data.err_msg);
					$("#errReport").css("display","block");
					return false;
				}
			}
		});
	})
//登录注册相互跳转
	$("#navlogin button").click(function(){
		$(".lightBox").css("display","block");
		$(".sign").css("display","block");
		$(".dropdown-menu").css("display","none");
		$("#per-pwd").css("display","none");
		$("#per-info").css("display","none");
		$("#errReport").css("display","none");
	})
	
//	$("#navlogin p").click(function(){
//		$(".lightBox").css("display","block");
//		$(".login").css("display","block");
//	})	
	$(".signleft").click(function(){
		$(".login").css("display","block");
		$(".sign").css("display","none");
	})
	$(".sixth").click(function(){
		$(".sign").css("display","block");
		$(".login").css("display","none");
	})
	$(".del").click(function(){
		$(".lightBox").css("display","none");
		$(".login").css("display","none");
		$(".sign").css("display","none");
		$("#zixunload").css("display","none");
		$("#errReport").css("display",'none');
		$("#errReport p").html("");
		$("#per-info").css("display","none");
		$("#per-pwd").css("display","none");
		if(isAdmin == 1){
				$("#noclick").css("display","none");
			}else{
				$("#noclick").css("display","block");
		}
	})
//登录信息

	$("#signBtn").click(function () {
		var username=$("#username").val(); 
		var userpwd=$("#userpwd").val(); 
		$("#noclick").css("display","none");
		var self=this;
		flag=false;
		login(username,userpwd);
		$("#username").val(""); 
		$("#userpwd").val(""); 
		$(".sign").css("display","none");
		$("#noclick").css("display","none");
		$(".del").css("display","none");
	})
	$("#username").bind("keydown",function(e){
        // 兼容FF和IE和Opera    
    var theEvent = e || window.event;    
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
    if (code == 13 ) {  
           $("#username").blur();
           $("#userpwd").focus();
        }    
	});	
	$("#userpwd").bind("keydown",function(e){
        // 兼容FF和IE和Opera    
    var theEvent = e || window.event;    
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
    if (code == 13 ) {  
            $("#username").blur();
            $("#userpwd").focus();
            flag=false;
            var username=$("#username").val(); 
		    var userpwd=$("#userpwd").val(); 
		    login(username,userpwd);
		    $("#username").val(""); 
		    $("#userpwd").val(""); 
			$(".sign").css("display","none");
			$("#noclick").css("display","none");
			$(".del").css("display","none");
        }    
	});	
//忘记密码
	$(".signright").click(function(){
			$(".lightBox").css("display","block");
			$(".sign").css("display","none");
			$(".login").css("display","none");
			$("#forgetPwd").css("display","block");
	})
	$("#forget_code").click(function () {
       var forget_tele=$("#forget_nickname").val(); 
       $.ajax({  
	        type: "GET",  
	        url:"http://live.legu360.com/api/auth/valid",  
	        data:{phone:forget_tele},
	        async: false,  
	        error: function() {  
//	           $("#signmeserrorr").html("用户名或密码错误！")
	        },  
	        success: function(data) {
	        	console.log(data)
	        	$("#meserror").html("验证码10分钟内有效");
	        	if (data.err_code != 0) {
					$("#errReport p").html(data.err_msg);
					$("#errReport").css("display","block");
					return false;
				}
	        }  
    	}); 
    }) 
	$("#forgetBtn").click(function () {
       var nickname=$("#forget_nickname").val();
       var telcode=$("#forget_telCode").val(); 
       var pwd=$("#forget_pwd").val(); 
       var repwd=$("#forget_repwd").val(); 
       $.ajax({  
	        type: "post",  
	        url:"http://live.legu360.com/api/auth/reset",  
	        data:{user_info:nickname,sms:telcode,pwd:pwd,repwd:repwd},// 序列化表单值  
	        async: false,
	        dataType:'json',
	        error: function() {  
//	           $("#signmeserrorr").html("用户名或密码错误！")
	        },  
	        success: function(data) {
	        	console.log(data)
	        	$(".sign").css("display","block");
	        	$("#forgetPwd").css("display","none");
	        	$("#forget_nickname").val('')
	        	$("#forget_telCode").val(''); 
	        	$("#forget_pwd").val('');
	        	$("#forget_repwd").val('');
	        	if (data.err_code != 0) {
					$("#errReport p").html(data.err_msg);
					$("#errReport").css("display","block");
					return false;
				}
	        }  
    	}); 
    }) 
  
 //注册验证信息
  	$("#nickname").blur(function () {             
        var telephone=$("#tel").val(); 
        
        
    });
   $("#tel").blur(function () {             
        var telephone=$("#tel").val();
        var telephone1=/^[1]{1}[0-9]{10}/;
        if(telephone.length==0){
             $("#meserror").html("电话不可以为空");
            return false;
        }else if(!telephone1.test(telephone)){
            $("#meserror").html("请输入合法电话");
            return false;
        }else{
             $("#meserror").html("输入正确");
             
        } 
    });

        
    $("#code").click(function () {
       var telephone=$("#tel").val(); 
       $.ajax({  
	        type: "GET",  
	        url:"http://live.legu360.com/api/auth/valid",  
	        data:{phone:telephone},// 序列化表单值  
	        async: false,  
	        error: function() {  
//	           $("#signmeserrorr").html("用户名或密码错误！")
	        },  
	        success: function(data) {
	        	console.log(data)
	        	$("#meserror").html("验证码10分钟内有效");
	        	if (data.err_code != 0) {
					$("#errReport p").html(data.err_msg);
					$("#errReport").css("display","block");
					return false;
				}
	        }  
    	}); 
    }) 
    
   $("#pwd").blur(function () {
        var password=$("#pwd").val();
        var password1=/^[a-zA-Z0-9]{6,10}/;
        if(password.length==0){
             $("#password-error").html("密码不可以为空");
            return false;
        }else if(!password1.test(password)){
                 $("#password-error").html("请输入6-10位的密码");
                return false;
            }else{
                $("#password-error").html("输入正确");
        }
    })
   
    $("#repwd").blur(function () { 
    	var password=$("#pwd").val();
        var repassword=$("#repwd").val();
        if(password!==repassword){
             $("#repassword-error").html("两次输入密码不一致");
            return false;
        }else{
                $("#repassword-error").html("输入正确");
	    }  
	            
    })       
 	$("#loginBtn").click(function(){
//			var meserror=$("#meserror").innerHTML;
		$.ajax({  
	        type: "POST",  
	        url:"http://live.legu360.com/api/auth/registry",  
	        data:$('#login').serialize(),
	        dataType:"json",
	        async: false,  
	        error: function() {  
//		           $("#signmeserrorr").html("用户名或密码错误！")
	        },  
	        success: function(data) {	
	        	if(data.err_code!=0){ 
        			$("#meserror").html(data.err_msg);
//								console.log(data)
//			        			alert(data.err_msg)
	        	}
	        	if (data.err_code != 0) {
					$("#errReport p").html(data.err_msg);
					$("#errReport").css("display","block");
					return false;
				}
	        	$("#meserror").html();
        		$(".lightBox").css("display","block");
				$(".sign").css("display","block");
				$(".login").css("display","none");
				$("#noclick").css("display","none");
				$("#navlogin button").css("display","none");
				
				$("#tel").val('');
				$("#pwd").val('');
				$("#telCode").val('');
				$("#repwd").val('');
				$("#nickname").val('');

        	}  
    	}); 
	})
 		
//图片点击放大
		var count=1;
		var isAdmin = localStorage.getItem('legu_isadmin');
		$("#mesRight").on("click",".amplify",function(){
			var imgSrc=$(this)[0].src;
			$(".lightBox").css("display","block");
			$("#imgScale").css("display","block");
			document.getElementById("imgScale").innerHTML="<img src="+imgSrc+" class='img_scale'>";
//			
			

			if($(".img_scale").height()<=500 && $(".img_scale").width()<=800){
				$(".img_scale").css("width",$(".img_scale").width()+"px");
				$(".img_scale").css("height",$(".img_scale").height()+"px");
			}else {
				if($(".img_scale").height()>=$(".img_scale").width()){
				$(".img_scale").css("height","100%");
				}else{
				$(".img_scale").css("width","100%");
			}
			}
			var height=-($(".img_scale").height())/2+"px";
			var width=-($(".img_scale").width())/2+"px";
			$(".img_scale").css({"transform": "scale(1)","display":"block","margin-left":width,"margin-top":height})
			var count=1;
			var maxheight=900;
			var maxwidth=1200;
			
			$("#imgScale").mouseover(function(){
				$(document).on("mousewheel DOMMouseScroll", function (e) {
					$(window).scrollTop(0);
			        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
			                (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));  
			                // firefox
			       
			        if (delta > 0) {
			            // 向上滚
			            count=count+0.05;
			            $(".img_scale").css({"transform": "scale("+count+")"})
			
			        } else if (delta < 0) {
			            // 向下滚
			             count=count-0.05;
			             if(count<0.4){
			             	count=0.4;
			             }
			             $(".img_scale").css({"height": "scale("+count+")"});
			        }
		    	});
			})
			
			$(".del").css("display","none");
			$("#imgScale").click(function(){
				$(".lightBox").css("display","none");
				$(".img_scale").css("display","none");
				$("#imgScale").css("display","none");
				$(".del").css("display","block");
				$(".img_scale").remove();
				if(isAdmin == 1){
					$("#noclick").css("display","none");
				}else{
					$("#noclick").css("display","block");
				}
				
			})
			var obox = document.getElementsByClassName('img_scale')[0] ; 
			obox.onmousedown = function(evt) {  
	    		var oEvent = evt || event; //获取事件对象，这个是兼容写法  
	    		var left = $('.img_scale').css('left');
				var top = $('.img_scale').css('top');
			    var disX = oEvent.clientX - parseInt(left );  
			    var disY = oEvent.clientY - parseInt(top); 
			    
			    //这里就解释为什么要给document添加onmousemove时间，原因是如果你给obox添加这个事件的时候，当你拖动很快的时候就很快脱离这个onmousemove事件，而不能实时拖动它  
			    document.onmousemove = function(evt) { //实时改变目标元素obox的位置  
			            var oEvent = evt || event;  
			            obox.style.left = oEvent.clientX - disX + 'px';  
			            obox.style.top = oEvent.clientY - disY + 'px'; 
			        }  
			        //停止拖动  
			    document.onmouseup = function() {  
			        document.onmousemove = null;  
			        document.onmouseup = null;  
			    }  
			}  
		})
		$("#liveCont").on("click",".amplify",function(){
			var imgSrc=$(this)[0].src;
			$(".lightBox").css("display","block");
			$("#imgScale").css("display","block");
			$("#imgScale").html("<img src="+imgSrc+" class='img_scale'>");
//			if($(".img_scale").height()>500 || $(".img_scale").width()>800){
			
//			}
			if($(".img_scale").height()<=500&&$(".img_scale").width()<=800){
				$(".img_scale").css("width",$(".img_scale").width()+"px");
				$(".img_scale").css("height",$(".img_scale").height()+"px");
			}else{
				if($(".img_scale").height()>$(".img_scale").width()){
				$(".img_scale").css("height","100%");
				}else{
					$(".img_scale").css("width","100%");
			}
			}
			var height=-($(".img_scale").height())/2+"px";
			var width=-($(".img_scale").width())/2+"px";
			$(".img_scale").css({"transform": "scale(1)","display":"block","margin-left":width,"margin-top":height})
			$(".del").css("display","none");
			$("#imgScale").mouseover(function(){
				$(document).on("mousewheel DOMMouseScroll", function (e) {
					$(window).scrollTop(0);
			        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
			                (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));  
			                // firefox
			        if (delta > 0) {
			            // 向上滚
			            count=count+0.05;
			            $(".img_scale").css({"transform": "scale("+count+")"})
			
			        } else if (delta < 0) {
			            // 向下滚
			             count=count-0.05;
			             if(count<0.4){
			             	count=0.4
			             }
			             $(".img_scale").css({"transform": "scale("+count+")"});
			        }
		    	});
			})
			$("#imgScale").click(function(){
				$(".lightBox").css("display","none");
				$(".img_scale").css("display","none");
				$("#imgScale").css("display","none");
				$(".del").css("display","block");
				$(".img_scale").remove();
				if(isAdmin == 1){
					$("#noclick").css("display","none");
				}else{
					$("#noclick").css("display","block");
				}
			})
			var obox = document.getElementsByClassName('img_scale')[0] ; 
			obox.onmousedown = function(evt) {  
	    		var oEvent = evt || event; //获取事件对象，这个是兼容写法  
	    		var left = $('.img_scale').css('left');
				var top = $('.img_scale').css('top');
			    var disX = oEvent.clientX - parseInt(left );  
			    var disY = oEvent.clientY - parseInt(top); 
			    //这里就解释为什么要给document添加onmousemove时间，原因是如果你给obox添加这个事件的时候，当你拖动很快的时候就很快脱离这个onmousemove事件，而不能实时拖动它  
			    document.onmousemove = function(evt) { //实时改变目标元素obox的位置  
			            var oEvent = evt || event;  
			            obox.style.left = oEvent.clientX - disX + 'px';  
			            obox.style.top = oEvent.clientY - disY + 'px'; 
			        }  
			        //停止拖动  
			    document.onmouseup = function() {  
			        document.onmousemove = null;  
			        document.onmouseup = null;  
			    }  
			}  
		})



	function init ()
	{
		var self = this;
		//读取localstorage；
		var roomId=1;
		var token = localStorage.getItem('legu_token');
		var userId = localStorage.getItem('legu_user_id');
//		return
		if (token !== null && token !== undefined && token !==''&&userId !== null && userId !== undefined && userId !=='') {
//		if (!token  && !userId ) {	
			flag=false;
			islogin = isLogin(userId,token);
			if (isLogin) {
				renderLogin();
				$("#navlogin button").css("display","none");
			}
		}else{
			console.log(111)
			document.getElementById("no-sign").innerHTML="未登录";
				$("#no-sign").click(function(){
					console.log(111)
					$(".lightBox").css("display","block");
					$(".del").css("display","block");
					$(".dropdown-menu").css("display","none");
					$(".sign").css("display","block");
					$(".del").css("display","block");
					$("#errReport").css("display","none");
					
				});
			$("#noclick").click(function(){
				$(".lightBox").css("display","block");
				$(".del").css("display","block");
				$(".sign").css("display","block")
				$("#noclick").css("display","none");
				$("#errReport").css("display","none");
				$(".del").css("display","block");
			})
			}
		}
	init();
});  