console.log('Script is running');

/* _____________________________________________________________________ */

var command = ""
let listOfCommands = [];


function typeIt(textarea, event) {
    var index = listOfCommands.length
    var key = event.key
    var code = event.code
    console.log(event)
    console.log("typeIt")


    
    if (key == "Enter"){                // CLICK THE ENTER KEY
        event.preventDefault();         // Prevent the default new line behavior
        textarea.value = ''             // Clear the textarea after executing the command
        listOfCommands.push(command)
        sendIt()        
        command = ""
    } else if (event.key == "ArrowUp"){
        var demo = "demo"
    } else if (/^[A-Za-z]$/.test(key)) {         // ONLY IF THE KEY IS A SINGLE LETTER
        command = command + key
    } else if (key == "Backspace") {            // Only if it is deleted
        var length = command.length
        command = command.slice(0, -1)
    } else if (key == "ArrowDown"){
        event.preventDefault()
        index = index + 1
        textarea.value = listOfCommands[index]
    } else if (key == "ArrowUp"){
        event.preventDefault()
        index = index - 1
        textarea.value = listOfCommands[index]
        console.log("arrowupppp")
    } else if (key == "ArrowLeft"){
        event.preventDefault()
    } else if (key == "ArrowRight"){
        event.preventDefault()
    } else {                                    // IF IT IS NOTHING OF THE ABOVE
        event.preventDefault()
        textarea.value = ''
        command = ""
    }

}



function sendIt(){
     console.log("Received command: " + command)

}