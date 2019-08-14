
var OrientDB = require('orientjs');
var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'root'
});
var db = server.use('loginTest');


module.exports = db;