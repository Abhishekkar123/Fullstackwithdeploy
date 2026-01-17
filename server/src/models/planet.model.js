const {parse}=require('csv-parse');
const fs=require('fs');
const path=require('path');
const planets=require('./planet.mongo');


console.log(planets.constructor.name)
// const result=[];

function isHabitablePlanet(planet){
    return planet['koi_disposition']==='CONFIRMED' 
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
     && planet['koi_prad'] < 1.6;
}

/**
 * const promise=new Promise((tres,rej)=>{
 * res(42)})
 * promise.then((result)=>{})
 * 
 * await
 */

function loadPlanetData(){

  return new Promise((resolve,reject)=>{fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
   .pipe(parse({
       comment:'#', 
       columns:true,
   
   }))
    .on('data',async(data)=>{
       if(isHabitablePlanet(data)){ 
      //    //insert+update=upsert  
      //    //  result.push(data);
      //   await planets.updateOne({
      //    keplerName:data.kepler_name,
      //   },{

      //   },{
      //    upsert:true
      //   });
      savePlanet(data);
       }
    })
    .on('err',(err)=>{
       console.log(err);
       reject(err);
    })
    .on('end',async()=>{

      const countPlanetsFound=(await getAllPlanets()).length;
       console.log(`${countPlanetsFound}  habitable planets`);
       // console.log('done');
       resolve();
    });
   });
 }


 async function getAllPlanets(){
   return await  planets.find({},{
      '_id':0,'__v':0,
   });
 }

 async function savePlanet(planet){
   try{
      await planets.updateOne({
            keplerName: planet.kepler_name,
           },{
            keplerName: planet.kepler_name,
           },{
            upsert:true,
           });
   }
   catch(err){
      console.error(`Could not save planet ${err}`)
   }

 }

 module.exports={
   loadPlanetData,
    getAllPlanets
 }




