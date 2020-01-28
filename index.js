const express = require("express");

const server = express();

server.use(express.json());

const users = ["Diego", "Robson", "Victor"];

server.use((request, response, next) => {
  console.time("Request");
  console.log(`Método: ${request.method}; URL: ${request.url}`);

  next();

  console.timeEnd("Request");
});

function checkBodyForName(request, response, next) {
  if (!request.body.name) {
    return response.status(400).json({ error: "User name is required" });
  }

  return next();
}

function checkUserInArray(request, response, next) {
  const { index } = request.params;
  const user = users[index];

  if (!user) {
    return response.status(400).json({ error: "User does not exists" });
  }

  request.user = user;

  return next();
}

server.get("/users", (request, response) => {
  return response.json(users);
});

server.get("/users/:index", checkUserInArray, (request, response) => {
  // getting user from array based on index in url parameter
  // const { index } = request.params;
  // return response.json(users[index]);

  // user added to request in checkUserInArray
  return response.json(request.user);
});

server.post("/users", checkBodyForName, (request, response) => {
  const { name } = request.body;

  users.push(name);

  return response.json(users);
});

server.put(
  "/users/:index",
  checkUserInArray,
  checkBodyForName,
  (request, response) => {
    const { index } = request.params;
    const { name } = request.body;

    users[index] = name;

    return response.json(users);
  }
);

server.delete("/users/:index", checkUserInArray, (request, response) => {
  const { index } = request.params;

  users.splice(index, 1);

  return response.send();
});

server.listen(3000);
