const mongoose=require('mongoose');

const launchSchema=new mongoose.Schema({
  flightNumber:{
    type:Number,
    required:true,
  },
  launchDate:{
    type:Date,
    required:true
  },
  mission:{
    type:String,
    required:true,

  },
  rocket:{
     type:String,
     required:true,
  },
  target:{
     type:String,
     required:true,
  },
  upcoming:{
    type:Boolean,
    required:true,
  }, 
  success:{
    type:Boolean,
    required:true,
    default:true
  },
  customers:[String]
})



//what happen? > take the launchSchema to db as the "" launches "" which make the collection plural form
 module.exports=  mongoose.model('Launch',launchSchema)