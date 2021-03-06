const express = require('express')
const app = express()
const cors = require('cors');
// const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;


require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static('workers'));
// app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello World! 123')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.em86h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const ServiceCollection = client.db("salon").collection("service");
  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new Service:', newService)
    ServiceCollection.insertOne(newService)
      .then(result => {
        console.log('Service', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/service', (req, res) => {
    ServiceCollection.find({}).toArray((err, result) => {
      res.send(result)
    })
  })

  const ReviewCollection = client.db("salon").collection("review");
  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log('adding new Review:', newReview)
    ReviewCollection.insertOne(newReview)
      .then(result => {
        console.log('Review', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/review', (req, res) => {
    ReviewCollection.find({}).toArray((err, result) => {
      res.send(result)
    })
  })


  const AdminCollection = client.db("salon").collection("admin");
  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    console.log('adding new Admin:', newAdmin)
    AdminCollection.insertOne(newAdmin)
      .then(result => {
        console.log('Admin', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/admin', (req, res) => {
    AdminCollection.find({}).toArray((err, result) => {
      res.send(result)
    })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    console.log(email);
    AdminCollection.find({ email: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0);
      })
  })
  
  const ordersCollection = client.db("salon").collection("orders");
  app.post('/addOrder', (req, res) => {
    const newOrders = req.body;
    console.log('adding new Oder:', newOrders)
    ordersCollection.insertOne(newOrders)
      .then(result => {
        console.log('Orders', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  // client.close();
});






app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})