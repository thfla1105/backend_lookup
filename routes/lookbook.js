
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
console.log("LookBOok mysql success!");


const data=fs.readFileSync('./SR_StyleList/json_data/stylelist.json','utf8');

router.get("/prefer", (req, res, next) =>{
	console.log("Purpose, Style Preference");
	var id='ctrls';
	var purpose=1;
	var temp=3;
	//var id=req.query.userId;
	//var purpose=req.query.Purpose;
	//var temp=req.query.temp;
	var PreferStyle;
	var preferlist;
	var sql='SELECT Purpose, style, COUNT(style) AS cnt FROM LookUP.PostItem Left Join LookUP.Style On LookUP.PostItem.imageID = LookUP.Style.imageID where userID="testid" and Purpose=1 group by style order by cnt desc limit 1;';
		var param=[id,purpose];
		console.log("Style Information "+id+" "+purpose);
		
	
		var query=connection.query(sql, param,function (err,results) { 
		 	
		/*for (var i=0;i<results.length;i++){	
			//console.log("result "+results[i].style+" "+results[i].cnt)
			preferlist.push(results[i].style);
			PreferStyle.push(
				{
				"style": results[i].style,
				"count": results[i].cnt	
					
				});
		}*/
			let PreferStyle=results[0].style
			console.log("PreferStyle: " +PreferStyle);
			//console.log("preferlist: "+preferlist);
			
			//var prefer=preferlist.toString()
		/*	for(var i in preferlist){
				preferlist[i]=JSON.stringify(preferlist[i]);
			}*/
			
			
			//console.log("prefer: "+preferlist);
			
			//res.end(JSON.stringify(StyleList));
		
	//connection.end();
	
	
	var sql2='SELECT LookUP.Style.imageID,imageFile,coordiID, style, dress, top, bottom, outwear, temp, coordi_literal, UserID, rating FROM LookUP.Style Left Join LookUP.CoordiList On LookUP.Style.coordiID = LookUP.CoordiList.idnum Right Join LookUP.Rating On LookUP.Style.imageID = LookUP.Rating.imageID WHERE LookUP.Rating.UserID="testid" and style="casual" order by rating desc limit 3;';
	
	var param2= [id, PreferStyle];
	
	var preferCoordilist=[];
	
	
	var query2= connection.query(sql2,id, function (err,result) { 
		
		
		for (var i=0;i<result.length;i++){	
			console.log("result "+result[i].style+" "+result[i].cnt);
			preferCoordilist.push(result[i].coordiID);
			/*preferCoordilist.push(
				{
				"imageID": result[i].imageID,
				"coordiID": result[i].coordiID,
				"style": result[i].style,
				"dress": result[i].dress,
				"top":result[i].top,
				"bottom":result[i].bottom,
				"outwear":result[i].outwear,
				"coordi_literal":result[i].coordi_literal,
				"UserID":result[i].UserID,
				"rating":result[i].rating	
				});*/
		
		}
			console.log(preferCoordilist);
			//res.end(JSON.stringify(StyleList));
		
	
	let csvPath='/workspace/mj_nodejs/csv/coordiList.csv';
		
		
	//preferCoordilist=JSON.stringify(preferCoordilist);	
	//preferCoordilist=json.dumps(preferCoordilist, separators=(',', ':'))
	let options = {
		mode: 'text',
		pythonPath: '/usr/local/bin/python3.7', // Python의 경로를 나타낸다
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: '/workspace/mj_nodejs/python', // Python Script가 있는 경로
			//args: './upload/'+id+'/'+imgName // Python Script에 넘겨줄 인자 목록, 원래는 []이걸로 감쌌음
		args: [preferCoordilist,3 ]//python파일(single_predict.py)로 보내는 인자(여러개 가능)
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
		
      	//console.log('result: %s', result); //python파일(single_predict.py)에서 print한 결과값
		console.log(result);
		//res.send(result);
		res.end(JSON.stringify(result));
		});
		
		
	});
		
		
    });	
	

});






module.exports = router;