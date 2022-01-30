var mysql = require('mysql');
var express = require('express');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const { PythonShell }=require('python-shell');
const sharp = require('sharp');



var router = express.Router();

var _storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let imgName=file.originalname;
		let split_arr=imgName.split("_");
		let id=split_arr[0];
		let imgPath='/workspace/mj_nodejs/public/upload/'+id+'/';
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
	
			
	/*
	filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
	*/
});

//사진 업로드
router.post('/pic', 
	multer({
		storage: _storage,
		limits: { fieldSize: 1024*1024 * 1024 * 1024,
					fileSize: 1024*1024*1024*1024
				}
	}).single('upload'), async (req, res) => {
	//.single('image')
	
	
	try {

		let file = req.file;
		//const files = req.files;
		let originalName = '';
		let filePath='';
		let fileName = '';
		let mimeType = '';
		let size = 0;

		if(file) {
			originalName = file.originalname;
			filename = file.fileName;//file.fileName
			mimeType = file.mimetype;
			size = file.size;
			filePath=req.file.path;
			//console.log("execute"+fileName);
			console.log("execute");
			//console.log("이미지 경로 ",file.location );
			console.log("file.originalName", originalName);
			console.log("이미지 경로 ",req.file.path);
			console.log("req.file.destination", req.file.destination);
			
			await sharp(req.file.path.toString())
			.resize(500, 600)
			.png({ quality: 100 })
			.toFile(
				//path.resolve(req.file.destination,'resized',file)
				path.resolve(req.file.destination.toString(),"resized.png")
			)
			fs.unlinkSync(req.file.path.toString())
			
			fs.rename(req.file.destination+"resized.png",filePath,function(err){ 
				if (err === null) { 
					console.log('success'); 
				} else { 
					console.log('fail'); 
				} 
				
			});
		   //res.redirect('/pic');
			
		} else{ 
			console.log("request is null");
		}

	} catch (err) {

		console.dir(err.stack);
	}
	

	//console.log(req.file);
	//console.log(req.body);
	//res.redirect("../upload/" + req.file.originalname);//fileName
	
	return res.status(200).end();

});


/*
router.post('/pic', 
	multer({
		storage: _storage,
		limits: { fieldSize: 25 * 1024 * 1024 }
	}).single('upload'), function (req, res) {

	try {

		let file = req.file;
		//const files = req.files;
		let originalName = '';
		let fileName = '';
		let mimeType = '';
		let size = 0;

		if(file) {
			originalName = file.originalname;
			filename = file.fileName;//file.fileName
			mimeType = file.mimetype;
			size = file.size;
			console.log("execute"+fileName);
		} else{ 
			console.log("request is null");
		}

	} catch (err) {

		console.dir(err.stack);
	}

	console.log(req.file);
	console.log(req.body);
	res.redirect("/upload/" + req.file.originalname);//fileName

	return res.status(200).end();

});
*/
module.exports = router;