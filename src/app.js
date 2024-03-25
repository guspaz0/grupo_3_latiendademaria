const express = require('express');
const path = require('path');
const app = express();
const mainRoutes = require('./routes/main.routes');
const userRoutes = require('./routes/users.routes');
const productRoutes = require('./routes/products.routes');
const dashboard = require('./routes/dashboard.routes');
const api = require('./routes/api.routes');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const loguearRuta = require('./middlewares/loguearRutas') 
const rutaNoEncontrada = require('./middlewares/rutaNoEncontrada');
const recordameMiddleware = require('./middlewares/recordameMiddleware');
const cors = require('cors')
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false
});

const PORT = 3001;


app.disable('x-powered-by')
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//app.use(cors());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'la tienda de maria 2024', 
    resave: false, 
    saveUninitialized: false
}));
app.use(cookieParser())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "http://localhost:5174"); // " update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.use(require('./middlewares/ensureLogin'));
app.use(recordameMiddleware);

app.set('view engine', 'ejs');
app.set('views', './src/views')  // <<--- ejemplo de codigo a usar si se quiere cambiar la ruta views por defecto(./views).

app.use(loguearRuta);

app.use('/api', api)
app.use('/dashboard', dashboard);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/', mainRoutes);

app.use(rutaNoEncontrada)

// Verificar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log(`Connected to the ${DB_NAME} database`);
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Server corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error(`Unable to connect to the database: ${error}`);
  });


