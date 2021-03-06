const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );       
                CREATE TABLE breeds (
                  id SERIAL PRIMARY KEY NOT NULL,
                  breed_type VARCHAR(512) UNIQUE NOT NULL
                );    
                CREATE TABLE cows (
                    id SERIAL PRIMARY KEY NOT NULL,
                    sex VARCHAR(512) NOT NULL,
                    number_horns INTEGER NOT NULL,
                    milk BOOLEAN NOT NULL,
                    breed_id INTEGER NOT NULL REFERENCES breeds(id)
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
