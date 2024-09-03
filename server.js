const WebSocket = require('ws');

//Create a ws server
const wss = new WebSocket.Server({port: 8080});

//Handle connections
wss.on('connection', function connection(ws){//what is 'ws' and the param it reps?
    console.log('A new client has joined.'); //TODO: seperate old-refreshed clients, from brand new clients

    ws.send('Welcome to Typing PvP');
    ws.on('message', function incoming(message){
        console.log('received: %s', message); //is this syntax correct for js & node.js?

        //Broadcast message to clients(to show progress of opponents)
        wss.clients.forEach(function each(client){ //should this be inside of the function handling connections
            if (client !== ws && client.readyState === WebSocket.OPEN){ //what does '===' mean, why not '=='
                client.send(message);
                console.log("Server Sent Message: %s", message);
            }
        });
    });
    
});

console.log('Websocket server running on ws://localhost:8080');