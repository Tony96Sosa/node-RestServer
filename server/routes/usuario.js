const express = require('express');
const app = express();
const _ = require('underscore');
const bcrypt = require('bcrypt'); // paquete que encripta las contraseñas
const Usuario = require('../models/usuario');

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email role google estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => { //funcion para ingresar a la DB, usuarios es un arreglo de todos los modelos
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            // count fue reemplasado por countDocuments
            Usuario.countDocuments({ estado: true }, (err, conteo) => { // funcion para contar la cantidad de registros
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo,
                })

            });

        })
})

app.post('/usuario', function(req, res) { // mas para crear nuevos registros
    let body = req.body; //usado para optener los datos que ingreso por el postman

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //funcion para encriptar
        role: body.role,
    });
    // para grabar el usuario en la base de datos
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            })
        }
        // usuarioDB.password = null;
        return res.json({
            ok: true,
            usuario: usuarioDB,
        })
    })
})

app.put('/usuario/:id', function(req, res) { // mas para actualizar registros
    let id = req.params.id;
    let body = _pick(req.body, ['nombre', 'email', 'img', 'role', ]);


    //, update, options,
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
        });
    })

})

app.delete('/usuario/:id', function(req, res) { // para poner registros en modo no activo
    let id = req.params.id;
    let cambiaEstado = {
            estado: false,
        }
        // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { para borrar definitivamente 
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => { // para cambiar el estado
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado',
                },
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado,
        })
    });
})

module.exports = app;