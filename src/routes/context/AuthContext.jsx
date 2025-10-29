import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Criar o Contexto
const AuthContext = createContext(null);

// 2. Helper para descodificar o JWT
// (Esta função simples lê o payload de um JWT sem verificar a assinatura)
function decodeJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erro ao descodificar JWT:", e);
    return null;
  }
}

// 3. Criar o Provedor
export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState({
    isLoading: true, // Começa carregando
    isAuthenticated: false,
    userType: null,
    userName: null,
    // adicione outros campos que vierem do token (ex: email)
  });

  // 4. Efeito para verificar o token no localStorage QUANDO A APP CARREGA
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      setAuthStatus({ isLoading: false, isAuthenticated: false, userType: null, userName: null });
      return;
    }

    const decoded = decodeJwt(token);

    if (decoded && decoded.exp * 1000 > Date.now()) {
      // Token existe e é válido
      setAuthStatus({
        isLoading: false,
        isAuthenticated: true,
        // ATENÇÃO: ajuste as chaves ("user_type_id", "name")
        // para corresponder EXATAMENTE ao payload do seu JWT
        userType: decoded.user_type_id, // Baseado no seu auth.py, o ID do tipo
        userName: decoded.name, // Baseado nas suas imagens
      });
    } else {
      // Token inválido ou expirado
      localStorage.removeItem("access_token");
      setAuthStatus({ isLoading: false, isAuthenticated: false, userType: null, userName: null });
    }
  }, []); // O array vazio [] garante que isso rode SÓ UMA VEZ

  // 5. Função para o Login/Register usar
  const login = (token) => {
    const decoded = decodeJwt(token);
    if (decoded) {
      localStorage.setItem("access_token", token);
      setAuthStatus({
        isLoading: false,
        isAuthenticated: true,
        userType: decoded.user_type_id, // Ajuste esta chave
        userName: decoded.name, // Ajuste esta chave
      });
    }
  };

  // 6. Função para o Logout usar
  const logout = () => {
    localStorage.removeItem("access_token");
    setAuthStatus({
      isLoading: false,
      isAuthenticated: false,
      userType: null,
      userName: null,
    });
    // O componente de Logout deve tratar do redirecionamento para "/"
  };

  const value = { ...authStatus, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 7. Hook customizado (igual ao de antes)
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}