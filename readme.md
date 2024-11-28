# City Cup server

### Create Database name and Data collection Name

```
const juiceCollections = client.db("juiceDB").collection("juice");
```

### POST Method

```
 // server site

 app.post("/juices", async (req, res) => {
      const newJuice = req.body;
      console.log(newJuice);
      const result = await juiceCollections.insertOne(newJuice);
      res.send(result);
    });
```

### GET All data / Documents

```
  // Find all documents
    app.get("/juices", async (req, res) => {
      const cursor = juiceCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });
```

### GET single . individual data / document

```
 // Find individual documents
    app.get("/juices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await juiceCollections.findOne(query);
      res.send(result);
    });
```

### DELETE Method

```
 app.delete("/juices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await juiceCollections.deleteOne(query);
      res.send(result);
    });
```

### UPDATE Method

```
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
```
