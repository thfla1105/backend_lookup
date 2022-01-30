
var mysql = require('mysql');
var express = require('express');
const crypto = require('crypto');
var router = express.Router();

var connection = mysql.createConnection({
    host: "",
    user: "",
    database: "",
    password: "",
    port: 53295
});
console.log("mysql success!");


	router.post('/image', async function (req, res) {
		var id = req.body.userId;
		var category = req.body.category;
		var urlArr = new Array(); //배열선언
		var indexArr=new Array();
		var sql = 'select itemIndex, url from Closet where UserID = ? and Category = ?';
		var params=[id, category];
		console.log(req.body);
		connection.query(sql, params, function (err, result) {
			var resultCode = 404;
			var message = '에러가 발생했습니다';

			if (err) {
				console.log(err);
			} else {
				if (result.length === 0) {
					resultCode = 204;
					message = '이 카테고리는 존재하지 않습니다!';
				} 
				else {
					for(var i=0;i<result.length;i++){
						indexArr[i]=result[i].itemIndex;
						urlArr[i]=result[i].url;
					}
					resultCode = 200;
					message = '카테고리에 옷 존재합니다.';
				}
				console.log(resultCode);
				console.log(id);
				console.log(urlArr);
			}

			res.json({
				
				'code': resultCode,
				'message': message,
				'indexes': indexArr,
				'urls': urlArr
			});
		})
	});

router.post('/delete', async function (req, res) {
	var id = req.body.userId;
	var url = req.body.url;
	var sql = 'delete from Closet where UserID = ? and Url = ?';
	var params=[id, url];
	console.log(req.body);
	connection.query(sql, params, function (err, result) {
		var resultCode = 404;
		var message = '에러가 발생했습니다';

		if (err) {
			console.log(err);
		} else {
			if (result.length === 0) {
				resultCode = 204;
				message = '이 url은 존재하지 않습니다!';
			} 
			else {
				resultCode = 200;
				message = '삭제하였습니다.';
			}
			console.log(resultCode);
			console.log(id);
		}

		res.json({
			'code': resultCode,
			'message': message
		});
	})
});

router.post('/modify', async function (req, res) {
	var id = req.body.userId;
	var url = req.body.url;
	var category=req.body.category;
	var sql = 'update Closet set Category = ? where UserID = ? and Url = ?';
	var params=[category, id, url];
	console.log(req.body);
	connection.query(sql, params, function (err, result) {
		var resultCode = 404;
		var message = '에러가 발생했습니다';

		if (err) {
			console.log(err);
		} else {
			if (result.length === 0) {
				resultCode = 204;
				message = '잘못된 정보입니다.';
			} 
			else {
				resultCode = 200;
				message = '수정하였습니다.';
			}
			console.log(resultCode);
			console.log(id);
		}

		res.json({
			'code': resultCode,
			'message': message
		});
	})
});


module.exports = router;