const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')

const url = 'mongodb://localhost:27017'
const dbName =  'edx-course-db'
let app = express()

app.use(logger('dev'))
app.use(bodyParser.json())

mongodb.MongoClient.connect(url, (error, client) => {
    if(error) return process.exit(1)

    let db = client.db(dbName)

    app.get('/accounts', (req, res, next) => {
        db.collection('accounts')
        .find({}, {sort: {_id: -1}})
        .toArray((error, accounts) => {
            if(error) return next(error)
            res.status(200).send(accounts)
        })
    })
    app.get('/accounts/:id', (req, res, next) => {
        db.collection('accounts')
        .find({_id: mongodb.ObjectID(req.params.id)}, {sort: {_id: -1}})
        .toArray((error, accounts) => {
            if(error) return next(error)
            res.status(200).send(accounts)
        })
    })
    app.post('/accounts', (req, res, next) => {
        let newAccount = req.body
        db.collection('accounts').insert(newAccount, (error, results) => {
            if(error) return next(error)
            res.status(201).send(results)
        })
    })
    app.put('/accounts/:id', (req, res, next) => {
        db.collection('accounts')
            .update(
                {_id: mongodb.ObjectID(req.params.id)},
                { $set: req.body },
                (error, results) => {
                    if(error) return next(error)
                    res.status(200).send(results)
                }
            )
    })
    app.delete('/accounts/:id',  (req, res, next) => {
        db.collection('accounts')
            .remove(
                {_id: mongodb.ObjectID(req.params.id)},
                (error, results) => {
                    if(error) return next(error)
                    res.status(200).send(results)
                }
            )
    })
    app.use(errorhandler())
    let port = process.env.PORT || 3000
    app.listen(port, () => { console.log(`Listening on port: ${port}`)})
})