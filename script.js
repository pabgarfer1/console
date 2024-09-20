// Initialize terminal
const term = new Terminal({
  fontSize: 20 // Adjust this value as needed
});

term.open(document.getElementById('terminal'));

// Define a global typing speed (in milliseconds)
const typingSpeed = 10; // Adjust this value to change typing speed

// Focus the terminal after it opens
window.onload = function() {
  setTimeout(() => {
    term.focus();
    typeText(term, '\x1b[1;36mWelcome to the Terminal!\x1b[0m\r\n', typingSpeed, () => {
      typeText(term, '\x1b[1;37mType "help" for a list of commands.\x1b[0m\r\n', typingSpeed, () => {
        typeText(term, 'visitor@website $ ', typingSpeed);
      });
    });
  }, 100);
};

const history = [];
let historyIndex = -1;
let currentInput = '';

const prompt = 'visitor@website $ ';

// Function to "type" out text character by character
function typeText(term, text, delay, callback) {
  let index = 0;
  function typeChar() {
    if (index < text.length) {
      term.write(text.charAt(index));
      index++;
      setTimeout(typeChar, delay); // Delay between each character
    } else if (callback) {
      callback(); // Call the callback function after typing is done
    }
  }
  typeChar();
}

// Handle user input
term.onData(data => {
  if (data === '\r') { // Enter key
    term.write('\r\n');
    handleCommand(currentInput.trim());
    if (currentInput) {
      history.push(currentInput); // Append to history
    }
    currentInput = '';
    historyIndex = -1; // Reset history index on new command
  } else if (data === '\u001B[A') { // Up arrow
    if (historyIndex < history.length - 1) {
      historyIndex++;
      currentInput = history[history.length - 1 - historyIndex];
      term.write(`\r\x1B[K${prompt}${currentInput}`); // Retain prompt
    }
  } else if (data === '\u001B[B') { // Down arrow
    if (historyIndex > 0) {
      historyIndex--;
      currentInput = history[history.length - 1 - historyIndex] || '';
      term.write(`\r\x1B[K${prompt}${currentInput}`); // Retain prompt
    } else if (historyIndex === 0) {
      historyIndex--;
      currentInput = '';
      term.write(`\r\x1B[K${prompt}`); // Retain prompt
    }
  } else if (data === '\u0008' || data === '\x7f') { // Backspace
    if (currentInput.length > 0) {
      currentInput = currentInput.slice(0, -1);
      term.write('\b \b'); // Erase last character in terminal
    }
  } else {
    currentInput += data; // Append the character to current input
    term.write(data);
  }
});

function handleCommand(input) {
  if (input) {
    switch (input.toLowerCase()) {
      case 'hello':
        typeText(term, 'Hello there!\r\n', typingSpeed, () => term.write(prompt));
        break;
      case 'social':
        typeText(term, 'Instagram: @pablo_garcia_ferrer\r\n', typingSpeed, () => term.write(prompt));
        break;
      case 'help':
        typeText(term, 'Available commands:\r\n', typingSpeed, () => {
          typeText(term, 'hello - Greet the user\r\n', typingSpeed, () => {
            typeText(term, 'social - Find contact info\r\n', typingSpeed, () => {
              typeText(term, 'help - Show this help menu\r\n', typingSpeed, () => {
                typeText(term, 'clear - Clear the terminal\r\n', typingSpeed, () => {
                  term.write(prompt);
                });
              });
            });
          });
        });
        break;
      case 'clear':
        term.clear();
        typeText(term, '\x1b[1;36mWelcome to the Terminal!\x1b[0m\r\n', typingSpeed, () => {
          typeText(term, '\x1b[1;37mType "help" for a list of commands.\x1b[0m\r\n', typingSpeed, () => {
            typeText(term, prompt, typingSpeed);
          });
        });
        break;
      default:
        typeText(term, `Command not found: ${input}\r\n`, typingSpeed, () => term.write(prompt));
    }
  } else {
    term.write(prompt); // Show prompt again after command handling
  }
}

// Refresh the page on F5 key press
window.addEventListener('keydown', (event) => {
  if (event.key === 'F5') {
    event.preventDefault(); // Prevent the default action
    location.reload(); // Refresh the page
  }
});
