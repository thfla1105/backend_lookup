
var mysql = require('mysql');
var express = require('express');
const crypto = require('crypto');
//var app = express();
//var bodyParser = require('body-parser');
var router = express.Router();
const fs = require("fs");
var url = require('url');

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));


var connection = mysql.createConnection({
    host: "",
    user: "",
    database: "",
    password: "",
    port: 53295
});
console.log("Rating mysql success!");

router.get('/',function(req, res) {
		console.log(req.query);
		var id=req.query.userId;
		var image=req.query.imageID;
		var sql='SELECT * From Rating WHERE UserID=? AND imageID=?';
		var param=[id,image];
		console.log("GET "+id+" "+image);
		connection.query(sql, param, function (err, result) { 
		  	 let userid=id;
			 let imageid=image;
			 let rating=result[0].rating;
			
			res.json({
				'userId':userid,
				'imageID':imageid,
				'rating':rating
			})
			
			console.log("rating: "+rating);
		})
		
	}

);

router.post('/update', function(req, res) {
		console.log(req.body);
		var id=req.body.userId;
		var image=req.body.imageID;
		var like=req.body.rating;
		var sql='UPDATE Rating SET rating=? WHERE UserID=? AND imageID=? ';
		var param=[like,id,image];
        console.log(req.body);
		connection.query(sql, param, function (err, result) { 
		     let rating=like;
		  	 let userid=id;
			 let imageid=image;
			
			res.json({
				'userId':userid,
				'imageID':imageid,
				'rating':rating
			})
		})
	}

);

/*
router.get('/byname', function(req,res){

	//var sql='SELECT * From Style WHERE style=?';
		
	console.log(req.query);
		var style=req.body.byname
		var sql='SELECT * FROM Style WHERE style = casual';
		var param=[style];
		console.log("GET "+style);
		connection.query(sql, param, function (err, result) { 
			 let style=style;
			
			res.json({
				'style':style
			})
			

		})
		
	}

*/


module.exports = router;
		   
