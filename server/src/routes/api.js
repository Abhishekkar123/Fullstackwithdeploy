const express=require('express');


const planetRouter=require('./planets/planets.router')
const launchesRouter=require('./launches/launches.router')

const api=express.Router();

api.use(planetRouter)
api.use(launchesRouter);

module.exports=api