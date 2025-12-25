const request =require('supertest')
const app=require('../../app')
describe('Test Get /launches',()=>{
    test('It Should respond with 200 success',async ()=>{
        const response=await request(app)
        .get('/launches')
        .expect('Content-Type',/json/)  
        .expect(200)
        // expect(response.statusCode).toBe(200);
    })
})

describe('Test POST /launches', () => {

    const completeLaunchDate={
        mission:'USS Enterprise',
        rocket:'NCC 1701-D',
        target:'Kepler-186 f',
        launchDate:'January 4,2028'
     }

     const launchWithoutDate={
        mission:'USS Enterprise',
        rocket:'NCC 1701-D',
        target:'Kepler-186 f',
       
     }

      const launchWithoutData={
        mission:'USS Enterprise',
        rocket:'NCC 1701-D',
        launchDate:'January 4,2028'
       
     }

     const launchDataWithInvalidDate={
        mission:'USS Enterprise',
        rocket:'NCC 1701-D',
        target:'Kepler-186 f',
        launchDate:'zoo'
     }
   test('It Should response to 201 success',async ()=>{

    const response= await request(app)
     .post('/launches')
     .send(completeLaunchDate)
     .expect('Content-Type',/json/)  
     .expect(201)

     const requestDate=new Date(completeLaunchDate.launchDate).valueOf();
     const responseDate=new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate)
     expect(response.body).toMatchObject(launchWithoutDate)

   });
   test('It Should catch missing required properties',async ()=>{
    const response= await request(app)
     .post('/launches')
     .send(launchWithoutData)
     .expect('Content-Type',/json/)  
     .expect(400);

     expect(response.body).toStrictEqual({
    error: 'Missing required launch property'
  });
   });

   test('It should catch Invalid dates',async ()=>{
    const response= await request(app)
     .post('/launches')
     .send(launchDataWithInvalidDate)
     .expect('Content-Type',/json/)  
     .expect(400);

    expect(response.body).toStrictEqual({
     error:'Invalid launch date'
    });

   })
})
