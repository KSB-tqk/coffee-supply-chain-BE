import { MongoClient as _MongoClient } from "mongodb";
const MongoClient = _MongoClient;

const connectionUrl =
  "mongodb+srv://khanhsb1:k02092001@cluster0.glhd5pl.mongodb.net/?retryWrites=true&w=majority";
const database = "coffee-supply-chain";

MongoClient.connect(connectionUrl).then(() => {
  console.log("Connected correctly!");
});
