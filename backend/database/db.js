const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "./database/goldshop.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to SQLite database.');
  }
});

module.exports = db;
