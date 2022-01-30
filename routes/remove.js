var mysql = require('mysql');
var express = require('express');
const {spawn} = require("child_process");
//var app = express();
//var bodyParser = require('body-parser');
var router = express.Router();
const fs = require("fs");
const url = require("url");

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

//python파일 실행하기!!!!!
const { PythonShell }=require('python-shell');

var connection = mysql.createConnection({
    host: "54.180.195.102",
    user: "MJ",
    database: "LookUP",
    password: "ctrls1886",
    port: 53295
});

/*
router.post('/model', async function(req, res){
	let id=req.body.userId;
	let imgName=req.body.imgName;
	let imgPath='../upload/'+id+'/'+imgName;
	
	let options = {
		mode: 'text',
		pythonPath: '/usr/local/bin/python3.7', // Python의 경로를 나타낸다
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: '/workspace/mj_nodejs/python', // Python Script가 있는 경로
			//args: './upload/'+id+'/'+imgName // Python Script에 넘겨줄 인자 목록, 원래는 []이걸로 감쌌음
		args: imgPath
	};
});
*/

//카테고리 예측함
router.post('/remove', async function(req, res){
	let imgPath='mj_nodejs/images/outer_cardigan_40.jpg';
	
	let options = {
		mode: 'text',
		pythonPath: '/usr/local/bin/python3.7', // Python의 경로를 나타낸다
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: '/workspace/mj_nodejs/python', // Python Script가 있는 경로
			//args: './upload/'+id+'/'+imgName // Python Script에 넘겨줄 인자 목록, 원래는 []이걸로 감쌌음
		args: imgPath //python파일(single_predict.py)로 보내는 인자(여러개 가능)
	};
	
	PythonShell.run('removeBg.py', options, function (err, result) {
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
		
		var filename='/public/upload2bg/removeBg.jpg';
		var file = fs.createReadStream(`./${filename}`, {flags: 'r'} );
 
   		file.pipe(res)
		
		
		
	
		
    });
});
		

/*
router.post('/model', async function(req, res){
	let dataToSend;
	const python = spawn('python3', ['../python/test.py']);
	python.stdout.on('data', (data) => {
		dataToSend=data.toString();
	});
	python.on('close', (code) => {
		res.send(dataToSend);
	});
}
*/
	
module.exports = router;