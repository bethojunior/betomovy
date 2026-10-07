const { validateEmail, validateName } = require('../validators/StringValidator');
const { onlyNumbersAndLetters } = require('../helpers/String');
const { IMPORT_COMPLETED } = require('../constants/AdminNotificationType');
const User = require("../models/User");
const LevelAccess = require("../models/LevelAccess");
const Balance = require("../models/Balance");
const Config = require("../models/Config");
const Customer = require("../models/Customer");

const connection = require('../database');
const Import = require("../models/Import");
const AdminNotification = require("../models/AdminNotification");

async function importCustomerInDB(data, importId, userId) {
    console.log("Buscando registro de importação");
    const importData = await Import.findByPk(parseInt(importId, 10));

    if (!importData) {
        throw new Error(`Importação não encontrada: ${importId}`);
    }

    let successRows = 0;
    let failedRows = 0;

    console.log("Buscando configuração de senha padrão");
    const configDefaultPassword = await Config.findOne({
        where: {
            key: 'default_import_password'
        }
    });

    if (!configDefaultPassword || !configDefaultPassword.value) {
        throw new Error("Configuração default_import_password não encontrada");
    }

    const defaultPassword = Buffer.from(configDefaultPassword.value).toString('base64');

    console.log(`Alimentando registros (${data.length})...`);
    for (let index = 0; index < data.length; index++) {
        const result = await feedRecord(data[index], defaultPassword, importData);
        if (!result) {
            failedRows++;
        } else {
            successRows++;
        }
    }

    console.log("Atualizando registro de importação");
    await Import.update({ status: 'finished' }, { where: { id: importData.id } });

    console.log("Notificando painel");
    await AdminNotification.create({
        userId: userId,
        adminNotificationTypeId: IMPORT_COMPLETED,
        message: `${successRows} linhas com sucesso e ${failedRows} linhas com falha`,
        title: "IMPORTAÇÃO FINALIZADA"
    });

    console.log("Fim da execução");
    console.log('Falhas: ', failedRows, ', Sucesso: ', successRows);
    return true;
}

async function feedRecord(record, defaultPassword, importData) {
    const t = await connection.transaction();

    try {
        await validateRow(record);

        const balance = await Balance.create({}, { transaction: t });

        const user = await User.create({
            name: record.nome.trim(),
            email: record.email.trim(),
            phone: record.telefone ? onlyNumbersAndLetters(record.telefone) : null,
            document: record.cpf ? onlyNumbersAndLetters(String(record.cpf)) : null,
            password: defaultPassword,
            isImport: true,
            importDate: new Date(),
            statusId: 1
        }, { transaction: t });

        await LevelAccess.create({
            userId: user.idUser,
            userTypeId: 5
        }, { transaction: t });

        await Customer.create({
            userId: user.idUser,
            balanceId: balance.idBalance
        }, { transaction: t });

        await t.commit();
    } catch (e) {
        console.error('\n', 'Erro: ', e);
        await t.rollback();

        await Import.increment({ failedRow: 1 }, { where: { id: importData.id } });

        return null;
    }

    console.log('\n', 'Sucesso: ', record);
    await Import.increment({ successRow: 1 }, { where: { id: importData.id } });

    return record;
}

async function validateRow(record) {
    if (!record.nome && !record.email) {
        throw new Error("Dados incompletos");
    }

    if (!validateEmail(record.email)) {
        throw new Error("Email está inválido");
    }

    if (!validateName(record.nome)) {
        throw new Error("Nome está inválido");
    }

    const userExists = await User.findAll({
        where: {
            email: record.email,
            statusId: 1
        },
        include: [{
            model: LevelAccess,
            where: {
                userTypeId: 5
            }
        }]
    });

    if (userExists.length > 0) {
        throw new Error("Usuário existe com esse email " + record.email);
    }

    return true;
}

module.exports = importCustomerInDB;
