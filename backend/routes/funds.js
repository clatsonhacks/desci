const router = require('express').Router();
const { json } = require('express');
let Funds = require('../models/funds.model');

router.route('/').get((req,res)=>{
    Funds.find()
    .then(funds=>res.json(funds))
    .catch(err => res.status(400).json('Error: '+err));
});

router.route('/add').post((req,res)=>{
    const papername = req.body.papername;
    const description = req.body.description;
    const amount = req.body.amount;
    const duration  = Number(req.body.duration);
    const date = Date.parse(req.body.date);

    const newFunds = new Funds({
        papername,
        description,
        amount,
        duration,
        date,
    });
    newFunds.save()
    .then(()=> res.json('funds added!'))
    .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').get((req,res)=>{
    Funds.findById(req.params.id)
    .then(funds => res.json(funds))
    .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').delete((req,res)=>{
    Funds.findByIdAndDelete(req.params.id)
    .then(()=>res.json('Funds deleted.'))
    .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').post((req,res) => {
    Exercise.findById(req.params.id)
    .then(funds => {
        funds.papername = req.body.papername;
        funds.description = req.body.description;
        funds.amount = req.body.amount;
        funds.duration = Number(req.body.duration);
        funds.date = Date.parse(req.body.date);

        funds.save()
        .then(() => res.json('Funds updated!'))
        .catch(err => res.status(400).json('Error: '+err));
    })
    .catch(err => res.status(400).json('Error'+ err));
})
module.exports = router;