const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.b4uwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const juiceCollections = client.db("juiceDB").collection("juice");

    app.post("/juices", async (req, res) => {
      const newJuice = req.body;
      console.log(newJuice);
      const result = await juiceCollections.insertOne(newJuice);
      res.send(result);
    });

    // Find all documents
    app.get("/juices", async (req, res) => {
      const cursor = juiceCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // Find individual documents
    app.get("/juices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await juiceCollections.findOne(query);
      res.send(result);
    });

    app.delete("/juices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await juiceCollections.deleteOne(query);
      res.send(result);
    });

    // Update a specific one
    app.put("/juices/:id", async (req, res) => {
      const id = req.params.id;
      // Set the upsert option to insert a document if no documents match
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedJuice = req.body;
      const juice = {
        $set: {
          name: updatedJuice.name,
          category: updatedJuice.category,
          photo: updatedJuice.photo,
        },
      };
      const result = await juiceCollections.updateOne(query, juice, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (reg, res) => {
  res.send("Welcome to city cup server");
});

app.listen(port, () => {
  console.log("Server is running on port:", port);
});
