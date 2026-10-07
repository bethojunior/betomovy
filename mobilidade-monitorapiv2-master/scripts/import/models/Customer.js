const { Model, DataTypes } = require('sequelize');

class Config extends Model {
    static init(sequelize) {
        super.init({
            idCustomer: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: DataTypes.INTEGER,
            balanceId: DataTypes.INTEGER,
            customerRegisterStatusId: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            },
            profileImage: {
                type: DataTypes.STRING,
                defaultValue: 'user.png'
            }
        }, {
            sequelize,
            tableName: 'customer',
            timestamps: false
        })
    }
}

module.exports = Config;