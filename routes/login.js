
var mysql = require('mysql');
var express = require('express');
const crypto = require('crypto');
//var app = express();
//var bodyParser = require('body-parser');
var router = express.Router();

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));


var connection = mysql.createConnection({
    host: "",
    user: "",
    database: "",
    password: "",
    port: 53295
});
console.log("mysql success!");
	

	router.post('/dup', async function (req, res) {
		var id = req.body.userId;
		var sql = 'select * from Users where UserID = ?';
		console.log(req.body);
		connection.query(sql, id, function (err, result) {
			var resultCode = 404;
			var message = '에러가 발생했습니다';

			if (err) {
				console.log(err);
			} else {
				if (result.length === 0) {
					resultCode = 1;
					message = '사용가능한 ID입니다!';
				}  else {
					resultCode = 204;
					message = '이미 존재하는 ID입니다! 다른 ID를 입력하세요';

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


	router.post('/join', function (req, res) {
		console.log(req.body);
		var id=req.body.userId;
		var pwd=req.body.userPwd;
		let salt = Math.round((new Date().valueOf() * Math.random())) + "";
		let hashPwd = crypto.createHash("sha512").update(pwd + salt).digest("hex");
		
		var name=req.body.userName;
		var gender=req.body.userGender;
		var age=req.body.userAge;
		var email=req.body.userEmail;
		var phone=req.body.userPhone;

		// 삽입을 수행하는 sql문.
		var sql = 'INSERT INTO Users (UserID, UserPwd, UserName, UserGender, UserAge, UserEmail, UserPhone, salt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
		var params = [id, hashPwd, name, gender, age, email, phone, salt];

		// sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
		connection.query(sql, params, function (err, result) {
			var resultCode = 404;
			var message = '에러가 발생했습니다';

			if (err) {
				console.log(err);
			} else {
				resultCode = 200;
				message = '회원가입에 성공했습니다.';
				console.log(resultCode);
			}

			res.json({
				'code': resultCode,
				'message': message
			});
		});
		
		//Rating 수행하기 위해 만듦
		var sql_Rating='INSERT INTO Rating (UserID,imageID,rating) VALUES (?,?,?)';
		for (var i=1;i<41;i++){
			var params_Rating=[id,i,null]
			connection.query(sql_Rating,params_Rating,function(err,result){
				if(err){
					console.log(err);
				}else{
					console.log('Rating Input Success');
				}
			});
		}
		
	});

	router.post('/login', async function (req, res) {
		var id = req.body.userId;
		var pwd = req.body.userPwd;
		var sql = 'select * from Users where UserID = ?';
		console.log(req.body);
		connection.query(sql, id, function (err, result) {
			var resultCode = 404;
			var message = '에러가 발생했습니다';
			var resID='1';

			if (err) {
				console.log(err);
			} else {
				let dbPwd=result[0].UserPwd;
				let salt=result[0].salt;
				let hashPwd =crypto.createHash("sha512").update(pwd + salt).digest("hex");
				if (result.length === 0) {
					resultCode = 204;
					message = '존재하지 않는 계정입니다!';
					resID='-1';
				} else if (dbPwd !== hashPwd) {
					resultCode = 204;
					message = '비밀번호가 틀렸습니다!';
					resID='-1';
				} else {
					resultCode = 200;
					message = '로그인 성공! ' + result[0].UserName + '님 환영합니다!';
					resID=id;
					/*
					console.log("비밀번호 일치-로그인 성공");
					req.session.id = result[0].UserID;
					req.session.isLogined=true;
					//session 저장한 다음 redirect 해야함
					req.session.save(function()){
						res.redirect('/');
					}
					*/ }
				console.log(resultCode);
				console.log(id);
			}

			res.json({
				'code': resultCode,
				'message': message,
				'userId': resID
			});
		})
	});

module.exports = router;