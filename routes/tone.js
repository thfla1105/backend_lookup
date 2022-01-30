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

router.post('/tone1', function (req, res) {
		console.log(req.body);
		
		var InOn=req.body.InOn;
		var InOn2=req.body.InOn2;
		var InOn3=req.body.InOn3;
	

		// 삽입을 수행하는 sql문.
		//var sql = 'INSERT INTO Users (color1, color2, color3) VALUES (?, ?, ?)';
		var sql = 'INSERT INTO Tone(InOn, InOn2, InOn3) VALUES (?,?,?)';	
		var params = [InOn, InOn2, InOn3];
	
	
		// sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
		connection.query(sql, params, function (err, result) {
			var resultCode = 404;
			var message = '에러가 발생했습니다';

			if (err) {
				console.log(err);
			} else {
				resultCode = 200;
				message = 'tone1 전송에 성공했습니다.';
				console.log(resultCode);
			}

			res.json({
				'code': resultCode,
				'message': message
			});
		});
	});
/*

router.post('/tone2', function (req, res) {
		console.log(req.body);
		
		var InOn=req.body.InOn;
		var InOn2=req.body.InOn2;
		var InOn3=req.body.InOn3;
	

		// 삽입을 수행하는 sql문.
		//var sql = 'INSERT INTO Users (color1, color2, color3) VALUES (?, ?, ?)';
		var sql = 'INSERT INTO Tone (InOn2) VALUES (?)';	
		var params = [InOn2];
	
	
		// sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
		connection.query(sql, params, function (err, result) {
			var resultCode = 404;
			var message = '에러가 발생했습니다';

			if (err) {
				console.log(err);
			} else {
				resultCode = 200;
				message = 'tone1 전송에 성공했습니다.';
				console.log(resultCode);
			}

			res.json({
				'code': resultCode,
				'message': message
			});
		});
	});

router.post('/tone3', function (req, res) {
		console.log(req.body);
		
		var InOn=req.body.InOn;
		var InOn2=req.body.InOn2;
		var InOn3=req.body.InOn3;
	

		// 삽입을 수행하는 sql문.
		//var sql = 'INSERT INTO Users (color1, color2, color3) VALUES (?, ?, ?)';
		var sql = 'INSERT INTO Tone (InOn3) VALUES (?)';	
		var params = [InOn3];
	
	
		// sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
		connection.query(sql, params, function (err, result) {
			var resultCode = 404;
			var message = '에러가 발생했습니다';

			if (err) {
				console.log(err);
			} else {
				resultCode = 200;
				message = 'tone3 전송에 성공했습니다.';
				console.log(resultCode);
			}

			res.json({
				'code': resultCode,
				'message': message
			});
		});
	});
*/

module.exports = router;
