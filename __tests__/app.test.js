require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
// const cowsData = require('../data/cows.js');

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
    test('returns cows', async() => {

      const expectation = [
        {
          id: 1,
          sex: 'male',
          number_horns: 11,
          milk: false,
          cow_breed: 'Sebu',
          owner_id: 1,
        },
        {
          id: 2,
          sex: 'female',
          number_horns: 22,
          milk: true,
          cow_breed: 'charolais',
          owner_id: 1,
        },
        {
          id: 3,
          sex: 'male',
          number_horns: 22,
          milk: true,
          cow_breed: 'Sebu',
          owner_id: 1,
        },
        {
          id: 4,
          sex: 'female',
          number_horns: 22,
          milk: false,
          cow_breed: 'charolais',
          owner_id: 1,
        }
      ];

      const data = await fakeRequest(app)
        .get('/cows')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    //TEST FOR COWS ID
    test('returns cows id', async() => {

      const expectation = [
        {
          id: 1,
          sex: 'male',
          number_horns: 11,
          milk: false,
          cow_breed: 'Sebu',
          owner_id: 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/cows/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    //TEST PUT IN NEW COW
    test('POST/ cows returns new cow', async() => {

      const newCow = {
        id: 5,
        sex: 'female',
        number_horns: 2,
        milk: true,
        cow_breed: 'horlandesa',
        // owner_id: 1
      };

      const data = await fakeRequest(app)
        .post('/cows')
        .send(newCow)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.number_horns).toEqual(newCow.number_horns);
      expect(data.body.id).toBeGreaterThan(0);
    });
  });
});


