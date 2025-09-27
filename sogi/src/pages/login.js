import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCargoOptions } from "../services/cargosService"; 
import "../assets/css/pages/login.css";

export default function App() {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const isSignup = mode === "signup";

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // cadastro
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");      // vai guardar o _id do cargo
  const [emailCad, setEmailCad] = useState("");
  const [senhaCad, setSenhaCad] = useState("");
  const [confirmaCad, setConfirmaCad] = useState("");

  // UI
  const [erro, setErro] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // CARGOS
  const [cargoOpts, setCargoOpts] = useState([]); // [{value:_id, label:nome}]
  const [loadingCargos, setLoadingCargos] = useState(false);
  const [cargoErr, setCargoErr] = useState("");

  useEffect(() => {
    // carrega opções do select ao entrar no modo signup
    if (!isSignup) return;
    let mounted = true;

    (async () => {
      try {
        setCargoErr("");
        setLoadingCargos(true);
        const opts = await getCargoOptions();
        if (mounted) setCargoOpts(opts);
      } catch (e) {
        if (mounted) setCargoErr("Não foi possível carregar os cargos.");
        console.error(e);
      } finally {
        if (mounted) setLoadingCargos(false);
      }
    })();

    return () => { mounted = false; };
  }, [isSignup]);

  const onlyDigits = (v) => (v || "").replace(/\D+/g, "");

  const resetSignupForm = () => {
    setCpf(""); setNome(""); setCargo("");
    setEmailCad(""); setSenhaCad(""); setConfirmaCad("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(""); setOkMsg(""); setSubmitting(true);

    try {
      if (isSignup) {
        if (senhaCad !== confirmaCad) { setErro("As senhas não coincidem."); return; }
        if (!cargo) { setErro("Selecione um cargo."); return; }

        const resp = await signUp({
          cpf: onlyDigits(cpf),
          nome,
          cargo,                 // aqui vai o _id do cargo selecionado
          email: emailCad,
          senha: senhaCad,
        });

        setOkMsg(
          `Solicitação enviada! Protocolo: ${resp?._id || "—"}. ` +
          "Aguarde aprovação do administrador."
        );
        resetSignupForm();
        setMode("login");
      } else {
        await signIn({ email, senha: password });
        setOkMsg("Login realizado!");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Erro inesperado";
      setErro(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="bg" />
      <main className="card" role="region" aria-label="Login SOGI">
        <h1 className="title">SOGI</h1>
        <p className="subtitle" style={{ textAlign: "center", color: "#b4b4b4ff" }}>
          Sistema Operacional De Gráfico Integrado
        </p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {isSignup ? (
            <>
              <label className="label" htmlFor="cpf">cpf</label>
              <input
                id="cpf"
                className="input"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />

              <label className="label" htmlFor="nome">nome</label>
              <input
                id="nome"
                className="input"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <label className="label" htmlFor="cargo">cargo</label>
              <div className="select-wrap">
                <select
                  id="cargo"
                  className="input select"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  required
                  disabled={loadingCargos || cargoOpts.length === 0}
                >
                  <option value="" disabled>
                    {loadingCargos ? "Carregando cargos..." : "Selecione…"}
                  </option>

                  {/* >>> opções vindas do backend <<< */}
                  {cargoOpts.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {cargoErr && <p className="error" role="alert">{cargoErr}</p>}

              <label className="label" htmlFor="emailCad">e-mail</label>
              <input
                id="emailCad"
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={emailCad}
                onChange={(e) => setEmailCad(e.target.value)}
                required
                autoComplete="email"
              />

              <label className="label" htmlFor="senhaCad">senha</label>
              <input
                id="senhaCad"
                type="password"
                className="input"
                placeholder="••••••••"
                value={senhaCad}
                onChange={(e) => setSenhaCad(e.target.value)}
                required
                autoComplete="new-password"
                minLength={8}
              />

              <label className="label" htmlFor="confirmaCad">confirme sua senha</label>
              <input
                id="confirmaCad"
                type="password"
                className="input"
                placeholder="••••••••"
                value={confirmaCad}
                onChange={(e) => setConfirmaCad(e.target.value)}
                required
                autoComplete="new-password"
                minLength={8}
              />

              {!!erro && <p className="error" role="alert">{erro}</p>}
              {!!okMsg && <p className="ok" aria-live="polite">{okMsg}</p>}

              <button className="btn" type="submit" disabled={submitting}>
                {submitting ? "Enviando..." : "Solicitar conta"}
              </button>

              <button
                type="button"
                className="link"
                onClick={() => { setMode("login"); setErro(""); setOkMsg(""); }}
              >
                Já tem conta? Entre aqui
              </button>
            </>
          ) : (
            <>
              <label className="label" htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="seu@email.com"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="label" htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
              />

              {!!erro && <p className="error" role="alert">{erro}</p>}
              {!!okMsg && <p className="ok" aria-live="polite">{okMsg}</p>}

              <button className="btn" type="submit" disabled={submitting}>
                {submitting ? "Entrando..." : "Entrar"}
              </button>

              <button
                className="link"
                type="button"
                onClick={() => { setMode("signup"); setErro(""); setOkMsg(""); }}
              >
                Solicitar Conta
              </button>
            </>
          )}
        </form>
      </main>
    </div>
  );
}
