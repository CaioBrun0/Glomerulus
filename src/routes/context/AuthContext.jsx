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

// Função auxiliar para obter claims (tipo/nome/exp) da sessão
function getAuthClaimsFromSession() {
    // Tenta obter as claims salvas na sessão (limpa ao fechar a aba/navegador)
    const claimsStr = sessionStorage.getItem("auth_claims");
    if (claimsStr) {
        try {
            const claims = JSON.parse(claimsStr);
            // Verifica se o tempo de expiração do JWT (exp) ainda é válido
            // claims.exp é em segundos, Date.now() é em milissegundos
            if (claims.exp * 1000 > Date.now()) {
                return claims;
            } else {
                sessionStorage.removeItem("auth_claims"); // Limpa expirado
                return null;
            }
        } catch(e) {
            sessionStorage.removeItem("auth_claims");
            return null;
        }
    }
    return null;
}


// 3. Criar o Provedor
export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState({
    isLoading: true, // Começa carregando
    isAuthenticated: false,
    userType: null,
    userName: null,
  });

  // 4. Efeito para verificar o status no sessionStorage QUANDO A APP CARREGA
  useEffect(() => {
    // LER CLAIMS APENAS DO sessionStorage
    const claims = getAuthClaimsFromSession();
    
    // Garante que o localStorage é limpo (código obsoleto)
    localStorage.removeItem("access_token");

    if (claims) {
      setAuthStatus({
        isLoading: false,
        isAuthenticated: true,
        userType: claims.userType, 
        userName: claims.userName, 
      });
    } else {
      setAuthStatus({ isLoading: false, isAuthenticated: false, userType: null, userName: null });
    }
  }, []); 

  // 5. Função para o Login/Register usar
  const login = (token) => {
    const decoded = decodeJwt(token);
    if (decoded) {
      // NUNCA MAIS SALVA O TOKEN. SALVAR APENAS OS CLAIMS.
      
      const claimsToStore = {
        // user_type_id (2 para Admin, 1 para Convencional)
        userType: decoded.user_type_id,
        // name (Nome completo)
        userName: decoded.name,
        // exp (Timestamp de expiração do JWT)
        exp: decoded.exp
      };

      sessionStorage.setItem("auth_claims", JSON.stringify(claimsToStore));
      
      // Remove token obsoleto
      localStorage.removeItem("access_token"); 

      setAuthStatus({
        isLoading: false,
        isAuthenticated: true,
        userType: claimsToStore.userType,
        userName: claimsToStore.userName,
      });
    }
  };

  // 6. Função para o Logout usar
  const logout = () => {
    // Limpar storage
    sessionStorage.removeItem("auth_claims");
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