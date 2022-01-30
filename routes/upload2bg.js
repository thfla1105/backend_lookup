var mysql = require('mysql');
var express = require('express');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const { PythonShell }=require('python-shell');
var router = express.Router();

var _storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let imgName=file.originalname;
		let split_arr=imgName.split("_");
		let id=split_arr[0];
		let imgPath='/workspace/mj_nodejs/public/upload2bg/';
		if(!fs.existsSync(imgPath)){
		   	fs.mkdirSync(imgPath);
		}
      	cb(null, imgPath);
    },	
	filename: function(req, file, cb) {
		return crypto.pseudoRandomBytes(16, function(err, raw) {
		if(err) {
			return cb(err);
		}
		//return cb(null, ""+(raw.toString('hex')) + (path.extname(file.originalname)));
		return cb(null, file.originalname);
		//return cb(null, imgName);	
		})
	}
	
});

//사진 업로드
router.post('/pic2', 
	multer({
		storage: _storage,
		limits: { fieldSize: 1024*1024 * 1024 * 1024,
					fileSize: 1024*1024*1024*1024
				},
		fileFilter: function(req, file, callback, error) {
			var ext = path.extname(file.originalname);
			var error_msg = error instanceof multer.MulterError
			if(error_msg) {
				return callback(null, false, new MulterError('LIMIT_FILE_SIZE'))
			}
			callback(null,true)
		}
	}).single('upload2bg'), function (req, res, next) {
		let file = req.file;
		//const files = req.files;
		let originalName = '';
		let fileName = '';
		let mimeType = '';
		let size = 0;
	/*
		if(error.code === 'LIMIT_FILE_SIZE') {
				req.fileSizeError = "Image more than 1MB!"
				res.status(500).send({message:req.fileSizeError});
		}
		*/
		try {

			if(file) {
				originalName = file.originalname;
				fileName = file.fileName;//file.fileName
				mimeType = file.mimetype;
				size = file.size;
				//console.log("execute"+fileName);
				console.log("execute");
				//console.log("파일 이름: ", fileName)
				console.log("파일 이름: ", originalName)
				//console.log("이미지 경로 ",file.location );
			} else{ 
				console.log("request is null");
			}

		} catch (err) {
			console.dir(err.stack);
		}
		var id=originalName.split('_')[0];
		let imgPath='/workspace/mj_nodejs/public/upload2bg/'+originalName;
		let options = {
			mode: 'text',
			pythonPath: '/usr/local/bin/python3.7', // Python의 경로를 나타낸다
			pythonOptions: ['-u'], // get print results in real-time
			scriptPath: '/workspace/mj_nodejs/python', // Python Script가 있는 경로
				//args: './upload/'+id+'/'+imgName // Python Script에 넘겨줄 인자 목록, 원래는 []이걸로 감쌌음
			args: [imgPath, id] //python파일(single_predict.py)로 보내는 인자(여러개 가능)
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
				message = '사진 removeBg 성공';
				console.log(resultCode);
				console.log(message);
			}

			console.log('result: %s', result); //python파일(single_predict.py)에서 print한 결과값

			//var filename='/public/upload2bg/removeBg.jpg';
			//var file = fs.createReadStream(`./${filename}`, {flags: 'r'} );
			//console.log("result", result);
			//file.pipe(res)
			res.end(JSON.stringify(result));
		});	
	//console.log(req.file);
	//console.log(req.body);
	//res.redirect("../upload/" + req.file.originalname);//fileName	
	//return res.status(200).end();
});


//router.use(file)
module.exports = router;