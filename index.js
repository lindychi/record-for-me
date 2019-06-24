var express = require('express');
var app = express();
var router = require('./router/main')(app);

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

var server = app.listen(app.get('port'), function() {
    console.log("Express server has started on port " + app.get('port'))
})

