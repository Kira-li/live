$(function() {
	var $clip = $("#clip");
	var $file = $(".upload_avatar");

	$file.on('change', function () {
        $("#cut").show();
    })
	var token = localStorage.getItem('legu_token');
	var userId = localStorage.getItem('legu_user_id');
	$clip.photoClip({
		width: 100,
		height: 100,
		fileMinSize: 0,
		file: $file,
		ok: "#clipBtn",
        strictSize: true,
		loadError: function() {
			console.log("图片加载失败");
		},
		loadComplete: function() {
			console.log("照片读取完成");
		},
		clipFinish: function(dataURL) {
			var uploadaaa = {
				'img':dataURL,
				'user_id': userId,
				'token':token
			};
			$.ajax({
				url: 'http://live.legu360.com/api/user/uploadavatar',
				method : 'post',
				dataType : 'json',
				data : uploadaaa,
				success : function (data) {
				    console.log(data)
				    if (data.err_code != 0) {
							$("#errReport p").html(data.err_msg);
							$("#errReport").css("display","block");
							return false;
					}
				    $('.user_avatar').attr('src', data.data);
				}
			})
		}
	});
	
	$("#chang-info").on('click', function(){
		var token = localStorage.getItem('legu_token');
		var userId = localStorage.getItem('legu_user_id');
		var params = {
			'token':token,
			'user_id':userId,
		}
		$.ajax({
			url:'http://live.legu360.com/api/user/getuserinfo',
			type:'get',
			data:params,
			dataType:'json',
			success:function(data){
				if (data.err_code != 0) {
					$("#errReport p").html(data.err_msg);
					$("#errReport").css("display","block");
					return false;
				}
				$(".lightBox").css("display","block");
				$("#per-info").css("display","block");
				$("#per-pwd").css("display","none");
				$(".sign").css("display","none");
				$(".del").css("display","block");
				$(".dropdown-menu").css("display","none")
				$("#fix_nickname").val(data.data.nickname);
				$("#fix_avatar").attr('src', data.data.avatar);
			}
		})
	})
	$("#sub_userinfo").on('click', function(){
		var token = localStorage.getItem('legu_token');
		var userId = localStorage.getItem('legu_user_id');
		var nickname = $("#fix_nickname").val();
		var avatar = $('#fix_avatar').attr('src');
		var params = {
			'token':token,
			'user_id':userId,
			'nickname': nickname,
			'avatar':avatar
		}
		$.ajax({
			type:"post",
			url:"http://live.legu360.com/api/user/update",
			async:true,
			dataType:'json',
			data:params,
			success:function(data){
				if (data.err_code != 0) {
							$("#errReport p").html(data.err_msg);
							$("#errReport").css("display","block");
							return false;
				}
				$("#per-info").css("display","none");
				$(".lightBox").css("display","none");
				$(".del").css("display","none");
//				$("#per-info").css("display","block");
			}
		});
	})
})