const { Model, DataTypes } = require('sequelize');

class Import extends Model {
    static init(sequelize) {
        super.init({
            status: DataTypes.STRING,
            importTypeId: DataTypes.INTEGER,
            failedRow: DataTypes.INTEGER,
            successRow: DataTypes.INTEGER,
        }, {
            sequelize,
            tableName: 'import',
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        })
    }
}

module.exports = Import;