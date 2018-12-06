var models = require('../models');
var mysql = require('mysql');
var dbConnection = require('../db/index.js')


module.exports = {
  messages: {
    get: function (req, res) { 
      dbConnection.query('SELECT * FROM messages', function(error, rows, fields) {
        //console.log('rows', rows[0].msg);
        if (error) {
          console.log('error:', error);
        } else {
          res.end(JSON.stringify(rows))
          //res(null, null, rows);
        }
      })
    }, // a function which handles a get request for all messages
    
    post: function messagePostFn(req, res) {
      let msg = req.body.message;
      let created_at = '1988-09-22' //new Date();
      let queryString = `INSERT INTO messages (roomID, userID, msg, created_at) VALUES (0, 0, "${msg}", "${created_at}");`
      console.log(queryString);
      dbConnection.query(queryString, function messagePostDbCB(err, result) {
        if (err) {
          console.log('db connection error');
        } else {
          console.log('POST request seved to db, kinda')
          res.end();
        }
      })
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      dbConnection.query('SELECT username FROM users', function (err, result) {
        if (err) {
          console.log('error during user GET request');
        } else {
          console.log('success during user GET request');
          let array = [];
          result.forEach(function (user) {
            array.push(user.username);
          })
          res(null, null, array);
        }
      })
    },

    post: function (req, res) {
      module.exports.users.get('http://127.0.0.1:3000/classes/users', function (error, response, body) {
        let userList = body;
        var username = req.body.username;
        if (!userList.includes(username)) {
          var queryString = `INSERT INTO users (username) VALUES ('${username}');`
          dbConnection.query(queryString, function (err, results) {
            if (err) {
              console.log('err during db user POST request', err);
            } else {
              console.log('success writing user to db')
              res.end();
            }
          })
        } else {
          console.log('name already exists')
          res.end();
        }
      })
    }
  }
};

