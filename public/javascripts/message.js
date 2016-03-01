$(document).ready(function(){
	svg = "<svg class='svg' width='100%' height='100%'><path class='path' d=''/></svg>";
	myNumber = 0;
	userName = "";
	status = 0;
	drawPlayer = -1;
	sec = 0;
	question = "";
	questionStatus = 0;
	myAnswer = "";
	checkGameStatusID = setInterval("checkGameStatus()",1000);
	$(".ready").click(function(){
		if($(".myNumber .val").val()==""){
			alert("用户名不能为空");
			return false;
		}
		if(status == 0){
			userName = $(".myNumber .val").val();
			var postJson = { "userName" : userName};
			$.ajax({
				url: "http://localhost:8080/playerEnter",
				type: "POST",
				data: postJson,
				success: function(getdata){
					myNumber = getdata.playerNumber;
					if(myNumber==1){
						$(".begin").css("display","block");
					}
					$(".ready").text("已准备");
					$(".myNumber .val").attr("disabled","disabled");
					status = 1;
				}
			});
			return false;
		}//用户准备时获取自己的游戏序号
		if(status == 1){
			var postJson = { "userName" : userName};
			$.ajax({
				url: "http://localhost:8080/playerLeave",
				type: "POST",
				data: postJson,
				success: function(getdata){
					$(".begin").css("display","none");
					$(".ready").text("未准备");
					$(".myNumber .val").removeAttr("disabled");
					status = 0;
				}
			});
		}//用户取消准备
	})
	$(window).unload(function(){
		var postJson = { "userName" : userName};
		$.ajax({
			url: "http://localhost:8080/playerLeave",
			type: "POST",
			data: postJson,
			success: function(getdata){
			}
		});
	})//用户离开时告诉服务器
	$(".begin").click(function(){
		startGame();
	})
	$(".submitAnswer").click(function(){
		if(questionStatus==0){
			myAnswer = $(".inputAnswer").val();
			var postJson = { "myNumber" : myNumber, "myAnswer" : myAnswer};
			$.ajax({
				url: "http://localhost:8080/sendAnswer",
				type: "POST",
				data: postJson,
				success: function(getdata){
					if(getdata.correct==1){
						questionStatus = 1;
						alert("答对了");
					}
					else{
						alert("答错了");
					}
				}
			});//发送答案
		}
	});
});
function startGame(){
	$.ajax({
		url: "http://localhost:8080/startGame",
		type: "POST",
		success: function(getdata){
			drawPlayer = getdata.drawPlayer;
			if(getdata.gameStatus==1){
				clearInterval(checkGameStatusID);
				$(".myNumber,.ready,.begin").css("display","none");
				$(".nowPlayer .attr").text("游戏中用户：");
				questionStatus = 0;
				question = getdata.question;
				$(".svg").remove();
				index = 0;
				if(getdata.drawPlayer==myNumber){
					setInterval("sendMessage()",50);
					$(".reset,.btn").css("display","block");
					setTimeout("startGame()",60000);
					sec = 60
					countDown();
					$(".question").text(question);
					$(".inputAnswer,.submitAnswer").css("display","none");
				}
				else{
					setInterval("getMessage()",50);
					$(".reset,.btn").css("display","none");
					setTimeout("checkGameStatus()",60000);
					sec = 60;
					countDown();
					$(".inputAnswer,.submitAnswer").css("display","block");
				}
			}
		}
	});
}
function checkGameStatus(){
	$.ajax({
		url: "http://localhost:8080/checkGameStatus",
		type: "POST",
		success: function(getdata){
			$(".nowPlayer .val").text(getdata.nowPlayer);
			if(getdata.gameStatus==1){
				clearInterval(checkGameStatusID);
				$(".myNumber,.ready,.begin").css("display","none");
				$(".nowPlayer .attr").text("游戏中用户：");
				question = getdata.question;
				questionStatus = 0;
				$(".svg").remove();
				index = 0;
				if(getdata.drawPlayer==myNumber){
					setInterval("sendMessage()",50);
					$(".reset,.btn").css("display","block");
					setTimeout("startGame()",60000);
					sec = 60
					countDown();
					$(".question").text(question);
					$(".inputAnswer,.submitAnswer").css("display","none");
				}
				else{
					setInterval("getMessage()",50);
					$(".reset,.btn").css("display","none");
					setTimeout("checkGameStatus()",60000);
					sec = 60;
					countDown();
					$(".inputAnswer,.submitAnswer").css("display","block");
				}
			}
		}
	});
}
function sendMessage(){
	var index = 0;
	var svg = new Array();
	var color = new Array();
	$(".path").each(function(){
		svg[index] = $(this).attr("d");
		color[index] = $(this).css("stroke");
		index = index + 1;
	});
	var postJson = { "index" : index, "svg" : svg, "color" : color };
	$.ajax({
		url: "http://localhost:8080/sendMessage",
		type: "POST",
		data: postJson,
		success: function(getdata){
		}
	});//发送svg数据
}
function getMessage(){
	$.ajax({
		url: "http://localhost:8080/getMessage",
		type: "POST",
		success: function(getdata){
			var index = getdata.index;
			var svgData = getdata.svg;
			var colorData = getdata.color;
			for(var i = 0; i < index; i++){
				$(document.body).append(svg);
				$(".path").eq(i).attr("d",svgData[i]);
				$(".path").eq(i).css("stroke",colorData[i]);
			}
		}
	});//获取svg数据
}
function countDown(){
	if(sec>0){
		$(".time").text(sec);
		sec = sec - 1;
		setTimeout("countDown()",1000);
	}
}








