"use strict";

var webSocketServer = require('websocket').server;    
var http = require('http');

var port = 8000;
var clients = new Array();

var server = http.createServer(function(request, response) {});

server.listen(port, function() {
	console.log((new Date()) + " Server is listening on port " + port);
});

var wsServer = new webSocketServer({    
	httpServer: server
});

wsServer.on('request', function(request) {
	var connection = request.accept(null, request.origin);
	var index = clients.push(connection) - 1;
    var userName = false;
	
	var SendMessage = function(json){
        for (var i=0; i < clients.length; i++) {                                        
            clients[i].sendUTF(json);
        }
    }
	
	connection.on('message', function(message) {
        console.log(message);
        
        if (message.type === 'utf8') {
            //var msg = JSON.parse(message.utf8Data);	
			var msg = JSON.stringify(message.utf8Data);
			SendMessage(msg);
        }		
    });
	
	connection.on('close', function(message) {        
        if (userName !== false && userColor !== false) {              
            console.log((new Date()) + " : Disconect: " + userName);
            
            var msg = JSON.stringify({ type:'close', data: 'disconect', uid: userName });
            SendMessage(msg);
        }
    });
	
});
