import { io } from 'socket.io-client';
import { container } from './js/login.js';
import { textBox } from './js/login.js';
import { username } from './js/login.js';
import {sessionKey} from './js/login.js';
import { setPlayer } from './js/scripts.js';
async function fetchData() {
    try {
      const response = await fetch('http://localhost:3000/api/receiveData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: ['get', sessionKey] }),
      });
  
      if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status);
      }
  
      const data = await response.json();
      const port = data.key; // Assuming the response key is 'message'
      const address = "http://localhost:" + port;
      console.log("returning :"+address);
      return address;
      // Use the 'address' variable here or call a function that uses it
      // This code will execute only after the fetch response has been received and processed.
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  }
let socket;
async function main(){
const address = await fetchData();    
socket = io(address); // Connect to the server

// Client-side code for handling socket connections and events
socket.on('connect', () => {
  var clientSessionInfo = [sessionKey,username];
  socket.emit('initialize',clientSessionInfo);
  console.log('Connected to the server');
});

socket.on('chat message', (message) => {
    container.childNodes[1].innerHTML += '<br><br><span style="font-weight: bold; color: red;">'+message[0]+'</span><br>' + message[1];
});

socket.on('movePlayer', (message) => {
  console.log("Calling 'SetPlayer'");
  setPlayer(message);
});

textBox.addEventListener('keydown', function (event) {
    // Check if the "Enter" key is pressed (key code 13)
        if (event.keyCode === 13) {
            event.preventDefault(); // Prevent the default newline behavior
            // Get references to the input and button elements
            var messageInput = container.childNodes[2];
            // Get the message from the input field
            var message = [username,messageInput.value];
            // Example: Sending a message to the server
            socket.emit('chat message', message);
             // Clear the input field
            messageInput.value = '';
    }

});
}
main();

export function sendMessage(msg){
  var moveMsg = [username,msg]
  socket.emit('move', moveMsg);
}