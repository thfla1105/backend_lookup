
var mysql = require('mysql');
var express = require('express');
const crypto = require('crypto');
//var app = express();
//var bodyParser = require('body-parser');
var router = express.Router();
const fs = require("fs");
var url = require('url');



var connection = mysql.createConnection({
    host: "",
    user: "",
    database: "",
    password: "",
    port: 53295
});
console.log("Style mysql success!");


const data=fs.readFileSync('./SR_StyleList/json_data/stylelist.json','utf8');

router.get("/", (req, res, next) => {
	console.log("stylelist_json");
	var id=req.query.userId;
	var sql='SELECT * FROM LookUP.Style Left Join LookUP.CoordiList On LookUP.Style.coordiID = LookUP.CoordiList.idnum Right Join LookUP.Rating On LookUP.Style.imageID = LookUP.Rating.imageID WHERE LookUP.Rating.UserID=?;';
		//var param=[id,image];
		console.log("Style Information "+id);
		var StyleList =[];
		var query=connection.query(sql, id, function (err,results) { 
		 	
		for (var i=0;i<results.length;i++){	
			console.log("result "+results[i].imageID)
			
			StyleList.push({
			 "imageID":results[i].imageID,
			 "imageFile":results[i].imageFile,
			 "coordiID":results[i].coordiID,
			 "temp":results[i].temp,
			 "userId":id,
			 "rating":results[i].rating,
			 "top":results[i].top,
			 "bottom":results[i].bottom,
			 "dress":results[i].dress,
			 "outwear": results[i].outwear,
			 "coordi_literal":results[i].coordi_literal,
			 "style":results[i].style,
				
			});
		}
			
			console.log(StyleList);
			res.end(JSON.stringify(StyleList));
		})
	

});


router.get("/select", (req, res, next) => {
	console.log("Image Return");
	var id=req.query.userId;
	var purpose=req.query.Purpose;
	var sql='SELECT * FROM LookUP.PostItem WHERE userID=? and Purpose=?';
		var param=[id,purpose];
		console.log("Style Information "+id);
		var query=connection.query(sql,param, function (err,results) { 	
			 let userid=id;
			 let now_purpose=purpose;
			 let list=[];
			if(results!=null){
				for(var i=0;i<results.length;i++){
					let imageID=results[i].imageID;
					list.push(imageID);
				}
			}
			
			
			res.json({
				'userId':userid,
				'imageList':list,
				'Purpose':now_purpose
			})
			
			console.log("GET image: "+list);
		
		})
	

});

router.post("/update", (req, res, next) => {
	console.log("Image Select");
	
	const result = req.body;
	console.log(result);
	var id=result.userID;
	var purpose=result.Purpose;
	var list=result.imageList;
	var sql="Delete From LookUP.PostItem WHERE userID=? and Purpose=?;"
	var sqlInsert="Insert into LookUP.PostItem (imageID, userID, Purpose) values (?,?,?);"
	var param=[id,purpose];
	
	var query=connection.query(sql,param, function (err,results) { 
		console.log("Delete");
	});
	
	if(result.imageList!=null){
		for(var i=0;i<list.length;i++){
			var paramInsert=[list[i],id,purpose];
			var query=connection.query(sqlInsert,paramInsert, function (err,results) { 
					console.log("Insert: ",list[i]);
			});
		}
		
	}						   
	
	
  	res.json({
		"userID":result.userID,
		"imageList":result.imageList,
		"Purpose":result.Purpose
	})
	


});




module.exports = router;