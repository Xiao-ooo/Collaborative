//Importing our needed nodes modules -> scocket server 
const http = require('http');
const { WebSocketServer } = require('ws');

//Need to create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  //prints console current status
  res.end('WebSocket server is running');
});

//make a new websocket server that allows both way connection [more stablized]
const wss = new WebSocketServer({ server });

//create an variable that stores all clicking, changing to pizza
let pizzaState = [];

//tells the server what to do when it gets new connection
wss.on('connection', (socket) => {

    console.log('Client connected');

    //loops through all pizza changes, sends the current state to everyone 
    pizzaState.forEach(item => {
        socket.send(JSON.stringify(item));
    });

    //receiving message in format that can be understand 
    socket.on('message', (data) => {
        const msg = JSON.parse(data);

        //new change added
        pizzaState.push(msg);

        //goes through all clients, make sure only sends msg if socket is opened
        wss.clients.forEach(client => {
        if (client !== socket && client.readyState === client.OPEN) {
            client.send(JSON.stringify(msg));
        }
        });
    });

  //Prints disconnected if socket is closed
socket.on('close', () => {
    console.log('Client disconnected');
  });
});


//Define what port to listen on
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
