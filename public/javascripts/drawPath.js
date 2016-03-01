$(document).ready(function(){
	var index = 0;
	var color = "black";
	var svg = "<svg class='svg' width='100%' height='100%'><path class='path' d='M0 0'/></svg>";
	$(".black").css("box-shadow","0 0 5px black");
	$(document).mousedown(function(){
		if(drawPlayer==myNumber){
			$(document.body).append(svg);
			var x = event.x;
			var y = event.y;
			var attr = $(".path").eq(index).attr("d");
			attr = attr + " M" + x + " " + y;
			$(".path").eq(index).attr("d",attr);//获取鼠标当前位置并写到svg上
			$(".path").eq(index).css("stroke",color);
			$(document).bind("mousemove",function(){
				var x = event.x;
				var y = event.y;
				var attr = $(".path").eq(index).attr("d");
				attr = attr + " L" + x + " " + y;
				$(".path").eq(index).attr("d",attr);//当mousedown时把mousemove绑定到document上
			});
		}
	});
	$(document).mouseup(function(){
		if(drawPlayer==myNumber){
			var x = event.x;
			var y = event.y;
			$(document).unbind("mousemove");
			index = index + 1;//当mouseup时把mousemove从document上解除绑定
		}
	});
	$(".btn").click(function(){
		$(".btn").css("box-shadow","");
		$(this).css("box-shadow","0 0 5px black");
		color = $(this).css("background-color");//切换颜色
	});
	/*$(".reset").click(function(){
		$(".svg").remove();
		index = 0;
	});*/
});