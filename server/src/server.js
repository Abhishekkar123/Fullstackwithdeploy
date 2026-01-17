const http=require('http');
const app=require('./app')
const mongoose=require('mongoose')
const {loadPlanetData}=require('./models/planet.model');
const server=http.createServer(app);

const MONGO_URL="mongodb+srv://chinukar2001_db_user:nasaProject@cluster0.wbw1qn3.mongodb.net/?appName=Cluster0"
const PORT=process.env.PORT || 8000;


mongoose.connection.once('open',()=>{
    console.log("Connected the atlas cluster")
})
mongoose.connection.on('error',(err)=>{
    console.error(err)
})
async function startServer(){
  await mongoose.connect(MONGO_URL);

    await loadPlanetData(); 
    
    server.listen(PORT,(req,res)=>{
        console.log(`listening on the ${PORT}`)
    })
}
startServer();




// console.log(PORT)