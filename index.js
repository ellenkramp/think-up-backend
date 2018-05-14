const cool = require('cool-ascii-faces')
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
app.use(bodyParser.urlencoded({ extended: false }));


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
    const { title, content, tag1, tag2, tag3, category } = postBody;
    console.log(title);
    const result = await client.query(`INSERT INTO posts (title, content, tag1, tag2, tag3, category)
      VALUES ('${title}', '${content}', '${tag1}', '${tag2}', '${tag3}', '${category}');`);
    res.send(result);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
