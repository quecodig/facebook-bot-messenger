const server = require('./server');
const config = require('./config');

server.iniciar(config.port);