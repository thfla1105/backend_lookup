var mysql = require('mysql');
var express = require('express');
const crypto = require('crypto');
//var app = express();
//var bodyParser = require('body-parser');
var router = express.Router();
const fs = require("fs");
var url = require('url');
const {spawn} = require("child_process");
const { PythonShell }=require('python-shell');
var connection = mysql.createConnection({
    host: "",
    user: "",
    database: "",
    password: "",
    port: 53295
});

router.post("/", (req, res, next) => {
	global.resultFromPython1;
	global.resultFromPython2;
	console.log("preference_lookbook");
	var id=req.body.userId;
	var purpose=req.body.purpose;
	var temp=req.body.tempConvert;
	var PreferStyle;
	var preferlist;
	var sql='SELECT Purpose, style, COUNT(style) AS cnt FROM LookUP.PostItem Left Join LookUP.Style On LookUP.PostItem.imageID = LookUP.Style.imageID where userID=? and Purpose=? group by style order by cnt desc limit 1;';
	var param=[id,purpose];
	console.log("Style Information "+id+" "+purpose);
		
	var query=connection.query(sql, param,function (err,results) { 
		console.log(results)
		
		if(results.length==0){
			res.json(null);
			return 0;
		}else{
		let PreferStyle=results[0].style
		console.log("PreferStyle: " +PreferStyle);
		
		
		
		var sql2='SELECT LookUP.Style.imageID,imageFile,coordiID, style, dress, top, bottom, outwear, temp, coordi_literal, UserID, rating FROM LookUP.Style Left Join LookUP.CoordiList On LookUP.Style.coordiID = LookUP.CoordiList.idnum Right Join LookUP.Rating On LookUP.Style.imageID = LookUP.Rating.imageID WHERE LookUP.Rating.UserID=? and style=? order by rating desc limit 3;';

		var param2= [id, PreferStyle];
		var preferCoordilist=[];		
		var query2= connection.query(sql2,param2, function (err,result) { 		

			for (var i=0;i<result.length;i++){	
				console.log("result "+result[i].style+" "+result[i].cnt);
				preferCoordilist.push(result[i].coordiID);


			}
				console.log(preferCoordilist);

			let options = {
				mode: 'text',
				pythonPath: '/usr/local/bin/python3.7', // Python의 경로를 나타낸다
				pythonOptions: ['-u'], // get print results in real-time
				scriptPath: '/workspace/mj_nodejs/python', // Python Script가 있는 경로
					//args: './upload/'+id+'/'+imgName // Python Script에 넘겨줄 인자 목록, 원래는 []이걸로 감쌌음
				args: [preferCoordilist, temp ,PreferStyle]//python파일(single_predict.py)로 보내는 인자(여러개 가능)
			};

			PythonShell.run('preferCoordi.py', options, function (err, result) {
				var resultCode = 404;
				var message = '에러가 발생했습니다';
				var category='1';
				console.log("%s", options.args);

				if (err) {
						console.log(err);
				} 
				else {
					resultCode = 200;
					message = '코디 리스트 로드 성공';
					console.log(resultCode);
					console.log(message);
				}

				console.log('result: %s', result); //python파일(single_predict.py)에서 print한 결과값
				var result1=result[0].split('[')[1];
				//console.log(result1.split(',')[0]);	//idnum1
				var result2=result1.split(',')[1];
				var result3=result2.split(']')[0];
				//console.log(result3.split(' ')[1]); //idnum2
				global.resultFromPython1=result1.split(',')[0];
				global.resultFromPython2=result3.split(' ')[1];
				
				console.log("global.resultFromPython1: %d", global.resultFromPython1);
				console.log("global.resultFromPython2: %d", global.resultFromPython2);
				
				var sqlQ='SELECT * FROM CoordiList where idnum=?;';
				var StyleList =[];
				let param1=[global.resultFromPython1];
				let param2=[global.resultFromPython2];

				var sql_idnum1=mysql.format(sqlQ, param1);
				var sql_idnum2=mysql.format(sqlQ, param2);

				var resultCode_final=404;
				var message_final='에러가 발생했습니다.';

				var query3=connection.query(sql_idnum1+sql_idnum2, function (err,results) { 
					if (err) {
						console.log(err);
					}
					else{
						for (var i=0;i<2;i++){   
							console.log("results[i].length: %d", results[i].length);
							console.log("results[i].idnum: %d", results[i][0].idnum);
							StyleList.push({
							 "idnum":results[i][0].idnum,
							 "styles":results[i][0].styles,
							 "dress":results[i][0].dress,
							 "top":results[i][0].top,
							 "bottom":results[i][0].bottom,
							 "outwear":results[i][0].outwear,
							 "temp":results[i][0].temp,
							 "weight":results[i][0].weight,
							"count":results[i][0].count,
							"coordi_literal":results[i][0].coordi_literal      
							});
							
						}
						console.log(StyleList);
						//console.log(StyleList);
						//res.end(JSON.stringify(StyleList));
						res.json({StyleList});
					}

				});
			});
			
		});
		}
    });

	//console.log(global.resultFromPython);
    //var idnum1=global.resultFromPython.split(' ')[0];
   // var idnum2=global.resultFromPython.split(' ').reverse()[0];
	//var idnum1=global.resultFromPython[0];
	//var idnum2=global.resultFromPython[1];
  //  console.log("idnums: %d, %d", idnum1, idnum2);
});



