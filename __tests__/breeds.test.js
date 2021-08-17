require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const breedsData = require('../data/breeds.js');

describe('app routes', () => {
  describe('routes', () => {
  
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
    //TEST DELETE A COW
    test('DELETE /cow/:id updates cows', async ()=>{
      const expected = breedsData.map(type => type.breed_type);
      //   console.log(breedsData);  
      const data = await fakeRequest(app)
        .get('/breeds')
        .expect(200)
        .expect('Content-Type', /json/);
        // console.log(data.body, 'body data');  
      const breedTypes = data.body.map(type => type.breed_type);

      expect(breedTypes).toEqual(expected);
      expect(breedTypes.length).toEqual(expected.length);
      expect(data.body[0].id).toBeGreaterThan(0);
  
    });
  });
});