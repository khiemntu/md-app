const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const moment = require('moment')
const app = express()
const server = require('http').createServer(app)
const dotenv = require('dotenv').config()
var io = require('socket.io')(server);
const folders = require('../routers');

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

let people = {}
// const mongodb = require('./db');
// var db = mongodb.connect();

io.on('connection', (socket) => {
	// when the client emits 'new message', this listens and executes
	socket.on('message', (data) => {
		console.log(data);
	});
});

app.post('/api/data', (req, res) => {
	today = moment().format('YYYY-MM-DD HH:mm')
	req.body.today = today;
	name = req.body.name.toLowerCase()
	// if(people[name] != today) {
	// 	io.emit('data', req.body || []);
	// 	people[name] = today;
	// }
	io.emit('data', req.body || []);	
	res.send(200)
})
app.post('/api/auth', (req, res) => {
	res.send({data: 'OK'});
});

app.use('/api/label', folders)

// app.listen(process.env.PORT || 8088)
const port = process.env.PORT || 8088
server.listen(port, () => {
	console.log('Server listening at port %d', port);
});