import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';

const app = express();
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Create an object to store child processes
const childProcesses = {};
const keyToPort = new Map();
// Define a POST endpoint to receive data from the client
app.post('/api/receiveData', (req, res) => {
  const clientData = req.body; // Data sent by the client in the request body
    if(clientData.key[0] == 'get'){
       var value = keyToPort.get(clientData.key[1]);
       console.log("For key: "+clientData.key[0]+" returning: "+value);
       res.json({key:value});
    }

    if(clientData.key[0] == 'add'){
            // Check if a child process already exists for the given key
            if (!childProcesses[clientData.key[1]]) {
                // Start a new child process with a unique port
                const port = 3002 + Object.keys(childProcesses).length;
                const childProcess = spawn('node', [`./session/server.js`, `--port=${port}`]);

                // Listen for output from the child process
                childProcess.stdout.on('data', (data) => {
                console.log(`${clientData.key[1]} stdout: ${data}`);
                });

                childProcess.stderr.on('data', (data) => {
                console.error(`${clientData.key[1]} stderr: ${data}`);
                });

                // Listen for the child process to exit
                childProcess.on('close', (code) => {
                console.log(`${clientData.key[1]} exited with code ${code}`);
                // Remove the child process from the object when it exits
                delete childProcesses[clientData.key[1]];
                });

                // Store the child process in the object
                childProcesses[clientData.key[1]] = childProcess;
                keyToPort.set(clientData.key[1],port);
            } 
}
});

// Start the server
const port = 3000; // Choose a port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
