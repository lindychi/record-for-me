module.exports = function(app, fs)
{
    app.get('/', function(req, res) {
        res.render('index', {
            title: "RFM",
            length: 5
        })
    });
}