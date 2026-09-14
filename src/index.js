const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Server = require('./server');

const server = new Server();
server.listen();

module.exports = server.getApp();
