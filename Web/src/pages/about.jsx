// eslint-disable-next-line no-unused-vars
import React from "react";
import BemVindoImg from "../assets/img/wellcome-sec.png";
import Flash from "../assets/img/flash.png";
import Cellphone from "../assets/img/cellphone.png";
import Graphic from "../assets/img/graphic.png";
import "./about.css";

const About = () => {
  return (
    <div className="about">
      <div className="bemvindo-sec">
        <div className="bemvindo-img">
          <img src={BemVindoImg} alt="" />
        </div>
        <div className="bemvindo-txt">
          <h1 className="bemvindo-title">
            O jeito mais <strong>fácil</strong> de acompanhar os gastos do seu
            pet!
          </h1>
          <p>
            Está difícil controlar quanto você gasta com seu filho? O Zeus te
            ajuda a registrar rapidamente suas compras e visualizar todos os
            dados em um painel completo no computador e celular.
          </p>
        </div>
      </div>
      <div className="vantagens-sec">
        <h2 id="title-vantagens">Por quê usar Zeus?</h2>
        <div className="cards-sec">
          <div className="card-about">
            <img className="icon-vantagens" src={Flash} alt="" />
            <p id="tema-card">Rápido e Simples</p>
            <p>Registre um novo gasto em segundos, sem complicação.</p>
          </div>
          <div className="card-about">
            <img src={Graphic} alt="" />
            <p id="tema-card"> Dashboard Completo</p>
            <p> Acompanhe gráficos detalhados dos seus gastos.</p>
          </div>
          <div className="card-about">
            <img src={Cellphone} alt="" />
            <p id="tema-card"> Acesso em Qualquer Lugar</p>
            <p>
              {" "}
              Seus dados ficam salvos na nuvem e acessíveis de qualquer
              dispositivo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
