// Import

// Import du package http
const http = require('http')

// Import du fichier app.js pour utilisation de l'application sur le serveur
const app = require('./app')

// Configuration du port, renvoi un port valide
const normalizePort = val => {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}

// Si aucun port n'est fourni on écoutera sur le port 8080
const port = normalizePort(process.env.PORT || '8080')
app.set('port', port)


// Recherche les différentes erreurs et les gère de manière appropriée
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error
    }
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
    switch (error.code) {
        // Controle PERMISSIONS
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
            process.exit(1)
            break

        // Controle UTILISATION du port
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.')
            process.exit(1)
            break
            
        default:
            throw error
    }
}

// Création serveur avec express
const server = http.createServer(app)

// Gestions des évenements serveur pour un retour console
server.on('error', errorHandler)
server.on('listening', () => {
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
    console.log('Listening on ' + bind)
})

// Le serveur écoute sur le port définit
server.listen(port)