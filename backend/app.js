// Import

// Gestion des variables d'environnement avec le fichier .env
require('dotenv').config({ path: process.cwd() + '/.env' });

// Appel de Express
const express = require ('express')

// Appel de la config de la base de donnée (MongoDB)
require('./middleware/dbConfig');

// Pour les gestion des images (express.static)
const path = require('path');

// Appel des routes
const userRoutes = require('./routes/user')

// constante pour les appels de express
const app = express()

// MIDDLEWARE

// Headers, permet l'acces des utilisateurs. (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

// Parse de express
app.use(express.json())

// Gestion des static (images)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Appel routes
app.use('/api/auth/', userRoutes)

//Exportation module
module.exports = app
