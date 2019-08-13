const express = require('express')
const router = express.Router()
const ctrl = require('./login.ctrl')
var passport = require('passport')


router.get('/', ctrl.index)

passport.use(new LocalStrategy(
    function(username, password, done){
        console.log("username : " + username)
        console.log("username : " + password)
    }

))

router.post('/',passport.authenticate('local', 
                { successRedirect: '/welcome',
                  failureRedirect: '/',
                  failureFlash: false 
                }
            ))

//router.get('/detail/:detailid', ctrl.download)
//router.post('/', ctrl.convert)
 

module.exports = router