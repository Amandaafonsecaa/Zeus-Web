/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./addpursaches.css";

const Add = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [store, setStore] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({});

  const validateAmount = (value) => {
    const regex = /^\d+(\.\d{1,2})?$/; // Aceita números com até duas casas decimais
    return regex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Verifica se todos os campos estão preenchidos
    if (!category) newErrors.category = "Por favor, selecione uma categoria.";
    if (!amount) newErrors.amount = "Por favor, insira um valor.";
    if (!store) newErrors.store = "Por favor, insira o nome da loja.";
    if (!description)
      newErrors.description = "Por favor, insira uma descrição.";
    if (!date) newErrors.date = "Por favor, insira uma data.";

    // Validação do campo "Amount"
    if (amount && !validateAmount(amount)) {
      newErrors.amount = "Insira um número.";
    }

    // Se houver erros, exibe-os e interrompe o envio
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Converte o valor do campo "amount" para número
    const amountNumber = parseFloat(amount);

    // Formata a data para o padrão YYYY-MM-DD
    const formattedDate = new Date(date).toISOString().split("T")[0];

    // Objeto com os dados do formulário (no formato esperado pelo backend)
    const formData = {
      categoria: category, // Nome esperado pelo backend
      descricao: description, // Nome esperado pelo backend
      dataCompra: formattedDate, // Nome e formato esperados pelo backend
      valor: amountNumber, // Nome esperado pelo backend
      loja: store, // Nome esperado pelo backend
    };

    console.log("Dados enviados:", formData); // Verifique os dados no console

    try {
      // Enviar os dados para o backend
      const response = await fetch("http://localhost:3000/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Verifica se a requisição foi bem-sucedida
      if (response.ok) {
        alert("Despesa adicionada com sucesso!");
        // Limpa o formulário após o envio
        setCategory("");
        setAmount("");
        setStore("");
        setDescription("");
        setDate("");
        setErrors({});
      } else {
        // Captura a mensagem de erro do backend
        const errorData = await response.json();
        alert(`Erro: ${errorData.message || "Dados inválidos"}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="addpursaches">
      <div className="add-title">
        <h2>Add Expense</h2>
      </div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-- Select Expense Type --</option>
              <option value="ração">Ração</option>
              <option value="saúde">Saúde</option>
              <option value="lazer">Lazer</option>
              <option value="roupas">Roupas</option>
              <option value="outros">Outras</option>
            </select>
            {errors.category && (
              <span className="error">{errors.category}</span>
            )}
          </div>

          <div className="inline-group">
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                type="text"
                id="amount"
                name="amount"
                placeholder="$00.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {errors.amount && <span className="error">{errors.amount}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="store">Store</label>
              <input
                type="text"
                id="store"
                name="store"
                placeholder="Store name"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                required
              />
              {errors.store && <span className="error">{errors.store}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Enter a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            {errors.date && <span className="error">{errors.date}</span>}
          </div>

          <div className="form-group">
            <button type="submit" id="btn-submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
