const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
//var FileStore = require('session-file-store')(session);
var OrientoStore= require('connect-oriento')(session)
var app = express();
//비번 암호화
const bkfd2Password = require("pbkdf2-password")
var hasher = bkfd2Password()
// 로그인 패스포트로 .. 
var passport = require('passport')



//const xmltocsv = require('./api/xmltoxlsx')
const login =require("./api/login")(passport)



app.use(session({
    secret: 'parkdex@naver.net!!',
    resave: false,
    saveUninitialized: true,
    store:new OrientoStore({server : "host=localhost&port=2424&username=root&password=root&db=loginTest"})
}))
// 패스포트에서 세션을 사용할것이기 떄문에 세션에 대한 미들웨어를 패스보트 이전에 정의해줘야함 .
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'))
app.locals.pretty = true

app.set('views', './views_file/auth')
app.set('view engine', 'jade') // 뷰엔진으로 jade로 사용할꺼야 

 // 파일들을 view 라고 부르는거 같고 그 파일 경로를 지정해준다.
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
//app.use('/xmltoxlsx',xmltocsv)


// api 라우팅하기.
app.use("/login",login)


module.exports = app

