const generateLocation = (location)=>{
    return {
        url :"https://google.com/maps?q="+location.lat+","+location.long,
        createdAt : new Date().getTime()
    }
}

module.exports = generateLocation