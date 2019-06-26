var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var session = require('express-session')
var fs = require('fs')
var mongoose = require('mongoose')

app.set('port', (process.env.PORT || 5000))

if (process.env.NODE_ENV === "production") {
    app.use(express.static(__dirname + "/client/build"))
} else {
    app.use(express.static(__dirname + '/public'))
}
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_KEY || '!@#$% key !@#$%',
    resave: false,
    saveUninitialized: true
}))

// var db = mongoose.connection
// db.on('error', console.error)
// db.once('open', function(){
//     console.log("Connected to mongod server")
// })
mongoose.connect(process.env.MONGODB_URI)

var Book = require('./models/book')

var router = require('./router/main')(app, Book);

var server = app.listen(app.get('port'), function() {
    console.log("Express server has started on port " + app.get('port'))
})