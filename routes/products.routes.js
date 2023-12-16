const express = require('express')
const router = express.Router()
const { products } = require('../controllers')
const multer = require('multer')
const path = require('path')

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `/images/uploads`)
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
	}
})

let upload = multer({storage: storage})


router.route('/')
    .get(products.index)  // para primera vista o resetear filtro
    .post(products.index) // para el filtro de products
;

router.route('/create') 
    .get(products.create)
    .post(upload.any(), products.create)

router.route('/:id/edit')
    .get(products.edit) // para renderizar al front el form edit de producto
    .put(products.update)
; 

router.route('/:id')
    .get(products.index)
    .delete(products.delete)
;




module.exports = router