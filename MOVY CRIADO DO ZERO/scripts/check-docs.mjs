import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("data/movy.sqlite");
const docs = db.prepare("SELECT COUNT(*) AS total FROM app_documents WHERE audience = 'rider' AND required = 1 AND active = 1").get();
const names = db.prepare("SELECT name FROM app_documents WHERE audience = 'rider' AND required = 1 AND active = 1 LIMIT 8").all();
console.log(JSON.stringify({ required: docs.total, names }));
