import React from "react";
import "../assets/css/components/sidebar.css";

export default function Sidebar({ open = false, onClose = () => {} }) {
  return (
    <>
      {/* Overlay clicável */}
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <aside
        className={`sidebar-drawer ${open ? "open" : ""}`}
        role="navigation"
        aria-label="Menu lateral"
      >
        <div className="sidebar-header">
          <button className="burger" onClick={onClose} aria-label="Fechar menu">
            ✕
          </button>
          <div className="logo">SOGI</div>
        </div>

        <nav className="sidebar-nav">
          {/* marque a rota ativa adicionando a classe "active" no .nav-item */}
          <a className="nav-item active" href="#/">
            <span className="ico">🏠</span> Início
          </a>
          <a className="nav-item" href="#/contracts">
            <span className="ico">📄</span> Contratos
          </a>
          <a className="nav-item" href="#/status">
            <span className="ico">⟳</span> Status de Contrato
          </a>
          <a className="nav-item" href="#/requests">
            <span className="ico">📝</span> Solicitações
          </a>
          <a className="nav-item" href="#/cargos">
            <span className="ico">🏷️</span> Cargos
          </a>
          <a className="nav-item" href="#/setores">
            <span className="ico">📦</span> Setores
          </a>
          <a className="nav-item" href="#/users">
            <span className="ico">👥</span> Usuários
          </a>
          <a className="nav-item" href="#/audit">
            <span className="ico">🗂️</span> Auditoria
          </a>
        </nav>

        <div className="sidebar-foot">
          <a className="nav-item" href="#/profile">
            <span className="ico">👤</span> Meu Perfil
          </a>
        </div>
      </aside>
    </>
  );
}
