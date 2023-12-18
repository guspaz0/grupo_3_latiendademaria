const path = require('path')
const { products } = require('../models')

const view = path.join(__dirname,'../views/products/');

const productsController = {
    index: function (req,res) {
        let { id } = req.params
        if (!id && req.method == 'POST') { //este if es para el filtro
            res.render(view+'products', { 
                productos: products.filter(req.body),
                categorias: products.categories(),
                colors: products.colors()
            })
        } else if (!id && req.method == 'GET') { // este if es para primera vista o resetear filtro
            res.render(view+'products', { 
                productos: products.all(),
                categorias: products.categories(),
                colors: products.colors()
            })
        } else {
            const detalle = products.detail(id)
            if (detalle) res.render(view+'detail',{ detalle }) // si no, renderiza el detalle de producto que recibo por params
            else res.render('404notFound', {url: req.url}) // si no encuentra el producto, devuelve 404
            
        }
    },
    create: function (req,res) {
        let {method} = req
        if (method == 'GET') {
            res.render(view+'createForm', {
                productEdit: null,
                categorias: products.categories(),
                colors: products.colors()
            })
        } else if (method == 'POST') {
            const newProduct = products.create(req.body, req.files)
            console.log(req.body, req.files)
            if (newProduct) {
                res.send(`producto ${req.body.name} creado con exito!`)
            }
        }
    },

    update: function (req, res) {
        console.log(req.body);
        if(req.params.id && req.body){
        const response = products.edited(req.params.id,req.body)
        console.log("ingreso", response)
        res.send(response)
        }
    },

    edit: function (req,res) {
        try{
        const response = products.edit(req.params.id)

        res.render(`${view}/editForm`, {productEdit: response , categorias: products.categories(),
            colors: products.colors()})
        }
        catch(error){
            res.status(404).send(error)
        }
    },
    delete: function (req,res) {

    }
}

module.exports = productsController