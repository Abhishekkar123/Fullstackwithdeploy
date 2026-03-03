const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const MONGO_URL=process.env.MONGO_URI
mongoose.connection.once('open',()=>{
    console.log("Connected the atlas cluster")
})
mongoose.connection.on('error',(err)=>{
    console.error(err)
})


async  function mongoConnect(){
    return await mongoose.connect(MONGO_URL)
}


async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports={
    mongoConnect,
    mongoDisconnect
}