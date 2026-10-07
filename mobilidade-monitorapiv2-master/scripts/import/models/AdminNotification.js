const { Model, DataTypes } = require('sequelize');

class AdminNotification extends Model {
    static init(sequelize) {
        super.init({
            userId: DataTypes.INTEGER,
            adminNotificationTypeId: DataTypes.INTEGER,
            message: DataTypes.STRING,
            title: DataTypes.STRING,
        }, {
            sequelize,
            tableName: 'adminNotification',
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        })
    }
}

module.exports = AdminNotification;