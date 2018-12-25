const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
// const path = require('path');

const app = express();

// Load routes
const todos = require('./routes/todo');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);
// DB config
const db = require('./config/db')

// Connect to mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
}).then(() => {
    console.log('MongoDB Connected...')
}).catch((err) => console.log(err));

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

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// express static
 app.use("/public", express.static(__dirname + '/public'));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
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

// Use routes
app.use('/todo', todos);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`now listening to port ${port}`);
});