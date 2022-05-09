const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rzu7d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const productCollection = client.db('laptopGalaxy').collection('laptops')

        // for load data from mongo db
        app.get('/product', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });


        // for load a product by id

        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        })


        // to post data to database from client side input fields

        app.post('/product', async(req, res) => {
            const newService = req.body;
            const result = await productCollection.insertOne(newService);
            res.send(result);
        })


        // to update data on server
        app.put('/product/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const options = { upsert: true}

            const updatedDOc = {
                $set: {
                    quantity: updatedDOc.quantity
                }
            }

            const result = await productCollection.updateOne(filter, options, updatedDOc);

            res.send(result);


        })





        
        //delete a document from database

        app.delete("/product/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await productCollection.deleteOne(query);

            res.send(result);
        })





    }
    finally {

    }

}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Server Running?')
})


app.listen(port, () => {
    console.log('Server running on port', port);
})