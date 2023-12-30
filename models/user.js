
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersFilePath = path.join(__dirname, '../utils/users.json');
const Users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

const dataGeoFilePath = path.join(__dirname, '../utils/users.json');
const dataGeo = JSON.parse(fs.readFileSync(dataGeoFilePath, 'utf-8'));

const usersServices = {
    index: function () {
        return Users
    },
    create: function (data, image) {
        const imagen = image.map((x) => {return x.path.split('/public')[1]})
        const {password} = data
        const passEncriptada = bcrypt.hashSync(password, 10)
        let id = 0
        for (let i in Users) {
            if (id < Users[i].id) id = Users[i].id
        }
        const newUser = {id: id+1, ...data, password: passEncriptada, imagen }
        const allUsers = [...Users, newUser ]
        fs.writeFileSync(usersFilePath, JSON.stringify(allUsers,0,4), 'utf-8')
        return newUser
    },
    login: function (data) {
        let { email, password } = data
        let user = Users.find((user) => user.email == email)
        if (!user) return {access: false}
        const checkPass = bcrypt.compareSync(password, user?.password)
        if (checkPass) {
            return {...user, access: true}
        }
    },
    update: function (data) {
        let { id } = data
        const imagenes = data.imagen.map((x) => {return x.path.split('public')[1]})
        console.log(imagenes)
        const unupdatedUsers = Users.filter(x => x.id !== id)
        let updateUser = Users.find(u => u.id == id)
        if (updateUser) {
            updateUser = {...updateUser, ...data, imagen: imagenes}
            const allUsers = [...unupdatedUsers, updateUser]
            fs.writeFileSync(usersFilePath, JSON.stringify(allUsers,0,4), 'utf-8')
            return updateUser
        } else {
            throw new Error('error en la edicion de usuario')
        }
    },
    detail: function (id) {
        const detailUser = Users.find((x) => x.id == id)
        return detailUser
    },
    restore: function (id) {
        
    }
}

module.exports = usersServices