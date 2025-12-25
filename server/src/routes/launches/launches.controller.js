const {
    getAllLaunches,
   addNewLaunch,
   existsLaunchWithId,
   abortLaunchById,
}=require('../../models/launches.model');

function httpsGetAllLaunches(req,res){
    // console.log(Array.from(launches.values()))
     return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req,res){
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
     addNewLaunch(launch)
    return res.status(201).json(launch);
}

function httpAbortLaunch(req,res){
    const launchId =Number(req.params.id);
    if(!existsLaunchWithId(launchId)){
    return  res.status(404).json({
    error:'Launch not Found',
   })
}


  const aborted=abortLaunchById(launchId);
   return res.status(200).json(aborted);

}

module.exports={
    httpsGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}

