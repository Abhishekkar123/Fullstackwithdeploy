const http=require('http');
// const mongoose=require('mongoose');
const dotenv=require('dotenv');
const app=require('./app');


const {loadPlanetData}=require('./models/planet.model');
const {loadLaunchData}=require('./models/launches.model')
const server=http.createServer(app);


const {mongoConnect}=require('./services/mongo')
dotenv.config();

// console.log(process.env.MONGO_URL)

const PORT=process.env.PORT || 8000;



//hello world
async function startServer(){
  await mongoConnect();

    await loadPlanetData(); 
    await loadLaunchData();
    
    server.listen(PORT,(req,res)=>{
        console.log(`listening on the ${PORT}`)
    })
}
startServer();




// console.log(PORT)