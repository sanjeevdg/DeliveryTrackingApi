 const express = require("express");
 const http = require("http");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = require("socket.io")(server);

let interval;

// let position = require('./sockio/PositionSocket');

// position(io);


io.on("connection", (socket) => {
  console.log("New client connected");

  
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

io.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });



});

  
const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
 io.emit("FromAPI", response);
console.log('in getApiAndEmit method.....');

socket.on("setPosition", (position) => { 
// set in db here...});
console.log('woo got from client'+JSON.stringify(position));
  //  io.emit("setPosition",position);


});



};

io.listen(port, {
  cors: {
    origin: ["http://my-socket-web.herokuapp.com"]
  }
});
