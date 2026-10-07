const { Model, DataTypes } = require('sequelize');

class LevelAccess extends Model {
    static init(sequelize) {
        super.init({
            idLevelAccess: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: DataTypes.INTEGER,
            userTypeId: {
                type: DataTypes.INTEGER,
                defaultValue: 5
            },
        }, {
            sequelize,
            tableName: 'levelAccess',
            timestamps: false
        })
    }
}

module.exports = LevelAccess;
