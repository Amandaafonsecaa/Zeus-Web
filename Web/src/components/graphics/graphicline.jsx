/* eslint-disable no-unused-vars */
import React, { PureComponent } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./graphicline.css";

class GraphicLine extends PureComponent {
  state = {
    dados: [],
  };

  meses = {
    "01": "Janeiro",
    "02": "Fevereiro",
    "03": "Março",
    "04": "Abril",
    "05": "Maio",
    "06": "Junho",
    "07": "Julho",
    "08": "Agosto",
    "09": "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro",
  };

  componentDidMount() {
    this.buscarDados();
  }

  buscarDados = async () => {
    try {
      console.log("Fazendo requisição para o backend...");
      const response = await fetch("http://localhost:3000/compras");
      console.log("Resposta recebida:", response);

      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }

      const dados = await response.json();
      console.log("Dados recebidos:", dados);

      const gastosPorMes = this.agruparGastosPorMes(dados);

      console.log("Gastos por mês:", gastosPorMes);
      this.setState({ dados: gastosPorMes });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  agruparGastosPorMes = (compras) => {
    const gastosPorMes = {};

    compras.forEach((compra) => {
      const data = new Date(compra.dataCompra);
      const mesAno = `${data.getFullYear()}-${String(
        data.getMonth() + 1
      ).padStart(2, "0")}`;
      const mesNumero = String(data.getMonth() + 1).padStart(2, "0"); // Número do mês
      const mesNome = this.meses[mesNumero]; // Nome do mês

      if (!gastosPorMes[mesAno]) {
        gastosPorMes[mesAno] = {
          mes: mesNome, // Nome do mês
          mesNumero: mesNumero, // Número do mês para ordenação
          total: 0,
        };
      }

      gastosPorMes[mesAno].total += compra.valor;
    });

    // Converte o objeto em um array e ordena por mês
    return Object.values(gastosPorMes).sort(
      (a, b) => a.mesNumero - b.mesNumero
    );
  };

  render() {
    const { dados } = this.state;
    console.log("Dados no estado:", dados);

    return (
      <div className="card">
        <div style={{ width: "50%", height: 250 }}>
          <h2>Gastos por Mês</h2>
          <ResponsiveContainer>
            <ComposedChart
              data={dados}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total"
                barSize={20}
                fill="#413ea0"
                name="Total Gasto (R$)"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#ff7300"
                name="Linha de Total"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

export default GraphicLine;
