const fs = require('fs');
const path = require('path');
const sequelize = require('../db/connection');
const { DataTypes } = require('sequelize');

const db = {};
const modelsPath = __dirname;

fs.readdirSync(modelsPath)
    .filter(file => file.endsWith('.js') && file !== 'index.js')
    .forEach(file => {
        const model = require(path.join(modelsPath, file))(sequelize, DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = require('sequelize');

module.exports = db;
