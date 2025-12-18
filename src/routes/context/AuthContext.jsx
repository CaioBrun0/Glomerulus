import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Criar o Contexto
const AuthContext = createContext(null);

// 2. Helper para descodificar o JWT
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

// Helper para carregar o payload persistente
const loadState = () => {
    const payloadJson = localStorage.getItem("user_payload");
    if (!payloadJson) return null;
    
    try {
        const decoded = JSON.parse(payloadJson);
        // Verifica a expiração (exp está em segundos no JWT)
        if (decoded && decoded.exp * 1000 > Date.now()) {
            return decoded;
        }
        localStorage.removeItem("user_payload");
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
    isAdmin: false, // Adicionado para facilitar a verificação
  });

  // 4. Efeito para verificar o estado no localStorage (CORRIGIDO)
  useEffect(() => {
    const savedUser = loadState(); // A variável aqui se chama 'savedUser'
    
    if (savedUser) {
      setAuthStatus({
        isLoading: false,
        isAuthenticated: true,
        userType: savedUser.user_type_id, // Usando 'savedUser' em vez de 'decoded'
        userName: savedUser.name,        // Usando 'savedUser' em vez de 'decoded'
        isAdmin: savedUser.is_admin || savedUser.user_type_id === 2,
      });
    } else {
      setAuthStatus({ 
        isLoading: false, 
        isAuthenticated: false, 
        userType: null, 
        userName: null, 
        isAdmin: false 
      });
    }
  }, []);

  // 5. Função para o Login
  const login = (token) => {
    const decoded = decodeJwt(token); // Aqui a variável se chama 'decoded'
    if (decoded) {
      localStorage.setItem("user_payload", JSON.stringify(decoded));
      setAuthStatus({
        isLoading: false,
        isAuthenticated: true,
        userType: decoded.user_type_id,
        userName: decoded.name,
        isAdmin: decoded.is_admin || decoded.user_type_id === 2,
      });
    }
  };

  // 6. Função para o Logout
  const logout = () => {
    localStorage.removeItem("user_payload"); 
    setAuthStatus({
      isLoading: false,
      isAuthenticated: false,
      userType: null,
      userName: null,
      isAdmin: false,
    });
  };

  const value = { ...authStatus, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 7. Hook customizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}