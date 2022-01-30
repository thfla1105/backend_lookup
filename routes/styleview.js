var express = require('express');
const router = express.Router();
const fs = require("fs");
const url = require("url");

var file=function(req,res,next){
	var _url=req.url;
	var filename=url.parse(_url,true).path;
	if(_url.includes("/SR_StyleList/images/")){
		console.log("request: "+filename);
		//res.writeHead(200);
		var file = fs.createReadStream(`./${filename}`, {flags: 'r'} );
 
   		file.pipe(res)
		

    }
}

router.use(file)


module.exports = router;