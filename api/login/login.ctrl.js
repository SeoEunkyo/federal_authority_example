const db = require('../orientdb/dbconnection')
const bkfd2Password = require("pbkdf2-password")

var hasher = bkfd2Password()

const index = (req,res) => { 
    res.render('login')
}
const register =(req,res) => {
    res.render('register')
}
const insertUser = (req,res) =>{
    hasher({password:req.body.password}, function(err,pass,salt,hash){
        var user ={
            username:"local:"+req.body.username,
            password:hash,
            salt:salt,
            email:req.body.email
        }

        var sql = `insert into user (username, password, salt, email) 
        values(:username,:password,:salt,:email)`
        db.query(sql, {params:user}).then((result) => {  
            //return res.redirect('/login/success')
            req.login(user, (err)=>{
                req.session.save(()=>{
                    res.redirect('/login/success')
                })
            })

        }, (err) =>{
            console.log(err)
            res.status(500)
        })
})}

// login localstrategy
const localStrategy = (username, password, done) =>{
        var sql = `select * from user where username=:username`
        //console.log('sql :' + sql)
        db.query(sql, {params:{username:"local:"+username}}).then((result)=>{
            if(result.length==0){
                return done(null,false)
            }
            const user = result[0]
            //console.log('result :' + user.username)
            return hasher({password:password, salt:user.salt}, (err,pass, salt, hash)=>{
                if(hash==user.password){
                    done(null,user)
                }else{
                    done(null,false)
                }
            })
        })
        // 로그인 실패 할 경우는 done(null, false, {message:"incorrect ID & Password"})
}



const loginsuccess = (req, res)=>{
    console.log(req.session.passport)
    if(req.session.passport.user){
        res.render('welcome', {_username: req.session.passport.user})
    }else{
        res.render('welcome' )
    }
}

const deserializeUser = (username, done) => {
    var sql = `select * from user where username=:username`

        console.log('deserializeUser')
        db.query(sql, {params:{username:username}}).then((result)=>{
            console.log('seql' + sql)
            if(result.length===0){
                done('There is no user')
            }else{
                done(null,result[0])
            }
        })
}

const singout =(req,res) =>{
    console.log( 'singout: '+  req.session.passport.user)
    delete  req.session.passport.user;
    req.session.save(function(){
        res.redirect('/login');
      });
}

const facebook=(req,res)=>{

}


const facebookStrategy = (accessToken, refreshToken, profile, done) =>{
    console.log(profile)
     // 로그인 정보가 디비에 있는 지 확인하고 없으면 db에 정보 추가 세션 세이브도 해주고..  이미 회원이 facebook에 로그인 되었다 facebook에 의해서.

    var username = 'facebook:'+profile.id
    
    var sql = `select * from user where username=:username`
    //console.log('sql :' + sql)
    db.query(sql, {params:{username:"face:"+username}}).then((result)=>{
        if(result.length==0){
            // db에 insert 해준다 .. 상황에 따라선 추가 적인 내용을 받을수 있음 .
            sql = `insert into user (username, email) 
                    values(:username, :email)`
            var user = { 
                username:"facebook:"+profile.id,
                email:req.body.email
            }
            db.query(sql, {params:user}).then((result) => { 
                return done(null,user)
             })
            return done(null,false)
        }else{
            var user = result[0]
            return done(null,user)

        }
    })
    // 로그인 실패 할 경우는 done(null, false, {message:"incorrect ID & Password"})
}



module.exports ={index, localStrategy, register,insertUser,loginsuccess,deserializeUser,singout, facebook, facebookStrategy}