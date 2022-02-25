const socket = io()


// server(emit) -> client(receive) --acknowledgement ---> server
// client (emit) -> server( receive) --acknowledgement ---> client


// handling the event countUpdate by .on() 
// socket.on('countUpdated',(count)=>{
//     console.log('The count is updated...',count)
// })
// document.querySelector('#increament').addEventListener('click',()=>{
//     //console.log('Clicked')
//     socket.emit('increament')
// })


// Elements getting by document.querySelector('#id'/'elementname'/'.classname')

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('.send-btn')
const $messages = document.querySelector('#message')

//-------selecting templete-------\\

const messageTemplate = document.querySelector('#message-template').innerHTML


// Options
const {username ,room } = Qs.parse(location.search,{ignoreQueryPrefix:true})
//console.log(username,room)
const autoscroll = ()=>{
    // New message element 
    const $newMessages = $messages.lastElementChild()

    //Height of the new message 
    const $newMessagesHeight = $newMessages.offsetHeight
}

//------receiving the event 'message'-----\\

socket.on('message',(msg)=>{
    console.log(msg)  
    //------->rendering the message<------\\
    const html = Mustache.render(messageTemplate,{
        username: msg.user,
        message : msg.text,
        createdAt : moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html) 

})




document.querySelector('#message-form').addEventListener('submit',(e)=>{

    //this prevent from refreshment of page 

    e.preventDefault() 

    $messageFormButton.setAttribute('disabled','disabled')

    // disable
    //getting the data which are enter into input element 
    //const message = document.querySelector('input').value
    const message = e.target.elements.message.value
    //third argument is acknowledment or something extra which send by server 

    socket.emit('sendMessage',message,(error)=>{ 

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value="";
        $messageFormInput.focus();
        if(error){
           return console.log(error)
        }
        console.log("succesfull ")
    })
})




//rendring the location 
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('locationmessage',(location)=>{
    console.log('location',location) 
    const locationCoord = Mustache.render(locationTemplate,{ 
        username : location.user,
        locationCoords: location.url,
        createdAt : moment(location.createdAt).format('h:m a')
    }) 
    $messages.insertAdjacentHTML('beforeend',locationCoord)

})


// ----> getting the location by geolocation api <---\\ 

//getting the element by querySelector()
const $sendLocation = document.querySelector('#send-location')

$sendLocation.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }


    //here we disable our send-location button so,
    //that we can not send multiple request 
    // until 1st request not resolve.
    $sendLocation.setAttribute('disabled','disabled') 


    navigator.geolocation.getCurrentPosition((possition)=>{
        console.log(possition)

        socket.emit('sendLocation',{
            lat : possition.coords.latitude,
            long : possition.coords.longitude
        },(acknowledgement)=>{ 
            console.log(acknowledgement) 
            //after we getting the acknowledgement we will 
            //remove the disable attributes.
            $sendLocation.removeAttribute('disabled')
        })
    })
})

//latitude: 25.5940947
//longitude: 85.1375645 




//getting the form data from index.html or from client side 

socket.emit('join',{username,room},(error)=>{ 
    if(error) {
        alert(error)
        location.href = "/"
    }

})


//rendering the data into side-bar
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
socket.on('roomData',({room , users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
    // console.log(room)
    // console.log(users)

})