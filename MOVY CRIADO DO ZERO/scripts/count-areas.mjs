import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(process.argv[2]);
console.log(JSON.stringify({
  modules: db.prepare("SELECT name, active FROM modules").all(),
  roles: db.prepare("SELECT COUNT(*) AS n FROM roles WHERE id LIKE 'legacy-role-%'").get().n,
  chats: db.prepare("SELECT COUNT(*) AS n FROM driver_chat_messages WHERE id LIKE 'legacy-chat-%'").get().n,
  risks: db.prepare("SELECT COUNT(*) AS n FROM risk_areas WHERE id LIKE 'legacy-risk-%'").get().n
}));
