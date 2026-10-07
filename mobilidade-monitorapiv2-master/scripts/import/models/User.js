const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        super.init({
            idUser: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: DataTypes.STRING,
            nickname: DataTypes.STRING,
            email: DataTypes.STRING,
            document: DataTypes.STRING,
            phone: DataTypes.STRING,
            password: DataTypes.STRING,
            isImport: DataTypes.BOOLEAN,
            importDate: DataTypes.DATE,
            statusId: DataTypes.INTEGER
        }, {
            sequelize,
            tableName: 'user',
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        })
    }
}

module.exports = User;
