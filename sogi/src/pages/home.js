// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import "moment/locale/pt-br";
import {
  FileText,
  AlertTriangle,
  FileX,
  DatabaseZap,
  Sun,
  Moon,
  LogOut,        // <-- ícone de sair
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- para redirecionar

import "../assets/css/dashboard.css";
import StatsCard from "../components/StatsCard";
import ContractCard from "../components/ContractCard";
import FiltersBar from "../components/FiltersBar";
import ChartsPanel from "../components/ChartsPanel";

import contractService from "../services/contractsService";
import statusService from "../services/statusContractService";
import { logout as userLogout } from "../services/userService"; // <-- limpa token/header
import { setAuthToken } from "../services/http";               // (caso precise limpar também)

moment.locale("pt-br");

export default function Home() {
  const navigate = useNavigate();

  // tema
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // data e carregamento
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [contracts, setContracts] = useState([]);
  const [statusList, setStatusList] = useState([]); // [{_id, nome}]

  useEffect(() => {
    (async () => {
      try {
        const [cts, sts] = await Promise.all([
          contractService.list(),  // GET /api/contracts
          statusService.list(),    // GET /api/status-contract
        ]);

        const statusArr = sts?.docs || sts || [];
        setStatusList(statusArr);

        const statusById = new Map(statusArr.map(s => [String(s._id), s.nome]));
        const rawContracts = cts?.docs || cts || [];

        const mapped = rawContracts.map(c => ({
          ...c,
          empresa: c.nome,
          dataVencimento: c.vencimento,
          statusNome: statusById.get(String(c.status)) || "—",
          maquinas: (c.machine || []).map(txt => ({ display: txt })),
          localizacao: c.localizacao || "Não informado",
        }));

        setContracts(mapped);
      } catch (err) {
        console.error("Erro ao carregar contratos/status:", err);
        setContracts([]);
        setStatusList([]);
      }
    })();
  }, []);

  // filtros
  const [q, setQ] = useState("");
  const [fCoord, setFCoord] = useState("");
  const [fContrato, setFContrato] = useState("");
  const [fMaquina, setFMaquina] = useState("");

  const filtered = useMemo(() => {
    return contracts.filter(c => {
      const txt = JSON.stringify(c).toLowerCase();
      const okQ = !q || txt.includes(q.toLowerCase());
      const okStatus = !fContrato || c.statusNome === fContrato;
      const okCoord = !fCoord || String(c.coordenador) === fCoord;
      return okQ && okStatus && okCoord;
    });
  }, [contracts, q, fContrato, fCoord]);

  // resumo
  const resumo = useMemo(() => {
    let total = contracts.length, vencendo = 0, vencidos = 0, ativas = 0, totalM = 0;
    contracts.forEach(c => {
      const arr = c.maquinas || [];
      totalM += arr.length;
      if (c.dataVencimento) {
        const d = moment(c.dataVencimento).diff(moment(selectedDate), "days");
        if (d < 0) vencidos++;
        else if (d <= 30) vencendo++;
      }
    });
    return { total, vencendo, vencidos, ativas, totalM };
  }, [contracts, selectedDate]);

  const clearFilters = () => {
    setQ("");
    setFCoord("");
    setFContrato("");
    setFMaquina("");
  };

  // ====== LOGOUT ======
  const handleLogout = () => {
    try {
      userLogout();                  // limpa Authorization no axios
      localStorage.removeItem("token");
      setAuthToken(null);            // redundante, garante limpar
    } finally {
      navigate("/", { replace: true }); // volta pra tela de login
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div>
          <h1>BSM CONTRATOS</h1>
          <small>SISTEMA OPERACIONAL INTEGRADO</small>
        </div>

        <div className="header-right">
          <input
            type="date"
            className="input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            title="Selecionar data de referência"
          />

          <button
            className="iconbtn"
            onClick={() => setIsDark(v => !v)}
            title="Alternar tema"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? "Claro" : "Escuro"}
          </button>

          {/* Botão de Sair */}
          <button
            className="iconbtn"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </header>

      {/* Resumo */}
      <section className="grid-4">
        <StatsCard title="Total de Contratos" value={resumo.total} Icon={FileText} accent="#3b82f6" />
        <StatsCard title="Contratos Vencendo" value={resumo.vencendo} Icon={AlertTriangle} accent="#f59e0b" />
        <StatsCard title="Contratos Vencidos" value={resumo.vencidos} Icon={FileX} accent="#ef4444" />
        <StatsCard title="Máquinas Ativas" value={`${resumo.ativas}/${resumo.totalM}`} Icon={DatabaseZap} accent="#10b981" />
      </section>

      {/* Filtros */}
      <FiltersBar
        q={q} setQ={setQ}
        fCoord={fCoord} setFCoord={setFCoord}
        fContrato={fContrato} setFContrato={setFContrato}
        fMaquina={fMaquina} setFMaquina={setFMaquina}
        coords={[]}
        contratos={(statusList || []).map(s => s.nome)}
        maquinas={[]}
        onClear={clearFilters}
        headerLeft={
          <>
            <p style={{ fontWeight: 700 }}>
              Exibindo dados de: {moment(selectedDate).format("LL")}
            </p>
            <p className="subtitle">
              Mostrando {filtered.length} de {contracts.length} contrato(s).
            </p>
          </>
        }
      />

      {/* Cards + Charts */}
      <div className="row">
        <div className="cards-grid">
          {filtered.length === 0 ? (
            <div className="empty">
              <p>Nenhum contrato encontrado. Ajuste os filtros.</p>
            </div>
          ) : (
            filtered.map(c => (
              <ContractCard
                key={c._id || c.id}
                contract={c}
                selectedDate={selectedDate}
              />
            ))
          )}
        </div>

        <ChartsPanel
          contracts={filtered.map(c => ({ statusContrato: c.statusNome }))}
          onClickContrato={setFContrato}
          onClickMachine={() => {}}
        />
      </div>
    </div>
  );
}
