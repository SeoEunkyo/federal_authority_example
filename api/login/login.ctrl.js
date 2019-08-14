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
            
            return res.redirect('/login/success')
            console.log("jjjjj")
            
            //req.login(user, (err)=>{
            //    req.session.save(()=>{
            //        res.done('helloworld')
            //    })
            //})

        }, (err) =>{
            console.log(err)
            res.status(500)
        })



})}

// login localstrategy
const localStrategy = new LocalStrategy(
    (username, password, done) => {
        

        var sql = `select * from user where username=:username`
        db.query(sql, {params:{username:"local:"+username}}).then((result)=>{
            if(result.length==0){
                return done(null,false)
            }
            const user = result[0]
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

)


const loginsuccess = (req, res)=>{
    if(req.session.username){
        console.log('session nusername : ' + req.session.username)
    }

}


module.exports ={index, localStrategy, register,insertUser,loginsuccess}