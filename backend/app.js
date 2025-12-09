// Simple Result Checker API
// - GET /result?index=IDX&pin=PIN -> returns {found, name, grades}
// - POST /admin/result (json) -> {ok}
// Uses MongoDB collection `results`


const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors());


const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017';
const dbName = process.env.MONGO_DB || 'resultsdb';
let db;


async function start() {
const client = new MongoClient(mongoUrl);
await client.connect();
db = client.db(dbName);
console.log('Connected to MongoDB', mongoUrl, 'DB:', dbName);


// index for fast lookup
await db.collection('results').createIndex({ indexNumber: 1, pin: 1 });


const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Backend listening on', port));
}


// Student lookup
app.get('/result', async (req, res) => {
const { index, pin } = req.query;
if (!index || !pin) return res.status(400).json({ error: 'index and pin required' });
const r = await db.collection('results').findOne({ indexNumber: index, pin: pin });
if (!r) return res.json({ found: false });
// hide pin
delete r.pin;
res.json({ found: true, name: r.name, grades: r.grades });
});


// Admin: add or update a result
app.post('/admin/result', async (req, res) => {
const { indexNumber, pin, name, grades } = req.body;
if (!indexNumber || !pin || !name || !grades) return res.status(400).json({ error: 'missing fields' });
await db.collection('results').updateOne(
{ indexNumber, pin },
{ $set: { name, grades } },
{ upsert: true }
);
res.json({ ok: true });
});


// Admin: list results (pagination simple)
app.get('/admin/results', async (req, res) => {
const page = parseInt(req.query.page || '1');
const limit = parseInt(req.query.limit || '50');
const skip = (page - 1) * limit;
const cursor = db.collection('results').find({}, { projection: { pin: 0 } }).skip(skip).limit(limit);
const items = await cursor.toArray();
res.json({ items });
});


start().catch(err => { console.error(err); process.exit(1); });