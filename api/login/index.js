module.exports = function(passport){
    const express = require('express')
    const router = express.Router()
    const ctrl = require('./login.ctrl')
    const db =require('../orientdb/dbconnection')
    //var passport = require('passport')
    
    
    
    
    passport.serializeUser(function(user, done) {
        done(null, user.username);
    }); 
    passport.deserializeUser(function(username, done) {
        var sql = `select * from user where username=:username`
        db.query(sql, {params:{username:username}}).then((result)=>{
            if(result.length===0){
                done('There is no user')
            }else{
                done(null,result[0])
            }
        })
        //done(null, user);
    });
    passport.use(ctrl.localStrategy)
    
    router.get('/', ctrl.index)
    router.get('/register', ctrl.register)
    router.post('/register', ctrl.insertUser)

    router.get('/success', ctrl.loginsuccess)
    
    router.post('/',passport.authenticate('local', 
                    { successRedirect: '/login/success',
                      failureRedirect: '/',
                      failureFlash: false 
                    }
                ))
    
                
    //router.get('/detail/:detailid', ctrl.download)
    //router.post('/', ctrl.convert)
     
    return router
}