if(process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://cavdy:cavdy123@ds245277.mlab.com:45277/toodle-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/toodle'
    }
}