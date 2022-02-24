const users =[ ]

//addUser , removeUser , getUser , getUsersInRoom

const addUser = ({ id, username, room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!room || !username){
        return  {
            error: 'Username and room are required.'
        }
    }

    //Check for existing user

    const exitingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validate username 

    if(exitingUser){
        return {
            error : 'Username is in user'
        }
    }

    //Store user 
    const user = {id,username,room}

    users.push(user)

    return {user}

}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id ===id )

    //
    if(index !== -1){
        return users.splice(index,1)[0]
    }

}


const getUser = (id) =>{
    return users.find((user)=> user.id === id)
}     


const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase()
    return  users.filter((user)=> user.room === room)
}



// // addUser({
// //     id : 12,
// //     username: 'aaa',
// //     room: 'room1'
// // })

// // const res = addUser({
// //     id:22,
// //     username:'bbb',
// //     room:'room1'
// // })


// // console.log(users) 

// // removeUser(22)
// // removeUser(12)
// // console.log(rm)
// console.log(getUser(12))
// console.log(getUsersInRoom('room1'))

module.exports = {
    addUser : addUser,
    removeUser: removeUser,
    getUser:getUser,
    getUsersInRoom: getUsersInRoom
}