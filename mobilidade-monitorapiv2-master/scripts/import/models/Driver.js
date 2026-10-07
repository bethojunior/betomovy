const { Model, DataTypes } = require('sequelize');

class Driver extends Model {
    static init(sequelize) {
        super.init({
            idDriver: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: DataTypes.INTEGER,
            balanceId: DataTypes.INTEGER,
            cnh:DataTypes.STRING,
            crlv:DataTypes.STRING,
            cityId: DataTypes.INTEGER,
            profileImage: {
                type: DataTypes.STRING,
                defaultValue: 'user.png'
            }
        }, {
            sequelize,
            tableName: 'driver',
            timestamps: false
        })
    }
}

module.exports = Driver;
