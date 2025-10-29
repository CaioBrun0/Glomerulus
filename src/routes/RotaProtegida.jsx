import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx"; // <--- IMPORTAR O HOOK

function RotaProtegida({ tipoNecessario, children }) {
  const { isLoading, isAuthenticated, userType } = useAuth(); // <--- LER DO CONTEXTO
  const location = useLocation();

  // 1. Enquanto o AuthProvider está verificando, não mostre nada
  if (isLoading) {
    return null; // ou <Spinner />
  }

  const isAuthorized = (userType === tipoNecessario);

  // 2. Caso 1: Autenticado e Autorizado
  if (isAuthenticated && isAuthorized) {
    return children;
  }

  // 3. Caso 2: Não Autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // 4. Caso 3: Autenticado, mas Não Autorizado (o seu problema)
  // Redireciona para a homepage correta do usuário
  if (userType === 1) {
    return <Navigate to="/HomePage" replace />;
  }

  if (userType === 2) {
    return <Navigate to="/HomePageAdmin" replace />;
  }

  // Fallback (ex: logado mas sem tipo?)
  return <Navigate to="/" replace />;
}

export default RotaProtegida;