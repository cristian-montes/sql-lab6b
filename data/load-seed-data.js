const client = require('../lib/client');
// import our seed data:
const cows = require('./cows.js');
const breedsData = require('./breeds.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      breedsData.map(breed => {
        return client.query(`
                    INSERT INTO breeds (breed_type)
                    VALUES ($1)
                    RETURNING *;
        `, 
        [breed.breed_type]);
      })
    );

    await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    await Promise.all(
      cows.map(cow => {
        return client.query(`
                    INSERT INTO cows (
                      sex, 
                      number_horns, 
                      milk, 
                      breed_id)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *;
                `,
        [cow.sex, 
          cow.number_horns, 
          cow.milk, 
          cow.breed_id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
