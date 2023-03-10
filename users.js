const db = require("./readWrite");
const { writeJson, readRequestData, getIdFromUrl } = require("./utils");

function getAllUsers(req, res) {
  const users = db.getUsers();
  writeJson(res, users);
}

function getOneUser(req, res) {
  const ID = getIdFromUrl(req.url);
  const users = db.getUsers();
  const user = users.find((u) => u.id === ID);
  if (user) {
    writeJson(res, user);
  } else {
    writeJson(res, { status: "NOT_FOUND" }, 404);
  }
}

async function updateOneUser (req, res) {
  const id = getIdFromUrl(req.url);
  const { firstName, lastName, email } = await readRequestData(req);
  if (!email || !firstName || !lastName) {
    return writeJson(res, { error: "User data missing" }, 403);
  }
  const users = db.getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index > -1) {
    users.splice(index, 1, { email, firstName, lastName, id });
    db.saveUsers(users);
    writeJson(res, users[index]);
  } else {
    writeJson(res, { status: "NOT_FOUND" }, 404);
  }
}

function deleteOneUser(req, res) {
  const ID = getIdFromUrl(req.url);
  const users = db.getUsers();
  const index = users.findIndex((user) => user.id === ID);
  if (index > -1) {
    users.splice(index, 1);
    db.saveUsers(users);
  }
  writeJson(res, { status: "success" });
}

async function patchOnUser(req, res) {
  const id = getIdFromUrl(req.url);
  const data = await readRequestData(req);// handle delete one
  if (!data) {
    return writeJson(res, { error: "User data missing" }, 403);
  }
  const users = db.getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index > -1) {
    users.splice(index, 1, { ...users[index], ...data, id });
    db.saveUsers(users);
    writeJson(res, users[index]);
  } else {
    writeJson(res, { status: "NOT_FOUND" }, 404);
  }
}

async function createUser(req, res) {
  const data = await readRequestData(req);
  if (!data) {
    return writeJson(res, { error: "User data missing" }, 403);
  }
  const newUser = { ...data, id: Date.now() };
  const users = db.getUsers();
  db.saveUsers([...users, newUser]);
  writeJson(res, newUser);
}

module.exports = {
  getAllUsers,
  createUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
  patchOnUser,
};
