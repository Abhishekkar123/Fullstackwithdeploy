const {
    getAllLaunches,
   scheduleNewLaunch,
   existsLaunchWithId,
   abortLaunchById,
}=require('../../models/launches.model');

async function httpsGetAllLaunches(req,res){
    // console.log(Array.from(launches.values()))
     return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req,res){
  const launch=req.body;

    launch.launchDate=new Date(launch.launchDate);

    if(!launch.mission || !launch.rocket ||!launch.launchDate|| !launch.target){
           return res.status(400).json({
            error:'Missing required launch property',
           })
    }
    
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
             error:'Invalid launch date',
        })
    }
    await  scheduleNewLaunch(launch)
    console.log(launch)
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req,res){
    const launchId =Number(req.params.id);

    const existsLaunch=await existsLaunchWithId(launchId)
    if(!existsLaunch){
    return  res.status(404).json({
    error:'Launch not Found',
   })
}


  const aborted=await abortLaunchById(launchId);

  if(!aborted){
    return res.status(400).json({
        error:'Launch not aborted',
    })
  }
   return res.status(200).json({
    ok:true,
   });

}

module.exports={
    httpsGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}

