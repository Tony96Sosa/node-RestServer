// El modelo de usuario en este caso es un objeto de moongose 
//que me va a permitir crearlo, actualizarlo, etc

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// permite crear objetos
let Schema = mongoose.Schema;

//defino los roles validos para cargar
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol valido',
}

// definiendo el Schema usuario
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
    },
    email: {
        type: String,
        unique: true, //hace que solo se pueda crear un usuario con ese email
        required: [true, 'El correo es requerido'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerido'],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
});
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: 'Error, {PATH} debe ser único.' });

module.exports = mongoose.model('Usuario', usuarioSchema);