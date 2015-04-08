var express = require('express')
var path = require('path')
var app = express();
var users = [];
app.use(express.static(path.join(__dirname, '/')))
app.listen(8080)

var peerServer = require('peer').PeerServer
var port = +process.argv[2]
var server = peerServer({port: port, path: '/api'})
console.log("Servidor rodando na porta "+port+"...")

server.on('connection', function(id) {
	users.push(id);
})

server.on('disconnect', function(id) {
	users.pop(id);
})

app.get('/users', function(req, res) {
	res.send(users)	
})