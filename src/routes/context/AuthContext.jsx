import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Criar o Contexto
const AuthContext = createContext(null);

// 2. Helper para descodificar o JWT (permanece igual)
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

// NOVO HELPER: Para carregar o payload persistente (não o token)
const loadState = () => {
    const payloadJson = localStorage.getItem("user_payload");
    if (!payloadJson) return null;
    
    try {
        const decoded = JSON.parse(payloadJson);
        // Verifica a expiração salva no payload
        if (decoded && decoded.exp * 1000 > Date.now()) {
            return decoded;
        }
        localStorage.removeItem("user_payload"); // Limpa se expirou
        return null;
    } catch (e) {
        localStorage.removeItem("user_payload");
        return null;
    }
};

// 3. Criar o Provedor
export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState({
    isLoading: true,
    isAuthenticated: false,
    userType: null,
    userName: null,
  });

  // 4. Efeito para verificar o estado no localStorage
  useEffect(() => {
    const decoded = loadState(); // Lê o payload persistente
    
    if (decoded) {
      setAuthStatus({
        isLoading: false,
        isAuthenticated: true,
        userType: decoded.user_type_id,
        userName: decoded.name,
      });
    } else {
      setAuthStatus({ isLoading: false, isAuthenticated: false, userType: null, userName: null });
    }
  }, []);

  // 5. Função para o Login/Register usar
  const login = (token) => {
    const decoded = decodeJwt(token);
    if (decoded) {
      // **MUDANÇA CRÍTICA:** Armazena APENAS o payload, NÃO o token
      localStorage.setItem("user_payload", JSON.stringify(decoded));
      setAuthStatus({
        isLoading: false,
        isAuthenticated: true,
        userType: decoded.user_type_id,
        userName: decoded.name,
      });
    }
  };

  // 6. Função para o Logout usar
  const logout = () => {
    // **MUDANÇA CRÍTICA:** Remove APENAS o payload persistente
    localStorage.removeItem("user_payload"); 
    setAuthStatus({
      isLoading: false,
      isAuthenticated: false,
      userType: null,
      userName: null,
    });
  };

  const value = { ...authStatus, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 7. Hook customizado (permanece igual)
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}