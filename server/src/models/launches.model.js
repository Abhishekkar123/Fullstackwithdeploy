const axios=require('axios');

const launchDb=require('./launches.mongo');
const planetDb=require('./planet.mongo');

const launches=new Map();

const DEFAULT_FLIGHT_NUMBER=100;
// let latestFlightNumber=100

const launch={
    flightNumber:DEFAULT_FLIGHT_NUMBER,//flight_number
    mission:'Kepler Exploration X',//name
    rocket:'Explorer IS1',//rocket.name=>in spaceX
    launchDate:new Date('December 27,2030'),//date_local
    target:'Kepler-442 b',//not applicable
    customers:['ZTM','NASA'],//payload.customers
    upcoming:true,//upcoming
    success:true,//success

}
saveLaunches(launch)

const SPACEX_API_URL='https://api.spacexdata.com/v5/launches/query'

async function populateLaunches(){
    console.log("Downloading the Launch data");
    const response = await axios.post(SPACEX_API_URL,{
        query:{},
   options:{
    pagination:false,
    populate:[
        {
            path:"rocket",
            select:{
                name:1
            }
        },{
            path:'payloads',
            select:{
                customers:1,

            }

        }
    ]
   }

    });

    if(response.status!==200){
        console.log('Problem downloading launch data');
        throw new Error('Launch Data Download Failed');

    }
    const launchDocs=response.data.docs;

    for(const launchDoc of launchDocs){

        const payloads=launchDoc['payloads']
        const customers=payloads.flatMap((payload)=>{
            return payload['customers'];   
        })
        const launch={
            flightNumber:launchDoc['flight_number'],
            mission:launchDoc['name'],
            rocket:launchDoc['rocket']['name'],
            launchDate:launchDoc['date_local'],
            upcoming:launchDoc['upcoming'],
            succes:launchDoc['success'],
            customers,
        };

        console.log(`${launch.flightNumber} ${launch.mission}`)


        //populate the LAUNCHES Collection
        await saveLaunches(launch);
    }

    
}

async function loadLaunchData(){

    const firstLaunch=await findLaunch({
        flightNumber:1,
        rocket:'Falcon 1',
        mission:'FalconSat'
    });

    if(firstLaunch){
        console.log('Launch data already loaded');
        
    }else{
        await populateLaunches();
    }
    
}


async function findLaunch(filter){
    return await launchDb.findOne(filter)

}

// launches.set(launch.flightNumber,launch)

async function existsLaunchWithId(launchId){
    return await findLaunch({
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

    // const planets=await planetDb.findOne({
    //     keplerName:launch.target,
    // });

    // if(!planets){
    //     throw new Error('No matching planet found!')
    // }
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
     const planets=await planetDb.findOne({
        keplerName:launch.target,
    });

    if(!planets){
        throw new Error('No matching planet found!')
    }
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
    loadLaunchData,
}