router.post('/result', function(req, res){
	let topSelected="x"; //0이면 아예 top이 포함되지 않는 경우, 1이면 top category가 저장된 게 없음
	let bottomSelected="x"; 
	let outerSelected="x"; 
	let dressSelected="x"; 
	let accSelected="x"; 
	
	let resultCode_top=200;
	let message_top="top 찾음";
	let resultCode_bottom=200;
	let message_bottom="bottom 찾음";
	let resultCode_outer=200;
	let message_outer="outer 찾음";
	let resultCode_dress=200;
	let message_dress="dress 찾음";
	let resultCode_acc=200;
	let message_acc="acc 찾음";
	
	let id = req.body.userId;
	let top=req.body.top;
	let bottom=req.body.bottom;
	let outer=req.body.outer;
	let dress=req.body.dress;
	let acc=req.body.acc;
	
	let sql = 'select * from Closet where UserID = ? and Category=?;';
	//let sql_bottom= 'select * from Closet where UserID = ? and Category=?';
	//let sql_outer= 'select * from Closet where UserID = ? and Category=?';
	//let sql_dress= 'select * from Closet where UserID = ? and Category=?';
	//let sql_acc= 'select * from Closet where UserID = ? and Category=?';
	
	let params_top = [id, top];
	let params_bottom = [id, bottom];
	let params_outer = [id, outer];
	let params_dress = [id, dress];
	let params_acc = [id, acc];
	
	var sql_top=mysql.format(sql, params_top);
	var sql_bottom=mysql.format(sql, params_bottom);
	var sql_outer=mysql.format(sql, params_outer);
	var sql_dress=mysql.format(sql, params_dress);
	var sql_acc=mysql.format(sql, params_acc);
	
	connection.query(sql_top+sql_bottom+sql_outer+sql_dress+sql_acc, function(err, results) {
		if (err) {
			resultCode_top = 404;
			message_top = '에러가 발생했습니다';
			console.log(err);
		}
		else{
			//top
			switch(results[0].length){
				case 0:
					if(top=="x"){
						topSelected="x";
						resultCode_top=0;
						message_top="top category는 포함이 되지 않습니다."
					}
					else{
						topSelected="1";
						resultCode_top=204;
						message_top="저장된 옷이 너무 적어서 룩북을 생성할 수 없습니다.";
					}
					break;
				case 1:
					topSelected=results[0][0].Url;
					resultCode_top = 200;
					message_top="결과가 한 개";
					//console.log(resultCode_top);
					break;
				default: 
					//var topResult=results[0][Math.floor(Math.random() * (results[0].length-1)) ].Url;
					//console.log("topResult: "+topResult);
					topSelected = results[0][Math.floor(Math.random() * (results[0].length-1)) ].Url;
					resultCode_top=200;
					message_top="결과가 한 개 이상이며 랜덤으로 하나만";
					//console.log(resultCode_top);
			}
			//bottom
			switch(results[1].length){
				case 0:
					if(bottom=="x"){
						bottomSelected="x";
						resultCode_bottom=0;
						message_bottom="bottom category는 포함이 되지 않습니다."
					}
					else{
						bottomSelected="1";
						resultCode_bottom=204;
						message_bottom="저장된 옷이 너무 적어서 룩북을 생성할 수 없습니다.";
					}
					break;
				case 1:
					bottomSelected=results[1][0].Url;
					resultCode_bottom = 200;
					message_bottom="결과가 한 개";
					//console.log(resultCode_bottom);
					break;
				default: 
					//var bottomResult=results[1][Math.floor(Math.random() * (results[1].length-1)) ].Url;
					//console.log("bottomResult: "+bottomResult);
					bottomSelected = results[1][Math.floor(Math.random() * (results[1].length-1)) ].Url;
					resultCode_bottom=200;
					message_bottom="결과가 한 개 이상이며 랜덤으로 하나만";
					//console.log(resultCode_bottom);
			}
			//outer
			switch(results[2].length){
				case 0:
					if(outer=="x"){
						outerSelected="x";
						resultCode_outer=0;
						message_outer="outer category는 포함이 되지 않습니다."
					}
					else{
						outerSelected="1";
						resultCode_outer=204;
						message_outer="저장된 옷이 너무 적어서 룩북을 생성할 수 없습니다.";
					}
					break;
				case 1:
					outerSelected=results[2][0].Url;
					resultCode_outer = 200;
					message_outer="결과가 한 개";
					//console.log(resultCode_outer);
					break;
				default: 
					//var outerResult=results[2][Math.floor(Math.random() * (results[2].length-1)) ].Url;
					//console.log("outerResult: "+outerResult);
					outerSelected = results[2][Math.floor(Math.random() * (results[2].length-1)) ].Url;
					resultCode_outer=200;
					message_outer="결과가 한 개 이상이며 랜덤으로 하나만";
					//console.log(resultCode_outer);
			}
			//dress
			switch(results[3].length){
				case 0:
					if(dress=="x"){
						dressSelected="x";
						resultCode_dress=0;
						message_dress="dress category는 포함이 되지 않습니다."
					}
					else{
						dressSelected="1";
						resultCode_dress=204;
						message_dress="저장된 옷이 너무 적어서 룩북을 생성할 수 없습니다.";
					}
					break;
				case 1:
					dressSelected=results[3][0].Url;
					resultCode_dress = 200;
					message_dress="결과가 한 개";
					//console.log(resultCode_dress);
					break;
				default: 
					//var dressResult=results[3][Math.floor(Math.random() * (results[3].length-1)) ].Url;
					//console.log("dressResult: "+dressResult);
					dressSelected = results[3][Math.floor(Math.random() * (results[3].length-1)) ].Url;
					resultCode_dress=200;
					message_dress="결과가 한 개 이상이며 랜덤으로 하나만";
					//console.log(resultCode_dress);
			}
			//acc
			switch(results[4].length){
				case 0:
					if(acc=="x"){
						accSelected="x";
						resultCode_acc=0;
						message_acc="acc category는 포함이 되지 않습니다."
					}
					else{
						accSelected="1";
						resultCode_acc=204;
						message_acc="저장된 옷이 너무 적어서 룩북을 생성할 수 없습니다.";
					}
					break;
				case 1:
					accSelected=results[4][0].Url;
					resultCode_acc = 200;
					message_acc="결과가 한 개";
					//console.log(resultCode_acc);
					break;
				default: 
					//var accResult=results[4][Math.floor(Math.random() * (results[4].length-1)) ].Url;
					//console.log("accResult: "+accResult);
					accSelected = results[4][Math.floor(Math.random() * (results[4].length-1)) ].Url;
					resultCode_acc=200;
					message_acc="결과가 한 개 이상이며 랜덤으로 하나만";
					//console.log(resultCode_acc);
			}
		}
	
		res.json({
			'top':topSelected, //0이면 아예 top이 포함되지 않는 경우, 1이면 top category가 저장된 게 없음
			'bottom':bottomSelected,
			'outer':outerSelected,
			'dress':dressSelected,
			'acc':accSelected,

			'resultCode_top':resultCode_top,
			'message_top':message_top,

			'resultCode_bottom':resultCode_bottom,
			'message_bottom':message_bottom,

			'resultCode_outer':resultCode_outer,
			'message_outer':message_outer,

			'resultCode_dress':resultCode_dress,
			'message_dress':message_dress,

			'resultCode_acc':resultCode_acc,
			'message_acc':message_acc
		});
	
		console.log("topSelected: "+topSelected);
		console.log("bottomSelected: "+bottomSelected);
		console.log("outerSelected: "+outerSelected);
		console.log("dressSelected: "+dressSelected);
		console.log("accSelected: "+accSelected);
		
		console.log('resultCode_top: '+resultCode_top);
		console.log('message_top: '+message_top);
		
		console.log('resultCode_bottom: '+resultCode_bottom);
		console.log('message_bottom: '+message_bottom);
		
		console.log('resultCode_outer: '+resultCode_outer);
		console.log('message_outer: '+message_outer);
		
		console.log('resultCode_dress: '+resultCode_dress);
		console.log('message_dress: '+message_dress);
		
		console.log('resultCode_acc: '+resultCode_acc);
		console.log('message_acc: '+message_acc);
	});
});


module.exports = router;