const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});


// HOME PAGE MESSAGE
app.get('/', (req, res) => {
  res.send('HELLOW COWARDS!!');
});

// GETTING DATA FROM SQL TABLES
app.get('/cows', async(req, res) => {
  try {
    const data = await client.query('SELECT * from cows');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// app.use(require('./middleware/error'));



// GETTING DATA FROM SQL TABLES by ID
app.get('/cows/:id', async(req, res) => {
  const id = req.params.id;
  try {
    const data = await client.query('SELECT * from cows WHERE id = $1', [id]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});



// POSTING NEW COW ON SQL TABLE
app.post('/cows', async(req, res)=>{
  try {
    const data = await client.query(`
    INSERT INTO cows(
      sex,
      number_horns,
      milk,
      cow_breed
    ) VALUES ($1, $2, $3, $4) 
    RETURNING *`, [
      req.body.sex,
      req.body.number_horns,
      req.body.milk,
      req.body.cow_breed
    ]);
    res.json(data.rows[0]);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

// UPDATING COW ON SQL TABLE
app.put('/cows/:id', async(req, res)=>{
  try {
    const data = await client.query(`
    UPDATE cows
    SET
      sex=$2,
      number_horns=$3,
      milk=$4,
      cow_breed=$5
    WHERE id=$1
    RETURNING *;`, [
      req.params.id,
      req.body.sex,
      req.body.number_horns,
      req.body.milk,
      req.body.cow_breed
    ]);
    res.json(data.rows[0]);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

// DELETING  COW ON SQL TABLE
app.delete('/cows/:id', async(req, res)=>{
  try {
    const data = await client.query(`
    DELETE
    FROM cows
    WHERE id=$1
    RETURNING *;`, [
      req.params.id,
    ]);
    res.json(data.rows[0]);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});


app.use(require('./middleware/error'));

module.exports = app;