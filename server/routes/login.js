const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({ //500 error de servidor
                ok: false,
                err,
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos',
                }
            })
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { // funcion que me permite comparar las encriptaciones
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos',
                }
            })
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
        })
    })

})

//Configurciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }

}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let userGoogle = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e,
            })
        })


    Usuario.findOne({ email: userGoogle.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({ //500 error de servidor
                ok: false,
                err,
            });
        };
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({ //500 error de servidor
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal',
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            }
        } else {
            //Si el usuario no existe en la base de datos
            let usuario = new Usuario();
            usuario.nombre = userGoogle.nombre;
            usuario.email = userGoogle.email;
            usuario.google = userGoogle.google;
            usuario.img = userGoogle.img;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({ //500 error de servidor
                        ok: false,
                        err,
                    })
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                })

            })
        }
    })
})


module.exports = app;