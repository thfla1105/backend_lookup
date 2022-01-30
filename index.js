//코드 내에서는 포트번호 3000
// http://IP주소:외부포트(53392)
// http://54.180.195.102:57931/
// url은 https://test-nodejs.run.goorm.io/

//필요한 모듈 선언  
var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var url = require('url');
var path = require('path');
var logger = require('morgan');

app.get('/', (req, res) => res.send('Hello World'))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); //logger('dev') 밑에 위치해야함



//라우팅 모듈 선언
var login_join_router = require('./routes/login.js');
var upload_router = require('./routes/upload.js');
var category_router = require('./routes/category.js');
var closet_router = require('./routes/closet.js');
var lookbook_android_router = require('./routes/lookbook_android.js');

var tone_router1 = require('./routes/tone.js');
var color_router1 = require('./routes/color.js');

var style_router = require('./routes/style.js');
var styleimage_router = require('./routes/styleview.js')
var rating_router = require('./routes/rating.js')
var removebg_router = require('./routes/remove.js')
var lookbook_router = require('./routes/lookbook.js')

var upload2bg_router = require('./routes/upload2bg.js');



const currentDirectory = __dirname
console.log(currentDirectory)








//request 요청 URL과 처리 로직을 선언한 라우팅 모듈 매핑
app.use('/user', login_join_router);
app.use('/upload', upload_router);
app.use('/upload2bg', upload2bg_router);

app.use('/category', category_router);
app.use('/closet', closet_router);
app.use('/lookbook', lookbook_android_router);



app.use('/tone1', tone_router1);

app.use('/color1', color_router1);

app.use('/rating', rating_router);

app.use('/style', style_router);

app.use('/byname', rating_router);


app.use('/styleview', styleimage_router);

app.use('/removebg', removebg_router)
app.use('/prelookbook', lookbook_router)





app.listen(3000, '0.0.0.0', function() {});

module.exports = app;