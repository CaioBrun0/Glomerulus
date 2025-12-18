import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

function RotaProtegida({ tipoNecessario, children }) {
  // CORREÇÃO: Adicionamos o 'isAdmin' aqui dentro das chaves
  const { isLoading, isAuthenticated, userType, isAdmin } = useAuth(); 
  const location = useLocation();

  // 1. Enquanto o AuthProvider está verificando o localStorage, não renderiza nada
  if (isLoading) {
    return null; 
  }

  // 2. Lógica de Autorização:
  // O usuário está autorizado se:
  // - Ele for explicitamente um Admin (isAdmin === true)
  // - OU o tipo dele for igual ao tipo necessário para a rota
  const isAuthorized = isAdmin || (userType === tipoNecessario);

  // 3. Caso: Autenticado e Autorizado
  if (isAuthenticated && isAuthorized) {
    return children;
  }

  // 4. Caso: Não Autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // 5. Caso: Autenticado, mas Não Autorizado
  // Redireciona para a homepage correta de acordo com o perfil
  if (userType === 2 || isAdmin) {
    return <Navigate to="/HomePageAdmin" replace />;
  }

  if (userType === 1) {
    return <Navigate to="/HomePage" replace />;
  }

  // Fallback de segurança
  return <Navigate to="/" replace />;
}

export default RotaProtegida;