// Get references to HTML elements by their IDs
var contentElement = document.getElementById('content');
var passwordField = document.getElementById('passwordField');
var usernameField = document.getElementById('usernameField');
var updateButton = document.getElementById('updateButton');

var params = new URLSearchParams(window.location.search);
var sessionKey = params.get('session');
let container, textBox , username;

// Add a click event listener to the button
updateButton.addEventListener('click', function () {
    // Get the value of the input field
    var newContent = passwordField.value;
    
    // Update the content of the h1 element with the input field's value
    contentElement.textContent = newContent;
    
    // Clear the input field
    passwordField.value = '';
    
    // Get the value entered in the input field
    var keyword = document.getElementById('content').textContent;
    // Check for successful login (you can replace this with your own logic)
    var isLoggedIn = true;

    // Check if the keyword matches a certain value (e.g., 'secret')
    var isKeywordMatch = keyword === 'secret';

    if (isLoggedIn && isKeywordMatch) {
        username = usernameField.value;

        //Remove Login Area if successful, clears up space for play area
        var elementToRemove = document.getElementById('content');
        elementToRemove.remove();
        var elementToRemove = document.getElementById('usernameField');
        elementToRemove.remove();
        var elementToRemove = document.getElementById('passwordField');
        elementToRemove.remove();
        var elementToRemove = document.getElementById('updateButton');
        elementToRemove.remove();
        var elementToRemove = document.getElementById('returnHome');
        elementToRemove.remove();

        //Create container for all elements on the right hand side
        container = document.createElement("div");
        container.classList.add('container');
        document.body.appendChild(container);

        //creates a button to return to the home page
        var returnToHome = document.createElement("a");
        returnToHome.classList.add("returnToHome");
        returnToHome.href="./../index.html"
        returnToHome.innerText="Return to HomePage"

        //creates a chat box to display session chat
        var chatBox = document.createElement("p");
        chatBox.classList.add('chatBox');
        chatBox.innerText = "Beginning of chat log";

        //creates text box for user to type to chat box
        textBox = document.createElement("textarea");
        textBox.type="text";
        textBox.classList.add('textBox');
        textBox.innerText = "";

        // Append all elements to the parent container
        container.appendChild(returnToHome);    // [0]
        container.appendChild(chatBox);         // [1] 
        container.appendChild(textBox);  // [2]
        loadScriptsAndInitialize();

    }
    
});
async function loadScriptsAndInitialize(){
            const clientModule = await import('./../client.js');
            const scripts = await import('./scripts.js');
}
export { container, textBox , username , sessionKey}