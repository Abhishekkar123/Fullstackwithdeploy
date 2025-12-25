const {parse}=require('csv-parse');
const fs=require('fs');
const path=require('path');

const result=[];


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
    .on('data',(data)=>{
       if(isHabitablePlanet(data)){   
           result.push(data);
       }
    })
    .on('err',(err)=>{
       console.log(err);
       reject(err);
    })
    .on('end',()=>{
       console.log(`${result.length}  habitable planets`);
       // console.log('done');
       resolve();
    });
   });
 }


 function getAllPlanets(){
   return result;
 }

 module.exports={
   loadPlanetData,
    getAllPlanets
 }




