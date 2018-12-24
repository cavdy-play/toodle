const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load Todo Model
require('../models/Todo');
const Todo = mongoose.model('todos');

// Todo index page
router.get('/', (req, res) => {
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
router.get('/add', (req, res) => {
    res.render('todo/add');
});

// Edit Todo
router.get('/edit/:id', (req, res) => {
    Todo.findOne({
        _id: req.params.id
    }).then(todo => {
        res.render('todo/edit', {
            todo: todo
        });
    }).catch(err => console.log(err));
});

// Process Form
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    Todo.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Todo list deleted');
        res.redirect('/todo');
    }).catch(err => console.log(err));
});

// Export
module.exports = router;