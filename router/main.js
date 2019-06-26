module.exports = function(app, Book)
{
    // app.get('/', function(req, res) {
    //     res.render('index', {
    //         title: "RFM",
    //         length: 5
    //     })
    // });

    // GET ALL Book
    app.get('/bookkeeping/books', function(req,res){
        Book.find(function(err, transUnit){
            if(err) return res.status(500).send({error:'database failure'})
            res.json(transUnit)
        })
    })

    // GET SINGLE book
    app.get('/bookkeeping/books/:book_id', function(req,res){
        Book.findOne({_id: req.params.book_id}, function(err, transUnit){
            if(err) return res.status(500).json({error:err})
            if(!transUnit) return res.status(404).json({error:'book not found'})
            res.json(transUnit)
        })
    })

    // GET book BY AUTHOR
    app.get('/bookkeeping/books/author/:author', function(req,res){
        Book.find({author: req.params.author}, {_id:0, title:1, date:1, value:1}, function(err, transUnits){
            if(err) return res.status(500).json({error:err})
            if(transUnits.length === 0) return res.status(404).json({error:'book not found'})
            res.json(transUnits)
        })
    })

    // CREATE book
    app.post('/bookkeeping/books', function(req,res){
        var transUnit = new Book()
        transUnit.title = req.body.title
        transUnit.author = req.body.author
        transUnit.date = req.body.date
        transUnit.value = req.body.value

        transUnit.save(function(err){
            if(err){
                console.error(err)
                res.json({result:0})
                return
            }
            res.json({result:1})
        })
    })

    // UPDATE book
    app.put('/bookkeeping/books/:book_id', function(req,res){
        Book.findById(req.params.book_id, function(err, transUnit){
            if(err) return res.status(500).json({error:'database failure'})
            if(!transUnit) return res.status(404).json({error:'book not found'})

            if(req.body.title) transUnit.title = req.body.title
            if(req.body.author) transUnit.author = req.body.author
            if(req.body.date) transUnit.date = req.body.date
            if(req.body.value) transUnit.value = req.body.value
            
            transUnit.save(function(err){
                if(err) res.status(500).json({error:'failed to update'})
                res.json({message:'book updated'})
            })
        })
    })

    // DELETE book
    app.delete('/bookkeeping/books/:book_id', function(req,res){
        Book.remove({_id:req.params.book_id}, function(err, output){
            if(err) return res.status(500).json({error:'database failure'})
            if(!output.result.n) return res.status(404).json({error:'book not found'})
            res.json({message:'book deleted'})

            res.status(204).end()
        })
    })

    app.get('/api/greeting', (req, res) => {
        res.send("Hello World!")
    })

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "client/build", "index.html"))
    })
}