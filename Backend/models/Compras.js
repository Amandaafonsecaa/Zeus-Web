const mongoose = require("mongoose");

const ComprasSchema = new mongoose.Schema({
  categoria: {
    type: String,
    enum: ["ração", "saúde", "lazer", "roupas", "outros"],
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  dataCompra: {
    type: Date,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  loja: {
    type: String,
  },
});

module.exports = mongoose.model("Compras", ComprasSchema);
