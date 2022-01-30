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

router.post('/color1', function (req, res) {
		console.log(req.body);
		
	
		var color1=req.body.top_color1;
		var color2=req.body.top_color2;
		var color3=req.body.top_color3;
	

		// 삽입을 수행하는 sql문.
		var sql = 'INSERT INTO Colors (color1, color2, color3) VALUES (?,?,?)';	
		var params = [color1,color2,color3];
	
	
		// sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
		connection.query(sql, params, function (err, result) {
			var resultCode = 404;
			var message = '에러가 발생했습니다';

			if (err) {
				console.log(err);
			} else {
				resultCode = 200;
				message = 'color123 전송에 성공했습니다.';
				console.log(resultCode);
			}

			
			
			res.json({
				'code': resultCode,
				'message': message
			});
		});
	});



/*
router.post('/color2', function (req, res) {
		console.log(req.body);
		
		//let salt = Math.round((new Date().valueOf() * Math.random())) + "";
	//	let hashPwd = crypto.createHash("sha512").update(pwd + salt).digest("hex");
		
		var color1=req.body.color1;
		var color2=req.body.color2;
		var color3=req.body.color3;
	

		// 삽입을 수행하는 sql문.
		//var sql = 'INSERT INTO Users (color1, color2, color3,-salt) VALUES (?, ?, ?, ?, ?, ?)';
		//var sql = 'UPDATE Colors SET color2=? WHERE colIndex=?';
	//	var sql = 'INSERT INTO Colors (color2) VALUES (?)';	
	//	var params = [color2,1];
	
	
		// sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
		connection.query(sql, params, function (err, result) {
			var resultCode = 404;
			var message = '에러가 발생했습니다';

			if (err) {
				console.log(err);
			} else {
				resultCode = 200;
				message = 'color2 전송에 성공했습니다.';
				console.log(resultCode);
			}

			res.json({
				'code': resultCode,
				'message': message
			});
		});
	});

router.post('/color3', function (req, res) {
		console.log(req.body);
		
		//let salt = Math.round((new Date().valueOf() * Math.random())) + "";
	//	let hashPwd = crypto.createHash("sha512").update(pwd + salt).digest("hex");
		
		var color1=req.body.color1;
		var color2=req.body.color2;
		var color3=req.body.color3;
	

		// 삽입을 수행하는 sql문.
		var sql = 'INSERT INTO Colors (color3) VALUES (?)';	
		var params = [color3];
	
	
		// sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
		connection.query(sql, params, function (err, result) {
			var resultCode = 404;
			var message = '에러가 발생했습니다';

			if (err) {
				console.log(err);
			} else {
				resultCode = 200;
				message = 'color3 전송에 성공했습니다.';
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
