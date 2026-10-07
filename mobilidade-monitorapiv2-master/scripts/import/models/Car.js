const { Model, DataTypes } = require('sequelize');

class Car extends Model {
    static init(sequelize) {
        super.init({
            idCar: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            driverId: DataTypes.INTEGER,
            seatsNumber: DataTypes.INTEGER,
            plate:DataTypes.STRING,
            model:DataTypes.STRING,
            color:DataTypes.STRING,
            brand:DataTypes.STRING,
            renavam:DataTypes.STRING,
            year:DataTypes.STRING,
        }, {
            sequelize,
            tableName: 'car',
            timestamps: false
        })
    }
}

module.exports = Car;
