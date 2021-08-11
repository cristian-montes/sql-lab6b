const client = require('../lib/client');
// import our seed data:
const cows = require('./cows.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      cows.map(cow => {
        return client.query(`
                    INSERT INTO cows (sex, number_horns, milk, cow_breed, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [cow.sex, cow.number_horns, cow.milk, cow.cow_breed, user.id]);
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
