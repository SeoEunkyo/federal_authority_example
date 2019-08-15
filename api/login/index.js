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
        ctrl.deserializeUser(username,done)
        //done(null, user);
    });

    passport.use(new LocalStrategy(
        function(username, password, done){
            ctrl.localStrategy(username, password, done)
        }
    ));

    
    router.get('/', ctrl.index)
    router.get('/register', ctrl.register)
    router.post('/register', ctrl.insertUser)
    router.get('/signout',ctrl.singout)

    router.get('/success', ctrl.loginsuccess)
    
    router.post('/',passport.authenticate('local', 
                    { successRedirect: '/login/success',
                      failureRedirect: '/login',
                      failureFlash: false 
                    }
                ))
    
                
    //router.get('/detail/:detailid', ctrl.download)
    //router.post('/', ctrl.convert)
     
    return router
}