import http from 'node:http';
import { Server } from "socket.io";
import cors from 'cors'; // Import the cors library


async function loadScriptsAndInitialize(){
  const sessionDataManager = await import('./js/sessionDataManager.js');
}
loadScriptsAndInitialize();
const args = process.argv.slice(2);

// Find the port argument in the command-line arguments
const portArg = args.find(arg => arg.startsWith("--port="));

// Extract the port number from the argument
const port = portArg ? parseInt(portArg.split("=")[1], 10) : 3000; // Default to 3000 if not specified


let timeoutId; // Variable to hold the timeout ID
var totalClients = 0;
// Create a local server to receive data from
const server = http.createServer((req, res) => {
  });

// Enable CORS for Socket.IO with a wildcard for the port
const io = new Server(server, {
    cors: {
        origin: '*', // Use a wildcard for the entire origin
      methods: ['GET', 'POST'], // Add any other HTTP methods you need
    },
  });

io.on('connection', (socket) => {

    console.log('A user connected');
    totalClients=totalClients+1;
    // When a user connects, clear the timeout
    clearTimeout(timeoutId);

  socket.on('initialize',(data) => {
    console.log(data);
  });

  // Handle incoming chat messages
  socket.on('chat message', (message) => {
    console.log(`Received message: ${message}`);
    // Broadcast the message to all connected clients
    io.emit('chat message', message);
  });

    // Handle incoming move messages
    socket.on('move', (message) => {
      console.log(`Received message: ${message}`);
      // Broadcast the message to all connected clients
      io.emit('movePlayer', message);
    });


  socket.on('disconnect', () => {
    console.log('A user disconnected');
    totalClients=totalClients-1;
        // When a user disconnects, set a timeout to terminate the server after a period of inactivity
        timeoutId = setTimeout(() => {
            if(totalClients==0){
            console.log('Terminating: session');
            server.close();
            }
          }, 5000); // Change the timeout duration (in milliseconds) as needed
  });
});

const PORT = process.env.PORT || port;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});

export { port };
