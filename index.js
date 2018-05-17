const express = require('express')
const app = express();
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header("Access-Control-Allow-Methods",
              "*");
  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
 });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM posts');
    res.send(result.rows);
  client.release();
  } catch(err) {
    console.error(err);
    res.send("Error " + err);
  }
  });

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT category_name FROM categories');
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post('/', async (req, res) => {
  try {
    const client = await pool.connect();
    const postBody = req.body;
    const { title, content, tag1, tag2, tag3, category, username, img_id } = postBody;
    const postBodyArray = [title, content, tag1, tag2, tag3, category, username, img_id];

    const result = await client.query('INSERT INTO posts(title, content, tag1, tag2, tag3, category, uname, img_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', postBodyArray)
  
    res.send(result);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
