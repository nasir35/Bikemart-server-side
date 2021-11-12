const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const admin = require("firebase-admin");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.atq4j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }
    }
    next();
}

async function run(){
    try{
        await client.connect();
        console.log('database connected!');
        const database = client.db('bikemart');
        const productsCollection = database.collection('products');
        const userCollection = database.collection('users');
        const reviewCollection = database.collection('reviews');

        // GET API
        app.get('reviews', async(req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        // POST API
        app.post('/users', async (req, res) => {
            const data = req.body;
            const result = await userCollection.insertOne(data);
            res.send('user added!');
        });

        app.post('/products', async(req, res) => {
            const data = req.body;
            const result = await productsCollection.insertOne(data);
            res.send(result);
        });

        app.post('/reviews', async(req, res) => {
            const data = req.body;
            const result = await reviewCollection.insertOne(data);
            res.send(result);
        });
        // PUT API
        app.put('/users/admin', verifyToken, async(req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await userCollection.findOne({ email: requester });
                if (requesterAccount.role === 'admin') {
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await userCollection.updateOne(filter, updateDoc);
                    res.send(result);
                }
            }
            else {
                res.status(403).json({ message: 'you do not have access to make admin' })
            }
        });

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