//const uuidv4 = require('uuid').v4;
const ObjectId = require('bson');

/*
const messages = new Set();
const users = new Map();

const defaultUser = {
  id: 'anon',
  name: 'Anonymous',
};
*/
const positions = new Set();
const messageExpirationTimeMS = 5*60 * 1000;

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    console.log('in constructor');
/*
    socket.on('getPositions', () => this.getPositions());
    socket.on('position', (value) => this.handlePosition(value));
    */
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err) => {
      console.log(`connect_error22222 due to ${err.message}`);
    });
  }
  
  sendPosition(position) {
    this.io.sockets.emit('position', position);
  }
  
  getPositions() {
    positions.forEach((position) => this.sendPosition(position));
  }

  handlePosition(value) {
    const position = {
      id: new ObjectId(),
      timestamp: Date.now()
    };

    positions.add(position);
    this.sendPosition(position);

    setTimeout(
      () => {
        positions.delete(position);
        this.io.sockets.emit('deletePosition', position.id);
      },
      messageExpirationTimeMS,
    );
  }

  disconnect() {
    // users.delete(this.socket);
  }
}

function positionSocket(io) {
  io.on('connection', (socket) => {
    new Connection(io, socket);   
  });
};

module.exports = positionSocket;