const xlsx = require("xlsx");
const importCustomerInDB = require("./type/customer");
const importDriverInDB = require("./type/driver");
const { CUSTOMER, DRIVER } = require("./constants/ImportType");
const connection = require("./database");

const [importId, userId, filename, importType, userTypeId, cityId] = process.argv.slice(2);

async function main() {
    if (!importId || !userId || !filename || !importType) {
        throw new Error(
            `Parâmetros inválidos: importId=${importId}, userId=${userId}, filename=${filename}, importType=${importType}`
        );
    }

    const filePath = `storage/${filename}`;
    const wb = xlsx.readFile(filePath);
    const sheets = wb.SheetNames;

    if (!sheets.length) {
        throw new Error(`Planilha sem abas: ${filePath}`);
    }

    const ws = wb.Sheets[sheets.shift()];
    const data = xlsx.utils.sheet_to_json(ws).map((row) => {
        const normalized = {};
        Object.keys(row).forEach((key) => {
            normalized[String(key).trim().toLowerCase()] = row[key];
        });
        return normalized;
    });

    switch (parseInt(importType, 10)) {
        case CUSTOMER:
            await importCustomerInDB(data, importId, userId);
            break;
        case DRIVER:
            await importDriverInDB(data, importId, userId, userTypeId, cityId);
            break;
        default:
            throw new Error(`Tipo de importação não encontrado: ${importType}`);
    }
}

main()
    .then(async () => {
        await connection.close();
        process.exit(0);
    })
    .catch(async (error) => {
        console.error(error);
        try {
            await connection.close();
        } catch (_) {
            // ignore close errors
        }
        process.exit(1);
    });
