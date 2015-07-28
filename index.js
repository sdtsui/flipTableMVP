var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.get('/app.js', function(req, res){
  res.sendfile('app.js');
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('deviceMotion', function(agb){
    console.log('DevMotion:');
    console.log('|Alpha: ', agb.alpha, '|Gamma : ', agb.gamma, '|Beta :', agb.beta);
  });

});
