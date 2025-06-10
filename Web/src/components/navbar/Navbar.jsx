/* eslint-disable no-unused-vars */
import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="navbar-logo">
          <a href="/">
            <img src="\src\assets\img\zeuslogo.svg" alt="" />
          </a>
        </div>
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/add">Adicionar</a>
          <a href="/list">Listar</a>
          <a href="/about">Sobre</a>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Navbar;
