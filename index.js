const http = require("http");
const { parse } = require("url");
const {
  getAllDrinks,
  getOneDrink,
  patchOneDrink,
  updateOneDrink,
  createDrink,
  deleteOneDrink
} = require("./drinks");
// importing functions for drinks and users
const {
  getAllUsers,
  createUser,
  getOneUser,
  updateOneUser,
  patchOnUser,
  deleteOneUser,
} = require("./users");
const { writeJson } = require("./utils");

const registerRoute = (routePrefix, handler, req, res) => {
  const {pathname} = parse(req.url);
  if (pathname.startsWith(routePrefix)) {
    handler(pathname, req, res);
  }
}

http
  .createServer(function (req, res) {
    registerRoute("/users", handleUsersRequest, req, res);
    registerRoute("/drinks", handleDrinksRequest, req, res);
  })
  .listen(8088);
console.log("Listening on port 8088");

function throw404(res) {
  writeJson(res, { status: "Resource not found" }, 404);
}

function handleDrinksRequest(pathname, req, res) {
  if (pathname === '/drinks') {
    if (req.method === "GET") {
        getAllDrinks(req, res)
    } else if (req.method === "POST") {
       createDrink(req, res);
    }
  } else if (pathname.split("/").length === 3) {
    switch(req.method) {
      case "GET":
        getOneDrink(req, res);
        return ;//handle get one
      case "PUT":
        updateOneDrink(req, res)
        return ; // handle put one
      case "PATCH":
        patchOneDrink(req, res);
        return ; // handle patch one
      case "DELETE":
        deleteOneDrink(req, res)
        return ; // handle delete one
      default:
        break ;
    }
  }
}

/* 
  the conditions in both handle'---'Request functions are such that are bcs you could:
    GET http://localhost/users
    POST http://localhost/users

    GET http://localhost/users/1
    PUT http://localhost/users/1
    PATCH http://localhost/users/1
    & DELETE http://localhost/users/1

 */

function handleUsersRequest(pathname, req, res) {
  const { method } = req;
  if (pathname === "/users") {
    if (method === "GET") {
      return getAllUsers(req, res);
    } else if (method === "POST") {
      return createUser(req, res);
    }
  } else if (pathname.split("/").length === 3) {
    switch (method.toLowerCase()) {
      case "get":
        return getOneUser(req, res);
      case "put":
        return updateOneUser(req, res);
      case "patch":
        return patchOnUser(req, res);
      case "delete":
        return deleteOneUser(req, res);
      default:
        break;
    }
  }

  throw404(res);
}
