const { Model, DataTypes } = require('sequelize');

class DocUser extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            docId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            docStatusId: DataTypes.INTEGER,
            statusId: DataTypes.INTEGER
        }, {
            sequelize,
            tableName: 'docUser',
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        })
    }
}

module.exports = DocUser;
