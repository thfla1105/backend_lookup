var mysql = require('mysql');
var express = require('express');
const {spawn} = require("child_process");

var router = express.Router();



//python파일 실행하기!!!!!
const { PythonShell }=require('python-shell');

var connection = mysql.createConnection({
    host: "",
    user: "",
    database: "",
    password: "",
    port: 53295
});



//카테고리 예측함
router.post('/model', async function(req, res){
	let id=req.body.userId;
	let imgName=req.body.imgName;
	let imgPath='/workspace/mj_nodejs/public/upload/'+id+'/'+imgName;
	
	let options = {
		mode: 'text',
		pythonPath: '/usr/local/bin/python3.7', // Python의 경로를 나타낸다
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: '/workspace/mj_nodejs/python', // Python Script가 있는 경로
			//args: './upload/'+id+'/'+imgName // Python Script에 넘겨줄 인자 목록, 원래는 []이걸로 감쌌음
		args: imgPath //python파일(single_predict.py)로 보내는 인자(여러개 가능)
	};
	
	PythonShell.run('single_predict.py', options, function (err, result) {
		var resultCode = 404;
		var message = '에러가 발생했습니다';
		var category='1';
		console.log("%s", options.args);
		
		if (err) {
				console.log(err);
		} 
		else {
			resultCode = 200;
			message = '예측값 가져오기 성공';
			console.log(resultCode);
			console.log(message);
		}
		
      	console.log('result: %s', result); //python파일(single_predict.py)에서 print한 결과값
		
		res.json({
			'code': resultCode,
			'message': message,
			'category': result
		});
    });
});
		
//카테고리, url정보를 db에 저장
router.post('/save', async function(req, res){
	let id=req.body.userId;
	let imgName=req.body.imgName;
	let category=req.body.category;
	//let imgPath='/workspace/mj_nodejs/public/upload/'+id+'/'+imgName;
	let imgPath='https://lookup.run.goorm.io/upload/'+id+'/'+imgName;
	
	// 삽입을 수행하는 sql문.
		var sql = 'INSERT INTO Closet (UserID, Category, Url) VALUES (?, ?, ?)';
		var params = [id, category, imgPath];

		// sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
		connection.query(sql, params, function (err, result) {
			var resultCode = 404;
			var message = '에러가 발생했습니다';

			if (err) {
				console.log(err);
			} else {
				resultCode = 200;
				message = 'category db 삽입 성공.';
				console.log(resultCode);
			}

			res.json({
				'code': resultCode,
				'message': message
			});
		});
});

	
module.exports = router;