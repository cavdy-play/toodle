const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

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

// Method Override Middleware
app.use(methodOverride('_method'));

// Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

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

// Todo index page
app.get('/todo', (req, res) => {
    Todo.find({

    }).sort({
        date: 'desc'
    }).then(todos => {
        res.render('todo/index', {
            todos: todos
        });
    }).catch(err => console.log(err));
});

// Add Todo
app.get('/todo/add', (req, res) => {
    res.render('todo/add');
});

// Edit Todo
app.get('/todo/edit/:id', (req, res) => {
    Todo.findOne({
        _id: req.params.id
    }).then(todo => {
        res.render('todo/edit', {
            todo: todo
        });
    }).catch(err => console.log(err));
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
        const newTodo = {
            title: req.body.title,
            details: req.body.details,
            tag: req.body.tag
        }
        new Todo(newTodo).save().then(todo => {
            req.flash('success_msg', 'Todo list added');
            res.redirect('/todo');
        }).catch(err => console.log(err));
    }
});

// Edit form
app.put('/todo/:id', (req, res) => {
    Todo.findOne({
        _id: req.params.id
    }).then(todo => {
        // New 
        todo.title = req.body.title;
        todo.details = req.body.details;
        todo.tag = req.body.tag;

        todo.save().then(todo => {
            req.flash('success_msg', 'Todo list edited');
            res.redirect('/todo');
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

// Delete todo
app.delete('/todo/:id', (req, res) => {
    Todo.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Todo list deleted');
        res.redirect('/todo');
    }).catch(err => console.log(err));
});

const port = 5000;

app.listen(port, () => {
    console.log(`now listening to port ${port}`);
});