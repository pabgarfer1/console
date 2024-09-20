// Initialize terminal with custom cursor color and style
const term = new Terminal({
  fontSize: 20,
  cursorBlink: true,
  cursorStyle: 'block',
  cursorColor: 'red',
});

term.open(document.getElementById('terminal'));

// Global typing speed (in milliseconds)
const typingSpeed = 10;
const fadeDuration = 2000; // Time in milliseconds for text to become fully solid

// Custom prompt color (Green in this case)
const prompt = '\x1b[32mvisitor@website $ \x1b[0m'; // Green prompt

// Focus the terminal after it opens
window.onload = () => {
  setTimeout(() => {
    term.focus();
    displayWelcomeMessage();
  }, 100);
};

const history = [];
let historyIndex = -1;
let currentInput = '';

// Display the welcome message
function displayWelcomeMessage() {
  typeText(term, '\x1b[1;36mWelcome to the Terminal!\x1b[0m\r\n', typingSpeed, () => {
    typeText(term, '\x1b[1;37mType "help" for a list of commands.\x1b[0m\r\n', typingSpeed, () => {
      typeText(term, prompt, typingSpeed);
    });
  });
}

// Function to "type" out text character by character with transparency effect
function typeText(term, text, delay, callback) {
  let index = 0;

  const typeChar = () => {
    if (index < text.length) {
      const char = text.charAt(index);
      // Write the character normally to the terminal
      term.write(char);
      
      // Get the latest character element from the DOM
      const terminalRows = document.querySelectorAll('.xterm-rows div');
      const lastRow = terminalRows[terminalRows.length - 1];
      if (lastRow) {
        const lastChar = lastRow.lastElementChild;
        if (lastChar) {
          lastChar.classList.add('fade-in-char');
          // Make it fully visible after a delay
          setTimeout(() => lastChar.classList.add('visible'), 10);
        }
      }

      index++;
      setTimeout(typeChar, delay);
    } else if (callback) {
      callback();
    }
  };

  typeChar();
}

// Handle user input
term.onData(data => {
  switch (data) {
    case '\r': // Enter key
      handleEnterKey();
      break;
    case '\u001B[A': // Up arrow
      navigateHistory(1);
      break;
    case '\u001B[B': // Down arrow
      navigateHistory(-1);
      break;
    case '\u0008':
    case '\x7f': // Backspace
      handleBackspace();
      break;
    default:
      handleDefaultInput(data);
  }
});

// Handle Enter key press
function handleEnterKey() {
  term.write('\r\n');
  handleCommand(currentInput.trim());
  if (currentInput) {
    history.push(currentInput);
  }
  currentInput = '';
  historyIndex = -1;
}

// Navigate command history
function navigateHistory(direction) {
  if (direction === 1 && historyIndex < history.length - 1) {
    historyIndex++;
  } else if (direction === -1 && historyIndex > 0) {
    historyIndex--;
  } else if (direction === -1 && historyIndex === 0) {
    historyIndex--;
    currentInput = '';
  }

  currentInput = history[history.length - 1 - historyIndex] || '';
  term.write(`\r\x1B[K${prompt}${currentInput}`);
}

// Handle Backspace
function handleBackspace() {
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    term.write('\b \b');
  }
}

// Handle default input
function handleDefaultInput(data) {
  currentInput += data;
  term.write(data);
  fadeInLastCharacter();
}

// Command handler
function handleCommand(input) {
  if (!input) {
    term.write(prompt);
    return;
  }

  const commands = {
    hello: () => typeText(term, 'Hello there!\r\n', typingSpeed, () => term.write(prompt)),
    social: () => typeText(term, 'Instagram: @pablo_garcia_ferrer\r\n', typingSpeed, () => term.write(prompt)),
    help: () => displayHelp(),
    clear: () => clearTerminal(),
  };

  const commandFunc = commands[input.toLowerCase()];
  if (commandFunc) {
    commandFunc();
  } else {
    typeText(term, `Command not found: ${input}\r\n`, typingSpeed, () => term.write(prompt));
  }
}

// Display help information
function displayHelp() {
  const helpMessages = [
    'Available commands:',
    'hello - Greet the user',
    'social - Find contact info',
    'help - Show this help menu',
    'clear - Clear the terminal',
  ];

  let index = 0;

  function typeNextMessage() {
    if (index < helpMessages.length) {
      typeText(term, helpMessages[index] + '\r\n', typingSpeed, () => {
        index++;
        typeNextMessage(); // Call the next message after the current one is typed
      });
    } else {
      term.write(prompt); // Re-display the prompt after the help messages
    }
  }

  typeNextMessage();
}

// Clear the terminal
function clearTerminal() {
  term.clear();
  displayWelcomeMessage();
}

// Refresh the page on F5 key press
window.addEventListener('keydown', (event) => {
  if (event.key === 'F5') {
    event.preventDefault();
    location.reload();
  }
});
