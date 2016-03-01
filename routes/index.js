var express = require('express');
var router = express.Router();

/* GET home page. */
var question = new Array();
question[0] = "女人";
question[1] = "男人";
question[2] = "上";
question[3] = "下";
question[4] = "左";
question[5] = "右";
var min = 0;
var max = 5;
var radomQuestion = "";//抽到的题目
var radomQuestionNumber = 0;//抽到的题目序号
var playerNumber = 0;//已准备游戏人数
var nowPlayer = "";//已准备游戏人名
var playerSequence = new Array();//玩家序号
for(var i = 0; i < 10; i++){
	playerSequence[i] = "";
}//初始玩家化数组
var playerSequenceScore = new Array();//玩家得分
for (var i = 0; i < 10; i++){
	playerSequenceScore[i] = 0;
}//初始玩家得分数组
var gameStatus = 0;//游戏状态
var drawPlayer = 0;//轮到画的用户序号
var index;
var svg = new Array();
var color = new Array();//svg数据
router.get('/', function(req,res,next){
	res.render('index');
});
router.post('/playerEnter',function(req,res){
	var sequenceNumber;
	playerNumber = playerNumber + 1;
	nowPlayer = nowPlayer + req.body.userName + " ";
	for(var i = 0; i < 10; i++){
		if(playerSequence[i]==""){
			playerSequence[i] = req.body.userName;
			sequenceNumber = i + 1;
			break;
		}
	}
	console.log(playerNumber);
	console.log(nowPlayer);
	console.log(playerSequence);
	res.json({playerNumber: sequenceNumber});
	res.end();
})//用户准备游戏
router.post('/playerLeave',function(req,res){
	playerNumber = playerNumber - 1;
	removeName = req.body.userName;
	nowPlayer = nowPlayer.replace(removeName + " ","");
	for(var i = 0; i < 10; i++){
		if(playerSequence[i]==removeName){
			playerSequence[i] = "";
		}
	}
	console.log(playerNumber);
	console.log(nowPlayer);
	console.log(playerSequence);
	res.end();
})//用户取消准备游戏
router.post('/checkGameStatus',function(req,res){
	console.log(nowPlayer);
	res.json({nowPlayer: nowPlayer,drawPlayer: drawPlayer,gameStatus: gameStatus,question:radomQuestion});
	res.end();
});//用户检查游戏状态
router.post('/startGame',function(req,res){
	gameStatus = 1;
	if(drawPlayer <= playerNumber){
		drawPlayer = drawPlayer + 1;
	}
	else drawPlayer = 1;
	while(playerSequence[drawPlayer-1]==""){
		if(drawPlayer <= playerNumber){
			drawPlayer = drawPlayer + 1;
		}
		else drawPlayer = 1;
	}//防空
	radomQuestionNumber = Math.floor(Math.random()*(max-min+1)+min);
	radomQuestion = question[radomQuestionNumber];
	console.log("startGame");
	console.log(radomQuestion);
	console.log(gameStatus);
	console.log(drawPlayer);
	res.json({drawPlayer: drawPlayer,gameStatus: gameStatus,question:radomQuestion});
	res.end();
});//序号为1的用户开始游戏
router.post('/sendAnswer',function(req,res){
	console.log(req.body.myAnswer);
	console.log(radomQuestion);
	if(req.body.myAnswer==radomQuestion){
		var scoreNumber = req.body.myNumber;
		scoreNumber = scoreNumber - 1;
		playerSequenceScore[scoreNumber] = playerSequenceScore[scoreNumber] + 1;
		console.log(playerSequenceScore);
		res.json({correct: 1});
		res.end();
	}
	else{
		console.log(playerSequenceScore);
		res.json({correct: 0});
		res.end();
	}
});//接受答案
router.post('/sendMessage',function(req,res,next){
	index = null;
	svg = new Array;
	color = new Array();
	index = req.body.index;
	for(var i = 0; i < index; i++){
		svg[i] = req.body.svg[i];
	}
	for(var i = 0; i < index; i++){
		color[i] = req.body.color[i];
	}
	/*console.log(index);
	console.log(svg);
	console.log(color);*/
	res.end();
});//画的用户发送消息
router.post('/getMessage',function(req,res,next){
	/*console.log(index);
	console.log(svg);
	console.log(color);*/
	res.json({index: index,svg: svg,color: color});
	res.end();
});//猜的用户获取消息

module.exports = router;
