const launchDb=require('./launches.mongo');
const planetDb=require('./planet.mongo');

const launches=new Map();

const DEFAULT_FLIGHT_NUMBER=100;
// let latestFlightNumber=100

const launch={
    flightNumber:DEFAULT_FLIGHT_NUMBER,
    mission:'Kepler Exploration X',
    rocket:'Explorer IS1',
    launchDate:new Date('December 27,2030'),
    target:'Kepler-442 b',
    customers:['ZTM','NASA'],
    upcoming:true,
    success:true

}
saveLaunches(launch)

// launches.set(launch.flightNumber,launch)

async function existsLaunchWithId(launchId){
    return await launchDb.findOne({
        flightNumber:launchId,
    });

}

async function getLatestFlightNumber(){
     const latestLaunch=await launchDb
     .findOne()
     .sort('-flightNumber');
     if(!latestLaunch){
       return DEFAULT_FLIGHT_NUMBER;
     }
     return latestLaunch.flightNumber;
}
async function saveLaunches(launch){

    const planets=await planetDb.findOne({
        keplerName:launch.target,
    });

    if(!planets){
        throw new Error('No matching planet found!')
    }
  await launchDb.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  },launch,{
    upsert:true
  })
}

async function getAllLaunches(){
    return await  launchDb.find({},
        {'_id':0,"__v":0}
    );
}

async function scheduleNewLaunch(launch){
    const newFlightNumber=await getLatestFlightNumber()+1;
    const newLaunch=Object.assign(launch,{
        success:true,
        upcoming:true,
        customers:["Zero to Mastery","NASA"],
        flightNumber:newFlightNumber

    });

    await saveLaunches(newLaunch);

}

// function addNewLaunch(launch){
//     latestFlightNumber++;
//     launches.set(latestFlightNumber,
//     Object.assign(launch,{
//     success:true,
//     upcoming:true,
//     customers:["Zero to Mastery","NASA"],
//     flightNumber:latestFlightNumber,
//     }))

// }

async function abortLaunchById(launchId){
//    const aborted= launches.get(launchId);
//    aborted.upcoming=false;
//    aborted.success=false;
//    return aborted;

   const aborted =  await launchDb.updateOne({
     flightNumber:launchId,

   },{
    upcoming:false,
    success:false,
   });

   return aborted.modifiedCount === 1 && aborted.acknowledged===true;

}

// launches.get(100)===launch

module.exports={
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}