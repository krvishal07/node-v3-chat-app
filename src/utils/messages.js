const generateMessage = (text,user)=>{
    return {
        user,
        text,
        createdAt : new Date().getTime()
    }

}

const generateLocationMessage = (url,user)=>{
    return {
        user,
        url,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMessage:generateMessage,
    generateLocationMessage : generateLocationMessage
}