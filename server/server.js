require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //todas las peticiones que realizamos pasan por estas lineas de codigo

// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.json('get Usuario')
})

app.post('/usuario', function(req, res) { // mas para crear nuevos registros
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        }); //para informar el codigo de estado 
    } else {
        res.json({
            body,
        });
    }
})

app.put('/usuario/:id', function(req, res) { // mas para actualizar registros
    let id = req.params.id;
    res.json({
        id,
    });
})

app.delete('/usuario', function(req, res) { // para poner registros en modo no activo
    res.json('delete Usuario')
})

app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto", process.env.PORT);
})