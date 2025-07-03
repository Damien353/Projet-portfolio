const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const sqlPath = path.join(__dirname, "init.sql");

const db = new sqlite3.Database(dbPath);

const initSql = fs.readFileSync(sqlPath, "utf8");

db.exec(initSql, (err) => {
  if (err) {
    console.error("Erreur lors de l'initialisation de la base :", err.message);
  } else {
    console.log("Base de données initialisée avec succès.");
  }
  db.close();
});
