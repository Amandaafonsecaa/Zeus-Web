const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./database/conection");
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend 1
      "http://localhost:8082", // Frontend 2
    ], // URL do frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    credentials: true, // Permite cookies e headers de autenticação
  })
);

// Middleware
app.use(express.json());

//rotas
const ComprasRoute = require("./routes/ComprasRoute");

app.use("/", ComprasRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_PASS:", process.env.DB_PASS);
});
require("./database/conection");

