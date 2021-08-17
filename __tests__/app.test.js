require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const cowsData = require('../data/cows.js');


describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      // const signInData = await fakeRequest(app)
      //   .post('/auth/signup')
      //   .send({
      //     email: 'jon@user.com',
      //     password: '1234'
      //   });
      
      // token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    //TEST FOR COWS DATA
    test('GET/returns cows', async() => {

      const expectedShape =
      {
        id: 1,
        sex:'male',
        number_horns:11,
        milk: false,
        breed:'Sebu'
      };
     

      const data = await fakeRequest(app)
        .get('/cows')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body[0]).toEqual(expectedShape);
    }, 100000);

    //TEST FOR COWS ID
    test('GET/returns cows id', async() => {

      const expectation =
        {
          id: 1,
          sex:'male',
          number_horns:11,
          milk: false,
          breed:'Sebu'
        };

      const data = await fakeRequest(app)
        .get('/cows/1')
        .expect('Content-Type', /json/)
        .expect(200);
  

      expect(data.body).toEqual(expectation);
    });
    //TEST POST IN NEW COW
    test('POST /cow in new cow', async ()=>{
      const newCow = {
        sex: 'female',
        number_horns: 8,
        milk: true,
        breed_id:2
      };

      const data = await fakeRequest(app)
        .post('/cows')
        .send(newCow)
        .expect(200)
        .expect('Content-Type', /json/);
        


      expect(data.body.sex).toEqual(newCow.sex);
      expect(data.body.id).toBeGreaterThan(0);
    });
    // //TEST PUT IN NEW COW
    test('PUT /cow/:id updates cows', async ()=>{
      const updateCow = {
        sex: 'humanoid',
        number_horns: 2,
        milk: true,
        breed_id: 2,
      };

      const data = await fakeRequest(app)
        .put('/cows/4')
        .send(updateCow)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.sex).toEqual(updateCow.sex);
      expect(data.body.number_horns).toEqual(updateCow.number_horns);
      expect(data.body.milk).toEqual(updateCow.milk);
      expect(data.body.cow_breed).toEqual(updateCow.cow_breed);
    });
    // //TEST DELETE A COW
    test('DELETE /cow/:id updates cows', async ()=>{
      const deleteCow = {
        sex: 'humanoid',
        number_horns: 2,
        milk: true,
        breed_id: 2
      };

      const data = await fakeRequest(app)
        .delete('/cows/4')
        .send(deleteCow)
        .expect(200)
        .expect('Content-Type', /json/);

      // expect(data.body).toEqual(cowsData);
      expect(data.body.sex).toEqual(deleteCow.sex);
      expect(data.body.milk).toEqual(deleteCow.milk);
      expect(data.body.cow_breed).toEqual(deleteCow.cow_breed);
    });
  });
});