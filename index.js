var express = require('express');
var app = express();
var moment = require('moment');
moment().format();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(3000, function () {
    console.log('listening on *:3000');
});

var redis = require('redis');
var client = redis.createClient();


// отлавливаем ошибки
client.on("error", function (err) {
    console.log("Error: " + err);
});

/*
 client.set('myKey', 'Hello Redis', function (err, repl) {
 if (err) {
 // Оо что то случилось при записи
 console.log('Что то случилось при записи: ' + err);
 client.quit();
 } else {
 // Прочтем записанное
 client.get('myKey', function (err, repl) {
 //Закрываем соединение, так как нам оно больше не нужно
 client.quit();
 if (err) {
 console.log('Что то случилось при чтении: ' + err);
 } else if (repl) {
 // Ключ найден
 console.log('Ключ: ' + repl);
 } else {
 // Ключ ненайден
 console.log('Ключ ненайден.')

 };
 });
 };
 });

 client.set('myKey2', 'Hello Redis2', function (err, repl) {
 if (err) {
 // Оо что то случилось при записи
 console.log('Что то случилось при записи: ' + err);
 client.quit();
 } else {
 // Прочтем записанное
 client.get('myKey2', function (err, repl) {
 //Закрываем соединение, так как нам оно больше не нужно
 client.quit();
 if (err) {
 console.log('Что то случилось при чтении: ' + err);
 } else if (repl) {
 // Ключ найден
 console.log('Ключ: ' + repl);
 } else {
 // Ключ ненайден
 console.log('Ключ ненайден.')

 };
 });
 };
 });
 */


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', function (data) {
        users.splice(users.indexOf(socket.userName), 1);
        updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('new user', function (userName, callback) {
        callback(true);

        socket.userName = userName;
        users.push(socket.userName);
        updateUserNames();

        //io.emit('new message', {msg: data});
        //pub.publish("messages", JSON.stringify({message: msg}));
    });

    socket.on('send message', function (data) {
        io.emit('new message', {msg: data, 'userName' : socket.userName, 'timeMesage' : moment().format("DD.MM.YYYY, H:mm:ss")});
        //pub.publish("messages", JSON.stringify({message: msg}));
    });
});

function updateUserNames() {
    io.sockets.emit('get users', users);
}





