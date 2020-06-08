//===================================
// PUERTOS
//===================================

process.env.PORT = process.env.PORT || 3000;

//===================================
// ENTORNO
//===================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================================
// BASE DE DATOS
//===================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://tony96sosa:RjEyb7tbLAARwrh7@cluster0-m6qs8.mongodb.net/cafe';
}

process.env.URLDB = urlDB;