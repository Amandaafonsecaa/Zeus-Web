/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./listslice.css";

/* const chamando o back */
const ListaCompras = () => {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const buscarCompras = async () => {
      try {
        const response = await fetch("http://localhost:3000/compras");
        const data = await response.json();
        setCompras(data);
      } catch (error) {
        console.error("Erro ao buscar compras:", error);
      }
    };

    buscarCompras();
  }, []);

  console.log("Componente ListaCompras renderizado");
  console.log("Compras:", compras);

  return (
    <div className="listslicesection">
      <h2 id="h1-list">Lista de Compras</h2>
      <div className="list">
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
            {compras.slice(0, 8).map(
              (
                compra // Exibe apenas as primeiras 8 compras
              ) => (
                <tr key={compra._id}>
                  <td>{compra.categoria}</td>
                  <td>{compra.descricao}</td>
                  <td>{new Date(compra.dataCompra).toLocaleDateString()}</td>
                  <td>R$ {compra.valor.toFixed(2)}</td>
                  <td>{compra.loja}</td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {compras.length > 8 && ( // Mostra o botão apenas se houver mais de 8 compras
          <div className="ver-mais-container">
            <button
              className="ver-mais-btn"
              onClick={() => {
                window.location.href = "/list";
              }}
            >
              Ver Mais
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaCompras;
