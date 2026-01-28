const Compras = require("../models/Compras");

// Modo mock: quando não há MONGODB_URI, usamos dados em memória.
const USE_MOCK = !process.env.MONGODB_URI;

// Gera datas relativas à data atual para que o painel
// sempre tenha valores em Today / Week / Month / Year, mesmo sem banco real.
const hoje = new Date();
const doisDiasAtras = new Date(hoje.getTime() - 2 * 24 * 60 * 60 * 1000);
const cincoDiasAtras = new Date(hoje.getTime() - 5 * 24 * 60 * 60 * 1000);
const quinzeDiasAtras = new Date(hoje.getTime() - 15 * 24 * 60 * 60 * 1000);
const quarentaDiasAtras = new Date(hoje.getTime() - 40 * 24 * 60 * 60 * 1000);

let comprasMock = [
  {
    _id: "1",
    categoria: "ração",
    descricao: "Ração premium para cachorro 10kg",
    dataCompra: hoje,
    valor: 189.9,
    loja: "PetLove",
  },
  {
    _id: "2",
    categoria: "saúde",
    descricao: "Consulta veterinária de rotina",
    dataCompra: doisDiasAtras,
    valor: 250.0,
    loja: "Clínica Vet Amigo Bicho",
  },
  {
    _id: "3",
    categoria: "lazer",
    descricao: "Brinquedo mordedor resistente",
    dataCompra: cincoDiasAtras,
    valor: 49.9,
    loja: "Petz",
  },
  {
    _id: "4",
    categoria: "roupas",
    descricao: "Coleira e peitoral ajustável",
    dataCompra: quinzeDiasAtras,
    valor: 79.9,
    loja: "Cobasi",
  },
  {
    _id: "5",
    categoria: "outros",
    descricao: "Tapete higiênico pacote com 30 unidades",
    dataCompra: quarentaDiasAtras,
    valor: 59.9,
    loja: "PetShop do Bairro",
  },
];

class ComprasController {
  static async listarCompras(req, res) {
    if (USE_MOCK) {
      return res.status(200).json(comprasMock);
    }

    try {
      const compras = await Compras.find();
      res.status(200).json(compras);
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar as compras", error });
    }
  }

  static async editarCompra(req, res) {
    const { id } = req.params;
    const { categoria, descricao, dataCompra, valor, loja } = req.body;

    if (USE_MOCK) {
      const index = comprasMock.findIndex((c) => c._id === id);

      if (index === -1) {
        return res.status(404).json({ message: "Compra não encontrada!" });
      }

      const dataConvertida = dataCompra ? new Date(dataCompra) : comprasMock[index].dataCompra;

      comprasMock[index] = {
        ...comprasMock[index],
        categoria,
        descricao,
        valor,
        loja,
        dataCompra: dataConvertida,
      };

      return res.status(200).json({
        message: "Compra atualizada com sucesso! (modo mock)",
        compra: comprasMock[index],
      });
    }

    try {
      const compraAtualizada = await Compras.findByIdAndUpdate(
        id,
        { categoria, descricao, dataCompra, valor, loja },
        { new: true }
      );

      if (!compraAtualizada) {
        return res.status(404).json({ message: "Compra não encontrada!" });
      }

      res.status(200).json({
        message: "Compra atualizada com sucesso!",
        compra: compraAtualizada,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar a compra", error });
    }
  }

  static async deletarCompras(req, res) {
    const { id } = req.params;

    if (USE_MOCK) {
      const tamanhoAntes = comprasMock.length;
      comprasMock = comprasMock.filter((c) => c._id !== id);

      if (comprasMock.length === tamanhoAntes) {
        return res.status(404).json({ message: "Compra não encontrada!" });
      }

      return res
        .status(200)
        .json({ message: "Compra removida com sucesso! (modo mock)" });
    }

    try {
      const compraRemovida = await Compras.findByIdAndDelete(id);

      if (!compraRemovida) {
        return res.status(404).json({ message: "Compra não encontrada!" });
      }

      res.status(200).json({ message: "Compra removida com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao remover a compra", error });
    }
  }

  static async adicionarCompra(req, res) {
    const { categoria, descricao, valor, loja, dataCompra } = req.body;
    console.log("Requisição recebida no backend!");
    console.log("Cabeçalhos:", req.headers);
    console.log("Dados recebidos no servidor:", req.body);

    if (!categoria || !descricao || !valor || !dataCompra) {
      return res.status(422).json({
        message: "Todos os campos obrigatórios devem ser preenchidos!",
      });
    }

    const dataCompraConvertida = new Date(dataCompra);

    if (isNaN(dataCompraConvertida)) {
      return res.status(400).json({ message: "Data inválida!" });
    }

    if (USE_MOCK) {
      const novaCompra = {
        _id: String(Date.now()),
        categoria,
        descricao,
        valor,
        loja,
        dataCompra: dataCompraConvertida,
      };

      comprasMock.push(novaCompra);

      return res.status(201).json({
        message: "Compra adicionada com sucesso! (modo mock)",
        compra: novaCompra,
      });
    }

    try {
      const novaCompra = new Compras({
        categoria,
        descricao,
        valor,
        loja,
        dataCompra: dataCompraConvertida,
      });

      await novaCompra.save();
      res.status(201).json({
        message: "Compra adicionada com sucesso!",
        compra: novaCompra,
      });
    } catch (error) {
      console.error("Erro ao adicionar a compra:", error);
      res.status(500).json({ message: "Erro ao adicionar a compra", error });
    }
  }
}

module.exports = ComprasController;
