const router = require("express").Router();
const ComprasController = require("../controllers/ComprasController");

//crud
router.get("/compras", ComprasController.listarCompras);
router.post("/compras", ComprasController.adicionarCompra);
router.put("/compras/:id", ComprasController.editarCompra);
router.delete("/compras/:id", ComprasController.deletarCompras);

module.exports = router;
