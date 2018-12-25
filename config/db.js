if(process.env.NODE_ENV === 'prodection') {
    module.exports = {
        mongoURI: 'mongodb://cavdy:cavdy22@ds245277.mlab.com:45277/toodle-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/toodle'
    }
}