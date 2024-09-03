document.addEventListener("DOMContentLoaded", function(){
    //connect to websocket server? //How do I know the right server im looking for
    const ws = new WebSocket('ws://localhost:8080');
    //upon connection, log event
    ws.onopen = () =>{
        console.log("Connected to WebSocket Server");
    }
    //TODO: How to recieve messages (server prompt)
    //TODO: fix bugs when text is transmitted
    //Recieving messages (player outputs)
    ws.onmessage = (event) =>{
        const messageList = document.getElementById('progress__text1');
        const newMessage = document.createElement('li');
        newMessage.textContent = event.data;
        messageList.appendChild(newMessage);
    };

    //Sending Input(messages)
    document.getElementById('player__input').addEventListener('keydown', function(event){
        if (event.key === 'Enter'){
            ws.send(this.value);
            this.value = '';
        }
    })
});