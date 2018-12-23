const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to mongoose
mongoose.connect('mongodb://localhost/toodle', {
    useNewUrlParser: true
}).then(() => {
    console.log('MongoDB Connected...')
}).catch((err) => console.log(err));

// Load Todo Model
require('./models/Todo');
const Todo = mongoose.model('todos');

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Index Route 
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

// Add Todo
app.get('/todo/add', (req, res) => {
    res.render('todo/add');
});

// Process Form
app.post('/todo', (req, res) => {
    let errors = [];
    if(!req.body.title) {
        errors.push({text: 'Please add a title'});
    } 
    if(!req.body.details) {
        errors.push({text: 'Please add some details'});
    } 
    if(!req.body.tag) {
        errors.push({text: 'Please add a tag'});
    } 

    if(errors.length > 0) {
        res.render('todo/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details,
            tag: req.body.tag
        });
    } else {
        res.send('passed');
    }
});

const port = 5000;

app.listen(port, () => {
    console.log(`now listening to port ${port}`);
});