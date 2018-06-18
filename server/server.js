let express = require('express');
let bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    // validate id using isValid
    if (!ObjectID.isValid(id)) {
        // 404 if id not valid - send back empty body res.send();
        return res.status(404).send();
    }
    
    // findById
    Todo.findById(id).then((todo) => {
        if (!todo) { // success
            // if no todo - send back 404 with empty body
            return res.status(404).send();
        } 
        
        // if todo - send it back
        res.send({todo});
    }).catch((e) => { // error
        // 400 - don't send error code and send empty body back
        res.status(404).send();
    });
        
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};
