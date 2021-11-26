const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const blogsCollection = database.collection('blog_collection');
        const userCollection = database.collection('users');
        const ordersCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');

        // GET api for all products
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        // GET api for feature products
        app.get('/feature-products', async(req, res) => {
            const cursor = productsCollection.find({}).limit(6);
            const products = await cursor.toArray();
            res.send(products);
        });
        // GET api for specific product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const product = await productsCollection.findOne(query)
            res.send(product);
        });
        // GET API for reviews
        app.get('/reviews/published', async(req, res) => {
            const query = {reviewStatus : 'Published'}
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        // GET API for reviews
        app.get('/reviews', async(req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        // GET api for blog
        app.get('/blogs', async(req, res) => {
            const cursor = blogsCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        });
        // GET api for orders
        app.get('/orders', async(req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        // GET api for check unique order id
        app.get('/orders/:id', async(req, res) => {
            const orderId = req.params.id;
            const query = {orderId : orderId}
            const uniqueId = await ordersCollection.findOne(query);
            if(uniqueId !== null){
            res.send({uniqueId : false});
            }
            else{
                res.send({uniqueId : true});
            }
        });
        // get api for checking admin role
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
        // POST api for adding users
        app.post('/users', async (req, res) => {
            const data = req.body;
            const result = await userCollection.insertOne(data);
            res.send('user added!');
        });
        // POST api for adding products
        app.post('/products', async(req, res) => {
            const data = req.body;
            const result = await productsCollection.insertOne(data);
            res.send(result);
        });
        // POST api for adding blogs
        app.post('/blogs', async(req, res) => {
            const data = req.body;
            const result = await blogsCollection.insertOne(data);
            res.send(result);
        });
        // POST api for adding reviews
        app.post('/reviews', async(req, res) => {
            const data = req.body;
            const result = await reviewCollection.insertOne(data);
            res.send(result);
        });
        // POST api for adding order
        app.post('/placeorder', async(req, res) => {
            const data = req.body;
            const result = await ordersCollection.insertOne(data);
            res.send(result);
        });

        // PUT API
        //UPDATE api for order status
        app.put('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id : ObjectId(id)};
            const options = { upsert : true};
            const updateDoc = {
                $set: {
                    orderStatus : 'Shipped'
                },
            };
            const result = await ordersCollection.updateOne(filter,updateDoc,options);
            res.send(result);
        });
        //UPDATE api for review status
        app.put('/reviews/pending/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id : ObjectId(id)};
            const options = { upsert : true};
            const updateDoc = {
                $set: {
                    reviewStatus : 'Pending'
                },
            };
            const result = await reviewCollection.updateOne(filter,updateDoc,options);
            res.send(result);
        });
        app.put('/reviews/publish/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id : ObjectId(id)};
            const options = { upsert : true};
            const updateDoc = {
                $set: {
                    reviewStatus : 'Published'
                },
            };
            const result = await reviewCollection.updateOne(filter,updateDoc,options);
            res.send(result);
        });
        //Udate api for making admin
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

        //DELETE api for product
        app.delete('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        });
        //DELETE api for order
        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        });
        //DELETE api for order
        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
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