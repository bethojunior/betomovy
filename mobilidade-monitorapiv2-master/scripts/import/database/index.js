const Sequelize = require('sequelize');
const dotenv = require('dotenv').config({ path: '../../.env' });

const User = require('../models/User');
const AdminNotification = require('../models/AdminNotification');
const Balance = require('../models/Balance');
const Config = require('../models/Config');
const Customer = require('../models/Customer');
const Import = require('../models/Import');
const LevelAccess = require('../models/LevelAccess');
const Driver = require('../models/Driver');
const Car = require('../models/Car');
const DocUser = require('../models/DocUser');
const DocUserType = require('../models/DocUserType');

const connection = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    define: {
        timestamps: true
    }
})

AdminNotification.init(connection);
Balance.init(connection);
Config.init(connection);
Customer.init(connection);
Import.init(connection);
LevelAccess.init(connection);
User.init(connection);
Driver.init(connection);
Car.init(connection);
DocUser.init(connection);
DocUserType.init(connection);

User.hasOne(LevelAccess, {foreignKey: 'userId', sourceKey: 'idUser'})
User.hasOne(Driver, {foreignKey: 'userId', sourceKey: 'idUser'})

module.exports = connection;
