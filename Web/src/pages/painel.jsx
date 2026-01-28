/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./painel.css";
import GraphicLine from "../components/graphics/graphicline";
import ListSlice from "../components/listslice/listslice";

// Função para calcular gastos do dia
const calcularGastosDia = (compras) => {
  if (!compras || compras.length === 0) return "0.00"; // Verifica se há compras

  const hoje = new Date();
  const gastoDia = compras
    .filter((compra) => {
      const dataCompra = new Date(compra.dataCompra);
      return (
        dataCompra.getDate() === hoje.getDate() &&
        dataCompra.getMonth() === hoje.getMonth() &&
        dataCompra.getFullYear() === hoje.getFullYear()
      );
    })
    .reduce((total, compra) => total + (compra.valor || 0), 0); // Soma os valores

  return gastoDia.toFixed(2); // Retorna o total com 2 casas decimais
};

// Função para calcular gastos da semana
const calcularGastosDaSemana = (compras) => {
  if (!compras || compras.length === 0) return "0.00"; // Verifica se há compras

  const hoje = new Date();
  const inicioDaSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay())); // Domingo da semana atual
  const fimDaSemana = new Date(hoje.setDate(hoje.getDate() + 6)); // Sábado da semana atual

  const gastosDaSemana = compras
    .filter((compra) => {
      const dataCompra = new Date(compra.dataCompra);
      return dataCompra >= inicioDaSemana && dataCompra <= fimDaSemana;
    })
    .reduce((total, compra) => total + (compra.valor || 0), 0);

  return gastosDaSemana.toFixed(2);
};

// Função para calcular gastos do mês
const calcularGastosDoMes = (compras) => {
  if (!compras || compras.length === 0) return "0.00"; // Verifica se há compras

  const hoje = new Date();
  const gastosDoMes = compras
    .filter((compra) => {
      const dataCompra = new Date(compra.dataCompra);
      return (
        dataCompra.getMonth() === hoje.getMonth() &&
        dataCompra.getFullYear() === hoje.getFullYear()
      );
    })
    .reduce((total, compra) => total + (compra.valor || 0), 0);

  return gastosDoMes.toFixed(2);
};

// Função para calcular gastos do ano
const calcularGastosAno = (compras) => {
  if (!compras || compras.length === 0) return "0.00"; // Verifica se há compras

  const hoje = new Date();
  const gastosAno = compras
    .filter((compra) => {
      const dataCompra = new Date(compra.dataCompra);
      return dataCompra.getFullYear() === hoje.getFullYear();
    })
    .reduce((total, compra) => total + (compra.valor || 0), 0);

  return gastosAno.toFixed(2);
};

const Painel = () => {
  const [compras, setCompras] = useState([]);

  // Função para buscar as compras do backend
  useEffect(() => {
    const buscarCompras = async () => {
      try {
        console.log("Buscando compras...");
        const response = await fetch("http://localhost:3000/compras");
        if (!response.ok) {
          throw new Error("Erro ao buscar compras");
        }
        const data = await response.json();
        console.log("Dados recebidos:", data); // Verifique se os dados estão chegando
        setCompras(data);
      } catch (error) {
        console.error("Erro ao buscar compras:", error);
      }
    };

    buscarCompras();
  }, []);

  return (
    <div className="painel-screen">
      <div className="painel-principal">
        <div className="painel-title">
          <h2>Painel</h2>
        </div>
        <div className="painel-conjunto-cards">
          <div className="painel-cards">
            <p id="title-card">Hoje</p>
            <p id="price-card">R$ {calcularGastosDia(compras)}</p>
          </div>
          <div className="painel-cards">
            <p id="title-card">Esta semana</p>
            <p id="price-card">R$ {calcularGastosDaSemana(compras)}</p>
          </div>
          <div className="painel-cards">
            <p id="title-card">Este mês</p>
            <p id="price-card">R$ {calcularGastosDoMes(compras)}</p>
          </div>
          <div className="painel-cards">
            <p id="title-card">Este ano</p>
            <p id="price-card">R$ {calcularGastosAno(compras)}</p>
          </div>
        </div>
      </div>
      <div className="painel-secundary">
        <div className="title-painel-secundary">
          <h3>Resumo dos gastos</h3>
          <div className="grafico-container">
            <GraphicLine />
          </div>
        </div>
      </div>
      <div className="listslice">
        <ListSlice />
      </div>
    </div>
  );
};

export default Painel;
