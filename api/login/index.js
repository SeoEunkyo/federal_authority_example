module.exports = function(passport){
    const express = require('express')
    const router = express.Router()
    const ctrl = require('./login.ctrl')
    const db =require('../orientdb/dbconnection')
    const LocalStrategy = require('passport-local').Strategy
    const FacebookStrategy = require('passport-facebook').Strategy

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

    passport.use(new FacebookStrategy({
        // facebook dev api를 신청해야합니다 .. id, secret 을 .. 
        clientID: '1602353993419626',
        clientSecret: '232bc1d3aca2199e6a27eb983e602e0b',
        callbackURL: "/login/facebook/callback",
        profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
    }, function(accessToken, refreshToken, profile, done){
        ctrl.facebookStrategy(accessToken, refreshToken, profile, done)
        
    }))

    
    router.get('/', ctrl.index)
    router.get('/register', ctrl.register)
    router.post('/register', ctrl.insertUser)
    router.get('/signout',ctrl.singout)
    router.get('/success',ctrl.loginsuccess)





    router.get('/facebook', passport.authenticate('facebook',
                           {scope:'email'}
    ))
    
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