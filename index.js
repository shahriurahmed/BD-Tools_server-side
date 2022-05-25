const express = require('express')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tadel.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        await client.connect();
        const toolsCollection = client.db('bd-tools').collection('tools');
        const orderCollection = client.db('bd-tools').collection('orders');

        // view all tools

        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();

            res.send(tools);
        });

        // view tools by id
        app.get('/purchase/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tool = await toolsCollection.findOne(query);
            res.send(tool);

        })


        //store order information

        app.post('/purchasing', async (req, res) => {
            const purchasing = req.body;
            const result = await orderCollection.insertOne(purchasing);
            res.send(result);
        })


    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From BD Tools')
})

app.listen(port, () => {
    console.log(` BD Tools app listening on ${port}`)
})