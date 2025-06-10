/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./list.css";
import { useNavigate } from "react-router-dom";

const ListaCompras = () => {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [compraSelecionada, setCompraSelecionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Função para buscar as compras do backend
  useEffect(() => {
    buscarCompras();
  }, []);

  const buscarCompras = async () => {
    try {
      console.log("Buscando compras...");
      const response = await fetch("http://localhost:3000/compras"); // Endpoint do backend
      const data = await response.json();
      console.log("Dados recebidos:", data); // Verifique se os dados estão chegando

      if (response.ok) {
        const comprasOrdenadas = data.sort((a, b) => {
          return new Date(b.dataCompra) - new Date(a.dataCompra);
        });
        setCompras(comprasOrdenadas);
      } else {
        console.error("Erro ao buscar compras:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao buscar compras:", error);
    }
  };

  const handleCompraClick = (compra) => {
    setCompraSelecionada(compra);
    setMostrarModal(true);
  };

  // Função para excluir uma compra
  const handleExcluirCompra = async () => {
    if (!compraSelecionada) return; // Verifica se há uma compra selecionada

    try {
      const response = await fetch(
        `http://localhost:3000/compras/${compraSelecionada._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Compra excluída com sucesso!");
        setMostrarModal(false);
        buscarCompras(); // Atualiza a lista de compras
      } else {
        alert("Erro ao excluir a compra.");
      }
    } catch (error) {
      console.error("Erro ao excluir compra:", error);
    }
  };

  // Função para editar uma compra (redirecionar para a tela de edição)
  const handleEditarCompra = () => {
    if (compraSelecionada) {
      navigate(`/list/edit/${compraSelecionada._id}`);
    }
  };

  return (
    <div className="all-list-section">
      <div className="list">
        <h1 id="h1-listaa">Lista de Compras</h1>
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>Preço</th>
              <th>Loja</th>
            </tr>
          </thead>
          <tbody>
            {compras && compras.length > 0 ? (
              compras.map((compra) => (
                <tr key={compra._id} onClick={() => handleCompraClick(compra)}>
                  <td>{compra.categoria}</td>
                  <td>{compra.descricao}</td>
                  <td>{new Date(compra.dataCompra).toLocaleDateString()}</td>
                  <td>R$ {compra.valor?.toFixed(2)}</td>{" "}
                  {/* Usando operador opcional */}
                  <td>{compra.loja}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Nenhuma compra encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para editar/excluir compra */}
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 id="title-modal">Opções</h2>
            <p id="subtitle-modal">O que você deseja fazer com esta compra?</p>
           
            <button id="btn-excluir" onClick={handleExcluirCompra}>
              Excluir
            </button>
            <button id="btn-list" onClick={() => setMostrarModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaCompras;
