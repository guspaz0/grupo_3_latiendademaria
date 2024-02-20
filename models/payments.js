const fs = require('fs');
const path = require('path');
const users = require('./user')
const products = require('./products')
const db = require('../database/models')

const pagosPath = path.join(__dirname+'/../data/payments.json')
const pagosJson = JSON.parse(fs.readFileSync(pagosPath, 'utf-8'))

module.exports = {
    all: async function(query) {
        try {
            console.log(query)
            let condition = {}
            if (query) condition = {user_id: query}
            const response = await db.Payments.findAll({
                where: condition,
                attributes: {exclude: ['user_id']},
                logging: false,
                raw: true  
            })
            console.log("response PAYMENT", response)

            
            
            if (response.length > 0) return response
            else throw Error
        } catch (error) {
            return error
        }
    },
    detallePago: async function (id) {
        try {
            return await db.Payments.findAll({
                include: [
                    {   association: 'user',
                        attributes: ['id','nombre','apellido']
                    },
                    {
                        association: 'products',
                        include: [
                            {   association: 'product',
                                attributes: ['id','name'],
                                include: {
                                    model: db.Images,
                                    as: 'images',
                                    attributes: ['id','pathName'],
                                    through: { attributes: [] }
                                }
                            },
                            {   association: 'color',
                                attributes: ['id','name','hex']
                            }
                        ],
                        attributes: {exclude: ['id','product_id','payment_id','color_id']}
                    }
                ],
                attributes: {exclude: ['user_id']},
                where: {id},
                logging: false
            })
        } catch (error) {
            return error
        }
    }
}