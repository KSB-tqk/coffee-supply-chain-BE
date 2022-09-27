const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionUrl = "mongodb://127.0.0.1:27017";
const database = "coffee-supply-chain";

MongoClient.connect(connectionUrl).then(() => {
  console.log("Connected correctly!");
});
