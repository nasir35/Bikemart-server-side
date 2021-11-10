const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.atq4j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    try{
        await client.connect();
        console.log('database connected!');
        const database = client.db('bikemart');
        const productsCollection = database.collection('products');

        // GET API

        // POST API

        // PUT API
    }
    finally{
        // await client.close();
    }
}
run().catch(()=> console.dir());
app.get('/', (req, res) => {
    res.send('Welcome to the server of BikeMart..!');
});
app.listen(port, () => {
    console.log('server running on port', port);
});