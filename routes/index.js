var express = require('express');
var router = express.Router();
var models = require('../models');

router.get( '/' , function(req,res){
    models.Products.findAll({

    }).then(function(products) {
        res.render( 'lists' ,{ products : products });
    });
});

router.get('/write', function(req,res){
    res.render( 'form', { product : ""} );
});

router.post('/write' , function(req,res){
    models.Products.create({
        name : req.body.name,
        description : req.body.description
    }).then(function() {
        res.redirect('/');
    });
});

router.get('/detail/:id' , function(req, res){
    models.Products.findById(req.params.id).then( function(product){
        res.render('detail', { product: product });  
    });
});


router.get('/edit/:id' , function(req, res){
    models.Products.findById(req.params.id).then( function(product){
        res.render('form', { product : product });
    });
});


router.post('/edit/:id' , function(req, res){
    models.Products.findById(req.params.id).then( (product) => {

        models.Products.update(
            {
                name : req.body.name,
                description : req.body.description
            }, 
            { 
                where : { id: req.params.id } 
            }
        ).then(function() {
            res.redirect('/detail/' + req.params.id);
        });
    });   
});


router.get('/delete/:id', function(req, res){
    models.Products.destroy({
        where: {
            id: req.params.id
        }
    }).then(function() {
        res.redirect('/');
    });
});

module.exports = router;