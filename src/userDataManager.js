import express from 'express';
import cors from 'cors';
import fs from "fs";

const app = express();
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

var userData;
const path = "userData.json";
var text = fs.readFileSync(path);
userData = JSON.parse(text);

function getUserInfo(user, password){
  if(userData != undefined){
      if(userData[user] != undefined && userData[user].password == password){
          return (userData[user]);
      }
      else{
        console.log("Username or password does not match");
      }
  }
}
// Define a POST endpoint to receive data from the client
app.post('/api/loginRequest', (req, res) => {
  const clientData = req.body; // Data sent by the client in the request body
    if(clientData.key[0] == 'login'){
        res.json(getUserInfo(clientData.key[1],clientData.key[2]));
    }
});

// Start the server
const port = 3001; // Choose a port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


