// script.js

// Function to handle typing in the terminal textarea
function typeIt(textarea, event) {
    const commandValue = textarea.value.trim();
    const terminal = document.getElementById('terminal');
    
    // Handle the Enter key press (key code 13)
    if (event.keyCode === 13) {
        // Prevent default action of new line
        event.preventDefault();
        
        // Append command to terminal
        terminal.innerHTML += `<div class="command-output">${commandValue}</div>`;
        
        // Clear the textarea after executing the command
        textarea.value = '';

        // Simulate command processing
        processCommand(commandValue);
    }
}

// Function to simulate command execution output
function processCommand(command) {
    const terminal = document.getElementById('terminal');
    
    let output = '';
    
    switch (command.toLowerCase()) {
        case 'help':
            output = 'Available commands: help, clear, hello';
            break;
        case 'clear':
            terminal.innerHTML = ''; // Clears the terminal output
            break;
        case 'hello':
            output = 'Hello there! How can I assist you?';
            break;
        default:
            output = `Unknown command: ${command}`;
    }
    
    // Append the result of the command
    if (output) {
        terminal.innerHTML += `<div class="command-output">${output}</div>`;
    }
    
    // Automatically scroll to the bottom after output
    window.scrollTo(0, document.body.scrollHeight);
}

// Function to move the caret (cursor) in the terminal
function moveIt(length, event) {
    const cursor = document.getElementById('cursor');
    
    // Logic for managing cursor movement, if needed
    // This could be enhanced to move based on typed characters
    
    // Example: move the cursor based on input length
    if (event.keyCode === 8) { // Handle Backspace key
        cursor.style.left = `${length - 1}ch`; // Move left on backspace
    } else {
        cursor.style.left = `${length}ch`; // Move right as typing progresses
    }
}
