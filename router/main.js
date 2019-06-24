module.exports = function(app, Transaction)
{
    app.get('/', function(req, res) {
        res.render('index', {
            title: "RFM",
            length: 5
        })
    });

    // GET ALL TRANSACTION
    app.get('/bookkeeping/transactions', function(req,res){
        Transaction.find(function(err, transUnit){
            if(err) return res.status(500).send({error:'database failure'})
            res.json(transUnit)
        })
    })

    // GET SINGLE TRANSACTION
    app.get('/bookkeeping/transactions/:transaction_id', function(req,res){
        Transaction.findOne({_id: req.params.transaction_id}, function(err, transUnit){
            if(err) return res.status(500).json({error:err})
            if(!transUnit) return res.status(404).json({error:'transaction not found'})
            res.json(transUnit)
        })
    })

    // GET TRANSACTION BY AUTHOR
    app.get('/bookkeeping/transactions/author/:author', function(req,res){
        Transaction.find({author: req.params.author}, {_id:0, title:1, date:1, value:1}, function(err, transUnits){
            if(err) return res.status(500).json({error:err})
            if(transUnits.length === 0) return res.status(404).json({error:'transaction not found'})
            res.json(transUnits)
        })
    })

    // CREATE TRANSACTION
    app.post('/bookkeeping/transactions', function(req,res){
        var transUnit = new Transaction()
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

    // UPDATE TRANSACTION
    app.put('/bookkeeping/transactions/:transaction_id', function(req,res){
        Transaction.findById(req.params.transaction_id, function(err, transUnit){
            if(err) return res.status(500).json({error:'database failure'})
            if(!transUnit) return res.status(404).json({error:'transaction not found'})

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

    // DELETE TRANSACTION
    app.delete('/bookkeeping/transactions/:transaction_id', function(req,res){
        Transaction.remove({_id:req.params.transaction_id}, function(err, output){
            if(err) return res.status(500).json({error:'database failure'})
            if(!output.result.n) return res.status(404).json({error:'transaction not found'})
            res.json({message:'transaction deleted'})

            res.status(204).end()
        })
    })
}