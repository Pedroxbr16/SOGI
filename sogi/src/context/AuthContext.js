// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginService } from "../services/userService";
import { createSignupRequest } from "../services/solicitacaoService";
import { setAuthToken } from "../services/http";

const LS_TOKEN = "sogi:token";
const LS_USER  = "sogi:user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem(LS_TOKEN);
      const u = localStorage.getItem(LS_USER);
      if (t && u) {
        setToken(t);
        setUser(JSON.parse(u));
        setAuthToken(t);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) { localStorage.setItem(LS_TOKEN, token); setAuthToken(token); }
    else { localStorage.removeItem(LS_TOKEN); setAuthToken(null); }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  }, [user]);

  const signIn = async ({ email, senha }) => {
    const { token: tk, user: usr } = await loginService({ email, senha });
    setToken(tk);
    setUser(usr);
    return usr;
  };

  // NOVO: apenas cria a solicitação e retorna o ID
  const signUp = async ({ cpf, nome, cargo, email, senha }) => {
    const resp = await createSignupRequest({ cpf, nome, cargo, email, senha });
    // resp: { _id, status: "pendente" }
    return resp;
  };

  const signOut = () => { setToken(null); setUser(null); };

  const value = useMemo(
    () => ({ user, token, loading, signed: !!token, signIn, signUp, signOut }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider />");
  return ctx;
};
