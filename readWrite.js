const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "./databases/users.db.json");

function getUsers() {
  try {
    const data = readFileSync(DB_FILE) || "[]";
    return JSON.parse(data);
  } catch (e) {
    console.log(e);
    return [];
  }
}

function saveUsers(users = []) {
  try {
    const data = JSON.stringify(users, null, 4);
    writeFileSync(DB_FILE, data);
  } catch (e) {
    throw new Error("Database write error");
  }
}

const DRINKS_DB_FILE = path.join(__dirname, "./database/drinks.db.json");

function getDrinks () {
  try {
    const data = readFileSync(DRINKS_DB_FILE) || "[]";
    return JSON.parse(data);
  } catch (e) {
    console.log(e);
    return [];
  }
}

function saveDrinks(users = []) {
  try {
    const data = JSON.stringify(users, null, 4);
    writeFileSync(DRINKS_DB_FILE, data);
  } catch (e) {
    throw new Error("Database write error");
  }
}

const db = { saveUsers, getUsers, getDrinks, saveDrinks }

module.exports = db;
