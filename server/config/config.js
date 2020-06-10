//===================================
// PUERTOS
//===================================

process.env.PORT = process.env.PORT || 3000;

//===================================
// ENTORNO
//===================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================================
// Vencimiento del Token
//===================================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//===================================
// SEED
//===================================

process.env.SEED = process.env.SEED || 'secret-en-el-desarrollo';

//===================================
// BASE DE DATOS
//===================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL; // variable de entorno de heroku para no mostar la url de mongo
}

process.env.URLDB = urlDB;

//===================================
// Google Cliente ID
//===================================

process.env.CLIENT_ID = process.env.CLIENT_ID || "527229858416-k553ukeechs05o43qcm74g423ibtsg9o.apps.googleusercontent.com";