// Node server which will handle socket io connections.

// const io = require('socket.io')(8000)
const io = require('socket.io')(8000, {cors: {origin: "*"}})

const users = {};
const { v4: uuidv4 } = require('uuid');

function makeRoomId() {
  return uuidv4();
}

const roomId = makeRoomId();
io.on('connection',socket=>{
    socket.on('new-user-joined',name=>{
        if(name){
            console.log('new user joined' ,name);
            
            users[socket.id] = name;
            socket.join(roomId)
            // socket.brodcast.emit('user-joined',name);
            socket.broadcast.to(roomId).emit('user-joined', name);
            // socket.broadcast.emit('user-joined',name);
        }
        // socket.to(roomId).broadcast.emit("user-joined", name)
    });

    socket.on('send',message =>{
        socket.join(roomId);
        // socket.broadcast.to(roomId).emit('receive',  {message:message , name:users[socket.id]});
        // socket.broadcast.emit('receive', {message:message,name:users[socket.id]})

        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
 
    });
    // jab yeh ho toh baaki logo ko bata do ki mai disconnect ho chuka hu
    socket.on('disconnect' ,message=>{
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id];
    })
   
})

