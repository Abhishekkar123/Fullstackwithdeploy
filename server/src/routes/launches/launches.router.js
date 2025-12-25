const {launches}=require('../../models/launches.model')
const express=require('express');
const {httpsGetAllLaunches,httpAddNewLaunch,httpAbortLaunch}=require('../launches/launches.controller');


const launchesRouter=express.Router();

launchesRouter.get('/launches',httpsGetAllLaunches);
launchesRouter.post('/launches',httpAddNewLaunch);

launchesRouter.delete('/launches/:id',  httpAbortLaunch)


module.exports=launchesRouter

