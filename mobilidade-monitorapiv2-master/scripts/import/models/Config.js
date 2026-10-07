const { Model, DataTypes } = require('sequelize');

class Config extends Model {
    static init(sequelize) {
        super.init({
            idConfig: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            key: DataTypes.STRING,
            value: DataTypes.STRING,
        }, {
            sequelize,
            tableName: 'config',
            timestamps: false
        })
    }
}

module.exports = Config;