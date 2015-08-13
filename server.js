var express = require('express');
var favicon = require('serve-favicon');
var app = express();

app.use(express.static('./'))
// app.use(favicon(__dirname + '/images/icon/'))

app.get('/', function (req, res) {
  res.send('Hello there');
});

app.listen(2323, function(){
  console.info('Listening on 2323');
});
