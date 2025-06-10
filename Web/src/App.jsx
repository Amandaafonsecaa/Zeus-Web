/* eslint-disable no-unused-vars */
import React from "react";
import ListSlice from "./components/listslice/listslice.jsx";
import Navbar from "./components/navbar/Navbar";
import AddPursaches from "./pages/addpursaches.jsx";
import Painel from "./pages/painel.jsx";
import About from "./pages/about.jsx";
{
  /*import EditarCompra from "./pages/editarCompra.jsx";*/
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListCompras from "./pages/list.jsx";
import ErrorBoundary from "./pages/ErrorBoundary.js";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="painel">
        <Navbar />
        <ErrorBoundary>
          <Routes>
            <Route exact path="/" element={<Painel />} />
            <Route exact path="/add" element={<AddPursaches />} />
            <Route exact path="/list" element={<ListCompras />} />
            {/*<Route exact path="/list/edit/:id" element={<EditarCompra />} />*/}
            <Route exact path="/about" element={<About />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}

export default App;
