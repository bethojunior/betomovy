const { Model, DataTypes } = require('sequelize');

class Balance extends Model {
    static init(sequelize) {
        super.init({
            idBalance: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            }
        }, {
            sequelize,
            tableName: 'balance',
            timestamps: false
        })
    }
}

module.exports = Balance;