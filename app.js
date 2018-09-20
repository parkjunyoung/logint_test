var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

//flash  메시지 관련
var flash = require('connect-flash');

//passport 로그인 관련
var passport = require('passport');
var session = require('express-session');

var index = require('./routes');
var accounts = require('./routes/accounts');


var db = require('./models');

// DB authentication
db.sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
    return db.sequelize.sync();
    //return db.sequelize.drop();
})
.then(() => {
    console.log('DB Sync complete.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});


var app = express();
var port = 3000;

// 확장자가 ejs 로 끈나는 뷰 엔진을 추가한다.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 미들웨어 셋팅
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var SequelizeStore = require('connect-session-sequelize')(session.Store);

//session 관련 셋팅
var sessionMiddleWare = session({
    secret: 'fastcampus',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    },
    store: new SequelizeStore({
        db: db.sequelize
    }),
});
app.use(sessionMiddleWare);

//passport 적용
app.use(passport.initialize());
app.use(passport.session());

// view 에서 사용할 로컬 변수 생성
app.use(function(req, res, next) {
    app.locals.isLogin = req.isAuthenticated();
    app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅
    next();
});
 
//플래시 메시지 관련
app.use(flash());


// Routing
app.use('/accounts' , accounts );
app.use('/' , index );

app.listen( port, function(){
    console.log('Express listening on port', port);
});