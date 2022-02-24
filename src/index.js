const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter=require('bad-words')

const port = process.env.PORT || 8000
const {generateMessage,generateLocationMessage} = require('./utils/messages')
//const generateLocation = require('./utils/locationMessage')
const users = require('./utils/users')

//express app
const app= express()
const path=require('path')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')




//serving the static things.
const publicPath = path.join(__dirname,'../public')
app.use(express.static(publicPath))



//setup the server through http
const server = http.createServer(app)
const io = socketio(server) 

//


//let count = 0


//this is code which run when connection established
io.on('connection',(socket)=>{
    console.log('New WebSocket Connection')
    
    // //event are emiting or sending on client side
    // //this is initial event i.e. countUpdated
    // socket.emit('countUpdated',count)

    // //handling the increament event..
    // socket.on('increament',()=>{
    //     count++
    //     //after increament we fire event again so,countUpdated with count
    //     //socket.emit('countUpdated',count) 

    //     //io is emit to all user which connect to this server 
    //     io.emit('countUpdated',count)
    // }) 

//sending the message event to the client with 'Welcome message'
//socket.emit('message',generateMessage('Welcome!'))  



//broadcasting the message to all client except those who joined..
//socket.broadcast.emit('message','A new user has joined !') 
//socket.broadcast.emit('message',generateMessage('A new user has joined !')) 



    //listner for chat room 
    socket.on('join',(Options,callback)=>{
       const {error , user} = users.addUser({id : socket.id,...Options})

       //console.log(user)

       if(error){
           return callback(error)
       }

        socket.join(user.room) 
          //fire normal event
        //socket.emit,io.emit,socket.broadcast.emit
          //fire event for room
        //io.to(room).emit,socket.broadcast.to(room).emit 

        socket.emit('message',generateMessage("Welcome !","Admin"))
        socket.broadcast.to(user.room).emit('message',generateMessage("Admin",user.username+ ' has joined')) 
        io.to(user.room).emit('roomData',{
            room : user.room,
            users : getUsersInRoom(user.room)
        })

        callback()

    })

 //--->callback is sending the acknowledgment to client side. 
    socket.on('sendMessage',(message,callback)=>{ 
        const user = users.getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity id not allowed')
        }
        //console.log(message) 
        io.to(user.room).emit('message',generateMessage(message,user.username))
        callback("delivered.")
    })
   
    

    //we sharing the location to all user connected to this server.
    socket.on('sendLocation',(coords,callback)=>{
        const user = users.getUser(socket.id)
        //firing the url so,that we can easly see on map..
        io.to(user.room).emit('locationmessage',generateLocationMessage("https://google.com/maps?q="+coords.lat+","+coords.long,user.username))
        callback('Location shered')
    })

    //listner 
  
    
    //emit the message when user is disconnected
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage("Admin",user.username+" has left !")) 
            io.to(user.room).emit('roomData',{
                room : user.room,
                users : getUsersInRoom(user.room)
            })
        }

        

    })
})


//to start http server
server.listen(port,()=>{
    console.log('Server started...')
})