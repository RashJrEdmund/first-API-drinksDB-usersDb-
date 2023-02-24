const db = require('./readWrite');
const { writeJson, readRequestData, getIdFromUrl } = require("./utils");

function getAllDrinks (req, res){
  const drinks = db.getDrinks();
  writeJson(res, drinks);
}

function getOneDrink(req, res) {
  const ID = getIdFromUrl(req.url);
  const drinks = db.getDrinks();
  const drink = drinks.find((dr) => dr.id === ID);
  if (drink) {
    writeJson(res, drink);
  } else {
    writeJson(res, { status: "NOT_FOUND" }, 404);
  }
}

async function createDrink (req, res) {
  const data = await readRequestData(req);
  const drinks = db.getDrinks();
  drinks.push({ ...data, id: Date.now()});
  db.saveDrinks(drinks)
  writeJson(res, drinks.pop()); // this line returns res, and the last element in the drinks array
}

async function updateOneDrink(req, res) {
  const id = getIdFromUrl(req.url);
  const { name, ingredients, userId, description, recipe } = await readRequestData(req);
  if (!name || !ingredients || !userId || !description || !recipe ) {
    return writeJson(res, { error: "Drink datat missing" }, 403);
  }
  const drinks = db.getDrinks();
  const index = drinks.findIndex((drink) => drink.id === id);
  if (index > -1) {
    drinks.splice(index, 1, { name, ingredients, userId, description, recipe, id });
    db.saveDrinks(drinks);
    writeJson(res, drinks[index]);
  } else {
    writeJson(res, { status: "NOT_FOUND" }, 404);
  }
}

async function patchOneDrink(req, res) {
  const data = await readReaquestData(req);
  const id = getIdFromUrl(req.url);
  const drinks = db.getDrinks();
  const index = drinks.findIndex((drink) => drink.id === id);
  if (index > -1 ) {
    drinks.splice(index, 1, {...drinks[index], ...data })
    db.saveDrinks(drinks);
    writeJson(res, drinks[index]);
  } else {
    writeJson(res, { status: "Not Found"}, 404);
  }
}

function deleteOneDrink(req, res) {
  const ID = getIdFromUrl(req.url);
  const drinks = db.getDrinks();
  const index = drinks.findIndex((drink) => drink.id === ID);
  if (index > -1) {
    drinks.splice(index, 1);
    db.saveDrinks(drinks);
  }
  writeJson(res, { status: "success" });
}

module.exports = {
  getAllDrinks,
  getOneDrink,
  createDrink,
  updateOneDrink,
  patchOneDrink,
  deleteOneDrink
};
