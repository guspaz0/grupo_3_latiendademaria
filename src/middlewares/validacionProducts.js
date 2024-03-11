const { body, checkSchema, validationResult } = require('express-validator');
const productos = require('../models/products');
const Images = require('../models/images')
const path = require('path');
const categories = require('../models/categories');
const Colors = require('../models/colors');

const extNames = ['image/jpeg', 'image/png', 'image/jpg']
const maxFileSize = 2048000 //bytes

module.exports = {
    formProducto: function () {
        return [
            body('name')
                .notEmpty().withMessage('completar el nombre')
                .isLength({min: 5, max:50}).withMessage('el nombre debe ser entre 4 a 50 caracteres'),
            body('description')
                .notEmpty().withMessage('no puede estar vacio')
                .isLength({min: 20, max: 256}).withMessage('Maximo 256 caracteres'),
            body('image')
                .custom((value, {req})=>{
                    //console.log(req.body)
                    if (!req.files.length > 0 && req.body.imageHold) return true
                    if (!req.files.length > 0 && !req.body.imageHold) throw Error('debes subir al menos una imagen')
                    return true
                })
                .custom((value, {req})=> {
                    if (!req.files.length > 0 && req.body.imageHold) return true
                    if (req.files.length > 0) return req.files.some((file) => extNames.includes(file.mimetype))
                    return true
                }).withMessage(`solo se admiten archivos ${extNames.join(', ')}`)
                .custom((value, {req})=>{
                    if (!req.files.length > 0 && req.body.imageHold) return true
                    if (req.files.length > 0) return req.files.some((file) => file.size <= maxFileSize)
                    return true                    
                }).withMessage(`el tamaño maximo permitido por imagen es ${maxFileSize/1024} KB`),
            body('line')
                .notEmpty().withMessage("seleccionar una linea de producto")
                .custom(value => {return value == 'artesanal' || value == 'sublimada'}).withMessage('Campo "Linea" inexistente'),
            body('category')
            .custom(async (value) => {
                const allCategories = await categories.all()
                return allCategories.some(({id}) => id == value)}).withMessage('Campo "Categoria" inexistente'),
            body('color.*')
                .notEmpty()
                .isHexColor().withMessage('Solo se admite colores con valor hexadecimal')
                .custom(async(value) => {
                    const allColors = await Colors.all()
                    return allColors.some(({hex})=> hex == value.toUpperCase())
                }).withMessage('Campo "Color" no existe'),
            body('price')
                .notEmpty().withMessage("el precio no puede estar vacio")
                .isDecimal().withMessage('Debe ser un numero con 2 decimales maximo'),
            body('stock')
                .notEmpty()
                .isNumeric().withMessage('Solo numeros')
        ]
    },

    formEditProducto: function () {
        return [
            body('id')
                .custom(async (value,{req}) => {
                    const productDetail = await productos.detail(+value)
                    return productDetail.id === +req.params.id
                }).withMessage('el product Id no existe'),
            body('name')
                .notEmpty().withMessage('completar el nombre')
                .isLength({min: 4, max:50}).withMessage('el nombre debe ser entre 4 a 50 caracteres'),
            body('description')
                .notEmpty().withMessage('no puede estar vacio')
                .isLength({max: 256}).withMessage('Maximo 256 caracteres'),
            body('image')
                .custom((value, {req})=>{
                    if (!value && req.body.imageHold) return true
                    if (!value && !req.body.imageHold) throw Error('debes Subir al menos una imagen')
                }),
            body('imageHold.*')
                .custom(async (value,{req}) => {
                    if (value) {
                        const productDetail = await productos.detail(+req.body.id)
                        return productDetail.images.some((img) => img.pathName == value)
                    } else return true
                }).withMessage('la imagen de origen local no existe o no es pertinente al producto'),
            body('line')
                .custom(value => {return value == 'artesanal' || value == 'sublimada'}).withMessage('Campo "Linea" inexistente'),
            body('category')
                .custom(async (value) => {
                    const allCategories = await categories.all()
                    return allCategories.some(c => c.name == value)}).withMessage('Campo "Categoria" inexistente'),
            body('color.*')
                .notEmpty()
                .isHexColor().withMessage('Solo se admite colores con valor hexadecimal')
                .custom(async(value) => {
                    const allColors = await Colors.all()
                    return allColors.some(({hex})=> hex == value.toUpperCase())
                }).withMessage('Campo "Color" no existe'),
            body('price')
                .notEmpty()
                .isNumeric().withMessage('Debe ser un numero'),
            body('stock.*')
                .notEmpty()
                .isNumeric().withMessage('Solo numeros')
        ]
    }
}