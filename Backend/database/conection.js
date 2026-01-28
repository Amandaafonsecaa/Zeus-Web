const mongoose = require("mongoose");

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const connect = () => {
  /*
  mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@backend.svixg.mongodb.net/?retryWrites=true&w=majority&appName=BackEnd`
  );

  const connection = mongoose.connection;

  connection.on("error", () => {
    console.error("Error connecting to mongoDB");
  });

  connection.on("open", () => {
    console.log("Connected to mongoDB");
  });
*/
  mongoose
    .connect(
      "mongodb+srv://amandafonseca:amandafr@backend.svixg.mongodb.net/?retryWrites=true&w=majority&appName=BackEnd"
    )
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.error("Erro ao conectar no MongoDB:", err));
};

connect();
module.exports = mongoose;
