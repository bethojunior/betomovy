const { Model, DataTypes } = require('sequelize');

class DocUserType extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            docId: DataTypes.INTEGER,
            userTypeId: DataTypes.INTEGER,
            statusId: DataTypes.INTEGER
        }, {
            sequelize,
            tableName: 'docUserType',
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        })
    }
}

module.exports = DocUserType;
