require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //todas las peticiones que realizamos pasan por estas lineas de codigo

// parse application/json
app.use(bodyParser.json());

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))


// Asi es como importo las rutas del file routes
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos ONLINE');
    });
// await {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }

app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto", process.env.PORT);
})