// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:9910/api/chat/conversation");

// Connection opened
socket.addEventListener("open", (event) => {
    console.log(event.data)
});
let i = 0;
const answers = ['Germany','Baden Baden and berlin','spa, maybe visit the casino, but mainly relax','for about 5 days', 'plesure']
// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
  
  if (i >= answers.length){
    return
  }
  socket.send(answers[i]);
  i++;
  
});

