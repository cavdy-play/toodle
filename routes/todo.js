const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Todo Model
require('../models/Todo');
const Todo = mongoose.model('todos');

// Todo index page
router.get('/', ensureAuthenticated, (req, res) => {
    Todo.find({
        user: req.user.id
    }).sort({
        date: 'desc'
    }).then(todos => {
        res.render('todo/index', {
            todos: todos
        });
    }).catch(err => console.log(err));
});

// Add Todo
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('todo/add');
});

// Edit Todo
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Todo.findOne({
        _id: req.params.id
    }).then(todo => {
        if(todo.user != req.user.id) {
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/todo');
        } else {
            res.render('todo/edit', {
                todo: todo
            });
        }
    }).catch(err => console.log(err));
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
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
            tag: req.body.tag,
            user: req.user.id
        }
        new Todo(newTodo).save().then(todo => {
            req.flash('success_msg', 'Todo list added');
            res.redirect('/todo');
        }).catch(err => console.log(err));
    }
});

// Edit form
router.put('/:id', ensureAuthenticated, (req, res) => {
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
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Todo.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Todo list deleted');
        res.redirect('/todo');
    }).catch(err => console.log(err));
});

// Export
module.exports = router;