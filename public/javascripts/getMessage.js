$(document).ready(function(){
	svg = "<svg class='svg' width='100%' height='100%'><path class='path' d=''/></svg>";
	setInterval("getMessage()",50);
});
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
	});
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
	});
}








