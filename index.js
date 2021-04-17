const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const app = express();

// databse connection uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jdxha.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// PORT
const PORT = process.env.PORT || 4444;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("body-service").collection("services");
    console.log('Error ', err);
    console.log('Database connection successfully')


    // Contact Form API
    app.post('/formData', (req, res) => {
        const data = req.body;
        console.log(data);
        collection.insertOne(data)
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result);
            })
    })


    // Review Create Form API 
    app.post('/reviewForm', (req, res) => {
        const reviewData = req.body;
        collection.insertOne(reviewData)
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result)
            })
    })


    // Review Read data from server
    app.get('/review', (req, res) => {
        collection.find({})
            .toArray((error, documents) => {
                res.send(documents);
            })
    })


    // Add service 
    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        const filePath = `${__dirname}/service/${file.name}`

        file.mv(filePath, error => {
            if (error) {
                console.log(error);
                return res.status(500).send({ msg: 'Failed to upload' })
            }
            const newImg = fs.readFileSync(filePath);
            const encImg = newImg.toString('base64');

            const image = {
                contentType: req.files.file.mimeType,
                size: req.files.file.size,
                img: Buffer(encImg, 'base64')
            }

            collection.insertOne({ title, description, image })
                .then(result => {
                    fs.remove(filePath, err => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({ msg: 'Failed to upload' })
                        }
                        res.send(result.insertedCount > 0);
                    })

                })
        })
    })


    // booking formData
    app.post('/booking', (req, res) => {
        const reviewData = req.body;
        collection.insertOne(reviewData)
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result)
            })
    })


    // login admin
    app.post('/loginAdmin', (req, res) => {
        const reviewData = req.body;
        collection.insertOne(reviewData)
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result)
            })
    })



});


// Create API 
app.get('/', (req, res) => {
    res.send('Hello everyone, database its working , Ok ')
})
app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`)
});